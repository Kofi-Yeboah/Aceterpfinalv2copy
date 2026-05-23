import { useState } from "react";
import { Search, Download, Upload, ChevronDown, MoreVertical, Plus, X, ArrowLeft } from "lucide-react";

const STATUSES = ["All Statuses", "Active", "Inactive"];

export function PayrollManagementAllowances() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  // Allowance components with attached staff
  const allowanceComponents = [
    {
      id: "a1", name: "Housing Allowance", frequency: "Monthly", status: "Active",
      staff: [
        { employeeId: "EMP-001", employeeName: "John Smith", department: "Engineering", position: "Senior Developer", amount: 500 },
        { employeeId: "EMP-002", employeeName: "Sarah Johnson", department: "Sales", position: "Sales Manager", amount: 600 },
        { employeeId: "EMP-003", employeeName: "Michael Brown", department: "Marketing", position: "Marketing Lead", amount: 400 },
        { employeeId: "EMP-004", employeeName: "Emily Davis", department: "Operations", position: "Operations Manager", amount: 450 },
        { employeeId: "EMP-005", employeeName: "David Wilson", department: "HR", position: "HR Manager", amount: 350 },
        { employeeId: "EMP-006", employeeName: "Lisa Martinez", department: "Finance", position: "Financial Analyst", amount: 300 },
        { employeeId: "EMP-007", employeeName: "Tom Anderson", department: "Engineering", position: "Frontend Developer", amount: 400 },
        { employeeId: "EMP-008", employeeName: "Rachel Green", department: "Sales", position: "Account Executive", amount: 500 },
      ],
    },
    {
      id: "a2", name: "Transport Allowance", frequency: "Monthly", status: "Active",
      staff: [
        { employeeId: "EMP-001", employeeName: "John Smith", department: "Engineering", position: "Senior Developer", amount: 300 },
        { employeeId: "EMP-002", employeeName: "Sarah Johnson", department: "Sales", position: "Sales Manager", amount: 400 },
        { employeeId: "EMP-003", employeeName: "Michael Brown", department: "Marketing", position: "Marketing Lead", amount: 250 },
        { employeeId: "EMP-004", employeeName: "Emily Davis", department: "Operations", position: "Operations Manager", amount: 300 },
        { employeeId: "EMP-005", employeeName: "David Wilson", department: "HR", position: "HR Manager", amount: 200 },
        { employeeId: "EMP-006", employeeName: "Lisa Martinez", department: "Finance", position: "Financial Analyst", amount: 200 },
        { employeeId: "EMP-007", employeeName: "Tom Anderson", department: "Engineering", position: "Frontend Developer", amount: 250 },
        { employeeId: "EMP-008", employeeName: "Rachel Green", department: "Sales", position: "Account Executive", amount: 350 },
      ],
    },
    {
      id: "a3", name: "Medical Allowance", frequency: "Monthly", status: "Active",
      staff: [
        { employeeId: "EMP-001", employeeName: "John Smith", department: "Engineering", position: "Senior Developer", amount: 200 },
        { employeeId: "EMP-002", employeeName: "Sarah Johnson", department: "Sales", position: "Sales Manager", amount: 250 },
        { employeeId: "EMP-003", employeeName: "Michael Brown", department: "Marketing", position: "Marketing Lead", amount: 150 },
        { employeeId: "EMP-004", employeeName: "Emily Davis", department: "Operations", position: "Operations Manager", amount: 200 },
        { employeeId: "EMP-005", employeeName: "David Wilson", department: "HR", position: "HR Manager", amount: 150 },
        { employeeId: "EMP-006", employeeName: "Lisa Martinez", department: "Finance", position: "Financial Analyst", amount: 150 },
        { employeeId: "EMP-007", employeeName: "Tom Anderson", department: "Engineering", position: "Frontend Developer", amount: 150 },
        { employeeId: "EMP-008", employeeName: "Rachel Green", department: "Sales", position: "Account Executive", amount: 200 },
      ],
    },
    {
      id: "a4", name: "Car Allowance", frequency: "Monthly", status: "Active",
      staff: [
        { employeeId: "EMP-002", employeeName: "Sarah Johnson", department: "Sales", position: "Sales Manager", amount: 350 },
        { employeeId: "EMP-004", employeeName: "Emily Davis", department: "Operations", position: "Operations Manager", amount: 300 },
        { employeeId: "EMP-008", employeeName: "Rachel Green", department: "Sales", position: "Account Executive", amount: 250 },
      ],
    },
    {
      id: "a5", name: "Utility Allowance", frequency: "Monthly", status: "Active",
      staff: [
        { employeeId: "EMP-001", employeeName: "John Smith", department: "Engineering", position: "Senior Developer", amount: 200 },
        { employeeId: "EMP-005", employeeName: "David Wilson", department: "HR", position: "HR Manager", amount: 100 },
        { employeeId: "EMP-007", employeeName: "Tom Anderson", department: "Engineering", position: "Frontend Developer", amount: 150 },
      ],
    },
    {
      id: "a6", name: "Meal Allowance", frequency: "Monthly", status: "Active",
      staff: [
        { employeeId: "EMP-002", employeeName: "Sarah Johnson", department: "Sales", position: "Sales Manager", amount: 300 },
        { employeeId: "EMP-003", employeeName: "Michael Brown", department: "Marketing", position: "Marketing Lead", amount: 200 },
        { employeeId: "EMP-006", employeeName: "Lisa Martinez", department: "Finance", position: "Financial Analyst", amount: 200 },
        { employeeId: "EMP-008", employeeName: "Rachel Green", department: "Sales", position: "Account Executive", amount: 250 },
      ],
    },
    {
      id: "a7", name: "Education Allowance", frequency: "Quarterly", status: "Active",
      staff: [
        { employeeId: "EMP-004", employeeName: "Emily Davis", department: "Operations", position: "Operations Manager", amount: 500 },
        { employeeId: "EMP-005", employeeName: "David Wilson", department: "HR", position: "HR Manager", amount: 400 },
      ],
    },
    {
      id: "a8", name: "Communication Allowance", frequency: "Monthly", status: "Inactive",
      staff: [
        { employeeId: "EMP-006", employeeName: "Lisa Martinez", department: "Finance", position: "Financial Analyst", amount: 150 },
        { employeeId: "EMP-007", employeeName: "Tom Anderson", department: "Engineering", position: "Frontend Developer", amount: 150 },
      ],
    },
  ];

  const filteredComponents = allowanceComponents.filter((comp) => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "All Statuses" || comp.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-50 text-green-600";
      case "Inactive": return "bg-slate-50 text-slate-600";
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
            <input type="text" placeholder="Search allowances..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400" />
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
              <button onClick={() => setShowStatusDropdown(!showStatusDropdown)} className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
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
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Allowance Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Frequency</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">No. of Staff</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Total Amount</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredComponents.map((comp) => {
              const totalAmount = comp.staff.reduce((sum, s) => sum + s.amount, 0);
              return (
                <tr key={comp.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900">{comp.name}</p></td>
                  <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{comp.frequency}</p></td>
                  <td className="px-4 py-4 text-center"><p className="text-[12px] font-medium text-slate-900">{comp.staff.length}</p></td>
                  <td className="px-4 py-4 text-right"><p className="text-[12px] font-semibold text-green-700">{formatCurrency(totalAmount)}</p></td>
                  <td className="px-4 py-4 text-center"><span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(comp.status)}`}>{comp.status}</span></td>
                  <td className="px-4 py-4 text-center">
                    <button onClick={() => setSelectedComponent(comp.id)} className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors">
                      <MoreVertical size={20} className="text-blue-800" />
                    </button>
                  </td>
                </tr>
              );
            })}
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

      {/* Allowance Detail Modal - Staff List */}
      {selectedComponent && (() => {
        const comp = allowanceComponents.find(c => c.id === selectedComponent);
        if (!comp) return null;
        const totalAmount = comp.staff.reduce((sum, s) => sum + s.amount, 0);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedComponent(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedComponent(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                    <ArrowLeft size={16} className="text-slate-600" />
                  </button>
                  <div>
                    <h2 className="text-[15px] font-semibold text-slate-900">{comp.name}</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {comp.frequency} &middot; {comp.staff.length} staff attached
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ml-2 ${getStatusColor(comp.status)}`}>{comp.status}</span>
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedComponent(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                  <X size={16} className="text-slate-500" />
                </button>
              </div>

              {/* Summary Cards */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Staff Count</p>
                    <p className="text-[20px] font-semibold text-slate-900 mt-1">{comp.staff.length}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Amount</p>
                    <p className="text-[20px] font-semibold text-green-700 mt-1">{formatCurrency(totalAmount)}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Avg. Per Staff</p>
                    <p className="text-[20px] font-semibold text-slate-900 mt-1">{formatCurrency(Math.round(totalAmount / comp.staff.length))}</p>
                  </div>
                </div>
              </div>

              {/* Staff Tab */}
              <div className="px-6 pt-4 pb-2 bg-white shrink-0">
                <div className="bg-slate-100 p-1 rounded-lg inline-flex">
                  <button className="px-4 py-1.5 rounded-lg text-sm bg-[#0B01D0] text-white shadow-sm min-w-[120px]">
                    Staff List
                  </button>
                </div>
              </div>

              {/* Staff Table */}
              <div className="flex-1 overflow-y-auto px-6 pb-4">
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mt-3">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Employee ID</th>
                        <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Employee Name</th>
                        <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Department</th>
                        <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Position</th>
                        <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comp.staff.map((s, i) => (
                        <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-3 text-[12px] font-mono text-slate-700">{s.employeeId}</td>
                          <td className="px-4 py-3 text-[12px] text-slate-900 font-medium">{s.employeeName}</td>
                          <td className="px-4 py-3 text-[12px] text-slate-500">{s.department}</td>
                          <td className="px-4 py-3 text-[12px] text-slate-500">{s.position}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-[12px] font-mono font-medium text-green-700">{formatCurrency(s.amount)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-right text-[12px] font-semibold text-slate-700">Total</td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-[12px] font-mono font-bold text-green-700">{formatCurrency(totalAmount)}</span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end shrink-0">
                <button onClick={() => setSelectedComponent(null)} className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50">
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
