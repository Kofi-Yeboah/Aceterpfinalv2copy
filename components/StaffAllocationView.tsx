import { useState } from "react";
import { ArrowLeft, Users, Briefcase, Clock, TrendingUp, BarChart3, User, Calendar, CheckCircle2, AlertTriangle, Hash } from "lucide-react";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";

interface StaffAllocationViewProps {
  onBack: () => void;
  hideStatus?: boolean;
}

interface TaskAssignment {
  id: string;
  taskName: string;
  phase: string;
  startDate: string;
  endDate: string;
  hours: number;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: string;
}

interface StaffMember {
  name: string;
  role: string;
  totalHours: number;
  totalTasks: number;
  tasks: TaskAssignment[];
  utilization: number;
}

// Mock data prepopulated from WBS - in production, this would come from the WBS Builder
const STAFF_DATA: StaffMember[] = [
  {
    name: "Yaw Osei",
    role: "Project Lead",
    totalHours: 240,
    totalTasks: 3,
    utilization: 85,
    tasks: [
      {
        id: "T1-1",
        taskName: "Draft Request for Proposals (RFP)",
        phase: "Procurement & Contracting",
        startDate: "2025-01-20",
        endDate: "2025-02-10",
        hours: 80,
        priority: "High",
        status: "Completed"
      },
      {
        id: "T2-3",
        taskName: "Coordinate Field Data Collection",
        phase: "Implementation",
        startDate: "2025-03-01",
        endDate: "2025-03-20",
        hours: 100,
        priority: "Critical",
        status: "In Progress"
      },
      {
        id: "T3-1",
        taskName: "Conduct Internal Peer Review of Draft",
        phase: "Quality Assurance",
        startDate: "2025-04-01",
        endDate: "2025-04-15",
        hours: 60,
        priority: "High",
        status: "Not Started"
      }
    ]
  },
  {
    name: "Kofi Mensah",
    role: "Technical Specialist",
    totalHours: 280,
    totalTasks: 4,
    utilization: 95,
    tasks: [
      {
        id: "T1-3",
        taskName: "Evaluate Vendor Submissions",
        phase: "Procurement & Contracting",
        startDate: "2025-02-01",
        endDate: "2025-02-28",
        hours: 100,
        priority: "High",
        status: "Completed"
      },
      {
        id: "T2-1",
        taskName: "Conduct Stakeholder Engagement Sessions",
        phase: "Implementation",
        startDate: "2025-02-15",
        endDate: "2025-03-15",
        hours: 120,
        priority: "Critical",
        status: "In Progress"
      },
      {
        id: "T2-4",
        taskName: "Design and Layout Report",
        phase: "Production & Editorial",
        startDate: "2025-03-10",
        endDate: "2025-04-05",
        hours: 40,
        priority: "Medium",
        status: "Not Started"
      },
      {
        id: "T4-2",
        taskName: "Submit Final Technical Report",
        phase: "Reporting",
        startDate: "2025-05-01",
        endDate: "2025-05-10",
        hours: 20,
        priority: "Low",
        status: "Not Started"
      }
    ]
  },
  {
    name: "Ama Darko",
    role: "Research Analyst",
    totalHours: 200,
    totalTasks: 2,
    utilization: 70,
    tasks: [
      {
        id: "T1-1",
        taskName: "Finalize Service Agreements",
        phase: "Procurement & Contracting",
        startDate: "2025-01-15",
        endDate: "2025-02-15",
        hours: 120,
        priority: "Medium",
        status: "Completed"
      },
      {
        id: "T3-2",
        taskName: "Run Data Validation Checks",
        phase: "Quality Assurance",
        startDate: "2025-04-10",
        endDate: "2025-04-25",
        hours: 80,
        priority: "High",
        status: "Not Started"
      }
    ]
  },
  {
    name: "Kwesi Appiah",
    role: "UI/UX Designer",
    totalHours: 160,
    totalTasks: 2,
    utilization: 55,
    tasks: [
      {
        id: "T2-2",
        taskName: "Complete Editorial Review",
        phase: "Production & Editorial",
        startDate: "2025-02-20",
        endDate: "2025-03-10",
        hours: 90,
        priority: "High",
        status: "In Progress"
      },
      {
        id: "T3-3",
        taskName: "Plan Distribution Channels",
        phase: "Dissemination",
        startDate: "2025-04-15",
        endDate: "2025-04-30",
        hours: 70,
        priority: "Medium",
        status: "Not Started"
      }
    ]
  },
  {
    name: "Nana Yaw",
    role: "QA Engineer",
    totalHours: 140,
    totalTasks: 2,
    utilization: 48,
    tasks: [
      {
        id: "T3-4",
        taskName: "Conduct Stakeholder Workshops",
        phase: "Dissemination",
        startDate: "2025-04-20",
        endDate: "2025-05-05",
        hours: 80,
        priority: "High",
        status: "Not Started"
      },
      {
        id: "T4-1",
        taskName: "Compile Lessons Learned",
        phase: "Reporting",
        startDate: "2025-05-06",
        endDate: "2025-05-15",
        hours: 60,
        priority: "Critical",
        status: "Not Started"
      }
    ]
  },
  {
    name: "Kwaku Anane",
    role: "DevOps Engineer",
    totalHours: 100,
    totalTasks: 1,
    utilization: 35,
    tasks: [
      {
        id: "T4-3",
        taskName: "Sign-off and Handover",
        phase: "Delivery Stage Complete",
        startDate: "2025-05-01",
        endDate: "2025-05-20",
        hours: 100,
        priority: "Critical",
        status: "Not Started"
      }
    ]
  }
];

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getStatusStyle(status: string) {
  switch (status) {
    case "Completed": return "bg-emerald-100 text-emerald-700";
    case "In Progress": return "bg-blue-100 text-blue-700";
    case "On Hold": return "bg-amber-100 text-amber-700";
    default: return "bg-slate-100 text-slate-600";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Completed": return <CheckCircle2 className="w-3.5 h-3.5" />;
    case "In Progress": return <Clock className="w-3.5 h-3.5" />;
    case "On Hold": return <AlertTriangle className="w-3.5 h-3.5" />;
    default: return <Hash className="w-3.5 h-3.5" />;
  }
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case "Critical": return "bg-red-100 text-red-700 ring-1 ring-red-200";
    case "High": return "bg-orange-100 text-orange-700 ring-1 ring-orange-200";
    case "Medium": return "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200";
    default: return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  }
}

