import { useState } from "react";
import {
  Search, Download, Upload, ChevronDown, Eye, Edit, Trash2, MoreHorizontal, Plus,
  ExternalLink, ArrowLeft, Target, Calendar, Users, FileText, Link, CheckCircle,
  X, Paperclip, AlertTriangle, MapPin, Megaphone, Globe
} from "lucide-react";
import { cn } from "../lib/utils";

interface AdvocacyActivity {
  id: string;
  activityItem: string;
  type: "Lobbying Meeting" | "Public Event" | "Policy Brief" | "Op-Ed" | "Workshop" | "Conference" | "Media Engagement";
  date: string;
  targetAudience: string;
  outcomeImpact: string;
  assetLink: string;
  issueArea: string;
  outcomeAchieved: "Yes" | "No" | "Pending";
  description?: string;
  location?: string;
  leadPerson?: string;
  partners?: string;
  keyMessages?: string;
  followUpActions?: string;
  files?: { name: string; size: string }[];
}

const ACTIVITY_TYPES = ["Lobbying Meeting", "Public Event", "Policy Brief", "Op-Ed", "Workshop", "Conference", "Media Engagement"] as const;
const ISSUE_AREAS = ["Digital Economy", "Youth Employment", "Trade Policy", "Climate Finance", "Gender Equality", "Agriculture", "Infrastructure", "Health Systems", "SME Development", "Governance", "Education", "Energy"] as const;
const TYPE_COLORS: Record<string, string> = {
  "Lobbying Meeting": "bg-blue-50 text-blue-700 border border-blue-200",
  "Public Event": "bg-purple-50 text-purple-700 border border-purple-200",
  "Policy Brief": "bg-indigo-50 text-indigo-700 border border-indigo-200",
  "Op-Ed": "bg-amber-50 text-amber-700 border border-amber-200",
  "Workshop": "bg-teal-50 text-teal-700 border border-teal-200",
  "Conference": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Media Engagement": "bg-rose-50 text-rose-700 border border-rose-200",
};

const INITIAL_ACTIVITIES: AdvocacyActivity[] = [
  { id: "ADV-001", activityItem: "Parliamentary Brief on Digital Economy", type: "Policy Brief", date: "2024-11-15", targetAudience: "Ministry of Finance, Parliament Committee", outcomeImpact: "Policy change: Digital tax framework adopted", assetLink: "https://example.com/policy-brief-001.pdf", issueArea: "Digital Economy", outcomeAchieved: "Yes", description: "Comprehensive policy brief analyzing the digital economy landscape and recommending tax reforms.", location: "Accra, Ghana", leadPerson: "James Owusu", partners: "World Bank, Ministry of Finance", keyMessages: "Digital tax reform needed for inclusive growth", followUpActions: "Monitor implementation of adopted framework" },
  { id: "ADV-002", activityItem: "Youth Employment Stakeholder Meeting", type: "Lobbying Meeting", date: "2024-10-28", targetAudience: "Ministry of Youth & Sports, World Bank", outcomeImpact: "Commitment to pilot program in 3 regions", assetLink: "https://example.com/meeting-notes-002.pdf", issueArea: "Youth Employment", outcomeAchieved: "Yes", location: "Accra, Ghana", leadPerson: "Grace Tetteh" },
  { id: "ADV-003", activityItem: "AfCFTA Op-Ed in Business Weekly", type: "Op-Ed", date: "2024-11-20", targetAudience: "Private Sector, Policy Makers", outcomeImpact: "Cited in 5 media outlets, 15K+ reach", assetLink: "https://example.com/op-ed-003.pdf", issueArea: "Trade Policy", outcomeAchieved: "Yes", leadPerson: "James Owusu" },
  { id: "ADV-004", activityItem: "Climate Finance Public Forum", type: "Public Event", date: "2024-12-05", targetAudience: "Civil Society, Development Partners", outcomeImpact: "200+ attendees, 3 partnership leads", assetLink: "https://example.com/event-report-004.pdf", issueArea: "Climate Finance", outcomeAchieved: "Yes", location: "Nairobi, Kenya", leadPerson: "Ama Darko" },
  { id: "ADV-005", activityItem: "Gender Equality Policy Brief", type: "Policy Brief", date: "2024-09-12", targetAudience: "Ministry of Gender & Social Protection", outcomeImpact: "Recommendations incorporated into national strategy", assetLink: "https://example.com/policy-brief-005.pdf", issueArea: "Gender Equality", outcomeAchieved: "Yes", leadPerson: "Ama Darko" },
  { id: "ADV-006", activityItem: "Agricultural Policy Roundtable", type: "Lobbying Meeting", date: "2024-11-30", targetAudience: "Ministry of Agriculture, FAO", outcomeImpact: "Pending: Follow-up meeting scheduled", assetLink: "https://example.com/roundtable-006.pdf", issueArea: "Agriculture", outcomeAchieved: "Pending", location: "Addis Ababa, Ethiopia", leadPerson: "Grace Tetteh" },
  { id: "ADV-007", activityItem: "Digital Skills Op-Ed", type: "Op-Ed", date: "2024-10-15", targetAudience: "Education Sector, Tech Industry", outcomeImpact: "Shared by 8 industry leaders", assetLink: "https://example.com/op-ed-007.pdf", issueArea: "Digital Economy", outcomeAchieved: "Yes", leadPerson: "James Owusu" },
  { id: "ADV-008", activityItem: "Infrastructure Financing Workshop", type: "Public Event", date: "2024-08-22", targetAudience: "Development Banks, Infrastructure Ministries", outcomeImpact: "No direct policy uptake", assetLink: "https://example.com/workshop-008.pdf", issueArea: "Infrastructure", outcomeAchieved: "No", location: "Abuja, Nigeria", leadPerson: "Grace Tetteh" },
  { id: "ADV-009", activityItem: "Health Systems Brief", type: "Policy Brief", date: "2024-11-08", targetAudience: "Ministry of Health, WHO", outcomeImpact: "Under review by technical committee", assetLink: "https://example.com/policy-brief-009.pdf", issueArea: "Health Systems", outcomeAchieved: "Pending", leadPerson: "Ama Darko" },
  { id: "ADV-010", activityItem: "SME Growth Policy Dialogue", type: "Lobbying Meeting", date: "2024-10-05", targetAudience: "Ministry of Trade & Industry", outcomeImpact: "SME support fund increased by 20%", assetLink: "https://example.com/dialogue-010.pdf", issueArea: "SME Development", outcomeAchieved: "Yes", location: "Accra, Ghana", leadPerson: "James Owusu" },
];

