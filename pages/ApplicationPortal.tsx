import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  X,
  ChevronDown,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Eye,
  Users,
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  FileText,
  DollarSign,
  BarChart3,
} from "lucide-react";
const imgDocumentWithCheckboxes = "https://picsum.photos/seed/2230/800/600";

// ─── Job title metadata (mirrors JobTitles component) ───────────────────────
interface JobTitleMeta {
  title: string;
  department: string;
  level: string;
  grade: string;
  salaryRange: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

const jobTitleLookup: Record<string, JobTitleMeta> = {
  "Senior Project Officer": {
    title: "Senior Project Officer",
    department: "Project Management",
    level: "Senior",
    grade: "Grade 9",
    salaryRange: "$55,000 - $70,000",
    description:
      "The Senior Project Officer is responsible for overseeing and managing key initiatives within the Project Management department. This role requires strong leadership, technical expertise, and the ability to work collaboratively with cross-functional teams to achieve organizational goals.",
    responsibilities: [
      "Lead and manage departmental projects and initiatives",
      "Collaborate with team members to achieve strategic objectives",
      "Monitor and report on key performance indicators",
      "Ensure compliance with organizational policies and procedures",
      "Mentor and support junior team members",
    ],
    requirements: [
      "Bachelor's degree in Project Management or related field",
      "5+ years of experience in a similar role",
      "Strong analytical and problem-solving skills",
      "Excellent communication and interpersonal abilities",
      "Proficiency in project management software and tools",
    ],
  },
  "M&E Data Analyst": {
    title: "M&E Data Analyst",
    department: "Monitoring & Evaluation",
    level: "Mid-Level",
    grade: "Grade 7",
    salaryRange: "$40,000 - $55,000",
    description:
      "The M&E Data Analyst is responsible for overseeing and managing key initiatives within the Monitoring & Evaluation department. This role requires strong analytical expertise and the ability to translate data into actionable insights for program improvement.",
    responsibilities: [
      "Design and implement data collection frameworks and tools",
      "Analyze program data and produce periodic performance reports",
      "Support the development and tracking of MEL indicators",
      "Ensure data quality through validation and cleaning processes",
      "Train field staff on data collection methodologies",
    ],
    requirements: [
      "Bachelor's degree in Statistics, Data Science, or related field",
      "3+ years of experience in M&E or data analysis",
      "Proficiency in data analysis tools (Excel, SPSS, Stata, Power BI)",
      "Strong analytical and problem-solving skills",
      "Excellent written and verbal communication abilities",
    ],
  },
  "Finance Assistant": {
    title: "Finance Assistant",
    department: "Finance",
    level: "Junior",
    grade: "Grade 5",
    salaryRange: "$28,000 - $38,000",
    description:
      "The Finance Assistant is responsible for supporting financial operations within the Finance department. This role involves assisting with bookkeeping, reconciliations, and financial reporting under the supervision of senior finance staff.",
    responsibilities: [
      "Assist with daily bookkeeping and data entry",
      "Support preparation of financial reports and statements",
      "Process invoices, receipts, and payment vouchers",
      "Assist with bank reconciliations and petty cash management",
      "Maintain organized financial filing systems",
    ],
    requirements: [
      "HND or Bachelor's degree in Accounting or Finance",
      "1-2 years of experience in a finance role",
      "Proficiency in accounting software and Microsoft Excel",
      "Strong attention to detail and organizational skills",
      "Basic understanding of financial regulations and compliance",
    ],
  },
  "IT Support Technician": {
    title: "IT Support Technician",
    department: "IT",
    level: "Mid-Level",
    grade: "Grade 6",
    salaryRange: "$35,000 - $45,000",
    description:
      "The IT Support Technician is responsible for providing technical support and maintaining IT infrastructure within the organization. This role involves troubleshooting hardware/software issues, network maintenance, and user support.",
    responsibilities: [
      "Provide first-line technical support to staff",
      "Install, configure, and maintain hardware and software",
      "Monitor and maintain network infrastructure",
      "Manage user accounts and access permissions",
      "Document IT procedures and maintain asset inventory",
    ],
    requirements: [
      "Bachelor's degree or HND in IT, Computer Science, or related field",
      "2+ years of experience in IT support",
      "Knowledge of networking, Windows/Linux OS, and Active Directory",
      "Strong troubleshooting and diagnostic skills",
      "Relevant IT certifications (CompTIA A+, ITIL) preferred",
    ],
  },
  "Communications Intern": {
    title: "Communications Intern",
    department: "Communications",
    level: "Entry",
    grade: "Grade 2",
    salaryRange: "$12,000 - $18,000",
    description:
      "The Communications Intern assists the Communications department with social media management, content creation, and media outreach activities. This is an entry-level role offering hands-on experience in organizational communications.",
    responsibilities: [
      "Assist with social media content creation and scheduling",
      "Support the production of newsletters and publications",
      "Help organize events and media engagements",
      "Compile media monitoring reports",
      "Assist with photography and basic graphic design tasks",
    ],
    requirements: [
      "Currently enrolled in or recently completed a degree in Communications, Journalism, or related field",
      "Strong writing and editing skills",
      "Familiarity with social media platforms and tools",
      "Basic knowledge of graphic design (Canva, Adobe Suite) is a plus",
      "Eager to learn and take on new challenges",
    ],
  },
  "Procurement Officer": {
    title: "Procurement Officer",
    department: "Procurement",
    level: "Junior",
    grade: "Grade 6",
    salaryRange: "$35,000 - $45,000",
    description:
      "The Procurement Officer is responsible for managing procurement processes including sourcing, vendor management, and purchase order processing within the Procurement department.",
    responsibilities: [
      "Manage end-to-end procurement processes",
      "Source and evaluate suppliers and vendors",
      "Prepare and process purchase orders and contracts",
      "Ensure compliance with procurement policies and donor requirements",
      "Maintain procurement records and documentation",
    ],
    requirements: [
      "Bachelor's degree in Procurement, Supply Chain, or related field",
      "2+ years of experience in procurement",
      "Knowledge of procurement regulations and best practices",
      "Strong negotiation and vendor management skills",
      "Proficiency in procurement software and Microsoft Office",
    ],
  },
  Driver: {
    title: "Driver",
    department: "Administration",
    level: "Entry",
    grade: "Grade 3",
    salaryRange: "$15,000 - $22,000",
    description:
      "The Driver is responsible for providing safe and reliable transportation services for staff and organizational goods. This role supports the Administration department's logistics operations.",
    responsibilities: [
      "Transport staff and goods safely to designated locations",
      "Maintain vehicle in clean and roadworthy condition",
      "Keep accurate vehicle log records",
      "Assist with basic logistics and errands",
      "Report vehicle defects and schedule maintenance",
    ],
    requirements: [
      "Valid driver's license (Class B minimum)",
      "2+ years of professional driving experience",
      "Good knowledge of local roads and routes",
      "Basic vehicle maintenance knowledge",
      "Clean driving record and strong safety awareness",
    ],
  },
};

// ─── Approved manpower requests ─────────────────────────────────────────────
interface ApprovedMPR {
  id: string;
  referenceNo: string;
  jobTitle: string;
  department: string;
  positions: number;
  employmentType: string;
  priority: string;
  neededBy: string;
  requestedBy: string;
  location: string;
}

const approvedManpowerRequests: ApprovedMPR[] = [
  {
    id: "2",
    referenceNo: "MPR-2026-0016",
    jobTitle: "M&E Data Analyst",
    department: "Monitoring & Evaluation",
    positions: 1,
    employmentType: "Full-Time",
    priority: "High",
    neededBy: "Mar 15, 2026",
    requestedBy: "Ama Darko",
    location: "Accra Head Office",
  },
  {
    id: "4",
    referenceNo: "MPR-2026-0012",
    jobTitle: "IT Support Technician",
    department: "IT",
    positions: 1,
    employmentType: "Contract",
    priority: "Medium",
    neededBy: "Mar 01, 2026",
    requestedBy: "Richard Antwi",
    location: "Accra Head Office",
  },
];

// ─── Application form cards ─────────────────────────────────────────────────
interface ApplicationForm {
  id: string;
  title: string;
  responses: number;
  mprRef: string;
  department: string;
  level: string;
  grade: string;
  salaryRange: string;
  employmentType: string;
  positions: number;
  location: string;
  deadline: string;
  datePosted: string;
  description: string;
  responsibilities: string;
  requirements: string;
}

const initialForms: ApplicationForm[] = [
  {
    id: "1",
    title: "HR Officer Application Form",
    responses: 190,
    mprRef: "MPR-2025-0042",
    department: "HR Management",
    level: "Mid-Level",
    grade: "Grade 7",
    salaryRange: "$40,000 - $55,000",
    employmentType: "Full-Time",
    positions: 1,
    location: "Accra Head Office",
    deadline: "Mar 20, 2026",
    datePosted: "Jan 10, 2026",
    description: "Seeking a dedicated HR Officer to manage employee relations and HR operations.",
    responsibilities: "Employee onboarding and offboarding\nMaintaining employee records\nProcessing leave requests and benefits\nSupporting recruitment processes",
    requirements: "Bachelor's degree in Human Resources or related field\n3+ years HR experience\nKnowledge of labor laws and HR best practices",
  },
  {
    id: "2",
    title: "Finance Officer Application Form",
    responses: 202,
    mprRef: "MPR-2025-0038",
    department: "Financial Management",
    level: "Mid-Level",
    grade: "Grade 7",
    salaryRange: "$40,000 - $55,000",
    employmentType: "Full-Time",
    positions: 1,
    location: "Accra Head Office",
    deadline: "Mar 15, 2026",
    datePosted: "Jan 05, 2026",
    description: "Looking for a Finance Officer to support financial reporting and grant management.",
    responsibilities: "Preparing financial reports\nManaging budgets and expenditures\nGrant financial compliance\nBank reconciliations",
    requirements: "Bachelor's degree in Accounting or Finance\n3+ years experience in NGO finance\nProficiency in accounting software",
  },
  {
    id: "3",
    title: "Secretary Application Form",
    responses: 200,
    mprRef: "MPR-2025-0035",
    department: "Administration",
    level: "Junior",
    grade: "Grade 5",
    salaryRange: "$25,000 - $35,000",
    employmentType: "Full-Time",
    positions: 1,
    location: "Accra Head Office",
    deadline: "Feb 28, 2026",
    datePosted: "Dec 15, 2025",
    description: "Administrative Secretary to provide clerical and organizational support.",
    responsibilities: "Managing correspondence and filing\nScheduling meetings and appointments\nPreparing meeting minutes\nOffice supply management",
    requirements: "HND or Bachelor's in Secretarial Studies or Administration\n2+ years relevant experience\nStrong organizational skills",
  },
];

type ModalStep = "select" | "form" | "preview";

export function ApplicationPortal() {
  // Listing
  const [forms, setForms] = useState<ApplicationForm[]>(initialForms);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCardMenu, setShowCardMenu] = useState<string | null>(null);

