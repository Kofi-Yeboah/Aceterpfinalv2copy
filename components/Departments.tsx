import { useState } from "react";
import { Search, Plus, X, MoreHorizontal, ChevronDown } from "lucide-react";

interface Department {
  id: string;
  department: string;
  description: string;
  departmentHead: string;
}

const mockDepartments: Department[] = [
  {
    id: "DEPT-001",
    department: "Project Management",
    description: "Oversees planning, execution, and delivery of all organizational projects.",
    departmentHead: "James Osei",
  },
  {
    id: "DEPT-002",
    department: "Financial Management",
    description: "Responsible for budgeting, accounting, financial reporting, and fiscal control.",
    departmentHead: "Abena Mensah",
  },
  {
    id: "DEPT-003",
    department: "HR Management",
    description: "Handles recruitment, employee relations, performance, training, and payroll.",
    departmentHead: "Kwame Asante",
  },
  {
    id: "DEPT-004",
    department: "Monitoring & Evaluation",
    description: "Tracks program performance, collects data, and evaluates impact of interventions.",
    departmentHead: "Ama Boateng",
  },
  {
    id: "DEPT-005",
    department: "Procurement",
    description: "Manages sourcing, purchasing, supplier relations, and contract administration.",
    departmentHead: "Kofi Agyemang",
  },
  {
    id: "DEPT-006",
    department: "Legal & Compliance",
    description: "Ensures organizational adherence to legal requirements and internal policies.",
    departmentHead: "Efua Darko",
  },
  {
    id: "DEPT-007",
    department: "Communications",
    description: "Manages internal and external communications, branding, and public relations.",
    departmentHead: "Yaw Frimpong",
  },
  {
    id: "DEPT-008",
    department: "Information Technology",
    description: "Maintains IT infrastructure, software systems, and digital security.",
    departmentHead: "Akua Appiah",
  },
];

interface NewDepartment {
  department: string;
  description: string;
  departmentHead: string;
}

export function Departments() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [newDepartment, setNewDepartment] = useState<NewDepartment>({
    department: "",
    description: "",
    departmentHead: "",
  });

  const filteredDepartments = departments.filter((dept) => {
    const q = searchQuery.toLowerCase();
    return (
      dept.id.toLowerCase().includes(q) ||
      dept.department.toLowerCase().includes(q) ||
      dept.description.toLowerCase().includes(q) ||
      dept.departmentHead.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredDepartments.length / itemsPerPage));
  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const generateId = () => {
    const maxNum = departments.reduce((max, d) => {
      const num = parseInt(d.id.replace("DEPT-", ""), 10);
      return num > max ? num : max;
    }, 0);
    return `DEPT-${String(maxNum + 1).padStart(3, "0")}`;
  };

  const handleAddDepartment = () => {
    const newDept: Department = {
      id: generateId(),
      department: newDepartment.department,
      description: newDepartment.description,
      departmentHead: newDepartment.departmentHead,
    };
    setDepartments([...departments, newDept]);
    setShowAddModal(false);
    setNewDepartment({ department: "", description: "", departmentHead: "" });
  };

  const handleEditDepartment = () => {
    if (!selectedDept) return;
    setDepartments(
      departments.map((d) =>
        d.id === selectedDept.id ? selectedDept : d
      )
    );
    setShowEditModal(false);
    setSelectedDept(null);
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments(departments.filter((d) => d.id !== id));
    setShowActionDropdown(null);
  };

  const isAddFormValid =
    newDepartment.department.trim() !== "" &&
    newDepartment.departmentHead.trim() !== "";

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Departments</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={16} />
          Add Department
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-72">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X size={14} className="text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>
      </div>

      {/* Table — General Ledger pattern */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">
                Department ID
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">
                Department
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">
                Description
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">
                Department Head
              </th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedDepartments.map((dept, idx) => (
              <tr
                key={dept.id}
                className={`border-b border-slate-100 hover:bg-blue-50 transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                }`}
              >
                <td className="px-4 py-3">
                  <span className="text-[12px] font-medium text-blue-700">{dept.id}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[12px] font-medium text-slate-900">{dept.department}</span>
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <span className="text-[12px] text-slate-500 line-clamp-2">{dept.description}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[12px] text-slate-700">{dept.departmentHead}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="relative inline-block">
                    <button
                      onClick={() =>
                        setShowActionDropdown(
                          showActionDropdown === dept.id ? null : dept.id
                        )
                      }
                      className="inline-flex items-center justify-center w-8 h-8 hover:bg-slate-100 rounded transition-colors"
                    >
                      <MoreHorizontal size={18} className="text-blue-700" />
                    </button>
                    {showActionDropdown === dept.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowActionDropdown(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                          <button
                            onClick={() => {
                              setSelectedDept({ ...dept });
                              setShowEditModal(true);
                              setShowActionDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDepartment(dept.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Delete
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

        {filteredDepartments.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <p className="text-slate-500 text-sm">No departments found matching your search.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
          <span className="text-sm text-slate-500">
            Showing {filteredDepartments.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–
            {Math.min(currentPage * itemsPerPage, filteredDepartments.length)} of{" "}
            {filteredDepartments.length} departments
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-40"
          >
            <ChevronDown size={16} className="rotate-90 text-pink-600" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 text-sm rounded transition-colors ${
                page === currentPage
                  ? "bg-pink-50 text-pink-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-40"
          >
            <ChevronDown size={16} className="-rotate-90 text-pink-600" />
          </button>
        </div>
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Add Department</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewDepartment({ department: "", description: "", departmentHead: "" });
                }}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-slate-700">
                    Department Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newDepartment.department}
                    onChange={(e) =>
                      setNewDepartment({ ...newDepartment, department: e.target.value })
                    }
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. Information Technology"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-slate-700">
                    Department Head <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newDepartment.departmentHead}
                    onChange={(e) =>
                      setNewDepartment({ ...newDepartment, departmentHead: e.target.value })
                    }
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. John Mensah"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-slate-700">Description</label>
                  <textarea
                    value={newDepartment.description}
                    onChange={(e) =>
                      setNewDepartment({ ...newDepartment, description: e.target.value })
                    }
                    rows={4}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Briefly describe this department's role and responsibilities..."
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewDepartment({ department: "", description: "", departmentHead: "" });
                }}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDepartment}
                disabled={!isAddFormValid}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && selectedDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Edit Department</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDept(null);
                }}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-slate-700">Department ID</label>
                  <input
                    type="text"
                    value={selectedDept.id}
                    disabled
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-slate-700">
                    Department Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={selectedDept.department}
                    onChange={(e) =>
                      setSelectedDept({ ...selectedDept, department: e.target.value })
                    }
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-slate-700">
                    Department Head <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={selectedDept.departmentHead}
                    onChange={(e) =>
                      setSelectedDept({ ...selectedDept, departmentHead: e.target.value })
                    }
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-slate-700">Description</label>
                  <textarea
                    value={selectedDept.description}
                    onChange={(e) =>
                      setSelectedDept({ ...selectedDept, description: e.target.value })
                    }
                    rows={4}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDept(null);
                }}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditDepartment}
                disabled={
                  !selectedDept.department.trim() || !selectedDept.departmentHead.trim()
                }
                className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
