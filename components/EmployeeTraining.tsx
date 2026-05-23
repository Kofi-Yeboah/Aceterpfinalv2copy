import { useState } from "react";
import { Search, Download, ChevronDown, Plus, Calendar, X, ArrowLeft, Users, CheckCircle2, XCircle, Clock } from "lucide-react";

interface EnrolledEmployee {
  name: string;
  department: string;
  attended: boolean;
}

interface Training {
  id: number;
  trainingTitle: string;
  category: string;
  trainingType: "Internal" | "External" | "Personal Development";
  startDate: string;
  endDate: string;
  status: "Completed" | "In Progress" | "Scheduled" | "Cancelled";
  instructor: string;
  expectedAttendees: number;
  actualAttendees: number;
  enrolledEmployees: EnrolledEmployee[];
}

const trainingData: Training[] = [
  {
    id: 1,
    trainingTitle: "Project Management Fundamentals",
    category: "Management",
    trainingType: "Internal",
    startDate: "Jan 15, 2024",
    endDate: "Feb 15, 2024",
    status: "Completed",
    instructor: "John Smith",
    expectedAttendees: 15,
    actualAttendees: 15,
    enrolledEmployees: [
      { name: "David Bannerman", department: "Project Management", attended: true },
      { name: "Joyce Blessing", department: "HR Management", attended: true },
      { name: "Yaw Osei", department: "Finance", attended: true },
      { name: "Kofi Mensah", department: "Finance", attended: true },
      { name: "Ama Darko", department: "Procurement", attended: true },
      { name: "Kwesi Appiah", department: "IT", attended: true },
      { name: "Nana Yaw", department: "Project Management", attended: true },
      { name: "Abena Owusu", department: "HR Management", attended: true },
      { name: "Kwame Asante", department: "M&E", attended: true },
      { name: "Adwoa Mensah", department: "Finance", attended: true },
      { name: "Kojo Williams", department: "Procurement", attended: true },
      { name: "Akosua Agyei", department: "IT", attended: true },
      { name: "Yaa Frimpong", department: "Communications", attended: true },
      { name: "Kwabena Boateng", department: "M&E", attended: true },
      { name: "Afua Sarpong", department: "Finance", attended: true },
    ],
  },
  {
    id: 2,
    trainingTitle: "Advanced Excel for Data Analysis",
    category: "Technical",
    trainingType: "External",
    startDate: "Feb 01, 2024",
    endDate: "Feb 28, 2024",
    status: "In Progress",
    instructor: "Mary Johnson",
    expectedAttendees: 12,
    actualAttendees: 8,
    enrolledEmployees: [
      { name: "Joyce Blessing", department: "HR Management", attended: true },
      { name: "Kofi Mensah", department: "Finance", attended: true },
      { name: "Kwesi Appiah", department: "IT", attended: true },
      { name: "Yaw Osei", department: "Finance", attended: true },
      { name: "Akosua Agyei", department: "IT", attended: true },
      { name: "Kojo Williams", department: "Procurement", attended: true },
      { name: "Adwoa Mensah", department: "Finance", attended: true },
      { name: "Kwame Asante", department: "M&E", attended: true },
      { name: "Afua Sarpong", department: "Finance", attended: false },
      { name: "Kwabena Boateng", department: "M&E", attended: false },
      { name: "David Bannerman", department: "Project Management", attended: false },
      { name: "Ama Darko", department: "Procurement", attended: false },
    ],
  },
  {
    id: 3,
    trainingTitle: "Leadership Development Program",
    category: "Leadership",
    trainingType: "External",
    startDate: "Mar 01, 2024",
    endDate: "Apr 30, 2024",
    status: "Scheduled",
    instructor: "Robert Williams",
    expectedAttendees: 8,
    actualAttendees: 0,
    enrolledEmployees: [
      { name: "Yaw Osei", department: "Finance", attended: false },
      { name: "David Bannerman", department: "Project Management", attended: false },
      { name: "Ama Darko", department: "Procurement", attended: false },
      { name: "Kwesi Appiah", department: "IT", attended: false },
      { name: "Nana Yaw", department: "Project Management", attended: false },
      { name: "Kwame Asante", department: "M&E", attended: false },
      { name: "Yaa Frimpong", department: "Communications", attended: false },
      { name: "Kwabena Boateng", department: "M&E", attended: false },
    ],
  },
  {
    id: 4,
    trainingTitle: "Financial Management Basics",
    category: "Finance",
    trainingType: "Internal",
    startDate: "Feb 10, 2024",
    endDate: "Mar 10, 2024",
    status: "In Progress",
    instructor: "Sarah Brown",
    expectedAttendees: 10,
    actualAttendees: 4,
    enrolledEmployees: [
      { name: "Kofi Mensah", department: "Finance", attended: true },
      { name: "Ama Darko", department: "Procurement", attended: true },
      { name: "Adwoa Mensah", department: "Finance", attended: true },
      { name: "Akosua Agyei", department: "IT", attended: true },
      { name: "Afua Sarpong", department: "Finance", attended: false },
      { name: "David Bannerman", department: "Project Management", attended: false },
      { name: "Joyce Blessing", department: "HR Management", attended: false },
      { name: "Kwabena Boateng", department: "M&E", attended: false },
      { name: "Yaa Frimpong", department: "Communications", attended: false },
      { name: "Kojo Williams", department: "Procurement", attended: false },
    ],
  },
  {
    id: 5,
    trainingTitle: "HR Compliance and Regulations",
    category: "HR",
    trainingType: "Internal",
    startDate: "Jan 20, 2024",
    endDate: "Feb 20, 2024",
    status: "Completed",
    instructor: "Michael Davis",
    expectedAttendees: 6,
    actualAttendees: 6,
    enrolledEmployees: [
      { name: "Ama Darko", department: "Procurement", attended: true },
      { name: "Abena Owusu", department: "HR Management", attended: true },
      { name: "Adwoa Mensah", department: "Finance", attended: true },
      { name: "Akosua Agyei", department: "IT", attended: true },
      { name: "Afua Sarpong", department: "Finance", attended: true },
      { name: "Yaa Frimpong", department: "Communications", attended: true },
    ],
  },
  {
    id: 6,
    trainingTitle: "Digital Marketing Strategies",
    category: "Marketing",
    trainingType: "External",
    startDate: "Feb 05, 2024",
    endDate: "Mar 05, 2024",
    status: "In Progress",
    instructor: "Emily Wilson",
    expectedAttendees: 9,
    actualAttendees: 7,
    enrolledEmployees: [
      { name: "Kwesi Appiah", department: "IT", attended: true },
      { name: "Joyce Blessing", department: "HR Management", attended: true },
      { name: "Nana Yaw", department: "Project Management", attended: true },
      { name: "Kwame Asante", department: "M&E", attended: true },
      { name: "Kojo Williams", department: "Procurement", attended: true },
      { name: "Yaw Osei", department: "Finance", attended: true },
      { name: "David Bannerman", department: "Project Management", attended: true },
      { name: "Kwabena Boateng", department: "M&E", attended: false },
      { name: "Ama Darko", department: "Procurement", attended: false },
    ],
  },
  {
    id: 7,
    trainingTitle: "Cybersecurity Awareness",
    category: "IT",
    trainingType: "External",
    startDate: "Mar 15, 2024",
    endDate: "Apr 15, 2024",
    status: "Scheduled",
    instructor: "David Lee",
    expectedAttendees: 20,
    actualAttendees: 0,
    enrolledEmployees: [
      { name: "Nana Yaw", department: "Project Management", attended: false },
      { name: "Kojo Williams", department: "Procurement", attended: false },
      { name: "Kwame Asante", department: "M&E", attended: false },
      { name: "David Bannerman", department: "Project Management", attended: false },
      { name: "Joyce Blessing", department: "HR Management", attended: false },
      { name: "Yaw Osei", department: "Finance", attended: false },
      { name: "Kofi Mensah", department: "Finance", attended: false },
      { name: "Ama Darko", department: "Procurement", attended: false },
      { name: "Kwesi Appiah", department: "IT", attended: false },
      { name: "Abena Owusu", department: "HR Management", attended: false },
      { name: "Adwoa Mensah", department: "Finance", attended: false },
      { name: "Akosua Agyei", department: "IT", attended: false },
      { name: "Afua Sarpong", department: "Finance", attended: false },
      { name: "Yaa Frimpong", department: "Communications", attended: false },
      { name: "Kwabena Boateng", department: "M&E", attended: false },
      { name: "James Owusu", department: "Finance", attended: false },
      { name: "Esi Barimah", department: "HR Management", attended: false },
      { name: "Kweku Adu", department: "IT", attended: false },
      { name: "Maame Serwaa", department: "Procurement", attended: false },
      { name: "Fiifi Ansah", department: "Communications", attended: false },
    ],
  },
  {
    id: 8,
    trainingTitle: "Communication Skills Workshop",
    category: "Soft Skills",
    trainingType: "Personal Development",
    startDate: "Jan 25, 2024",
    endDate: "Feb 10, 2024",
    status: "Cancelled",
    instructor: "Lisa Anderson",
    expectedAttendees: 12,
    actualAttendees: 0,
    enrolledEmployees: [
      { name: "Abena Owusu", department: "HR Management", attended: false },
      { name: "Joyce Blessing", department: "HR Management", attended: false },
      { name: "Yaw Osei", department: "Finance", attended: false },
      { name: "Ama Darko", department: "Procurement", attended: false },
      { name: "Kwesi Appiah", department: "IT", attended: false },
      { name: "Nana Yaw", department: "Project Management", attended: false },
      { name: "David Bannerman", department: "Project Management", attended: false },
      { name: "Kofi Mensah", department: "Finance", attended: false },
      { name: "Kwame Asante", department: "M&E", attended: false },
      { name: "Adwoa Mensah", department: "Finance", attended: false },
      { name: "Akosua Agyei", department: "IT", attended: false },
      { name: "Yaa Frimpong", department: "Communications", attended: false },
    ],
  },
];

