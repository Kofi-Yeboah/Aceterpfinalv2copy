import React, { useState } from "react";
import {
  Target,
  TrendingUp,
  Users,
  Brain,
  Lightbulb,
  Plus,
  X,
  Star,
  ChevronLeft,
  Eye,
  FileText,
  Save,
  Edit3,
  Award,
  Calendar,
  Briefcase,
  User,
  Building2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ScorecardPhase = "setup" | "mid-year" | "end-year" | "completed";

interface ObjectiveEntry {
  id: string;
  perspective: "strategy" | "internal" | "stakeholder" | "learning";
  label: string;
  target: string;
  weight: number;
  dueDate: string;
  midYearEmployeeComment: string;
  midYearManagerComment: string;
  midYearManagerRating: number;
  endYearEmployeeComment: string;
  endYearManagerComment: string;
  endYearManagerRating: number;
}

interface BehaviorEntry {
  id: string;
  label: string;
  expectation: string;
  weight: number;
  rating: number;
  finalScore: number;
}

interface EmployeeScorecardData {
  id: string;
  year: string;
  phase: ScorecardPhase;
  staffName: string;
  department: string;
  role: string;
  lineManager: string;
  date: string;
  objectives: ObjectiveEntry[];
  behaviors: BehaviorEntry[];
  employeeFinalComment: string;
  managerFinalComment: string;
  overallScore: number | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STAFF_NAMES = [
  "Ama Darko",
  "Kwame Asante",
  "Naomi Ansah",
  "Beatrice Osei",
  "Richard Antwi",
  "Priscilla Tetteh",
  "Yaw Osei",
];
const LINE_MANAGERS = [
  "Kofi Mensah",
  "Abena Owusu",
  "Nana Yaw",
  "Mercy Adjei",
  "Ama Darko",
];
const DEPARTMENTS = [
  "Human Resources",
  "Finance",
  "Project Management",
  "Procurement",
  "Legal",
  "Monitoring & Evaluation",
];
const ROLES = [
  "HR Manager",
  "HR Officer",
  "Finance Officer",
  "Accountant",
  "Project Coordinator",
  "Procurement Officer",
  "Legal Counsel",
];

const BEHAVIOR_LABELS = [
  "Pioneering",
  "Respect",
  "Integrity",
  "Collaboration",
  "Excellence",
] as const;

const DEFAULT_BEHAVIORS: Omit<BehaviorEntry, "id">[] = BEHAVIOR_LABELS.map(
  (label) => ({
    label,
    expectation: "",
    weight: 5,
    rating: 0,
    finalScore: 0,
  })
);

type PerspectiveKey = "strategy" | "internal" | "stakeholder" | "learning";

const PERSPECTIVES: {
  key: PerspectiveKey;
  label: string;
  prefix: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}[] = [
  {
    key: "strategy",
    label: "Strategy Delivery",
    prefix: "sd",
    icon: Target,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    key: "internal",
    label: "Internal Perspective",
    prefix: "ip",
    icon: TrendingUp,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
  },
  {
    key: "stakeholder",
    label: "Stakeholder Perspective",
    prefix: "sp",
    icon: Users,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
  },
  {
    key: "learning",
    label: "Learning & Development",
    prefix: "ld",
    icon: Brain,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
  },
];

const SCORE_DESCRIPTORS: { min: number; max: number; rating: number; label: string; color: string }[] = [
  { min: 0, max: 70, rating: 1, label: "Under Performed", color: "bg-red-100 text-red-700" },
  { min: 71, max: 80, rating: 2, label: "Target Not Met", color: "bg-orange-100 text-orange-700" },
  { min: 81, max: 90, rating: 3, label: "Target Met", color: "bg-blue-100 text-blue-700" },
  { min: 91, max: 95, rating: 4, label: "Target Exceeded", color: "bg-green-100 text-green-700" },
  { min: 96, max: 100, rating: 5, label: "Outstanding", color: "bg-emerald-100 text-emerald-700" },
];

const MANAGER_RATING_DESCRIPTORS: Record<number, string> = {
  0: "Not Achieved",
  1: ">50% Achieved",
  2: ">80% Achieved",
  3: ">100% Achieved",
  4: ">120% Achieved",
  5: ">150% Achieved",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let _idCounter = 100;
function genId() {
  _idCounter += 1;
  return `obj-${_idCounter}`;
}

function makeEmptyObjective(perspective: PerspectiveKey): ObjectiveEntry {
  return {
    id: genId(),
    perspective,
    label: "",
    target: "",
    weight: 0,
    dueDate: "",
    midYearEmployeeComment: "",
    midYearManagerComment: "",
    midYearManagerRating: 0,
    endYearEmployeeComment: "",
    endYearManagerComment: "",
    endYearManagerRating: 0,
  };
}

function makeBehaviors(): BehaviorEntry[] {
  return DEFAULT_BEHAVIORS.map((b, i) => ({ ...b, id: `beh-${i}` }));
}

function getRatingInfo(score: number | null) {
  if (score === null) return null;
  const rounded = Math.round(score);
  for (const s of SCORE_DESCRIPTORS) {
    if (rounded >= s.min && rounded <= s.max) return s;
  }
  if (rounded > 100) return SCORE_DESCRIPTORS[4];
  return SCORE_DESCRIPTORS[0];
}

function computeOverallScore(objectives: ObjectiveEntry[], behaviors: BehaviorEntry[]): number {
  let total = 0;
  for (const obj of objectives) {
    const avgRating = (obj.midYearManagerRating + obj.endYearManagerRating) / 2;
    total += (avgRating / 5) * obj.weight;
  }
  for (const beh of behaviors) {
    total += (beh.rating / 5) * beh.weight;
  }
  return Math.round(total * 100) / 100;
}

function phaseBadge(phase: ScorecardPhase) {
  const map: Record<ScorecardPhase, { label: string; cls: string }> = {
    setup: { label: "Setup", cls: "bg-slate-100 text-slate-700" },
    "mid-year": { label: "Mid-Year Review", cls: "bg-blue-100 text-blue-700" },
    "end-year": { label: "End-of-Year Review", cls: "bg-purple-100 text-purple-700" },
    completed: { label: "Completed", cls: "bg-green-100 text-green-700" },
  };
  const info = map[phase];
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] font-medium ${info.cls}`}>
      {info.label}
    </span>
  );
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
        />
      ))}
      <span className="ml-1 text-[12px] text-slate-500">
        {rating}/{max} {MANAGER_RATING_DESCRIPTORS[rating] ? `- ${MANAGER_RATING_DESCRIPTORS[rating]}` : ""}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_SCORECARDS: EmployeeScorecardData[] = [
  {
    id: "sc-2025",
    year: "2025",
    phase: "mid-year",
    staffName: "Ama Darko",
    department: "Human Resources",
    role: "HR Manager",
    lineManager: "Kofi Mensah",
    date: "2025-01-15",
    objectives: [
      {
        id: "sd-1",
        perspective: "strategy",
        label: "Develop and implement a revised talent acquisition framework aligned with 2025 organisational growth targets",
        target: "Complete framework document and pilot in Q2; achieve 30% reduction in time-to-hire by year-end",
        weight: 15,
        dueDate: "2025-12-31",
        midYearEmployeeComment: "Framework document completed and approved in Q1. Pilot launched in April covering 3 departments.",
        midYearManagerComment: "Good progress on the framework. Pilot is showing early promise with noticeable improvements in hiring speed.",
        midYearManagerRating: 3,
        endYearEmployeeComment: "",
        endYearManagerComment: "",
        endYearManagerRating: 0,
      },
      {
        id: "sd-2",
        perspective: "strategy",
        label: "Establish quarterly workforce planning reviews with department heads",
        target: "Conduct 4 quarterly reviews with documented action plans; 90% department participation",
        weight: 10,
        dueDate: "2025-12-31",
        midYearEmployeeComment: "Q1 and Q2 reviews completed. All 6 departments participated in Q1; 5 of 6 in Q2.",
        midYearManagerComment: "",
        midYearManagerRating: 0,
        endYearEmployeeComment: "",
        endYearManagerComment: "",
        endYearManagerRating: 0,
      },
      {
        id: "ip-1",
        perspective: "internal",
        label: "Automate leave management and timesheet tracking processes",
        target: "Deploy digital leave/timesheet system with 100% staff adoption by Q3",
        weight: 15,
        dueDate: "2025-09-30",
        midYearEmployeeComment: "System selected and vendor contracted. UAT scheduled for July.",
        midYearManagerComment: "On track. Ensure training plan is ready before go-live.",
        midYearManagerRating: 3,
        endYearEmployeeComment: "",
        endYearManagerComment: "",
        endYearManagerRating: 0,
      },
      {
        id: "sp-1",
        perspective: "stakeholder",
        label: "Improve employee satisfaction score through targeted engagement initiatives",
        target: "Achieve employee satisfaction score of 80% or above in annual survey",
        weight: 15,
        dueDate: "2025-11-30",
        midYearEmployeeComment: "Launched monthly town halls and anonymous feedback portal. Mid-year pulse survey showed 74% satisfaction.",
        midYearManagerComment: "Good initiatives. Consider adding focus groups for deeper insights.",
        midYearManagerRating: 2,
        endYearEmployeeComment: "",
        endYearManagerComment: "",
        endYearManagerRating: 0,
      },
      {
        id: "ld-1",
        perspective: "learning",
        label: "Complete SHRM-SCP certification and develop internal HR training curriculum",
        target: "Pass SHRM-SCP exam by Q3; deliver 2 internal training workshops by year-end",
        weight: 10,
        dueDate: "2025-12-31",
        midYearEmployeeComment: "Enrolled in SHRM-SCP prep course. First internal workshop on Performance Management delivered in March.",
        midYearManagerComment: "",
        midYearManagerRating: 0,
        endYearEmployeeComment: "",
        endYearManagerComment: "",
        endYearManagerRating: 0,
      },
      {
        id: "ld-2",
        perspective: "learning",
        label: "Implement mentorship programme pairing senior and junior staff",
        target: "Launch programme with 10 mentor-mentee pairs by Q2; 80% retention by year-end",
        weight: 10,
        dueDate: "2025-12-31",
        midYearEmployeeComment: "Programme launched with 12 pairs in April. Kick-off sessions completed.",
        midYearManagerComment: "Excellent uptake. Monitor pair engagement closely.",
        midYearManagerRating: 4,
        endYearEmployeeComment: "",
        endYearManagerComment: "",
        endYearManagerRating: 0,
      },
    ],
    behaviors: makeBehaviors(),
    employeeFinalComment: "",
    managerFinalComment: "",
    overallScore: null,
  },
  {
    id: "sc-2024",
    year: "2024",
    phase: "completed",
    staffName: "Ama Darko",
    department: "Human Resources",
    role: "HR Manager",
    lineManager: "Kofi Mensah",
    date: "2024-01-10",
    objectives: [
      {
        id: "sd-c1",
        perspective: "strategy",
        label: "Redesign onboarding process to improve new-hire retention",
        target: "Reduce 6-month attrition by 25%",
        weight: 20,
        dueDate: "2024-12-31",
        midYearEmployeeComment: "Drafted new onboarding handbook and buddy system. Piloted in Q2.",
        midYearManagerComment: "Good initial structure. Expand buddy programme coverage.",
        midYearManagerRating: 3,
        endYearEmployeeComment: "Full rollout achieved. 6-month attrition dropped by 30%.",
        endYearManagerComment: "Exceeded target. Strong execution throughout the year.",
        endYearManagerRating: 4,
      },
      {
        id: "ip-c1",
        perspective: "internal",
        label: "Digitise employee records and establish HRIS data governance",
        target: "100% of active employee files migrated; data accuracy rate above 95%",
        weight: 20,
        dueDate: "2024-10-31",
        midYearEmployeeComment: "Migration 60% complete. Data cleansing ongoing.",
        midYearManagerComment: "Steady progress. Prioritise accuracy checks.",
        midYearManagerRating: 3,
        endYearEmployeeComment: "Migration completed with 97% accuracy rate.",
        endYearManagerComment: "Target met with high quality. Well done.",
        endYearManagerRating: 4,
      },
      {
        id: "sp-c1",
        perspective: "stakeholder",
        label: "Launch quarterly staff recognition programme",
        target: "4 recognition events held; 75% staff awareness",
        weight: 20,
        dueDate: "2024-12-31",
        midYearEmployeeComment: "Q1 and Q2 events held. Staff survey shows 68% awareness.",
        midYearManagerComment: "Good start. Increase visibility through internal comms.",
        midYearManagerRating: 3,
        endYearEmployeeComment: "All 4 events completed. Awareness reached 82%.",
        endYearManagerComment: "Target exceeded on awareness. Events well received.",
        endYearManagerRating: 4,
      },
      {
        id: "ld-c1",
        perspective: "learning",
        label: "Complete Professional Diploma in Human Resource Management",
        target: "Pass all modules by Q4",
        weight: 15,
        dueDate: "2024-12-31",
        midYearEmployeeComment: "Completed 3 of 5 modules.",
        midYearManagerComment: "On track. Keep up the momentum.",
        midYearManagerRating: 3,
        endYearEmployeeComment: "All 5 modules completed with distinction.",
        endYearManagerComment: "Outstanding academic achievement alongside work duties.",
        endYearManagerRating: 5,
      },
    ],
    behaviors: [
      { id: "beh-c0", label: "Pioneering", expectation: "Champion new initiatives that anticipate future organisational needs", weight: 5, rating: 4, finalScore: 4 },
      { id: "beh-c1", label: "Respect", expectation: "Foster a culture where all staff feel valued, heard, and fairly treated", weight: 5, rating: 4, finalScore: 4 },
      { id: "beh-c2", label: "Integrity", expectation: "Ensure transparent procedures in all processes", weight: 5, rating: 5, finalScore: 5 },
      { id: "beh-c3", label: "Collaboration", expectation: "Support teams to build cohesive and high-performing units", weight: 5, rating: 4, finalScore: 4 },
      { id: "beh-c4", label: "Excellence", expectation: "Hold team members accountable for delivering exceptional service", weight: 5, rating: 4, finalScore: 4 },
    ],
    employeeFinalComment: "I am proud of the progress made this year, particularly in onboarding redesign and HRIS migration. I look forward to building on these achievements.",
    managerFinalComment: "Ama has shown consistent dedication and strong results across all objectives. Her leadership in the onboarding redesign was exemplary.",
    overallScore: 90,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type ViewMode = "list" | "create" | "detail";

export function EmployeeScorecard() {
  const [scorecards, setScorecards] = useState<EmployeeScorecardData[]>(MOCK_SCORECARDS);
  const [view, setView] = useState<ViewMode>("list");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Draft for create / edit
  const [draft, setDraft] = useState<EmployeeScorecardData | null>(null);
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [expandedDetail, setExpandedDetail] = useState<Record<string, boolean>>({});

  const currentYear = new Date().getFullYear().toString();
  const hasCurrentYear = scorecards.some((s) => s.year === currentYear);

  // ---- handlers ----

  function handleCreateNew() {
    const newSc: EmployeeScorecardData = {
      id: `sc-${currentYear}`,
      year: currentYear,
      phase: "setup",
      staffName: "Ama Darko",
      department: "Human Resources",
      role: "HR Manager",
      lineManager: "Kofi Mensah",
      date: new Date().toISOString().slice(0, 10),
      objectives: PERSPECTIVES.map((p) => makeEmptyObjective(p.key)),
      behaviors: makeBehaviors(),
      employeeFinalComment: "",
      managerFinalComment: "",
      overallScore: null,
    };
    setDraft(newSc);
    setCreateStep(1);
    setView("create");
    setEditMode(true);
  }

  function handleView(id: string) {
    const sc = scorecards.find((s) => s.id === id);
    if (!sc) return;
    setActiveId(id);
    if (sc.phase === "setup") {
      setDraft({ ...sc, objectives: sc.objectives.map((o) => ({ ...o })), behaviors: sc.behaviors.map((b) => ({ ...b })) });
      setEditMode(false);
    } else {
      setDraft({ ...sc, objectives: sc.objectives.map((o) => ({ ...o })), behaviors: sc.behaviors.map((b) => ({ ...b })) });
      setEditMode(false);
    }
    setView("detail");
  }

  function handleEditSetup() {
    setEditMode(true);
    setCreateStep(1);
    setView("create");
  }

  function handleSaveScorecard() {
    if (!draft) return;
    const existing = scorecards.findIndex((s) => s.id === draft.id);
    if (existing >= 0) {
      const updated = [...scorecards];
      updated[existing] = { ...draft };
      setScorecards(updated);
    } else {
      setScorecards([draft, ...scorecards]);
    }
    setView("list");
    setDraft(null);
    setEditMode(false);
  }

  function handleSaveComments() {
    if (!draft) return;
    const existing = scorecards.findIndex((s) => s.id === draft.id);
    if (existing >= 0) {
      const updated = [...scorecards];
      updated[existing] = { ...draft };
      setScorecards(updated);
    }
    setView("list");
    setDraft(null);
  }

  function handleBack() {
    setView("list");
    setDraft(null);
    setActiveId(null);
    setEditMode(false);
  }

  // ---- objective helpers ----

  function addObjective(perspective: PerspectiveKey) {
    if (!draft) return;
    setDraft({
      ...draft,
      objectives: [...draft.objectives, makeEmptyObjective(perspective)],
    });
  }

  function removeObjective(id: string) {
    if (!draft) return;
    const obj = draft.objectives.find((o) => o.id === id);
    if (!obj) return;
    const sameP = draft.objectives.filter((o) => o.perspective === obj.perspective);
    if (sameP.length <= 1) return;
    setDraft({ ...draft, objectives: draft.objectives.filter((o) => o.id !== id) });
  }

  function updateObjective(id: string, field: keyof ObjectiveEntry, value: string | number) {
    if (!draft) return;
    setDraft({
      ...draft,
      objectives: draft.objectives.map((o) =>
        o.id === id ? { ...o, [field]: value } : o
      ),
    });
  }

  // ===========================================================================
  // RENDER: LIST VIEW
  // ===========================================================================

  if (view === "list") {
    return (
      <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-slate-800">My Scorecard</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              Create and manage your performance scorecards
            </p>
          </div>
          {!hasCurrentYear && (
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 text-white text-[13px] rounded-lg font-medium hover:opacity-90 transition"
              style={{ backgroundColor: "#0B01D0" }}
            >
              <Plus size={16} />
              Create Scorecard
            </button>
          )}
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#0B01D0" }}>
                {["Year", "Phase", "Department", "Line Manager", "Overall Score", "Rating", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-[13px] font-semibold text-white px-4 py-3"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {scorecards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[13px] text-slate-400">
                    No scorecards yet. Click "Create Scorecard" to get started.
                  </td>
                </tr>
              ) : (
                scorecards.map((sc) => {
                  const ri = getRatingInfo(sc.overallScore);
                  return (
                    <tr key={sc.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-4 py-3 text-[13px] text-slate-700 font-medium">{sc.year}</td>
                      <td className="px-4 py-3">{phaseBadge(sc.phase)}</td>
                      <td className="px-4 py-3 text-[13px] text-slate-600">{sc.department}</td>
                      <td className="px-4 py-3 text-[13px] text-slate-600">{sc.lineManager}</td>
                      <td className="px-4 py-3 text-[13px] text-slate-700 font-medium">
                        {sc.overallScore !== null ? `${sc.overallScore}%` : "--"}
                      </td>
                      <td className="px-4 py-3">
                        {ri ? (
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] font-medium ${ri.color}`}>
                            {ri.label}
                          </span>
                        ) : (
                          <span className="text-[12px] text-slate-400">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleView(sc.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Rating Scale Legend */}
        <div className="border border-slate-200 rounded-xl p-5">
          <h3 className="text-[14px] font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Award size={16} className="text-slate-500" />
            Rating Scale
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {SCORE_DESCRIPTORS.map((sd) => (
              <div key={sd.rating} className={`rounded-lg px-3 py-2 ${sd.color}`}>
                <div className="text-[13px] font-semibold">Rating {sd.rating}</div>
                <div className="text-[12px]">{sd.label}</div>
                <div className="text-[12px] mt-0.5 opacity-75">
                  {sd.min}% - {sd.max}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // RENDER: CREATE / EDIT VIEW (Setup Phase)
  // ===========================================================================

  if (view === "create" && draft) {
    return (
      <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-slate-100 transition"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-[20px] font-bold text-slate-800">
                {editMode && activeId ? "Edit Scorecard" : "Create Scorecard"} - {draft.year}
              </h1>
              <p className="text-[13px] text-slate-500 mt-0.5">
                Define your objectives and targets for the year
              </p>
            </div>
          </div>
          {createStep === 2 && (
            <button
              onClick={handleSaveScorecard}
              className="flex items-center gap-2 px-4 py-2 text-white text-[13px] rounded-lg font-medium hover:opacity-90 transition"
              style={{ backgroundColor: "#0B01D0" }}
            >
              <Save size={16} />
              Save Scorecard
            </button>
          )}
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium ${createStep === 1 ? "bg-[#0B01D0] text-white" : "bg-slate-100 text-slate-500"}`}>
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">1</span>
            Balanced Scorecard
          </div>
          <ChevronRight size={14} className="text-slate-300" />
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium ${createStep === 2 ? "bg-[#0B01D0] text-white" : "bg-slate-100 text-slate-500"}`}>
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">2</span>
            Behavioral Assessment
          </div>
        </div>

        {/* Employee Info — Read-only */}
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
          <h3 className="text-[14px] font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <User size={16} className="text-slate-500" />
            Employee Information
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-slate-500 mb-1">
                <span className="flex items-center gap-1"><User size={12} /> Staff Name</span>
              </label>
              <p className="text-[13px] text-slate-700">{draft.staffName}</p>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-500 mb-1">
                <span className="flex items-center gap-1"><Building2 size={12} /> Department</span>
              </label>
              <p className="text-[13px] text-slate-700">{draft.department}</p>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-500 mb-1">
                <span className="flex items-center gap-1"><Briefcase size={12} /> Role</span>
              </label>
              <p className="text-[13px] text-slate-700">{draft.role}</p>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-500 mb-1">
                <span className="flex items-center gap-1"><User size={12} /> Line Manager</span>
              </label>
              <p className="text-[13px] text-slate-700">{draft.lineManager}</p>
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-[12px] font-medium text-slate-500 mb-1">
              <span className="flex items-center gap-1"><Calendar size={12} /> Date</span>
            </label>
            <p className="text-[13px] text-slate-700">{draft.date}</p>
          </div>
        </div>

        {/* ── Step 1: Balanced Scorecard ── */}
        {createStep === 1 && (
          <>
            {PERSPECTIVES.map((p) => {
              const Icon = p.icon;
              const objs = draft.objectives.filter((o) => o.perspective === p.key);
              return (
                <div key={p.key} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50">
                    <div className={`w-8 h-8 rounded-lg ${p.iconBg} flex items-center justify-center`}>
                      <Icon size={18} className={p.iconColor} />
                    </div>
                    <h3 className="text-[14px] font-semibold text-slate-700">{p.label}</h3>
                    <span className="text-[12px] text-slate-400 ml-auto">
                      Prefix: {p.prefix.toUpperCase()}
                    </span>
                  </div>

                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left text-[12px] font-semibold text-slate-500 px-4 py-2 w-[40%]">Objective</th>
                        <th className="text-left text-[12px] font-semibold text-slate-500 px-4 py-2 w-[30%]">Target</th>
                        <th className="text-left text-[12px] font-semibold text-slate-500 px-4 py-2 w-[20%]">Due Date</th>
                        <th className="text-left text-[12px] font-semibold text-slate-500 px-4 py-2 w-[10%]"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {objs.map((obj) => (
                        <tr key={obj.id} className="border-b border-slate-50">
                          <td className="px-4 py-2">
                            <textarea
                              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                              rows={3}
                              placeholder="Describe the objective..."
                              value={obj.label}
                              onChange={(e) => updateObjective(obj.id, "label", e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <textarea
                              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                              rows={3}
                              placeholder="Describe the target..."
                              value={obj.target}
                              onChange={(e) => updateObjective(obj.id, "target", e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="date"
                              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              value={obj.dueDate}
                              onChange={(e) => updateObjective(obj.id, "dueDate", e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            {objs.length > 1 && (
                              <button
                                onClick={() => removeObjective(obj.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 transition text-slate-400 hover:text-red-500"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="px-4 py-3 border-t border-slate-100">
                    <button
                      onClick={() => addObjective(p.key)}
                      className="flex items-center gap-1.5 text-[13px] rounded-lg px-3 py-1.5 border border-dashed border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-600 transition"
                    >
                      <Plus size={14} />
                      Add Objective
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-end">
              <button
                onClick={() => setCreateStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 text-white text-[13px] rounded-lg font-medium hover:opacity-90 transition"
                style={{ backgroundColor: "#0B01D0" }}
              >
                Continue to Behavioral Assessment
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: Behavioral Assessment ── */}
        {createStep === 2 && (
          <>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Lightbulb size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-slate-700">Behavioral Assessment</h3>
                  <p className="text-[12px] text-slate-400">Define one objective per behavior</p>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {draft.behaviors.map((b, idx) => (
                  <div key={b.id} className="px-5 py-4 space-y-2">
                    <span className="text-[13px] font-semibold text-slate-700">{b.label}</span>
                    <textarea
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                      rows={2}
                      placeholder={`Enter your ${b.label.toLowerCase()} objective / expectation...`}
                      value={b.expectation}
                      onChange={(e) => {
                        const updated = [...draft.behaviors];
                        updated[idx] = { ...updated[idx], expectation: e.target.value };
                        setDraft({ ...draft, behaviors: updated });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCreateStep(1)}
                className="flex items-center gap-2 px-5 py-2.5 text-[13px] rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              >
                <ArrowLeft size={16} />
                Back to Balanced Scorecard
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ===========================================================================
  // RENDER: DETAIL VIEW
  // ===========================================================================

  if (view === "detail" && draft) {
    const sc = draft;
    const isSetup = sc.phase === "setup";
    const isMidYear = sc.phase === "mid-year";
    const isEndYear = sc.phase === "end-year";
    const isCompleted = sc.phase === "completed";

    const calculatedScore = isCompleted ? sc.overallScore : computeOverallScore(sc.objectives, sc.behaviors);
    const ri = getRatingInfo(calculatedScore);

    return (
      <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-2 rounded-lg hover:bg-slate-100 transition">
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-[20px] font-bold text-slate-800">
                Scorecard {sc.year}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                {phaseBadge(sc.phase)}
                <span className="text-[13px] text-slate-500">
                  {sc.staffName} - {sc.department}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSetup && (
              <button
                onClick={handleEditSetup}
                className="flex items-center gap-2 px-4 py-2 text-white text-[13px] rounded-lg font-medium hover:opacity-90 transition"
                style={{ backgroundColor: "#0B01D0" }}
              >
                <Edit3 size={16} />
                Edit Scorecard
              </button>
            )}
            {(isMidYear || isEndYear) && (
              <button
                onClick={handleSaveComments}
                className="flex items-center gap-2 px-4 py-2 text-white text-[13px] rounded-lg font-medium hover:opacity-90 transition"
                style={{ backgroundColor: "#0B01D0" }}
              >
                <Save size={16} />
                Save Comments
              </button>
            )}
          </div>
        </div>

        {/* Setup banner */}
        {isSetup && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 flex items-center gap-3">
            <FileText size={18} className="text-blue-500" />
            <p className="text-[13px] text-blue-700">
              Your scorecard has been submitted. It will be unlocked for mid-year review.
            </p>
          </div>
        )}

        {/* Employee Info Card */}
        <div className="border border-slate-200 rounded-xl p-5">
          <h3 className="text-[14px] font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <User size={16} className="text-slate-500" />
            Employee Information
          </h3>
          <div className="grid grid-cols-4 gap-4 text-[13px]">
            <div>
              <span className="text-slate-400 text-[12px]">Staff Name</span>
              <p className="text-slate-700 font-medium">{sc.staffName || "--"}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[12px]">Department</span>
              <p className="text-slate-700 font-medium">{sc.department || "--"}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[12px]">Role</span>
              <p className="text-slate-700 font-medium">{sc.role || "--"}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[12px]">Line Manager</span>
              <p className="text-slate-700 font-medium">{sc.lineManager || "--"}</p>
            </div>
          </div>
        </div>

        {/* Overall Score (completed or end-year with scores) */}
        {isCompleted && calculatedScore !== null && ri && (
          <div className="border border-slate-200 rounded-xl p-5">
            <h3 className="text-[14px] font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Award size={16} className="text-slate-500" />
              Overall Performance
            </h3>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-[32px] font-bold text-slate-800">{calculatedScore}%</div>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-[13px] font-semibold ${ri.color}`}>
                  Rating {ri.rating} - {ri.label}
                </span>
              </div>
              <div className="flex-1">
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                    style={{ width: `${Math.min(calculatedScore, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Objectives by Perspective — Collapsible */}
        {PERSPECTIVES.map((p) => {
          const Icon = p.icon;
          const objs = sc.objectives.filter((o) => o.perspective === p.key);
          if (objs.length === 0) return null;
          const sKey = `detail-${p.key}`;
          const isOpen = !!expandedDetail[sKey];

          return (
            <div key={p.key} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedDetail((prev) => ({ ...prev, [sKey]: !prev[sKey] }))}
                className="w-full flex items-center gap-3 px-5 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <ChevronRight size={16} className={`text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                <div className={`w-8 h-8 rounded-lg ${p.iconBg} flex items-center justify-center`}>
                  <Icon size={18} className={p.iconColor} />
                </div>
                <h3 className="text-[14px] font-semibold text-slate-700">{p.label}</h3>
                <span className="ml-auto text-[12px] text-slate-400">{objs.length} objective{objs.length > 1 ? "s" : ""}</span>
              </button>

              {isOpen && (
                <div className="divide-y divide-slate-100 border-t border-slate-100">
                  {objs.map((obj, idx) => (
                    <div key={obj.id} className="px-5 py-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[12px] font-medium text-slate-400">
                              {p.prefix.toUpperCase()}-{idx + 1}
                            </span>
                            <span className="text-[12px] text-slate-400">|</span>
                            <span className="text-[12px] text-slate-400">Weight: {obj.weight}%</span>
                            <span className="text-[12px] text-slate-400">|</span>
                            <span className="text-[12px] text-slate-400">Due: {obj.dueDate || "--"}</span>
                          </div>
                          <p className="text-[13px] font-medium text-slate-700">{obj.label}</p>
                          <p className="text-[13px] text-slate-500 mt-1">
                            <span className="font-medium text-slate-600">Target:</span> {obj.target}
                          </p>
                        </div>
                      </div>

                      {/* Mid-Year Section */}
                      {(isMidYear || isEndYear || isCompleted) && (
                        <div className="bg-blue-50/50 rounded-lg p-4 space-y-3">
                          <h4 className="text-[12px] font-semibold text-blue-700 uppercase tracking-wide">Mid-Year Review</h4>
                          {isMidYear ? (
                            <div>
                              <label className="block text-[12px] font-medium text-slate-500 mb-1">My Comment</label>
                              <textarea
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none bg-white"
                                rows={2}
                                placeholder="Enter your mid-year comment..."
                                value={obj.midYearEmployeeComment}
                                onChange={(e) => updateObjective(obj.id, "midYearEmployeeComment", e.target.value)}
                              />
                            </div>
                          ) : (
                            obj.midYearEmployeeComment && (
                              <div>
                                <span className="text-[12px] font-medium text-slate-500">My Comment:</span>
                                <p className="text-[13px] text-slate-600 mt-0.5">{obj.midYearEmployeeComment}</p>
                              </div>
                            )
                          )}
                          {obj.midYearManagerComment && (
                            <div>
                              <span className="text-[12px] font-medium text-slate-500">Manager Comment:</span>
                              <p className="text-[13px] text-slate-600 mt-0.5">{obj.midYearManagerComment}</p>
                            </div>
                          )}
                          {obj.midYearManagerRating > 0 && (
                            <div>
                              <span className="text-[12px] font-medium text-slate-500">Manager Rating:</span>
                              <div className="mt-0.5"><StarRating rating={obj.midYearManagerRating} /></div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* End-Year Section */}
                      {(isEndYear || isCompleted) && (
                        <div className="bg-purple-50/50 rounded-lg p-4 space-y-3">
                          <h4 className="text-[12px] font-semibold text-purple-700 uppercase tracking-wide">End-of-Year Review</h4>
                          {isEndYear ? (
                            <div>
                              <label className="block text-[12px] font-medium text-slate-500 mb-1">My Comment</label>
                              <textarea
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none bg-white"
                                rows={2}
                                placeholder="Enter your end-of-year comment..."
                                value={obj.endYearEmployeeComment}
                                onChange={(e) => updateObjective(obj.id, "endYearEmployeeComment", e.target.value)}
                              />
                            </div>
                          ) : (
                            obj.endYearEmployeeComment && (
                              <div>
                                <span className="text-[12px] font-medium text-slate-500">My Comment:</span>
                                <p className="text-[13px] text-slate-600 mt-0.5">{obj.endYearEmployeeComment}</p>
                              </div>
                            )
                          )}
                          {obj.endYearManagerComment && (
                            <div>
                              <span className="text-[12px] font-medium text-slate-500">Manager Comment:</span>
                              <p className="text-[13px] text-slate-600 mt-0.5">{obj.endYearManagerComment}</p>
                            </div>
                          )}
                          {obj.endYearManagerRating > 0 && (
                            <div>
                              <span className="text-[12px] font-medium text-slate-500">Manager Rating:</span>
                              <div className="mt-0.5"><StarRating rating={obj.endYearManagerRating} /></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Behavioral Assessment — Collapsible, always visible */}
        {(() => {
          const behKey = "detail-behavioral";
          const isBehOpen = !!expandedDetail[behKey];
          return (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedDetail((prev) => ({ ...prev, [behKey]: !prev[behKey] }))}
                className="w-full flex items-center gap-3 px-5 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <ChevronRight size={16} className={`text-slate-400 transition-transform ${isBehOpen ? "rotate-90" : ""}`} />
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Lightbulb size={18} className="text-indigo-600" />
                </div>
                <h3 className="text-[14px] font-semibold text-slate-700">Behavioral Assessment</h3>
                <span className="ml-auto text-[12px] text-slate-400">5 behaviors</span>
              </button>

              {isBehOpen && (
                <div className="divide-y divide-slate-100 border-t border-slate-100">
                  {sc.behaviors.map((b) => {
                    const contribution = Math.round(((b.rating / 5) * b.weight) * 100) / 100;
                    return (
                      <div key={b.id} className="px-5 py-3 pl-14">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-slate-800">{b.label}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{b.expectation || "—"}</p>
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-[11px] text-slate-400">{b.weight}%</span>
                            {b.rating > 0 && (
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} size={14} className={i < b.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                                ))}
                              </div>
                            )}
                            {b.rating > 0 && (
                              <span className="text-[12px] text-slate-700 font-medium w-10 text-right">{contribution}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* Employee Final Comment */}
        {(isMidYear || isEndYear) && (
          <div className="border border-slate-200 rounded-xl p-5">
            <h3 className="text-[14px] font-semibold text-slate-700 mb-3">Employee Final Comment</h3>
            <textarea
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              rows={3}
              placeholder="Enter your overall comment for this review period..."
              value={sc.employeeFinalComment}
              onChange={(e) => setDraft({ ...sc, employeeFinalComment: e.target.value })}
            />
          </div>
        )}

        {/* Completed: Final Comments Read-Only */}
        {isCompleted && (
          <div className="border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="text-[14px] font-semibold text-slate-700">Final Comments</h3>
            {sc.employeeFinalComment && (
              <div>
                <span className="text-[12px] font-medium text-slate-500">Employee Comment:</span>
                <p className="text-[13px] text-slate-600 mt-0.5">{sc.employeeFinalComment}</p>
              </div>
            )}
            {sc.managerFinalComment && (
              <div>
                <span className="text-[12px] font-medium text-slate-500">Manager Comment:</span>
                <p className="text-[13px] text-slate-600 mt-0.5">{sc.managerFinalComment}</p>
              </div>
            )}
          </div>
        )}

        {/* Manager Final Comment (read-only, shown during mid/end if available) */}
        {(isMidYear || isEndYear) && sc.managerFinalComment && (
          <div className="border border-slate-200 rounded-xl p-5">
            <h3 className="text-[14px] font-semibold text-slate-700 mb-2">Manager Final Comment</h3>
            <p className="text-[13px] text-slate-600">{sc.managerFinalComment}</p>
          </div>
        )}

        {/* Rating Scale Legend */}
        {isCompleted && (
          <div className="border border-slate-200 rounded-xl p-5">
            <h3 className="text-[14px] font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Award size={16} className="text-slate-500" />
              Rating Scale
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {SCORE_DESCRIPTORS.map((sd) => (
                <div key={sd.rating} className={`rounded-lg px-3 py-2 ${sd.color}`}>
                  <div className="text-[13px] font-semibold">Rating {sd.rating}</div>
                  <div className="text-[12px]">{sd.label}</div>
                  <div className="text-[12px] mt-0.5 opacity-75">
                    {sd.min}% - {sd.max}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Score Descriptors */}
        {isCompleted && (
          <div className="border border-slate-200 rounded-xl p-5">
            <h3 className="text-[14px] font-semibold text-slate-700 mb-3">Manager Rating Descriptors</h3>
            <div className="grid grid-cols-6 gap-2">
              {Object.entries(MANAGER_RATING_DESCRIPTORS).map(([score, desc]) => (
                <div key={score} className="bg-slate-50 rounded-lg px-3 py-2 text-center">
                  <div className="text-[14px] font-bold text-slate-700">{score}</div>
                  <div className="text-[11px] text-slate-500">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback
  return null;
}