function getUtilizationColor(utilization: number) {
  if (utilization >= 85) return "text-red-700 bg-red-50";
  if (utilization >= 70) return "text-amber-700 bg-amber-50";
  if (utilization >= 50) return "text-emerald-700 bg-emerald-50";
  return "text-slate-700 bg-slate-50";
}

export function StaffAllocationView({ onBack, hideStatus }: StaffAllocationViewProps) {
  const [expandedStaff, setExpandedStaff] = useState<Set<string>>(new Set(STAFF_DATA.map(s => s.name)));

  const toggleStaff = (staffName: string) => {
    setExpandedStaff(prev => {
      const next = new Set(prev);
      if (next.has(staffName)) {
        next.delete(staffName);
      } else {
        next.add(staffName);
      }
      return next;
    });
  };

  const totalHours = STAFF_DATA.reduce((sum, staff) => sum + staff.totalHours, 0);
  const totalTasks = STAFF_DATA.reduce((sum, staff) => sum + staff.totalTasks, 0);
  const avgUtilization = Math.round(STAFF_DATA.reduce((sum, staff) => sum + staff.utilization, 0) / STAFF_DATA.length);

  const completedTasks = STAFF_DATA.flatMap(s => s.tasks).filter(t => t.status === "Completed").length;
  const inProgressTasks = STAFF_DATA.flatMap(s => s.tasks).filter(t => t.status === "In Progress").length;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Staff Allocation</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">Youth Employment Skills Development &middot; Team assignments from Work Breakdown Structure</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <p className="text-[12px] text-blue-600 font-medium">Total Staff</p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{STAFF_DATA.length}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-violet-600" />
              <p className="text-[12px] text-violet-600 font-medium">Total Tasks</p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{totalTasks}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <p className="text-[12px] text-orange-600 font-medium">Total Hours</p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{totalHours}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <p className="text-[12px] text-emerald-600 font-medium">Avg Utilization</p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{avgUtilization}%</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-cyan-600" />
              <p className="text-[12px] text-cyan-600 font-medium">Progress</p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{completedTasks}/{totalTasks}</p>
          </div>
        </div>

        {/* Staff Allocation Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Team Member Assignments</h2>
            <p className="text-[12px] text-slate-500 mt-1">Staff allocations to deliverables and task assignments from WBS</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0B01D0]">
                <tr>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white w-8"></th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Staff Member</th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Role</th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Tasks</th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Total Hours</th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Utilization</th>
                  {!hideStatus && <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Status</th>}
                </tr>
              </thead>
              {STAFF_DATA.map((staff, idx) => {
                  const isExpanded = expandedStaff.has(staff.name);
                  const completed = staff.tasks.filter(t => t.status === "Completed").length;
                  const inProgress = staff.tasks.filter(t => t.status === "In Progress").length;

                  return (
                    <tbody key={staff.name}>
                      {/* Staff Row */}
                      <tr
                        className={cn(
                          "border-b border-slate-100 hover:bg-slate-50 cursor-pointer",
                          isExpanded && "bg-blue-50"
                        )}
                        onClick={() => toggleStaff(staff.name)}
                      >
                        <td className="px-4 py-4">
                          <button className="p-1 hover:bg-slate-200 rounded">
                            {isExpanded ? (
                              <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-700" />
                            </div>
                            <span className="text-[12px] font-semibold text-slate-900">{staff.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[12px] text-slate-600">{staff.role}</td>
                        <td className="px-4 py-4 text-[12px] text-slate-600">{staff.totalTasks} tasks</td>
                        <td className="px-4 py-4 text-[12px] text-slate-600">{staff.totalHours}h</td>
                        <td className="px-4 py-4">
                          <span className={cn("text-[12px] font-semibold px-2 py-1 rounded", getUtilizationColor(staff.utilization))}>
                            {staff.utilization}%
                          </span>
                        </td>
                        {!hideStatus && (
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 text-[11px]">
                            <span className="text-emerald-700">{completed} done</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-blue-700">{inProgress} active</span>
                          </div>
                        </td>
                        )}
                      </tr>

                      {/* Expanded Task Rows */}
                      {isExpanded && staff.tasks.map((task, taskIdx) => (
                        <tr key={task.id} className={cn("border-b border-slate-100 bg-slate-50", taskIdx === staff.tasks.length - 1 && "border-b-2 border-slate-200")}>
                          <td className="px-4 py-3"></td>
                          <td colSpan={hideStatus ? 5 : 6} className="px-4 py-3">
                            <div className="flex items-center gap-4 pl-8">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[11px] text-slate-500 font-mono">{task.id}</span>
                                  <span className="text-[12px] font-medium text-slate-900">{task.taskName}</span>
                                  <Badge className={cn("text-[10px] font-medium shadow-none border-0", getPriorityStyle(task.priority))}>
                                    {task.priority}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-slate-600">
                                  <span className="flex items-center gap-1">
                                    <Briefcase className="w-3 h-3" />
                                    {task.phase}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(task.startDate)} — {formatDate(task.endDate)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {task.hours}h
                                  </span>
                                </div>
                              </div>
                              {!hideStatus && <Badge className={cn("text-[11px] font-medium shadow-none border-0 flex items-center gap-1", getStatusStyle(task.status))}>
                                {getStatusIcon(task.status)}
                                {task.status}
                              </Badge>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  );
                })}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}