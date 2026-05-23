import { useState } from "react";
import { Search, FileText, Calendar, X, Plus, Trash2 } from "lucide-react";
import { cn } from "../lib/utils";

interface FeedbackForm {
  id: string;
  title: string;
  status?: string;
  statusColor?: string;
  uploadedTime: string;
  type: "form" | "response";
}

const mockForms: FeedbackForm[] = [
  {
    id: "1",
    title: "Employee Performance Form",
    uploadedTime: "11 hours ago",
    type: "form"
  },
  {
    id: "2",
    title: "Employee Timesheet",
    uploadedTime: "Just now",
    type: "form"
  }
];

const mockResponses: FeedbackForm[] = [
  {
    id: "1",
    title: "Employee Timesheet",
    status: "Pending Line Manager Approval",
    statusColor: "text-amber-600",
    uploadedTime: "2 mins ago",
    type: "response"
  },
  {
    id: "2",
    title: "Employee Performance Form",
    status: "Pending HR Manager Approval",
    statusColor: "text-amber-600",
    uploadedTime: "11 hours ago",
    type: "response"
  },
  {
    id: "3",
    title: "Employee Timesheet",
    status: "Approved",
    statusColor: "text-emerald-600",
    uploadedTime: "7 mins ago",
    type: "response"
  }
];

export function MyFeedback() {
  const [activeTab, setActiveTab] = useState<"forms" | "responses">("forms");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("All Time");
  const [showTimesheetModal, setShowTimesheetModal] = useState(false);
  const [timesheetData, setTimesheetData] = useState({
    project: "",
    weekStarting: "",
    weekEnding: "",
    timeEntries: [
      { day: "Monday", date: "", hours: "", task: "" },
      { day: "Tuesday", date: "", hours: "", task: "" },
      { day: "Wednesday", date: "", hours: "", task: "" },
      { day: "Thursday", date: "", hours: "", task: "" },
      { day: "Friday", date: "", hours: "", task: "" },
    ],
  });

  const currentData = activeTab === "forms" ? mockForms : mockResponses;

  const filteredData = currentData.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCardClick = (item: FeedbackForm) => {
    if (item.title === "Employee Timesheet" && activeTab === "forms") {
      setShowTimesheetModal(true);
    }
  };

  const handleTimesheetSubmit = () => {
    // Handle timesheet submission
    console.log("Timesheet submitted:", timesheetData);
    setShowTimesheetModal(false);
    // Reset form
    setTimesheetData({
      project: "",
      weekStarting: "",
      weekEnding: "",
      timeEntries: [
        { day: "Monday", date: "", hours: "", task: "" },
        { day: "Tuesday", date: "", hours: "", task: "" },
        { day: "Wednesday", date: "", hours: "", task: "" },
        { day: "Thursday", date: "", hours: "", task: "" },
        { day: "Friday", date: "", hours: "", task: "" },
      ],
    });
  };

  const updateTimeEntry = (index: number, field: string, value: string) => {
    const newEntries = [...timesheetData.timeEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setTimesheetData({ ...timesheetData, timeEntries: newEntries });
  };

  const getTotalHours = () => {
    return timesheetData.timeEntries.reduce((total, entry) => {
      return total + (parseFloat(entry.hours) || 0);
    }, 0);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">My Feedback</h1>
        
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab("forms")}
            className={cn(
              "px-6 py-2 rounded-lg transition-colors text-sm font-medium",
              activeTab === "forms"
                ? "bg-[#7C3AED] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            Forms
          </button>
          <button
            onClick={() => setActiveTab("responses")}
            className={cn(
              "px-6 py-2 rounded-lg transition-colors text-sm font-medium",
              activeTab === "responses"
                ? "bg-[#7C3AED] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            My Responses
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
          >
            <option>All Time</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        {filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No {activeTab === "forms" ? "forms" : "responses"} found</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleCardClick(item)}
              >
                {/* Form Preview */}
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-6 flex items-center justify-center h-48">
                  <div className="bg-white rounded-lg shadow-md p-6 w-full h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-1 bg-slate-300 rounded" />
                      <div className="w-12 h-1 bg-slate-300 rounded" />
                      <div className="w-6 h-1 bg-slate-300 rounded" />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-slate-300 group-hover:text-slate-400 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-1 bg-slate-200 rounded" />
                      <div className="w-3/4 h-1 bg-slate-200 rounded" />
                    </div>
                  </div>
                </div>

                {/* Form Info */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-slate-900 mb-1 truncate">
                    {item.title}
                  </h3>
                  {item.status && (
                    <p className={cn("text-xs mb-2", item.statusColor)}>
                      {item.status}
                    </p>
                  )}
                  <p className="text-xs text-slate-500">
                    Uploaded {item.uploadedTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timesheet Modal */}
      {showTimesheetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">Employee Timesheet</h2>
              <button
                onClick={() => setShowTimesheetModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-8">
              <div className="space-y-6">
                {/* Project and Date Range */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Project <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={timesheetData.project}
                      onChange={(e) => setTimesheetData({ ...timesheetData, project: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent"
                    >
                      <option value="">Select Project</option>
                      <option value="Community Health Initiative">Community Health Initiative</option>
                      <option value="Youth Empowerment Program">Youth Empowerment Program</option>
                      <option value="Water Sanitation Project">Water Sanitation Project</option>
                      <option value="Education Access Initiative">Education Access Initiative</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Week Starting <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={timesheetData.weekStarting}
                      onChange={(e) => setTimesheetData({ ...timesheetData, weekStarting: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Week Ending <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={timesheetData.weekEnding}
                      onChange={(e) => setTimesheetData({ ...timesheetData, weekEnding: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Time Entries Table */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#0B01D0] text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Day</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Hours</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Task Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {timesheetData.timeEntries.map((entry, index) => (
                        <tr key={index} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">{entry.day}</td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={entry.date}
                              onChange={(e) => updateTimeEntry(index, "date", e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              max="24"
                              placeholder="0"
                              value={entry.hours}
                              onChange={(e) => updateTimeEntry(index, "hours", e.target.value)}
                              className="w-24 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              placeholder="Describe your work"
                              value={entry.task}
                              onChange={(e) => updateTimeEntry(index, "task", e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Hours */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Total Hours for Week:</span>
                  <span className="text-2xl font-bold text-[#0B01D0]">{getTotalHours().toFixed(1)} hrs</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 border-t border-slate-200 flex items-center justify-end gap-4">
              <button
                onClick={() => setShowTimesheetModal(false)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTimesheetSubmit}
                className="px-6 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0900a5] transition-colors"
              >
                Submit Timesheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyFeedback;