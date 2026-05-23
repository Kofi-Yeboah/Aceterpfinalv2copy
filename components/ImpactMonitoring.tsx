import { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, X, Target, TrendingUp, TrendingDown, Minus,
  BookOpen, BarChart3, Award, Users, ArrowUpRight, ArrowDownRight, ArrowRight,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  subscribe, getOutcomeMappings, getInfluenceIndicators, getQualitativeImpactLogs,
  getStakeholders, addOutcomeMapping, addInfluenceIndicator, addQualitativeImpactLog,
  type OutcomeMapping, type InfluenceIndicator, type QualitativeImpactLog,
} from "../lib/advocacyStore";

const OUTCOME_TYPES: OutcomeMapping["outcomeType"][] = ["Policy Change", "Stakeholder Alignment", "Budget Allocation", "Legislative Action", "Public Awareness", "Institutional Reform"];
const CONTRIBUTION_LEVELS: OutcomeMapping["contributionLevel"][] = ["Direct", "Contributing", "Indirect"];
const OUTCOME_STATUS_COLORS: Record<string, string> = { Confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200", Emerging: "bg-amber-50 text-amber-700 border border-amber-200", Claimed: "bg-blue-50 text-blue-700 border border-blue-200" };
const CONTRIBUTION_COLORS: Record<string, string> = { Direct: "bg-indigo-50 text-indigo-700", Contributing: "bg-purple-50 text-purple-700", Indirect: "bg-slate-100 text-slate-600" };
const OUTCOME_TYPE_COLORS: Record<string, string> = {
  "Policy Change": "bg-blue-50 text-blue-700 border border-blue-200",
  "Stakeholder Alignment": "bg-purple-50 text-purple-700 border border-purple-200",
  "Budget Allocation": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Legislative Action": "bg-indigo-50 text-indigo-700 border border-indigo-200",
  "Public Awareness": "bg-amber-50 text-amber-700 border border-amber-200",
  "Institutional Reform": "bg-teal-50 text-teal-700 border border-teal-200",
};

const METRIC_TYPES: InfluenceIndicator["metric"][] = ["Meeting Frequency", "Citations", "Recommendation Uptake", "Media Mentions", "Event Invitations", "Policy References"];
const IMPACT_CATEGORIES: QualitativeImpactLog["category"][] = ["Anecdotal Win", "High-Level Recognition", "Informal Policy Influence", "Strategic Positioning", "Partnership Breakthrough"];
const SIGNIFICANCE_COLORS: Record<string, string> = { High: "bg-red-50 text-red-700 border border-red-200", Medium: "bg-amber-50 text-amber-700 border border-amber-200", Low: "bg-green-50 text-green-700 border border-green-200" };
const CATEGORY_COLORS: Record<string, string> = {
  "Anecdotal Win": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "High-Level Recognition": "bg-blue-50 text-blue-700 border border-blue-200",
  "Informal Policy Influence": "bg-purple-50 text-purple-700 border border-purple-200",
  "Strategic Positioning": "bg-amber-50 text-amber-700 border border-amber-200",
  "Partnership Breakthrough": "bg-teal-50 text-teal-700 border border-teal-200",
};
const ISSUE_AREAS = ["Digital Economy", "Youth Employment", "Trade Policy", "Climate Finance", "Gender Equality", "Agriculture", "Infrastructure", "Health Systems", "SME Development", "Governance", "Education", "Energy"];

const TREND_ICON: Record<string, React.ReactNode> = {
  Increasing: <ArrowUpRight size={12} className="text-emerald-600" />,
  Stable: <ArrowRight size={12} className="text-slate-500" />,
  Decreasing: <ArrowDownRight size={12} className="text-red-500" />,
};

export function ImpactMonitoring() {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick(t => t + 1)), []);

  const [activeTab, setActiveTab] = useState<"outcomes" | "influence" | "logs">("outcomes");
  const [outcomeTypeFilter, setOutcomeTypeFilter] = useState("all");
  const [outcomeStatusFilter, setOutcomeStatusFilter] = useState("all");
  const [showOutcomeTypeDD, setShowOutcomeTypeDD] = useState(false);
  const [showOutcomeStatusDD, setShowOutcomeStatusDD] = useState(false);
  const [metricFilter, setMetricFilter] = useState("all");
  const [showMetricDD, setShowMetricDD] = useState(false);
  const [logCategoryFilter, setLogCategoryFilter] = useState("all");
  const [logSignificanceFilter, setLogSignificanceFilter] = useState("all");
  const [showLogCatDD, setShowLogCatDD] = useState(false);
  const [showLogSigDD, setShowLogSigDD] = useState(false);
  const [showAddOutcome, setShowAddOutcome] = useState(false);
  const [showAddIndicator, setShowAddIndicator] = useState(false);
  const [showAddLog, setShowAddLog] = useState(false);

  const outcomes = getOutcomeMappings();
  const indicators = getInfluenceIndicators();
  const logs = getQualitativeImpactLogs();
  const stakeholders = getStakeholders();

  const filteredOutcomes = outcomes.filter(o => {
    const matchType = outcomeTypeFilter === "all" || o.outcomeType === outcomeTypeFilter;
    const matchStatus = outcomeStatusFilter === "all" || o.status === outcomeStatusFilter;
    return matchType && matchStatus;
  });

  const filteredIndicators = indicators.filter(i => metricFilter === "all" || i.metric === metricFilter);

  const filteredLogs = logs.filter(l => {
    const matchCat = logCategoryFilter === "all" || l.category === logCategoryFilter;
    const matchSig = logSignificanceFilter === "all" || l.significance === logSignificanceFilter;
    return matchCat && matchSig;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  /* Summary stats for influence tab */
  const totalMeetings = indicators.filter(i => i.metric === "Meeting Frequency").reduce((s, i) => s + i.value, 0);
  const totalCitations = indicators.filter(i => i.metric === "Citations").reduce((s, i) => s + i.value, 0);
  const totalMediaMentions = indicators.filter(i => i.metric === "Media Mentions").reduce((s, i) => s + i.value, 0);
  const totalPolicyRefs = indicators.filter(i => i.metric === "Policy References").reduce((s, i) => s + i.value, 0);

  const tabs = [
    { key: "outcomes" as const, label: "Outcome Mapping", icon: <Target size={14} /> },
    { key: "influence" as const, label: "Influence Indicators", icon: <BarChart3 size={14} /> },
    { key: "logs" as const, label: "Impact Logs", icon: <BookOpen size={14} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Impact Monitoring</h1>
        <div className="flex items-center gap-2">
          {activeTab === "outcomes" && (
            <button onClick={() => setShowAddOutcome(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] shadow-sm">
              <Plus size={16} /><span className="text-sm font-medium">Add Outcome</span>
            </button>
          )}
          {activeTab === "influence" && (
            <button onClick={() => setShowAddIndicator(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] shadow-sm">
              <Plus size={16} /><span className="text-sm font-medium">Add Indicator</span>
            </button>
          )}
          {activeTab === "logs" && (
            <button onClick={() => setShowAddLog(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] shadow-sm">
              <Plus size={16} /><span className="text-sm font-medium">Add Impact Log</span>
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

      {/* ═══ OUTCOME MAPPING TAB ═══ */}
      {activeTab === "outcomes" && (
        <>
          <div className="px-6 py-3 bg-white border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <button onClick={() => { setShowOutcomeTypeDD(!showOutcomeTypeDD); setShowOutcomeStatusDD(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 shadow-sm min-w-[170px]">
                  <span className="text-sm text-slate-900 truncate">{outcomeTypeFilter === "all" ? "All Outcome Types" : outcomeTypeFilter}</span>
                  <ChevronDown size={16} className="text-slate-600" />
                </button>
                {showOutcomeTypeDD && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowOutcomeTypeDD(false)} />
                    <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                      {["all", ...OUTCOME_TYPES].map(t => (
                        <button key={t} onClick={() => { setOutcomeTypeFilter(t); setShowOutcomeTypeDD(false); }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700">{t === "all" ? "All Outcome Types" : t}</button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="relative">
                <button onClick={() => { setShowOutcomeStatusDD(!showOutcomeStatusDD); setShowOutcomeTypeDD(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 shadow-sm min-w-[140px]">
                  <span className="text-sm text-slate-900 truncate">{outcomeStatusFilter === "all" ? "All Statuses" : outcomeStatusFilter}</span>
                  <ChevronDown size={16} className="text-slate-600" />
                </button>
                {showOutcomeStatusDD && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowOutcomeStatusDD(false)} />
                    <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                      {["all", "Confirmed", "Emerging", "Claimed"].map(s => (
                        <button key={s} onClick={() => { setOutcomeStatusFilter(s); setShowOutcomeStatusDD(false); }}
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
                  {["Advocacy Action", "Outcome Type", "Description", "Date", "Status", "Contribution", "Verification"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOutcomes.length > 0 ? filteredOutcomes.map((o, idx) => (
                  <tr key={o.id} className={cn("hover:bg-slate-50 transition-colors", idx % 2 === 1 && "bg-slate-50/50")}>
                    <td className="px-4 py-3">
                      <p className="text-[11px] text-slate-900 font-medium">{o.advocacyActionName}</p>
                      <p className="text-[9px] text-slate-400">{o.advocacyActionId}</p>
                    </td>
                    <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", OUTCOME_TYPE_COLORS[o.outcomeType])}>{o.outcomeType}</span></td>
                    <td className="px-4 py-3"><p className="text-[11px] text-slate-700 max-w-[200px]">{o.outcomeDescription}</p></td>
                    <td className="px-4 py-3"><p className="text-[11px] text-slate-600">{new Date(o.dateIdentified).toLocaleDateString()}</p></td>
                    <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", OUTCOME_STATUS_COLORS[o.status])}>{o.status}</span></td>
                    <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", CONTRIBUTION_COLORS[o.contributionLevel])}>{o.contributionLevel}</span></td>
                    <td className="px-4 py-3"><p className="text-[10px] text-slate-500 max-w-[150px]">{o.verificationSource}</p></td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-[13px] text-slate-400">No outcome mappings found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-white border-t border-slate-200 shrink-0">
            <span className="text-[11px] text-slate-400">{filteredOutcomes.length} outcome(s)</span>
          </div>
        </>
      )}

      {/* ═══ INFLUENCE INDICATORS TAB ═══ */}
      {activeTab === "influence" && (
        <>
          {/* Summary Cards */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Total Meetings", value: totalMeetings, icon: <Users size={16} className="text-blue-600" />, bg: "bg-blue-50" },
                { label: "Total Citations", value: totalCitations, icon: <BookOpen size={16} className="text-emerald-600" />, bg: "bg-emerald-50" },
                { label: "Media Mentions", value: totalMediaMentions, icon: <BarChart3 size={16} className="text-purple-600" />, bg: "bg-purple-50" },
                { label: "Policy References", value: totalPolicyRefs, icon: <Award size={16} className="text-amber-600" />, bg: "bg-amber-50" },
              ].map(card => (
                <div key={card.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-slate-400 font-medium">{card.label}</span>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", card.bg)}>{card.icon}</div>
                  </div>
                  <p className="text-[22px] font-bold text-slate-900">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="px-6 py-3 bg-white border-b border-slate-200">
            <div className="relative inline-block">
              <button onClick={() => setShowMetricDD(!showMetricDD)}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 shadow-sm min-w-[180px]">
                <span className="text-sm text-slate-900 truncate">{metricFilter === "all" ? "All Metrics" : metricFilter}</span>
                <ChevronDown size={16} className="text-slate-600" />
              </button>
              {showMetricDD && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMetricDD(false)} />
                  <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                    {["all", ...METRIC_TYPES].map(m => (
                      <button key={m} onClick={() => { setMetricFilter(m); setShowMetricDD(false); }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700">{m === "all" ? "All Metrics" : m}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  {["Stakeholder", "Metric", "Value", "Period", "Trend", "Notes"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIndicators.length > 0 ? filteredIndicators.map((ind, idx) => (
                  <tr key={ind.id} className={cn("hover:bg-slate-50 transition-colors", idx % 2 === 1 && "bg-slate-50/50")}>
                    <td className="px-4 py-3"><p className="text-[11px] text-slate-900 font-medium">{ind.stakeholderName}</p></td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">{ind.metric}</span></td>
                    <td className="px-4 py-3"><p className="text-[14px] font-bold text-slate-900">{ind.value}</p></td>
                    <td className="px-4 py-3"><p className="text-[11px] text-slate-600">{ind.period}</p></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {TREND_ICON[ind.trend]}
                        <span className={cn("text-[11px] font-medium",
                          ind.trend === "Increasing" ? "text-emerald-600" : ind.trend === "Decreasing" ? "text-red-500" : "text-slate-500")}>{ind.trend}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><p className="text-[10px] text-slate-500">{ind.notes}</p></td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-[13px] text-slate-400">No indicators found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-white border-t border-slate-200 shrink-0">
            <span className="text-[11px] text-slate-400">{filteredIndicators.length} indicator(s)</span>
          </div>
        </>
      )}

      {/* ═══ IMPACT LOGS TAB ═══ */}
      {activeTab === "logs" && (
        <>
          <div className="px-6 py-3 bg-white border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <button onClick={() => { setShowLogCatDD(!showLogCatDD); setShowLogSigDD(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 shadow-sm min-w-[180px]">
                  <span className="text-sm text-slate-900 truncate">{logCategoryFilter === "all" ? "All Categories" : logCategoryFilter}</span>
                  <ChevronDown size={16} className="text-slate-600" />
                </button>
                {showLogCatDD && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowLogCatDD(false)} />
                    <div className="absolute left-0 top-full mt-1 w-60 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                      {["all", ...IMPACT_CATEGORIES].map(c => (
                        <button key={c} onClick={() => { setLogCategoryFilter(c); setShowLogCatDD(false); }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700">{c === "all" ? "All Categories" : c}</button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="relative">
                <button onClick={() => { setShowLogSigDD(!showLogSigDD); setShowLogCatDD(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 shadow-sm min-w-[140px]">
                  <span className="text-sm text-slate-900 truncate">{logSignificanceFilter === "all" ? "All Significance" : logSignificanceFilter}</span>
                  <ChevronDown size={16} className="text-slate-600" />
                </button>
                {showLogSigDD && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowLogSigDD(false)} />
                    <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                      {["all", "High", "Medium", "Low"].map(s => (
                        <button key={s} onClick={() => { setLogSignificanceFilter(s); setShowLogSigDD(false); }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700">{s === "all" ? "All Significance" : s}</button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto py-6 px-4 space-y-4">
              {filteredLogs.length > 0 ? filteredLogs.map(log => (
                <div key={log.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", CATEGORY_COLORS[log.category])}>{log.category}</span>
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", SIGNIFICANCE_COLORS[log.significance])}>{log.significance} Significance</span>
                      <span className="px-2 py-0.5 rounded text-[9px] bg-slate-100 text-slate-500">{log.issueArea}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">{new Date(log.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-[14px] font-semibold text-slate-900 mb-2">{log.title}</h3>
                  <p className="text-[12px] text-slate-600 leading-relaxed">{log.description}</p>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={12} className="text-slate-400" />
                      <span className="text-[10px] text-slate-400">{log.relevantStakeholders.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen size={10} className="text-slate-400" />
                      <span className="text-[9px] text-slate-400">{log.evidenceSource}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-16 text-slate-400">
                  <BookOpen size={32} className="mx-auto mb-3" />
                  <p className="text-[13px]">No impact logs match your filters</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ═══ MODALS ═══ */}
      {showAddOutcome && <AddOutcomeModal onSave={o => { addOutcomeMapping(o); setShowAddOutcome(false); }} onClose={() => setShowAddOutcome(false)} />}
      {showAddIndicator && <AddIndicatorModal onSave={i => { addInfluenceIndicator(i); setShowAddIndicator(false); }} onClose={() => setShowAddIndicator(false)} />}
      {showAddLog && <AddLogModal onSave={l => { addQualitativeImpactLog(l); setShowAddLog(false); }} onClose={() => setShowAddLog(false)} />}
    </div>
  );
}

/* ═══ MODAL FORMS ═══ */
const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 placeholder:text-slate-400";
const labelCls = "block text-[11px] text-slate-500 font-medium mb-1.5";

function AddOutcomeModal({ onSave, onClose }: { onSave: (o: Omit<OutcomeMapping, "id">) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    advocacyActionId: "", advocacyActionName: "", outcomeType: "" as OutcomeMapping["outcomeType"] | "",
    outcomeDescription: "", dateIdentified: "", verificationSource: "",
    status: "Emerging" as OutcomeMapping["status"], contributionLevel: "Contributing" as OutcomeMapping["contributionLevel"],
  });
  const u = (f: string, v: any) => setForm(prev => ({ ...prev, [f]: v }));
  const canSave = form.advocacyActionName && form.outcomeType && form.outcomeDescription;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h2 className="text-[16px] font-semibold text-slate-900">Add Outcome Mapping</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Activity ID</label><input type="text" value={form.advocacyActionId} onChange={e => u("advocacyActionId", e.target.value)} placeholder="e.g. ADV-001" className={inputCls} /></div>
            <div><label className={labelCls}>Activity Name <span className="text-red-500">*</span></label><input type="text" value={form.advocacyActionName} onChange={e => u("advocacyActionName", e.target.value)} placeholder="Advocacy action" className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Outcome Type <span className="text-red-500">*</span></label>
              <select value={form.outcomeType} onChange={e => u("outcomeType", e.target.value)} className={inputCls}>
                <option value="">Select...</option>
                {OUTCOME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Date Identified</label><input type="date" value={form.dateIdentified} onChange={e => u("dateIdentified", e.target.value)} className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Outcome Description <span className="text-red-500">*</span></label><textarea rows={3} value={form.outcomeDescription} onChange={e => u("outcomeDescription", e.target.value)} placeholder="Describe the outcome..." className={cn(inputCls, "resize-none")} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Status</label>
              <select value={form.status} onChange={e => u("status", e.target.value)} className={inputCls}>
                {(["Confirmed", "Emerging", "Claimed"] as const).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Contribution Level</label>
              <select value={form.contributionLevel} onChange={e => u("contributionLevel", e.target.value)} className={inputCls}>
                {CONTRIBUTION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div><label className={labelCls}>Verification Source</label><input type="text" value={form.verificationSource} onChange={e => u("verificationSource", e.target.value)} placeholder="Source of verification" className={inputCls} /></div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={() => { if (canSave) onSave({ ...form, outcomeType: form.outcomeType as OutcomeMapping["outcomeType"] }); }} disabled={!canSave}
            className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm">Save</button>
        </div>
      </div>
    </div>
  );
}

function AddIndicatorModal({ onSave, onClose }: { onSave: (i: Omit<InfluenceIndicator, "id">) => void; onClose: () => void }) {
  const stakeholders = getStakeholders();
  const [form, setForm] = useState({
    stakeholderId: 0, stakeholderName: "", metric: "" as InfluenceIndicator["metric"] | "",
    value: 0, period: "", trend: "Stable" as InfluenceIndicator["trend"], notes: "",
  });
  const u = (f: string, v: any) => setForm(prev => ({ ...prev, [f]: v }));
  const canSave = form.stakeholderId && form.metric && form.period;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h2 className="text-[16px] font-semibold text-slate-900">Add Influence Indicator</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-4">
          <div><label className={labelCls}>Stakeholder <span className="text-red-500">*</span></label>
            <select value={form.stakeholderId} onChange={e => { const s = stakeholders.find(x => x.id === Number(e.target.value)); u("stakeholderId", Number(e.target.value)); if (s) u("stakeholderName", s.name); }} className={inputCls}>
              <option value={0}>Select...</option>
              {stakeholders.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Metric <span className="text-red-500">*</span></label>
              <select value={form.metric} onChange={e => u("metric", e.target.value)} className={inputCls}>
                <option value="">Select...</option>
                {METRIC_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Value</label><input type="number" value={form.value} onChange={e => u("value", Number(e.target.value))} className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Period <span className="text-red-500">*</span></label><input type="text" value={form.period} onChange={e => u("period", e.target.value)} placeholder="e.g. Q1 2025" className={inputCls} /></div>
            <div><label className={labelCls}>Trend</label>
              <select value={form.trend} onChange={e => u("trend", e.target.value)} className={inputCls}>
                {(["Increasing", "Stable", "Decreasing"] as const).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div><label className={labelCls}>Notes</label><input type="text" value={form.notes} onChange={e => u("notes", e.target.value)} placeholder="Additional context" className={inputCls} /></div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={() => { if (canSave) onSave({ ...form, metric: form.metric as InfluenceIndicator["metric"] }); }} disabled={!canSave}
            className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm">Save</button>
        </div>
      </div>
    </div>
  );
}

function AddLogModal({ onSave, onClose }: { onSave: (l: Omit<QualitativeImpactLog, "id">) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    title: "", date: "", category: "" as QualitativeImpactLog["category"] | "",
    description: "", relevantStakeholders: "", issueArea: "", evidenceSource: "",
    significance: "Medium" as QualitativeImpactLog["significance"],
  });
  const u = (f: string, v: any) => setForm(prev => ({ ...prev, [f]: v }));
  const canSave = form.title && form.date && form.category && form.description;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h2 className="text-[16px] font-semibold text-slate-900">Add Impact Log</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-4">
          <div><label className={labelCls}>Title <span className="text-red-500">*</span></label><input type="text" value={form.title} onChange={e => u("title", e.target.value)} placeholder="Impact title" className={inputCls} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Date <span className="text-red-500">*</span></label><input type="date" value={form.date} onChange={e => u("date", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Category <span className="text-red-500">*</span></label>
              <select value={form.category} onChange={e => u("category", e.target.value)} className={inputCls}>
                <option value="">Select...</option>
                {IMPACT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div><label className={labelCls}>Description <span className="text-red-500">*</span></label><textarea rows={4} value={form.description} onChange={e => u("description", e.target.value)} placeholder="Describe the impact..." className={cn(inputCls, "resize-none")} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Issue Area</label>
              <select value={form.issueArea} onChange={e => u("issueArea", e.target.value)} className={inputCls}>
                <option value="">Select...</option>
                {ISSUE_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Significance</label>
              <select value={form.significance} onChange={e => u("significance", e.target.value)} className={inputCls}>
                {(["High", "Medium", "Low"] as const).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div><label className={labelCls}>Relevant Stakeholders</label><input type="text" value={form.relevantStakeholders} onChange={e => u("relevantStakeholders", e.target.value)} placeholder="Comma-separated names" className={inputCls} /></div>
          <div><label className={labelCls}>Evidence Source</label><input type="text" value={form.evidenceSource} onChange={e => u("evidenceSource", e.target.value)} placeholder="Source of evidence" className={inputCls} /></div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={() => {
            if (canSave) onSave({
              ...form, category: form.category as QualitativeImpactLog["category"],
              relevantStakeholders: form.relevantStakeholders.split(",").map(s => s.trim()).filter(Boolean),
            });
          }} disabled={!canSave}
            className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm">Save</button>
        </div>
      </div>
    </div>
  );
}
