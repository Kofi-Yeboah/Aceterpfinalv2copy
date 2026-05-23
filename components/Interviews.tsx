import { useState } from "react";
import { Search, Download, Upload, ChevronDown, MoreHorizontal, Calendar, X, Edit, Trash2, Eye } from "lucide-react";
import { InterviewDetailsView } from "./InterviewDetailsView";

interface Interview {
  id: number;
  candidateName: string;
  position: string;
  interviewer: string;
  date: string;
  time: string;
  type: "Phone" | "Video" | "In-Person";
  status: "Scheduled" | "Completed" | "Cancelled" | "Rescheduled";
}

const mockInterviews: Interview[] = [
  {
    id: 1,
    candidateName: "Kwame Asante",
    position: "Senior Project Manager",
    interviewer: "Yaw Osei",
    date: "Dec 5, 2025",
    time: "10:00 AM",
    type: "Video",
    status: "Scheduled"
  },
  {
    id: 2,
    candidateName: "Abena Owusu",
    position: "Finance Officer",
    interviewer: "Kofi Mensah",
    date: "Dec 6, 2025",
    time: "2:00 PM",
    type: "In-Person",
    status: "Scheduled"
  },
  {
    id: 3,
    candidateName: "Nana Yaw",
    position: "HR Officer",
    interviewer: "Ama Darko",
    date: "Nov 28, 2025",
    time: "11:00 AM",
    type: "Video",
    status: "Completed"
  },
  {
    id: 4,
    candidateName: "Kwesi Appiah",
    position: "M&E Specialist",
    interviewer: "Yaw Osei",
    date: "Dec 3, 2025",
    time: "3:00 PM",
    type: "Phone",
    status: "Rescheduled"
  },
  {
    id: 5,
    candidateName: "Ama Serwaa",
    position: "Procurement Officer",
    interviewer: "Kofi Mensah",
    date: "Nov 30, 2025",
    time: "9:00 AM",
    type: "In-Person",
    status: "Cancelled"
  }
];

const positions = ["All Positions", "Senior Project Manager", "Finance Officer", "HR Officer", "M&E Specialist", "Procurement Officer"];
const types = ["All Types", "Phone", "Video", "In-Person"];
const statuses = ["All Statuses", "Scheduled", "Completed", "Cancelled", "Rescheduled"];

