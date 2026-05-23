import { useState } from "react";
import { Search, Download, ChevronDown, Calendar } from "lucide-react";

interface PayrollSummary {
  id: number;
  month: string;
  period: string;
  totalEmployees: number;
  grossPay: string;
  deductions: string;
  netPay: string;
  taxes: string;
  status: "Completed" | "Processing" | "Pending";
}

const summaryData: PayrollSummary[] = [
  { id: 1, month: "December 2024", period: "Dec 01 - Dec 31", totalEmployees: 248, grossPay: "$595,000", deductions: "$78,500", netPay: "$495,000", taxes: "$21,500", status: "Completed" },
  { id: 2, month: "November 2024", period: "Nov 01 - Nov 30", totalEmployees: 245, grossPay: "$588,000", deductions: "$76,200", netPay: "$490,000", taxes: "$21,800", status: "Completed" },
  { id: 3, month: "October 2024", period: "Oct 01 - Oct 31", totalEmployees: 242, grossPay: "$582,000", deductions: "$74,800", netPay: "$485,000", taxes: "$22,200", status: "Completed" },
  { id: 4, month: "September 2024", period: "Sep 01 - Sep 30", totalEmployees: 238, grossPay: "$575,000", deductions: "$73,500", netPay: "$480,000", taxes: "$21,500", status: "Completed" },
  { id: 5, month: "August 2024", period: "Aug 01 - Aug 31", totalEmployees: 235, grossPay: "$568,000", deductions: "$71,200", netPay: "$475,000", taxes: "$21,800", status: "Completed" },
  { id: 6, month: "July 2024", period: "Jul 01 - Jul 31", totalEmployees: 232, grossPay: "$562,000", deductions: "$69,800", netPay: "$470,000", taxes: "$22,200", status: "Completed" },
  { id: 7, month: "June 2024", period: "Jun 01 - Jun 30", totalEmployees: 228, grossPay: "$555,000", deductions: "$68,500", netPay: "$465,000", taxes: "$21,500", status: "Completed" },
  { id: 8, month: "May 2024", period: "May 01 - May 31", totalEmployees: 225, grossPay: "$548,000", deductions: "$66,200", netPay: "$460,000", taxes: "$21,800", status: "Completed" },
];

export function PayrollSummary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [dateRange, setDateRange] = useState("Last 12 Months");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-50 text-green-700";
      case "Processing": return "bg-yellow-50 text-yellow-700";
      case "Pending": return "bg-blue-50 text-blue-700";
      default: return "bg-slate-50 text-slate-700";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Payroll Summary</h1>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by month, period..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Year Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[120px] justify-between">
              <span>{selectedYear}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedStatus}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[180px] justify-between">
              <Calendar className="w-4 h-4" />
              <span>{dateRange}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs text-slate-600 mb-1">Total Gross Pay (YTD)</p>
            <p className="font-semibold text-slate-900" style={{ fontSize: "20px" }}>$6,573,000</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs text-slate-600 mb-1">Total Deductions (YTD)</p>
            <p className="font-semibold text-slate-900" style={{ fontSize: "20px" }}>$858,700</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs text-slate-600 mb-1">Total Net Pay (YTD)</p>
            <p className="font-semibold text-slate-900" style={{ fontSize: "20px" }}>$5,480,000</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs text-slate-600 mb-1">Total Taxes (YTD)</p>
            <p className="font-semibold text-slate-900" style={{ fontSize: "20px" }}>$234,300</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Month</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Period</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Employees</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Gross Pay</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Deductions</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Taxes</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Net Pay</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((summary) => (
              <tr key={summary.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{summary.month}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{summary.period}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <p className="text-[12px] text-slate-900">{summary.totalEmployees}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] font-medium text-slate-900">{summary.grossPay}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] text-slate-900">{summary.deductions}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] text-slate-900">{summary.taxes}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] font-medium text-slate-900">{summary.netPay}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(summary.status)}`}>
                    {summary.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}