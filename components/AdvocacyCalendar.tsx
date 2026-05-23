import { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, X,
  Calendar, CheckSquare, Send, MapPin, Users, Clock, Target, ArrowLeft
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  subscribe, getAdvocacyEvents, getAdvocacyTasks, getOutreachEntries,
  getStakeholders, addAdvocacyEvent, updateEventStatus,
  addAdvocacyTask, updateTaskStatus, addOutreachEntry,
  type AdvocacyEvent, type AdvocacyTask, type OutreachEntry,
} from "../lib/advocacyStore";

const EVENT_TYPE_COLORS: Record<string, string> = {
  "Lobbying Meeting": "bg-blue-500", Consultation: "bg-purple-500", Briefing: "bg-indigo-500",
  "Public Event": "bg-emerald-500", Workshop: "bg-teal-500", Conference: "bg-amber-500",
};
const EVENT_TYPE_BADGE: Record<string, string> = {
  "Lobbying Meeting": "bg-blue-50 text-blue-700 border border-blue-200",
  Consultation: "bg-purple-50 text-purple-700 border border-purple-200",
  Briefing: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  "Public Event": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Workshop: "bg-teal-50 text-teal-700 border border-teal-200",
  Conference: "bg-amber-50 text-amber-700 border border-amber-200",
};
const STATUS_COLORS: Record<string, string> = {
  Scheduled: "bg-blue-50 text-blue-700", Completed: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700", Postponed: "bg-amber-50 text-amber-700",
};
const PRIORITY_COLORS: Record<string, string> = { High: "bg-red-50 text-red-700 border border-red-200", Medium: "bg-amber-50 text-amber-700 border border-amber-200", Low: "bg-green-50 text-green-700 border border-green-200" };
const TASK_STATUS_COLORS: Record<string, string> = { "To Do": "bg-slate-100 text-slate-700", "In Progress": "bg-blue-50 text-blue-700", Done: "bg-emerald-50 text-emerald-700", Overdue: "bg-red-50 text-red-700" };
const OUTREACH_STATUS_COLORS: Record<string, string> = { Sent: "bg-blue-50 text-blue-700", Delivered: "bg-emerald-50 text-emerald-700", Published: "bg-purple-50 text-purple-700", Pending: "bg-amber-50 text-amber-700", "No Response": "bg-slate-100 text-slate-700" };

const EVENT_TYPES: AdvocacyEvent["type"][] = ["Lobbying Meeting", "Consultation", "Briefing", "Public Event", "Workshop", "Conference"];
const ISSUE_AREAS = ["Digital Economy", "Youth Employment", "Trade Policy", "Climate Finance", "Gender Equality", "Agriculture", "Infrastructure", "Health Systems", "SME Development", "Governance", "Education", "Energy"];
const OUTREACH_TYPES: OutreachEntry["type"][] = ["Email", "Phone Call", "Op-Ed Submission", "Event Participation", "Letter", "Social Media"];

export function AdvocacyCalendar() {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick(t => t + 1)), []);

  const [activeTab, setActiveTab] = useState<"calendar" | "tasks" | "outreach">("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddOutreach, setShowAddOutreach] = useState(false);
  const [taskStatusFilter, setTaskStatusFilter] = useState("all");
  const [taskPriorityFilter, setTaskPriorityFilter] = useState("all");
  const [showTaskStatusDD, setShowTaskStatusDD] = useState(false);
  const [showTaskPriorityDD, setShowTaskPriorityDD] = useState(false);
  const [outreachTypeFilter, setOutreachTypeFilter] = useState("all");
  const [outreachStatusFilter, setOutreachStatusFilter] = useState("all");
  const [showOutreachTypeDD, setShowOutreachTypeDD] = useState(false);
  const [showOutreachStatusDD, setShowOutreachStatusDD] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState<number | null>(null);
  const [showActionDD, setShowActionDD] = useState<number | null>(null);

  const events = getAdvocacyEvents();
  const allTasks = getAdvocacyTasks();
  const allOutreach = getOutreachEntries();
  const stakeholders = getStakeholders();

  /* ─── Calendar helpers ─── */
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(e => e.date === dateStr);
  };

  const selectedDateEvents = selectedDate ? events.filter(e => e.date === selectedDate) : [];

  /* ─── Task filtering ─── */
  const filteredTasks = allTasks.filter(t => {
    const matchStatus = taskStatusFilter === "all" || t.status === taskStatusFilter;
    const matchPriority = taskPriorityFilter === "all" || t.priority === taskPriorityFilter;
    return matchStatus && matchPriority;
  });

  /* ─── Outreach filtering ─── */
  const filteredOutreach = allOutreach.filter(o => {
    const matchType = outreachTypeFilter === "all" || o.type === outreachTypeFilter;
    const matchStatus = outreachStatusFilter === "all" || o.status === outreachStatusFilter;
    return matchType && matchStatus;
  });

  const tabs = [
    { key: "calendar" as const, label: "Calendar", icon: <Calendar size={14} /> },
    { key: "tasks" as const, label: "Tasks", icon: <CheckSquare size={14} /> },
    { key: "outreach" as const, label: "Outreach Tracker", icon: <Send size={14} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Advocacy Calendar</h1>
        <div className="flex items-center gap-2">
          {activeTab === "calendar" && (
            <button onClick={() => setShowAddEvent(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] shadow-sm">
              <Plus size={16} /><span className="text-sm font-medium">Add Event</span>
            </button>
          )}
          {activeTab === "tasks" && (
            <button onClick={() => setShowAddTask(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] shadow-sm">
              <Plus size={16} /><span className="text-sm font-medium">Add Task</span>
            </button>
          )}
          {activeTab === "outreach" && (
            <button onClick={() => setShowAddOutreach(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] shadow-sm">
              <Plus size={16} /><span className="text-sm font-medium">Add Outreach</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 border-b border-slate-200">
        <div className="inline-flex bg-slate-100 p-1 rounded-lg gap-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-colors",
                activeTab === t.key ? "bg-[#0B01D0] text-white shadow-sm" : "text-slate-600 hover:text-slate-900")}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ CALENDAR TAB ═══ */}
      {activeTab === "calendar" && (
        <div className="flex-1 overflow-auto p-6">
          <div className="flex gap-6 h-full">
            <div className="flex-1">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronLeft size={18} className="text-slate-600" /></button>
                <h2 className="text-[16px] font-semibold text-slate-900">{monthName}</h2>
                <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronRight size={18} className="text-slate-600" /></button>
              </div>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                  <div key={d} className="bg-slate-50 px-2 py-2 text-center text-[10px] font-semibold text-slate-500">{d}</div>
                ))}
                {calendarDays.map((day, i) => {
                  const dayEvents = day ? getEventsForDay(day) : [];
                  const dateStr = day ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : "";
                  const isSelected = dateStr === selectedDate;
                  const isToday = day && new Date().toISOString().split("T")[0] === dateStr;
                  return (
                    <div key={i} onClick={() => day && setSelectedDate(isSelected ? null : dateStr)}
                      className={cn("bg-white min-h-[80px] p-1.5 cursor-pointer hover:bg-slate-50 transition-colors",
                        isSelected && "ring-2 ring-[#0B01D0] ring-inset", !day && "bg-slate-50/50 cursor-default")}>
                      {day && (
                        <>
                          <span className={cn("text-[11px] font-medium", isToday ? "bg-[#0B01D0] text-white rounded-full w-6 h-6 flex items-center justify-center" : "text-slate-600")}>{day}</span>
                          <div className="mt-1 space-y-0.5">
                            {dayEvents.slice(0, 2).map(ev => (
                              <div key={ev.id} className={cn("rounded px-1 py-0.5 text-[8px] text-white truncate", EVENT_TYPE_COLORS[ev.type] || "bg-slate-500")}>
                                {ev.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && <div className="text-[8px] text-slate-400 px-1">+{dayEvents.length - 2} more</div>}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Side Panel */}
            <div className="w-80 shrink-0">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden h-full flex flex-col">
                <div className="px-4 py-3 bg-indigo-50 border-b border-slate-200">
                  <h3 className="text-[13px] font-semibold text-slate-800">
                    {selectedDate ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "Select a date"}
                  </h3>
                </div>
                <div className="flex-1 overflow-auto">
                  {selectedDate ? (
                    selectedDateEvents.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {selectedDateEvents.map(ev => (
                          <div key={ev.id} className="p-4 hover:bg-slate-50 cursor-pointer" onClick={() => setShowEventDetail(ev.id)}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-medium", EVENT_TYPE_BADGE[ev.type])}>{ev.type}</span>
                              <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-medium", STATUS_COLORS[ev.status])}>{ev.status}</span>
                            </div>
                            <p className="text-[12px] font-medium text-slate-900 mt-1">{ev.title}</p>
                            <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                              <span className="flex items-center gap-1"><Clock size={10} /> {ev.time}</span>
                              {ev.location && <span className="flex items-center gap-1"><MapPin size={10} /> {ev.location}</span>}
                            </div>
                            <div className="flex items-center gap-1 mt-1.5">
                              <Users size={10} className="text-slate-400" />
                              <span className="text-[9px] text-slate-400">{ev.assignedTo.join(", ")}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <Calendar size={24} className="mb-2" />
                        <p className="text-[12px]">No events on this date</p>
                        <button onClick={() => setShowAddEvent(true)} className="mt-2 text-[11px] text-[#0B01D0] font-medium hover:underline">Add Event</button>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                      <Calendar size={24} className="mb-2" />
                      <p className="text-[12px]">Click a date to see events</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TASKS TAB ═══ */}
      {activeTab === "tasks" && (
        <>
          <div className="px-6 py-3 bg-white border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <button onClick={() => { setShowTaskStatusDD(!showTaskStatusDD); setShowTaskPriorityDD(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 shadow-sm min-w-[140px]">
                  <span className="text-sm text-slate-900 truncate">{taskStatusFilter === "all" ? "All Statuses" : taskStatusFilter}</span>
                  <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
                </button>
                {showTaskStatusDD && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowTaskStatusDD(false)} />
                    <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                      {["all", "To Do", "In Progress", "Done", "Overdue"].map(s => (
                        <button key={s} onClick={() => { setTaskStatusFilter(s); setShowTaskStatusDD(false); }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700">{s === "all" ? "All Statuses" : s}</button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="relative">
                <button onClick={() => { setShowTaskPriorityDD(!showTaskPriorityDD); setShowTaskStatusDD(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 shadow-sm min-w-[140px]">
                  <span className="text-sm text-slate-900 truncate">{taskPriorityFilter === "all" ? "All Priorities" : taskPriorityFilter}</span>
                  <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
                </button>
                {showTaskPriorityDD && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowTaskPriorityDD(false)} />
                    <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                      {["all", "High", "Medium", "Low"].map(p => (
                        <button key={p} onClick={() => { setTaskPriorityFilter(p); setShowTaskPriorityDD(false); }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700">{p === "all" ? "All Priorities" : p}</button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  {["Task", "Assigned To", "Due Date", "Priority", "Status", "Issue Area", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.length > 0 ? filteredTasks.map((t, idx) => (
                  <tr key={t.id} className={cn("hover:bg-slate-50 transition-colors", idx % 2 === 1 && "bg-slate-50/50")}>
                    <td className="px-4 py-3">
                      <p className="text-[11px] text-slate-900 font-medium">{t.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{t.description}</p>
                    </td>
                    <td className="px-4 py-3"><p className="text-[11px] text-slate-600">{t.assignedTo}</p></td>
                    <td className="px-4 py-3"><p className="text-[11px] text-slate-600">{new Date(t.dueDate).toLocaleDateString()}</p></td>
                    <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", PRIORITY_COLORS[t.priority])}>{t.priority}</span></td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <button onClick={() => setShowActionDD(showActionDD === t.id ? null : t.id)}
                          className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium cursor-pointer", TASK_STATUS_COLORS[t.status])}>{t.status}</button>
                        {showActionDD === t.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowActionDD(null)} />
                            <div className="absolute left-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                              {(["To Do", "In Progress", "Done", "Overdue"] as const).map(s => (
                                <button key={s} onClick={() => { updateTaskStatus(t.id, s); setShowActionDD(null); }}
                                  className="w-full px-4 py-2 text-left text-[11px] hover:bg-slate-50 text-slate-700">{s}</button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[9px] bg-slate-100 text-slate-500">{t.issueArea}</span></td>
                    <td className="px-4 py-3"><button className="p-1.5 hover:bg-slate-100 rounded"><MoreHorizontal size={16} className="text-slate-600" /></button></td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-[13px] text-slate-400">No tasks found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-white border-t border-slate-200 shrink-0">
            <span className="text-[11px] text-slate-400">{filteredTasks.length} task(s)</span>
          </div>
        </>
      )}

      {/* ═══ OUTREACH TRACKER TAB ═══ */}
      {activeTab === "outreach" && (
        <>
          <div className="px-6 py-3 bg-white border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <button onClick={() => { setShowOutreachTypeDD(!showOutreachTypeDD); setShowOutreachStatusDD(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 shadow-sm min-w-[160px]">
                  <span className="text-sm text-slate-900 truncate">{outreachTypeFilter === "all" ? "All Types" : outreachTypeFilter}</span>
                  <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
                </button>
                {showOutreachTypeDD && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowOutreachTypeDD(false)} />
                    <div className="absolute left-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                      {["all", ...OUTREACH_TYPES].map(t => (
                        <button key={t} onClick={() => { setOutreachTypeFilter(t); setShowOutreachTypeDD(false); }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700">{t === "all" ? "All Types" : t}</button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="relative">
                <button onClick={() => { setShowOutreachStatusDD(!showOutreachStatusDD); setShowOutreachTypeDD(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 shadow-sm min-w-[140px]">
                  <span className="text-sm text-slate-900 truncate">{outreachStatusFilter === "all" ? "All Statuses" : outreachStatusFilter}</span>
                  <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
                </button>
                {showOutreachStatusDD && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowOutreachStatusDD(false)} />
                    <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                      {["all", "Sent", "Delivered", "Published", "Pending", "No Response"].map(s => (
                        <button key={s} onClick={() => { setOutreachStatusFilter(s); setShowOutreachStatusDD(false); }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700">{s === "all" ? "All Statuses" : s}</button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  {["Type", "Date", "Recipient / Target", "Subject", "Status", "Outcome", "Assigned To"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOutreach.length > 0 ? filteredOutreach.map((o, idx) => (
                  <tr key={o.id} className={cn("hover:bg-slate-50 transition-colors", idx % 2 === 1 && "bg-slate-50/50")}>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">{o.type}</span></td>
                    <td className="px-4 py-3"><p className="text-[11px] text-slate-600">{new Date(o.date).toLocaleDateString()}</p></td>
                    <td className="px-4 py-3"><p className="text-[11px] text-slate-900 font-medium">{o.recipientOrTarget}</p></td>
                    <td className="px-4 py-3"><p className="text-[11px] text-slate-700">{o.subject}</p></td>
                    <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", OUTREACH_STATUS_COLORS[o.status])}>{o.status}</span></td>
                    <td className="px-4 py-3"><p className="text-[11px] text-slate-600">{o.outcome}</p></td>
                    <td className="px-4 py-3"><p className="text-[11px] text-slate-600">{o.assignedTo}</p></td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-[13px] text-slate-400">No outreach entries found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-white border-t border-slate-200 shrink-0">
            <span className="text-[11px] text-slate-400">{filteredOutreach.length} entry(ies)</span>
          </div>
        </>
      )}

      {/* ═══ ADD EVENT MODAL ═══ */}
      {showAddEvent && <AddEventModal onSave={e => { addAdvocacyEvent(e); setShowAddEvent(false); }} onClose={() => setShowAddEvent(false)} />}
      {showAddTask && <AddTaskModal onSave={t => { addAdvocacyTask(t); setShowAddTask(false); }} onClose={() => setShowAddTask(false)} />}
      {showAddOutreach && <AddOutreachModal onSave={o => { addOutreachEntry(o); setShowAddOutreach(false); }} onClose={() => setShowAddOutreach(false)} />}

      {/* Event Detail Modal */}
      {showEventDetail !== null && (() => {
        const ev = events.find(e => e.id === showEventDetail);
        if (!ev) return null;
        const evStakeholders = stakeholders.filter(s => ev.stakeholderIds.includes(s.id));
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-[16px] font-semibold text-slate-900">{ev.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-medium", EVENT_TYPE_BADGE[ev.type])}>{ev.type}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-medium", STATUS_COLORS[ev.status])}>{ev.status}</span>
                  </div>
                </div>
                <button onClick={() => setShowEventDetail(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
              </div>
              <div className="flex-1 overflow-auto p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  <div><span className="text-slate-400">Date</span><p className="text-slate-800 font-medium">{new Date(ev.date).toLocaleDateString()}</p></div>
                  <div><span className="text-slate-400">Time</span><p className="text-slate-800 font-medium">{ev.time}</p></div>
                  <div><span className="text-slate-400">Location</span><p className="text-slate-800 font-medium">{ev.location || "—"}</p></div>
                  <div><span className="text-slate-400">Issue Area</span><p className="text-slate-800 font-medium">{ev.issueArea}</p></div>
                </div>
                <div><p className="text-[10px] text-slate-400 mb-1">Description</p><p className="text-[11px] text-slate-700">{ev.description}</p></div>
                <div><p className="text-[10px] text-slate-400 mb-1">Assigned To</p><p className="text-[11px] text-slate-700">{ev.assignedTo.join(", ")}</p></div>
                {evStakeholders.length > 0 && (
                  <div>
                    <p className="text-[10px] text-slate-400 mb-1">Stakeholders</p>
                    <div className="space-y-1">
                      {evStakeholders.map(s => (
                        <div key={s.id} className="flex items-center gap-2 px-2 py-1 bg-slate-50 rounded">
                          <span className="text-[11px] text-slate-700 font-medium">{s.name}</span>
                          <span className="text-[9px] text-slate-400">{s.organization}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex gap-2">
                  {ev.status !== "Completed" && <button onClick={() => { updateEventStatus(ev.id, "Completed"); setShowEventDetail(null); }} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-medium">Mark Completed</button>}
                  {ev.status !== "Cancelled" && <button onClick={() => { updateEventStatus(ev.id, "Cancelled"); setShowEventDetail(null); }} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-[11px] font-medium">Cancel</button>}
                </div>
                <button onClick={() => setShowEventDetail(null)} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Close</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ═══ MODAL FORMS ═══ */
const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 placeholder:text-slate-400";
const labelCls = "block text-[11px] text-slate-500 font-medium mb-1.5";

function AddEventModal({ onSave, onClose }: { onSave: (e: Omit<AdvocacyEvent, "id">) => void; onClose: () => void }) {
  const stakeholders = getStakeholders();
  const [form, setForm] = useState({ title: "", type: "" as AdvocacyEvent["type"] | "", date: "", time: "", location: "", description: "", assignedTo: "", stakeholderIds: [] as number[], issueArea: "", status: "Scheduled" as AdvocacyEvent["status"] });
  const u = (f: string, v: any) => setForm(prev => ({ ...prev, [f]: v }));
  const canSave = form.title && form.type && form.date && form.issueArea;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h2 className="text-[16px] font-semibold text-slate-900">Add Event</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-4">
          <div><label className={labelCls}>Title <span className="text-red-500">*</span></label><input type="text" value={form.title} onChange={e => u("title", e.target.value)} placeholder="Event title" className={inputCls} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Type <span className="text-red-500">*</span></label>
              <select value={form.type} onChange={e => u("type", e.target.value)} className={inputCls}>
                <option value="">Select...</option>
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Issue Area <span className="text-red-500">*</span></label>
              <select value={form.issueArea} onChange={e => u("issueArea", e.target.value)} className={inputCls}>
                <option value="">Select...</option>
                {ISSUE_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Date <span className="text-red-500">*</span></label><input type="date" value={form.date} onChange={e => u("date", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Time</label><input type="time" value={form.time} onChange={e => u("time", e.target.value)} className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Location</label><input type="text" value={form.location} onChange={e => u("location", e.target.value)} placeholder="e.g. Accra, Ghana" className={inputCls} /></div>
          <div><label className={labelCls}>Assigned To</label><input type="text" value={form.assignedTo} onChange={e => u("assignedTo", e.target.value)} placeholder="Comma-separated names" className={inputCls} /></div>
          <div><label className={labelCls}>Description</label><textarea rows={3} value={form.description} onChange={e => u("description", e.target.value)} placeholder="Event description..." className={cn(inputCls, "resize-none")} /></div>
          <div>
            <label className={labelCls}>Stakeholders</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {stakeholders.map(s => (
                <button key={s.id} onClick={() => u("stakeholderIds", form.stakeholderIds.includes(s.id) ? form.stakeholderIds.filter(id => id !== s.id) : [...form.stakeholderIds, s.id])}
                  className={cn("px-2 py-1 rounded-lg border text-[10px] font-medium transition-colors",
                    form.stakeholderIds.includes(s.id) ? "border-[#0B01D0] bg-[#0B01D0]/5 text-[#0B01D0]" : "border-slate-200 text-slate-500")}>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={() => { if (canSave) onSave({ ...form, type: form.type as AdvocacyEvent["type"], assignedTo: form.assignedTo.split(",").map(s => s.trim()).filter(Boolean) }); }} disabled={!canSave}
            className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm">Save</button>
        </div>
      </div>
    </div>
  );
}

function AddTaskModal({ onSave, onClose }: { onSave: (t: Omit<AdvocacyTask, "id">) => void; onClose: () => void }) {
  const [form, setForm] = useState({ title: "", description: "", assignedTo: "", dueDate: "", priority: "Medium" as AdvocacyTask["priority"], status: "To Do" as AdvocacyTask["status"], issueArea: "" });
  const u = (f: string, v: any) => setForm(prev => ({ ...prev, [f]: v }));
  const canSave = form.title && form.assignedTo && form.dueDate && form.issueArea;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h2 className="text-[16px] font-semibold text-slate-900">Add Task</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-4">
          <div><label className={labelCls}>Title <span className="text-red-500">*</span></label><input type="text" value={form.title} onChange={e => u("title", e.target.value)} placeholder="Task title" className={inputCls} /></div>
          <div><label className={labelCls}>Description</label><textarea rows={2} value={form.description} onChange={e => u("description", e.target.value)} placeholder="Task description..." className={cn(inputCls, "resize-none")} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Assigned To <span className="text-red-500">*</span></label><input type="text" value={form.assignedTo} onChange={e => u("assignedTo", e.target.value)} placeholder="Name" className={inputCls} /></div>
            <div><label className={labelCls}>Due Date <span className="text-red-500">*</span></label><input type="date" value={form.dueDate} onChange={e => u("dueDate", e.target.value)} className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Priority</label>
              <select value={form.priority} onChange={e => u("priority", e.target.value)} className={inputCls}>
                {(["High", "Medium", "Low"] as const).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Issue Area <span className="text-red-500">*</span></label>
              <select value={form.issueArea} onChange={e => u("issueArea", e.target.value)} className={inputCls}>
                <option value="">Select...</option>
                {ISSUE_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={() => { if (canSave) onSave(form); }} disabled={!canSave}
            className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm">Save</button>
        </div>
      </div>
    </div>
  );
}

function AddOutreachModal({ onSave, onClose }: { onSave: (o: Omit<OutreachEntry, "id">) => void; onClose: () => void }) {
  const [form, setForm] = useState({ type: "" as OutreachEntry["type"] | "", date: "", recipientOrTarget: "", subject: "", status: "Pending" as OutreachEntry["status"], outcome: "", assignedTo: "" });
  const u = (f: string, v: any) => setForm(prev => ({ ...prev, [f]: v }));
  const canSave = form.type && form.date && form.recipientOrTarget && form.subject;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h2 className="text-[16px] font-semibold text-slate-900">Add Outreach Entry</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Type <span className="text-red-500">*</span></label>
              <select value={form.type} onChange={e => u("type", e.target.value)} className={inputCls}>
                <option value="">Select...</option>
                {OUTREACH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Date <span className="text-red-500">*</span></label><input type="date" value={form.date} onChange={e => u("date", e.target.value)} className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Recipient / Target <span className="text-red-500">*</span></label><input type="text" value={form.recipientOrTarget} onChange={e => u("recipientOrTarget", e.target.value)} placeholder="Who is the recipient?" className={inputCls} /></div>
          <div><label className={labelCls}>Subject <span className="text-red-500">*</span></label><input type="text" value={form.subject} onChange={e => u("subject", e.target.value)} placeholder="Subject/topic" className={inputCls} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Status</label>
              <select value={form.status} onChange={e => u("status", e.target.value)} className={inputCls}>
                {(["Pending", "Sent", "Delivered", "Published", "No Response"] as const).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Assigned To</label><input type="text" value={form.assignedTo} onChange={e => u("assignedTo", e.target.value)} placeholder="Name" className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Outcome</label><input type="text" value={form.outcome} onChange={e => u("outcome", e.target.value)} placeholder="Outcome or result" className={inputCls} /></div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={() => { if (canSave) onSave({ ...form, type: form.type as OutreachEntry["type"] }); }} disabled={!canSave}
            className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm">Save</button>
        </div>
      </div>
    </div>
  );
}
