import { useState } from "react";
import { Download, Search, ChevronDown, Send } from "lucide-react";

const DEPARTMENTS = ["All Departments", "Engineering", "Sales", "Marketing", "Operations", "HR", "Finance"];
const CATEGORIES = ["National Staff", "International Staff"];
const CURRENCIES = ["Local - GHS", "USD"];

// Exchange rate: 1 USD = 12 GHS (example rate)
const EXCHANGE_RATE = 12;

export function PayrollSchedule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  
  // Filter card state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Data stored in native currencies (National Staff in GHS, International Staff in USD)
  const payrollData = [
    { id: "1", employeeId: "EMP-001", employeeName: "John Smith", department: "Engineering", position: "Senior Developer", basicSalary: 102000, allowances: 14400, grossSalary: 116400, taxDeductions: 11640, otherDeductions: 6960, netSalary: 97800, paymentMethod: "Bank Transfer", category: "National Staff", nativeCurrency: "GHS" },
    { id: "2", employeeId: "EMP-002", employeeName: "Sarah Johnson", department: "Sales", position: "Sales Manager", basicSalary: 86400, allowances: 18000, grossSalary: 104400, taxDeductions: 10440, otherDeductions: 5400, netSalary: 88560, paymentMethod: "Bank Transfer", category: "National Staff", nativeCurrency: "GHS" },
    { id: "3", employeeId: "EMP-003", employeeName: "Michael Brown", department: "Marketing", position: "Marketing Lead", basicSalary: 6800, allowances: 900, grossSalary: 7700, taxDeductions: 770, otherDeductions: 380, netSalary: 6550, paymentMethod: "Bank Transfer", category: "International Staff", nativeCurrency: "USD" },
    { id: "4", employeeId: "EMP-004", employeeName: "Emily Davis", department: "Operations", position: "Operations Manager", basicSalary: 90000, allowances: 13200, grossSalary: 103200, taxDeductions: 10320, otherDeductions: 5040, netSalary: 87840, paymentMethod: "Bank Transfer", category: "National Staff", nativeCurrency: "GHS" },
    { id: "5", employeeId: "EMP-005", employeeName: "David Wilson", department: "HR", position: "HR Manager", basicSalary: 78000, allowances: 9600, grossSalary: 87600, taxDeductions: 8760, otherDeductions: 4200, netSalary: 74640, paymentMethod: "Cash", category: "National Staff", nativeCurrency: "GHS" },
    { id: "6", employeeId: "EMP-006", employeeName: "Lisa Martinez", department: "Finance", position: "Financial Analyst", basicSalary: 6200, allowances: 750, grossSalary: 6950, taxDeductions: 695, otherDeductions: 320, netSalary: 5935, paymentMethod: "Bank Transfer", category: "International Staff", nativeCurrency: "USD" },
    { id: "7", employeeId: "EMP-007", employeeName: "Tom Anderson", department: "Engineering", position: "Frontend Developer", basicSalary: 84000, allowances: 11400, grossSalary: 95400, taxDeductions: 9540, otherDeductions: 4800, netSalary: 81060, paymentMethod: "Bank Transfer", category: "National Staff", nativeCurrency: "GHS" },
    { id: "8", employeeId: "EMP-008", employeeName: "Rachel Green", department: "Sales", position: "Account Executive", basicSalary: 5500, allowances: 1200, grossSalary: 6700, taxDeductions: 670, otherDeductions: 300, netSalary: 5730, paymentMethod: "Bank Transfer", category: "International Staff", nativeCurrency: "USD" },
  ];

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string) => {
    if (fromCurrency === toCurrency) return amount;
    if (fromCurrency === "GHS" && toCurrency === "USD") return amount / EXCHANGE_RATE;
    if (fromCurrency === "USD" && toCurrency === "GHS") return amount * EXCHANGE_RATE;
    return amount;
  };

  const handleSearch = () => {
    if (selectedCategory && selectedCurrency) {
      setHasSearched(true);
    }
  };

  const handleReset = () => {
    setSelectedCategory("");
    setSelectedCurrency("");
    setHasSearched(false);
    setSearchQuery("");
    setSelectedDepartment("All Departments");
  };

  const filteredData = hasSearched ? payrollData.filter((record) => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "All Departments" || record.department === selectedDepartment;
    const matchesCategory = record.category === selectedCategory;
    return matchesSearch && matchesDepartment && matchesCategory;
  }).map(record => {
    // Convert amounts to selected display currency
    const targetCurrency = selectedCurrency === "USD" ? "USD" : "GHS";
    return {
      ...record,
      basicSalary: convertAmount(record.basicSalary, record.nativeCurrency, targetCurrency),
      allowances: convertAmount(record.allowances, record.nativeCurrency, targetCurrency),
      grossSalary: convertAmount(record.grossSalary, record.nativeCurrency, targetCurrency),
      taxDeductions: convertAmount(record.taxDeductions, record.nativeCurrency, targetCurrency),
      otherDeductions: convertAmount(record.otherDeductions, record.nativeCurrency, targetCurrency),
      netSalary: convertAmount(record.netSalary, record.nativeCurrency, targetCurrency),
    };
  }) : [];

  const formatCurrency = (amount: number) => {
    const currencyCode = selectedCurrency === "USD" ? "USD" : "GHS";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode, minimumFractionDigits: 2 }).format(amount);
  };

  const totalGrossSalary = filteredData.reduce((sum, record) => sum + record.grossSalary, 0);
  const totalTaxDeductions = filteredData.reduce((sum, record) => sum + record.taxDeductions, 0);
  const totalOtherDeductions = filteredData.reduce((sum, record) => sum + record.otherDeductions, 0);
  const totalNetSalary = filteredData.reduce((sum, record) => sum + record.netSalary, 0);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Payroll Schedule</h1>
        <div className="flex items-center gap-2">
          {hasSearched && (
            <button className="px-4 py-2 bg-[#0B01D0] hover:bg-[#0901a8] rounded-lg text-sm text-white transition-colors shadow-sm flex items-center gap-2">
              <Send size={16} />
              Post Payroll
            </button>
          )}
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Filter Card */}
      <div className="px-6 py-4 bg-slate-50">
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm">
          <div className="flex gap-5 px-6 py-7 border-b border-slate-200">
            {/* Category Dropdown */}
            <div className="flex-1 flex flex-col gap-2.5">
              <label className="text-[12px] text-[#4a8d34] font-normal">Category</label>
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full h-[47px] px-2.5 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <span className="text-[14px] text-slate-900">{selectedCategory || "Select"}</span>
                  <ChevronDown size={16} className="text-[#4a8d34]" />
                </button>
                {showCategoryDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowCategoryDropdown(false)} />
                    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                      {CATEGORIES.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowCategoryDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Currency Dropdown */}
            <div className="flex-1 flex flex-col gap-2.5">
              <label className="text-[12px] text-[#4a8d34] font-normal">Currency</label>
              <div className="relative">
                <button
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="w-full h-[47px] px-2.5 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <span className="text-[14px] text-slate-900">{selectedCurrency || "Select"}</span>
                  <ChevronDown size={16} className="text-[#4a8d34]" />
                </button>
                {showCurrencyDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowCurrencyDropdown(false)} />
                    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                      {CURRENCIES.map((currency) => (
                        <button
                          key={currency}
                          onClick={() => {
                            setSelectedCurrency(currency);
                            setShowCurrencyDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                          {currency}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 px-5 py-5">
            <button
              onClick={handleReset}
              className="w-60 h-[46px] border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors flex items-center justify-center"
            >
              <span className="text-[16px] text-slate-900">Reset</span>
            </button>
            <button
              onClick={handleSearch}
              disabled={!selectedCategory || !selectedCurrency}
              className="w-60 h-[46px] bg-[#4a8d34] hover:bg-[#3d7329] disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Search size={16} className="text-white" />
              <span className="text-[16px] font-semibold text-white">Search</span>
            </button>
          </div>
        </div>
      </div>

      {hasSearched && (
        <>
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
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Position</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Basic Salary</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Allowances</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Gross Salary</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Tax Deductions</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Other Deductions</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Net Salary</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  <>
                    {filteredData.map((record, index) => (
                      <tr key={record.id} className={`border-b border-slate-100 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                        <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900">{record.employeeId}</p></td>
                        <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{record.employeeName}</p></td>
                        <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{record.department}</p></td>
                        <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{record.position}</p></td>
                        <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{formatCurrency(record.basicSalary)}</p></td>
                        <td className="px-4 py-4"><p className="text-[12px] text-green-600">{formatCurrency(record.allowances)}</p></td>
                        <td className="px-4 py-4"><p className="text-[12px] font-semibold text-slate-900">{formatCurrency(record.grossSalary)}</p></td>
                        <td className="px-4 py-4"><p className="text-[12px] text-red-600">{formatCurrency(record.taxDeductions)}</p></td>
                        <td className="px-4 py-4"><p className="text-[12px] text-red-600">{formatCurrency(record.otherDeductions)}</p></td>
                        <td className="px-4 py-4"><p className="text-[12px] font-semibold text-blue-600">{formatCurrency(record.netSalary)}</p></td>
                        <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{record.paymentMethod}</p></td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: "#0B01D0" }}>
                      <td colSpan={6} className="px-4 py-4"><p className="text-[12px] font-semibold text-white">TOTAL</p></td>
                      <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalGrossSalary)}</p></td>
                      <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalTaxDeductions)}</p></td>
                      <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalOtherDeductions)}</p></td>
                      <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalNetSalary)}</p></td>
                      <td className="px-4 py-4"></td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center">
                      <p className="text-slate-500">No records found for the selected criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!hasSearched && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-600 text-lg">Please select Category and Currency, then click Search to view payroll data.</p>
          </div>
        </div>
      )}
    </div>
  );
}