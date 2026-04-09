import { useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  Edit2,
  Eye,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Star,
  TrendingUp,
  Users,
  Lightbulb,
  Target,
  Brain,
  Calendar,
  Clock,
  Lock,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type ScoringPeriod = "mid-year" | "end-year";

interface ObjectiveReview {
  employeeComments: string;
  managerComments: string;
  managerRating: number; // 0=unrated, 1–5
}

interface ScorecardObjective {
  id: string;
  label: string;
  target: string;
  weight: number;
  midYear: ObjectiveReview;
  endYear: ObjectiveReview;
}

interface BehaviorItem {
  id: string;
  label: string;
  rating: number;
  weight: 5;
}

interface PeriodScores {
  objectives: ScorecardObjective[];
  behaviors: BehaviorItem[];
  employeeComment: string;
  managerComment: string;
  score: number | null;
}

interface PerformanceRecord {
  id: string;
  employeeName: string;
  department: string;
  role: string;
  lineManager: string;
  reviewPeriod: string;
  status: "Draft" | "In Progress" | "Submitted" | "Approved" | "Rejected";
  midYear: PeriodScores;
  endYear: PeriodScores;
  midYearScore: number | null;
  endYearScore: number | null;
  overallScore: number | null;
}

interface FormData {
  staffName: string;
  lineManager: string;
  date: string;
  department: string;
  role: string;
  reviewPeriod: string;
  objectives: ScorecardObjective[];
  behaviors: BehaviorItem[];
  employeeComment: string;
  managerComment: string;
  finalComments: string;
}

// ── Constants ──────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  "All Departments",
  "Human Resources",
  "Finance",
  "Project Management",
  "Procurement",
  "Legal",
  "Monitoring & Evaluation",
];

const YEARS = ["2026", "2025", "2024", "2023"];

const STAFF_NAMES = [
  "Ama Darko", "Kwame Asante", "Naomi Ansah", "Beatrice Osei",
  "Richard Antwi", "Priscilla Tetteh", "Yaw Osei",
];

const LINE_MANAGERS = [
  "Kofi Mensah", "Abena Owusu", "Nana Yaw", "Mercy Adjei", "Ama Darko",
];

const DEPT_OPTIONS = [
  "Human Resources", "Finance", "Project Management", "Procurement",
  "Legal", "Monitoring & Evaluation",
];

const ROLES = [
  "HR Manager", "HR Officer", "Finance Officer", "Accountant",
  "Project Coordinator", "Procurement Officer", "Legal Counsel",
];

