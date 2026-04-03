import { useState } from "react";
import { Search, Download, Upload, ChevronDown, MoreVertical, Plus } from "lucide-react";

const STATUSES = ["All Statuses", "Pending", "Approved", "Disbursed", "Repaying", "Completed", "Rejected"];
const TYPES = ["All Types", "Salary Advance", "Emergency Advance", "Travel Advance", "Project Advance"];

export function PayrollManagementAdvance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedType, setSelectedType] = useState("All Types");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const advances = [
    { id: "1", advanceId: "ADV-2024-001", employeeId: "EMP-001", employeeName: "John Smith", advanceType: "Salary Advance", requestDate: "2024-11-15", amount: 2000, approvedAmount: 2000, repaidAmount: 500, balanceAmount: 1500, installments: 4, completedInstallments: 1, status: "Repaying" },
    { id: "2", advanceId: "ADV-2024-002", employeeId: "EMP-002", employeeName: "Sarah Johnson", advanceType: "Emergency Advance", requestDate: "2024-11-20", amount: 1500, approvedAmount: 1500, repaidAmount: 0, balanceAmount: 1500, installments: 3, completedInstallments: 0, status: "Approved" },
    { id: "3", advanceId: "ADV-2024-003", employeeId: "EMP-003", employeeName: "Michael Brown", advanceType: "Travel Advance", requestDate: "2024-11-18", amount: 3000, approvedAmount: 2500, repaidAmount: 0, balanceAmount: 2500, installments: 5, completedInstallments: 0, status: "Disbursed" },
    { id: "4", advanceId: "ADV-2024-004", employeeId: "EMP-004", employeeName: "Emily Davis", advanceType: "Salary Advance", requestDate: "2024-11-25", amount: 1800, approvedAmount: 0, repaidAmount: 0, balanceAmount: 0, installments: 0, completedInstallments: 0, status: "Pending" },
    { id: "5", advanceId: "ADV-2024-005", employeeId: "EMP-005", employeeName: "David Wilson", advanceType: "Project Advance", requestDate: "2024-10-10", amount: 4000, approvedAmount: 4000, repaidAmount: 4000, balanceAmount: 0, installments: 4, completedInstallments: 4, status: "Completed" },
    { id: "6", advanceId: "ADV-2024-006", employeeId: "EMP-006", employeeName: "Lisa Martinez", advanceType: "Salary Advance", requestDate: "2024-11-22", amount: 2500, approvedAmount: 0, repaidAmount: 0, balanceAmount: 0, installments: 0, completedInstallments: 0, status: "Rejected" },
    { id: "7", advanceId: "ADV-2024-007", employeeId: "EMP-007", employeeName: "Tom Anderson", advanceType: "Emergency Advance", requestDate: "2024-11-10", amount: 1200, approvedAmount: 1200, repaidAmount: 800, balanceAmount: 400, installments: 3, completedInstallments: 2, status: "Repaying" },
    { id: "8", advanceId: "ADV-2024-008", employeeId: "EMP-008", employeeName: "Rachel Green", advanceType: "Salary Advance", requestDate: "2024-11-28", amount: 1600, approvedAmount: 1600, repaidAmount: 0, balanceAmount: 1600, installments: 4, completedInstallments: 0, status: "Approved" },
  ];

  const filteredAdvances = advances.filter((advance) => {
    const matchesSearch = advance.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || advance.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) || advance.advanceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "All Statuses" || advance.status === selectedStatus;
    const matchesType = selectedType === "All Types" || advance.advanceType === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-50 text-green-600";
      case "Repaying": return "bg-blue-50 text-blue-600";
      case "Disbursed": return "bg-purple-50 text-purple-600";
      case "Approved": return "bg-teal-50 text-teal-600";
      case "Pending": return "bg-orange-50 text-orange-600";
      case "Rejected": return "bg-red-50 text-red-600";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Advance</h1>
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
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
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
          <thead>
            <tr className="bg-blue-800">
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Advance ID</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Employee</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Type</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Request Date</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Amount</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Repaid</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Balance</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Installments</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvances.map((advance) => (
              <tr key={advance.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900">{advance.advanceId}</p></td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{advance.employeeName}</p>
                  <p className="text-[12px] text-slate-500">{advance.employeeId}</p>
                </td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{advance.advanceType}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{formatDate(advance.requestDate)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{formatCurrency(advance.approvedAmount)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-green-600">{formatCurrency(advance.repaidAmount)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-orange-600">{formatCurrency(advance.balanceAmount)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{advance.completedInstallments} / {advance.installments}</p></td>
                <td className="px-4 py-4 text-center"><span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(advance.status)}`}>{advance.status}</span></td>
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