const allCategories = ["All Categories", "Management", "Technical", "Leadership", "Finance", "HR", "Marketing", "IT", "Soft Skills"];
const allStatuses = ["All Statuses", "Completed", "In Progress", "Scheduled", "Cancelled"];
const allTrainingTypes = ["All Types", "Internal", "External", "Personal Development"];

function getStatusColor(status: Training["status"]) {
  switch (status) {
    case "Completed": return "bg-green-50 text-green-600";
    case "In Progress": return "bg-blue-50 text-blue-600";
    case "Scheduled": return "bg-yellow-50 text-yellow-600";
    case "Cancelled": return "bg-red-50 text-red-600";
    default: return "bg-slate-50 text-slate-600";
  }
}

function getTypeStyle(type: Training["trainingType"]) {
  switch (type) {
    case "Internal": return "bg-blue-50 text-blue-700";
    case "External": return "bg-purple-50 text-purple-700";
    case "Personal Development": return "bg-teal-50 text-teal-700";
  }
}

// ─── Detail View ────────────────────────────────────────────────────────────────
function TrainingDetailView({ training, onBack }: { training: Training; onBack: () => void }) {
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="w-px h-5 bg-slate-200" />
        <h1 className="text-xl font-semibold text-slate-900 truncate">{training.trainingTitle}</h1>
        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(training.status)}`}>
          {training.status}
        </span>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Training Info */}
        <div className="px-6 py-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">
            <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Training Details</p>
            <div className="grid grid-cols-4 gap-x-6 gap-y-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Training Title</p>
                <p className="text-[13px] text-slate-900">{training.trainingTitle}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Category</p>
                <p className="text-[13px] text-slate-900">{training.category}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Instructor</p>
                <p className="text-[13px] text-slate-900">{training.instructor}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Status</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(training.status)}`}>
                  {training.status}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Start Date</p>
                <p className="text-[13px] text-slate-900">{training.startDate}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">End Date</p>
                <p className="text-[13px] text-slate-900">{training.endDate}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Expected Attendees</p>
                <p className="text-[13px] text-slate-900">{training.expectedAttendees}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Actual Attendees</p>
                <p className="text-[13px] text-slate-900">{training.actualAttendees}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Training Type</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getTypeStyle(training.trainingType)}`}>
                  {training.trainingType}
                </span>
              </div>
            </div>
          </div>

          {/* Attendance summary cards */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Users size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Expected Attendees</p>
                <p className="text-[22px] text-slate-900">{training.expectedAttendees}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Actual Attendees</p>
                <p className="text-[22px] text-green-600">{training.actualAttendees}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <Clock size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Not Attended</p>
                <p className="text-[22px] text-amber-600">{training.expectedAttendees - training.actualAttendees}</p>
              </div>
            </div>
          </div>

          {/* Enrolled Employees Table — General Ledger pattern */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100">
              <p className="text-[13px] font-semibold text-slate-900">Enrolled Employees</p>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">#</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Employee Name</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Department</th>
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {training.enrolledEmployees.map((emp, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-slate-100 hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-slate-500">{idx + 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] font-medium text-slate-900">{emp.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-slate-500">{emp.department}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {emp.attended ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xl text-[12px] bg-green-50 text-green-600">
                          <CheckCircle2 size={11} />
                          Attended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xl text-[12px] bg-amber-50 text-amber-600">
                          <XCircle size={11} />
                          Not Attended
                        </span>
                      )}
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

// ─── Add Training Modal ──────────────────────────────────────────────────────
function AddTrainingModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    trainingTitle: "",
    category: "",
    trainingType: "",
    instructor: "",
    startDate: "",
    endDate: "",
    expectedAttendees: "",
  });

  const isValid = form.trainingTitle.trim() && form.category && form.trainingType && form.instructor.trim() && form.startDate && form.endDate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Add Training</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-700">Training Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.trainingTitle}
                onChange={(e) => setForm({ ...form, trainingTitle: e.target.value })}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. Advanced Data Analysis"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-700">Category <span className="text-red-500">*</span></label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Category</option>
                  {allCategories.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-700">Training Type <span className="text-red-500">*</span></label>
                <select
                  value={form.trainingType}
                  onChange={(e) => setForm({ ...form, trainingType: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Type</option>
                  {allTrainingTypes.slice(1).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-700">Instructor <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.instructor}
                  onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. Jane Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-700">Start Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-700">End Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-700">Expected Attendees</label>
              <input
                type="number"
                min="1"
                value={form.expectedAttendees}
                onChange={(e) => setForm({ ...form, expectedAttendees: e.target.value })}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. 20"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            disabled={!isValid}
            className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Training
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function EmployeeTraining() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedType, setSelectedType] = useState("All Types");
  const [showCategoryDrop, setShowCategoryDrop] = useState(false);
  const [showStatusDrop, setShowStatusDrop] = useState(false);
  const [showTypeDrop, setShowTypeDrop] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (selectedTraining) {
    return <TrainingDetailView training={selectedTraining} onBack={() => setSelectedTraining(null)} />;
  }

  const filtered = trainingData.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      t.trainingTitle.toLowerCase().includes(q) ||
      t.instructor.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q);
    const matchCat = selectedCategory === "All Categories" || t.category === selectedCategory;
    const matchStatus = selectedStatus === "All Statuses" || t.status === selectedStatus;
    const matchType = selectedType === "All Types" || t.trainingType === selectedType;
    return matchSearch && matchCat && matchStatus && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Training & Development</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            <Download size={16} className="text-purple-700" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Add Training
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between gap-3">
          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-64">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search trainings..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}><X size={14} className="text-slate-400" /></button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <Calendar size={16} className="text-purple-700" />
              <span className="text-sm text-slate-900">All Dates</span>
              <ChevronDown size={14} className="text-purple-700" />
            </button>

            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowCategoryDrop(!showCategoryDrop); setShowStatusDrop(false); setShowTypeDrop(false); }}
                className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedCategory}</span>
                <ChevronDown size={14} className="text-purple-700" />
              </button>
              {showCategoryDrop && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowCategoryDrop(false)} />
                  <div className="absolute top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                    {allCategories.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setSelectedCategory(c); setShowCategoryDrop(false); setCurrentPage(1); }}
                        className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowStatusDrop(!showStatusDrop); setShowCategoryDrop(false); setShowTypeDrop(false); }}
                className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedStatus}</span>
                <ChevronDown size={14} className="text-purple-700" />
              </button>
              {showStatusDrop && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDrop(false)} />
                  <div className="absolute top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                    {allStatuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSelectedStatus(s); setShowStatusDrop(false); setCurrentPage(1); }}
                        className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Training Type Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowTypeDrop(!showTypeDrop); setShowStatusDrop(false); setShowCategoryDrop(false); }}
                className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedType}</span>
                <ChevronDown size={14} className="text-purple-700" />
              </button>
              {showTypeDrop && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowTypeDrop(false)} />
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                    {allTrainingTypes.map((t) => (
                      <button
                        key={t}
                        onClick={() => { setSelectedType(t); setShowTypeDrop(false); setCurrentPage(1); }}
                        className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table — General Ledger pattern */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Training Title</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Category</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Type</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Instructor</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Start Date</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">End Date</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Expected Attendees</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Actual Attendees</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((training, idx) => (
              <tr
                key={training.id}
                className={`border-b border-slate-100 hover:bg-blue-50 transition-colors cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                onClick={() => setSelectedTraining(training)}
              >
                <td className="px-4 py-3">
                  <p className="text-[12px] font-medium text-slate-900">{training.trainingTitle}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[12px] text-slate-500">{training.category}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getTypeStyle(training.trainingType)}`}>
                    {training.trainingType}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[12px] text-slate-500">{training.instructor}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[12px] text-slate-500">{training.startDate}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[12px] text-slate-500">{training.endDate}</p>
                </td>
                <td className="px-4 py-3 text-center">
                  <p className="text-[12px] font-medium text-slate-900">{training.expectedAttendees}</p>
                </td>
                <td className="px-4 py-3 text-center">
                  <p className="text-[12px] font-medium text-green-600">{training.actualAttendees}</p>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(training.status)}`}>
                    {training.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setSelectedTraining(training)}
                    className="px-3 py-1.5 text-[12px] text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <p className="text-slate-500 text-sm">No trainings found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-40"
          >
            <ChevronDown size={16} className="rotate-90 text-pink-600" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 text-sm rounded transition-colors ${page === currentPage ? "bg-pink-50 text-pink-600" : "text-slate-600 hover:bg-slate-50"}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-40"
          >
            <ChevronDown size={16} className="-rotate-90 text-pink-600" />
          </button>
        </div>
      </div>

      {showAddModal && <AddTrainingModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}