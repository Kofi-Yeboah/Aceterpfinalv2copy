import { useState } from "react";
import svgPaths from "../imports/svg-3ndofat8o9";
import { MoreHorizontal } from "lucide-react";

interface Task {
  id: string;
  name: string;
  phase: string;
  project: string;
  assignedTo: string;
  dueDate: string;
  status: "Overdue" | "Completed" | "In Progress";
}

const MOCK_TASKS: Task[] = [
  {
    id: "1",
    name: "Finalize Survey Instrument Design",
    phase: "1",
    project: "West Africa Regional Integration Study",
    assignedTo: "Yaw Osei",
    dueDate: "Mar 15, 2025",
    status: "Overdue",
  },
  {
    id: "2",
    name: "Conduct Internal Peer Review of Draft",
    phase: "2",
    project: "West Africa Regional Integration Study",
    assignedTo: "Kofi Mensah",
    dueDate: "Nov 8, 2025",
    status: "Completed",
  },
  {
    id: "3",
    name: "Complete Literature Review",
    phase: "1",
    project: "West Africa Regional Integration Study",
    assignedTo: "Kwesi Appiah",
    dueDate: "Jul 4, 2025",
    status: "Completed",
  },
  {
    id: "4",
    name: "Schedule Project Kick-off Meeting",
    phase: "4",
    project: "Climate Finance Readiness Program",
    assignedTo: "Nana Yaw",
    dueDate: "Jul 4, 2025",
    status: "In Progress",
  },
  {
    id: "5",
    name: "Draft Stakeholder Engagement Plan",
    phase: "1",
    project: "Renewable Energy Transition Framework",
    assignedTo: "Kwaku Anane",
    dueDate: "Mar 15, 2025",
    status: "Completed",
  },
];

