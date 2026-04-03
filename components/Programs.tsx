import { useState } from "react";
import { Search, ChevronDown, Plus, Eye, ArrowLeft, Users, Briefcase, X, FolderOpen } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

type ProgramStatus = "Active" | "Closed";

interface ProgramProject {
  id: string;
  name: string;
  projectManager: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  budget: string;
  stage: string;
}

interface Program {
  id: string;
  programId: string;
  name: string;
  programManager: string;
  status: ProgramStatus;
  description: string;
  projects: ProgramProject[];
}

const MOCK_PROGRAMS: Program[] = [
  {
    id: "1",
    programId: "PRG-001",
    name: "West Africa Economic Development Program",
    programManager: "Yaw Osei",
    status: "Active",
    description: "A comprehensive program focused on economic development across West African countries, encompassing regional integration studies, digital economy policy, and climate finance readiness. The program aims to create a framework for sustainable economic growth through targeted interventions across multiple sectors.",
    projects: [
      { id: "1", name: "West Africa Regional Integration Study", projectManager: "Yaw Osei", status: "Draft", progress: 65, startDate: "Jan 15, 2025", endDate: "Aug 30, 2025", budget: "$450,000", stage: "Inception & Planning" },
      { id: "2", name: "Digital Economy Policy Brief Series", projectManager: "Kofi Mensah", status: "Closed", progress: 100, startDate: "Mar 1, 2024", endDate: "Nov 15, 2024", budget: "$320,000", stage: "Closure" },
      { id: "3", name: "Climate Finance Readiness Program", projectManager: "Kwesi Appiah", status: "Draft", progress: 5, startDate: "Nov 1, 2025", endDate: "Jun 30, 2026", budget: "$25,000", stage: "Inception & Planning" },
    ],
  },
  {
    id: "2",
    programId: "PRG-002",
    name: "Sustainable Communities Initiative",
    programManager: "Nana Yaw",
    status: "Active",
    description: "A program aimed at building sustainable communities through agricultural development and renewable energy transition across rural areas. It adopts a multi-sectoral approach combining food systems transformation with clean energy adoption.",
    projects: [
      { id: "4", name: "Sustainable Agriculture Development Initiative", projectManager: "Nana Yaw", status: "Active", progress: 75, startDate: "Apr 10, 2025", endDate: "Dec 20, 2025", budget: "$580,000", stage: "Delivery" },
      { id: "5", name: "Renewable Energy Transition Framework", projectManager: "Kwaku Anane", status: "Pending Approval", progress: 90, startDate: "Feb 5, 2025", endDate: "Oct 15, 2025", budget: "$690,000", stage: "Closure" },
    ],
  },
  {
    id: "3",
    programId: "PRG-003",
    name: "Youth & Social Development Program",
    programManager: "Kwame Asante",
    status: "Active",
    description: "This program focuses on empowering youth through employment skills development and strengthening healthcare systems in underserved regions. It targets vulnerable populations with integrated social service delivery models.",
    projects: [
      { id: "7", name: "Youth Employment Skills Development", projectManager: "Kwame Asante", status: "Active", progress: 44, startDate: "May 15, 2025", endDate: "Oct 30, 2025", budget: "$150,000", stage: "Delivery" },
      { id: "6", name: "Healthcare System Strengthening Project", projectManager: "Ama Serwaa", status: "Pending Approval", progress: 35, startDate: "Jun 1, 2025", endDate: "Dec 31, 2025", budget: "$750,000", stage: "Inception & Planning" },
    ],
  },
  {
    id: "4",
    programId: "PRG-004",
    name: "Urban Development & Infrastructure Program",
    programManager: "Yaw Osei",
    status: "Active",
    description: "A large-scale program for urban infrastructure development, including transport, housing, and public amenities upgrades. Designed as a multi-year initiative to transform urban landscapes in three major cities.",
    projects: [
      { id: "8", name: "Urban Infrastructure Development Plan", projectManager: "Yaw Osei", status: "Rejected", progress: 15, startDate: "Feb 10, 2025", endDate: "Sep 20, 2025", budget: "$1,200,000", stage: "Inception & Planning" },
    ],
  },
  {
    id: "5",
    programId: "PRG-005",
    name: "Education Access & Quality Program",
    programManager: "Ama Serwaa",
    status: "Active",
    description: "An upcoming program designed to improve education access and quality in rural and peri-urban areas. Will focus on teacher training, school infrastructure, and digital learning tools.",
    projects: [],
  },
  {
    id: "6",
    programId: "PRG-006",
    name: "Gender Equality & Social Inclusion Program",
    programManager: "Kofi Mensah",
    status: "Closed",
    description: "A program aimed at promoting gender equality and social inclusion across various sectors. Planned activities included policy advocacy, community engagement, and institutional capacity building.",
    projects: [],
  },
  {
    id: "7",
    programId: "PRG-007",
    name: "Water & Sanitation Improvement Program",
    programManager: "Kwesi Appiah",
    status: "Closed",
    description: "A completed program that addressed water supply and sanitation challenges across three provinces. Successfully delivered clean water infrastructure and improved sanitation facilities to over 15,000 beneficiaries.",
    projects: [],
  },
];

