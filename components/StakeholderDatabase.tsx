import { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, MoreHorizontal, ArrowLeft, X,
  Users, Globe, Mail, Phone, MapPin, Star, Eye, Trash2,
  MessageSquare, CheckCircle
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  subscribe, getStakeholders, getEngagementsByStakeholder,
  addStakeholder, addEngagement, deleteStakeholder,
  type Stakeholder, type StakeholderEngagement,
} from "../lib/advocacyStore";

const STAKEHOLDER_TYPES: Stakeholder["type"][] = ["Policymaker", "Advisor", "Government Official", "Journalist", "CSO", "Influencer", "Development Partner"];
const INFLUENCE_LEVELS: Stakeholder["influenceLevel"][] = ["High", "Medium", "Low"];
const RELATIONSHIP_STRENGTHS: Stakeholder["relationshipStrength"][] = ["Strong", "Moderate", "Weak", "New"];
const ISSUE_AREAS = ["Digital Economy", "Youth Employment", "Trade Policy", "Climate Finance", "Gender Equality", "Agriculture", "Infrastructure", "Health Systems", "SME Development", "Governance", "Education", "Energy"];
const ENGAGEMENT_TYPES: StakeholderEngagement["type"][] = ["Meeting", "Correspondence", "Policy Brief Delivery", "Phone Call", "Follow-up", "Event"];

const TYPE_COLORS: Record<string, string> = {
  Policymaker: "bg-blue-50 text-blue-700 border border-blue-200",
  Advisor: "bg-purple-50 text-purple-700 border border-purple-200",
  "Government Official": "bg-indigo-50 text-indigo-700 border border-indigo-200",
  Journalist: "bg-amber-50 text-amber-700 border border-amber-200",
  CSO: "bg-teal-50 text-teal-700 border border-teal-200",
  Influencer: "bg-rose-50 text-rose-700 border border-rose-200",
  "Development Partner": "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const INFLUENCE_COLORS: Record<string, string> = {
  High: "bg-red-50 text-red-700 border border-red-200",
  Medium: "bg-amber-50 text-amber-700 border border-amber-200",
  Low: "bg-green-50 text-green-700 border border-green-200",
};

const STRENGTH_COLORS: Record<string, string> = {
  Strong: "bg-emerald-50 text-emerald-700",
  Moderate: "bg-blue-50 text-blue-700",
  Weak: "bg-amber-50 text-amber-700",
  New: "bg-slate-50 text-slate-700",
};

const ENG_TYPE_COLORS: Record<string, string> = {
  Meeting: "bg-blue-100 text-blue-700",
  Correspondence: "bg-purple-100 text-purple-700",
  "Policy Brief Delivery": "bg-indigo-100 text-indigo-700",
  "Phone Call": "bg-amber-100 text-amber-700",
  "Follow-up": "bg-teal-100 text-teal-700",
  Event: "bg-rose-100 text-rose-700",
};