export function Projects() {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const toggleDropdown = (taskId: string) => {
    setOpenDropdownId(openDropdownId === taskId ? null : taskId);
  };

  const handleAction = (action: string, taskId: string) => {
    console.log(`${action} task ${taskId}`);
    setOpenDropdownId(null);
    // Handle action logic here
  };

  const getStatusStyles = (status: Task["status"]) => {
    switch (status) {
      case "Overdue":
        return "bg-red-50 text-red-600";
      case "Completed":
        return "bg-green-50 text-green-600";
      case "In Progress":
        return "bg-blue-50 text-blue-500";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-6 bg-white border-b border-slate-200 flex justify-between items-center">
        <h1 className="font-['Montserrat',sans-serif] text-slate-900">Task Management</h1>
        <button className="bg-purple-700 flex gap-2 h-[38px] items-center justify-center px-4 py-[11px] rounded-lg shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)] hover:bg-purple-800 transition-colors">
          <div className="relative shrink-0 size-4">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <g clipPath="url(#clip0_50_19272)">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
                <path d={svgPaths.p20feca80} stroke="white" strokeLinecap="round" strokeWidth="1.5" />
              </g>
              <defs>
                <clipPath id="clip0_50_19272">
                  <rect fill="white" height="16" width="16" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <span className="font-['Montserrat',sans-serif] text-white text-nowrap">Add New Task</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between w-full">
          {/* Search */}
          <div className="bg-white border border-slate-200 flex h-[38px] items-center px-4 py-[11px] rounded-lg shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)] w-[221px]">
            <div className="flex gap-4 items-center flex-1">
              <div className="relative shrink-0 size-6">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d={svgPaths.p118d0870} fill="#94A3B8" fillRule="evenodd" />
                </svg>
              </div>
              <p className="font-['Montserrat',sans-serif] text-slate-400 text-nowrap">Search</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-[10px] items-center">
            <button className="bg-white border border-slate-200 flex gap-3 h-[38px] items-center px-3 py-[7px] rounded-lg shadow-[0px_2px_8px_0px_rgba(100,116,139,0.1)] hover:bg-slate-50 transition-colors">
              <span className="font-['Montserrat',sans-serif] text-slate-900 text-nowrap">Export</span>
              <div className="relative shrink-0 size-4">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <g clipPath="url(#clip0_50_19226)">
                    <path d={svgPaths.p2ed72e5c} stroke="#7E22CE" strokeLinecap="round" strokeWidth="1.5" />
                    <path d={svgPaths.p1821db80} stroke="#071F7D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </g>
                  <defs>
                    <clipPath id="clip0_50_19226">
                      <rect fill="white" height="16" rx="5" width="16" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </button>

            <button className="bg-white border border-slate-200 flex gap-3 h-[38px] items-center px-3 py-[7px] rounded-lg shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)] hover:bg-slate-50 transition-colors">
              <span className="font-['Montserrat',sans-serif] text-slate-900 text-nowrap">Upload CSV</span>
              <div className="relative shrink-0 size-4">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 23">
                  <path d={svgPaths.pdbc9ee0} stroke="#7E22CE" strokeLinecap="round" strokeWidth="1.5" />
                  <path d={svgPaths.p3f7e6190} stroke="#071F7D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                </svg>
              </div>
            </button>

            <button className="bg-white border border-slate-200 flex gap-3 h-[38px] items-center px-3 py-[7px] rounded-lg shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)] hover:bg-slate-50 transition-colors">
              <span className="font-['Montserrat',sans-serif] text-slate-900 text-nowrap">All Projects</span>
              <div className="relative shrink-0 size-4">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <path d="M12.6667 6L8 10L3.33333 6" stroke="#7E22CE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </button>

            <button className="bg-white border border-slate-200 flex gap-3 h-[38px] items-center px-3 py-[7px] rounded-lg shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)] hover:bg-slate-50 transition-colors">
              <span className="font-['Montserrat',sans-serif] text-slate-900 text-nowrap">All Statuses</span>
              <div className="relative shrink-0 size-4">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <path d="M12.6667 6L8 10L3.33333 6" stroke="#7E22CE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </button>

            <button className="bg-white border border-slate-200 flex gap-3 h-[38px] items-center px-3 py-[7px] rounded-lg shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)] hover:bg-slate-50 transition-colors">
              <span className="font-['Montserrat',sans-serif] text-slate-900 text-nowrap">All Time</span>
              <div className="relative shrink-0 size-4">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <path d="M12.6667 6L8 10L3.33333 6" stroke="#7E22CE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full">
          <thead className="sticky top-0 z-10" style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold">
                <p className="font-['Montserrat',sans-serif] text-white text-[12px]">Task Name</p>
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold w-[120px]">
                <p className="font-['Montserrat',sans-serif] text-white text-[12px]">Phase</p>
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold w-[287px]">
                <p className="font-['Montserrat',sans-serif] text-white text-[12px]">Associated Project</p>
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold w-[120px]">
                <p className="font-['Montserrat',sans-serif] text-white text-[12px]">Assigned To</p>
              </th>
              <th className="px-3 py-4 text-left text-white text-[12px] font-semibold w-[120px]">
                <p className="font-['Montserrat',sans-serif] text-white text-[12px]">Due Date</p>
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold w-[117px]">
                <p className="font-['Montserrat',sans-serif] text-white text-[12px]">Status</p>
              </th>
              <th className="px-4 py-4 text-center text-white text-[12px] font-semibold w-[73px] rounded-tr-lg">
                <p className="font-['Montserrat',sans-serif] text-white text-[12px]">Action</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TASKS.map((task) => (
              <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="font-['Montserrat',sans-serif] text-[#667085] text-[12px]">{task.name}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-['Montserrat',sans-serif] text-slate-600 text-[12px]">{task.phase}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-['Montserrat',sans-serif] text-[#667085] text-[12px]">{task.project}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-['Montserrat',sans-serif] text-[#667085] text-[12px] text-nowrap">{task.assignedTo}</p>
                </td>
                <td className="px-3 py-4">
                  <p className="font-['Montserrat',sans-serif] text-slate-600 text-[12px] text-nowrap">{task.dueDate}</p>
                </td>
                <td className="px-4 py-4">
                  <div className={`inline-flex px-2 py-1 rounded-xl ${getStatusStyles(task.status)}`}>
                    <p className="font-['Montserrat',sans-serif] text-[12px]">{task.status}</p>
                  </div>
                </td>
                <td className="px-4 py-4 text-center relative">
                  <button
                    onClick={() => toggleDropdown(task.id)}
                    className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                  >
                    <MoreHorizontal className="w-6 h-6 text-blue-800" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {openDropdownId === task.id && (
                    <>
                      {/* Backdrop to close dropdown when clicking outside */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setOpenDropdownId(null)}
                      />
                      
                      {/* Dropdown */}
                      <div className="absolute right-4 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                        <button
                          onClick={() => handleAction("View", task.id)}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleAction("Edit", task.id)}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAction("Cancel", task.id)}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAction("Archive", task.id)}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          Archive
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-between items-center">
        <div className="bg-white border border-slate-200 flex h-[38px] items-center justify-between px-2 py-[7px] rounded-[10px] w-[136px]">
          <p className="font-['Montserrat',sans-serif] text-slate-900">10 per page</p>
          <div className="relative shrink-0 size-4">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <path d="M12.6667 6L8 10L3.33333 6" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M10 12L6 8L10 4" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded font-['Montserrat',sans-serif]">
            1
          </button>
          <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 transition-colors font-['Montserrat',sans-serif] text-slate-600">
            2
          </button>
          <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 transition-colors font-['Montserrat',sans-serif] text-slate-600">
            3
          </button>
          <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M6 4L10 8L6 12" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}