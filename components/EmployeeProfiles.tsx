import { useState } from "react";
import { Search, Download, Upload, ChevronDown, MoreHorizontal, UserPlus, X, Edit, Trash2, Eye } from "lucide-react";
import { EmployeeProfileDetailsView } from "./EmployeeProfileDetailsView";
import { AddNewEmployeeForm } from "./AddNewEmployeeForm";

interface EmployeeProfile {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  joinDate: string;
  status: "Active" | "On Leave" | "Inactive";
  phone: string;
}

const mockProfiles: EmployeeProfile[] = [
  {
    id: 1,
    name: "Yaw Osei",
    email: "yaw.osei@company.com",
    position: "Senior Project Manager",
    department: "Project Management",
    joinDate: "Jan 15, 2023",
    status: "Active",
    phone: "+233 24 123 4567"
  },
  {
    id: 2,
    name: "Kofi Mensah",
    email: "kofi.mensah@company.com",
    position: "Finance Officer",
    department: "Financial Management",
    joinDate: "Mar 10, 2023",
    status: "Active",
    phone: "+233 20 234 5678"
  },
  {
    id: 3,
    name: "Ama Darko",
    email: "ama.darko@company.com",
    position: "HR Manager",
    department: "HR Management",
    joinDate: "Feb 5, 2023",
    status: "On Leave",
    phone: "+233 24 345 6789"
  },
  {
    id: 4,
    name: "Kwesi Appiah",
    email: "kwesi.appiah@company.com",
    position: "M&E Specialist",
    department: "Monitoring & Evaluation",
    joinDate: "Apr 20, 2023",
    status: "Active",
    phone: "+233 27 456 7890"
  },
  {
    id: 5,
    name: "Nana Yaw",
    email: "nana.yaw@company.com",
    position: "Procurement Officer",
    department: "Procurement",
    joinDate: "May 8, 2022",
    status: "Inactive",
    phone: "+233 26 567 8901"
  }
];

const departments = ["All Departments", "Project Management", "Financial Management", "HR Management", "Monitoring & Evaluation", "Procurement"];
const positions = ["All Positions", "Senior Project Manager", "Finance Officer", "HR Manager", "M&E Specialist", "Procurement Officer"];
const statuses = ["All Statuses", "Active", "On Leave", "Inactive"];

export function EmployeeProfiles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedPosition, setSelectedPosition] = useState("All Positions");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Dropdown states
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState<number | null>(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<EmployeeProfile | null>(null);

  // Filter profiles
  const filteredProfiles = mockProfiles.filter((profile) => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "All Departments" || profile.department === selectedDepartment;
    const matchesPosition = selectedPosition === "All Positions" || profile.position === selectedPosition;
    const matchesStatus = selectedStatus === "All Statuses" || profile.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesPosition && matchesStatus;
  });

  const getStatusColor = (status: "Active" | "On Leave" | "Inactive") => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-600";
      case "On Leave":
        return "bg-amber-50 text-amber-600";
      case "Inactive":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <>
      {showDetailView && selectedProfile ? (
        <EmployeeProfileDetailsView 
          profile={selectedProfile} 
          onBack={() => {
            setShowDetailView(false);
            setSelectedProfile(null);
          }} 
        />
      ) : (
        <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-slate-900">Employee Profiles</h1>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2"
            >
              <UserPlus size={16} />
              Add Employee
            </button>
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
                      setShowPositionDropdown(false);
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

                {/* Position Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowPositionDropdown(!showPositionDropdown);
                      setShowDepartmentDropdown(false);
                      setShowStatusDropdown(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <span className="text-sm text-slate-900">{selectedPosition}</span>
                    <ChevronDown size={16} className="text-purple-700" />
                  </button>
                  {showPositionDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowPositionDropdown(false)} />
                      <div className="absolute top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                        {positions.map((pos) => (
                          <button
                            key={pos}
                            onClick={() => {
                              setSelectedPosition(pos);
                              setShowPositionDropdown(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                          >
                            {pos}
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
                      setShowPositionDropdown(false);
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
              <thead>
                <tr className="bg-blue-800">
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Employee Name
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Position
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Department
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Phone
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Join Date
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
                {filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="text-[12px] font-medium text-black">{profile.name}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{profile.position}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{profile.department}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{profile.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{profile.phone}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{profile.joinDate}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(profile.status)}`}>
                        {profile.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="relative inline-block">
                        <button 
                          onClick={() => setShowActionDropdown(showActionDropdown === profile.id ? null : profile.id)}
                          className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                        >
                          <MoreHorizontal size={20} className="text-blue-800" />
                        </button>
                        {showActionDropdown === profile.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowActionDropdown(null)} />
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                              <button
                                onClick={() => {
                                  setSelectedProfile(profile);
                                  setShowDetailView(true);
                                  setShowActionDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                View Profile
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Edit profile:", profile);
                                  setShowActionDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                Edit Profile
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Terminate employee:", profile);
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
            
            {filteredProfiles.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <p className="text-slate-500">No employee profiles found matching your filters.</p>
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

          {/* Add Employee Modal */}
          {showAddModal && (
            <AddNewEmployeeForm
              onClose={() => setShowAddModal(false)}
              onSubmit={(data) => {
                console.log("Adding employee:", data);
                setShowAddModal(false);
              }}
              departments={departments}
              positions={positions}
            />
          )}
        </div>
      )}
    </>
  );
}