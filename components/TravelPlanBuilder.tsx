import { useState, useEffect } from "react";
import { Plus, ArrowLeft, X, MoreHorizontal, Plane, MapPin, Calendar, Users, DollarSign, AlertTriangle, Link2 } from "lucide-react";
import { getLinkedTravelTasks, subscribeToLinkedTasks, type LinkedTravelTask } from "../lib/linkedTasksStore";

interface TravelItem {
  id: string;
  travelerName: string;
  designation: string;
  destination: string;
  departureLocation: string;
  purpose: string;
  departureDate: string;
  returnDate: string;
  transportType: string;
  accommodationType: string;
  numberOfNights: number;
  budgetLine: string;
  transportCost: number;
  accommodationCost: number;
  perDiem: number;
  otherCosts: number;
  totalCost: number;
  status: "Planned" | "Approved" | "Completed" | "Cancelled";
  notes: string;
  linkedTaskId?: string;
}

interface TravelPlanBuilderProps {
  onBack: () => void;
  hideStatus?: boolean;
}

const TRANSPORT_OPTIONS = [
  "Flight - Economy",
  "Flight - Business",
  "Train",
  "Bus",
  "Vehicle (Project)",
  "Vehicle (Rental)",
  "Personal Vehicle",
];

const ACCOMMODATION_OPTIONS = [
  "Hotel - Standard",
  "Hotel - Business",
  "Guest House",
  "Serviced Apartment",
  "Per Diem Only",
  "No Accommodation Needed",
];

const PURPOSE_OPTIONS = [
  "Field Visit",
  "Stakeholder Meeting",
  "Conference/Workshop",
  "Training",
  "Data Collection",
  "Monitoring & Evaluation",
  "Project Launch",
  "Partner Coordination",
  "Donor Meeting",
  "Other",
];

const STAFF_OPTIONS = [
  { name: "Yaw Osei", designation: "Project Manager" },
  { name: "Ama Darko", designation: "Research Lead" },
  { name: "Kofi Mensah", designation: "Data Analyst" },
  { name: "Kwaku Anane", designation: "Field Coordinator" },
  { name: "Nana Yaw", designation: "M&E Officer" },
  { name: "Abena Serwaa", designation: "Finance Officer" },
  { name: "Kwame Boateng", designation: "Communications Officer" },
];

const BUDGET_LINES = [
  { id: "", label: "No budget line assigned", budget: 0 },
  { id: "5.1.1", label: "5.1.1 - Travel & Accommodation", budget: 12000 },
  { id: "5.1.2", label: "5.1.2 - Domestic Travel", budget: 8000 },
  { id: "5.1.3", label: "5.1.3 - International Travel", budget: 15000 },
  { id: "5.2.1", label: "5.2.1 - Per Diem & Subsistence", budget: 6000 },
  { id: "5.2.2", label: "5.2.2 - Field Visit Expenses", budget: 5000 },
  { id: "4.1.1", label: "4.1.1 - Stakeholder Events", budget: 8000 },
  { id: "3.1.1", label: "3.1.1 - Marketing & Communications", budget: 25000 },
  { id: "6.1.1", label: "6.1.1 - Conference & Workshop Attendance", budget: 10000 },
  { id: "6.1.2", label: "6.1.2 - Training Travel", budget: 7000 },
];

function convertLinkedTaskToTravelItem(task: LinkedTravelTask): TravelItem {
  const staff = STAFF_OPTIONS.find(s => s.name === task.assignedTo);
  const depDate = task.departureDate || task.dueDate;
  const retDate = task.returnDate || task.dueDate;
  let nights = 0;
  if (depDate && retDate) {
    const d1 = new Date(depDate);
    const d2 = new Date(retDate);
    nights = Math.max(0, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
  }
  return {
    id: `linked-${task.taskId}`,
    travelerName: task.assignedTo,
    designation: staff?.designation || "",
    destination: task.destination || "TBD",
    departureLocation: task.departureLocation || "Accra",
    purpose: task.travelPurpose || "Other",
    departureDate: depDate,
    returnDate: retDate,
    transportType: task.transportType || "",
    accommodationType: task.accommodationType || "",
    numberOfNights: nights,
    budgetLine: "",
    transportCost: 0,
    accommodationCost: 0,
    perDiem: 0,
    otherCosts: 0,
    totalCost: task.estimatedCost || 0,
    status: "Planned",
    notes: task.notes || `Auto-populated from task: ${task.taskName} (${task.project})`,
    linkedTaskId: task.taskId,
  };
}

function TravelItemForm({
  onSubmit,
  onCancel,
  initialData,
  isEdit,
  hideStatus,
}: {
  onSubmit: (item: TravelItem) => void;
  onCancel: () => void;
  initialData?: TravelItem;
  isEdit?: boolean;
  hideStatus?: boolean;
}) {
  const [form, setForm] = useState<Omit<TravelItem, "id" | "totalCost">>({
    travelerName: initialData?.travelerName || "",
    designation: initialData?.designation || "",
    destination: initialData?.destination || "",
    departureLocation: initialData?.departureLocation || "Accra",
    purpose: initialData?.purpose || "",
    departureDate: initialData?.departureDate || "",
    returnDate: initialData?.returnDate || "",
    transportType: initialData?.transportType || "",
    accommodationType: initialData?.accommodationType || "",
    numberOfNights: initialData?.numberOfNights || 0,
    budgetLine: initialData?.budgetLine || "",
    transportCost: initialData?.transportCost || 0,
    accommodationCost: initialData?.accommodationCost || 0,
    perDiem: initialData?.perDiem || 0,
    otherCosts: initialData?.otherCosts || 0,
    status: initialData?.status || "Planned",
    notes: initialData?.notes || "",
  });

  const totalCost =
    form.transportCost + form.accommodationCost + form.perDiem + form.otherCosts;

  const handleTravelerChange = (name: string) => {
    const staff = STAFF_OPTIONS.find((s) => s.name === name);
    setForm({
      ...form,
      travelerName: name,
      designation: staff?.designation || form.designation,
    });
  };

  const handleSubmit = () => {
    if (
      !form.travelerName ||
      !form.destination ||
      !form.purpose ||
      !form.departureDate ||
      !form.returnDate
    )
      return;

    onSubmit({
      id: initialData?.id || `TR${String(Date.now()).slice(-3)}`,
      ...form,
      totalCost,
      linkedTaskId: initialData?.linkedTaskId,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEdit ? "Edit Travel Item" : "Add Travel Item"}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Traveler */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Traveler <span className="text-red-500">*</span>
              </label>
              <select
                value={form.travelerName}
                onChange={(e) => handleTravelerChange(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select traveler</option>
                {STAFF_OPTIONS.map((staff) => (
                  <option key={staff.name} value={staff.name}>
                    {staff.name} — {staff.designation}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Designation
              </label>
              <input
                type="text"
                value={form.designation}
                readOnly
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-500 bg-slate-50"
              />
            </div>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Departure Location
              </label>
              <input
                type="text"
                value={form.departureLocation}
                onChange={(e) =>
                  setForm({ ...form, departureLocation: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Destination <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.destination}
                onChange={(e) =>
                  setForm({ ...form, destination: e.target.value })
                }
                placeholder="e.g. Tamale, Northern Region"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Purpose <span className="text-red-500">*</span>
            </label>
            <select
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select purpose</option>
              {PURPOSE_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Departure Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.departureDate}
                onChange={(e) =>
                  setForm({ ...form, departureDate: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Return Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.returnDate}
                onChange={(e) =>
                  setForm({ ...form, returnDate: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Nights
              </label>
              <input
                type="number"
                value={form.numberOfNights}
                onChange={(e) =>
                  setForm({
                    ...form,
                    numberOfNights: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Transport & Accommodation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Transport Type
              </label>
              <select
                value={form.transportType}
                onChange={(e) =>
                  setForm({ ...form, transportType: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select transport</option>
                {TRANSPORT_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Accommodation Type
              </label>
              <select
                value={form.accommodationType}
                onChange={(e) =>
                  setForm({ ...form, accommodationType: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select accommodation</option>
                {ACCOMMODATION_OPTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget Line */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Budget Line
            </label>
            <select
              value={form.budgetLine}
              onChange={(e) =>
                setForm({ ...form, budgetLine: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {BUDGET_LINES.map((bl) => (
                <option key={bl.id} value={bl.id}>
                  {bl.label}
                </option>
              ))}
            </select>
          </div>

          {/* Costs */}
          <div className="border-t border-slate-200 pt-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Cost Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Transport Cost ($)
                </label>
                <input
                  type="number"
                  value={form.transportCost}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      transportCost: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Accommodation Cost ($)
                </label>
                <input
                  type="number"
                  value={form.accommodationCost}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      accommodationCost: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Per Diem ($)
                </label>
                <input
                  type="number"
                  value={form.perDiem}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      perDiem: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Other Costs ($)
                </label>
                <input
                  type="number"
                  value={form.otherCosts}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      otherCosts: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Total */}
            <div className="mt-4 bg-blue-50 rounded-lg p-4 flex justify-between items-center">
              <span className="text-xs text-blue-600">Total Estimated Cost</span>
              <span className="text-lg font-semibold text-blue-900">
                ${totalCost.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Status */}
          {!hideStatus && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as TravelItem["status"],
                  })
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Planned">Planned</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Notes / Justification
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Provide justification for travel..."
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
            {isEdit ? "Update" : "Add Travel Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TravelViewModal({
  item,
  onClose,
  hideStatus,
}: {
  item: TravelItem;
  onClose: () => void;
  hideStatus?: boolean;
}) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Travel Details
            </h2>
            {item.linkedTaskId && (
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full text-[10px] font-medium">
                <Link2 className="w-3 h-3" />
                Linked from Task
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-slate-500">Traveler</p>
              <p className="text-[12px] text-slate-900 mt-0.5">
                {item.travelerName}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-slate-500">Designation</p>
              <p className="text-[12px] text-slate-900 mt-0.5">
                {item.designation}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-slate-500">From</p>
              <p className="text-[12px] text-slate-900 mt-0.5">
                {item.departureLocation}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-slate-500">Destination</p>
              <p className="text-[12px] text-slate-900 mt-0.5">
                {item.destination}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[12px] text-slate-500">Purpose</p>
              <p className="text-[12px] text-slate-900 mt-0.5">
                {item.purpose}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-slate-500">Dates</p>
              <p className="text-[12px] text-slate-900 mt-0.5">
                {formatDate(item.departureDate)} — {formatDate(item.returnDate)}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-slate-500">Nights</p>
              <p className="text-[12px] text-slate-900 mt-0.5">
                {item.numberOfNights}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-slate-500">Transport</p>
              <p className="text-[12px] text-slate-900 mt-0.5">
                {item.transportType || "—"}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-slate-500">Accommodation</p>
              <p className="text-[12px] text-slate-900 mt-0.5">
                {item.accommodationType || "—"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {!hideStatus && (
              <div>
                <p className="text-[12px] text-slate-500">Status</p>
                <span
                  className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    item.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : item.status === "Completed"
                      ? "bg-slate-100 text-slate-700"
                      : item.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            )}
            <div>
              <p className="text-[12px] text-slate-500">Budget Line</p>
              <p className="text-[12px] text-slate-900 mt-0.5">
                {item.budgetLine
                  ? BUDGET_LINES.find((b) => b.id === item.budgetLine)?.label ||
                    item.budgetLine
                  : "—"}
              </p>
            </div>
          </div>
          {item.budgetLine &&
            (() => {
              const bl = BUDGET_LINES.find((b) => b.id === item.budgetLine);
              if (!bl) return null;
              return (
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Allocated: ${bl.budget.toLocaleString()}
                </p>
              );
            })()}
          <div className="border-t border-slate-200 pt-3">
            <p className="text-sm font-medium text-slate-900 mb-2">
              Cost Breakdown
            </p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[12px]">
                <span className="text-slate-600">Transport</span>
                <span className="text-slate-900">
                  ${item.transportCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-slate-600">Accommodation</span>
                <span className="text-slate-900">
                  ${item.accommodationCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-slate-600">Per Diem</span>
                <span className="text-slate-900">
                  ${item.perDiem.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-slate-600">Other Costs</span>
                <span className="text-slate-900">
                  ${item.otherCosts.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[12px] pt-2 border-t border-slate-200 font-semibold">
                <span className="text-slate-900">Total Cost</span>
                <span className="text-slate-900">
                  ${item.totalCost.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          {item.notes && (
            <div>
              <p className="text-[12px] text-slate-500">
                Notes / Justification
              </p>
              <p className="text-[12px] text-slate-900 mt-0.5">{item.notes}</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function TravelPlanBuilder({ onBack, hideStatus }: TravelPlanBuilderProps) {
  const [travelItems, setTravelItems] =
    useState<TravelItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TravelItem | null>(null);
  const [showActionDropdown, setShowActionDropdown] = useState<string | null>(
    null
  );

  // Auto-populate from linked tasks
  useEffect(() => {
    const syncLinkedTasks = () => {
      const linkedTasks = getLinkedTravelTasks();
      const linkedItems = linkedTasks.map(convertLinkedTaskToTravelItem);

      setTravelItems(prev => {
        // Keep manual (non-linked) items untouched
        const manualItems = prev.filter(i => !i.linkedTaskId);
        // Update existing linked items and add new ones; remove deleted ones
        const updatedLinked = linkedItems.map(newLinked => {
          const existing = prev.find(i => i.linkedTaskId === newLinked.linkedTaskId);
          // Preserve user-edited fields (status, budgetLine, costs) if they were changed
          if (existing) {
            return {
              ...newLinked,
              status: existing.status,
              budgetLine: existing.budgetLine,
              transportCost: existing.transportCost,
              accommodationCost: existing.accommodationCost,
              perDiem: existing.perDiem,
              otherCosts: existing.otherCosts,
              totalCost: existing.transportCost + existing.accommodationCost + existing.perDiem + existing.otherCosts,
            };
          }
          return newLinked;
        });
        return [...manualItems, ...updatedLinked];
      });
    };

    syncLinkedTasks();
    const unsub = subscribeToLinkedTasks(syncLinkedTasks);
    return unsub;
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalEstimatedCost = travelItems.reduce(
    (sum, item) => sum + item.totalCost,
    0
  );
  const totalTrips = travelItems.length;
  const avgCostPerTrip = totalTrips > 0 ? totalEstimatedCost / totalTrips : 0;
  const totalTravelDays = travelItems.reduce(
    (sum, item) => sum + item.numberOfNights,
    0
  );

  // Budget utilization calculation
  const budgetUtilization = (() => {
    const lineMap = new Map<string, { allocated: number; spent: number }>();
    travelItems.forEach((item) => {
      if (item.budgetLine) {
        const bl = BUDGET_LINES.find((b) => b.id === item.budgetLine);
        if (bl) {
          const existing = lineMap.get(item.budgetLine) || {
            allocated: bl.budget,
            spent: 0,
          };
          existing.spent += item.totalCost;
          lineMap.set(item.budgetLine, existing);
        }
      }
    });
    const totalAllocated = Array.from(lineMap.values()).reduce(
      (sum, v) => sum + v.allocated,
      0
    );
    const totalSpent = Array.from(lineMap.values()).reduce(
      (sum, v) => sum + v.spent,
      0
    );
    const unassignedCount = travelItems.filter((i) => !i.budgetLine).length;
    const utilizationPct =
      totalAllocated > 0
        ? Math.round((totalSpent / totalAllocated) * 100)
        : 0;
    return {
      totalAllocated,
      totalSpent,
      unassignedCount,
      utilizationPct,
      lineCount: lineMap.size,
    };
  })();

  const addTravelItem = (item: TravelItem) => {
    setTravelItems([...travelItems, item]);
    setShowAddForm(false);
  };

  const updateTravelItem = (updatedItem: TravelItem) => {
    setTravelItems(
      travelItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    setShowEditForm(false);
    setSelectedItem(null);
  };

  const removeTravelItem = (itemId: string) => {
    setTravelItems(travelItems.filter((item) => item.id !== itemId));
    setShowActionDropdown(null);
  };

  const handleViewDetails = (item: TravelItem) => {
    setSelectedItem(item);
    setShowViewModal(true);
    setShowActionDropdown(null);
  };

  const handleEdit = (item: TravelItem) => {
    setSelectedItem(item);
    setShowEditForm(true);
    setShowActionDropdown(null);
  };

  const handleSave = () => {
    console.log("Saving Travel Plan:", travelItems);
    onBack();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planned":
        return "bg-blue-100 text-blue-700";
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Completed":
        return "bg-slate-100 text-slate-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Travel Plan Builder
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Plan and manage project-related travel activities
              </p>
            </div>
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
              Save Travel Plan
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Plane className="w-4 h-4 text-blue-600" />
              <p className="text-[12px] text-blue-600 font-medium">
                Total Trips
              </p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">
              {totalTrips}
            </p>
            {travelItems.filter(i => i.linkedTaskId).length > 0 && (
              <p className="text-[10px] text-sky-600 mt-0.5">
                {travelItems.filter(i => i.linkedTaskId).length} from linked tasks
              </p>
            )}
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <p className="text-[12px] text-emerald-600 font-medium">
                Total Cost
              </p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">
              {formatCurrency(totalEstimatedCost)}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-violet-600" />
              <p className="text-[12px] text-violet-600 font-medium">
                Travel Days
              </p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">
              {totalTravelDays}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-amber-600" />
              <p className="text-[12px] text-amber-600 font-medium">
                Avg Cost/Trip
              </p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">
              {formatCurrency(avgCostPerTrip)}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-red-600" />
              <p className="text-[12px] text-red-600 font-medium">
                Budget Util.
              </p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">
              {budgetUtilization.utilizationPct}%
            </p>
            {budgetUtilization.unassignedCount > 0 && (
              <p className="text-[10px] text-amber-600 flex items-center gap-1 mt-0.5">
                <AlertTriangle className="w-3 h-3" />
                {budgetUtilization.unassignedCount} unassigned
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-slate-600">
              {travelItems.length}{" "}
              {travelItems.length === 1 ? "trip" : "trips"} planned
              {travelItems.filter(i => i.linkedTaskId).length > 0 && (
                <span className="ml-2 text-sky-600">
                  ({travelItems.filter(i => i.linkedTaskId).length} from linked tasks)
                </span>
              )}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors"
            >
              <Plus className="size-5" />
              Add Travel Item
            </button>
          </div>

          {/* Travel Table */}
          {travelItems.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0B01D0]">
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">
                      Traveler
                    </th>
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">
                      Route
                    </th>
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">
                      Purpose
                    </th>
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">
                      Dates
                    </th>
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">
                      Transport
                    </th>
                    <th className="px-4 py-3 text-right text-white text-[12px] font-medium">
                      Total Cost
                    </th>
                    {!hideStatus && (
                      <th className="px-4 py-3 text-left text-white text-[12px] font-medium">
                        Status
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">
                      Source
                    </th>
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {travelItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        <p className="text-[12px] font-medium text-slate-900">
                          {item.travelerName}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {item.designation}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[12px] text-slate-900">
                          {item.departureLocation} → {item.destination}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-slate-600">
                        {item.purpose}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[12px] text-slate-600">
                          {formatDate(item.departureDate)}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {item.numberOfNights} nights
                        </p>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-slate-600">
                        {item.transportType || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-[12px] font-semibold text-slate-900">
                          {formatCurrency(item.totalCost)}
                        </p>
                      </td>
                      {!hideStatus && (
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-3">
                        {item.linkedTaskId ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full text-[10px] font-medium">
                            <Link2 className="w-3 h-3" />
                            Task
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Manual</span>
                        )}
                      </td>
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={() =>
                            setShowActionDropdown(
                              showActionDropdown === item.id ? null : item.id
                            )
                          }
                          className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4 text-slate-600" />
                        </button>
                        {showActionDropdown === item.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setShowActionDropdown(null)}
                            />
                            <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                              <button
                                onClick={() => handleViewDetails(item)}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => handleEdit(item)}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeTravelItem(item.id)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                              >
                                Remove
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
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg py-16 text-center">
              <Plane className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">
                No travel items planned yet.
              </p>
              <p className="text-slate-400 text-[12px] mt-1">
                Click "Add Travel Item" to create one, or link tasks via Plan Connections in the WBS Builder.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <TravelItemForm
          onSubmit={addTravelItem}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Form */}
      {showEditForm && selectedItem && (
        <TravelItemForm
          onSubmit={updateTravelItem}
          onCancel={() => {
            setShowEditForm(false);
            setSelectedItem(null);
          }}
          initialData={selectedItem}
          isEdit
        />
      )}

      {/* View Modal */}
      {showViewModal && selectedItem && (
        <TravelViewModal
          item={selectedItem}
          onClose={() => {
            setShowViewModal(false);
            setSelectedItem(null);
          }}
          hideStatus={hideStatus}
        />
      )}
    </div>
  );
}