import { useState } from "react";
import { Search, Download, Upload, ChevronDown, MoreHorizontal, FileText, X, Edit, Trash2, Eye } from "lucide-react";
import { ContractDetailsView } from "./ContractDetailsView";

interface Contract {
  id: number;
  employeeName: string;
  contractType: "Staff" | "Consultant" | "National Service Personnel" | "Intern";
  position: string;
  department: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Pending" | "Terminated";
}

const mockContracts: Contract[] = [
  {
    id: 1,
    employeeName: "Yaw Osei",
    contractType: "Staff",
    position: "Senior Project Manager",
    department: "Project Management",
    startDate: "Jan 15, 2023",
    endDate: "N/A",
    status: "Active"
  },
  {
    id: 2,
    employeeName: "Kofi Mensah",
    contractType: "Staff",
    position: "Finance Officer",
    department: "Financial Management",
    startDate: "Mar 10, 2023",
    endDate: "N/A",
    status: "Active"
  },
  {
    id: 3,
    employeeName: "Ama Darko",
    contractType: "Consultant",
    position: "HR Consultant",
    department: "HR Management",
    startDate: "Feb 5, 2023",
    endDate: "Feb 5, 2026",
    status: "Active"
  },
  {
    id: 4,
    employeeName: "Kwesi Appiah",
    contractType: "Consultant",
    position: "M&E Specialist",
    department: "Monitoring & Evaluation",
    startDate: "Apr 20, 2023",
    endDate: "Apr 20, 2024",
    status: "Expired"
  },
  {
    id: 5,
    employeeName: "Nana Yaw",
    contractType: "Staff",
    position: "Procurement Officer",
    department: "Procurement",
    startDate: "May 8, 2022",
    endDate: "N/A",
    status: "Active"
  },
  {
    id: 6,
    employeeName: "Kwaku Anane",
    contractType: "National Service Personnel",
    position: "Research Assistant",
    department: "Project Management",
    startDate: "Dec 1, 2025",
    endDate: "Dec 1, 2026",
    status: "Pending"
  },
  {
    id: 7,
    employeeName: "Abena Owusu",
    contractType: "Intern",
    position: "Finance Intern",
    department: "Financial Management",
    startDate: "Sep 1, 2025",
    endDate: "Nov 30, 2025",
    status: "Terminated"
  },
  {
    id: 8,
    employeeName: "Efua Mensah",
    contractType: "National Service Personnel",
    position: "Admin Support",
    department: "HR Management",
    startDate: "Oct 1, 2025",
    endDate: "Sep 30, 2026",
    status: "Active"
  },
  {
    id: 9,
    employeeName: "Akosua Boateng",
    contractType: "Intern",
    position: "IT Intern",
    department: "IT & Systems",
    startDate: "Jan 15, 2026",
    endDate: "Apr 15, 2026",
    status: "Active"
  }
];

const departments = ["All Departments", "Project Management", "Financial Management", "HR Management", "Monitoring & Evaluation", "Procurement", "IT & Systems"];
const contractTypes = ["All Types", "Staff", "Consultant", "National Service Personnel", "Intern"];
const statuses = ["All Statuses", "Active", "Expired", "Pending", "Terminated"];