export function AdvocacyImpactHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");
  const [issueAreaFilter, setIssueAreaFilter] = useState("all");
  const [outcomeFilter, setOutcomeFilter] = useState("all");
  const [showActivityTypeDropdown, setShowActivityTypeDropdown] = useState(false);
  const [showIssueAreaDropdown, setShowIssueAreaDropdown] = useState(false);
  const [showOutcomeDropdown, setShowOutcomeDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activities, setActivities] = useState<AdvocacyActivity[]>(INITIAL_ACTIVITIES);
  const itemsPerPage = 8;

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = searchQuery === "" ||
      activity.activityItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activityTypeFilter === "all" || activity.type === activityTypeFilter;
    const matchesIssue = issueAreaFilter === "all" || activity.issueArea === issueAreaFilter;
    const matchesOutcome = outcomeFilter === "all" || activity.outcomeAchieved === outcomeFilter;
    return matchesSearch && matchesType && matchesIssue && matchesOutcome;
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "Yes": return "bg-green-100 text-green-700";
      case "No": return "bg-red-100 text-red-700";
      case "Pending": return "bg-amber-100 text-amber-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const handleExport = () => {
    const csvContent = [
      ["Activity ID", "Activity/Item", "Type", "Date", "Target Audience", "Outcome/Impact", "Asset Link", "Issue Area", "Outcome Achieved"],
      ...filteredActivities.map(act => [act.id, act.activityItem, act.type, act.date, act.targetAudience, act.outcomeImpact, act.assetLink, act.issueArea, act.outcomeAchieved])
    ].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "advocacy_impact_hub.csv";
    a.click();
  };

  const handleAddActivity = (activity: Omit<AdvocacyActivity, "id">) => {
    const nextId = `ADV-${String(activities.length + 1).padStart(3, "0")}`;
    setActivities(prev => [...prev, { ...activity, id: nextId } as AdvocacyActivity]);
    setShowAddForm(false);
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     ADD NEW ACTIVITY SCREEN
     ═══════════════════════════════════════════════════════════════════════════ */
  if (showAddForm) {
    return <AddNewActivityForm onSave={handleAddActivity} onCancel={() => setShowAddForm(false)} />;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     LIST VIEW
     ═══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Advocacy & Impact Hub</h1>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors shadow-sm">
          <Plus size={16} />
          <span className="text-sm font-medium">Add New Activity</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
            <Search size={20} className="text-slate-400" />
            <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400" />
          </div>
          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <Upload size={16} className="text-slate-600" /><span className="text-sm text-slate-900">Upload CSV</span>
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">Export</span><Download size={16} className="text-slate-600" />
            </button>
            {/* Activity Type Filter */}
            <div className="relative">
              <button onClick={() => { setShowActivityTypeDropdown(!showActivityTypeDropdown); setShowIssueAreaDropdown(false); setShowOutcomeDropdown(false); }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[160px]">
                <span className="text-sm text-slate-900 truncate">{activityTypeFilter === "all" ? "All Activity Types" : activityTypeFilter}</span>
                <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
              </button>
              {showActivityTypeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowActivityTypeDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {["all", ...ACTIVITY_TYPES].map((type) => (
                      <button key={type} onClick={() => { setActivityTypeFilter(type); setShowActivityTypeDropdown(false); }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors text-slate-700">{type === "all" ? "All Activity Types" : type}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Issue Area Filter */}
            <div className="relative">
              <button onClick={() => { setShowIssueAreaDropdown(!showIssueAreaDropdown); setShowActivityTypeDropdown(false); setShowOutcomeDropdown(false); }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[160px]">
                <span className="text-sm text-slate-900 truncate">{issueAreaFilter === "all" ? "All Issue Areas" : issueAreaFilter}</span>
                <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
              </button>
              {showIssueAreaDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowIssueAreaDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden max-h-[300px] overflow-y-auto">
                    {["all", ...ISSUE_AREAS].map((area) => (
                      <button key={area} onClick={() => { setIssueAreaFilter(area); setShowIssueAreaDropdown(false); }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors text-slate-700">{area === "all" ? "All Issue Areas" : area}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Outcome Filter */}
            <div className="relative">
              <button onClick={() => { setShowOutcomeDropdown(!showOutcomeDropdown); setShowActivityTypeDropdown(false); setShowIssueAreaDropdown(false); }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[140px]">
                <span className="text-sm text-slate-900 truncate">{outcomeFilter === "all" ? "All Outcomes" : outcomeFilter}</span>
                <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
              </button>
              {showOutcomeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowOutcomeDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {["all", "Yes", "No", "Pending"].map((outcome) => (
                      <button key={outcome} onClick={() => { setOutcomeFilter(outcome); setShowOutcomeDropdown(false); }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors text-slate-700">{outcome === "all" ? "All Outcomes" : outcome}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              {["Activity ID", "Activity/Item", "Type", "Date", "Target Audience", "Outcome/Impact", "Asset Link", "Outcome Achieved", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedActivities.length > 0 ? paginatedActivities.map((activity, idx) => (
              <tr key={activity.id} className={cn("hover:bg-slate-50 transition-colors", idx % 2 === 1 && "bg-slate-50/50")}>
                <td className="px-4 py-3"><p className="text-[11px] text-slate-600">{activity.id}</p></td>
                <td className="px-4 py-3"><p className="text-[11px] text-slate-900 font-medium">{activity.activityItem}</p></td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", TYPE_COLORS[activity.type])}>{activity.type}</span></td>
                <td className="px-4 py-3"><p className="text-[11px] text-slate-600">{new Date(activity.date).toLocaleDateString()}</p></td>
                <td className="px-4 py-3"><p className="text-[11px] text-slate-600">{activity.targetAudience}</p></td>
                <td className="px-4 py-3"><p className="text-[11px] text-slate-700">{activity.outcomeImpact}</p></td>
                <td className="px-4 py-3">
                  <a href={activity.assetLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700">
                    <ExternalLink size={11} /><span>View</span>
                  </a>
                </td>
                <td className="px-4 py-3"><span className={cn("inline-block px-2 py-0.5 rounded-full text-[10px] font-medium", getOutcomeColor(activity.outcomeAchieved))}>{activity.outcomeAchieved}</span></td>
                <td className="px-4 py-3">
                  <div className="relative">
                    <button onClick={() => setShowActionDropdown(showActionDropdown === activity.id ? null : activity.id)} className="p-1.5 hover:bg-slate-100 rounded transition-colors">
                      <MoreHorizontal size={16} className="text-slate-600" />
                    </button>
                    {showActionDropdown === activity.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowActionDropdown(null)} />
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                          <button className="w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50">View</button>
                          <button className="w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50">Edit</button>
                          <button className="w-full px-4 py-2 text-left text-[12px] text-red-600 hover:bg-red-50">Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={9} className="px-4 py-12 text-center text-[13px] text-slate-400">No advocacy activities found matching your filters</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredActivities.length > 0 && (
        <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-slate-200 shrink-0">
          <span className="text-[11px] text-slate-400">{filteredActivities.length} activity(ies)</span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
                className="px-2.5 py-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 text-[11px] text-slate-600">Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={cn("px-2.5 py-1.5 text-[11px] rounded", p === currentPage ? "bg-[#0B01D0] text-white" : "text-slate-600 hover:bg-slate-50")}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 text-[11px] text-slate-600">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ADD NEW ACTIVITY FORM — Full-screen card-based layout
   ═══════════════════════════════════════════════════════════════════════════════ */

interface AddFormProps {
  onSave: (activity: Omit<AdvocacyActivity, "id">) => void;
  onCancel: () => void;
}

function AddNewActivityForm({ onSave, onCancel }: AddFormProps) {
  const [step, setStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [form, setForm] = useState({
    activityItem: "",
    type: "" as AdvocacyActivity["type"] | "",
    date: "",
    issueArea: "",
    location: "",
    leadPerson: "",
    description: "",
    targetAudience: "",
    partners: "",
    keyMessages: "",
    outcomeImpact: "",
    outcomeAchieved: "Pending" as AdvocacyActivity["outcomeAchieved"],
    followUpActions: "",
    assetLink: "",
    files: [] as { name: string; size: string }[],
  });

  const u = (field: string, val: string) => setForm(prev => ({ ...prev, [field]: val }));

  const completedFields = [
    form.activityItem, form.type, form.date, form.issueArea,
    form.targetAudience, form.outcomeImpact
  ].filter(Boolean).length;
  const totalRequired = 6;
  const completionPct = Math.round((completedFields / totalRequired) * 100);

  const canSave = form.activityItem && form.type && form.date && form.issueArea && form.targetAudience;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      activityItem: form.activityItem,
      type: form.type as AdvocacyActivity["type"],
      date: form.date,
      issueArea: form.issueArea,
      targetAudience: form.targetAudience,
      outcomeImpact: form.outcomeImpact || "Pending assessment",
      assetLink: form.assetLink || "#",
      outcomeAchieved: form.outcomeAchieved,
      description: form.description,
      location: form.location,
      leadPerson: form.leadPerson,
      partners: form.partners,
      keyMessages: form.keyMessages,
      followUpActions: form.followUpActions,
      files: form.files,
    });
  };

  const steps = [
    { num: 1, label: "Activity Details" },
    { num: 2, label: "Audience & Messaging" },
    { num: 3, label: "Outcomes & Follow-up" },
    { num: 4, label: "Documents & Links" },
  ];

  const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 transition-colors placeholder:text-slate-400";
  const labelCls = "block text-[11px] text-slate-500 font-medium mb-1.5";
  const requiredMark = <span className="text-red-500 ml-0.5">*</span>;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft size={18} /><span className="text-[13px] font-medium">Back</span>
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B01D0]/10 flex items-center justify-center">
                <Megaphone size={18} className="text-[#0B01D0]" />
              </div>
              <div>
                <h1 className="text-[18px] font-semibold text-slate-900">Add New Activity</h1>
                <p className="text-[11px] text-slate-400 mt-0.5">Create a new advocacy & impact activity</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Completion Tracker */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#0B01D0] rounded-full transition-all" style={{ width: `${completionPct}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 font-medium">{completionPct}%</span>
            </div>
            <button onClick={onCancel} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50 font-medium">Cancel</button>
            <button onClick={() => setShowConfirmModal(true)} disabled={!canSave}
              className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm">
              Review & Save
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <button key={s.num} onClick={() => setStep(s.num)}
                className="flex items-center gap-2 flex-1">
                <div className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors w-full",
                  step === s.num ? "border-[#0B01D0] bg-[#0B01D0]/5" :
                  step > s.num ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"
                )}>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0",
                    step === s.num ? "bg-[#0B01D0] text-white" :
                    step > s.num ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                  )}>
                    {step > s.num ? <CheckCircle size={12} /> : s.num}
                  </div>
                  <span className={cn("text-[11px] font-medium truncate",
                    step === s.num ? "text-[#0B01D0]" : step > s.num ? "text-emerald-700" : "text-slate-500"
                  )}>{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className="w-4 h-px bg-slate-200 shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">

          {/* Step 1: Activity Details */}
          {step === 1 && (
            <>
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-indigo-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center"><Target size={13} className="text-[#0B01D0]" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Activity Information</h2>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className={labelCls}>Activity Name / Title {requiredMark}</label>
                    <input type="text" value={form.activityItem} onChange={e => u("activityItem", e.target.value)}
                      placeholder="e.g. Parliamentary Brief on Digital Economy" className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Activity Type {requiredMark}</label>
                      <select value={form.type} onChange={e => u("type", e.target.value)} className={inputCls}>
                        <option value="">Select type...</option>
                        {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Issue Area {requiredMark}</label>
                      <select value={form.issueArea} onChange={e => u("issueArea", e.target.value)} className={inputCls}>
                        <option value="">Select issue area...</option>
                        {ISSUE_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Date {requiredMark}</label>
                      <input type="date" value={form.date} onChange={e => u("date", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Location</label>
                      <input type="text" value={form.location} onChange={e => u("location", e.target.value)}
                        placeholder="e.g. Accra, Ghana" className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Lead Person / Responsible Officer</label>
                    <input type="text" value={form.leadPerson} onChange={e => u("leadPerson", e.target.value)}
                      placeholder="e.g. James Owusu" className={inputCls} />
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-purple-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center"><FileText size={13} className="text-purple-600" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Description</h2>
                </div>
                <div className="p-5">
                  <textarea rows={4} value={form.description} onChange={e => u("description", e.target.value)}
                    placeholder="Provide a detailed description of the advocacy activity, its objectives, and context..."
                    className={cn(inputCls, "resize-none")} />
                </div>
              </section>
            </>
          )}

          {/* Step 2: Audience & Messaging */}
          {step === 2 && (
            <>
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center"><Users size={13} className="text-emerald-600" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Target Audience & Partners</h2>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className={labelCls}>Target Audience {requiredMark}</label>
                    <input type="text" value={form.targetAudience} onChange={e => u("targetAudience", e.target.value)}
                      placeholder="e.g. Ministry of Finance, Parliament Committee, World Bank" className={inputCls} />
                    <p className="text-[10px] text-slate-400 mt-1">Comma-separated list of target institutions or stakeholders</p>
                  </div>
                  <div>
                    <label className={labelCls}>Partners / Collaborators</label>
                    <input type="text" value={form.partners} onChange={e => u("partners", e.target.value)}
                      placeholder="e.g. UNDP, African Union, Local CSOs" className={inputCls} />
                    <p className="text-[10px] text-slate-400 mt-1">Organizations or individuals collaborating on this activity</p>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-amber-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center"><Megaphone size={13} className="text-amber-600" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Key Messages</h2>
                </div>
                <div className="p-5">
                  <textarea rows={4} value={form.keyMessages} onChange={e => u("keyMessages", e.target.value)}
                    placeholder="What are the core advocacy messages being communicated? What policy positions are being advanced?"
                    className={cn(inputCls, "resize-none")} />
                </div>
              </section>
            </>
          )}

          {/* Step 3: Outcomes & Follow-up */}
          {step === 3 && (
            <>
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center"><CheckCircle size={13} className="text-emerald-600" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Outcome & Impact</h2>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className={labelCls}>Outcome / Impact Description</label>
                    <textarea rows={3} value={form.outcomeImpact} onChange={e => u("outcomeImpact", e.target.value)}
                      placeholder="e.g. Policy change: Digital tax framework adopted; 200+ attendees at forum"
                      className={cn(inputCls, "resize-none")} />
                  </div>
                  <div>
                    <label className={labelCls}>Outcome Achieved</label>
                    <div className="flex items-center gap-3 mt-1">
                      {(["Pending", "Yes", "No"] as const).map(opt => (
                        <button key={opt} onClick={() => setForm(prev => ({ ...prev, outcomeAchieved: opt }))}
                          className={cn(
                            "flex-1 px-4 py-2.5 rounded-lg border text-[12px] font-medium transition-colors text-center",
                            form.outcomeAchieved === opt
                              ? opt === "Yes" ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : opt === "No" ? "border-red-400 bg-red-50 text-red-700"
                              : "border-amber-400 bg-amber-50 text-amber-700"
                              : "border-slate-200 text-slate-500 hover:border-slate-300"
                          )}>
                          {opt === "Pending" && "⏳ "}
                          {opt === "Yes" && "✓ "}
                          {opt === "No" && "✗ "}
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-blue-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center"><AlertTriangle size={13} className="text-blue-600" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Follow-up Actions</h2>
                </div>
                <div className="p-5">
                  <textarea rows={3} value={form.followUpActions} onChange={e => u("followUpActions", e.target.value)}
                    placeholder="What follow-up actions are needed? Schedule next meetings, track policy progress, etc."
                    className={cn(inputCls, "resize-none")} />
                </div>
              </section>
            </>
          )}

          {/* Step 4: Documents & Links */}
          {step === 4 && (
            <>
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-indigo-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center"><Globe size={13} className="text-[#0B01D0]" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Asset Link</h2>
                </div>
                <div className="p-5">
                  <label className={labelCls}>External Link / URL</label>
                  <input type="url" value={form.assetLink} onChange={e => u("assetLink", e.target.value)}
                    placeholder="https://example.com/document.pdf" className={inputCls} />
                  <p className="text-[10px] text-slate-400 mt-1">Link to the published document, media article, or event page</p>
                </div>
              </section>

              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-amber-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center"><Paperclip size={13} className="text-amber-600" /></div>
                    <h2 className="text-[13px] font-semibold text-slate-800">Supporting Documents</h2>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{form.files.length}</span>
                  </div>
                </div>
                <div className="p-5">
                  <label className="flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-[#0B01D0] hover:bg-[#0B01D0]/5 transition-colors">
                    <Upload size={24} className="text-slate-400" />
                    <p className="text-[12px] text-slate-500 font-medium">Click to upload files</p>
                    <p className="text-[10px] text-slate-400">PDF, DOCX, XLSX, PPTX up to 25MB</p>
                    <input type="file" multiple className="hidden" onChange={e => {
                      const files = Array.from(e.target.files || []);
                      setForm(prev => ({
                        ...prev,
                        files: [...prev.files, ...files.map(f => ({ name: f.name, size: `${(f.size / 1024).toFixed(0)} KB` }))]
                      }));
                    }} />
                  </label>
                  {form.files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {form.files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><FileText size={14} className="text-blue-500" /></div>
                            <div>
                              <p className="text-[11px] font-medium text-slate-800">{f.name}</p>
                              <p className="text-[10px] text-slate-400">{f.size}</p>
                            </div>
                          </div>
                          <button onClick={() => setForm(prev => ({ ...prev, files: prev.files.filter((_, j) => j !== i) }))}
                            className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
        <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
          className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50 disabled:opacity-40 font-medium">
          Previous
        </button>
        <div className="flex items-center gap-1.5">
          {steps.map(s => (
            <div key={s.num} className={cn("w-2 h-2 rounded-full transition-colors",
              step === s.num ? "bg-[#0B01D0]" : step > s.num ? "bg-emerald-400" : "bg-slate-200"
            )} />
          ))}
        </div>
        {step < 4 ? (
          <button onClick={() => setStep(step + 1)}
            className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] shadow-sm">
            Next
          </button>
        ) : (
          <button onClick={() => setShowConfirmModal(true)} disabled={!canSave}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[12px] font-semibold hover:bg-emerald-700 disabled:opacity-40 shadow-sm">
            Review & Save
          </button>
        )}
      </div>

      {/* ═══ REVIEW & SAVE CONFIRMATION MODAL ═══ */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><CheckCircle size={18} className="text-emerald-600" /></div>
                <div>
                  <h2 className="text-[16px] font-semibold text-slate-900">Review & Save Activity</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Confirm details before saving</p>
                </div>
              </div>
              <button onClick={() => setShowConfirmModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-3">
              {([
                ["Activity Name", form.activityItem],
                ["Type", form.type],
                ["Issue Area", form.issueArea],
                ["Date", form.date ? new Date(form.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"],
                ["Location", form.location || "—"],
                ["Lead Person", form.leadPerson || "—"],
                ["Target Audience", form.targetAudience],
                ["Partners", form.partners || "—"],
                ["Outcome", form.outcomeImpact || "Pending assessment"],
                ["Outcome Achieved", form.outcomeAchieved],
                ["Follow-up", form.followUpActions || "—"],
                ["Asset Link", form.assetLink || "—"],
                ["Files", form.files.length > 0 ? form.files.map(f => f.name).join(", ") : "None"],
              ] as [string, string][]).map(([l, v], i) => (
                <div key={i} className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-[11px] text-slate-500 font-medium shrink-0 w-[130px]">{l}</span>
                  <span className="text-[11px] text-slate-800 font-medium text-right max-w-[60%]">{v}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Edit</button>
              <button onClick={handleSave} className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] shadow-sm">Confirm & Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
