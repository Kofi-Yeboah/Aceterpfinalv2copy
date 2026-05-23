import { useState, useEffect } from "react";
import {
  ArrowLeft, Building2, Calendar, ChevronDown, ChevronRight, ChevronUp, Clock,
  DollarSign, Download, Edit2, Eye, FileText, Filter, Globe,
  Mail, MapPin, MessageSquare, MoreHorizontal, Phone, Plus, Search,
  Send, Star, Target, TrendingUp, Users, X, Check, AlertTriangle,
  ChevronsUpDown, Trash2, Paperclip, Upload
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  type PotentialDonor, type PipelineStage, type PipelineConversation,
  getPotentialDonors, subscribe, addConversation, updateDonorStage,
  convertDonorToOrganization, addProposal, getPotentialProjects,
  addAgreement, type PotentialProject
} from "../lib/donorPipelineStore";

const PIPELINE_STAGES: PipelineStage[] = [
  "No Contact", "Pipeline", "Agreement Reached", "Converted"
];

const STAGE_COLORS: Record<string, string> = {
  "No Contact": "bg-slate-100 text-slate-600",
  "Pipeline": "bg-blue-100 text-blue-700",
  "Agreement Reached": "bg-emerald-100 text-emerald-700",
  "Converted": "bg-green-200 text-green-800",
};

const DONOR_TYPE_COLORS: Record<string, string> = {
  Foundation: "bg-purple-50 text-purple-700 border border-purple-200",
  Bilateral: "bg-blue-50 text-blue-700 border border-blue-200",
  Multilateral: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  Corporate: "bg-green-50 text-green-700 border border-green-200",
  Government: "bg-slate-100 text-slate-700 border border-slate-200",
  Individual: "bg-amber-50 text-amber-700 border border-amber-200",
};

const CONV_COLORS: Record<string, string> = {
  Email: "bg-slate-100 text-slate-600",
  Call: "bg-emerald-100 text-emerald-700",
  Meeting: "bg-blue-100 text-blue-700",
  Workshop: "bg-amber-100 text-amber-700",
  "Site Visit": "bg-teal-100 text-teal-700",
  Presentation: "bg-indigo-100 text-indigo-700",
  Other: "bg-slate-100 text-slate-500",
};

const fmt = (n: number, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, minimumFractionDigits: 0 }).format(n);

type DetailTab = "info" | "contacts" | "engagements" | "proposals";

export function PotentialDonors() {
  const [donors, setDonors] = useState(getPotentialDonors());
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showStageDD, setShowStageDD] = useState(false);
  const [showTypeDD, setShowTypeDD] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PotentialDonor | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("info");
  const [showConvModal, setShowConvModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showConvertConfirm, setShowConvertConfirm] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  const [expandedConvs, setExpandedConvs] = useState<Set<number>>(new Set());
  const [allExpanded, setAllExpanded] = useState(true);
  const perPage = 10;

  useEffect(() => {
    const unsub = subscribe(() => {
      setDonors(getPotentialDonors());
    });
    return unsub;
  }, []);

  // keep selected in sync with store
  useEffect(() => {
    if (selected) {
      const updated = donors.find(d => d.id === selected.id);
      if (updated) setSelected(updated);
    }
  }, [donors]);

  const filtered = donors.filter(d => {
    if (stageFilter !== "All" && d.pipelineStage !== stageFilter) return false;
    if (typeFilter !== "All" && d.type !== typeFilter) return false;
    if (search && !d.organizationName.toLowerCase().includes(search.toLowerCase()) && !d.sector.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  /* ═══════════════════════════════════════════════════════════════════════════
     FULL-SCREEN DETAIL VIEW
     ═══════════════════════════════════════════════════════════════════════════ */
  if (selected) {
    const d = selected;
    const stageIdx = PIPELINE_STAGES.indexOf(d.pipelineStage);

    const tabs: { key: DetailTab; label: string; icon: React.ReactNode; badge?: number }[] = [
      { key: "info", label: "Donor Info", icon: <Building2 size={13} /> },
      { key: "contacts", label: "Contact People", icon: <Users size={13} />, badge: d.contacts.length },
      { key: "engagements", label: "Engagements", icon: <MessageSquare size={13} />, badge: d.conversations.length },
      { key: "proposals", label: "Proposals", icon: <FileText size={13} /> },
    ];

    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 shrink-0">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => { setSelected(null); setDetailTab("info"); }} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft size={18} /><span className="text-[13px] font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B01D0]/10 flex items-center justify-center">
                  <Building2 size={18} className="text-[#0B01D0]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-[18px] font-semibold text-slate-900">{d.organizationName}</h1>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", DONOR_TYPE_COLORS[d.type])}>{d.type}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", STAGE_COLORS[d.pipelineStage])}>{d.pipelineStage}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{d.sector} — {d.country}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {d.pipelineStage === "Agreement Reached" && (
                <button onClick={() => setShowConvertConfirm(true)} className="flex items-center gap-1.5 px-3 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-medium hover:bg-[#0a01b8] shadow-sm"><TrendingUp size={13} /> Convert to Donor</button>
              )}
              <button onClick={() => setShowAgreementModal(true)} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-[12px] font-medium hover:bg-emerald-700 shadow-sm"><FileText size={13} /> Create Agreement</button>
            </div>
          </div>

          {/* Pipeline Progress */}
          

          {/* Tabs with Status */}
          <div className="px-6 pb-0 flex items-center justify-between mx-[0px] my-[13px]">
            <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
              {tabs.map(t => (
                <button key={t.key} onClick={() => {
                  setDetailTab(t.key);
                  if (t.key === "engagements" && d.conversations.length > 0) {
                    setExpandedConvs(new Set(d.conversations.map(c => c.id)));
                    setAllExpanded(true);
                  }
                }}
                  className={cn("px-3 py-1.5 rounded-lg text-[11px] transition-colors flex items-center gap-1.5 font-medium",
                    detailTab === t.key ? "bg-[#0B01D0] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}>
                  {t.icon}{t.label}
                  {t.badge !== undefined && t.badge > 0 && (
                    <span className={cn("px-1.5 py-0.5 rounded-full text-[9px]", detailTab === t.key ? "bg-white/20" : "bg-slate-200/80")}>{t.badge}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Status:</span>
              <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-semibold", STAGE_COLORS[d.pipelineStage])}>{d.pipelineStage}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto">
          {detailTab === "info" && (
            <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-indigo-50 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center"><Building2 size={13} className="text-[#0B01D0]" /></div>
                    <h2 className="text-[13px] font-semibold text-slate-800">Donor Profile</h2>
                  </div>
                  <div className="p-5 divide-y divide-slate-100">
                    {([
                      ["Organization", d.organizationName],
                      ["Type", d.type],
                      ["Sector", d.sector],
                      ["Country", d.country],
                      ["Source", d.source],
                      ["Date Added", d.dateAdded],
                      ["Last Contact", d.lastContact || "—"],
                    ] as [string, string][]).map(([l, v], i) => (
                      <div key={i} className="flex items-center justify-between py-2.5">
                        <span className="text-[11px] text-slate-500">{l}</span>
                        <span className="text-[11px] text-slate-800 font-medium text-right max-w-[60%] truncate">{v}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center"><DollarSign size={13} className="text-emerald-600" /></div>
                    <h2 className="text-[13px] font-semibold text-slate-800">Funding Potential</h2>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Estimated Capacity</p>
                      <p className="text-[22px] font-semibold text-emerald-700">{fmt(d.estimatedCapacity, d.currency)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1.5">Interest Areas</p>
                      <div className="flex flex-wrap gap-1.5">
                        {d.interestAreas.map((area, i) => (
                          <span key={i} className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded text-[10px] text-emerald-700">{area}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Website</p>
                      <a href={`https://${d.website}`} className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"><Globe size={11} />{d.website}</a>
                    </div>
                  </div>
                </section>
              </div>

              {d.notes && (
                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-amber-50 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center"><FileText size={13} className="text-amber-600" /></div>
                    <h2 className="text-[13px] font-semibold text-slate-800">Notes</h2>
                  </div>
                  <div className="p-5"><p className="text-[12px] text-slate-600 leading-relaxed">{d.notes}</p></div>
                </section>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Pipeline Stage", value: d.pipelineStage, color: "text-[#0B01D0]" },
                  { label: "Conversations", value: String(d.conversations.length), color: "text-purple-600" },
                  { label: "Contacts", value: String(d.contacts.length), color: "text-blue-600" },
                  { label: "Days in Pipeline", value: String(Math.floor((Date.now() - new Date(d.dateAdded.replace(/(\w+) (\d+), (\d+)/, "$1 $2, $3")).getTime()) / 86400000)), color: "text-amber-600" },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <p className={cn("text-[22px] font-semibold", s.color)}>{s.value}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detailTab === "engagements" && (
            <div className="max-w-5xl mx-auto py-6 px-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[14px] font-semibold text-slate-800">Conversation Timeline</h2>
                <div className="flex items-center gap-2">
                  {d.conversations.length > 0 && (
                    <button
                      onClick={() => {
                        if (allExpanded) {
                          setExpandedConvs(new Set());
                          setAllExpanded(false);
                        } else {
                          setExpandedConvs(new Set(d.conversations.map(c => c.id)));
                          setAllExpanded(true);
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-[11px] text-slate-600 font-medium transition-colors"
                    >
                      <ChevronsUpDown size={12} />
                      {allExpanded ? "Collapse All" : "Expand All"}
                    </button>
                  )}
                  <button onClick={() => setShowConvModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]"><Plus size={12} /> Log Conversation</button>
                </div>
              </div>
              {d.conversations.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <MessageSquare size={28} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-[13px] text-slate-400">No conversations recorded yet</p>
                  <button onClick={() => setShowConvModal(true)} className="mt-3 text-[12px] text-[#0B01D0] hover:underline font-medium">Log first conversation</button>
                </div>
              ) : (
                <div className="space-y-0 relative">
                  <div className="absolute left-6 top-4 bottom-4 w-px bg-slate-200" />
                  {[...d.conversations].reverse().map((conv) => {
                    const isExpanded = expandedConvs.has(conv.id);
                    return (
                      <div key={conv.id} className="relative pl-14 pb-4">
                        <div className="absolute left-4 top-2 w-5 h-5 rounded-full bg-white border-2 border-[#0B01D0] flex items-center justify-center z-10">
                          <div className="w-2 h-2 rounded-full bg-[#0B01D0]" />
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow">
                          <button
                            onClick={() => {
                              const next = new Set(expandedConvs);
                              if (isExpanded) {
                                next.delete(conv.id);
                              } else {
                                next.add(conv.id);
                              }
                              setExpandedConvs(next);
                              setAllExpanded(next.size === d.conversations.length);
                            }}
                            className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0", CONV_COLORS[conv.type])}>{conv.type}</span>
                              <h3 className="text-[13px] font-semibold text-slate-800 truncate">{conv.subject}</h3>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              {!isExpanded && conv.outcome && (
                                <span className="text-[10px] text-slate-400 max-w-[180px] truncate hidden lg:inline">{conv.outcome}</span>
                              )}
                              {conv.stageAfter && (
                                <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-medium", STAGE_COLORS[conv.stageAfter])}>→ {conv.stageAfter}</span>
                              )}
                              <div className="flex items-center gap-1 text-slate-400"><Calendar size={11} /><span className="text-[11px]">{conv.date}</span></div>
                              {isExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                            </div>
                          </button>
                          {isExpanded && (
                            <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-3">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">ACET Participants</p>
                                  <div className="flex flex-wrap gap-1">{conv.acParticipants.map((p, j) => <span key={j} className="px-2 py-0.5 bg-[#0B01D0]/5 border border-[#0B01D0]/20 rounded text-[10px] text-[#0B01D0]">{p}</span>)}</div>
                                </div>
                                <div>
                                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Donor Participants</p>
                                  <div className="flex flex-wrap gap-1">{conv.donorParticipants.map((p, j) => <span key={j} className="px-2 py-0.5 bg-purple-50 border border-purple-200 rounded text-[10px] text-purple-700">{p}</span>)}</div>
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Summary</p>
                                <p className="text-[11px] text-slate-700">{conv.summary}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Outcome</p>
                                  <p className="text-[11px] text-slate-700">{conv.outcome}</p>
                                </div>
                                {conv.nextStep && (
                                  <div>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Next Step</p>
                                    <p className="text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded">{conv.nextStep}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {detailTab === "contacts" && (
            <div className="flex-1 overflow-auto">
              <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
                <p className="text-[12px] text-slate-500">{d.contacts.length} contact(s)</p>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]"><Plus size={12} /> Add Contact</button>
              </div>
              {d.contacts.length > 0 ? (
                <table className="w-full">
                  <thead style={{ backgroundColor: "#0B01D0" }}>
                    <tr>
                      {["Name", "Title", "Department", "Role", "Email", "Phone"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {d.contacts.map((c, i) => (
                      <tr key={c.id} className={cn("hover:bg-slate-50", i % 2 === 1 && "bg-slate-50/50")}>
                        <td className="px-4 py-3"><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-full bg-[#0B01D0]/10 flex items-center justify-center"><span className="text-[9px] font-semibold text-[#0B01D0]">{c.name.split(" ").map(n=>n[0]).join("")}</span></div><span className="text-[11px] font-medium text-slate-800">{c.name}</span></div></td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">{c.title}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">{c.department}</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#0B01D0]/10 text-[#0B01D0]">{c.role}</span></td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">{c.email}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">{c.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <Users size={24} className="text-slate-300 mb-2" />
                  <p className="text-[13px] text-slate-400">No contacts added yet</p>
                </div>
              )}
            </div>
          )}

          {detailTab === "proposals" && (() => {
            const donorConcepts = getPotentialProjects().filter(p => p.donorId === d.id);
            return (
              <div className="flex-1 overflow-auto">
                <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
                  <p className="text-[12px] text-slate-500">{donorConcepts.length} concept note(s) submitted to this donor</p>
                </div>
                {donorConcepts.length > 0 ? (
                  <table className="w-full">
                    <thead style={{ backgroundColor: "#0B01D0" }}>
                      <tr>
                        {["Concept Name", "Program Area", "Est. Budget", "Lead", "Timeline", "Donor Codes"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {donorConcepts.map((p, idx) => (
                        <tr key={p.id} className={cn("hover:bg-slate-50", idx % 2 === 1 && "bg-slate-50/50")}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-[#0B01D0]/10 flex items-center justify-center shrink-0"><FileText size={14} className="text-[#0B01D0]" /></div>
                              <span className="text-[11px] font-medium text-slate-800 max-w-[200px] truncate">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[11px] text-slate-600">{p.programArea}</td>
                          <td className="px-4 py-3 text-[11px] text-slate-700 font-medium">{fmt(p.estimatedBudget, p.currency)}</td>
                          <td className="px-4 py-3 text-[11px] text-slate-600">{p.leadContact}</td>
                          <td className="px-4 py-3 text-[11px] text-slate-500">{p.startDate} — {p.endDate}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {p.donorCodes.length > 0 ? p.donorCodes.map((c, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[10px] font-semibold text-indigo-700">{c}</span>
                              )) : <span className="text-[10px] text-slate-400">—</span>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20">
                    <FileText size={28} className="text-slate-300 mb-2" />
                    <p className="text-[13px] text-slate-400">No concept notes submitted to this donor yet</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* ═══ LOG CONVERSATION MODAL ═══ */}
        {showConvModal && <LogConversationModal donor={d} onClose={() => setShowConvModal(false)} />}

        {/* ═══ CREATE AGREEMENT MODAL ═══ */}
        {showAgreementModal && <CreateAgreementModal donor={d} onClose={() => setShowAgreementModal(false)} />}

        {/* ═══ CONVERT CONFIRM ═══ */}
        {showConvertConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <TrendingUp size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-slate-900">Convert to Active Donor</h2>
                  <p className="text-[12px] text-slate-400">Move to the Organizations screen</p>
                </div>
              </div>
              <p className="text-[12px] text-slate-600 mb-6">
                This will mark <strong>{d.organizationName}</strong> as converted and add them to the active Organizations / Donors list. This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setShowConvertConfirm(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={() => { convertDonorToOrganization(d.id); setShowConvertConfirm(false); setSelected(null); }} className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8]">Convert</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     LIST VIEW
     ═══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-slate-900">Prospects</h1>
            <p className="text-[12px] text-slate-400 mt-0.5">Track prospective donors through the engagement pipeline</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Download size={14} /> Export</button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-medium hover:bg-[#0a01b8] shadow-sm"><Plus size={14} /> Add Prospect</button>
          </div>
        </div>
      </div>

      {/* Pipeline Summary Cards */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex gap-2">
          {PIPELINE_STAGES.filter(s => s !== "Converted").map(stage => {
            const count = donors.filter(d => d.pipelineStage === stage).length;
            return (
              <button key={stage} onClick={() => { setStageFilter(stageFilter === stage ? "All" : stage); setPage(1); }}
                className={cn("flex-1 rounded-lg border p-2 transition-colors text-center",
                  stageFilter === stage ? "border-[#0B01D0] bg-[#0B01D0]/5" : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                )}>
                <p className="text-[15px] font-semibold text-slate-800">{count}</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mt-0.5 truncate">{stage}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white w-64">
            <Search size={14} className="text-slate-400" />
            <input type="text" placeholder="Search donors..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="flex-1 outline-none text-[12px] text-slate-700 placeholder:text-slate-400" />
            {search && <button onClick={() => { setSearch(""); setPage(1); }}><X size={13} className="text-slate-400 hover:text-slate-600" /></button>}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => { setShowTypeDD(!showTypeDD); setShowStageDD(false); }}
                className={cn("flex items-center gap-2 px-3 py-2 border rounded-lg text-[12px] min-w-[120px]",
                  typeFilter !== "All" ? "border-[#0B01D0]/30 bg-[#0B01D0]/5" : "border-slate-200")}>
                <span className="text-slate-700">{typeFilter === "All" ? "All Types" : typeFilter}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {showTypeDD && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowTypeDD(false)} />
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                    {["All", "Foundation", "Bilateral", "Multilateral", "Corporate", "Government", "Individual"].map(t => (
                      <button key={t} onClick={() => { setTypeFilter(t); setShowTypeDD(false); setPage(1); }}
                        className={cn("w-full px-3 py-2 text-left text-[12px] hover:bg-slate-50", typeFilter === t ? "bg-[#0B01D0]/5 text-[#0B01D0] font-medium" : "text-slate-700")}>{t === "All" ? "All Types" : t}</button>
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
              {["Organization", "Type", "Sector / Country", "Est. Capacity", "Pipeline Stage", "Last Contact", "Contacts", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-12 text-center"><p className="text-[13px] text-slate-400">No potential donors found</p></td></tr>
            ) : paginated.map((d, idx) => (
              <tr key={d.id} onClick={() => { setSelected(d); setDetailTab("info"); }}
                className={cn("hover:bg-slate-50 cursor-pointer transition-colors", idx % 2 === 1 && "bg-slate-50/50")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0B01D0]/10 flex items-center justify-center shrink-0"><Building2 size={14} className="text-[#0B01D0]" /></div>
                    <div><p className="text-[11px] font-medium text-slate-800">{d.organizationName}</p><p className="text-[10px] text-slate-400">{d.website}</p></div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", DONOR_TYPE_COLORS[d.type])}>{d.type}</span></td>
                <td className="px-4 py-3"><p className="text-[11px] text-slate-600">{d.sector}</p><p className="text-[10px] text-slate-400">{d.country}</p></td>
                <td className="px-4 py-3 text-[11px] text-slate-700 font-medium">{fmt(d.estimatedCapacity, d.currency)}</td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", STAGE_COLORS[d.pipelineStage])}>{d.pipelineStage}</span></td>
                <td className="px-4 py-3 text-[11px] text-slate-500">{d.lastContact || "—"}</td>
                <td className="px-4 py-3"><div className="flex items-center gap-1"><Users size={11} className="text-slate-400" /><span className="text-[11px] text-slate-700">{d.contacts.length}</span></div></td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <div className="relative">
                    <button onClick={() => setShowActionMenu(showActionMenu === d.id ? null : d.id)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded"><MoreHorizontal size={16} className="text-slate-400" /></button>
                    {showActionMenu === d.id && (
                      <>
                        <div className="fixed inset-0 z-[100]" onClick={() => setShowActionMenu(null)} />
                        <div className="absolute right-0 top-full mt-1 z-[101] w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                          <button onClick={() => { setShowActionMenu(null); setSelected(d); setDetailTab("info"); }} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50"><Eye size={13} className="text-slate-400" /> View Details</button>
                          <button onClick={() => { setShowActionMenu(null); setSelected(d); setDetailTab("engagements"); }} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50"><MessageSquare size={13} className="text-slate-400" /> View Pipeline</button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
        <span className="text-[11px] text-slate-400">{filtered.length > 0 ? `${(page - 1) * perPage + 1}–${Math.min(page * perPage, filtered.length)} of ` : ""}{filtered.length} potential donors</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="px-2.5 py-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40"><ChevronDown size={14} className="rotate-90 text-slate-500" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={cn("px-2.5 py-1.5 text-[11px] rounded", p === page ? "bg-[#0B01D0] text-white" : "text-slate-600 hover:bg-slate-50")}>{p}</button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="px-2.5 py-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40"><ChevronDown size={14} className="-rotate-90 text-slate-500" /></button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   LOG CONVERSATION MODAL
   ═══════════════════════════════════════════════════════════════════════════════ */
function LogConversationModal({ donor, onClose }: { donor: PotentialDonor; onClose: () => void }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "Meeting" as PipelineConversation["type"],
    subject: "",
    acParticipants: "",
    donorParticipants: "",
    summary: "",
    outcome: "",
    nextStep: "",
    updateStage: false,
    newStage: donor.pipelineStage as PipelineStage,
  });

  const handleSave = () => {
    if (!form.subject || !form.summary) return;
    const dateStr = new Date(form.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    addConversation(donor.id, {
      date: dateStr,
      type: form.type,
      subject: form.subject,
      acParticipants: form.acParticipants.split(",").map(s => s.trim()).filter(Boolean),
      donorParticipants: form.donorParticipants.split(",").map(s => s.trim()).filter(Boolean),
      summary: form.summary,
      outcome: form.outcome,
      nextStep: form.nextStep || undefined,
      stageAfter: form.updateStage ? form.newStage : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h2 className="text-[16px] font-semibold text-slate-900">Log Conversation — {donor.organizationName}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">Date *</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]" />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">Type *</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]">
                {["Meeting", "Call", "Email", "Workshop", "Site Visit", "Presentation", "Other"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 font-medium mb-1">Subject *</label>
            <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Introductory call with Program Officer" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">ACET Participants (comma-separated)</label>
              <input type="text" value={form.acParticipants} onChange={e => setForm({ ...form, acParticipants: e.target.value })} placeholder="James Owusu, Grace Tetteh" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]" />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">Donor Participants (comma-separated)</label>
              <input type="text" value={form.donorParticipants} onChange={e => setForm({ ...form, donorParticipants: e.target.value })} placeholder="Contact name" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 font-medium mb-1">Summary *</label>
            <textarea rows={3} value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} placeholder="Describe what was discussed..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">Outcome</label>
              <input type="text" value={form.outcome} onChange={e => setForm({ ...form, outcome: e.target.value })} placeholder="Result of the conversation" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]" />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">Next Step</label>
              <input type="text" value={form.nextStep} onChange={e => setForm({ ...form, nextStep: e.target.value })} placeholder="Follow-up action" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]" />
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.updateStage} onChange={e => setForm({ ...form, updateStage: e.target.checked })} className="rounded border-slate-300" />
              <span className="text-[12px] text-slate-700 font-medium">Update pipeline stage</span>
            </label>
            {form.updateStage && (
              <select value={form.newStage} onChange={e => setForm({ ...form, newStage: e.target.value as PipelineStage })} className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]">
                {PIPELINE_STAGES.filter(s => s !== "Converted").map(s => <option key={s}>{s}</option>)}
              </select>
            )}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} disabled={!form.subject || !form.summary} className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm">Save Conversation</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CREATE AGREEMENT MODAL
   ═══════════════════════════════════════════════════════════════════════════════ */
function CreateAgreementModal({ donor, onClose }: { donor: PotentialDonor; onClose: () => void }) {
  const donorConcepts = getPotentialProjects().filter(p => p.donorId === donor.id);
  const [selectedConceptId, setSelectedConceptId] = useState<number | null>(donorConcepts.length > 0 ? donorConcepts[0].id : null);
  const selectedConcept = donorConcepts.find(c => c.id === selectedConceptId) || null;

  const [form, setForm] = useState({
    title: donorConcepts.length > 0 ? `${donor.organizationName} — ${donorConcepts[0].name} Agreement` : "",
    type: "Grant Agreement" as "Grant Agreement" | "MOU" | "Contract",
    amount: donorConcepts.length > 0 ? String(donorConcepts[0].estimatedBudget) : "",
    currency: donor.currency,
    contactPerson: donor.contacts.length > 0 ? donor.contacts[0].name : "",
    startDate: "",
    endDate: "",
    terms: "",
    description: donorConcepts.length > 0 ? donorConcepts[0].description : "",
    contractFile: null as File | null,
    proposalFile: null as File | null,
  });

  const handleConceptChange = (id: number) => {
    setSelectedConceptId(id);
    const concept = donorConcepts.find(c => c.id === id);
    if (concept) {
      setForm(prev => ({
        ...prev,
        title: `${donor.organizationName} — ${concept.name} Agreement`,
        amount: String(concept.estimatedBudget),
        currency: concept.currency,
        description: concept.description,
      }));
    }
  };

  const handleSave = () => {
    if (!selectedConceptId || !form.title) return;
    const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    addAgreement({
      donorId: donor.id,
      donorName: donor.organizationName,
      conceptId: selectedConceptId,
      conceptName: selectedConcept?.name || "",
      title: form.title,
      type: form.type,
      status: "Draft",
      amount: Number(form.amount) || 0,
      currency: form.currency,
      programArea: selectedConcept?.programArea || "",
      contactPerson: form.contactPerson,
      terms: form.terms,
      startDate: form.startDate,
      endDate: form.endDate,
      contractFileName: form.contractFile?.name || null,
      proposalFileName: form.proposalFile?.name || null,
      createdDate: now,
      description: form.description,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><FileText size={18} className="text-emerald-600" /></div>
            <div>
              <h2 className="text-[16px] font-semibold text-slate-900">Create Agreement</h2>
              <p className="text-[11px] text-slate-400">{donor.organizationName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {/* Select Concept Note */}
          <div>
            <label className="block text-[11px] text-slate-500 font-medium mb-1">Select Concept Note *</label>
            <p className="text-[10px] text-slate-400 mb-2">Choose which concept note this agreement is for</p>
            {donorConcepts.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-[12px] text-amber-700">No concept notes found for this donor. Please create a concept note first.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {donorConcepts.map(c => (
                  <button key={c.id} onClick={() => handleConceptChange(c.id)}
                    className={cn("w-full p-3 rounded-lg border text-left transition-colors",
                      selectedConceptId === c.id ? "border-[#0B01D0] bg-[#0B01D0]/5" : "border-slate-200 hover:border-slate-300"
                    )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                          selectedConceptId === c.id ? "border-[#0B01D0]" : "border-slate-300"
                        )}>
                          {selectedConceptId === c.id && <div className="w-2 h-2 rounded-full bg-[#0B01D0]" />}
                        </div>
                        <span className="text-[12px] font-medium text-slate-800">{c.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">{fmt(c.estimatedBudget, c.currency)}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 pl-[26px]">{c.programArea} — {c.startDate} to {c.endDate}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 font-medium mb-1">Agreement Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Grant Agreement — Governance Evidence Program" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">Type *</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]">
                <option>Grant Agreement</option><option>MOU</option><option>Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">Amount</label>
              <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]" />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">Currency</label>
              <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]">
                <option>USD</option><option>GBP</option><option>EUR</option><option>GHS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 font-medium mb-1">Contact Person</label>
            <select value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]">
              {donor.contacts.map(c => <option key={c.id} value={c.name}>{c.name} — {c.title}</option>)}
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]" />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">End Date</label>
              <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 font-medium mb-1">Updated Terms & Conditions</label>
            <textarea rows={3} value={form.terms} onChange={e => setForm({ ...form, terms: e.target.value })} placeholder="Reporting frequency, audit requirements, milestones, etc." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] resize-none" />
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 font-medium mb-1">Description</label>
            <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Agreement scope..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] resize-none" />
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">Contract Document</label>
              <label className="flex items-center gap-2 px-3 py-3 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[#0B01D0] hover:bg-[#0B01D0]/5 transition-colors">
                <Upload size={14} className="text-slate-400" />
                <span className="text-[11px] text-slate-500 truncate">{form.contractFile ? form.contractFile.name : "Upload contract..."}</span>
                <input type="file" className="hidden" onChange={e => setForm({ ...form, contractFile: e.target.files?.[0] || null })} />
              </label>
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">Proposal Document</label>
              <label className="flex items-center gap-2 px-3 py-3 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[#0B01D0] hover:bg-[#0B01D0]/5 transition-colors">
                <Upload size={14} className="text-slate-400" />
                <span className="text-[11px] text-slate-500 truncate">{form.proposalFile ? form.proposalFile.name : "Upload proposal..."}</span>
                <input type="file" className="hidden" onChange={e => setForm({ ...form, proposalFile: e.target.files?.[0] || null })} />
              </label>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} disabled={!selectedConceptId || !form.title} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[12px] font-semibold hover:bg-emerald-700 disabled:opacity-40 shadow-sm">Create Agreement</button>
        </div>
      </div>
    </div>
  );
}