const STATUS_TABS = ["All", "Draft", "In Progress", "Submitted", "Approved", "Rejected"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

const RATING_SCALE = [
  { range: "0 – 49", label: "Unsatisfactory", badgeColor: "border-red-200 text-red-700 bg-red-50" },
  { range: "50 – 59", label: "Needs Improvement", badgeColor: "border-orange-200 text-orange-700 bg-orange-50" },
  { range: "60 – 74", label: "Meets Expectations", badgeColor: "border-blue-200 text-blue-700 bg-blue-50" },
  { range: "75 – 89", label: "Exceeds Expectations", badgeColor: "border-teal-200 text-teal-700 bg-teal-50" },
  { range: "90 – 100", label: "Outstanding", badgeColor: "border-green-200 text-green-700 bg-green-50" },
];

// Determine active period. For demo, force mid-year.
const DEMO_MODE = true;
function getActivePeriod(): ScoringPeriod {
  if (DEMO_MODE) return "mid-year";
  const month = new Date().getMonth(); // 0-indexed
  return month < 6 ? "mid-year" : "end-year";
}

// ── Perspective config ─────────────────────────────────────────────────────

const PERSPECTIVE_CONFIG = [
  {
    key: "strategy",
    label: "Strategy Delivery",
    icon: <Target className="w-4 h-4" />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    prefix: "sd",
  },
  {
    key: "internal",
    label: "Internal Perspective",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "text-purple-600",
    bg: "bg-purple-50",
    prefix: "ip",
  },
  {
    key: "stakeholder",
    label: "Stakeholder Perspective",
    icon: <Users className="w-4 h-4" />,
    color: "text-teal-600",
    bg: "bg-teal-50",
    prefix: "sp",
  },
  {
    key: "learning",
    label: "Learning & Development",
    icon: <Brain className="w-4 h-4" />,
    color: "text-amber-600",
    bg: "bg-amber-50",
    prefix: "ld",
  },
];

// ── Default data ───────────────────────────────────────────────────────────

const emptyReview = (): ObjectiveReview => ({
  employeeComments: "",
  managerComments: "",
  managerRating: 0,
});

function makeDefaultObjectives(): ScorecardObjective[] {
  const objectives: ScorecardObjective[] = [];
  const labels: Record<string, string[]> = {
    sd: ["Talent management framework", "Rollout HR ERP system", "Manpower resource plan"],
    ip: ["Automate performance management system", "Recruitment process automation", "Mitigating circumstances for HR risk register"],
    sp: ["Embedding 5C culture", "Monthly staff 1-2-1 meetings", "Stakeholder engagement plan"],
    ld: ["Design and implement HR dashboard", "Staff capacity building programme", "Knowledge management system"],
  };
  const weights: Record<string, number[]> = {
    sd: [10, 10, 8],
    ip: [10, 10, 7],
    sp: [7, 5, 3],
    ld: [3, 1, 1],
  };
  for (const cfg of PERSPECTIVE_CONFIG) {
    for (let i = 0; i < 3; i++) {
      objectives.push({
        id: `${cfg.prefix}${i + 1}`,
        label: labels[cfg.prefix]?.[i] || "",
        target: "",
        weight: weights[cfg.prefix]?.[i] || 5,
        midYear: emptyReview(),
        endYear: emptyReview(),
      });
    }
  }
  return objectives;
}

const defaultBehaviors: BehaviorItem[] = [
  { id: "b1", label: "Pioneering", rating: 0, weight: 5 },
  { id: "b2", label: "Respect", rating: 0, weight: 5 },
  { id: "b3", label: "Integrity", rating: 0, weight: 5 },
  { id: "b4", label: "Collaboration", rating: 0, weight: 5 },
  { id: "b5", label: "Excellence", rating: 0, weight: 5 },
];

function makeEmptyPeriod(): PeriodScores {
  return {
    objectives: makeDefaultObjectives(),
    behaviors: defaultBehaviors.map((b) => ({ ...b })),
    employeeComment: "",
    managerComment: "",
    score: null,
  };
}

function makeScoredPeriod(score: number): PeriodScores {
  const factor = score / 100;
  const objs = makeDefaultObjectives().map((o) => ({
    ...o,
    midYear: { ...o.midYear, managerRating: Math.min(5, Math.max(1, Math.round(factor * 5))), employeeComments: "Objectives met for this period.", managerComments: "Good progress observed." },
    endYear: { ...o.endYear, managerRating: Math.min(5, Math.max(1, Math.round(factor * 5))), employeeComments: "Year-end targets achieved.", managerComments: "Solid performance." },
  }));
  return {
    objectives: objs,
    behaviors: defaultBehaviors.map((b) => ({
      ...b,
      rating: Math.min(5, Math.max(1, Math.round(factor * 5))),
    })),
    employeeComment: "Performance review completed for this period.",
    managerComment: "Manager assessment completed.",
    score,
  };
}

function emptyForm(): FormData {
  return {
    staffName: "",
    lineManager: "",
    date: "",
    department: "",
    role: "",
    reviewPeriod: "",
    objectives: makeDefaultObjectives(),
    behaviors: defaultBehaviors.map((b) => ({ ...b })),
    employeeComment: "",
    managerComment: "",
    finalComments: "",
  };
}

function calcFinalScore(obj: ScorecardObjective): number {
  const midR = obj.midYear.managerRating;
  const endR = obj.endYear.managerRating;
  if (midR > 0 && endR > 0) {
    return ((midR + endR) / 2 / 5) * obj.weight;
  }
  if (midR > 0) return (midR / 5) * obj.weight;
  if (endR > 0) return (endR / 5) * obj.weight;
  return 0;
}

function calcOverallFromForm(objectives: ScorecardObjective[], behaviors: BehaviorItem[]): number {
  const objScore = objectives.reduce((sum, o) => sum + calcFinalScore(o), 0);
  const behScore = behaviors.reduce((sum, b) => sum + (b.rating / 5) * b.weight, 0);
  return Math.round(objScore + behScore);
}

function getRatingLabel(score: number | null): { label: string; color: string; bg: string } {
  if (score === null) return { label: "N/A", color: "text-slate-500", bg: "bg-slate-100" };
  if (score < 50) return { label: "Unsatisfactory", color: "text-red-700", bg: "bg-red-50" };
  if (score < 60) return { label: "Needs Improvement", color: "text-orange-700", bg: "bg-orange-50" };
  if (score < 75) return { label: "Meets Expectations", color: "text-blue-700", bg: "bg-blue-50" };
  if (score < 90) return { label: "Exceeds Expectations", color: "text-teal-700", bg: "bg-teal-50" };
  return { label: "Outstanding", color: "text-green-700", bg: "bg-green-50" };
}

function getStatusStyle(status: PerformanceRecord["status"]): string {
  switch (status) {
    case "Approved": return "bg-green-50 text-green-700";
    case "Submitted": return "bg-blue-50 text-blue-700";
    case "In Progress": return "bg-amber-50 text-amber-700";
    case "Draft": return "bg-slate-100 text-slate-600";
    case "Rejected": return "bg-red-50 text-red-700";
  }
}

// ── Mock data ──────────────────────────────────────────────────────────────

const MOCK_RECORDS: PerformanceRecord[] = [
  { id: "PR-001", employeeName: "Ama Darko", department: "Human Resources", role: "HR Manager", lineManager: "Kofi Mensah", reviewPeriod: "Jan – Dec 2025", status: "Approved", midYear: makeScoredPeriod(82), endYear: makeScoredPeriod(86), midYearScore: 82, endYearScore: 86, overallScore: 84 },
  { id: "PR-002", employeeName: "Kwame Asante", department: "Finance", role: "Finance Officer", lineManager: "Abena Owusu", reviewPeriod: "Jan – Dec 2025", status: "Submitted", midYear: makeScoredPeriod(68), endYear: makeScoredPeriod(72), midYearScore: 68, endYearScore: 72, overallScore: 70 },
  { id: "PR-003", employeeName: "Naomi Ansah", department: "Project Management", role: "Project Coordinator", lineManager: "Kofi Mensah", reviewPeriod: "Jan – Dec 2025", status: "In Progress", midYear: makeScoredPeriod(65), endYear: makeEmptyPeriod(), midYearScore: 65, endYearScore: null, overallScore: null },
  { id: "PR-004", employeeName: "Beatrice Osei", department: "Procurement", role: "Procurement Officer", lineManager: "Nana Yaw", reviewPeriod: "Jan – Dec 2025", status: "Draft", midYear: makeEmptyPeriod(), endYear: makeEmptyPeriod(), midYearScore: null, endYearScore: null, overallScore: null },
  { id: "PR-005", employeeName: "Richard Antwi", department: "Legal", role: "Legal Counsel", lineManager: "Mercy Adjei", reviewPeriod: "Jan – Dec 2025", status: "Approved", midYear: makeScoredPeriod(90), endYear: makeScoredPeriod(95), midYearScore: 90, endYearScore: 95, overallScore: 92 },
  { id: "PR-006", employeeName: "Priscilla Tetteh", department: "Human Resources", role: "HR Officer", lineManager: "Ama Darko", reviewPeriod: "Jan – Dec 2025", status: "Approved", midYear: makeScoredPeriod(93), endYear: makeScoredPeriod(96), midYearScore: 93, endYearScore: 96, overallScore: 94 },
  { id: "PR-007", employeeName: "Yaw Osei", department: "Finance", role: "Accountant", lineManager: "Abena Owusu", reviewPeriod: "Jan – Dec 2025", status: "Rejected", midYear: makeScoredPeriod(45), endYear: makeScoredPeriod(48), midYearScore: 45, endYearScore: 48, overallScore: 46 },
];

// ── Rating Stars (1–5) ────────────────────────────────────────────────────

function RatingStars({
  value,
  onChange,
  disabled = false,
  size = "md",
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const cls = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => !disabled && onChange(v)}
          className={`focus:outline-none ${disabled ? "cursor-default opacity-50" : "cursor-pointer"}`}
          title={disabled ? "Locked" : `Rate ${v}`}
          disabled={disabled}
        >
          <Star
            className={`${cls} transition-colors ${
              v <= value ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"
            }`}
          />
        </button>
      ))}
      <span className={`ml-1 text-slate-500 min-w-[24px] ${size === "sm" ? "text-[10px]" : "text-[12px]"}`}>
        {value}/5
      </span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export function PerformanceManagementScreen() {
  const activePeriod = getActivePeriod();

  const [view, setView] = useState<"list" | "form" | "detail">("list");
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [activeFormTab, setActiveFormTab] = useState(1);
  const [formData, setFormData] = useState<FormData>(emptyForm());
  const [records, setRecords] = useState<PerformanceRecord[]>(MOCK_RECORDS);
  const [detailRecord, setDetailRecord] = useState<PerformanceRecord | null>(null);
  const [detailTab, setDetailTab] = useState<"summary" | "mid-year" | "end-year">("summary");

  const [yearFilter, setYearFilter] = useState("2025");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState<StatusTab>("All");
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);

  const filteredRecords = records.filter((r) => {
    const matchSearch =
      !searchQuery ||
      r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = deptFilter === "All Departments" || r.department === deptFilter;
    const matchStatus = statusTab === "All" || r.status === statusTab;
    return matchSearch && matchDept && matchStatus;
  });

  const totalObjectiveWeight = formData.objectives.reduce((s, o) => s + o.weight, 0);
  const currentScore = calcOverallFromForm(formData.objectives, formData.behaviors);

  // ── Handlers ──

  const handleOpenAdd = () => {
    setFormData(emptyForm());
    setFormMode("add");
    setActiveFormTab(1);
    setView("form");
  };

  const handleOpenEdit = (rec: PerformanceRecord) => {
    const periodData = rec.midYear; // use midYear data as base since objectives carry both periods
    setFormData({
      staffName: rec.employeeName,
      lineManager: rec.lineManager,
      date: "",
      department: rec.department,
      role: rec.role,
      reviewPeriod: rec.reviewPeriod,
      objectives: periodData.objectives.map((o) => ({ ...o, midYear: { ...o.midYear }, endYear: { ...o.endYear } })),
      behaviors: periodData.behaviors.map((b) => ({ ...b })),
      employeeComment: periodData.employeeComment,
      managerComment: periodData.managerComment,
      finalComments: "",
    });
    setFormMode("edit");
    setActiveFormTab(1);
    setView("form");
  };

  const handleOpenDetail = (rec: PerformanceRecord) => {
    setDetailRecord(rec);
    setDetailTab("summary");
    setView("detail");
  };

  const handleSaveForm = () => {
    const score = currentScore > 0 ? currentScore : null;
    const periodScores: PeriodScores = {
      objectives: formData.objectives.map((o) => ({ ...o, midYear: { ...o.midYear }, endYear: { ...o.endYear } })),
      behaviors: formData.behaviors.map((b) => ({ ...b })),
      employeeComment: formData.employeeComment,
      managerComment: formData.managerComment,
      score,
    };

    if (formMode === "edit") {
      setRecords((prev) =>
        prev.map((r) => {
          if (r.employeeName !== formData.staffName) return r;
          const updated = { ...r };
          // Store objectives (which carry both mid/end year reviews) in both periods
          updated.midYear = { ...periodScores };
          updated.endYear = { ...periodScores };
          if (activePeriod === "mid-year") {
            updated.midYearScore = score;
          } else {
            updated.endYearScore = score;
          }
          if (updated.midYearScore !== null && updated.endYearScore !== null) {
            updated.overallScore = Math.round((updated.midYearScore + updated.endYearScore) / 2);
          } else {
            updated.overallScore = updated.midYearScore ?? updated.endYearScore;
          }
          return updated;
        })
      );
    } else {
      const newRecord: PerformanceRecord = {
        id: `PR-${String(records.length + 1).padStart(3, "0")}`,
        employeeName: formData.staffName || "New Employee",
        department: formData.department || "Unassigned",
        role: formData.role || "—",
        lineManager: formData.lineManager || "—",
        reviewPeriod: formData.reviewPeriod || `Jan – Dec ${yearFilter}`,
        status: "Draft",
        midYear: periodScores,
        endYear: { ...periodScores },
        midYearScore: activePeriod === "mid-year" ? score : null,
        endYearScore: activePeriod === "end-year" ? score : null,
        overallScore: score,
      };
      setRecords((prev) => [newRecord, ...prev]);
    }
    setView("list");
  };

  const updateObjectiveField = (id: string, field: "label" | "target", value: string) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.map((o) => (o.id === id ? { ...o, [field]: value } : o)),
    }));
  };

  const updateObjectiveWeight = (id: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.map((o) => (o.id === id ? { ...o, weight: value } : o)),
    }));
  };

  const updateObjectiveReview = (
    id: string,
    period: ScoringPeriod,
    field: keyof ObjectiveReview,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.map((o) => {
        if (o.id !== id) return o;
        const periodKey = period === "mid-year" ? "midYear" : "endYear";
        return { ...o, [periodKey]: { ...o[periodKey], [field]: value } };
      }),
    }));
  };

  const updateBehavior = (id: string, rating: number) => {
    setFormData((prev) => ({
      ...prev,
      behaviors: prev.behaviors.map((b) => (b.id === id ? { ...b, rating } : b)),
    }));
  };

  // ── Period lock helper ──
  const isMidYearActive = activePeriod === "mid-year";
  const isEndYearActive = activePeriod === "end-year";

  // ════════════════════════════════════════════════════════════════════════
  // ── DETAIL VIEW
  // ════════════════════════════════════════════════════════════════════════

  if (view === "detail" && detailRecord) {
    const rating = getRatingLabel(detailRecord.overallScore);

    const renderPeriodBreakdown = (period: PeriodScores, periodLabel: string) => {
      if (period.score === null) {
        return (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Clock className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-[14px] text-slate-500">{periodLabel} review has not been completed yet</p>
            <p className="text-[12px] text-slate-400 mt-1">Scores will appear here once the review is submitted</p>
          </div>
        );
      }

      const periodRating = getRatingLabel(period.score);

      return (
        <div className="space-y-5 py-1">
          <div className="flex items-center gap-5">
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "linear-gradient(135deg, #0B01D0, #4f46e5)" }}
              >
                <span className="text-[20px] text-white">{period.score}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{periodLabel}</p>
            </div>
            <div>
              <span className={`inline-block px-3 py-1 rounded-lg text-[13px] ${periodRating.bg} ${periodRating.color}`}>
                {periodRating.label}
              </span>
              <p className="text-[12px] text-slate-500 mt-1.5">Scored {period.score}/100</p>
            </div>
          </div>

          {PERSPECTIVE_CONFIG.map((group) => {
            const objs = period.objectives.filter((o) => o.id.startsWith(group.prefix));
            const contribution = objs.reduce((s, o) => s + calcFinalScore(o), 0);
            const maxContribution = objs.reduce((s, o) => s + o.weight, 0);
            return (
              <div key={group.key} className="flex items-center gap-5">
                <span className={`${group.color} w-56 text-[12px] shrink-0 flex items-center gap-1.5 whitespace-nowrap`}>
                  {group.icon} {group.label}
                </span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: maxContribution ? `${(contribution / maxContribution) * 100}%` : "0%",
                      backgroundColor: "#0B01D0",
                      opacity: 0.7,
                    }}
                  />
                </div>
                <span className="text-[12px] text-slate-600 w-32 text-right shrink-0 whitespace-nowrap">
                  {contribution.toFixed(1)} / {maxContribution}
                </span>
              </div>
            );
          })}

          <div className="flex items-center gap-5">
            <span className="text-indigo-600 w-56 text-[12px] shrink-0 flex items-center gap-1.5 whitespace-nowrap">
              <Lightbulb className="w-4 h-4" /> Behavioral
            </span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{ width: `${(period.behaviors.reduce((s, b) => s + (b.rating / 5) * 5, 0) / 25) * 100}%` }}
              />
            </div>
            <span className="text-[12px] text-slate-600 w-32 text-right shrink-0 whitespace-nowrap">
              {period.behaviors.reduce((s, b) => s + (b.rating / 5) * 5, 0).toFixed(1)} / 25
            </span>
          </div>

          {(period.employeeComment || period.managerComment) && (
            <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-slate-400 mb-1">Employee Comments</p>
                <p className="text-[13px] text-slate-700">{period.employeeComment || "—"}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 mb-1">Manager Comments</p>
                <p className="text-[13px] text-slate-700">{period.managerComment || "—"}</p>
              </div>
            </div>
          )}
        </div>
      );
    };

    const DETAIL_TABS = [
      { id: "summary" as const, label: "Summary" },
      { id: "mid-year" as const, label: "Mid-Year Review" },
      { id: "end-year" as const, label: "End-of-Year Review" },
    ];

    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-3">
          <button onClick={() => setView("list")} className="flex items-center gap-1 text-[13px] text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="text-[14px] text-slate-800">Performance Review — {detailRecord.employeeName}</span>
        </div>

        <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
            {DETAIL_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDetailTab(tab.id)}
                className={`px-5 py-1.5 rounded-lg text-[13px] transition-colors ${
                  detailTab === tab.id ? "bg-[#0B01D0] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {detailTab === "summary" && (
              <>
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-[16px] text-slate-900">{detailRecord.employeeName}</h2>
                      <p className="text-[13px] text-slate-500 mt-0.5">{detailRecord.role} · {detailRecord.department}</p>
                      <p className="text-[12px] text-slate-400 mt-1">Line Manager: {detailRecord.lineManager} &nbsp;|&nbsp; Period: {detailRecord.reviewPeriod}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[12px] ${getStatusStyle(detailRecord.status)}`}>{detailRecord.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Mid-Year Score", score: detailRecord.midYearScore, icon: <Calendar className="w-4 h-4 text-blue-500" />, border: false },
                    { label: "End-of-Year Score", score: detailRecord.endYearScore, icon: <Calendar className="w-4 h-4 text-purple-500" />, border: false },
                    { label: "Overall Score", score: detailRecord.overallScore, icon: <Target className="w-4 h-4" style={{ color: "#0B01D0" }} />, border: true },
                  ].map((card) => {
                    const r = getRatingLabel(card.score);
                    return (
                      <div key={card.label} className={`bg-white rounded-xl p-5 text-center ${card.border ? "border-2" : "border border-slate-200"}`} style={card.border ? { borderColor: "#0B01D0" } : undefined}>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          {card.icon}
                          <p className="text-[11px] text-slate-500">{card.label}</p>
                        </div>
                        <p className="text-[28px] text-slate-900">{card.score ?? "—"}</p>
                        {card.score !== null && (
                          <span className={`inline-block mt-2 px-2.5 py-0.5 rounded text-[11px] ${r.bg} ${r.color}`}>{r.label}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="text-[13px] text-slate-700 mb-4">Performance Rating Scale</h3>
                  <div className="flex gap-2">
                    {RATING_SCALE.map((item) => {
                      const isActive = detailRecord.overallScore !== null && getRatingLabel(detailRecord.overallScore).label === item.label;
                      return (
                        <div key={item.label} className={`flex-1 border rounded-lg p-3 text-center transition-all ${item.badgeColor} ${isActive ? "ring-2 ring-offset-1 ring-current" : "opacity-50"}`}>
                          <p className="text-[10px] mb-0.5">{item.range}</p>
                          <p className="text-[11px]">{item.label}</p>
                          {isActive && <CheckCircle2 className="w-3.5 h-3.5 mx-auto mt-1" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => handleOpenEdit(detailRecord)} className="px-4 py-2 text-[13px] rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-2">
                    <Edit2 className="w-4 h-4" /> Edit Review
                  </button>
                  {(detailRecord.status === "Draft" || detailRecord.status === "In Progress") && (
                    <button className="px-4 py-2 text-[13px] rounded-lg text-white transition-colors flex items-center gap-2" style={{ backgroundColor: "#0B01D0" }}>
                      <CheckCircle2 className="w-4 h-4" /> Submit for Approval
                    </button>
                  )}
                </div>
              </>
            )}

            {detailTab === "mid-year" && (
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-[14px] text-slate-800 mb-5 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" /> Mid-Year Review
                </h3>
                {renderPeriodBreakdown(detailRecord.midYear, "Mid-Year")}
              </div>
            )}

            {detailTab === "end-year" && (
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-[14px] text-slate-800 mb-5 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" /> End-of-Year Review
                </h3>
                {renderPeriodBreakdown(detailRecord.endYear, "End-of-Year")}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // ── FORM VIEW
  // ════════════════════════════════════════════════════════════════════════

  if (view === "form") {
    const FORM_TABS = [
      { id: 1, label: "Employee Info" },
      { id: 2, label: "Balanced Scorecard (75%)" },
      { id: 3, label: "Behavioral Assessment (25%)" },
      { id: 4, label: "Summary & Submit" },
    ];

    const weightRemaining = 75 - totalObjectiveWeight;
    const weightOk = totalObjectiveWeight === 75;

    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setView("list")} className="flex items-center gap-1 text-[13px] text-slate-500 hover:text-slate-800 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-[14px] text-slate-800">
              {formMode === "add" ? "Add New Performance Score" : "Edit Performance Score"}
            </span>
            {/* Locked period badge */}
            <span className={`ml-2 px-3 py-1 rounded-full text-[12px] flex items-center gap-1.5 ${
              isMidYearActive ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-purple-50 text-purple-700 border border-purple-200"
            }`}>
              <Lock className="w-3 h-3" />
              {isMidYearActive ? "Mid-Year Review" : "End-of-Year Review"}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView("list")} className="px-4 py-2 text-[13px] border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleSaveForm} className="px-4 py-2 text-[13px] rounded-lg text-white transition-colors" style={{ backgroundColor: "#0B01D0" }}>
              Save Record
            </button>
          </div>
        </div>

        {/* Form Tabs */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
            {FORM_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFormTab(tab.id)}
                className={`px-5 py-1.5 rounded-lg text-[13px] transition-colors ${
                  activeFormTab === tab.id ? "bg-[#0B01D0] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {/* ── Tab 1: Employee Info ── */}
          {activeFormTab === 1 && (
            <div className="max-w-2xl mx-auto space-y-5">
              {/* Period display (locked) */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-[14px] text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: "#0B01D0" }} />
                  Active Scoring Period
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {(["mid-year", "end-year"] as ScoringPeriod[]).map((p) => {
                    const isMid = p === "mid-year";
                    const isActive = activePeriod === p;
                    const isLocked = !isActive;
                    return (
                      <div
                        key={p}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                          isActive
                            ? isMid ? "border-blue-400 bg-blue-50" : "border-purple-400 bg-purple-50"
                            : "border-slate-200 bg-slate-50 opacity-60"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          isActive ? (isMid ? "bg-blue-100" : "bg-purple-100") : "bg-slate-200"
                        }`}>
                          {isLocked ? (
                            <Lock className="w-5 h-5 text-slate-400" />
                          ) : (
                            <Calendar className={`w-5 h-5 ${isMid ? "text-blue-600" : "text-purple-600"}`} />
                          )}
                        </div>
                        <div>
                          <p className={`text-[13px] ${isActive ? "text-slate-900" : "text-slate-500"}`}>
                            {isMid ? "Mid-Year Review" : "End-of-Year Review"}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {isLocked
                              ? isMid ? "Available Jan – Jun" : "Available Jul – Dec"
                              : isMid ? "Jan – Jun (Active)" : "Jul – Dec (Active)"}
                          </p>
                        </div>
                        {isActive && (
                          <CheckCircle2 className={`w-5 h-5 ml-auto shrink-0 ${isMid ? "text-blue-500" : "text-purple-500"}`} />
                        )}
                        {isLocked && (
                          <Lock className="w-4 h-4 ml-auto shrink-0 text-slate-400" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-[14px] text-slate-800 border-b border-slate-100 pb-3 mb-4">Employee Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Staff Name */}
                  <div>
                    <label className="block text-[12px] text-slate-500 mb-1">Staff Name</label>
                    <select
                      value={formData.staffName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, staffName: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select staff</option>
                      {STAFF_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  {/* Line Manager */}
                  <div>
                    <label className="block text-[12px] text-slate-500 mb-1">Line Manager</label>
                    <select
                      value={formData.lineManager}
                      onChange={(e) => setFormData((prev) => ({ ...prev, lineManager: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select manager</option>
                      {LINE_MANAGERS.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  {/* Date */}
                  <div>
                    <label className="block text-[12px] text-slate-500 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                      placeholder="DD / MM / YYYY"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Department */}
                  <div>
                    <label className="block text-[12px] text-slate-500 mb-1">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select department</option>
                      {DEPT_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  {/* Role / Job Title */}
                  <div>
                    <label className="block text-[12px] text-slate-500 mb-1">Role / Job Title</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select role</option>
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  {/* Review Period */}
                  <div>
                    <label className="block text-[12px] text-slate-500 mb-1">Review Period</label>
                    <input
                      type="text"
                      value={formData.reviewPeriod}
                      onChange={(e) => setFormData((prev) => ({ ...prev, reviewPeriod: e.target.value }))}
                      placeholder="e.g. Jan – Dec 2025"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={() => setActiveFormTab(2)} className="px-5 py-2 text-[13px] rounded-lg text-white transition-colors flex items-center gap-2" style={{ backgroundColor: "#0B01D0" }}>
                  Next: Balanced Scorecard <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── Tab 2: Balanced Scorecard ── */}
          {activeFormTab === 2 && (
            <div className="max-w-full mx-auto space-y-4">
              {/* Period indicator */}
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] ${
                isMidYearActive ? "bg-blue-50 border border-blue-200 text-blue-700" : "bg-purple-50 border border-purple-200 text-purple-700"
              }`}>
                <Calendar className="w-4 h-4" />
                Active period: <strong>{isMidYearActive ? "Mid-Year Review" : "End-of-Year Review"}</strong>
              </div>

              {/* Weight tracker */}
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-[13px] ${
                weightOk ? "bg-green-50 border-green-200 text-green-700"
                  : weightRemaining < 0 ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-amber-50 border-amber-200 text-amber-700"
              }`}>
                {weightOk ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>
                  Objective weighting: <strong>{totalObjectiveWeight}% / 75%</strong>
                  {!weightOk && weightRemaining > 0 && ` — ${weightRemaining}% remaining`}
                  {!weightOk && weightRemaining < 0 && ` — ${Math.abs(weightRemaining)}% over`}
                  {weightOk && " — Target reached"}
                </span>
                <div className="ml-auto flex-shrink-0 w-32 h-2 bg-white/60 rounded-full overflow-hidden border border-current/20">
                  <div className={`h-full rounded-full transition-all ${weightOk ? "bg-green-500" : weightRemaining < 0 ? "bg-red-500" : "bg-amber-400"}`} style={{ width: `${Math.min((totalObjectiveWeight / 75) * 100, 100)}%` }} />
                </div>
              </div>

              {/* Perspective groups */}
              {PERSPECTIVE_CONFIG.map((group) => {
                const groupObjs = formData.objectives.filter((o) => o.id.startsWith(group.prefix));
                const groupSubtotal = groupObjs.reduce((s, o) => s + calcFinalScore(o), 0);

                const activePeriodLabel = isMidYearActive ? "Mid-Year Review" : "End-of-Year Review";
                const activePeriodColor = isMidYearActive ? "text-blue-600" : "text-purple-600";

                return (
                  <div key={group.key} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    {/* Group header */}
                    <div className={`px-4 py-3 flex items-center gap-2 border-b border-slate-100 ${group.bg}`}>
                      <span className={group.color}>{group.icon}</span>
                      <span className={`text-[13px] ${group.color}`}>{group.label}</span>
                      <span className="ml-auto text-[12px] text-slate-500">
                        Subtotal: <strong>{groupSubtotal.toFixed(2)}</strong>
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="text-left px-3 py-2 text-[11px] text-slate-500" rowSpan={2} style={{ width: "22%" }}>Objective</th>
                            <th className="text-left px-3 py-2 text-[11px] text-slate-500" rowSpan={2} style={{ width: "18%" }}>Target</th>
                            <th className="text-center px-3 py-2 text-[11px] text-slate-500" rowSpan={2} style={{ width: "7%" }}>Weight&nbsp;%</th>
                            <th className={`text-center px-2 py-1.5 text-[11px] border-b border-slate-200 ${activePeriodColor}`} colSpan={3} style={{ width: "38%" }}>
                              {activePeriodLabel}
                            </th>
                            <th className="text-center px-3 py-2 text-[11px] text-slate-500" rowSpan={2} style={{ width: "8%" }}>Final Score</th>
                          </tr>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className={`text-center px-2 py-1.5 text-[10px] ${activePeriodColor}`}>Emp. Comments</th>
                            <th className={`text-center px-2 py-1.5 text-[10px] ${activePeriodColor}`}>Mgr. Comments</th>
                            <th className={`text-center px-2 py-1.5 text-[10px] ${activePeriodColor}`}>Mgr. Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupObjs.map((obj, idx) => {
                            const finalScore = calcFinalScore(obj);
                            const periodKey = isMidYearActive ? "midYear" as const : "endYear" as const;
                            const periodData = obj[periodKey];
                            const updatePeriod: ScoringPeriod = isMidYearActive ? "mid-year" : "end-year";
                            return (
                              <tr key={obj.id} className={`border-b border-slate-50 ${idx % 2 !== 0 ? "bg-slate-50/40" : ""}`}>
                                {/* Objective */}
                                <td className="px-3 py-2">
                                  <textarea
                                    rows={3}
                                    value={obj.label}
                                    onChange={(e) => updateObjectiveField(obj.id, "label", e.target.value)}
                                    placeholder="Enter objective..."
                                    className="w-full border border-slate-200 rounded px-2.5 py-2 text-[12px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                  />
                                </td>
                                {/* Target */}
                                <td className="px-3 py-2">
                                  <textarea
                                    rows={3}
                                    value={obj.target}
                                    onChange={(e) => updateObjectiveField(obj.id, "target", e.target.value)}
                                    placeholder="Enter target..."
                                    className="w-full border border-slate-200 rounded px-2.5 py-2 text-[12px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                  />
                                </td>
                                {/* Weight */}
                                <td className="px-3 py-2">
                                  <div className="flex items-center justify-center gap-0.5">
                                    <input
                                      type="number"
                                      min={0}
                                      max={75}
                                      value={obj.weight}
                                      onChange={(e) => updateObjectiveWeight(obj.id, Number(e.target.value))}
                                      className="w-12 text-center border border-slate-200 rounded px-1 py-1.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <span className="text-[10px] text-slate-400">%</span>
                                  </div>
                                </td>
                                {/* Active Period: Employee Comments */}
                                <td className="px-2 py-2">
                                  <textarea
                                    rows={3}
                                    value={periodData.employeeComments}
                                    onChange={(e) => updateObjectiveReview(obj.id, updatePeriod, "employeeComments", e.target.value)}
                                    placeholder="Comments..."
                                    className="w-full border border-slate-200 rounded px-2 py-1.5 text-[11px] text-slate-800 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                </td>
                                {/* Active Period: Manager Comments */}
                                <td className="px-2 py-2">
                                  <textarea
                                    rows={3}
                                    value={periodData.managerComments}
                                    onChange={(e) => updateObjectiveReview(obj.id, updatePeriod, "managerComments", e.target.value)}
                                    placeholder="Comments..."
                                    className="w-full border border-slate-200 rounded px-2 py-1.5 text-[11px] text-slate-800 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                </td>
                                {/* Active Period: Manager Rating */}
                                <td className="px-2 py-2">
                                  <div className="flex justify-center">
                                    <RatingStars
                                      value={periodData.managerRating}
                                      onChange={(v) => updateObjectiveReview(obj.id, updatePeriod, "managerRating", v)}
                                      size="sm"
                                    />
                                  </div>
                                </td>
                                {/* Final Score */}
                                <td className="px-3 py-2 text-center">
                                  <span className="inline-block px-2 py-1 bg-slate-100 rounded text-[12px] text-slate-700 tabular-nums">
                                    {finalScore.toFixed(2)}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                          {/* Subtotal row */}
                          <tr className={`${group.bg} border-t border-slate-200`}>
                            <td className="px-3 py-2 text-[12px] text-slate-600" colSpan={2}>
                              <span className={group.color}>Subtotal — {group.label}</span>
                            </td>
                            <td className="px-3 py-2 text-center text-[12px] text-slate-600">
                              {groupObjs.reduce((s, o) => s + o.weight, 0)}%
                            </td>
                            <td colSpan={3} />
                            <td className="px-3 py-2 text-center">
                              <span className={`inline-block px-2 py-1 rounded text-[12px] tabular-nums ${group.bg} ${group.color}`}>
                                {groupSubtotal.toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-between pt-2">
                <button onClick={() => setActiveFormTab(1)} className="px-5 py-2 text-[13px] rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setActiveFormTab(3)} className="px-5 py-2 text-[13px] rounded-lg text-white transition-colors flex items-center gap-2" style={{ backgroundColor: "#0B01D0" }}>
                  Next: Behavioral Assessment <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── Tab 3: Behavioral Assessment ── */}
          {activeFormTab === 3 && (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] ${
                isMidYearActive ? "bg-blue-50 border border-blue-200 text-blue-700" : "bg-purple-50 border border-purple-200 text-purple-700"
              }`}>
                <Lock className="w-4 h-4" />
                Active period: <strong>{isMidYearActive ? "Mid-Year Review" : "End-of-Year Review"}</strong>
              </div>

              <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-indigo-50 border border-indigo-200 text-[13px] text-indigo-700">
                <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  Each of the 5 core behaviors is fixed at <strong>5% weighting</strong>, totalling 25% of the scorecard.
                  Rate each behavior from 1 (Lowest) to 5 (Highest).
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-4 py-3 text-[11px] text-slate-500 w-1/3">Core Behavior</th>
                      <th className="text-center px-4 py-3 text-[11px] text-slate-500">Rating (1–5)</th>
                      <th className="text-center px-4 py-3 text-[11px] text-slate-500">Weight</th>
                      <th className="text-right px-4 py-3 text-[11px] text-slate-500">Contribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.behaviors.map((b, idx) => (
                      <tr key={b.id} className={`border-b border-slate-100 ${idx % 2 !== 0 ? "bg-slate-50/40" : ""}`}>
                        <td className="px-4 py-3">
                          <p className="text-[13px] text-slate-800">{b.label}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <RatingStars value={b.rating} onChange={(v) => updateBehavior(b.id, v)} />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[12px]">5%</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-[13px] text-slate-700">{((b.rating / 5) * 5).toFixed(1)}</span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-indigo-50 border-t border-indigo-100">
                      <td className="px-4 py-2 text-[12px] text-indigo-700">Behavioral Total</td>
                      <td />
                      <td className="text-center px-4 py-2 text-[12px] text-indigo-700">25%</td>
                      <td className="text-right px-4 py-2 text-[12px] text-indigo-700">
                        {formData.behaviors.reduce((s, b) => s + (b.rating / 5) * 5, 0).toFixed(1)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <h3 className="text-[14px] text-slate-800 border-b border-slate-100 pb-3">
                  {isMidYearActive ? "Mid-Year" : "End-of-Year"} Comments
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] text-slate-500 mb-1">Employee Comments</label>
                    <textarea
                      rows={4}
                      value={formData.employeeComment}
                      onChange={(e) => setFormData((p) => ({ ...p, employeeComment: e.target.value }))}
                      placeholder="Self-assessment for this period..."
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-slate-500 mb-1">Line Manager Comments</label>
                    <textarea
                      rows={4}
                      value={formData.managerComment}
                      onChange={(e) => setFormData((p) => ({ ...p, managerComment: e.target.value }))}
                      placeholder="Manager's feedback for this period..."
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button onClick={() => setActiveFormTab(2)} className="px-5 py-2 text-[13px] rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setActiveFormTab(4)} className="px-5 py-2 text-[13px] rounded-lg text-white transition-colors flex items-center gap-2" style={{ backgroundColor: "#0B01D0" }}>
                  Next: Summary <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── Tab 4: Final Summary ── */}
          {activeFormTab === 4 && (
            <div className="max-w-5xl mx-auto space-y-4">
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] ${
                isMidYearActive ? "bg-blue-50 border border-blue-200 text-blue-700" : "bg-purple-50 border border-purple-200 text-purple-700"
              }`}>
                <Lock className="w-4 h-4" />
                Scoring for: <strong>{isMidYearActive ? "Mid-Year Review" : "End-of-Year Review"}</strong>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-[14px] text-slate-800 mb-5 border-b border-slate-100 pb-3">Score Breakdown</h3>
                <div className="space-y-4">
                  {PERSPECTIVE_CONFIG.map((group) => {
                    const objs = formData.objectives.filter((o) => o.id.startsWith(group.prefix));
                    const contribution = objs.reduce((s, o) => s + calcFinalScore(o), 0);
                    const maxContribution = objs.reduce((s, o) => s + o.weight, 0);
                    return (
                      <div key={group.key} className="flex items-center gap-5">
                        <span className={`${group.color} w-56 text-[12px] shrink-0 flex items-center gap-1.5 whitespace-nowrap`}>
                          {group.icon} {group.label}
                        </span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: maxContribution ? `${(contribution / maxContribution) * 100}%` : "0%", backgroundColor: "#0B01D0", opacity: 0.7 }} />
                        </div>
                        <span className="text-[12px] text-slate-600 w-32 text-right shrink-0 whitespace-nowrap">{contribution.toFixed(2)} / {maxContribution}</span>
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-5">
                    <span className="text-indigo-600 w-56 text-[12px] shrink-0 flex items-center gap-1.5 whitespace-nowrap">
                      <Lightbulb className="w-4 h-4" /> Behavioral
                    </span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${(formData.behaviors.reduce((s, b) => s + (b.rating / 5) * 5, 0) / 25) * 100}%` }} />
                    </div>
                    <span className="text-[12px] text-slate-600 w-32 text-right shrink-0 whitespace-nowrap">
                      {formData.behaviors.reduce((s, b) => s + (b.rating / 5) * 5, 0).toFixed(1)} / 25
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-4 flex items-center gap-5">
                    <span className="text-slate-800 w-56 text-[13px] shrink-0 whitespace-nowrap">Overall Score</span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${currentScore}%`, backgroundColor: "#0B01D0" }} />
                    </div>
                    <span className="text-[14px] text-slate-900 w-32 text-right shrink-0 whitespace-nowrap">{currentScore} / 100</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-[14px] text-slate-800 mb-4 border-b border-slate-100 pb-3">Final Rating</h3>
                <div className="flex gap-2">
                  {RATING_SCALE.map((item) => {
                    const isActive = getRatingLabel(currentScore).label === item.label;
                    return (
                      <div key={item.label} className={`flex-1 border-2 rounded-xl p-3 text-center transition-all ${item.badgeColor} ${isActive ? "ring-2 ring-offset-1 ring-current shadow-md scale-[1.03]" : "opacity-50"}`}>
                        <p className="text-[10px] mb-0.5">{item.range}</p>
                        <p className="text-[11px]">{item.label}</p>
                        {isActive && <CheckCircle2 className="w-3.5 h-3.5 mx-auto mt-1" />}
                      </div>
                    );
                  })}
                </div>

                {currentScore > 0 && (
                  <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #0B01D0, #4f46e5)" }}>
                      <span className="text-[14px] text-white">{currentScore}</span>
                    </div>
                    <div>
                      <p className="text-[13px] text-slate-800">
                        {formData.staffName || "Employee"} scores <strong>{currentScore}/100</strong> for {isMidYearActive ? "Mid-Year" : "End-of-Year"} Review
                      </p>
                      <p className={`text-[12px] ${getRatingLabel(currentScore).color}`}>{getRatingLabel(currentScore).label}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-[14px] text-slate-800 mb-3 border-b border-slate-100 pb-3">Additional Comments</h3>
                <textarea
                  rows={4}
                  value={formData.finalComments}
                  onChange={(e) => setFormData((p) => ({ ...p, finalComments: e.target.value }))}
                  placeholder="Overall review summary, development plan, or additional notes..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-between pt-2">
                <button onClick={() => setActiveFormTab(3)} className="px-5 py-2 text-[13px] rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={handleSaveForm} className="px-5 py-2 text-[13px] rounded-lg text-white transition-colors flex items-center gap-2" style={{ backgroundColor: "#0B01D0" }}>
                  <CheckCircle2 className="w-4 h-4" /> Save Record
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // ── LIST VIEW
  // ════════════════════════════════════════════════════════════════════════

  const statusCounts = STATUS_TABS.reduce<Record<StatusTab, number>>((acc, s) => {
    acc[s] = s === "All" ? records.length : records.filter((r) => r.status === s).length;
    return acc;
  }, {} as Record<StatusTab, number>);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <h1 className="text-[20px] text-slate-900">Performance Management</h1>
        <button onClick={handleOpenAdd} className="px-4 py-2 rounded-lg text-[13px] text-white flex items-center gap-2 transition-colors hover:opacity-90" style={{ backgroundColor: "#0B01D0" }}>
          <Plus className="w-4 h-4" /> Add New Score
        </button>
      </div>

      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search employee, department, role..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="relative">
          <button onClick={() => { setShowYearDropdown((p) => !p); setShowDeptDropdown(false); }} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 hover:bg-slate-50 bg-white transition-colors min-w-[100px] justify-between">
            <span>{yearFilter}</span><ChevronDown className="w-4 h-4" />
          </button>
          {showYearDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 min-w-[120px]">
              {YEARS.map((y) => (
                <button key={y} onClick={() => { setYearFilter(y); setShowYearDropdown(false); }} className={`w-full text-left px-4 py-2 text-[13px] hover:bg-slate-50 ${y === yearFilter ? "text-blue-600" : "text-slate-700"}`}>{y}</button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => { setShowDeptDropdown((p) => !p); setShowYearDropdown(false); }} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 hover:bg-slate-50 bg-white transition-colors min-w-[180px] justify-between">
            <span>{deptFilter}</span><ChevronDown className="w-4 h-4" />
          </button>
          {showDeptDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 min-w-[200px]">
              {DEPARTMENTS.map((d) => (
                <button key={d} onClick={() => { setDeptFilter(d); setShowDeptDropdown(false); }} className={`w-full text-left px-4 py-2 text-[13px] hover:bg-slate-50 ${d === deptFilter ? "text-blue-600" : "text-slate-700"}`}>{d}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          {STATUS_TABS.map((tab) => (
            <button key={tab} onClick={() => setStatusTab(tab)} className={`px-4 py-1.5 rounded-lg text-[13px] transition-colors flex items-center gap-1.5 ${statusTab === tab ? "bg-[#0B01D0] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {tab}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${statusTab === tab ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"}`}>{statusCounts[tab]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Employee Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Department</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Role</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Line Manager</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Period</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Mid-Year</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">End-Year</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Overall</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Rating</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 text-slate-300" />
                    <p className="text-[13px] text-slate-500">No records found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec, idx) => {
                const recRating = getRatingLabel(rec.overallScore);
                return (
                  <tr key={rec.id} className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`} onClick={() => handleOpenDetail(rec)}>
                    <td className="px-4 py-3"><p className="text-[13px] text-slate-900">{rec.employeeName}</p></td>
                    <td className="px-4 py-3"><p className="text-[13px] text-slate-600">{rec.department}</p></td>
                    <td className="px-4 py-3"><p className="text-[13px] text-slate-600">{rec.role}</p></td>
                    <td className="px-4 py-3"><p className="text-[13px] text-slate-600">{rec.lineManager}</p></td>
                    <td className="px-4 py-3"><p className="text-[13px] text-slate-600">{rec.reviewPeriod}</p></td>
                    <td className="px-4 py-3 text-center"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[12px] ${getStatusStyle(rec.status)}`}>{rec.status}</span></td>
                    <td className="px-4 py-3 text-center">{rec.midYearScore !== null ? <span className="text-[13px] text-slate-900">{rec.midYearScore}</span> : <span className="text-[12px] text-slate-400">—</span>}</td>
                    <td className="px-4 py-3 text-center">{rec.endYearScore !== null ? <span className="text-[13px] text-slate-900">{rec.endYearScore}</span> : <span className="text-[12px] text-slate-400">—</span>}</td>
                    <td className="px-4 py-3 text-center">{rec.overallScore !== null ? <span className="text-[13px] text-slate-900">{rec.overallScore}</span> : <span className="text-[12px] text-slate-400">—</span>}</td>
                    <td className="px-4 py-3 text-center">{rec.overallScore !== null ? <span className={`inline-block px-2 py-0.5 rounded text-[11px] ${recRating.bg} ${recRating.color}`}>{recRating.label}</span> : <span className="text-[12px] text-slate-400">—</span>}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenEdit(rec)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleOpenDetail(rec)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-2 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
        <p className="text-[12px] text-slate-500">Showing <strong>{filteredRecords.length}</strong> of <strong>{records.length}</strong> records</p>
        <p className="text-[12px] text-slate-400">Year: {yearFilter}</p>
      </div>
    </div>
  );
}
