import { useState } from "react";
import { Search, ChevronDown, Upload, Download, Plus, MoreHorizontal, X, ArrowLeft, DollarSign, MessageSquare, Plane } from "lucide-react";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";
import { addLinkedCommsTask, addLinkedTravelTask } from "../lib/linkedTasksStore";

// Types
type Priority = "Low" | "Medium" | "High" | "Critical";
type TaskStatus = "Not Started" | "In Progress" | "On Hold" | "Completed" | "Blocked";

interface Task {
  id: string;
  name: string;
  phase: string;
  associatedProject: string;
  assignedTo: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  hoursAssigned: number;
  hoursSpent: number;
  billableHours: number;
  nonBillableHours: number;
  linkedToComms?: boolean;
  linkedToTravelPlan?: boolean;
}

interface TaskCost {
  id: string;
  itemName: string;
  category: string;
  unitCost: string;
  quantity: number;
  totalCost: string;
  status: "Pending" | "Approved" | "Ordered" | "Received";
}

// Mock task costs data
const TASK_COSTS: { [key: string]: TaskCost[] } = {
  "1": [
    { id: "c1", itemName: "Survey Software License", category: "Software", unitCost: "$1,200", quantity: 1, totalCost: "$1,200", status: "Approved" },
    { id: "c2", itemName: "Data Collection Tablets", category: "Equipment", unitCost: "$350", quantity: 5, totalCost: "$1,750", status: "Ordered" },
    { id: "c3", itemName: "Survey Design Consultation", category: "Services", unitCost: "$2,500", quantity: 1, totalCost: "$2,500", status: "Approved" },
    { id: "c4", itemName: "Printing & Materials", category: "Supplies", unitCost: "$450", quantity: 1, totalCost: "$450", status: "Pending" },
  ],
  "2": [
    { id: "c1", itemName: "Peer Review Honorarium", category: "Services", unitCost: "$800", quantity: 3, totalCost: "$2,400", status: "Pending" },
    { id: "c2", itemName: "Document Review Software", category: "Software", unitCost: "$150", quantity: 1, totalCost: "$150", status: "Approved" },
  ],
  "3": [
    { id: "c1", itemName: "Academic Database Access", category: "Software", unitCost: "$500", quantity: 1, totalCost: "$500", status: "Approved" },
    { id: "c2", itemName: "Research Assistant", category: "Services", unitCost: "$25/hr", quantity: 80, totalCost: "$2,000", status: "Approved" },
    { id: "c3", itemName: "Reference Management Tool", category: "Software", unitCost: "$120", quantity: 1, totalCost: "$120", status: "Received" },
  ],
  "4": [
    { id: "c1", itemName: "Meeting Room Rental", category: "Facilities", unitCost: "$250", quantity: 1, totalCost: "$250", status: "Pending" },
    { id: "c2", itemName: "Catering Services", category: "Services", unitCost: "$180", quantity: 1, totalCost: "$180", status: "Pending" },
    { id: "c3", itemName: "AV Equipment Rental", category: "Equipment", unitCost: "$150", quantity: 1, totalCost: "$150", status: "Approved" },
  ],
};