export function Contracts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedContractType, setSelectedContractType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState<"All" | "Staff" | "Consultant" | "National Service Personnel" | "Intern">("All");
  
  // Dropdown states
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState<number | null>(null);
  
  // Modal states
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  // Classification tabs
  const tabs: { label: string; value: "All" | "Staff" | "Consultant" | "National Service Personnel" | "Intern"; count: number }[] = [
    { label: "All", value: "All", count: mockContracts.length },
    { label: "Staff", value: "Staff", count: mockContracts.filter(c => c.contractType === "Staff").length },
    { label: "Consultant", value: "Consultant", count: mockContracts.filter(c => c.contractType === "Consultant").length },
    { label: "National Service Personnel", value: "National Service Personnel", count: mockContracts.filter(c => c.contractType === "National Service Personnel").length },
    { label: "Interns", value: "Intern", count: mockContracts.filter(c => c.contractType === "Intern").length },
  ];

  // Filter contracts
  const filteredContracts = mockContracts.filter((contract) => {
    const matchesSearch = contract.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "All Departments" || contract.department === selectedDepartment;
    const matchesType = selectedContractType === "All Types" || contract.contractType === selectedContractType;
    const matchesStatus = selectedStatus === "All Statuses" || contract.status === selectedStatus;
    const matchesTab = activeTab === "All" || contract.contractType === activeTab;
    
    return matchesSearch && matchesDepartment && matchesType && matchesStatus && matchesTab;
  });

  return (
    <>
      {showDetailView && selectedContract ? (
        <ContractDetailsView 
          contract={selectedContract} 
          onBack={() => {
            setShowDetailView(false);
            setSelectedContract(null);
          }} 
        />
      ) : (
        <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-white">
            <h1 className="text-2xl font-semibold text-slate-900">Employee Contracts</h1>
          </div>

          {/* Classification Tabs */}
          <div className="px-6 bg-white border-b border-slate-200">
            <div className="flex gap-0">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-5 py-3 text-sm border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.value
                      ? "border-purple-700 text-purple-700 font-medium"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 text-[11px] px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.value
                      ? "bg-purple-100 text-purple-700"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters Bar */}
          <div className="px-6 py-4 bg-white border-b border-slate-200">
            <div className="flex items-center justify-between gap-3">
              {/* Search */}
              <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
                <Search size={20} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2.5">
                <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
                  <span className="text-sm text-slate-900">Export</span>
                  <Download size={16} className="text-purple-700" />
                </button>

                <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
                  <span className="text-sm text-slate-900">Upload CSV</span>
                  <Upload size={16} className="text-purple-700" />
                </button>

                {/* Department Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowDepartmentDropdown(!showDepartmentDropdown);
                      setShowTypeDropdown(false);
                      setShowStatusDropdown(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <span className="text-sm text-slate-900">{selectedDepartment}</span>
                    <ChevronDown size={16} className="text-purple-700" />
                  </button>
                  {showDepartmentDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowDepartmentDropdown(false)} />
                      <div className="absolute top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                        {departments.map((dept) => (
                          <button
                            key={dept}
                            onClick={() => {
                              setSelectedDepartment(dept);
                              setShowDepartmentDropdown(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                          >
                            {dept}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Contract Type Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowTypeDropdown(!showTypeDropdown);
                      setShowDepartmentDropdown(false);
                      setShowStatusDropdown(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <span className="text-sm text-slate-900">{selectedContractType}</span>
                    <ChevronDown size={16} className="text-purple-700" />
                  </button>
                  {showTypeDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowTypeDropdown(false)} />
                      <div className="absolute top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                        {contractTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setSelectedContractType(type);
                              setShowTypeDropdown(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowStatusDropdown(!showStatusDropdown);
                      setShowDepartmentDropdown(false);
                      setShowTypeDropdown(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <span className="text-sm text-slate-900">{selectedStatus}</span>
                    <ChevronDown size={16} className="text-purple-700" />
                  </button>
                  {showStatusDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                      <div className="absolute top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                        {statuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setSelectedStatus(status);
                              setShowStatusDropdown(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto bg-white">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Employee Name
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Position
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Department
                  </th>
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Contract Type
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Start Date
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    End Date
                  </th>
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Status
                  </th>
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="text-[12px] font-medium text-black">{contract.employeeName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{contract.position}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{contract.department}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${
                        contract.contractType === "Staff" 
                          ? "bg-blue-50 text-blue-600" 
                          : contract.contractType === "Consultant"
                          ? "bg-purple-50 text-purple-600"
                          : contract.contractType === "National Service Personnel"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {contract.contractType}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{contract.startDate}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{contract.endDate}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${
                        contract.status === "Active" 
                          ? "bg-green-50 text-green-600" 
                          : contract.status === "Expired"
                          ? "bg-red-50 text-red-600"
                          : contract.status === "Pending"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="relative inline-block">
                        <button 
                          onClick={() => setShowActionDropdown(showActionDropdown === contract.id ? null : contract.id)}
                          className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                        >
                          <MoreHorizontal size={20} className="text-blue-800" />
                        </button>
                        {showActionDropdown === contract.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowActionDropdown(null)} />
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                              <button
                                onClick={() => {
                                  setSelectedContract(contract);
                                  setShowDetailView(true);
                                  setShowActionDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                View Contract
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Edit contract:", contract);
                                  setShowActionDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                Edit Contract
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Terminate contract:", contract);
                                  setShowActionDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Terminate
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredContracts.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <p className="text-slate-500">No contracts found matching your filters.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
              >
                <ChevronDown size={16} className="rotate-90 text-pink-600" />
              </button>
              
              <button className="px-3 py-2 text-sm bg-pink-50 text-pink-600 rounded transition-colors">
                1
              </button>
              
              <button className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors">
                2
              </button>
              
              <button className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors">
                ...
              </button>
              
              <button className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors">
                5
              </button>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
              >
                <ChevronDown size={16} className="-rotate-90 text-pink-600" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}