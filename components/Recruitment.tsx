import { useState } from "react";
import { Search, Download, Upload, ChevronDown, MoreHorizontal, Plus, X, Eye, ExternalLink } from "lucide-react";
import { JobPostingDetailsView } from "./JobPostingDetailsView";

interface JobPosting {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  status: "Open" | "Closed" | "Draft";
  applicants: number;
  datePosted: string;
  level?: string;
  grade?: string;
  salaryRange?: string;
  mprRef?: string;
}

const mockJobPostings: JobPosting[] = [
  {
    id: 1,
    title: "Senior Project Officer",
    department: "Project Management",
    location: "Accra Head Office",
    type: "Full-Time",
    status: "Open",
    applicants: 24,
    datePosted: "Feb 25, 2026",
    level: "Senior",
    grade: "Grade 9",
    salaryRange: "$55,000 - $70,000",
    mprRef: "MPR-2026-0018",
  },
  {
    id: 2,
    title: "Finance Assistant",
    department: "Finance",
    location: "Accra Head Office",
    type: "Full-Time",
    status: "Open",
    applicants: 18,
    datePosted: "Feb 20, 2026",
    level: "Junior",
    grade: "Grade 5",
    salaryRange: "$28,000 - $38,000",
    mprRef: "MPR-2026-0014",
  },
  {
    id: 3,
    title: "Communications Intern",
    department: "Communications",
    location: "Accra Head Office",
    type: "Intern",
    status: "Closed",
    applicants: 42,
    datePosted: "Jan 15, 2026",
    level: "Entry",
    grade: "Grade 2",
    salaryRange: "$12,000 - $18,000",
    mprRef: "MPR-2026-0010",
  },
  {
    id: 4,
    title: "M&E Specialist",
    department: "Monitoring & Evaluation",
    location: "Takoradi, Ghana",
    type: "Full-Time",
    status: "Closed",
    applicants: 15,
    datePosted: "Oct 28, 2025",
    level: "Mid-Level",
    grade: "Grade 8",
    salaryRange: "$45,000 - $60,000",
  },
  {
    id: 5,
    title: "HR Officer",
    department: "HR Management",
    location: "Accra, Ghana",
    type: "Contract",
    status: "Open",
    applicants: 32,
    datePosted: "Nov 10, 2025",
    level: "Mid-Level",
    grade: "Grade 7",
    salaryRange: "$40,000 - $55,000",
  },
];

const departments = [
  "All Departments",
  "Project Management",
  "Finance",
  "Communications",
  "HR Management",
  "Monitoring & Evaluation",
  "Procurement",
];
const statuses = ["All Statuses", "Open", "Closed", "Draft"];

interface RecruitmentProps {
  onNavigateToApplicationPortal?: () => void;
}