// Mock Data
const MOCK_TASKS: Task[] = [
  {
    id: "1",
    name: "Finalize Survey Instrument Design",
    phase: "1",
    associatedProject: "West Africa Regional Integration Study",
    assignedTo: "Yaw Osei",
    dueDate: "Dec 15, 2025",
    priority: "High",
    status: "In Progress",
    hoursAssigned: 10,
    hoursSpent: 5,
    billableHours: 8,
    nonBillableHours: 2
  },
  {
    id: "2",
    name: "Conduct Internal Peer Review of Draft",
    phase: "2",
    associatedProject: "Digital Economy Policy Brief Series",
    assignedTo: "Kofi Mensah",
    dueDate: "Jan 8, 2026",
    priority: "Medium",
    status: "Not Started",
    hoursAssigned: 8,
    hoursSpent: 0,
    billableHours: 5,
    nonBillableHours: 3
  },
  {
    id: "3",
    name: "Complete Literature Review",
    phase: "1",
    associatedProject: "West Africa Regional Integration Study",
    assignedTo: "Ama Darko",
    dueDate: "Nov 30, 2025",
    priority: "High",
    status: "In Progress",
    hoursAssigned: 12,
    hoursSpent: 6,
    billableHours: 10,
    nonBillableHours: 2
  },
  {
    id: "4",
    name: "Schedule Project Kick-off Meeting",
    phase: "4",
    associatedProject: "Climate Finance Readiness Program",
    assignedTo: "Kwesi Appiah",
    dueDate: "Nov 22, 2025",
    priority: "Critical",
    status: "Not Started",
    hoursAssigned: 5,
    hoursSpent: 0,
    billableHours: 3,
    nonBillableHours: 2,
    linkedToComms: true,
  },
  {
    id: "5",
    name: "Draft Stakeholder Engagement Plan",
    phase: "1",
    associatedProject: "Renewable Energy Transition Framework",
    assignedTo: "Nana Yaw",
    dueDate: "Dec 5, 2025",
    priority: "Medium",
    status: "In Progress",
    hoursAssigned: 7,
    hoursSpent: 3,
    billableHours: 4,
    nonBillableHours: 3
  },
  {
    id: "6",
    name: "Prepare Budget Allocation Report",
    phase: "2",
    associatedProject: "West Africa Regional Integration Study",
    assignedTo: "Yaw Osei",
    dueDate: "Dec 20, 2025",
    priority: "High",
    status: "Completed",
    hoursAssigned: 15,
    hoursSpent: 15,
    billableHours: 12,
    nonBillableHours: 3
  },
  {
    id: "7",
    name: "Coordinate Field Data Collection",
    phase: "3",
    associatedProject: "Sustainable Agriculture Development Initiative",
    assignedTo: "Kwaku Anane",
    dueDate: "Jan 15, 2026",
    priority: "Critical",
    status: "On Hold",
    hoursAssigned: 10,
    hoursSpent: 5,
    billableHours: 7,
    nonBillableHours: 3,
    linkedToTravelPlan: true,
  },
  {
    id: "8",
    name: "Review Policy Recommendations",
    phase: "4",
    associatedProject: "Digital Economy Policy Brief Series",
    assignedTo: "Kofi Mensah",
    dueDate: "Dec 1, 2025",
    priority: "High",
    status: "Blocked",
    hoursAssigned: 12,
    hoursSpent: 6,
    billableHours: 8,
    nonBillableHours: 4
  },
  {
    id: "9",
    name: "Submit Final Technical Report",
    phase: "5",
    associatedProject: "Climate Finance Readiness Program",
    assignedTo: "Kwesi Appiah",
    dueDate: "Feb 28, 2026",
    priority: "Medium",
    status: "Not Started",
    hoursAssigned: 10,
    hoursSpent: 0,
    billableHours: 5,
    nonBillableHours: 5
  },
  {
    id: "10",
    name: "Conduct Stakeholder Workshops",
    phase: "3",
    associatedProject: "Renewable Energy Transition Framework",
    assignedTo: "Nana Yaw",
    dueDate: "Jan 10, 2026",
    priority: "High",
    status: "In Progress",
    hoursAssigned: 8,
    hoursSpent: 4,
    billableHours: 6,
    nonBillableHours: 2,
    linkedToComms: true,
    linkedToTravelPlan: true,
  }
];

const PROJECTS = [
  "All Projects",
  "West Africa Regional Integration Study",
  "Digital Economy Policy Brief Series",
  "Climate Finance Readiness Program",
  "Sustainable Agriculture Development Initiative",
  "Renewable Energy Transition Framework"
];

