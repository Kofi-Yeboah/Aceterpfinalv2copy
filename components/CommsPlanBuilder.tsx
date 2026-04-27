import { useState, useEffect } from "react";
import { Plus, ArrowLeft, X, AlertTriangle, MoreHorizontal, Link2 } from "lucide-react";
import { getLinkedCommsTasks, subscribeToLinkedTasks, type LinkedCommsTask } from "../lib/linkedTasksStore";

interface CommsActivity {
  id: string;
  activityName: string;
  audiences: string[];
  channels: string[];
  budgetLine: string;
  dueDate: string;
  description: string;
  status: "Planned" | "In Progress" | "Completed" | "Cancelled";
  linkedTaskId?: string;
}

interface CommsPlanBuilderProps {
  onBack: () => void;
  hideStatus?: boolean;
}

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
  "SMS",
  "Phone Call",
  "Video Conference",
  "Print Media"
];

const BUDGET_LINES = [
  { id: "", label: "No budget line assigned" },
  { id: "1.1.1", label: "1.1.1 - Staff Salaries", budget: 50000 },
  { id: "2.2.2", label: "2.2.2 - Launch Event Expenses - External Spend", budget: 15000 },
  { id: "3.1.1", label: "3.1.1 - Marketing & Communications", budget: 25000 },
  { id: "3.1.2", label: "3.1.2 - Social Media Campaigns", budget: 10000 },
  { id: "3.2.1", label: "3.2.1 - Print Materials", budget: 5000 },
  { id: "4.1.1", label: "4.1.1 - Stakeholder Events", budget: 8000 },
  { id: "5.1.1", label: "5.1.1 - Travel & Accommodation", budget: 12000 }
];

function convertLinkedTaskToActivity(task: LinkedCommsTask): CommsActivity {
  return {
    id: `linked-${task.taskId}`,
    activityName: task.taskName,
    audiences: task.audiences.length > 0 ? task.audiences : ["Internal Staff"],
    channels: task.channels.length > 0 ? task.channels : ["Email"],
    budgetLine: "",
    dueDate: task.dueDate,
    description: task.description || `Auto-populated from task: ${task.taskName} (${task.project})`,
    status: "Planned",
    linkedTaskId: task.taskId,
  };
}

export function CommsPlanBuilder({ onBack, hideStatus }: CommsPlanBuilderProps) {
  const [activities, setActivities] = useState<CommsActivity[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<CommsActivity | null>(null);
  const [showActionDropdown, setShowActionDropdown] = useState<string | null>(null);

  // Auto-populate from linked tasks
  useEffect(() => {
    const syncLinkedTasks = () => {
      const linkedTasks = getLinkedCommsTasks();
      const linkedActivities = linkedTasks.map(convertLinkedTaskToActivity);
      const linkedTaskIds = new Set(linkedActivities.map(a => a.linkedTaskId));

      setActivities(prev => {
        // Keep manual (non-linked) activities untouched
        const manualActivities = prev.filter(a => !a.linkedTaskId);
        // Keep linked activities that still exist in the store but update them
        const updatedLinked = linkedActivities.map(newLinked => {
          const existing = prev.find(a => a.linkedTaskId === newLinked.linkedTaskId);
          // Preserve user edits to status & budgetLine if the activity existed before
          if (existing) {
            return { ...newLinked, status: existing.status, budgetLine: existing.budgetLine };
          }
          return newLinked;
        });
        // Remove linked activities whose tasks were deleted from the store
        // (they won't appear in updatedLinked since they're gone from linkedActivities)
        return [...manualActivities, ...updatedLinked];
      });
    };

    syncLinkedTasks();
    const unsub = subscribeToLinkedTasks(syncLinkedTasks);
    return unsub;
  }, []);

  const addActivity = (activity: CommsActivity) => {
    setActivities([...activities, activity]);
    setShowAddForm(false);
  };

  const updateActivity = (updatedActivity: CommsActivity) => {
    setActivities(activities.map(a => a.id === updatedActivity.id ? updatedActivity : a));
    setShowEditForm(false);
    setSelectedActivity(null);
  };

  const removeActivity = (activityId: string) => {
    setActivities(activities.filter(a => a.id !== activityId));
    setShowActionDropdown(null);
  };

  const handleViewDetails = (activity: CommsActivity) => {
    setSelectedActivity(activity);
    setShowViewModal(true);
    setShowActionDropdown(null);
  };

  const handleEdit = (activity: CommsActivity) => {
    setSelectedActivity(activity);
    setShowEditForm(true);
    setShowActionDropdown(null);
  };

  const handleSave = () => {
    console.log("Saving Communications Plan:", activities);
    onBack();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planned": return "bg-blue-100 text-blue-700";
      case "In Progress": return "bg-yellow-100 text-yellow-700";
      case "Completed": return "bg-green-100 text-green-700";
      case "Cancelled": return "bg-slate-100 text-slate-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getBudgetForLine = (budgetLineId: string): number => {
    const line = BUDGET_LINES.find(bl => bl.id === budgetLineId);
    return line?.budget || 0;
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-2xl font-semibold text-slate-900">
              Communications Plan Builder
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors"
            >
              Save Communications Plan
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        <div className="space-y-4">
          {/* Add Activity Button */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600">
              {activities.length} {activities.length === 1 ? 'activity' : 'activities'} planned
              {activities.filter(a => a.linkedTaskId).length > 0 && (
                <span className="ml-2 text-violet-600">
                  ({activities.filter(a => a.linkedTaskId).length} from linked tasks)
                </span>
              )}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors"
            >
              <Plus className="size-5" />
              Add Activity
            </button>
          </div>

          {/* Activity Table */}
          {activities.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0B01D0]">
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">Activity Name</th>
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">Audiences</th>
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">Channels</th>
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">Budget Line</th>
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">Due Date</th>
                    {!hideStatus && <th className="px-4 py-3 text-left text-white text-[12px] font-medium">Status</th>}
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">Source</th>
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => {
                    const budgetAmount = getBudgetForLine(activity.budgetLine);
                    const showBudgetWarning = activity.budgetLine && budgetAmount === 0;

                    return (
                      <tr key={activity.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 text-[12px] text-slate-900 font-medium">
                          {activity.activityName}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {activity.audiences.map((aud) => (
                              <span key={aud} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded-full">
                                {aud}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {activity.channels.map((ch) => (
                              <span key={ch} className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] rounded-full">
                                {ch}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-600">
                          <div className="flex items-center gap-1">
                            {activity.budgetLine ? BUDGET_LINES.find(bl => bl.id === activity.budgetLine)?.label || activity.budgetLine : "—"}
                            {showBudgetWarning && (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-600">
                          {activity.dueDate || "—"}
                        </td>
                        {!hideStatus && (
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </span>
                          </td>
                        )}
                        <td className="px-4 py-3">
                          {activity.linkedTaskId ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-[10px] font-medium">
                              <Link2 className="w-3 h-3" />
                              Task
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">Manual</span>
                          )}
                        </td>
                        <td className="px-4 py-3 relative">
                          <button
                            onClick={() => setShowActionDropdown(showActionDropdown === activity.id ? null : activity.id)}
                            className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4 text-slate-600" />
                          </button>
                          {showActionDropdown === activity.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setShowActionDropdown(null)} />
                              <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                                <button
                                  onClick={() => handleViewDetails(activity)}
                                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleEdit(activity)}
                                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => removeActivity(activity.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                >
                                  Remove
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg py-16 text-center">
              <p className="text-slate-500 text-sm">No communication activities planned yet.</p>
              <p className="text-slate-400 text-[12px] mt-1">
                Click "Add Activity" to create one, or link tasks via Plan Connections in the WBS Builder.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Activity Form Modal */}
      {showAddForm && (
        <ActivityFormModal
          onSubmit={addActivity}
          onCancel={() => setShowAddForm(false)}
          title="Add Activity"
          hideStatus={hideStatus}
        />
      )}

      {/* Edit Activity Form Modal */}
      {showEditForm && selectedActivity && (
        <ActivityFormModal
          onSubmit={updateActivity}
          onCancel={() => { setShowEditForm(false); setSelectedActivity(null); }}
          title="Edit Activity"
          initialData={selectedActivity}
          hideStatus={hideStatus}
        />
      )}

      {/* View Activity Details Modal */}
      {showViewModal && selectedActivity && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Activity Details</h2>
                {selectedActivity.linkedTaskId && (
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-[10px] font-medium">
                    <Link2 className="w-3 h-3" />
                    Linked from Task
                  </span>
                )}
              </div>
              <button onClick={() => { setShowViewModal(false); setSelectedActivity(null); }} className="text-slate-500 hover:text-slate-700">
                <X className="size-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <p className="text-[12px] text-slate-500">Activity Name</p>
                <p className="text-[12px] text-slate-900 mt-0.5 font-medium">{selectedActivity.activityName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {!hideStatus && (
                  <div>
                    <p className="text-[12px] text-slate-500">Status</p>
                    <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(selectedActivity.status)}`}>
                      {selectedActivity.status}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-[12px] text-slate-500">Due Date</p>
                  <p className="text-[12px] text-slate-900 mt-0.5">{selectedActivity.dueDate || "—"}</p>
                </div>
              </div>
              <div>
                <p className="text-[12px] text-slate-500">Audiences</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedActivity.audiences.map((aud) => (
                    <span key={aud} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded-full">{aud}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[12px] text-slate-500">Channels</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedActivity.channels.map((ch) => (
                    <span key={ch} className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] rounded-full">{ch}</span>
                  ))}
                </div>
              </div>
              {selectedActivity.description && (
                <div>
                  <p className="text-[12px] text-slate-500">Description</p>
                  <p className="text-[12px] text-slate-900 mt-0.5">{selectedActivity.description}</p>
                </div>
              )}
              {selectedActivity.budgetLine && (
                <div>
                  <p className="text-[12px] text-slate-500">Budget Line</p>
                  <p className="text-[12px] text-slate-900 mt-0.5">
                    {BUDGET_LINES.find(bl => bl.id === selectedActivity.budgetLine)?.label || selectedActivity.budgetLine}
                  </p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => { setShowViewModal(false); setSelectedActivity(null); }}
                className="px-5 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Activity Form Modal ─────────────────────────────────────────────────────

function ActivityFormModal({
  onSubmit,
  onCancel,
  title,
  initialData,
  hideStatus,
}: {
  onSubmit: (activity: CommsActivity) => void;
  onCancel: () => void;
  title: string;
  initialData?: CommsActivity;
  hideStatus?: boolean;
}) {
  const [form, setForm] = useState({
    activityName: initialData?.activityName || "",
    audiences: initialData?.audiences || [] as string[],
    channels: initialData?.channels || [] as string[],
    budgetLine: initialData?.budgetLine || "",
    dueDate: initialData?.dueDate || "",
    description: initialData?.description || "",
    status: initialData?.status || "Planned" as CommsActivity["status"],
  });

  const toggleAudience = (aud: string) => {
    setForm(prev => ({
      ...prev,
      audiences: prev.audiences.includes(aud) ? prev.audiences.filter(a => a !== aud) : [...prev.audiences, aud],
    }));
  };

  const toggleChannel = (ch: string) => {
    setForm(prev => ({
      ...prev,
      channels: prev.channels.includes(ch) ? prev.channels.filter(c => c !== ch) : [...prev.channels, ch],
    }));
  };

  const handleSubmit = () => {
    if (!form.activityName) return;
    onSubmit({
      id: initialData?.id || `comms-${Date.now()}`,
      activityName: form.activityName,
      audiences: form.audiences,
      channels: form.channels,
      budgetLine: form.budgetLine,
      dueDate: form.dueDate,
      description: form.description,
      status: form.status,
      linkedTaskId: initialData?.linkedTaskId,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onCancel} className="p-1.5 hover:bg-slate-200 rounded transition-colors">
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Activity Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.activityName}
              onChange={(e) => setForm({ ...form, activityName: e.target.value })}
              placeholder="Enter activity name"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Target Audiences</label>
            <div className="flex flex-wrap gap-2">
              {AUDIENCE_OPTIONS.map((aud) => (
                <button
                  key={aud}
                  type="button"
                  onClick={() => toggleAudience(aud)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-colors ${
                    form.audiences.includes(aud)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                  }`}
                >
                  {aud}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Communication Channels</label>
            <div className="flex flex-wrap gap-2">
              {CHANNEL_OPTIONS.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => toggleChannel(ch)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-colors ${
                    form.channels.includes(ch)
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-green-300"
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Budget Line</label>
              <select
                value={form.budgetLine}
                onChange={(e) => setForm({ ...form, budgetLine: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {BUDGET_LINES.map((bl) => (
                  <option key={bl.id} value={bl.id}>{bl.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {!hideStatus && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as CommsActivity["status"] })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the communication activity..."
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm text-white bg-[#0B01D0] rounded-lg hover:bg-[#0a01b8] transition-colors"
          >
            {initialData ? "Update Activity" : "Add Activity"}
          </button>
        </div>
      </div>
    </div>
  );
}