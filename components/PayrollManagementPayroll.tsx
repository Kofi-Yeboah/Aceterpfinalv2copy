import { useState } from "react";
import { Search, Download, ChevronDown, MoreVertical, Plus, CheckCircle2, Send, FileText, X, ArrowLeft } from "lucide-react";

const DEPARTMENTS = ["All Departments", "Engineering", "Sales", "Marketing", "Operations", "HR", "Finance"];

const PERIODS = [
  "January 2026", "February 2026", "March 2026", "April 2026", "May 2026", "June 2026",
  "July 2026", "August 2026", "September 2026", "October 2026", "November 2026", "December 2026"
];

export function PayrollManagementPayroll() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState<"current" | "past">("current");
  const [payrollGenerated, setPayrollGenerated] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPostPayrollModal, setShowPostPayrollModal] = useState(false);
  const [payrollDetails, setPayrollDetails] = useState<{
    year: string;
    month: string;
    payRate: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    year: "2024",
    month: "June",
    payRate: "",
  });

  const [postPayrollData, setPostPayrollData] = useState({
    period: "March 2026",
    rate: "",
    date: "",
    voucherNumber: "",
    salaryPayable: "",
    internationalStaffSalary: "",
    nationalStaffSalary: "",
    irs: "",
    ssf: "",
    pf: "",
    loan: "",
    otherDeduction: "",
  });

  const [payrollDataFetched, setPayrollDataFetched] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  // Detailed payroll components per employee
  const employeePayrollDetails: Record<string, {
    allowances: { name: string; amount: number }[];
    deductions: { name: string; amount: number }[];
  }> = {
    "1": {
      allowances: [
        { name: "Housing Allowance", amount: 500 },
        { name: "Transport Allowance", amount: 300 },
        { name: "Medical Allowance", amount: 200 },
        { name: "Utility Allowance", amount: 200 },
      ],
      deductions: [
        { name: "IRS (Tax)", amount: 425 },
        { name: "SSF (5.5%)", amount: 200 },
        { name: "Provident Fund", amount: 150 },
        { name: "Staff Loan", amount: 75 },
      ],
    },
    "2": {
      allowances: [
        { name: "Housing Allowance", amount: 600 },
        { name: "Transport Allowance", amount: 400 },
        { name: "Medical Allowance", amount: 250 },
        { name: "Commission Bonus", amount: 250 },
      ],
      deductions: [
        { name: "IRS (Tax)", amount: 360 },
        { name: "SSF (5.5%)", amount: 180 },
        { name: "Provident Fund", amount: 130 },
        { name: "Staff Loan", amount: 50 },
      ],
    },
    "3": {
      allowances: [
        { name: "Housing Allowance", amount: 400 },
        { name: "Transport Allowance", amount: 250 },
        { name: "Medical Allowance", amount: 150 },
        { name: "Internet Allowance", amount: 100 },
      ],
      deductions: [
        { name: "IRS (Tax)", amount: 340 },
        { name: "SSF (5.5%)", amount: 170 },
        { name: "Provident Fund", amount: 120 },
        { name: "Other Deduction", amount: 50 },
      ],
    },
    "4": {
      allowances: [
        { name: "Housing Allowance", amount: 450 },
        { name: "Transport Allowance", amount: 300 },
        { name: "Medical Allowance", amount: 200 },
        { name: "Responsibility Allowance", amount: 150 },
      ],
      deductions: [
        { name: "IRS (Tax)", amount: 375 },
        { name: "SSF (5.5%)", amount: 188 },
        { name: "Provident Fund", amount: 137 },
        { name: "Staff Loan", amount: 50 },
      ],
    },
    "5": {
      allowances: [
        { name: "Housing Allowance", amount: 350 },
        { name: "Transport Allowance", amount: 200 },
        { name: "Medical Allowance", amount: 150 },
        { name: "Utility Allowance", amount: 100 },
      ],
      deductions: [
        { name: "IRS (Tax)", amount: 325 },
        { name: "SSF (5.5%)", amount: 163 },
        { name: "Provident Fund", amount: 112 },
        { name: "Staff Loan", amount: 50 },
      ],
    },
    "6": {
      allowances: [
        { name: "Housing Allowance", amount: 300 },
        { name: "Transport Allowance", amount: 200 },
        { name: "Medical Allowance", amount: 150 },
        { name: "Professional Allowance", amount: 100 },
      ],
      deductions: [
        { name: "IRS (Tax)", amount: 310 },
        { name: "SSF (5.5%)", amount: 155 },
        { name: "Provident Fund", amount: 105 },
        { name: "Other Deduction", amount: 50 },
      ],
    },
    "7": {
      allowances: [
        { name: "Housing Allowance", amount: 400 },
        { name: "Transport Allowance", amount: 250 },
        { name: "Medical Allowance", amount: 150 },
        { name: "Internet Allowance", amount: 150 },
      ],
      deductions: [
        { name: "IRS (Tax)", amount: 350 },
        { name: "SSF (5.5%)", amount: 175 },
        { name: "Provident Fund", amount: 125 },
        { name: "Staff Loan", amount: 50 },
      ],
    },
    "8": {
      allowances: [
        { name: "Housing Allowance", amount: 500 },
        { name: "Transport Allowance", amount: 350 },
        { name: "Medical Allowance", amount: 200 },
        { name: "Commission Bonus", amount: 150 },
      ],
      deductions: [
        { name: "IRS (Tax)", amount: 275 },
        { name: "SSF (5.5%)", amount: 138 },
        { name: "Provident Fund", amount: 100 },
        { name: "Staff Loan", amount: 37 },
      ],
    },
  };

  // Current payroll data (employee list)
  const payrollRecords = [
    { id: "1", employeeId: "EMP-001", employeeName: "John Smith", department: "Engineering", position: "Senior Developer", basicSalary: 8500, allowances: 1200, deductions: 850, netSalary: 8850, status: "Paid", payPeriod: "June 2024" },
    { id: "2", employeeId: "EMP-002", employeeName: "Sarah Johnson", department: "Sales", position: "Sales Manager", basicSalary: 7200, allowances: 1500, deductions: 720, netSalary: 7980, status: "Paid", payPeriod: "June 2024" },
    { id: "3", employeeId: "EMP-003", employeeName: "Michael Brown", department: "Marketing", position: "Marketing Lead", basicSalary: 6800, allowances: 900, deductions: 680, netSalary: 7020, status: "Processed", payPeriod: "June 2024" },
    { id: "4", employeeId: "EMP-004", employeeName: "Emily Davis", department: "Operations", position: "Operations Manager", basicSalary: 7500, allowances: 1100, deductions: 750, netSalary: 7850, status: "Approved", payPeriod: "June 2024" },
    { id: "5", employeeId: "EMP-005", employeeName: "David Wilson", department: "HR", position: "HR Manager", basicSalary: 6500, allowances: 800, deductions: 650, netSalary: 6650, status: "Pending", payPeriod: "June 2024" },
    { id: "6", employeeId: "EMP-006", employeeName: "Lisa Martinez", department: "Finance", position: "Financial Analyst", basicSalary: 6200, allowances: 750, deductions: 620, netSalary: 6330, status: "Paid", payPeriod: "June 2024" },
    { id: "7", employeeId: "EMP-007", employeeName: "Tom Anderson", department: "Engineering", position: "Frontend Developer", basicSalary: 7000, allowances: 950, deductions: 700, netSalary: 7250, status: "Paid", payPeriod: "June 2024" },
    { id: "8", employeeId: "EMP-008", employeeName: "Rachel Green", department: "Sales", position: "Account Executive", basicSalary: 5500, allowances: 1200, deductions: 550, netSalary: 6150, status: "On Hold", payPeriod: "June 2024" },
  ];

  // Past payroll data
  const pastPayrolls = [
    { id: "1", period: "May 2024", processedDate: "May 31, 2024", totalEmployees: 45, totalAmount: 385000, taxRate: 10.43, payRate: 10.9, status: "Paid" },
    { id: "2", period: "April 2024", processedDate: "April 30, 2024", totalEmployees: 43, totalAmount: 368000, taxRate: 10.43, payRate: 10.72, status: "Paid" },
    { id: "3", period: "March 2024", processedDate: "March 31, 2024", totalEmployees: 42, totalAmount: 359000, taxRate: 10.43, payRate: 12.41, status: "Paid" },
    { id: "4", period: "February 2024", processedDate: "February 29, 2024", totalEmployees: 40, totalAmount: 345000, taxRate: 10.43, payRate: 10.9, status: "Paid" },
    { id: "5", period: "January 2024", processedDate: "January 31, 2024", totalEmployees: 39, totalAmount: 338000, taxRate: 10.43, payRate: 10.72, status: "Paid" },
  ];

  const filteredRecords = payrollRecords.filter((record) => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "All Departments" || record.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Only show records if payroll has been created
  const displayRecords = payrollDetails ? filteredRecords : [];

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-50 text-green-600";
      case "Processed": return "bg-blue-50 text-blue-600";
      case "Approved": return "bg-purple-50 text-purple-600";
      case "Pending": return "bg-orange-50 text-orange-600";
      case "On Hold": return "bg-red-50 text-red-600";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  const handleCreatePayroll = () => {
    setPayrollDetails({
      year: formData.year,
      month: formData.month,
      payRate: formData.payRate,
    });
    setShowCreateModal(false);
    setFormData({
      year: "2024",
      month: "June",
      payRate: "",
    });
  };

  const handleGetPayroll = () => {
    setPostPayrollData({
      ...postPayrollData,
      salaryPayable: "425000",
      internationalStaffSalary: "150000",
      nationalStaffSalary: "275000",
      irs: "45000",
      ssf: "23500",
      pf: "18000",
      loan: "12000",
      otherDeduction: "8500",
    });
    setPayrollDataFetched(true);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">Payroll</h1>
          {payrollGenerated && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] border border-emerald-200">
              <CheckCircle2 size={12} />
              Generated
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Create Payroll
          </button>
          <button
            onClick={() => setPayrollGenerated(!payrollGenerated)}
            disabled={!payrollDetails}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2 ${
              !payrollDetails
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : payrollGenerated
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-purple-700 text-white hover:bg-purple-800"
            }`}
          >
            <Plus size={16} />
            {payrollGenerated ? "Cancel" : "Process Payroll"}
          </button>
          {payrollGenerated && (
            <button
              onClick={() => setShowPostPayrollModal(true)}
              className="px-4 py-2 bg-[#0B01D0] hover:bg-[#0901a8] rounded-lg text-sm font-semibold text-white transition-colors shadow-sm flex items-center gap-2"
            >
              <Send size={16} />
              Post Payroll
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          <button
            onClick={() => setActiveTab("current")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[140px] ${
              activeTab === "current"
                ? "bg-[#0B01D0] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Current Payroll
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[140px] ${
              activeTab === "past"
                ? "bg-[#0B01D0] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Past Payrolls
          </button>
        </div>
      </div>

      {activeTab === "current" && (
        <>
          {payrollDetails && (
            <div className="bg-white border border-slate-200 rounded-lg px-8 py-6 shadow-sm mx-[24px] my-[16px]">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Payroll Information</h2>
              <div className="grid grid-cols-4 gap-8">
                <div>
                  <p className="text-xs text-slate-500 mb-1.5">Year</p>
                  <p className="text-sm text-slate-900">{payrollDetails.year}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1.5">Month</p>
                  <p className="text-sm text-slate-900">{payrollDetails.month}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1.5">Pay Rate</p>
                  <p className="text-sm text-slate-900">{payrollDetails.payRate}</p>
                </div>
              </div>
            </div>
          )}

          <div className="px-6 py-4 bg-white border-b border-slate-200">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
                <Search size={20} className="text-slate-400" />
                <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400" />
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <button onClick={() => { setShowDepartmentDropdown(!showDepartmentDropdown); }} className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
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
          </div>

          <div className="flex-1 overflow-auto bg-white">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#0B01D0" }}>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Employee ID</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Employee Name</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Department</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Position</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Basic Salary</th>
                  {payrollGenerated && <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Allowances</th>}
                  {payrollGenerated && <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Deductions</th>}
                  {payrollGenerated && <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Net Salary</th>}
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayRecords.map((record) => (
                  <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900">{record.employeeId}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{record.employeeName}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{record.department}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{record.position}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{formatCurrency(record.basicSalary)}</p></td>
                    {payrollGenerated && <td className="px-4 py-4"><p className="text-[12px] text-green-600">{formatCurrency(record.allowances)}</p></td>}
                    {payrollGenerated && <td className="px-4 py-4"><p className="text-[12px] text-red-600">{formatCurrency(record.deductions)}</p></td>}
                    {payrollGenerated && <td className="px-4 py-4"><p className="text-[12px] font-semibold text-slate-900">{formatCurrency(record.netSalary)}</p></td>}
                    <td className="px-4 py-4 text-center"><button onClick={() => setSelectedEmployee(record.id)} className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"><MoreVertical size={20} className="text-blue-800" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors"><ChevronDown size={16} className="rotate-90 text-pink-600" /></button>
              <button className="px-3 py-2 text-sm bg-pink-50 text-pink-600 rounded transition-colors">1</button>
              <button className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors">2</button>
              <button onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors"><ChevronDown size={16} className="-rotate-90 text-pink-600" /></button>
            </div>
          </div>
        </>
      )}

      {activeTab === "past" && (
        <>
          <div className="px-6 py-4 bg-white border-b border-slate-200">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
                <Search size={20} className="text-slate-400" />
                <input type="text" placeholder="Search" className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400" />
              </div>

              <div className="flex items-center gap-2.5">
                <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
                  <span className="text-sm text-slate-900">Export</span>
                  <Download size={16} className="text-purple-700" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-white">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#0B01D0" }}>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Pay Period</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Processed Date</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Total Employees</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Total Amount</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Pay Rate</th>
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
                </tr>
              </thead>
              <tbody>
                {pastPayrolls.map((payroll, index) => (
                  <tr key={payroll.id} className={`border-b border-slate-100 hover:bg-slate-50 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                    <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900">{payroll.period}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{payroll.processedDate}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{payroll.totalEmployees}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] font-semibold text-slate-900">{formatCurrency(payroll.totalAmount)}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{payroll.payRate}</p></td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-xl text-[12px] bg-green-50 text-green-600">
                        {payroll.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors">
                        <MoreVertical size={20} className="text-[#0B01D0]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors"><ChevronDown size={16} className="rotate-90 text-pink-600" /></button>
              <button className="px-3 py-2 text-sm bg-pink-50 text-pink-600 rounded transition-colors">1</button>
              <button className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors">2</button>
              <button onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors"><ChevronDown size={16} className="-rotate-90 text-pink-600" /></button>
            </div>
          </div>
        </>
      )}

      {/* Create Payroll Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-[15px] text-slate-900">Create Payroll</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Set up payroll parameters for the new period</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <Plus size={16} className="text-slate-500 rotate-45" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-[12px] text-slate-500 w-24">Year:</label>
                  <input type="text" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="2024" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-[12px] text-slate-500 w-24">Month:</label>
                  <select value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500">
                    <option>January</option><option>February</option><option>March</option>
                    <option>April</option><option>May</option><option>June</option>
                    <option>July</option><option>August</option><option>September</option>
                    <option>October</option><option>November</option><option>December</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-[12px] text-slate-500 w-24">Pay Rate:</label>
                  <input type="text" value={formData.payRate} onChange={(e) => setFormData({ ...formData, payRate: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="10.9" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleCreatePayroll} disabled={!formData.year || !formData.month || !formData.payRate} className="px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Create Payroll</button>
            </div>
          </div>
        </div>
      )}

      {/* Post Payroll Modal */}
      {showPostPayrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPostPayrollModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-[15px] text-slate-900">Post Payroll</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Enter payroll details for posting</p>
              </div>
              <button onClick={() => setShowPostPayrollModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <Plus size={16} className="text-slate-500 rotate-45" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[12px] text-slate-500 font-medium">Period</label>
                    <select value={postPayrollData.period} onChange={(e) => setPostPayrollData({ ...postPayrollData, period: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white">
                      {PERIODS.map((period) => (<option key={period} value={period}>{period}</option>))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] text-slate-500 font-medium">Rate</label>
                    <input type="text" value={postPayrollData.rate} onChange={(e) => setPostPayrollData({ ...postPayrollData, rate: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="10.9" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] text-slate-500 font-medium">Date</label>
                    <input type="date" value={postPayrollData.date} onChange={(e) => setPostPayrollData({ ...postPayrollData, date: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] text-slate-500 font-medium">Voucher Number</label>
                    <input type="text" value={postPayrollData.voucherNumber} onChange={(e) => setPostPayrollData({ ...postPayrollData, voucherNumber: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="V12345" />
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Payroll Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><label className="text-[12px] text-slate-500 font-medium">Salary Payable</label><input type="text" value={postPayrollData.salaryPayable} onChange={(e) => setPostPayrollData({ ...postPayrollData, salaryPayable: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" placeholder="100000" /></div>
                  <div className="space-y-2"><label className="text-[12px] text-slate-500 font-medium">International Staff Salary</label><input type="text" value={postPayrollData.internationalStaffSalary} onChange={(e) => setPostPayrollData({ ...postPayrollData, internationalStaffSalary: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" placeholder="50000" /></div>
                  <div className="space-y-2"><label className="text-[12px] text-slate-500 font-medium">National Staff Salary</label><input type="text" value={postPayrollData.nationalStaffSalary} onChange={(e) => setPostPayrollData({ ...postPayrollData, nationalStaffSalary: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" placeholder="50000" /></div>
                  <div className="space-y-2"><label className="text-[12px] text-slate-500 font-medium">IRS</label><input type="text" value={postPayrollData.irs} onChange={(e) => setPostPayrollData({ ...postPayrollData, irs: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" placeholder="10000" /></div>
                  <div className="space-y-2"><label className="text-[12px] text-slate-500 font-medium">SSF</label><input type="text" value={postPayrollData.ssf} onChange={(e) => setPostPayrollData({ ...postPayrollData, ssf: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" placeholder="5000" /></div>
                  <div className="space-y-2"><label className="text-[12px] text-slate-500 font-medium">PF</label><input type="text" value={postPayrollData.pf} onChange={(e) => setPostPayrollData({ ...postPayrollData, pf: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" placeholder="3000" /></div>
                  <div className="space-y-2"><label className="text-[12px] text-slate-500 font-medium">Loan</label><input type="text" value={postPayrollData.loan} onChange={(e) => setPostPayrollData({ ...postPayrollData, loan: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" placeholder="2000" /></div>
                  <div className="space-y-2"><label className="text-[12px] text-slate-500 font-medium">Other Deduction</label><input type="text" value={postPayrollData.otherDeduction} onChange={(e) => setPostPayrollData({ ...postPayrollData, otherDeduction: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" placeholder="1000" /></div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button onClick={handleGetPayroll} disabled={!postPayrollData.period || !postPayrollData.rate || !postPayrollData.date || !postPayrollData.voucherNumber} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[13px] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"><FileText size={14} />Get Payroll</button>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowPostPayrollModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={() => { setShowPostPayrollModal(false); }} disabled={!payrollDataFetched} className="px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Post Payroll</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Payroll Detail Modal */}
      {selectedEmployee && (() => {
        const emp = payrollRecords.find(r => r.id === selectedEmployee);
        const details = employeePayrollDetails[selectedEmployee];
        if (!emp || !details) return null;
        const totalAllowances = details.allowances.reduce((s, a) => s + a.amount, 0);
        const totalDeductions = details.deductions.reduce((s, d) => s + d.amount, 0);
        const grossSalary = emp.basicSalary + totalAllowances;
        const netSalary = grossSalary - totalDeductions;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedEmployee(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedEmployee(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><ArrowLeft size={16} className="text-slate-600" /></button>
                  <div>
                    <h2 className="text-[15px] font-semibold text-slate-900">Payroll Breakdown</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">{emp.employeeId} - {emp.employeeName}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedEmployee(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <h3 className="text-[13px] font-semibold text-slate-900 mb-3">Employee Information</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div><p className="text-[10px] text-slate-500 uppercase tracking-wider">Department</p><p className="text-[13px] text-slate-900 mt-0.5">{emp.department}</p></div>
                    <div><p className="text-[10px] text-slate-500 uppercase tracking-wider">Position</p><p className="text-[13px] text-slate-900 mt-0.5">{emp.position}</p></div>
                    <div><p className="text-[10px] text-slate-500 uppercase tracking-wider">Pay Period</p><p className="text-[13px] text-slate-900 mt-0.5">{emp.payPeriod}</p></div>
                    <div><p className="text-[10px] text-slate-500 uppercase tracking-wider">Status</p><span className={`inline-flex items-center px-2 py-0.5 rounded-xl text-[11px] mt-0.5 ${getStatusColor(emp.status)}`}>{emp.status}</span></div>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <h3 className="text-[13px] font-semibold text-green-900 mb-3">Earnings & Allowances</h3>
                  <table className="w-full">
                    <thead><tr className="border-b border-green-200"><th className="text-left py-2 text-[10px] font-semibold text-green-700 uppercase">Component</th><th className="text-right py-2 text-[10px] font-semibold text-green-700 uppercase">Amount</th></tr></thead>
                    <tbody>
                      <tr className="border-b border-green-100"><td className="py-2.5 text-[12px] text-slate-900 font-medium">Basic Salary</td><td className="py-2.5 text-right text-[12px] font-mono text-slate-900">{formatCurrency(emp.basicSalary)}</td></tr>
                      {details.allowances.map((a, i) => (<tr key={i} className="border-b border-green-100"><td className="py-2.5 text-[12px] text-slate-700">{a.name}</td><td className="py-2.5 text-right text-[12px] font-mono text-green-700">{formatCurrency(a.amount)}</td></tr>))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-green-300"><td className="py-2.5 text-[12px] font-semibold text-green-900">Total Allowances</td><td className="py-2.5 text-right text-[12px] font-mono font-semibold text-green-900">{formatCurrency(totalAllowances)}</td></tr>
                      <tr className="bg-green-100/50"><td className="py-3 text-[13px] font-bold text-green-900">Gross Salary</td><td className="py-3 text-right text-[13px] font-mono font-bold text-green-900">{formatCurrency(grossSalary)}</td></tr>
                    </tfoot>
                  </table>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                  <h3 className="text-[13px] font-semibold text-red-900 mb-3">Deductions</h3>
                  <table className="w-full">
                    <thead><tr className="border-b border-red-200"><th className="text-left py-2 text-[10px] font-semibold text-red-700 uppercase">Component</th><th className="text-right py-2 text-[10px] font-semibold text-red-700 uppercase">Amount</th></tr></thead>
                    <tbody>{details.deductions.map((d, i) => (<tr key={i} className="border-b border-red-100"><td className="py-2.5 text-[12px] text-slate-700">{d.name}</td><td className="py-2.5 text-right text-[12px] font-mono text-red-700">{formatCurrency(d.amount)}</td></tr>))}</tbody>
                    <tfoot><tr className="border-t-2 border-red-300"><td className="py-2.5 text-[12px] font-semibold text-red-900">Total Deductions</td><td className="py-2.5 text-right text-[12px] font-mono font-semibold text-red-900">{formatCurrency(totalDeductions)}</td></tr></tfoot>
                  </table>
                </div>
                <div className="bg-[#0B01D0]/5 border border-[#0B01D0]/20 rounded-xl p-5">
                  <h3 className="text-[13px] font-semibold text-slate-900 mb-3">Net Pay Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1.5"><span className="text-[12px] text-slate-600">Gross Salary</span><span className="text-[12px] font-mono text-slate-900">{formatCurrency(grossSalary)}</span></div>
                    <div className="flex justify-between items-center py-1.5"><span className="text-[12px] text-slate-600">Less: Total Deductions</span><span className="text-[12px] font-mono text-red-700">({formatCurrency(totalDeductions)})</span></div>
                    <div className="border-t-2 border-[#0B01D0]/20 pt-3 flex justify-between items-center"><span className="text-[14px] font-bold text-slate-900">Net Salary</span><span className="text-[16px] font-mono font-bold text-[#0B01D0]">{formatCurrency(netSalary)}</span></div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end shrink-0">
                <button onClick={() => setSelectedEmployee(null)} className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50">Close</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
