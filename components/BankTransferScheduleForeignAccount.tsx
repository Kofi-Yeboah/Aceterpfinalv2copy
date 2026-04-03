import { useState } from "react";
import { Download, Search, ChevronDown } from "lucide-react";

const COUNTRIES = ["All Countries", "United States", "United Kingdom", "Canada", "Australia"];

export function BankTransferScheduleForeignAccount() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const foreignTransferData = [
    { id: "1", employeeId: "EMP-005", employeeName: "David Wilson", country: "United Kingdom", bankName: "Barclays UK", iban: "GB29****5566", swiftCode: "BARCGB22", netSalary: 6220, currency: "GBP", exchangeRate: 0.79, localAmount: 4914, paymentDate: "June 30, 2024" },
    { id: "2", employeeId: "EMP-009", employeeName: "James Peterson", country: "United States", bankName: "Chase Bank", iban: "US****1122", swiftCode: "CHASUS33", netSalary: 9500, currency: "USD", exchangeRate: 1.0, localAmount: 9500, paymentDate: "June 30, 2024" },
    { id: "3", employeeId: "EMP-010", employeeName: "Sophie Laurent", country: "Canada", bankName: "TD Bank", iban: "CA****3344", swiftCode: "TDOMCATTTOR", netSalary: 8200, currency: "CAD", exchangeRate: 1.36, localAmount: 11152, paymentDate: "June 30, 2024" },
  ];

  const filteredData = foreignTransferData.filter((record) => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === "All Countries" || record.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const formatCurrency = (amount: number, currency: string = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 0 }).format(amount);

  const totalNetSalary = filteredData.reduce((sum, record) => sum + record.netSalary, 0);
  const totalLocalAmount = filteredData.reduce((sum, record) => sum + record.localAmount, 0);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Bank Transfer Schedule - Foreign Account</h1>
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
            <button onClick={() => setShowCountryDropdown(!showCountryDropdown)} className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">{selectedCountry}</span>
              <ChevronDown size={16} className="text-purple-700" />
            </button>
            {showCountryDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowCountryDropdown(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  {COUNTRIES.map((country) => (
                    <button key={country} onClick={() => { setSelectedCountry(country); setShowCountryDropdown(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors">{country}</button>
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
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Country</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Bank Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">IBAN</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">SWIFT Code</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Net Salary (USD)</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Local Currency</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Exchange Rate</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Local Amount</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record, index) => (
              <tr key={record.id} className={`border-b border-slate-100 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900">{record.employeeId}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{record.employeeName}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-600">{record.country}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-600">{record.bankName}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-500 font-mono">{record.iban}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-500 font-mono">{record.swiftCode}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-slate-900">{formatCurrency(record.netSalary, "USD")}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-600">{record.currency}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-600">{record.exchangeRate}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-blue-600">{formatCurrency(record.localAmount, record.currency)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{record.paymentDate}</p></td>
              </tr>
            ))}
            {filteredData.length > 0 && (
              <tr style={{ backgroundColor: "#0B01D0" }}>
                <td colSpan={6} className="px-4 py-4"><p className="text-[12px] font-semibold text-white">TOTAL</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalNetSalary, "USD")}</p></td>
                <td colSpan={2} className="px-4 py-4"></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalLocalAmount, "USD")}</p></td>
                <td className="px-4 py-4"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
