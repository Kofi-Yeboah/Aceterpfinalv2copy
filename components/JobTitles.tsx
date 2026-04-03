import { useState } from "react";
import { Search, Download, Upload, ChevronDown, MoreHorizontal, Plus, X, Edit, Trash2, Eye } from "lucide-react";
import { JobTitleDetailsView } from "./JobTitleDetailsView";

interface JobTitle {
  id: number;
  title: string;
  department: string;
  level: string;
  grade: string;
  employeeCount: number;
  salaryRange: string;
  status: "Active" | "Inactive";
}

const mockJobTitles: JobTitle[] = [
  {
    id: 1,
    title: "Senior Project Manager",
    department: "Project Management",
    level: "Senior",
    grade: "Grade 10",
    employeeCount: 5,
    salaryRange: "$60,000 - $80,000",
    status: "Active"
  },
  {
    id: 2,
    title: "Finance Officer",
    department: "Financial Management",
    level: "Mid-Level",
    grade: "Grade 7",
    employeeCount: 8,
    salaryRange: "$40,000 - $55,000",
    status: "Active"
  },
  {
    id: 3,
    title: "HR Manager",
    department: "HR Management",
    level: "Senior",
    grade: "Grade 9",
    employeeCount: 3,
    salaryRange: "$55,000 - $70,000",
    status: "Active"
  },
  {
    id: 4,
    title: "M&E Specialist",
    department: "Monitoring & Evaluation",
    level: "Mid-Level",
    grade: "Grade 8",
    employeeCount: 6,
    salaryRange: "$45,000 - $60,000",
    status: "Active"
  },
  {
    id: 5,
    title: "Procurement Officer",
    department: "Procurement",
    level: "Junior",
    grade: "Grade 6",
    employeeCount: 4,
    salaryRange: "$35,000 - $45,000",
    status: "Active"
  },
  {
    id: 6,
    title: "Administrative Assistant",
    department: "HR Management",
    level: "Entry",
    grade: "Grade 4",
    employeeCount: 0,
    salaryRange: "$25,000 - $32,000",
    status: "Inactive"
  }
];

const departments = ["All Departments", "Project Management", "Financial Management", "HR Management", "Monitoring & Evaluation", "Procurement"];
const levels = ["All Levels", "Entry", "Junior", "Mid-Level", "Senior", "Executive"];
const statuses = ["All Statuses", "Active", "Inactive"];
const grades = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"];

export function JobTitles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Dropdown states
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState<number | null>(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState<JobTitle | null>(null);
  const [newJobTitle, setNewJobTitle] = useState({
    title: "",
    department: "",
    level: "Mid-Level",
    grade: "Grade 5",
    salaryRange: "",
    description: "",
    requirements: ""
  });

  // Filter job titles
  const filteredJobTitles = mockJobTitles.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "All Departments" || job.department === selectedDepartment;
    const matchesLevel = selectedLevel === "All Levels" || job.level === selectedLevel;
    const matchesStatus = selectedStatus === "All Statuses" || job.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesLevel && matchesStatus;
  });

  const handleAddJobTitle = () => {
    console.log("Adding job title:", newJobTitle);
    setShowAddModal(false);
    setNewJobTitle({
      title: "",
      department: "",
      level: "Mid-Level",
      grade: "Grade 5",
      salaryRange: "",
      description: "",
      requirements: ""
    });
  };

  return (
    <>
      {showDetailView && selectedJobTitle ? (
        <JobTitleDetailsView 
          jobTitle={selectedJobTitle} 
          onBack={() => {
            setShowDetailView(false);
            setSelectedJobTitle(null);
          }} 
        />
      ) : (
        <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-slate-900">Job Titles</h1>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus size={16} />
              Add Job Title
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
                      setShowLevelDropdown(false);
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

                {/* Level Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowLevelDropdown(!showLevelDropdown);
                      setShowDepartmentDropdown(false);
                      setShowStatusDropdown(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <span className="text-sm text-slate-900">{selectedLevel}</span>
                    <ChevronDown size={16} className="text-purple-700" />
                  </button>
                  {showLevelDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowLevelDropdown(false)} />
                      <div className="absolute top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                        {levels.map((level) => (
                          <button
                            key={level}
                            onClick={() => {
                              setSelectedLevel(level);
                              setShowLevelDropdown(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                          >
                            {level}
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
                      setShowLevelDropdown(false);
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
                    Job Title
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Department
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Level
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Grade
                  </th>
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Employees
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Salary Range
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
                {filteredJobTitles.map((job) => (
                  <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="text-[12px] font-medium text-black">{job.title}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{job.department}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{job.level}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{job.grade}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <p className="text-[12px] font-medium text-slate-900">{job.employeeCount}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{job.salaryRange}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="relative inline-block">
                        <button 
                          onClick={() => setShowActionDropdown(showActionDropdown === job.id ? null : job.id)}
                          className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                        >
                          <MoreHorizontal size={20} className="text-blue-800" />
                        </button>
                        {showActionDropdown === job.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowActionDropdown(null)} />
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                              <button
                                onClick={() => {
                                  setSelectedJobTitle(job);
                                  setShowDetailView(true);
                                  setShowActionDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Edit job title:", job);
                                  setShowActionDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Delete job title:", job);
                                  setShowActionDropdown(null);
                                }}
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
            
            {filteredJobTitles.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <p className="text-slate-500">No job titles found matching your filters.</p>
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

          {/* Add Job Title Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900">Add Job Title</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-slate-500" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-slate-700">Job Title</label>
                        <input
                          type="text"
                          value={newJobTitle.title}
                          onChange={(e) => setNewJobTitle({ ...newJobTitle, title: e.target.value })}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g. Senior Data Analyst"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-slate-700">Department</label>
                        <select
                          value={newJobTitle.department}
                          onChange={(e) => setNewJobTitle({ ...newJobTitle, department: e.target.value })}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select Department</option>
                          {departments.slice(1).map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-slate-700">Level</label>
                        <select
                          value={newJobTitle.level}
                          onChange={(e) => setNewJobTitle({ ...newJobTitle, level: e.target.value })}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {levels.slice(1).map((level) => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-slate-700">Grade</label>
                        <select
                          value={newJobTitle.grade}
                          onChange={(e) => setNewJobTitle({ ...newJobTitle, grade: e.target.value })}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {grades.map((grade) => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-slate-700">Salary Range</label>
                      <input
                        type="text"
                        value={newJobTitle.salaryRange}
                        onChange={(e) => setNewJobTitle({ ...newJobTitle, salaryRange: e.target.value })}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g. $45,000 - $60,000"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-slate-700">Job Description</label>
                      <textarea
                        value={newJobTitle.description}
                        onChange={(e) => setNewJobTitle({ ...newJobTitle, description: e.target.value })}
                        rows={3}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        placeholder="Describe the role and responsibilities..."
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-slate-700">Requirements & Qualifications</label>
                      <textarea
                        value={newJobTitle.requirements}
                        onChange={(e) => setNewJobTitle({ ...newJobTitle, requirements: e.target.value })}
                        rows={3}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        placeholder="List the required qualifications..."
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddJobTitle}
                    disabled={!newJobTitle.title || !newJobTitle.department}
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Job Title
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function getStatusColor(status: "Active" | "Inactive"): string {
  return status === "Active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600";
}