// Project to Phases mapping
const PROJECT_PHASES: Record<string, string[]> = {
  "West Africa Regional Integration Study": [
    "Phase 1 - Research & Data Collection",
    "Phase 2 - Analysis & Reporting",
    "Phase 3 - Stakeholder Engagement"
  ],
  "Digital Economy Policy Brief Series": [
    "Phase 1 - Policy Analysis",
    "Phase 2 - Drafting & Review",
    "Phase 3 - Publication & Dissemination",
    "Phase 4 - Impact Assessment"
  ],
  "Climate Finance Readiness Program": [
    "Phase 1 - Capacity Assessment",
    "Phase 2 - Training & Development",
    "Phase 3 - Implementation Support",
    "Phase 4 - Monitoring & Evaluation",
    "Phase 5 - Knowledge Sharing"
  ],
  "Sustainable Agriculture Development Initiative": [
    "Phase 1 - Baseline Study",
    "Phase 2 - Pilot Implementation",
    "Phase 3 - Scale-up & Expansion"
  ],
  "Renewable Energy Transition Framework": [
    "Phase 1 - Feasibility Study",
    "Phase 2 - Policy Development",
    "Phase 3 - Stakeholder Consultation",
    "Phase 4 - Framework Finalization"
  ]
};

const STATUSES: TaskStatus[] = ["Not Started", "In Progress", "On Hold", "Completed", "Blocked"];
const ALL_STATUSES = ["All Statuses", ...STATUSES];
const TIME_PERIODS = ["All Time", "Last 7 Days", "Last 30 Days", "Last 3 Months", "Last 6 Months", "Last Year"];

// Comms-specific options for linked tasks
const AUDIENCE_OPTIONS = [
  "Donors",
  "Internal Staff",
  "Board Members",
  "Beneficiaries",
  "Partners",
  "Government",
  "Media",
  "General Public"
];

const CHANNEL_OPTIONS = [
  "Physical Event",
  "Social Media",
  "Email",
  "Website",
  "Press Release",
  "Newsletter",
  "Video Conference",
  "Print Media"
];

// Travel-specific options
const TRAVEL_PURPOSE_OPTIONS = [
  "Field Visit",
  "Stakeholder Meeting",
  "Conference/Workshop",
  "Training",
  "Data Collection",
  "Monitoring & Evaluation",
  "Project Launch",
  "Partner Coordination",
  "Donor Meeting",
  "Other"
];

const TRANSPORT_TYPE_OPTIONS = [
  "Flight - Economy",
  "Flight - Business",
  "Train",
  "Bus",
  "Vehicle (Project)",
  "Vehicle (Rental)",
  "Personal Vehicle"
];

const ACCOMMODATION_TYPE_OPTIONS = [
  "Hotel - Standard",
  "Hotel - Business",
  "Guest House",
  "Serviced Apartment",
  "Per Diem Only",
  "No Accommodation Needed"
];