const PROGRAM_MANAGERS = ["All Managers", "Yaw Osei", "Kofi Mensah", "Kwesi Appiah", "Nana Yaw", "Kwaku Anane", "Ama Serwaa", "Kwame Asante"];
const STATUSES_FILTER = ["All Statuses", "Active", "Closed"];

export function Programs() {
  const [programs, setPrograms] = useState<Program[]>(MOCK_PROGRAMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPM, setSelectedPM] = useState("All Managers");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showPMDropdown, setShowPMDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showNewProgramModal, setShowNewProgramModal] = useState(false);

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.programManager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.programId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPM = selectedPM === "All Managers" || program.programManager === selectedPM;
    const matchesStatus = selectedStatus === "All Statuses" || program.status === selectedStatus;
    return matchesSearch && matchesPM && matchesStatus;
  });

  const getStatusColor = (status: ProgramStatus) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700 hover:bg-green-100";
      case "Closed": return "bg-slate-200 text-slate-800 hover:bg-slate-200";
      default: return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  const handleCreateProgram = (data: { name: string; programManager: string; description: string }) => {
    const newId = String(programs.length + 1);
    const newProgramId = `PRG-${String(programs.length + 1).padStart(3, "0")}`;
    const newProgram: Program = {
      id: newId,
      programId: newProgramId,
      name: data.name,
      programManager: data.programManager,
      status: "Active",
      description: data.description,
      projects: [],
    };
    setPrograms((prev) => [...prev, newProgram]);
    setShowNewProgramModal(false);
  };

  // Detail view
  if (selectedProgram) {
    return (
      <ProgramDetailsView
        program={selectedProgram}
        onBack={() => setSelectedProgram(null)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Programs</h1>
        <button
          onClick={() => setShowNewProgramModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0901a8] transition-colors text-[13px]"
        >
          <Plus className="w-4 h-4" />
          New Program
        </button>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* PM Filter */}
        <div className="relative">
          <button
            onClick={() => { setShowPMDropdown(!showPMDropdown); setShowStatusDropdown(false); }}
            className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 hover:bg-slate-50"
          >
            {selectedPM}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showPMDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowPMDropdown(false)} />
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 max-h-64 overflow-y-auto">
                {PROGRAM_MANAGERS.map((pm) => (
                  <button
                    key={pm}
                    onClick={() => { setSelectedPM(pm); setShowPMDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-slate-50 ${selectedPM === pm ? "bg-blue-50 text-blue-600" : "text-slate-700"}`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowPMDropdown(false); }}
            className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 hover:bg-slate-50"
          >
            {selectedStatus}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showStatusDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                {STATUSES_FILTER.map((status) => (
                  <button
                    key={status}
                    onClick={() => { setSelectedStatus(status); setShowStatusDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-slate-50 ${selectedStatus === status ? "bg-blue-50 text-blue-600" : "text-slate-700"}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-blue-600">
              <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Program ID</th>
              <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Program Name</th>
              <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Manager</th>
              <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Description</th>
              <th className="text-center px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">No. of Projects</th>
              <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Status</th>
              <th className="text-center px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-500 text-[13px]">
                  No programs found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredPrograms.map((program, index) => (
                <tr
                  key={program.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                >
                  <td className="px-4 py-3 text-[12px] text-blue-600 font-medium">{program.programId}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-900 font-medium max-w-[260px]">
                    <span className="truncate block">{program.name}</span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-700">{program.programManager}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-500 max-w-[320px]">
                    <span className="truncate block">{program.description}</span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-700 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-700 font-medium">
                      {program.projects.length}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`text-[11px] ${getStatusColor(program.status)}`}>
                      {program.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedProgram(program)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[12px] text-slate-500">
        <span>Showing {filteredPrograms.length} of {programs.length} programs</span>
        <span>{programs.filter(p => p.status === "Active").length} Active &middot; {programs.filter(p => p.status === "Closed").length} Closed</span>
      </div>

      {/* New Program Modal */}
      {showNewProgramModal && (
        <NewProgramModal
          onClose={() => setShowNewProgramModal(false)}
          onCreate={handleCreateProgram}
        />
      )}
    </div>
  );
}

// ─── New Program Modal ──────────────────────────────────────────────────────

function NewProgramModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: { name: string; programManager: string; description: string }) => void;
}) {
  const [name, setName] = useState("");
  const [programManager, setProgramManager] = useState("");
  const [description, setDescription] = useState("");
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);

  const managers = ["Yaw Osei", "Kofi Mensah", "Kwesi Appiah", "Nana Yaw", "Kwaku Anane", "Ama Serwaa", "Kwame Asante"];

  const canSubmit = name.trim() && programManager && description.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onCreate({ name: name.trim(), programManager, description: description.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">New Program</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Program Name */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-medium text-slate-500 mb-1.5">
              Program Name
            </label>
            <input
              type="text"
              placeholder="Enter program name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] placeholder:text-slate-400"
            />
          </div>

          {/* Program Manager */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-medium text-slate-500 mb-1.5">
              Program Manager
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowManagerDropdown(!showManagerDropdown)}
                className="w-full flex items-center justify-between px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0]"
              >
                <span className={programManager ? "text-slate-900" : "text-slate-400"}>
                  {programManager || "Select manager"}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {showManagerDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowManagerDropdown(false)} />
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 max-h-48 overflow-y-auto">
                    {managers.map((m) => (
                      <button
                        key={m}
                        onClick={() => { setProgramManager(m); setShowManagerDropdown(false); }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${programManager === m ? "bg-blue-50 text-blue-600" : "text-slate-700"}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-medium text-slate-500 mb-1.5">
              Description
            </label>
            <textarea
              placeholder="Provide a brief description of the program"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] resize-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-5 py-2 bg-[#7c3aed] text-white rounded-lg text-[13px] font-medium hover:bg-[#6d28d9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Program
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Program Details View ──────────────────────────────────────────────────────

function ProgramDetailsView({ program, onBack }: { program: Program; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "projects">("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700 hover:bg-green-100";
      case "Closed": return "bg-slate-200 text-slate-800 hover:bg-slate-200";
      case "Draft": return "bg-slate-100 text-slate-700 hover:bg-slate-100";
      case "Pending Approval": return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "Approved": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      case "Rejected": return "bg-red-100 text-red-700 hover:bg-red-100";
      case "In Progress": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      default: return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-emerald-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-amber-500";
    return "bg-slate-400";
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Inception & Planning": return "bg-indigo-100 text-indigo-700";
      case "Delivery": return "bg-blue-100 text-blue-700";
      case "Closure": return "bg-slate-200 text-slate-800";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "projects" as const, label: `Projects (${program.projects.length})` },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 bg-white border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] text-slate-600 hover:text-slate-900 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Programs
        </button>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">{program.name}</h1>
              <Badge className={`text-[11px] shadow-none border-0 ${getStatusColor(program.status)}`}>
                {program.status}
              </Badge>
            </div>
            <p className="text-[13px] text-slate-500 mt-1">
              {program.programId} &middot; Managed by {program.programManager}
            </p>
          </div>
        </div>
      </div>

      {/* Pill-style Tabs (Document Vault pattern) */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-1.5 rounded-lg text-sm transition-colors min-w-[120px] flex items-center justify-center gap-1.5 ${
                activeTab === tab.key
                  ? "bg-purple-700 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "overview" ? (
          <div className="p-6 space-y-6">
            {/* Program Information Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-5">Program Information</h2>
              <div className="grid grid-cols-3 gap-6 mb-5">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Program ID</p>
                  <p className="text-sm font-medium text-slate-900">{program.programId}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Program Manager</p>
                  <p className="text-sm font-medium text-slate-900">{program.programManager}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Status</p>
                  <Badge className={`text-xs font-medium shadow-none border-0 ${getStatusColor(program.status)}`}>
                    {program.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1">No. of Projects</p>
                  <p className="text-sm font-medium text-slate-900">{program.projects.length}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Description</h2>
              <p className="text-[13px] text-slate-600 leading-relaxed">{program.description}</p>
            </div>

            {/* Projects Table (inline on overview) */}
            {program.projects.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-[#0B01D0]" />
                    <h2 className="text-lg font-semibold text-slate-900">Projects</h2>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-medium">{program.projects.length}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab("projects")}
                    className="text-[12px] text-[#0B01D0] hover:underline font-medium"
                  >
                    View All
                  </button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-600">
                      <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Project Name</th>
                      <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Project Manager</th>
                      <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Stage</th>
                      <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Progress</th>
                      <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {program.projects.map((project, index) => (
                      <tr
                        key={project.id}
                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                      >
                        <td className="px-4 py-3 text-[12px] text-slate-900 font-medium max-w-[240px]">
                          <span className="truncate block">{project.name}</span>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{project.projectManager}</td>
                        <td className="px-4 py-3">
                          <Badge className={cn("text-[10px] shadow-none border-0", getStageColor(project.stage))}>
                            {project.stage}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 w-28">
                            <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${getProgressColor(project.progress)}`}
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-[11px] text-slate-500 w-8 text-right">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={cn("text-[11px] shadow-none border-0", getStatusColor(project.status))}>
                            {project.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {program.projects.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FolderOpen className="w-4 h-4 text-[#0B01D0]" />
                  <h2 className="text-lg font-semibold text-slate-900">Projects</h2>
                </div>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <Briefcase className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-[13px] text-slate-500">No projects assigned to this program yet.</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ─── Projects Tab (full table view) ─── */
          <div className="p-6">
            {program.projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg border border-slate-200">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Briefcase className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-[14px] font-medium text-slate-900 mb-1">No Projects Yet</h3>
                <p className="text-[13px] text-slate-500 mb-4 max-w-sm">
                  This program doesn't have any projects assigned yet.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-600">
                      <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Project Name</th>
                      <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Project Manager</th>
                      <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Stage</th>
                      <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Start Date</th>
                      <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">End Date</th>
                      <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Budget</th>
                      <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Progress</th>
                      <th className="text-left px-4 py-3 text-[12px] text-white whitespace-nowrap font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {program.projects.map((project, index) => (
                      <tr
                        key={project.id}
                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                      >
                        <td className="px-4 py-3 text-[12px] text-slate-900 font-medium max-w-[240px]">
                          <span className="truncate block">{project.name}</span>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{project.projectManager}</td>
                        <td className="px-4 py-3">
                          <Badge className={cn("text-[10px] shadow-none border-0", getStageColor(project.stage))}>
                            {project.stage}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{project.startDate}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{project.endDate}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-900 font-medium">{project.budget}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 w-28">
                            <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${getProgressColor(project.progress)}`}
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-[11px] text-slate-600 w-8 text-right">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={cn("text-[11px] shadow-none border-0", getStatusColor(project.status))}>
                            {project.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Projects Tab Footer */}
                <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="text-[12px] text-slate-500">
                    {program.projects.length} project{program.projects.length !== 1 ? "s" : ""} in this program
                  </span>
                  <span className="text-[12px] text-slate-500">
                    Total Budget: {program.projects.reduce((sum, p) => sum + parseFloat(p.budget.replace(/[$,]/g, "") || "0"), 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}