import { useState } from "react";
import { Search, Download, Upload, ChevronDown, MoreVertical, Plus } from "lucide-react";

const TYPES = ["All Types", "Housing", "Transport", "Meal", "Education", "Medical", "Communication", "Other"];
const STATUSES = ["All Statuses", "Active", "Inactive", "Suspended"];

export function PayrollManagementAllowances() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const allowances = [
    { id: "1", employeeId: "EMP-001", employeeName: "John Smith", allowanceType: "Housing", amount: 800, frequency: "Monthly", startDate: "2024-01-01", endDate: "2024-12-31", status: "Active" },
    { id: "2", employeeId: "EMP-001", employeeName: "John Smith", allowanceType: "Transport", amount: 200, frequency: "Monthly", startDate: "2024-01-01", endDate: "2024-12-31", status: "Active" },
    { id: "3", employeeId: "EMP-002", employeeName: "Sarah Johnson", allowanceType: "Housing", amount: 900, frequency: "Monthly", startDate: "2024-01-01", endDate: "2024-12-31", status: "Active" },
    { id: "4", employeeId: "EMP-002", employeeName: "Sarah Johnson", allowanceType: "Meal", amount: 300, frequency: "Monthly", startDate: "2024-01-01", endDate: "2024-12-31", status: "Active" },
    { id: "5", employeeId: "EMP-003", employeeName: "Michael Brown", allowanceType: "Transport", amount: 250, frequency: "Monthly", startDate: "2024-02-01", endDate: "2024-12-31", status: "Active" },
    { id: "6", employeeId: "EMP-004", employeeName: "Emily Davis", allowanceType: "Education", amount: 500, frequency: "Quarterly", startDate: "2024-01-01", endDate: "2024-12-31", status: "Active" },
    { id: "7", employeeId: "EMP-005", employeeName: "David Wilson", allowanceType: "Medical", amount: 400, frequency: "Monthly", startDate: "2024-01-01", endDate: "2024-12-31", status: "Active" },
    { id: "8", employeeId: "EMP-006", employeeName: "Lisa Martinez", allowanceType: "Communication", amount: 150, frequency: "Monthly", startDate: "2024-03-01", endDate: "2024-12-31", status: "Inactive" },
  ];

  const filteredAllowances = allowances.filter((allowance) => {
    const matchesSearch = allowance.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || allowance.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All Types" || allowance.allowanceType === selectedType;
    const matchesStatus = selectedStatus === "All Statuses" || allowance.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-50 text-green-600";
      case "Inactive": return "bg-slate-50 text-slate-600";
      case "Suspended": return "bg-red-50 text-red-600";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Allowances</h1>
        <button className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2">
          <Plus size={16} />
          Add new
        </button>
      </div>

      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
            <Search size={20} className="text-slate-400" />
            <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400" />
          </div>

          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">Export</span>
              <Download size={16} className="text-purple-700" />
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">Upload CSV</span>
              <Upload size={16} className="text-purple-700" />
            </button>

            <div className="relative">
              <button onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowStatusDropdown(false); }} className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
                <span className="text-sm text-slate-900">{selectedType}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showTypeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowTypeDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {TYPES.map((type) => (
                      <button key={type} onClick={() => { setSelectedType(type); setShowTypeDropdown(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors">{type}</button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowTypeDropdown(false); }} className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
                <span className="text-sm text-slate-900">{selectedStatus}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {STATUSES.map((status) => (
                      <button key={status} onClick={() => { setSelectedStatus(status); setShowStatusDropdown(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors">{status}</button>
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
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Employee ID</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Employee Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Allowance Type</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Amount</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Frequency</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Start Date</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">End Date</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAllowances.map((allowance) => (
              <tr key={allowance.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900">{allowance.employeeId}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{allowance.employeeName}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{allowance.allowanceType}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-green-600">{formatCurrency(allowance.amount)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{allowance.frequency}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{formatDate(allowance.startDate)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{formatDate(allowance.endDate)}</p></td>
                <td className="px-4 py-4 text-center"><span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(allowance.status)}`}>{allowance.status}</span></td>
                <td className="px-4 py-4 text-center"><button className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"><MoreVertical size={20} className="text-blue-800" /></button></td>
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
    </div>
  );
}