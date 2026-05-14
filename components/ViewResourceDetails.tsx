import { ArrowLeft, Printer, Calendar, User, Briefcase } from "lucide-react";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";

type WorkStatus = "Available" | "Partially Available" | "Fully Utilized" | "Overallocated";
type Availability = "Available" | "Limited" | "Unavailable";

interface ResourceEntry {
  id: string;
  staffName: string;
  role: string;
  skills: string[];
  projectAssignment: string;
  assignmentDate: string;
  roleInProject: string;
  workStatus: WorkStatus;
  utilization: number;
  availability: Availability;
}

interface ViewResourceDetailsProps {
  resource: ResourceEntry;
  onBack: () => void;
}

export function ViewResourceDetails({ resource, onBack }: ViewResourceDetailsProps) {
  // Mock assignment history data
  const assignmentHistory = [
    {
      id: "1",
      project: resource.projectAssignment,
      role: resource.roleInProject,
      startDate: resource.assignmentDate,
      endDate: "Ongoing",
      status: "Active",
      utilization: resource.utilization
    },
    {
      id: "2",
      project: "Urban Development Strategy",
      role: "Consultant",
      startDate: "Oct 1, 2024",
      endDate: "Dec 31, 2024",
      status: "Completed",
      utilization: 80
    },
    {
      id: "3",
      project: "Economic Impact Assessment",
      role: "Lead Analyst",
      startDate: "Jul 15, 2024",
      endDate: "Sep 30, 2024",
      status: "Completed",
      utilization: 100
    }
  ];

  // Mock capacity overview by week
  const capacityWeeks = [
    { week: "Week 1 (Dec 2-8)", allocated: resource.utilization, available: 100 - resource.utilization },
    { week: "Week 2 (Dec 9-15)", allocated: resource.utilization, available: 100 - resource.utilization },
    { week: "Week 3 (Dec 16-22)", allocated: resource.utilization, available: 100 - resource.utilization },
    { week: "Week 4 (Dec 23-29)", allocated: 40, available: 60 }
  ];

  const getStatusColor = (status: WorkStatus) => {
    switch (status) {
      case "Available": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      case "Partially Available": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Fully Utilized": return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "Overallocated": return "bg-red-100 text-red-700 hover:bg-red-100";
      default: return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  const getAvailabilityColor = (availability: Availability) => {
    switch (availability) {
      case "Available": return "text-emerald-600";
      case "Limited": return "text-amber-600";
      case "Unavailable": return "text-red-600";
      default: return "text-slate-600";
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 100) return "text-red-600";
    if (utilization >= 80) return "text-amber-600";
    if (utilization >= 50) return "text-blue-600";
    return "text-emerald-600";
  };

  return (
    <div className="h-full overflow-auto bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Resources</span>
          </button>
          <span className="text-slate-300">|</span>
          <span className="font-semibold text-slate-900">{resource.staffName.toUpperCase()}</span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
          <Printer size={18} className="text-slate-600" />
          <span className="text-slate-700">Print</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-8 max-w-6xl">
        {/* Resource Overview */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">RESOURCE OVERVIEW</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Staff/Expert Name</label>
              <p className="font-medium text-slate-900">{resource.staffName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role/Position</label>
              <p className="text-slate-900">{resource.role}</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">Skills & Expertise</label>
            <div className="flex flex-wrap gap-2">
              {resource.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Work Status</label>
              <Badge className={cn("text-sm font-medium shadow-none border-0", getStatusColor(resource.workStatus))}>
                {resource.workStatus}
              </Badge>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Utilization</label>
              <p className={cn("text-xl font-semibold", getUtilizationColor(resource.utilization))}>
                {resource.utilization}%
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Availability</label>
              <p className={cn("font-semibold", getAvailabilityColor(resource.availability))}>
                {resource.availability}
              </p>
            </div>
          </div>
        </div>

        {/* Current Assignment */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">CURRENT ASSIGNMENT</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
              <p className="text-slate-900">{resource.projectAssignment}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role in Project</label>
              <p className="text-slate-900">{resource.roleInProject}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assignment Date</label>
            <p className="text-slate-900">{resource.assignmentDate}</p>
          </div>
        </div>

        {/* Capacity Overview (Weekly) */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">CAPACITY OVERVIEW (DECEMBER 2025)</h2>
          
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Week</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Allocated (%)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Available (%)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Visual</th>
                </tr>
              </thead>
              <tbody>
                {capacityWeeks.map((week, index) => (
                  <tr key={index} className="border-b border-slate-200 last:border-0">
                    <td className="px-4 py-3 text-slate-900">{week.week}</td>
                    <td className="px-4 py-3">
                      <span className={cn("font-semibold", getUtilizationColor(week.allocated))}>
                        {week.allocated}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-emerald-600 font-semibold">{week.available}%</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 h-4">
                        <div
                          className="bg-blue-500 rounded"
                          style={{ width: `${week.allocated}%` }}
                          title={`Allocated: ${week.allocated}%`}
                        />
                        <div
                          className="bg-emerald-200 rounded"
                          style={{ width: `${week.available}%` }}
                          title={`Available: ${week.available}%`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assignment History */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">ASSIGNMENT HISTORY</h2>
          
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Project</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Start Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">End Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {assignmentHistory.map((assignment) => (
                  <tr key={assignment.id} className="border-b border-slate-200 last:border-0">
                    <td className="px-4 py-3 text-slate-900">{assignment.project}</td>
                    <td className="px-4 py-3 text-slate-600">{assignment.role}</td>
                    <td className="px-4 py-3 text-slate-600">{assignment.startDate}</td>
                    <td className="px-4 py-3 text-slate-600">{assignment.endDate}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          assignment.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-700"
                        )}
                      >
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("font-semibold", getUtilizationColor(assignment.utilization))}>
                        {assignment.utilization}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