export function Interviews() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("All Positions");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedType, setSelectedType] = useState("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Dropdown states
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState<number | null>(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [newInterview, setNewInterview] = useState({
    candidateName: "",
    position: "",
    interviewer: "",
    date: "",
    time: "",
    type: "Video" as "Phone" | "Video" | "In-Person",
    notes: ""
  });

  // Filter interviews
  const filteredInterviews = mockInterviews.filter((interview) => {
    const matchesSearch = interview.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         interview.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         interview.interviewer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = selectedPosition === "All Positions" || interview.position === selectedPosition;
    const matchesType = selectedType === "All Types" || interview.type === selectedType;
    const matchesStatus = selectedStatus === "All Statuses" || interview.status === selectedStatus;
    
    return matchesSearch && matchesPosition && matchesType && matchesStatus;
  });

  const handleScheduleInterview = () => {
    console.log("Scheduling interview:", newInterview);
    setShowAddModal(false);
    setNewInterview({
      candidateName: "",
      position: "",
      interviewer: "",
      date: "",
      time: "",
      type: "Video",
      notes: ""
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-green-50 text-green-600";
      case "Completed":
        return "bg-blue-50 text-blue-600";
      case "Cancelled":
        return "bg-red-50 text-red-600";
      case "Rescheduled":
        return "bg-amber-50 text-amber-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  return (
    <>
      {showDetailView && selectedInterview ? (
        <InterviewDetailsView 
          interview={selectedInterview} 
          onBack={() => {
            setShowDetailView(false);
            setSelectedInterview(null);
          }} 
        />
      ) : (
        <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-slate-900">Interviews</h1>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2"
            >
              <Calendar size={16} />
              Schedule Interview
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

                {/* Position Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowPositionDropdown(!showPositionDropdown);
                      setShowTypeDropdown(false);
                      setShowStatusDropdown(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <span className="text-sm text-slate-900">{selectedPosition}</span>
                    <ChevronDown size={16} className="text-purple-700" />
                  </button>
                  {showPositionDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowPositionDropdown(false)} />
                      <div className="absolute top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                        {positions.map((pos) => (
                          <button
                            key={pos}
                            onClick={() => {
                              setSelectedPosition(pos);
                              setShowPositionDropdown(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Type Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowTypeDropdown(!showTypeDropdown);
                      setShowPositionDropdown(false);
                      setShowStatusDropdown(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <span className="text-sm text-slate-900">{selectedType}</span>
                    <ChevronDown size={16} className="text-purple-700" />
                  </button>
                  {showTypeDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowTypeDropdown(false)} />
                      <div className="absolute top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                        {types.map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setSelectedType(type);
                              setShowTypeDropdown(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                          >
                            {type}
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
                      setShowPositionDropdown(false);
                      setShowTypeDropdown(false);
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
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Candidate Name
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Position
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Interviewer
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Date & Time
                  </th>
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Type
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
                {filteredInterviews.map((interview) => (
                  <tr key={interview.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="text-[12px] font-medium text-black">{interview.candidateName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{interview.position}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{interview.interviewer}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[12px] text-slate-900">{interview.date}</p>
                        <p className="text-[12px] text-slate-500">{interview.time}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-xl bg-blue-50 text-blue-600 text-[12px]">
                        {interview.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(interview.status)}`}>
                        {interview.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="relative inline-block">
                        <button 
                          onClick={() => setShowActionDropdown(showActionDropdown === interview.id ? null : interview.id)}
                          className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                        >
                          <MoreHorizontal size={20} className="text-blue-800" />
                        </button>
                        {showActionDropdown === interview.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowActionDropdown(null)} />
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                              <button
                                onClick={() => {
                                  setSelectedInterview(interview);
                                  setShowDetailView(true);
                                  setShowActionDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Reschedule interview:", interview);
                                  setShowActionDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Cancel interview:", interview);
                                  setShowActionDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Cancel
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
            
            {filteredInterviews.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <p className="text-slate-500">No interviews found matching your filters.</p>
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

          {/* Schedule Interview Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900">Schedule Interview</h2>
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
                        <label className="text-xs text-slate-700">Candidate Name</label>
                        <input
                          type="text"
                          value={newInterview.candidateName}
                          onChange={(e) => setNewInterview({ ...newInterview, candidateName: e.target.value })}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter candidate name"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-slate-700">Position</label>
                        <select
                          value={newInterview.position}
                          onChange={(e) => setNewInterview({ ...newInterview, position: e.target.value })}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select Position</option>
                          {positions.slice(1).map((pos) => (
                            <option key={pos} value={pos}>{pos}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-slate-700">Interviewer</label>
                        <input
                          type="text"
                          value={newInterview.interviewer}
                          onChange={(e) => setNewInterview({ ...newInterview, interviewer: e.target.value })}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter interviewer name"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-slate-700">Interview Type</label>
                        <select
                          value={newInterview.type}
                          onChange={(e) => setNewInterview({ ...newInterview, type: e.target.value as "Phone" | "Video" | "In-Person" })}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="Video">Video</option>
                          <option value="Phone">Phone</option>
                          <option value="In-Person">In-Person</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-slate-700">Date</label>
                        <input
                          type="date"
                          value={newInterview.date}
                          onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-slate-700">Time</label>
                        <input
                          type="time"
                          value={newInterview.time}
                          onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-slate-700">Notes</label>
                      <textarea
                        value={newInterview.notes}
                        onChange={(e) => setNewInterview({ ...newInterview, notes: e.target.value })}
                        rows={4}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        placeholder="Add any additional notes or instructions..."
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
                    onClick={handleScheduleInterview}
                    disabled={!newInterview.candidateName || !newInterview.position || !newInterview.interviewer || !newInterview.date || !newInterview.time}
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Schedule
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