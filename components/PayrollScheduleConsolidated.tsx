import { useState } from "react";
import { Download, ChevronDown, Search } from "lucide-react";

const MONTHS = ["All Months", "January 2024", "February 2024", "March 2024", "April 2024", "May 2024", "June 2024"];
const CATEGORIES = ["National Staff", "International Staff"];
const CURRENCIES = ["Local - GHS", "USD"];

// Exchange rate: 1 USD = 12 GHS (example rate)
const EXCHANGE_RATE = 12;

export function PayrollScheduleConsolidated() {
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  
  // Filter card state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Data stored in native currencies (National Staff in GHS, International Staff in USD)
  const consolidatedData = [
    { id: "1", department: "Engineering", totalEmployees: 12, totalBasicSalary: 1182000, totalAllowances: 170400, totalGrossSalary: 1352400, totalTaxDeductions: 135240, totalOtherDeductions: 67620, totalNetSalary: 1149540, category: "National Staff", nativeCurrency: "GHS" },
    { id: "2", department: "Sales", totalEmployees: 8, totalBasicSalary: 650400, totalAllowances: 126000, totalGrossSalary: 776400, totalTaxDeductions: 77640, totalOtherDeductions: 38820, totalNetSalary: 659940, category: "National Staff", nativeCurrency: "GHS" },
    { id: "3", department: "Marketing", totalEmployees: 6, totalBasicSalary: 42000, totalAllowances: 5800, totalGrossSalary: 47800, totalTaxDeductions: 4780, totalOtherDeductions: 2390, totalNetSalary: 40630, category: "International Staff", nativeCurrency: "USD" },
    { id: "4", department: "Operations", totalEmployees: 10, totalBasicSalary: 816000, totalAllowances: 110400, totalGrossSalary: 926400, totalTaxDeductions: 92640, totalOtherDeductions: 46320, totalNetSalary: 787440, category: "National Staff", nativeCurrency: "GHS" },
    { id: "5", department: "HR", totalEmployees: 5, totalBasicSalary: 390000, totalAllowances: 48000, totalGrossSalary: 438000, totalTaxDeductions: 43800, totalOtherDeductions: 21900, totalNetSalary: 372300, category: "National Staff", nativeCurrency: "GHS" },
    { id: "6", department: "Finance", totalEmployees: 7, totalBasicSalary: 48000, totalAllowances: 6500, totalGrossSalary: 54500, totalTaxDeductions: 5450, totalOtherDeductions: 2725, totalNetSalary: 46325, category: "International Staff", nativeCurrency: "USD" },
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
    setSelectedMonth("All Months");
  };

  const filteredData = hasSearched ? consolidatedData.filter((record) => {
    const matchesCategory = record.category === selectedCategory;
    return matchesCategory;
  }).map(record => {
    // Convert amounts to selected display currency
    const targetCurrency = selectedCurrency === "USD" ? "USD" : "GHS";
    return {
      ...record,
      totalBasicSalary: convertAmount(record.totalBasicSalary, record.nativeCurrency, targetCurrency),
      totalAllowances: convertAmount(record.totalAllowances, record.nativeCurrency, targetCurrency),
      totalGrossSalary: convertAmount(record.totalGrossSalary, record.nativeCurrency, targetCurrency),
      totalTaxDeductions: convertAmount(record.totalTaxDeductions, record.nativeCurrency, targetCurrency),
      totalOtherDeductions: convertAmount(record.totalOtherDeductions, record.nativeCurrency, targetCurrency),
      totalNetSalary: convertAmount(record.totalNetSalary, record.nativeCurrency, targetCurrency),
    };
  }) : [];

  const formatCurrency = (amount: number) => {
    const currencyCode = selectedCurrency === "USD" ? "USD" : "GHS";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode, minimumFractionDigits: 2 }).format(amount);
  };

  const grandTotalEmployees = filteredData.reduce((sum, record) => sum + record.totalEmployees, 0);
  const grandTotalBasicSalary = filteredData.reduce((sum, record) => sum + record.totalBasicSalary, 0);
  const grandTotalAllowances = filteredData.reduce((sum, record) => sum + record.totalAllowances, 0);
  const grandTotalGrossSalary = filteredData.reduce((sum, record) => sum + record.totalGrossSalary, 0);
  const grandTotalTaxDeductions = filteredData.reduce((sum, record) => sum + record.totalTaxDeductions, 0);
  const grandTotalOtherDeductions = filteredData.reduce((sum, record) => sum + record.totalOtherDeductions, 0);
  const grandTotalNetSalary = filteredData.reduce((sum, record) => sum + record.totalNetSalary, 0);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Payroll Schedule - Consolidated</h1>
        <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
          <Download size={16} />
          Export Report
        </button>
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
          <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-end">
            <div className="relative">
              <button onClick={() => setShowMonthDropdown(!showMonthDropdown)} className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
                <span className="text-sm text-slate-900">{selectedMonth}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showMonthDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMonthDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {MONTHS.map((month) => (
                      <button key={month} onClick={() => { setSelectedMonth(month); setShowMonthDropdown(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors">{month}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#0B01D0" }}>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Department</th>
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Total Employees</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Total Basic Salary</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Total Allowances</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Total Gross Salary</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Total Tax Deductions</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Total Other Deductions</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Total Net Salary</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  <>
                    {filteredData.map((record, index) => (
                      <tr key={record.id} className={`border-b border-slate-100 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                        <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900">{record.department}</p></td>
                        <td className="px-4 py-4 text-center"><p className="text-[12px] text-slate-900">{record.totalEmployees}</p></td>
                        <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{formatCurrency(record.totalBasicSalary)}</p></td>
                        <td className="px-4 py-4"><p className="text-[12px] text-green-600">{formatCurrency(record.totalAllowances)}</p></td>
                        <td className="px-4 py-4"><p className="text-[12px] font-semibold text-slate-900">{formatCurrency(record.totalGrossSalary)}</p></td>
                        <td className="px-4 py-4"><p className="text-[12px] text-red-600">{formatCurrency(record.totalTaxDeductions)}</p></td>
                        <td className="px-4 py-4"><p className="text-[12px] text-red-600">{formatCurrency(record.totalOtherDeductions)}</p></td>
                        <td className="px-4 py-4"><p className="text-[12px] font-semibold text-blue-600">{formatCurrency(record.totalNetSalary)}</p></td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: "#0B01D0" }}>
                      <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">GRAND TOTAL</p></td>
                      <td className="px-4 py-4 text-center"><p className="text-[12px] font-semibold text-white">{grandTotalEmployees}</p></td>
                      <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(grandTotalBasicSalary)}</p></td>
                      <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(grandTotalAllowances)}</p></td>
                      <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(grandTotalGrossSalary)}</p></td>
                      <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(grandTotalTaxDeductions)}</p></td>
                      <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(grandTotalOtherDeductions)}</p></td>
                      <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(grandTotalNetSalary)}</p></td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center">
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
            <p className="text-slate-600 text-lg">Please select Category and Currency, then click Search to view consolidated payroll data.</p>
          </div>
        </div>
      )}
    </div>
  );
}