  // View detail
  const [viewDetail, setViewDetail] = useState<ApplicationForm | null>(null);

  // Wizard
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<ModalStep>("select");
  const [selectedMPR, setSelectedMPR] = useState<ApprovedMPR | null>(null);
  const [mprDropdownOpen, setMprDropdownOpen] = useState(false);
  const [mprSearchQuery, setMprSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    description: "",
    responsibilities: "",
    requirements: "",
    deadline: "",
    location: "",
  });

  // Ref for MPR dropdown trigger to position the fixed dropdown
  const mprTriggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  // Update dropdown position when it opens
  useEffect(() => {
    if (mprDropdownOpen && mprTriggerRef.current) {
      const rect = mprTriggerRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  }, [mprDropdownOpen]);

  // Derived metadata
  const resolvedMeta: JobTitleMeta | null = selectedMPR
    ? jobTitleLookup[selectedMPR.jobTitle] ?? {
        title: selectedMPR.jobTitle,
        department: selectedMPR.department,
        level: "—",
        grade: "—",
        salaryRange: "—",
        description: "",
        responsibilities: [],
        requirements: [],
      }
    : null;

  // Filtered listing
  const filteredForms = forms.filter((f) =>
    f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered MPR dropdown
  const filteredMPRs = approvedManpowerRequests.filter((m) => {
    const q = mprSearchQuery.toLowerCase();
    return (
      !q ||
      m.referenceNo.toLowerCase().includes(q) ||
      m.jobTitle.toLowerCase().includes(q) ||
      m.department.toLowerCase().includes(q)
    );
  });

  // Reset wizard
  const resetWizard = () => {
    setShowWizard(false);
    setWizardStep("select");
    setSelectedMPR(null);
    setMprSearchQuery("");
    setFormData({ description: "", responsibilities: "", requirements: "", deadline: "", location: "" });
  };

  // Publish
  const handlePublish = () => {
    if (!selectedMPR || !resolvedMeta) return;
    const newForm: ApplicationForm = {
      id: String(forms.length + 1),
      title: `${resolvedMeta.title} Application Form`,
      responses: 0,
      mprRef: selectedMPR.referenceNo,
      department: resolvedMeta.department,
      level: resolvedMeta.level,
      grade: resolvedMeta.grade,
      salaryRange: resolvedMeta.salaryRange,
      employmentType: selectedMPR.employmentType,
      positions: selectedMPR.positions,
      location: formData.location || selectedMPR.location,
      deadline: formData.deadline
        ? new Date(formData.deadline).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
        : "—",
      datePosted: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      description: formData.description,
      responsibilities: formData.responsibilities,
      requirements: formData.requirements,
    };
    setForms([newForm, ...forms]);
    resetWizard();
  };

  // ─── View Detail ─────────────────────────────────────────────────────────────
  if (viewDetail) {
    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <button
            onClick={() => setViewDetail(null)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-3"
          >
            <ArrowLeft size={18} />
            <span className="text-[13px]">Back to Application Portal</span>
          </button>
          <h1 className="text-2xl font-semibold text-slate-900">{viewDetail.title}</h1>
          <p className="text-[12px] text-slate-500 mt-1">
            {viewDetail.department} · Posted {viewDetail.datePosted} · Deadline {viewDetail.deadline}
          </p>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-5">
          {/* KPI cards */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Responses", value: viewDetail.responses, icon: <Users size={18} className="text-blue-600" />, bg: "bg-blue-50" },
              { label: "Positions", value: viewDetail.positions, icon: <Briefcase size={18} className="text-purple-600" />, bg: "bg-purple-50" },
              { label: "Grade", value: viewDetail.grade, icon: <BarChart3 size={18} className="text-amber-600" />, bg: "bg-amber-50" },
              { label: "Salary Range", value: viewDetail.salaryRange, icon: <DollarSign size={18} className="text-emerald-600" />, bg: "bg-emerald-50" },
            ].map((c) => (
              <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${c.bg}`}>{c.icon}</div>
                <div>
                  <p className="text-[11px] text-slate-500">{c.label}</p>
                  <p className="text-[15px] text-slate-900">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Position Details</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                ["Level", viewDetail.level],
                ["Grade", viewDetail.grade],
                ["Employment Type", viewDetail.employmentType],
                ["Salary Range", viewDetail.salaryRange],
                ["Location", viewDetail.location],
                ["MPR Reference", viewDetail.mprRef],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{l}</p>
                  <p className="text-[13px] text-slate-900">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {viewDetail.description && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">Job Description</p>
              <p className="text-[12px] text-slate-700 leading-relaxed whitespace-pre-line">{viewDetail.description}</p>
            </div>
          )}

          {viewDetail.responsibilities && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">Key Responsibilities</p>
              <ul className="space-y-1.5">
                {viewDetail.responsibilities.split("\n").filter(Boolean).map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-slate-700">
                    <span className="text-purple-700 mt-0.5">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {viewDetail.requirements && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">Requirements & Qualifications</p>
              <ul className="space-y-1.5">
                {viewDetail.requirements.split("\n").filter(Boolean).map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-slate-700">
                    <span className="text-purple-700 mt-0.5">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Main Listing ──────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-auto">
      <div className="px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">Application Portal</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] border border-blue-200">
              <FileText size={12} />
              {forms.length} Forms
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] border border-emerald-200">
              <Users size={12} />
              {forms.reduce((s, f) => s + f.responses, 0)} Total Responses
            </span>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="bg-purple-700 text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-purple-800 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="font-semibold text-sm">Add New Application Form</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Application Forms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredForms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Card Header with Illustration */}
              <div
                className="bg-slate-200 h-[148px] flex items-center justify-center relative cursor-pointer"
                onClick={() => setViewDetail(form)}
              >
                <img
                  src={imgDocumentWithCheckboxes}
                  alt="Application form"
                  className="h-[110px] object-contain"
                />
              </div>

              {/* Card Content */}
              <div className="p-3 bg-white">
                <p
                  className="text-sm text-slate-900 mb-1 truncate cursor-pointer hover:text-purple-700 transition-colors"
                  onClick={() => setViewDetail(form)}
                >
                  {form.title}
                </p>
                <p className="text-[10px] text-slate-400 mb-2 truncate">
                  {form.department} · {form.level} · {form.grade}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-700">{form.responses} Responses</span>
                  <div className="relative">
                    <button
                      onClick={() => setShowCardMenu(showCardMenu === form.id ? null : form.id)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {showCardMenu === form.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowCardMenu(null)} />
                        <div className="absolute right-0 bottom-full mb-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                          <button
                            onClick={() => {
                              setViewDetail(form);
                              setShowCardMenu(null);
                            }}
                            className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Eye size={13} /> View Details
                          </button>
                          <button
                            onClick={() => setShowCardMenu(null)}
                            className="w-full px-3 py-2 text-left text-[12px] text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <X size={13} /> Remove
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredForms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No application forms found</p>
          </div>
        )}
      </div>

      {/* ─── NEW APPLICATION WIZARD MODAL ─────────────────────────────────────── */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={resetWizard} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            {/* Modal header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-[15px] text-slate-900">
                  {wizardStep === "select"
                    ? "Select Manpower Request"
                    : wizardStep === "form"
                    ? "Application Details"
                    : "Preview Application"}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Step {wizardStep === "select" ? "1" : wizardStep === "form" ? "2" : "3"} of 3
                </p>
              </div>
              <button onClick={resetWizard} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="px-6 pt-4 pb-2 shrink-0">
              <div className="flex items-center gap-2">
                {(["select", "form", "preview"] as ModalStep[]).map((step, i) => {
                  const stepOrder = ["select", "form", "preview"];
                  const currentIdx = stepOrder.indexOf(wizardStep);
                  return (
                    <div key={step} className="flex items-center gap-2 flex-1">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 ${
                          currentIdx === i
                            ? "bg-purple-700 text-white"
                            : currentIdx > i
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {currentIdx > i ? <CheckCircle2 size={14} /> : i + 1}
                      </div>
                      {i < 2 && (
                        <div
                          className={`flex-1 h-0.5 rounded ${currentIdx > i ? "bg-emerald-300" : "bg-slate-200"}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex mt-1.5">
                <span className="flex-1 text-[10px] text-slate-400">Select Request</span>
                <span className="flex-1 text-[10px] text-slate-400 text-center">Fill Details</span>
                <span className="flex-1 text-[10px] text-slate-400 text-right">Preview</span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* ─── Step 1: Select approved MPR ───────────────────────────── */}
              {wizardStep === "select" && (
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 block">
                      Approved Manpower Request
                    </label>
                    <div className="relative">
                      <button
                        ref={mprTriggerRef}
                        onClick={() => setMprDropdownOpen(!mprDropdownOpen)}
                        className="w-full flex items-center justify-between px-3 py-2.5 border border-slate-200 rounded-lg bg-white text-left hover:border-purple-300 transition-colors"
                      >
                        {selectedMPR ? (
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[11px] text-blue-700 font-medium shrink-0">{selectedMPR.referenceNo}</span>
                            <span className="text-[12px] text-slate-400 shrink-0">—</span>
                            <span className="text-[12px] text-slate-900 truncate">{selectedMPR.jobTitle}</span>
                            <span className="text-[11px] text-slate-400 shrink-0">({selectedMPR.department})</span>
                          </div>
                        ) : (
                          <span className="text-[12px] text-slate-400">Select an approved manpower request...</span>
                        )}
                        <ChevronDown size={14} className="text-slate-400 shrink-0 ml-2" />
                      </button>
                      {mprDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMprDropdownOpen(false)} />
                          <div
                            className="fixed bg-white border border-slate-200 rounded-xl shadow-lg z-[60] overflow-hidden"
                            style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }}
                          >
                            {/* Search inside dropdown */}
                            <div className="px-3 py-2 border-b border-slate-100">
                              <div className="flex items-center gap-2 px-2 py-1.5 border border-slate-200 rounded-lg">
                                <Search size={13} className="text-slate-400" />
                                <input
                                  type="text"
                                  placeholder="Search by reference, title, or department..."
                                  value={mprSearchQuery}
                                  onChange={(e) => setMprSearchQuery(e.target.value)}
                                  className="flex-1 outline-none text-[11px] text-slate-900 placeholder:text-slate-400"
                                  autoFocus
                                />
                              </div>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {filteredMPRs.length === 0 ? (
                                <p className="text-center text-[11px] text-slate-400 py-4">No approved requests found</p>
                              ) : (
                                filteredMPRs.map((mpr) => {
                                  const meta = jobTitleLookup[mpr.jobTitle];
                                  return (
                                    <button
                                      key={mpr.id}
                                      onClick={() => {
                                        const jtMeta = jobTitleLookup[mpr.jobTitle];
                                        setSelectedMPR(mpr);
                                        setFormData({
                                          location: mpr.location,
                                          description: jtMeta?.description ?? "",
                                          responsibilities: jtMeta?.responsibilities?.join("\n") ?? "",
                                          requirements: jtMeta?.requirements?.join("\n") ?? "",
                                          deadline: "",
                                        });
                                        setMprDropdownOpen(false);
                                        setMprSearchQuery("");
                                      }}
                                      className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0 ${
                                        selectedMPR?.id === mpr.id ? "bg-purple-50" : ""
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[11px] text-blue-700 font-medium">{mpr.referenceNo}</span>
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                                          <CheckCircle2 size={9} /> Approved
                                        </span>
                                      </div>
                                      <p className="text-[12px] text-slate-900">{mpr.jobTitle}</p>
                                      <div className="flex items-center gap-3 mt-0.5 text-[10px] text-slate-400">
                                        <span>{mpr.department}</span>
                                        <span>{mpr.positions} position{mpr.positions > 1 ? "s" : ""}</span>
                                        <span>{mpr.employmentType}</span>
                                        {meta && <span>{meta.grade} · {meta.level}</span>}
                                      </div>
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Auto-filled info card */}
                  {selectedMPR && resolvedMeta && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                      <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">
                        Auto-filled from Job Title
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          ["Job Title", resolvedMeta.title],
                          ["Department", resolvedMeta.department],
                          ["Level", resolvedMeta.level],
                          ["Grade", resolvedMeta.grade],
                          ["Salary Range", resolvedMeta.salaryRange],
                          ["Employment Type", selectedMPR.employmentType],
                          ["No. of Positions", String(selectedMPR.positions)],
                          ["Priority", selectedMPR.priority],
                          ["Needed By", selectedMPR.neededBy],
                        ].map(([l, v]) => (
                          <div key={l}>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{l}</p>
                            <p className="text-[13px] text-slate-900">{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ─── Step 2: Application form ──────────────────────────────── */}
              {wizardStep === "form" && selectedMPR && resolvedMeta && (
                <div className="flex flex-col gap-4">
                  {/* Read-only summary */}
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-purple-600 uppercase tracking-wider mb-0.5">Creating application for</p>
                      <p className="text-[13px] text-slate-900 font-medium">
                        {resolvedMeta.title} — {resolvedMeta.department}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {resolvedMeta.level} · {resolvedMeta.grade} · {resolvedMeta.salaryRange} · {selectedMPR.employmentType}
                      </p>
                    </div>
                    <span className="text-[11px] text-blue-700 font-medium">{selectedMPR.referenceNo}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">
                        Application Deadline
                      </label>
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">
                      Job Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      placeholder="Describe the role, objectives, and scope of work..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400 resize-none overflow-hidden"
                      style={{ minHeight: "76px" }}
                      onInput={(e) => { const t = e.currentTarget; t.style.height = "auto"; t.style.height = t.scrollHeight + "px"; }}
                      ref={(el) => { if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; } }}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">
                      Key Responsibilities
                    </label>
                    <textarea
                      value={formData.responsibilities}
                      onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                      rows={3}
                      placeholder="List the main responsibilities (one per line)..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400 resize-none overflow-hidden"
                      style={{ minHeight: "76px" }}
                      onInput={(e) => { const t = e.currentTarget; t.style.height = "auto"; t.style.height = t.scrollHeight + "px"; }}
                      ref={(el) => { if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; } }}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">
                      Requirements & Qualifications
                    </label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      rows={3}
                      placeholder="List required qualifications, experience, and skills..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400 resize-none overflow-hidden"
                      style={{ minHeight: "76px" }}
                      onInput={(e) => { const t = e.currentTarget; t.style.height = "auto"; t.style.height = t.scrollHeight + "px"; }}
                      ref={(el) => { if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; } }}
                    />
                  </div>
                </div>
              )}

              {/* ─── Step 3: Preview ───────────────────────────────────────── */}
              {wizardStep === "preview" && selectedMPR && resolvedMeta && (
                <div className="flex flex-col gap-5">
                  {/* Preview banner */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
                    <Clock size={14} className="text-amber-600 shrink-0" />
                    <p className="text-[11px] text-amber-700">
                      Review the application details below. Click <strong>Publish to Portal</strong> to make it live.
                    </p>
                  </div>

                  {/* Preview card */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    {/* Title band */}
                    <div className="bg-blue-600 px-5 py-4">
                      <h3 className="text-[16px] text-white font-medium">{resolvedMeta.title} Application Form</h3>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-blue-100">
                        <span className="flex items-center gap-1"><Briefcase size={11} />{resolvedMeta.department}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} />{formData.location || selectedMPR.location}</span>
                        <span className="flex items-center gap-1"><Users size={11} />{selectedMPR.positions} position{selectedMPR.positions > 1 ? "s" : ""}</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />Deadline:{" "}
                          {formData.deadline
                            ? new Date(formData.deadline).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
                            : "—"}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-5">
                      {/* Position info */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">Position Information</p>
                        <div className="grid grid-cols-4 gap-3">
                          {[
                            ["Level", resolvedMeta.level],
                            ["Grade", resolvedMeta.grade],
                            ["Salary Range", resolvedMeta.salaryRange],
                            ["Employment Type", selectedMPR.employmentType],
                          ].map(([l, v]) => (
                            <div key={l}>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">{l}</p>
                              <p className="text-[13px] text-slate-900">{v}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* MPR reference */}
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <FileText size={13} className="text-blue-600" />
                        <p className="text-[11px] text-blue-700">
                          Linked to Manpower Request: <strong>{selectedMPR.referenceNo}</strong> — Requested by {selectedMPR.requestedBy}
                        </p>
                      </div>

                      {formData.description && (
                        <div>
                          <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-2">Job Description</p>
                          <p className="text-[12px] text-slate-700 leading-relaxed whitespace-pre-line">{formData.description}</p>
                        </div>
                      )}

                      {formData.responsibilities && (
                        <div>
                          <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-2">Key Responsibilities</p>
                          <ul className="space-y-1">
                            {formData.responsibilities.split("\n").filter(Boolean).map((line, i) => (
                              <li key={i} className="flex items-start gap-2 text-[12px] text-slate-700">
                                <span className="text-purple-700 mt-0.5">•</span>
                                <span>{line}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {formData.requirements && (
                        <div>
                          <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-2">Requirements & Qualifications</p>
                          <ul className="space-y-1">
                            {formData.requirements.split("\n").filter(Boolean).map((line, i) => (
                              <li key={i} className="flex items-start gap-2 text-[12px] text-slate-700">
                                <span className="text-purple-700 mt-0.5">•</span>
                                <span>{line}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
              {wizardStep !== "select" ? (
                <button
                  onClick={() => setWizardStep(wizardStep === "preview" ? "form" : "select")}
                  className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={resetWizard}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                {wizardStep === "select" && (
                  <button
                    disabled={!selectedMPR}
                    onClick={() => setWizardStep("form")}
                    className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                )}
                {wizardStep === "form" && (
                  <button
                    onClick={() => setWizardStep("preview")}
                    className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800"
                  >
                    Preview <Eye size={14} />
                  </button>
                )}
                {wizardStep === "preview" && (
                  <button
                    onClick={handlePublish}
                    className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800"
                  >
                    <CheckCircle2 size={14} /> Publish to Portal
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationPortal;