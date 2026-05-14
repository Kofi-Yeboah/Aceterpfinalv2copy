import { ArrowLeft, Mail, Phone, Calendar, Briefcase, MapPin, Building2, User, Upload, Download, Trash2 } from "lucide-react";
import { useState } from "react";

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

interface EmployeeProfileDetailsViewProps {
  profile: EmployeeProfile;
  onBack: () => void;
}

export function EmployeeProfileDetailsView({ profile, onBack }: EmployeeProfileDetailsViewProps) {
  const [activeTab, setActiveTab] = useState("personal");
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-600 border-green-200";
      case "On Leave":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "Inactive":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Information" },
    { id: "tasks", label: "Active Tasks in Projects" },
    { id: "qualifications", label: "Qualifications" },
    { id: "contract", label: "Contract" },
    { id: "training", label: "Training" },
    { id: "disciplinary", label: "Disciplinary Actions" },
    { id: "leave", label: "Leave" },
  ];

  const certifications = [
    { name: "Bachelor's Degree in Business Administration", date: "2014-06-15", file: "degree.pdf", institution: "University of Ghana", type: "Degree" },
    { name: "Project Management Professional (PMP)", date: "2017-03-20", file: "pmp_cert.pdf", institution: "PMI", type: "Professional Certification" },
    { name: "Certified ScrumMaster (CSM)", date: "2019-08-10", file: "csm_cert.pdf", institution: "Scrum Alliance", type: "Professional Certification" },
  ];

  const activeTasks = [
    {
      id: 1,
      projectName: "Community Health Initiative",
      taskName: "Review project budget allocation",
      dueDate: "2026-01-25",
      status: "In Progress",
      priority: "High"
    },
    {
      id: 2,
      projectName: "Youth Empowerment Program",
      taskName: "Prepare quarterly report",
      dueDate: "2026-01-30",
      status: "Not Started",
      priority: "Medium"
    },
    {
      id: 3,
      projectName: "Water Sanitation Project",
      taskName: "Coordinate with field team",
      dueDate: "2026-01-20",
      status: "In Progress",
      priority: "High"
    },
    {
      id: 4,
      projectName: "Education Access Initiative",
      taskName: "Develop training materials",
      dueDate: "2026-02-05",
      status: "Not Started",
      priority: "Low"
    },
  ];

  const trainingRecords = [
    {
      id: 1,
      courseName: "Advanced Leadership Skills",
      provider: "Leadership Institute",
      startDate: "2024-03-15",
      endDate: "2024-04-15",
      status: "Completed",
      hoursCompleted: 40
    },
    {
      id: 2,
      courseName: "Financial Management for NGOs",
      provider: "NGO Training Center",
      startDate: "2024-07-01",
      endDate: "2024-07-30",
      status: "Completed",
      hoursCompleted: 32
    },
    {
      id: 3,
      courseName: "Data Analysis and Reporting",
      provider: "Online Learning Platform",
      startDate: "2025-11-10",
      endDate: "2025-12-20",
      status: "In Progress",
      hoursCompleted: 24
    },
  ];

  const leaveSummary = {
    annualLeave: { total: 25, taken: 10, remaining: 15 },
    sickLeave: { total: 15, taken: 5, remaining: 10 },
    casualLeave: { total: 5, taken: 2, remaining: 3 },
  };

  const leaveHistory = [
    {
      id: 1,
      leaveType: "Annual",
      startDate: "2025-12-15",
      endDate: "2025-12-22",
      duration: 6,
      status: "Approved",
      requestDate: "2025-11-25",
      approvedBy: "Sarah Johnson"
    },
    {
      id: 2,
      leaveType: "Sickness Absence",
      startDate: "2025-10-05",
      endDate: "2025-10-09",
      duration: 5,
      status: "Approved",
      requestDate: "2025-10-05",
      approvedBy: "Sarah Johnson"
    },
    {
      id: 3,
      leaveType: "Casual Leave",
      startDate: "2026-02-10",
      endDate: "2026-02-11",
      duration: 2,
      status: "Pending",
      requestDate: "2026-01-20",
      approvedBy: "-"
    },
    {
      id: 4,
      leaveType: "Annual",
      startDate: "2025-07-01",
      endDate: "2025-07-04",
      duration: 4,
      status: "Approved",
      requestDate: "2025-06-15",
      approvedBy: "Sarah Johnson"
    },
  ];

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "Not Started":
        return "bg-slate-100 text-slate-600 border-slate-200";
      case "Completed":
        return "bg-green-50 text-green-600 border-green-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-600 border-red-200";
      case "Medium":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "Low":
        return "bg-green-50 text-green-600 border-green-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getTrainingStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-600 border-green-200";
      case "In Progress":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "Scheduled":
        return "bg-amber-50 text-amber-600 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-50 text-green-600 border-green-200";
      case "Pending":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "Rejected":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Back to Employee Profiles</span>
        </button>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
              <User size={32} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">{profile.name}</h1>
              <p className="text-sm text-slate-600 mb-2">ID: EMP{String(profile.id).padStart(4, '0')}</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-700">{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-700">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-700">{profile.position}</span>
                </div>
              </div>
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium border ${getStatusColor(profile.status)}`}>
            {profile.status}
          </span>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[120px] ${
                  activeTab === tab.id
                    ? "bg-purple-700 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              {/* Basic Information Section */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Basic Information</h2>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">First Name</p>
                    <p className="text-sm font-medium text-slate-900">{profile.name.split(' ')[0]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Last Name</p>
                    <p className="text-sm font-medium text-slate-900">{profile.name.split(' ').slice(1).join(' ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Gender</p>
                    <p className="text-sm font-medium text-slate-900">Male</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Date of Birth</p>
                    <p className="text-sm font-medium text-slate-900">1988-03-22</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Nationality</p>
                    <p className="text-sm font-medium text-slate-900">Ghanaian</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Marital Status</p>
                    <p className="text-sm font-medium text-slate-900">Married</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 mb-1">Address</p>
                    <p className="text-sm font-medium text-slate-900">123 Independence Avenue, East Legon, Accra, Ghana</p>
                  </div>
                </div>
              </div>

              {/* Employment Information Section */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Employment Information</h2>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Employee ID</p>
                    <p className="text-sm font-medium text-slate-900">EMP{String(profile.id).padStart(4, '0')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Start Date</p>
                    <p className="text-sm font-medium text-slate-900">{profile.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Job Title</p>
                    <p className="text-sm font-medium text-slate-900">{profile.position}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Department</p>
                    <p className="text-sm font-medium text-slate-900">{profile.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Employment Type</p>
                    <p className="text-sm font-medium text-slate-900">Full-time</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Employment Status</p>
                    <p className="text-sm font-medium text-slate-900">{profile.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Supervisor</p>
                    <p className="text-sm font-medium text-slate-900">Sarah Johnson</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Work Location</p>
                    <p className="text-sm font-medium text-slate-900">Accra Office</p>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Contact Information</h2>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Phone Number</p>
                    <p className="text-sm font-medium text-slate-900">{profile.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    <p className="text-sm font-medium text-slate-900">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Emergency Contact</p>
                    <p className="text-sm font-medium text-slate-900">+233 20 987 6543</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Emergency Contact Name</p>
                    <p className="text-sm font-medium text-slate-900">Abena Mensah</p>
                  </div>
                </div>
              </div>

              {/* Banking Information Section */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Banking Information</h2>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Bank Name</p>
                    <p className="text-sm font-medium text-slate-900">Ghana Commercial Bank</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Account Number</p>
                    <p className="text-sm font-medium text-slate-900">1234567890</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Account Type</p>
                    <p className="text-sm font-medium text-slate-900">Savings</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Branch</p>
                    <p className="text-sm font-medium text-slate-900">Accra Main Branch</p>
                  </div>
                </div>
              </div>

              {/* Utilization & Performance Section */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Utilization & Performance</h2>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Current Utilization Rate</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0B01D0] rounded-full"
                          style={{ width: '75%' }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900">75%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Billable Hours (This Month)</p>
                    <p className="text-sm font-medium text-slate-900">120 hrs</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Non-Billable Hours (This Month)</p>
                    <p className="text-sm font-medium text-slate-900">40 hrs</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Available Hours (This Month)</p>
                    <p className="text-sm font-medium text-slate-900">160 hrs</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Active Projects</p>
                    <p className="text-sm font-medium text-slate-900">4</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Completed Projects (YTD)</p>
                    <p className="text-sm font-medium text-slate-900">12</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Tasks Completed (This Month)</p>
                    <p className="text-sm font-medium text-slate-900">28</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Average Task Completion Time</p>
                    <p className="text-sm font-medium text-slate-900">3.5 days</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">On-Time Delivery Rate</p>
                    <p className="text-sm font-medium text-slate-900">92%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Average Performance Rating</p>
                    <p className="text-sm font-medium text-slate-900">4.5/5.0</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Last Performance Review</p>
                    <p className="text-sm font-medium text-slate-900">2025-12-15</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Next Performance Review</p>
                    <p className="text-sm font-medium text-slate-900">2026-12-15</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Tasks in Projects Tab */}
          {activeTab === "tasks" && (
            <div>
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#0B01D0] text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-white">Project Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-white">Task Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-white">Due Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-white">Priority</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activeTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-[12px] text-slate-900">{task.projectName}</td>
                        <td className="px-6 py-4 text-[12px] text-slate-900">{task.taskName}</td>
                        <td className="px-6 py-4 text-[12px] text-slate-600">{task.dueDate}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-[12px] font-medium border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-[12px] font-medium border ${getTaskStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Qualifications Tab */}
          {activeTab === "qualifications" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button className="px-6 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0900a5] transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Certification
                </button>
              </div>
              
              {/* Educational Qualifications Section */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Educational Qualifications</h2>
                <div className="space-y-4">
                  {certifications.filter(cert => cert.type === "Degree").map((cert, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-slate-900 mb-2">{cert.name}</h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Institution</p>
                              <p className="text-sm font-medium text-slate-900">{cert.institution}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Date Obtained</p>
                              <p className="text-sm font-medium text-slate-900">{cert.date}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Document</p>
                              <p className="text-sm font-medium text-slate-900">{cert.file}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <button className="text-[#0B01D0] hover:text-[#0900a5] transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Certifications Section */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Professional Certifications</h2>
                <div className="space-y-4">
                  {certifications.filter(cert => cert.type === "Professional Certification").map((cert, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-slate-900 mb-2">{cert.name}</h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Issuing Organization</p>
                              <p className="text-sm font-medium text-slate-900">{cert.institution}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Date Obtained</p>
                              <p className="text-sm font-medium text-slate-900">{cert.date}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Document</p>
                              <p className="text-sm font-medium text-slate-900">{cert.file}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <button className="text-[#0B01D0] hover:text-[#0900a5] transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contract Tab */}
          {activeTab === "contract" && (
            <div className="space-y-6">
              {/* Employment Contract Details Section */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Employment Contract Details</h2>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Contract Start Date</p>
                    <p className="text-sm font-medium text-slate-900">{profile.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Contract End Date</p>
                    <p className="text-sm font-medium text-slate-900">Permanent</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Employment Type</p>
                    <p className="text-sm font-medium text-slate-900">Full-time</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Probation Status</p>
                    <p className="text-sm font-medium text-slate-900">Completed</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Job Title</p>
                    <p className="text-sm font-medium text-slate-900">{profile.position}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Department</p>
                    <p className="text-sm font-medium text-slate-900">{profile.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Reporting To</p>
                    <p className="text-sm font-medium text-slate-900">Head of {profile.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Work Location</p>
                    <p className="text-sm font-medium text-slate-900">Accra Office</p>
                  </div>
                </div>
              </div>

              {/* Compensation & Benefits Section */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Compensation & Benefits</h2>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Base Salary</p>
                    <p className="text-sm font-medium text-slate-900">GHS 12,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Pay Frequency</p>
                    <p className="text-sm font-medium text-slate-900">Monthly</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Direct Manager</p>
                    <p className="text-sm font-medium text-slate-900">Sarah Johnson</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Performance Bonus Eligible</p>
                    <p className="text-sm font-medium text-slate-900">Yes</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Health Insurance</p>
                    <p className="text-sm font-medium text-slate-900">Included</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Pension Contribution</p>
                    <p className="text-sm font-medium text-slate-900">13.5% (Employer)</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Life Insurance</p>
                    <p className="text-sm font-medium text-slate-900">Included</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Professional Development</p>
                    <p className="text-sm font-medium text-slate-900">GHS 5,000/year</p>
                  </div>
                </div>
              </div>

              {/* Leave Entitlements Section */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Leave Entitlements</h2>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Annual Leave Days</p>
                    <p className="text-sm font-medium text-slate-900">25 days</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Sick Leave Days</p>
                    <p className="text-sm font-medium text-slate-900">15 days</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Casual Leave Days</p>
                    <p className="text-sm font-medium text-slate-900">5 days</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Compassionate Leave</p>
                    <p className="text-sm font-medium text-slate-900">As needed</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Maternity/Paternity Leave</p>
                    <p className="text-sm font-medium text-slate-900">As per policy</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Study Leave</p>
                    <p className="text-sm font-medium text-slate-900">Upon approval</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Leave Accrual Start</p>
                    <p className="text-sm font-medium text-slate-900">{profile.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Leave Year End</p>
                    <p className="text-sm font-medium text-slate-900">December 31</p>
                  </div>
                </div>
              </div>

              {/* Working Hours & Schedule Section */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Working Hours & Schedule</h2>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Working Hours</p>
                    <p className="text-sm font-medium text-slate-900">40 hours/week</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Work Schedule</p>
                    <p className="text-sm font-medium text-slate-900">Monday - Friday</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Start Time</p>
                    <p className="text-sm font-medium text-slate-900">8:00 AM</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">End Time</p>
                    <p className="text-sm font-medium text-slate-900">5:00 PM</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Lunch Break</p>
                    <p className="text-sm font-medium text-slate-900">1 hour</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Remote Work Policy</p>
                    <p className="text-sm font-medium text-slate-900">2 days/week</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Overtime Eligible</p>
                    <p className="text-sm font-medium text-slate-900">No</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Flexible Hours</p>
                    <p className="text-sm font-medium text-slate-900">Yes</p>
                  </div>
                </div>
              </div>

              {/* Contract Terms & Conditions Section */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Contract Terms & Conditions</h2>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Notice Period</p>
                    <p className="text-sm font-medium text-slate-900">30 days</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Contract Renewal Date</p>
                    <p className="text-sm font-medium text-slate-900">N/A (Permanent)</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Confidentiality Agreement</p>
                    <p className="text-sm font-medium text-slate-900">Signed</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Non-Compete Clause</p>
                    <p className="text-sm font-medium text-slate-900">Not Applicable</p>
                  </div>
                  <div className="col-span-4">
                    <p className="text-xs text-slate-500 mb-1">Additional Notes</p>
                    <p className="text-sm font-medium text-slate-900">Standard full-time employment contract with benefits package including health insurance, pension contributions, and performance bonuses. Employee is subject to annual performance reviews and entitled to professional development opportunities. Contract includes provisions for salary reviews every 12 months based on performance and market conditions.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Training Tab */}
          {activeTab === "training" && (
            <div>
              {trainingRecords.length > 0 ? (
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#0B01D0] text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Course Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Provider</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Start Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">End Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Hours</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {trainingRecords.map((training) => (
                        <tr key={training.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-[12px] text-slate-900">{training.courseName}</td>
                          <td className="px-6 py-4 text-[12px] text-slate-600">{training.provider}</td>
                          <td className="px-6 py-4 text-[12px] text-slate-600">{training.startDate}</td>
                          <td className="px-6 py-4 text-[12px] text-slate-600">{training.endDate}</td>
                          <td className="px-6 py-4 text-[12px] text-slate-600">{training.hoursCompleted} hrs</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-[12px] font-medium border ${getTrainingStatusColor(training.status)}`}>
                              {training.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Training Records</h3>
                  <p className="text-slate-600">Training records will appear here when available.</p>
                </div>
              )}
            </div>
          )}

          {/* Disciplinary Actions Tab */}
          {activeTab === "disciplinary" && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Disciplinary Actions</h3>
              <p className="text-slate-600">No disciplinary actions on record.</p>
            </div>
          )}

          {/* Leave Tab */}
          {activeTab === "leave" && (
            <div className="space-y-6">
              {/* Leave Summary Cards */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-slate-600 mb-4">Annual Leave</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Total Days</span>
                      <span className="text-sm font-semibold text-slate-900">{leaveSummary.annualLeave.total} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Days Taken</span>
                      <span className="text-sm font-semibold text-red-600">{leaveSummary.annualLeave.taken} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Days Remaining</span>
                      <span className="text-sm font-semibold text-green-600">{leaveSummary.annualLeave.remaining} days</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-slate-600 mb-4">Sick Leave</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Total Days</span>
                      <span className="text-sm font-semibold text-slate-900">{leaveSummary.sickLeave.total} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Days Taken</span>
                      <span className="text-sm font-semibold text-red-600">{leaveSummary.sickLeave.taken} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Days Remaining</span>
                      <span className="text-sm font-semibold text-green-600">{leaveSummary.sickLeave.remaining} days</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-slate-600 mb-4">Casual Leave</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Total Days</span>
                      <span className="text-sm font-semibold text-slate-900">{leaveSummary.casualLeave.total} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Days Taken</span>
                      <span className="text-sm font-semibold text-red-600">{leaveSummary.casualLeave.taken} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Days Remaining</span>
                      <span className="text-sm font-semibold text-green-600">{leaveSummary.casualLeave.remaining} days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leave History Table */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#0B01D0] text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-white">Leave Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-white">Start Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-white">End Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-white">Duration</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-white">Request Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-white">Approved By</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {leaveHistory.map((leave) => (
                      <tr key={leave.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-[12px] text-slate-900">{leave.leaveType}</td>
                        <td className="px-6 py-4 text-[12px] text-slate-600">{leave.startDate}</td>
                        <td className="px-6 py-4 text-[12px] text-slate-600">{leave.endDate}</td>
                        <td className="px-6 py-4 text-[12px] text-slate-600">{leave.duration} days</td>
                        <td className="px-6 py-4 text-[12px] text-slate-600">{leave.requestDate}</td>
                        <td className="px-6 py-4 text-[12px] text-slate-600">{leave.approvedBy}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-[12px] font-medium border ${getLeaveStatusColor(leave.status)}`}>
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}