export function StakeholderDatabase() {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick(t => t + 1)), []);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [influenceFilter, setInfluenceFilter] = useState("all");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showInfluenceDropdown, setShowInfluenceDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState<number | null>(null);
  const [selectedStakeholder, setSelectedStakeholder] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddEngagement, setShowAddEngagement] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const stakeholders = getStakeholders();

  const filtered = stakeholders.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.organization.toLowerCase().includes(q) || s.title.toLowerCase().includes(q);
    const matchesType = typeFilter === "all" || s.type === typeFilter;
    const matchesInfluence = influenceFilter === "all" || s.influenceLevel === influenceFilter;
    return matchesSearch && matchesType && matchesInfluence;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  /* ═══ ADD STAKEHOLDER FORM ═══ */
  if (showAddForm) {
    return <AddStakeholderForm onSave={(s) => { addStakeholder(s); setShowAddForm(false); }} onCancel={() => setShowAddForm(false)} />;
  }

  /* ═══ DETAIL VIEW ═══ */
  if (selectedStakeholder !== null) {
    const s = stakeholders.find(x => x.id === selectedStakeholder);
    if (!s) { setSelectedStakeholder(null); return null; }
    const sEngagements = getEngagementsByStakeholder(s.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return (
      <div className="h-full flex flex-col bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-4">
          <button onClick={() => setSelectedStakeholder(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900"><ArrowLeft size={18} /><span className="text-[13px] font-medium">Back</span></button>
          <div className="h-6 w-px bg-slate-200" />
          <h1 className="text-xl font-semibold text-slate-900">{s.name}</h1>
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", TYPE_COLORS[s.type])}>{s.type}</span>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="col-span-1 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#0B01D0]/10 flex items-center justify-center">
                    <Users size={20} className="text-[#0B01D0]" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-slate-900">{s.name}</h3>
                    <p className="text-[11px] text-slate-500">{s.title}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    [<Globe size={13} />, "Organization", s.organization],
                    [<MapPin size={13} />, "Country", s.country],
                    [<Mail size={13} />, "Email", s.email],
                    [<Phone size={13} />, "Phone", s.phone],
                  ].map(([icon, label, value], i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">{icon as React.ReactNode}</span>
                      <div>
                        <p className="text-[10px] text-slate-400">{label as string}</p>
                        <p className="text-[11px] text-slate-700">{value as string}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Influence Level</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", INFLUENCE_COLORS[s.influenceLevel])}>{s.influenceLevel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Relationship</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", STRENGTH_COLORS[s.relationshipStrength])}>{s.relationshipStrength}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 mb-1">Issue Areas</p>
                  <div className="flex flex-wrap gap-1">
                    {s.issueAreas.map(a => <span key={a} className="px-2 py-0.5 rounded-full text-[9px] bg-slate-100 text-slate-600">{a}</span>)}
                  </div>
                </div>
                {s.notes && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 mb-1">Notes</p>
                    <p className="text-[11px] text-slate-600">{s.notes}</p>
                  </div>
                )}
              </div>
            </div>
            {/* Engagement Timeline */}
            <div className="col-span-2">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-indigo-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-[#0B01D0]" />
                    <h3 className="text-[13px] font-semibold text-slate-800">Engagement History</h3>
                    <span className="text-[10px] bg-white px-1.5 py-0.5 rounded text-slate-500">{sEngagements.length}</span>
                  </div>
                  <button onClick={() => setShowAddEngagement(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]">
                    <Plus size={12} /> Add
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-[500px] overflow-auto">
                  {sEngagements.length > 0 ? sEngagements.map(eng => (
                    <div key={eng.id} className="px-5 py-3 hover:bg-slate-50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-medium", ENG_TYPE_COLORS[eng.type])}>{eng.type}</span>
                          <span className="text-[11px] font-medium text-slate-900">{eng.subject}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{new Date(eng.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{eng.summary}</p>
                      {eng.outcome && <p className="text-[10px] text-emerald-600 mt-1">Outcome: {eng.outcome}</p>}
                      {eng.nextStep && <p className="text-[10px] text-blue-600 mt-0.5">Next: {eng.nextStep}</p>}
                      <div className="flex items-center gap-1 mt-1.5">
                        <Users size={10} className="text-slate-400" />
                        <span className="text-[9px] text-slate-400">{eng.participants.join(", ")}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="px-5 py-8 text-center text-[12px] text-slate-400">No engagement records yet</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {showAddEngagement && (
          <AddEngagementModal
            stakeholderId={s.id}
            onSave={(e) => { addEngagement(e); setShowAddEngagement(false); }}
            onClose={() => setShowAddEngagement(false)}
          />
        )}
      </div>
    );
  }

  /* ═══ MAIN LIST VIEW ═══ */
  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-slate-900">Stakeholder Management</h1>
          <p className="text-[12px] text-slate-400 mt-0.5">Track and manage stakeholder profiles, engagement history, and influence levels</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] shadow-sm">
          <Plus size={16} /><span className="text-sm font-medium">Add Stakeholder</span>
        </button>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
            <Search size={20} className="text-slate-400" />
            <input type="text" placeholder="Search stakeholders..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <button onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowInfluenceDropdown(false); }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 shadow-sm min-w-[160px]">
                <span className="text-sm text-slate-900 truncate">{typeFilter === "all" ? "All Types" : typeFilter}</span>
                <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
              </button>
              {showTypeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowTypeDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {["all", ...STAKEHOLDER_TYPES].map(t => (
                      <button key={t} onClick={() => { setTypeFilter(t); setShowTypeDropdown(false); }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700">{t === "all" ? "All Types" : t}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <button onClick={() => { setShowInfluenceDropdown(!showInfluenceDropdown); setShowTypeDropdown(false); }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 shadow-sm min-w-[140px]">
                <span className="text-sm text-slate-900 truncate">{influenceFilter === "all" ? "All Influence" : influenceFilter}</span>
                <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
              </button>
              {showInfluenceDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowInfluenceDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {["all", ...INFLUENCE_LEVELS].map(l => (
                      <button key={l} onClick={() => { setInfluenceFilter(l); setShowInfluenceDropdown(false); }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700">{l === "all" ? "All Influence" : l}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              {["Name", "Organization", "Type", "Country", "Influence", "Relationship", "Issue Areas", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length > 0 ? paginated.map((s, idx) => (
              <tr key={s.id} className={cn("hover:bg-slate-50 transition-colors cursor-pointer", idx % 2 === 1 && "bg-slate-50/50")}
                onClick={() => setSelectedStakeholder(s.id)}>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-[11px] text-slate-900 font-medium">{s.name}</p>
                    <p className="text-[10px] text-slate-400">{s.title}</p>
                  </div>
                </td>
                <td className="px-4 py-3"><p className="text-[11px] text-slate-600">{s.organization}</p></td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", TYPE_COLORS[s.type])}>{s.type}</span></td>
                <td className="px-4 py-3"><p className="text-[11px] text-slate-600">{s.country}</p></td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", INFLUENCE_COLORS[s.influenceLevel])}>{s.influenceLevel}</span></td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", STRENGTH_COLORS[s.relationshipStrength])}>{s.relationshipStrength}</span></td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {s.issueAreas.slice(0, 2).map(a => <span key={a} className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 text-slate-500">{a}</span>)}
                    {s.issueAreas.length > 2 && <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 text-slate-500">+{s.issueAreas.length - 2}</span>}
                  </div>
                </td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <div className="relative">
                    <button onClick={() => setShowActionDropdown(showActionDropdown === s.id ? null : s.id)} className="p-1.5 hover:bg-slate-100 rounded">
                      <MoreHorizontal size={16} className="text-slate-600" />
                    </button>
                    {showActionDropdown === s.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowActionDropdown(null)} />
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                          <button onClick={() => { setSelectedStakeholder(s.id); setShowActionDropdown(null); }} className="w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Eye size={12} /> View</button>
                          <button onClick={() => { deleteStakeholder(s.id); setShowActionDropdown(null); }} className="w-full px-4 py-2 text-left text-[12px] text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={12} /> Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-[13px] text-slate-400">No stakeholders found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-slate-200 shrink-0">
          <span className="text-[11px] text-slate-400">{filtered.length} stakeholder(s)</span>
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

/* ═══ ADD STAKEHOLDER FORM ═══ */
function AddStakeholderForm({ onSave, onCancel }: { onSave: (s: Omit<Stakeholder, "id">) => void; onCancel: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", title: "", organization: "", type: "" as Stakeholder["type"] | "", email: "", phone: "", country: "",
    influenceLevel: "Medium" as Stakeholder["influenceLevel"], issueAreas: [] as string[],
    relationshipStrength: "New" as Stakeholder["relationshipStrength"], notes: "",
  });
  const u = (f: string, v: any) => setForm(prev => ({ ...prev, [f]: v }));
  const canSave = form.name && form.organization && form.type;
  const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 transition-colors placeholder:text-slate-400";
  const labelCls = "block text-[11px] text-slate-500 font-medium mb-1.5";

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 hover:text-slate-900"><ArrowLeft size={18} /><span className="text-[13px] font-medium">Back</span></button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B01D0]/10 flex items-center justify-center"><Users size={18} className="text-[#0B01D0]" /></div>
              <div><h1 className="text-[18px] font-semibold text-slate-900">Add New Stakeholder</h1></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onCancel} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50 font-medium">Cancel</button>
            <button onClick={() => { if (canSave) onSave({ ...form, type: form.type as Stakeholder["type"], dateAdded: new Date().toISOString().split("T")[0] }); }} disabled={!canSave}
              className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm">Save Stakeholder</button>
          </div>
        </div>
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2">
            {[{ n: 1, l: "Profile" }, { n: 2, l: "Contact & Location" }, { n: 3, l: "Classification" }].map((s, i) => (
              <button key={s.n} onClick={() => setStep(s.n)} className="flex items-center gap-2 flex-1">
                <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors w-full",
                  step === s.n ? "border-[#0B01D0] bg-[#0B01D0]/5" : step > s.n ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white")}>
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0",
                    step === s.n ? "bg-[#0B01D0] text-white" : step > s.n ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500")}>
                    {step > s.n ? <CheckCircle size={12} /> : s.n}
                  </div>
                  <span className={cn("text-[11px] font-medium truncate", step === s.n ? "text-[#0B01D0]" : step > s.n ? "text-emerald-700" : "text-slate-500")}>{s.l}</span>
                </div>
                {i < 2 && <div className="w-4 h-px bg-slate-200 shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
          {step === 1 && (
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 bg-indigo-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center"><Users size={13} className="text-[#0B01D0]" /></div>
                <h2 className="text-[13px] font-semibold text-slate-800">Profile Information</h2>
              </div>
              <div className="p-5 space-y-4">
                <div><label className={labelCls}>Full Name <span className="text-red-500">*</span></label><input type="text" value={form.name} onChange={e => u("name", e.target.value)} placeholder="e.g. Hon. Charles Mensah" className={inputCls} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Title / Position</label><input type="text" value={form.title} onChange={e => u("title", e.target.value)} placeholder="e.g. Deputy Minister" className={inputCls} /></div>
                  <div><label className={labelCls}>Organization <span className="text-red-500">*</span></label><input type="text" value={form.organization} onChange={e => u("organization", e.target.value)} placeholder="e.g. Ministry of Finance" className={inputCls} /></div>
                </div>
                <div><label className={labelCls}>Stakeholder Type <span className="text-red-500">*</span></label>
                  <select value={form.type} onChange={e => u("type", e.target.value)} className={inputCls}>
                    <option value="">Select type...</option>
                    {STAKEHOLDER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div><label className={labelCls}>Notes</label><textarea rows={3} value={form.notes} onChange={e => u("notes", e.target.value)} placeholder="Key notes about this stakeholder..." className={cn(inputCls, "resize-none")} /></div>
              </div>
            </section>
          )}
          {step === 2 && (
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center"><MapPin size={13} className="text-emerald-600" /></div>
                <h2 className="text-[13px] font-semibold text-slate-800">Contact & Location</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Email</label><input type="email" value={form.email} onChange={e => u("email", e.target.value)} placeholder="email@example.com" className={inputCls} /></div>
                  <div><label className={labelCls}>Phone</label><input type="text" value={form.phone} onChange={e => u("phone", e.target.value)} placeholder="+233 xxx xxx xxx" className={inputCls} /></div>
                </div>
                <div><label className={labelCls}>Country</label><input type="text" value={form.country} onChange={e => u("country", e.target.value)} placeholder="e.g. Ghana" className={inputCls} /></div>
              </div>
            </section>
          )}
          {step === 3 && (
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 bg-amber-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center"><Star size={13} className="text-amber-600" /></div>
                <h2 className="text-[13px] font-semibold text-slate-800">Classification</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Influence Level</label>
                    <select value={form.influenceLevel} onChange={e => u("influenceLevel", e.target.value)} className={inputCls}>
                      {INFLUENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div><label className={labelCls}>Relationship Strength</label>
                    <select value={form.relationshipStrength} onChange={e => u("relationshipStrength", e.target.value)} className={inputCls}>
                      {RELATIONSHIP_STRENGTHS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Issue Areas</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ISSUE_AREAS.map(area => (
                      <button key={area} onClick={() => u("issueAreas", form.issueAreas.includes(area) ? form.issueAreas.filter(a => a !== area) : [...form.issueAreas, area])}
                        className={cn("px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-colors",
                          form.issueAreas.includes(area) ? "border-[#0B01D0] bg-[#0B01D0]/5 text-[#0B01D0]" : "border-slate-200 text-slate-500 hover:border-slate-300")}>
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
        <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
          className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50 disabled:opacity-40 font-medium">Previous</button>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map(s => <div key={s} className={cn("w-2 h-2 rounded-full", step === s ? "bg-[#0B01D0]" : step > s ? "bg-emerald-400" : "bg-slate-200")} />)}
        </div>
        {step < 3 ? (
          <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] shadow-sm">Next</button>
        ) : (
          <button onClick={() => { if (canSave) onSave({ ...form, type: form.type as Stakeholder["type"], dateAdded: new Date().toISOString().split("T")[0] }); }} disabled={!canSave}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[12px] font-semibold hover:bg-emerald-700 disabled:opacity-40 shadow-sm">Save Stakeholder</button>
        )}
      </div>
    </div>
  );
}

/* ═══ ADD ENGAGEMENT MODAL ═══ */
function AddEngagementModal({ stakeholderId, onSave, onClose }: { stakeholderId?: number; onSave: (e: Omit<StakeholderEngagement, "id">) => void; onClose: () => void }) {
  const stakeholders = getStakeholders();
  const [form, setForm] = useState({
    stakeholderId: stakeholderId || 0,
    date: "", type: "" as StakeholderEngagement["type"] | "",
    subject: "", participants: "", summary: "", outcome: "", nextStep: "", linkedActivityId: "",
  });
  const u = (f: string, v: any) => setForm(prev => ({ ...prev, [f]: v }));
  const canSave = form.stakeholderId && form.date && form.type && form.subject;
  const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 placeholder:text-slate-400";
  const labelCls = "block text-[11px] text-slate-500 font-medium mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h2 className="text-[16px] font-semibold text-slate-900">Add Engagement</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {!stakeholderId && (
            <div><label className={labelCls}>Stakeholder <span className="text-red-500">*</span></label>
              <select value={form.stakeholderId} onChange={e => u("stakeholderId", Number(e.target.value))} className={inputCls}>
                <option value={0}>Select stakeholder...</option>
                {stakeholders.map(s => <option key={s.id} value={s.id}>{s.name} ({s.organization})</option>)}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Date <span className="text-red-500">*</span></label><input type="date" value={form.date} onChange={e => u("date", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Type <span className="text-red-500">*</span></label>
              <select value={form.type} onChange={e => u("type", e.target.value)} className={inputCls}>
                <option value="">Select type...</option>
                {ENGAGEMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div><label className={labelCls}>Subject <span className="text-red-500">*</span></label><input type="text" value={form.subject} onChange={e => u("subject", e.target.value)} placeholder="Subject of the engagement" className={inputCls} /></div>
          <div><label className={labelCls}>Participants</label><input type="text" value={form.participants} onChange={e => u("participants", e.target.value)} placeholder="Comma-separated names" className={inputCls} /></div>
          <div><label className={labelCls}>Summary</label><textarea rows={3} value={form.summary} onChange={e => u("summary", e.target.value)} placeholder="Summary of the engagement..." className={cn(inputCls, "resize-none")} /></div>
          <div><label className={labelCls}>Outcome</label><input type="text" value={form.outcome} onChange={e => u("outcome", e.target.value)} placeholder="Key outcome" className={inputCls} /></div>
          <div><label className={labelCls}>Next Step</label><input type="text" value={form.nextStep} onChange={e => u("nextStep", e.target.value)} placeholder="Next action item" className={inputCls} /></div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={() => { if (canSave) onSave({ stakeholderId: form.stakeholderId, date: form.date, type: form.type as StakeholderEngagement["type"], subject: form.subject, participants: form.participants.split(",").map(p => p.trim()).filter(Boolean), summary: form.summary, outcome: form.outcome, nextStep: form.nextStep, linkedActivityId: form.linkedActivityId || undefined }); }} disabled={!canSave}
            className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm">Save</button>
        </div>
      </div>
    </div>
  );
}