export function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("All Time");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState<string | null>(null);
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<Task | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Form state for new task
  const [newTaskForm, setNewTaskForm] = useState({
    taskName: "",
    phase: "",
    associatedProject: "",
    assignedTo: "",
    dueDate: "",
    priority: "Medium" as Priority,
    status: "Not Started" as TaskStatus,
    billableHours: "",
    nonBillableHours: "",
    description: "",
    budget: "",
    linkedToComms: false,
    linkedToTravelPlan: false,
    // Comms-specific fields
    commsAudiences: [] as string[],
    commsChannels: [] as string[],
    // Travel-specific fields
    travelDestination: "",
    travelDepartureLocation: "",
    travelPurpose: "",
    travelDepartureDate: "",
    travelReturnDate: "",
    travelTransportType: "",
    travelAccommodationType: "",
    travelEstimatedCost: "",
    travelNotes: "",
  });

  const resetForm = () => {
    setNewTaskForm({
      taskName: "",
      phase: "",
      associatedProject: "",
      assignedTo: "",
      dueDate: "",
      priority: "Medium",
      status: "Not Started",
      billableHours: "",
      nonBillableHours: "",
      description: "",
      budget: "",
      linkedToComms: false,
      linkedToTravelPlan: false,
      commsAudiences: [],
      commsChannels: [],
      travelDestination: "",
      travelDepartureLocation: "",
      travelPurpose: "",
      travelDepartureDate: "",
      travelReturnDate: "",
      travelTransportType: "",
      travelAccommodationType: "",
      travelEstimatedCost: "",
      travelNotes: "",
    });
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.associatedProject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = selectedProject === "All Projects" || task.associatedProject === selectedProject;
    const matchesStatus = selectedStatus === "All Statuses" || task.status === selectedStatus;
    
    return matchesSearch && matchesProject && matchesStatus;
  });

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "Low": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      case "Medium": return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "High": return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      case "Critical": return "bg-red-100 text-red-700 hover:bg-red-100";
      default: return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "Completed": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "In Progress": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      case "Not Started": return "bg-slate-100 text-slate-700 hover:bg-slate-100";
      case "On Hold": return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "Blocked": return "bg-red-100 text-red-700 hover:bg-red-100";
      default: return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  const handleCreateTask = () => {
    const newId = String(tasks.length + 1);
    const newTask: Task = {
      id: newId,
      name: newTaskForm.taskName,
      phase: newTaskForm.phase,
      associatedProject: newTaskForm.associatedProject,
      assignedTo: newTaskForm.assignedTo,
      dueDate: newTaskForm.dueDate ? new Date(newTaskForm.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
      priority: newTaskForm.priority,
      status: newTaskForm.status,
      hoursAssigned: parseFloat(newTaskForm.billableHours || "0") + parseFloat(newTaskForm.nonBillableHours || "0"),
      hoursSpent: 0,
      billableHours: parseFloat(newTaskForm.billableHours || "0"),
      nonBillableHours: parseFloat(newTaskForm.nonBillableHours || "0"),
      linkedToComms: newTaskForm.linkedToComms,
      linkedToTravelPlan: newTaskForm.linkedToTravelPlan,
    };

    setTasks([...tasks, newTask]);

    // Auto-populate linked plans
    if (newTaskForm.linkedToComms) {
      addLinkedCommsTask({
        taskId: newId,
        taskName: newTaskForm.taskName,
        assignedTo: newTaskForm.assignedTo,
        project: newTaskForm.associatedProject,
        phase: newTaskForm.phase,
        dueDate: newTaskForm.dueDate,
        priority: newTaskForm.priority,
        status: "Planned",
        audiences: newTaskForm.commsAudiences,
        channels: newTaskForm.commsChannels,
        description: newTaskForm.description,
      });
    }

    if (newTaskForm.linkedToTravelPlan) {
      addLinkedTravelTask({
        taskId: newId,
        taskName: newTaskForm.taskName,
        assignedTo: newTaskForm.assignedTo,
        project: newTaskForm.associatedProject,
        phase: newTaskForm.phase,
        dueDate: newTaskForm.dueDate,
        priority: newTaskForm.priority,
        status: "Planned",
        destination: newTaskForm.travelDestination,
        departureLocation: newTaskForm.travelDepartureLocation,
        travelPurpose: newTaskForm.travelPurpose,
        departureDate: newTaskForm.travelDepartureDate,
        returnDate: newTaskForm.travelReturnDate,
        transportType: newTaskForm.travelTransportType,
        accommodationType: newTaskForm.travelAccommodationType,
        estimatedCost: parseFloat(newTaskForm.travelEstimatedCost || "0"),
        notes: newTaskForm.travelNotes,
      });
    }

    setShowAddTaskModal(false);
    resetForm();
  };

  const toggleCommsAudience = (audience: string) => {
    setNewTaskForm(prev => ({
      ...prev,
      commsAudiences: prev.commsAudiences.includes(audience)
        ? prev.commsAudiences.filter(a => a !== audience)
        : [...prev.commsAudiences, audience],
    }));
  };

  const toggleCommsChannel = (channel: string) => {
    setNewTaskForm(prev => ({
      ...prev,
      commsChannels: prev.commsChannels.includes(channel)
        ? prev.commsChannels.filter(c => c !== channel)
        : [...prev.commsChannels, channel],
    }));
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Task Management</h1>
        <button 
          onClick={() => setShowAddTaskModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span className="text-sm font-medium">Add New Task</span>
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

          <div className="flex items-center gap-2.5">
            {/* Export Button */}
            <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">Export</span>
              <Download size={16} className="text-purple-700" />
            </button>

            {/* Upload CSV Button */}
            <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">Upload CSV</span>
              <Upload size={16} className="text-purple-700" />
            </button>

            {/* Project Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProjectDropdown(!showProjectDropdown);
                  setShowStatusDropdown(false);
                  setShowTimeDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[140px]"
              >
                <span className="text-sm text-slate-900 truncate">{selectedProject}</span>
                <ChevronDown size={16} className="text-purple-700 flex-shrink-0" />
              </button>
              {showProjectDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowProjectDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
                    {PROJECTS.map((project) => (
                      <button
                        key={project}
                        onClick={() => {
                          setSelectedProject(project);
                          setShowProjectDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                          selectedProject === project ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                        )}
                      >
                        {project}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown);
                  setShowProjectDropdown(false);
                  setShowTimeDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedStatus}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {ALL_STATUSES.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setShowStatusDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                          selectedStatus === status ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Time Period Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowTimeDropdown(!showTimeDropdown);
                  setShowProjectDropdown(false);
                  setShowStatusDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedTimePeriod}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showTimeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowTimeDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {TIME_PERIODS.map((period) => (
                      <button
                        key={period}
                        onClick={() => {
                          setSelectedTimePeriod(period);
                          setShowTimeDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                          selectedTimePeriod === period ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                        )}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-blue-800 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">
                Task Name
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-20">
                Phase
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">
                Associated Project
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-32">
                Assigned To
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-28">
                Due Date
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-24">
                Priority
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-32">
                Status
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-28">
                Linked Plans
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-24">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-600">{task.name}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{task.phase}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-600">{task.associatedProject}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-600">{task.assignedTo}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{task.dueDate}</p>
                </td>
                <td className="px-4 py-4">
                  <Badge className={cn("text-[12px] font-medium shadow-none border-0", getPriorityColor(task.priority))}>
                    {task.priority}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <Badge className={cn("text-[12px] font-medium shadow-none border-0", getStatusColor(task.status))}>
                    {task.status}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    {task.linkedToComms && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 text-[10px] font-medium" title="Communications Plan">
                        <MessageSquare className="w-3 h-3" />
                        Comms
                      </span>
                    )}
                    {task.linkedToTravelPlan && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 text-[10px] font-medium" title="Travel Plan">
                        <Plane className="w-3 h-3" />
                        Travel
                      </span>
                    )}
                    {!task.linkedToComms && !task.linkedToTravelPlan && (
                      <span className="text-[11px] text-slate-400">&mdash;</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowActionDropdown(showActionDropdown === task.id ? null : task.id)}
                      className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                    >
                      <MoreHorizontal size={16} className="text-slate-600" />
                    </button>
                    {showActionDropdown === task.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowActionDropdown(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                          <button 
                            onClick={() => {
                              setSelectedTaskForDetails(task);
                              setShowActionDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            View Details
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                            Edit
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                            Reassign
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                            Change Status
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors">
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

        {filteredTasks.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-500">No tasks found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Task Details Modal */}
      {selectedTaskForDetails && (
        <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedTaskForDetails(null)}
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="size-6" />
                </button>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold text-slate-900">{selectedTaskForDetails.name}</h1>
                    {selectedTaskForDetails.linkedToComms && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[11px] font-medium">
                        <MessageSquare className="w-3 h-3" />
                        Comms Plan
                      </span>
                    )}
                    {selectedTaskForDetails.linkedToTravelPlan && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[11px] font-medium">
                        <Plane className="w-3 h-3" />
                        Travel Plan
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5">Task Details</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTaskForDetails(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="space-y-6">
              {/* Task Information Cards */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Task Information</h3>
                <div className="space-y-6">
                  {/* Row 1: Phase, Assigned To */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Phase</p>
                      <p className="text-sm font-medium text-slate-900">Phase {selectedTaskForDetails.phase}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Assigned To</p>
                      <p className="text-sm font-medium text-slate-900">{selectedTaskForDetails.assignedTo}</p>
                    </div>
                  </div>

                  {/* Associated Project */}
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Associated Project</p>
                    <p className="text-sm font-medium text-slate-900">{selectedTaskForDetails.associatedProject}</p>
                  </div>

                  {/* Row 2: Due Date, Priority, Status */}
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Due Date</p>
                      <p className="text-sm font-medium text-slate-900">{selectedTaskForDetails.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Priority</p>
                      <Badge className={cn("text-xs font-medium shadow-none border-0", getPriorityColor(selectedTaskForDetails.priority))}>
                        {selectedTaskForDetails.priority}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Status</p>
                      <Badge className={cn("text-xs font-medium shadow-none border-0", getStatusColor(selectedTaskForDetails.status))}>
                        {selectedTaskForDetails.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Linked Plans */}
                  {(selectedTaskForDetails.linkedToComms || selectedTaskForDetails.linkedToTravelPlan) && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Linked Plans</p>
                      <div className="flex items-center gap-2">
                        {selectedTaskForDetails.linkedToComms && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-violet-50 border border-violet-200 rounded-lg">
                            <MessageSquare className="w-4 h-4 text-violet-600" />
                            <div>
                              <p className="text-xs font-medium text-violet-700">Communications Plan</p>
                              <p className="text-[10px] text-violet-500">Auto-populated in Comms Plan Builder</p>
                            </div>
                          </div>
                        )}
                        {selectedTaskForDetails.linkedToTravelPlan && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-sky-50 border border-sky-200 rounded-lg">
                            <Plane className="w-4 h-4 text-sky-600" />
                            <div>
                              <p className="text-xs font-medium text-sky-700">Travel Plan</p>
                              <p className="text-[10px] text-sky-500">Auto-populated in Travel Plan Builder</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Time Tracking */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Time Tracking</h3>
                <div className="space-y-6">
                  {/* Hours Assigned & Remaining Hours - same row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                      <p className="text-xs text-blue-600 mb-1">Hours Assigned</p>
                      <p className="text-2xl font-semibold text-blue-900">{selectedTaskForDetails.hoursAssigned}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                      <p className="text-xs text-slate-600 mb-1">Remaining Hours</p>
                      <p className="text-2xl font-semibold text-slate-900">
                        {Math.max(selectedTaskForDetails.hoursAssigned - selectedTaskForDetails.hoursSpent, 0)}
                      </p>
                    </div>
                  </div>

                  {/* Billable vs Non-Billable Hours */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Hours Breakdown</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                        <p className="text-xs text-emerald-600 mb-1">Billable Hours</p>
                        <p className="text-lg font-semibold text-emerald-900">{selectedTaskForDetails.billableHours}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <p className="text-xs text-slate-600 mb-1">Non-Billable Hours</p>
                        <p className="text-lg font-semibold text-slate-900">{selectedTaskForDetails.nonBillableHours}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Budget */}
              {TASK_COSTS[selectedTaskForDetails.id] && (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-slate-700" />
                      <h3 className="text-lg font-semibold text-slate-900">Task Budget</h3>
                    </div>
                    <div className="bg-blue-50 px-4 py-2 rounded-lg">
                      <p className="text-xs text-blue-600 mb-0.5">Total Budget</p>
                      <p className="text-lg font-semibold text-blue-900">
                        ${TASK_COSTS[selectedTaskForDetails.id].reduce((sum, cost) => {
                          const amount = parseFloat(cost.totalCost.replace(/[$,]/g, ''));
                          return sum + amount;
                        }, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Costs Table */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead style={{ backgroundColor: "#0B01D0" }}>
                        <tr>
                          <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Item Name</th>
                          <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Category</th>
                          <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Unit Cost</th>
                          <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Quantity</th>
                          <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Total Cost</th>
                          <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TASK_COSTS[selectedTaskForDetails.id].map((cost, index) => (
                          <tr 
                            key={cost.id} 
                            className={cn(
                              "border-b border-slate-100 hover:bg-slate-50",
                              index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                            )}
                          >
                            <td className="px-4 py-3">
                              <p className="text-[12px] font-medium text-slate-900">{cost.itemName}</p>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-[12px] text-slate-600">{cost.category}</p>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <p className="text-[12px] text-slate-900">{cost.unitCost}</p>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <p className="text-[12px] text-slate-900">{cost.quantity}</p>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <p className="text-[12px] font-semibold text-slate-900">{cost.totalCost}</p>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={cn(
                                "inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium",
                                cost.status === "Approved" ? "bg-green-100 text-green-700" :
                                cost.status === "Ordered" ? "bg-blue-100 text-blue-700" :
                                cost.status === "Received" ? "bg-purple-100 text-purple-700" :
                                "bg-amber-100 text-amber-700"
                              )}>
                                {cost.status}
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
      )}

      {/* Add New Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900">Add New Task</h2>
              <button
                onClick={() => {
                  setShowAddTaskModal(false);
                  resetForm();
                }}
                className="p-1.5 hover:bg-slate-200 rounded transition-colors"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Modal Content - Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Task Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    Task Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTaskForm.taskName}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, taskName: e.target.value })}
                    placeholder="Enter task name"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Associated Project - Now First */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    Associated Project <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newTaskForm.associatedProject}
                    onChange={(e) => {
                      setNewTaskForm({ 
                        ...newTaskForm, 
                        associatedProject: e.target.value,
                        phase: ""
                      });
                    }}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a project</option>
                    {PROJECTS.filter(p => p !== "All Projects").map((project) => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>

                {/* Row 1: Phase and Assigned To */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">
                      Phase <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newTaskForm.phase}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, phase: e.target.value })}
                      disabled={!newTaskForm.associatedProject}
                      className={cn(
                        "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                        !newTaskForm.associatedProject && "bg-slate-100 cursor-not-allowed"
                      )}
                    >
                      <option value="">
                        {newTaskForm.associatedProject ? "Select phase" : "Select a project first"}
                      </option>
                      {newTaskForm.associatedProject && PROJECT_PHASES[newTaskForm.associatedProject]?.map((phase, index) => (
                        <option key={index} value={phase}>{phase}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">
                      Assigned To <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newTaskForm.assignedTo}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, assignedTo: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select staff member</option>
                      <option value="Yaw Osei">Yaw Osei</option>
                      <option value="Kofi Mensah">Kofi Mensah</option>
                      <option value="Ama Darko">Ama Darko</option>
                      <option value="Kwesi Appiah">Kwesi Appiah</option>
                      <option value="Nana Yaw">Nana Yaw</option>
                      <option value="Kwaku Anane">Kwaku Anane</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Due Date */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newTaskForm.dueDate}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Row 3: Priority and Status */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newTaskForm.priority}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value as Priority })}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newTaskForm.status}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, status: e.target.value as TaskStatus })}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Hours Section */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Time Allocation</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">
                        Billable Hours
                      </label>
                      <input
                        type="number"
                        value={newTaskForm.billableHours}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, billableHours: e.target.value })}
                        placeholder="0"
                        min="0"
                        step="0.5"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">
                        Non-Billable Hours
                      </label>
                      <input
                        type="number"
                        value={newTaskForm.nonBillableHours}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, nonBillableHours: e.target.value })}
                        placeholder="0"
                        min="0"
                        step="0.5"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Total Hours Display */}
                  {(newTaskForm.billableHours || newTaskForm.nonBillableHours) && (
                    <div className="mt-4 bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-blue-600">Total Hours Assigned</span>
                        <span className="text-lg font-semibold text-blue-900">
                          {(parseFloat(newTaskForm.billableHours || "0") + parseFloat(newTaskForm.nonBillableHours || "0")).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newTaskForm.description}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                    placeholder="Add any additional notes or details about this task..."
                    rows={4}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddTaskModal(false);
                  resetForm();
                }}
                className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateTask}
                className="px-4 py-2 text-sm text-white bg-purple-700 rounded-lg hover:bg-purple-800 transition-colors"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}