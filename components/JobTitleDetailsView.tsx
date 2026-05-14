import { ArrowLeft, Briefcase, Building2, Users, DollarSign, Award, TrendingUp } from "lucide-react";

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

interface JobTitleDetailsViewProps {
  jobTitle: JobTitle;
  onBack: () => void;
}

export function JobTitleDetailsView({ jobTitle, onBack }: JobTitleDetailsViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-600 border-green-200";
      case "Inactive":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  // Mock employees data
  const employees = [
    { id: 1, name: "Yaw Osei", email: "yaw.osei@company.com", joinDate: "Jan 15, 2023", performance: "Excellent" },
    { id: 2, name: "Kofi Mensah", email: "kofi.mensah@company.com", joinDate: "Mar 10, 2023", performance: "Good" },
    { id: 3, name: "Ama Darko", email: "ama.darko@company.com", joinDate: "Feb 5, 2023", performance: "Excellent" },
    { id: 4, name: "Kwesi Appiah", email: "kwesi.appiah@company.com", joinDate: "Apr 20, 2023", performance: "Good" },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Back to Job Titles</span>
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">{jobTitle.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <Building2 size={16} />
                <span>{jobTitle.department}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award size={16} />
                <span>{jobTitle.level}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp size={16} />
                <span>{jobTitle.grade}</span>
              </div>
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium border ${getStatusColor(jobTitle.status)}`}>
            {jobTitle.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Employees</p>
                  <p className="text-xl font-semibold text-slate-900">{jobTitle.employeeCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <DollarSign size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Salary Range</p>
                  <p className="text-sm font-semibold text-slate-900">{jobTitle.salaryRange}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Award size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Grade Level</p>
                  <p className="text-xl font-semibold text-slate-900">{jobTitle.grade}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Title Information */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Job Title Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-1">Job Title</p>
                <p className="text-sm text-slate-900 font-medium">{jobTitle.title}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Department</p>
                <p className="text-sm text-slate-900">{jobTitle.department}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Level</p>
                <p className="text-sm text-slate-900">{jobTitle.level}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Grade</p>
                <p className="text-sm text-slate-900">{jobTitle.grade}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Salary Range</p>
                <p className="text-sm text-slate-900">{jobTitle.salaryRange}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Status</p>
                <p className="text-sm text-slate-900">{jobTitle.status}</p>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Job Description</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              The {jobTitle.title} is responsible for overseeing and managing key initiatives within the {jobTitle.department} department. 
              This role requires strong leadership, technical expertise, and the ability to work collaboratively with cross-functional teams 
              to achieve organizational goals.
            </p>
          </div>

          {/* Key Responsibilities */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Key Responsibilities</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-700 mt-1">•</span>
                <span>Lead and manage departmental projects and initiatives</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-700 mt-1">•</span>
                <span>Collaborate with team members to achieve strategic objectives</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-700 mt-1">•</span>
                <span>Monitor and report on key performance indicators</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-700 mt-1">•</span>
                <span>Ensure compliance with organizational policies and procedures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-700 mt-1">•</span>
                <span>Mentor and support junior team members</span>
              </li>
            </ul>
          </div>

          {/* Required Qualifications */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Required Qualifications</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-700 mt-1">•</span>
                <span>Bachelor's degree in relevant field or equivalent experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-700 mt-1">•</span>
                <span>5+ years of experience in a similar role</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-700 mt-1">•</span>
                <span>Strong analytical and problem-solving skills</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-700 mt-1">•</span>
                <span>Excellent communication and interpersonal abilities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-700 mt-1">•</span>
                <span>Proficiency in relevant software and tools</span>
              </li>
            </ul>
          </div>

          {/* Employees in this Role */}
          {jobTitle.employeeCount > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">Employees in this Role</h2>
              </div>
              <table className="w-full">
                <thead style={{ backgroundColor: "#0B01D0" }}>
                  <tr>
                    <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Name</th>
                    <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Email</th>
                    <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Join Date</th>
                    <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.slice(0, jobTitle.employeeCount).map((employee) => (
                    <tr key={employee.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="text-[12px] font-medium text-black">{employee.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[12px] text-slate-500">{employee.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[12px] text-slate-500">{employee.joinDate}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${
                          employee.performance === "Excellent" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                        }`}>
                          {employee.performance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