export function Recruitment({ onNavigateToApplicationPortal }: RecruitmentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Dropdown states
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState<number | null>(null);

  // Detail view
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  // Filter jobs
  const filteredJobs = mockJobPostings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All Departments" || job.department === selectedDepartment;
    const matchesStatus = selectedStatus === "All Statuses" || job.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: "Open" | "Closed" | "Draft") => {
    switch (status) {
      case "Open":
        return "bg-green-50 text-green-600";
      case "Closed":
        return "bg-red-50 text-red-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <>
      {showDetailView && selectedJob ? (
        <JobPostingDetailsView
          job={selectedJob}
          onBack={() => {
            setShowDetailView(false);
            setSelectedJob(null);
          }}
        />
      ) : (
        <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">Applicants</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] border border-emerald-200">
                {mockJobPostings.filter((j) => j.status === "Open").length} Open Positions
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] border border-blue-200">
                {mockJobPostings.reduce((s, j) => s + j.applicants, 0)} Total Applicants
              </span>
            </div>
            <button
              onClick={() => {
                if (onNavigateToApplicationPortal) {
                  onNavigateToApplicationPortal();
                }
              }}
              className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus size={16} />
              New Application
            </button>
          </div>

          {/* Info banner linking to Application Portal */}
          <div className="px-6 py-2.5 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
            <p className="text-[12px] text-blue-700">
              Applications are created via the <strong>Application Portal</strong> by linking to an approved Manpower Request.
            </p>
            <button
              onClick={() => onNavigateToApplicationPortal?.()}
              className="flex items-center gap-1.5 text-[12px] text-blue-700 hover:text-blue-900 font-medium transition-colors"
            >
              Go to Application Portal <ExternalLink size={12} />
            </button>
          </div>

          {/* Filters Bar */}
          <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
            {/* Search */}
            <div className="flex items-center gap-3 px-3.5 py-2 border border-slate-200 rounded-lg bg-white w-72">
              <Search size={15} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, department, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-[12px] text-slate-900 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X size={13} className="text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2.5">
              <button className="flex items-center gap-3 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
                <span className="text-[12px] text-slate-900">Export</span>
                <Download size={14} className="text-purple-700" />
              </button>

              <button className="flex items-center gap-3 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
                <span className="text-[12px] text-slate-900">Upload CSV</span>
                <Upload size={14} className="text-purple-700" />
              </button>

              {/* Department Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowDepartmentDropdown(!showDepartmentDropdown);
                    setShowStatusDropdown(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <span className="text-[12px] text-slate-900">{selectedDepartment}</span>
                  <ChevronDown size={14} className="text-purple-700" />
                </button>
                {showDepartmentDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDepartmentDropdown(false)}
                    />
                    <div className="absolute top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                      {departments.map((dept) => (
                        <button
                          key={dept}
                          onClick={() => {
                            setSelectedDepartment(dept);
                            setShowDepartmentDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                          {dept}
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
                  }}
                  className="flex items-center gap-3 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <span className="text-[12px] text-slate-900">{selectedStatus}</span>
                  <ChevronDown size={14} className="text-purple-700" />
                </button>
                {showStatusDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowStatusDropdown(false)}
                    />
                    <div className="absolute top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedStatus(status);
                            setShowStatusDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50 transition-colors"
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

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-[5]">
                <tr className="bg-blue-600 text-white">
                  <th className="text-left px-6 py-3 text-[12px] font-semibold">Job Title</th>
                  <th className="text-left px-6 py-3 text-[12px] font-semibold">Department</th>
                  <th className="text-left px-6 py-3 text-[12px] font-semibold">Location</th>
                  <th className="text-center px-6 py-3 text-[12px] font-semibold">Level / Grade</th>
                  <th className="text-left px-6 py-3 text-[12px] font-semibold">Type</th>
                  <th className="text-center px-6 py-3 text-[12px] font-semibold">Applicants</th>
                  <th className="text-center px-6 py-3 text-[12px] font-semibold">Status</th>
                  <th className="text-left px-6 py-3 text-[12px] font-semibold">Date Posted</th>
                  <th className="text-center px-6 py-3 text-[12px] font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-16">
                      <p className="text-sm text-slate-400">No job postings found matching your filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job, idx) => (
                    <tr
                      key={job.id}
                      className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="px-6 py-3">
                        <p className="text-[12px] font-medium text-black">{job.title}</p>
                        {job.mprRef && (
                          <p className="text-[10px] text-blue-600 mt-0.5">{job.mprRef}</p>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-[12px] text-slate-500">{job.department}</p>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-[12px] text-slate-500">{job.location}</p>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <p className="text-[12px] text-slate-600">
                          {job.level && job.grade ? `${job.level} · ${job.grade}` : "—"}
                        </p>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-[12px] text-slate-500">{job.type}</p>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                          {job.applicants}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${getStatusColor(
                            job.status
                          )}`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-[12px] text-slate-500">{job.datePosted}</p>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              setShowActionDropdown(
                                showActionDropdown === job.id ? null : job.id
                              )
                            }
                            className="inline-flex items-center justify-center w-8 h-8 hover:bg-slate-100 rounded transition-colors"
                          >
                            <MoreHorizontal size={16} className="text-blue-800" />
                          </button>
                          {showActionDropdown === job.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowActionDropdown(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                                <button
                                  onClick={() => {
                                    setSelectedJob(job);
                                    setShowDetailView(true);
                                    setShowActionDropdown(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                                >
                                  <Eye size={13} /> View Applicants
                                </button>
                                <button
                                  onClick={() => {
                                    onNavigateToApplicationPortal?.();
                                    setShowActionDropdown(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                                >
                                  <ExternalLink size={13} /> View on Portal
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
              >
                <ChevronDown size={16} className="rotate-90 text-pink-600" />
              </button>

              <button className="px-3 py-2 text-[12px] bg-pink-50 text-pink-600 rounded transition-colors">
                1
              </button>

              <button className="px-3 py-2 text-[12px] text-slate-600 hover:bg-slate-50 rounded transition-colors">
                2
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
