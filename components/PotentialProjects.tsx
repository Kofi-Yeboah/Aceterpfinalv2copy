import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Briefcase, Calendar, ChevronDown, Clock,
  DollarSign, Download, Edit2, FileText, Plus, Search,
  Target, Upload, X, Paperclip, Send, History, User
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  type PotentialProject, getPotentialProjects, subscribe, addPotentialProject,
  submitConceptToDonors, addConceptVersion
} from "../lib/donorPipelineStore";

const TAB_FILTERS = ["Drafts", "Submitted"];

const AVAILABLE_DONOR_CODES = [
  "GATES", "USAID", "WHO", "FAO", "FCDO", "DFID", "JICA", "GIZ",
  "HEWLETT", "MASTERCARD", "ROCKEFELLER", "AFDB", "WORLD_BANK", "EU", "SIDA", "DANIDA", "NORAD"
];

const fmt = (n: number, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, minimumFractionDigits: 0 }).format(n);

export function PotentialProjects() {
  const [projects, setProjects] = useState(getPotentialProjects());
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Drafts");
  const [selected, setSelected] = useState<PotentialProject | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState<PotentialProject | null>(null);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const unsub = subscribe(() => setProjects(getPotentialProjects()));
    return unsub;
  }, []);

  useEffect(() => {
    if (selected) {
      const updated = projects.find(p => p.id === selected.id);
      if (updated) setSelected(updated);
    }
  }, [projects]);

  const filtered = projects.filter(p => {
    if (p.status !== activeTab) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.programArea.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const draftsCount = projects.filter(p => p.status === "Drafts").length;
  const submittedCount = projects.filter(p => p.status === "Submitted").length;
  const totalPipeline = projects.reduce((s, p) => s + p.estimatedBudget, 0);

  const DRAFTS_COLS = ["Concept Name", "Program Area", "Est. Budget", "Lead", "Files", "Timeline", ""];
  const SUBMITTED_COLS = ["Concept Name", "Donor Codes", "Program Area", "Est. Budget", "Lead", "Files", "Timeline"];

  const columns = activeTab === "Submitted" ? SUBMITTED_COLS : DRAFTS_COLS;
  const colSpan = columns.length;

  /* ═══ DETAIL VIEW ═══ */
  if (selected) {
    const p = selected;
    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        <div className="bg-white border-b border-slate-200 shrink-0 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900"><ArrowLeft size={18} /><span className="text-[13px] font-medium">Back</span></button>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B01D0]/10 flex items-center justify-center"><Briefcase size={18} className="text-[#0B01D0]" /></div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-[18px] font-semibold text-slate-900">{p.name}</h1>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", p.status === "Drafts" ? "bg-slate-100 text-slate-600" : "bg-purple-100 text-purple-700")}>{p.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{p.programArea} — {p.leadContact}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {p.status === "Drafts" && (
                <button onClick={() => setShowSubmitModal(p)} className="flex items-center gap-1.5 px-3 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-medium hover:bg-[#0a01b8] shadow-sm"><Send size={13} /> Submit to Donors</button>
              )}
              {p.donorCodes.length > 0 && (
                <div className="flex items-center gap-1 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                  {p.donorCodes.map((c, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-indigo-100 text-[10px] font-semibold text-indigo-700">{c}</span>
                  ))}
                </div>
              )}
              <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Edit2 size={13} /> Edit</button>
              <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Download size={13} /> Export</button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-indigo-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center"><Briefcase size={13} className="text-[#0B01D0]" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Concept Details</h2>
                </div>
                <div className="p-5 divide-y divide-slate-100">
                  {([
                    ["Concept Name", p.name],
                    ["Program Area", p.programArea],
                    ["Status", p.status],
                    ["Lead Contact", p.leadContact],
                    ["Last Updated", p.lastUpdated],
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
                  <h2 className="text-[13px] font-semibold text-slate-800">Financial & Timeline</h2>
                </div>
                <div className="p-5 divide-y divide-slate-100">
                  {([
                    ["Estimated Budget", fmt(p.estimatedBudget, p.currency)],
                    ["Currency", p.currency],
                    ["Start Date", p.startDate],
                    ["End Date", p.endDate],
                    ...(p.donorCodes.length > 0 ? [["Donor Codes", p.donorCodes.join(", ")]] : []),
                  ] as [string, string][]).map(([l, v], i) => (
                    <div key={i} className="flex items-center justify-between py-2.5">
                      <span className="text-[11px] text-slate-500">{l}</span>
                      <span className="text-[11px] text-slate-800 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {p.outcomeGoal && (
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-amber-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center"><Target size={13} className="text-amber-600" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Outcome / Goal</h2>
                </div>
                <div className="p-5"><p className="text-[12px] text-slate-600 leading-relaxed">{p.outcomeGoal}</p></div>
              </section>
            )}

            {p.description && (
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-purple-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center"><FileText size={13} className="text-purple-600" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Description</h2>
                </div>
                <div className="p-5"><p className="text-[12px] text-slate-600 leading-relaxed">{p.description}</p></div>
              </section>
            )}

            {/* Files */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 bg-blue-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center"><Paperclip size={13} className="text-blue-600" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Supporting Documents</h2>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{p.files?.length || 0}</span>
                </div>
              </div>
              <div className="p-5">
                {(p.files?.length || 0) === 0 ? (
                  <p className="text-[12px] text-slate-400 text-center py-4">No files uploaded</p>
                ) : (
                  <div className="space-y-2">
                    {p.files.map((f, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FileText size={14} className="text-blue-500" />
                          </div>
                          <div>
                            <p className="text-[11px] font-medium text-slate-800">{f.name}</p>
                            <p className="text-[10px] text-slate-400">{f.size}</p>
                          </div>
                        </div>
                        <button className="text-[11px] text-blue-600 hover:underline">Download</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Version History */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-slate-200 flex items-center justify-center"><History size={13} className="text-slate-600" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Version History</h2>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{p.versionHistory.length}</span>
                </div>
                <button onClick={() => setShowVersionModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]"><Plus size={12} /> Add Version</button>
              </div>
              <div className="p-5">
                {p.versionHistory.length === 0 ? (
                  <div className="text-center py-6">
                    <History size={24} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-[12px] text-slate-400">No version history yet</p>
                    <button onClick={() => setShowVersionModal(true)} className="mt-2 text-[11px] text-[#0B01D0] hover:underline font-medium">Log first iteration</button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-4 top-3 bottom-3 w-px bg-slate-200" />
                    <div className="space-y-4">
                      {[...p.versionHistory].reverse().map((v) => (
                        <div key={v.version} className="relative pl-10">
                          <div className="absolute left-2 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-[#0B01D0] flex items-center justify-center z-10">
                            <span className="text-[8px] font-bold text-[#0B01D0]">{v.version}</span>
                          </div>
                          <div className="bg-slate-50 rounded-lg border border-slate-100 p-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-[#0B01D0]/10 text-[10px] font-semibold text-[#0B01D0]">v{v.version}</span>
                                <span className="text-[11px] font-medium text-slate-800">{v.changes}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-slate-400">
                                <User size={10} />
                                <span className="text-[10px]">{v.author}</span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-400">
                                <Calendar size={10} />
                                <span className="text-[10px]">{v.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {showSubmitModal && <SubmitToDonorsModal concept={showSubmitModal} onClose={() => setShowSubmitModal(null)} />}
        {showVersionModal && <AddVersionModal conceptId={p.id} onClose={() => setShowVersionModal(false)} />}
      </div>
    );
  }

  /* ═══ LIST VIEW ═══ */
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-slate-900">Concepts</h1>
            <p className="text-[12px] text-slate-400 mt-0.5">Manage project concepts, drafts, and submissions</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Download size={14} /> Export</button>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-medium hover:bg-[#0a01b8] shadow-sm"><Plus size={14} /> Add Concept</button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0 flex gap-3">
        {[
          { label: "Total Concepts", value: String(projects.length), icon: <Briefcase size={12} className="text-[#0B01D0]" />, bg: "bg-[#0B01D0]/10" },
          { label: "Drafts", value: String(draftsCount), icon: <FileText size={12} className="text-slate-500" />, bg: "bg-slate-100" },
          { label: "Submitted", value: String(submittedCount), icon: <Target size={12} className="text-purple-600" />, bg: "bg-purple-50" },
          { label: "Total Value", value: fmt(totalPipeline), icon: <DollarSign size={12} className="text-emerald-600" />, bg: "bg-emerald-50" },
        ].map((c, i) => (
          <div key={i} className="flex-1 bg-slate-50 rounded-lg border border-slate-100 px-3 py-2">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className={cn("w-5 h-5 rounded flex items-center justify-center", c.bg)}>{c.icon}</div>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">{c.label}</span>
            </div>
            <p className="text-[15px] text-slate-800 font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
            {TAB_FILTERS.map(t => (
              <button key={t} onClick={() => { setActiveTab(t); setPage(1); }}
                className={cn("px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors",
                  activeTab === t ? "bg-[#0B01D0] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}>{t}
                <span className={cn("ml-1.5 px-1.5 py-0.5 rounded-full text-[9px]",
                  activeTab === t ? "bg-white/20" : "bg-slate-200/80"
                )}>{t === "Drafts" ? draftsCount : submittedCount}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg w-56">
            <Search size={14} className="text-slate-400" />
            <input type="text" placeholder="Search concepts..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="flex-1 outline-none text-[12px] text-slate-700 placeholder:text-slate-400" />
            {search && <button onClick={() => setSearch("")}><X size={13} className="text-slate-400" /></button>}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              {columns.map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr><td colSpan={colSpan} className="px-4 py-12 text-center"><p className="text-[13px] text-slate-400">No concepts found</p></td></tr>
            ) : paginated.map((p, idx) => (
              <tr key={p.id} onClick={() => setSelected(p)} className={cn("hover:bg-slate-50 cursor-pointer transition-colors", idx % 2 === 1 && "bg-slate-50/50")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0B01D0]/10 flex items-center justify-center shrink-0"><Briefcase size={14} className="text-[#0B01D0]" /></div>
                    <span className="text-[11px] font-medium text-slate-800 max-w-[200px] truncate">{p.name}</span>
                  </div>
                </td>
                {activeTab === "Submitted" && (
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.donorCodes.length > 0 ? p.donorCodes.map((code, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[10px] font-semibold text-indigo-700">{code}</span>
                      )) : <span className="text-[10px] text-slate-400">—</span>}
                    </div>
                  </td>
                )}
                <td className="px-4 py-3 text-[11px] text-slate-600">{p.programArea}</td>
                <td className="px-4 py-3 text-[11px] text-slate-700 font-medium">{fmt(p.estimatedBudget, p.currency)}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{p.leadContact}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Paperclip size={12} className="text-slate-400" />
                    <span className="text-[11px] text-slate-600">{p.files?.length || 0}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-500">{p.startDate} — {p.endDate}</td>
                {activeTab === "Drafts" && (
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setShowSubmitModal(p)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[10px] font-medium hover:bg-[#0a01b8] shadow-sm"
                    ><Send size={10} /> Submit</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
        <span className="text-[11px] text-slate-400">{filtered.length} concept(s)</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="px-2.5 py-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40"><ChevronDown size={14} className="rotate-90 text-slate-500" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
              <button key={pg} onClick={() => setPage(pg)} className={cn("px-2.5 py-1.5 text-[11px] rounded", pg === page ? "bg-[#0B01D0] text-white" : "text-slate-600 hover:bg-slate-50")}>{pg}</button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="px-2.5 py-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40"><ChevronDown size={14} className="-rotate-90 text-slate-500" /></button>
          </div>
        )}
      </div>

      {showAddModal && <AddConceptModal onClose={() => setShowAddModal(false)} />}
      {showSubmitModal && <SubmitToDonorsModal concept={showSubmitModal} onClose={() => setShowSubmitModal(null)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SUBMIT TO DONORS MODAL
   ═══════════════════════════════════════════════════════════════════════════════ */
function SubmitToDonorsModal({ concept, onClose }: { concept: PotentialProject; onClose: () => void }) {
  const [selectedCodes, setSelectedCodes] = useState<string[]>(concept.donorCodes);
  const [customCode, setCustomCode] = useState("");
  const [searchCode, setSearchCode] = useState("");

  const toggleCode = (code: string) => {
    setSelectedCodes(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };

  const addCustom = () => {
    const code = customCode.trim().toUpperCase();
    if (code && !selectedCodes.includes(code)) {
      setSelectedCodes(prev => [...prev, code]);
      setCustomCode("");
    }
  };

  const filteredCodes = AVAILABLE_DONOR_CODES.filter(c =>
    !searchCode || c.toLowerCase().includes(searchCode.toLowerCase())
  );

  const handleSubmit = () => {
    if (selectedCodes.length === 0) return;
    submitConceptToDonors(concept.id, selectedCodes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B01D0]/10 flex items-center justify-center"><Send size={18} className="text-[#0B01D0]" /></div>
            <div>
              <h2 className="text-[16px] font-semibold text-slate-900">Submit to Donors</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">{concept.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-5">
          <div>
            <label className="block text-[12px] text-slate-700 font-semibold mb-2">Select Donor Codes <span className="text-red-500">*</span></label>
            <p className="text-[11px] text-slate-400 mb-3">Choose the donors you want to submit this concept to.</p>

            {/* Selected codes */}
            {selectedCodes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                {selectedCodes.map(code => (
                  <button key={code} onClick={() => toggleCode(code)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8] transition-colors">
                    {code} <X size={11} />
                  </button>
                ))}
              </div>
            )}

            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg mb-3">
              <Search size={13} className="text-slate-400" />
              <input type="text" placeholder="Search donor codes..." value={searchCode} onChange={e => setSearchCode(e.target.value)}
                className="flex-1 outline-none text-[12px] text-slate-700 placeholder:text-slate-400" />
            </div>

            {/* Available codes grid */}
            <div className="grid grid-cols-4 gap-1.5 max-h-[180px] overflow-auto">
              {filteredCodes.map(code => (
                <button key={code} onClick={() => toggleCode(code)}
                  className={cn(
                    "px-2.5 py-2 rounded-lg text-[11px] font-semibold transition-colors border text-center",
                    selectedCodes.includes(code)
                      ? "bg-[#0B01D0] text-white border-[#0B01D0]"
                      : "bg-white text-slate-700 border-slate-200 hover:border-[#0B01D0]/30 hover:bg-[#0B01D0]/5"
                  )}>{code}</button>
              ))}
            </div>
          </div>

          {/* Custom code */}
          <div>
            <label className="block text-[12px] text-slate-700 font-semibold mb-1.5">Add Custom Donor Code</label>
            <div className="flex items-center gap-2">
              <input type="text" value={customCode} onChange={e => setCustomCode(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addCustom()}
                placeholder="e.g., BMGF"
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] placeholder:text-slate-400" />
              <button onClick={addCustom} disabled={!customCode.trim()}
                className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-[12px] font-medium hover:bg-slate-200 disabled:opacity-40"><Plus size={14} /></button>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-[11px] text-amber-800">
              <strong>Note:</strong> Submitting will move this concept from <strong>Drafts</strong> to <strong>Submitted</strong> and record it in the version history. This action tracks the submission to {selectedCodes.length} donor(s).
            </p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">{selectedCodes.length} donor(s) selected</span>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2.5 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50 font-medium">Cancel</button>
            <button onClick={handleSubmit} disabled={selectedCodes.length === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm"><Send size={13} /> Submit Concept</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ADD VERSION MODAL
   ═══════════════════════════════════════════════════════════════════════════════ */
function AddVersionModal({ conceptId, onClose }: { conceptId: number; onClose: () => void }) {
  const [author, setAuthor] = useState("");
  const [changes, setChanges] = useState("");

  const handleSave = () => {
    if (!author || !changes) return;
    addConceptVersion(conceptId, { author, changes });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><History size={18} className="text-slate-600" /></div>
            <div>
              <h2 className="text-[16px] font-semibold text-slate-900">Log New Version</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Record a concept iteration</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[12px] text-slate-700 font-semibold mb-1.5">Author <span className="text-red-500">*</span></label>
            <input type="text" value={author} onChange={e => setAuthor(e.target.value)}
              placeholder="e.g., Grace Tetteh"
              className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 placeholder:text-slate-400" />
          </div>
          <div>
            <label className="block text-[12px] text-slate-700 font-semibold mb-1.5">Changes Description <span className="text-red-500">*</span></label>
            <textarea rows={3} value={changes} onChange={e => setChanges(e.target.value)}
              placeholder="Describe what changed in this version..."
              className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 resize-none placeholder:text-slate-400" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50 font-medium">Cancel</button>
          <button onClick={handleSave} disabled={!author || !changes}
            className="px-4 py-2.5 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm">Save Version</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ADD CONCEPT MODAL
   ═══════════════════════════════════════════════════════════════════════════════ */
function AddConceptModal({ onClose }: { onClose: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);
  const [inputMode, setInputMode] = useState<"manual" | "upload">("manual");
  const [form, setForm] = useState({
    name: "",
    description: "",
    outcomeGoal: "",
    programArea: "",
    leadContact: "",
    estimatedBudget: "",
    currency: "USD",
    startDate: "",
    endDate: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; type: string }[]>([]);
  const [dragOver, setDragOver] = useState(false);

  // Upload tab state
  const [uploadForm, setUploadForm] = useState({ title: "", description: "" });
  const [conceptFile, setConceptFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [uploadDragOver, setUploadDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList).map(f => ({
      name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      type: f.name.split(".").pop() || "file",
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleConceptFileUpload = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const allowedExts = ["pdf", "doc", "docx"];
    if (!allowedExts.includes(ext)) {
      setUploadError("Invalid file type. Only PDF and Word documents (.pdf, .doc, .docx) are accepted.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10 MB. Please upload a smaller file.");
      return;
    }
    setUploadError("");
    setConceptFile({
      name: file.name,
      size: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`,
      type: ext,
    });
  };

  const handleSave = () => {
    if (inputMode === "manual") {
      if (!form.name || !form.description || !form.outcomeGoal || !form.programArea || !form.leadContact || !form.estimatedBudget) return;
      addPotentialProject({
        name: form.name,
        donorId: null,
        donorName: "",
        donorCodes: [],
        proposalId: null,
        programArea: form.programArea,
        status: "Drafts",
        estimatedBudget: Number(form.estimatedBudget),
        currency: form.currency,
        startDate: form.startDate || "TBD",
        endDate: form.endDate || "TBD",
        probability: 0,
        description: form.description,
        outcomeGoal: form.outcomeGoal,
        leadContact: form.leadContact,
        lastUpdated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        files: uploadedFiles,
        versionHistory: [{ version: 1, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), author: form.leadContact, changes: "Initial concept created" }],
      });
    } else {
      if (!uploadForm.title || !uploadForm.description || !conceptFile) return;
      addPotentialProject({
        name: uploadForm.title,
        donorId: null,
        donorName: "",
        donorCodes: [],
        proposalId: null,
        programArea: "—",
        status: "Drafts",
        estimatedBudget: 0,
        currency: "USD",
        startDate: "TBD",
        endDate: "TBD",
        probability: 0,
        description: uploadForm.description,
        outcomeGoal: "—",
        leadContact: "—",
        lastUpdated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        files: [conceptFile],
        versionHistory: [{ version: 1, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), author: "—", changes: "Concept uploaded from document" }],
      });
    }
    onClose();
  };

  const isManualValid = form.name && form.description && form.outcomeGoal && form.programArea && form.leadContact && form.estimatedBudget;
  const isUploadValid = uploadForm.title && uploadForm.description && conceptFile;
  const isValid = inputMode === "manual" ? isManualValid : isUploadValid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-[18px] font-semibold text-slate-900">Add New Concept</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">Create a new project concept</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 pb-0 shrink-0">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
            <button
              onClick={() => setInputMode("manual")}
              className={`px-4 py-1.5 rounded-lg text-[12px] font-medium transition-colors min-w-[120px] ${
                inputMode === "manual" ? "bg-[#0B01D0] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Manual Input
            </button>
            <button
              onClick={() => setInputMode("upload")}
              className={`px-4 py-1.5 rounded-lg text-[12px] font-medium transition-colors min-w-[120px] ${
                inputMode === "upload" ? "bg-[#0B01D0] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Upload
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-5">
          {inputMode === "manual" && (
            <>
              <div>
                <label className="block text-[12px] text-slate-700 font-semibold mb-1.5">Concept Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter concept name"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 placeholder:text-slate-400" />
              </div>
              <div>
                <label className="block text-[12px] text-slate-700 font-semibold mb-1.5">Description <span className="text-red-500">*</span></label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the concept"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 resize-none placeholder:text-slate-400" />
              </div>
              <div>
                <label className="block text-[12px] text-slate-700 font-semibold mb-1.5">Outcome / Goal <span className="text-red-500">*</span></label>
                <textarea rows={2} value={form.outcomeGoal} onChange={e => setForm({ ...form, outcomeGoal: e.target.value })}
                  placeholder="What is the expected outcome?"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 resize-none placeholder:text-slate-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-slate-700 font-semibold mb-1.5">Program Area <span className="text-red-500">*</span></label>
                  <input type="text" value={form.programArea} onChange={e => setForm({ ...form, programArea: e.target.value })}
                    placeholder="e.g., Education, Health"
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block text-[12px] text-slate-700 font-semibold mb-1.5">Lead Contact <span className="text-red-500">*</span></label>
                  <input type="text" value={form.leadContact} onChange={e => setForm({ ...form, leadContact: e.target.value })}
                    placeholder="Enter lead contact name"
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 placeholder:text-slate-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-slate-700 font-semibold mb-1.5">Estimated Budget <span className="text-red-500">*</span></label>
                  <input type="number" value={form.estimatedBudget} onChange={e => setForm({ ...form, estimatedBudget: e.target.value })}
                    placeholder="0"
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block text-[12px] text-slate-700 font-semibold mb-1.5">Currency <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 appearance-none bg-white">
                      <option>USD</option><option>GBP</option><option>EUR</option><option>GHS</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-slate-700 font-semibold mb-1.5">Start Date</label>
                  <input type="text" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                    placeholder="e.g., Jan 2027"
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block text-[12px] text-slate-700 font-semibold mb-1.5">End Date</label>
                  <input type="text" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                    placeholder="e.g., Dec 2029"
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 placeholder:text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] text-slate-700 font-semibold mb-1.5">Upload Supporting Documents</label>
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-lg py-8 flex flex-col items-center justify-center cursor-pointer transition-colors",
                    dragOver ? "border-[#0B01D0] bg-[#0B01D0]/5" : "border-slate-200 hover:border-slate-300 bg-slate-50"
                  )}
                >
                  <Upload size={22} className="text-slate-400 mb-2" />
                  <p className="text-[12px] text-[#0B01D0] font-medium">Click to upload or drag and drop</p>
                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-blue-500" />
                          <span className="text-[11px] text-slate-700 font-medium">{f.name}</span>
                          <span className="text-[10px] text-slate-400">{f.size}</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setUploadedFiles(prev => prev.filter((_, j) => j !== i)); }} className="text-slate-400 hover:text-red-500"><X size={13} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {inputMode === "upload" && (
            <>
              <div>
                <label className="block text-[12px] text-slate-700 font-semibold mb-1.5">Concept Title <span className="text-red-500">*</span></label>
                <input type="text" value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="Enter the concept title"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 placeholder:text-slate-400" />
              </div>
              <div>
                <label className="block text-[12px] text-slate-700 font-semibold mb-1.5">Brief Description <span className="text-red-500">*</span></label>
                <textarea rows={3} value={uploadForm.description} onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="Provide a brief description of the concept"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 resize-none placeholder:text-slate-400" />
              </div>
              <div>
                <label className="block text-[12px] text-slate-700 font-semibold mb-1.5">Upload Concept Document <span className="text-red-500">*</span></label>
                <div
                  onDragOver={e => { e.preventDefault(); setUploadDragOver(true); }}
                  onDragLeave={() => setUploadDragOver(false)}
                  onDrop={e => { e.preventDefault(); setUploadDragOver(false); handleConceptFileUpload(e.dataTransfer.files); }}
                  onClick={() => uploadFileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-lg py-10 flex flex-col items-center justify-center cursor-pointer transition-colors",
                    uploadDragOver ? "border-[#0B01D0] bg-[#0B01D0]/5" : "border-slate-200 hover:border-slate-300 bg-slate-50"
                  )}
                >
                  <div className="w-12 h-12 rounded-full bg-[#0B01D0]/10 flex items-center justify-center mb-3">
                    <Upload size={22} className="text-[#0B01D0]" />
                  </div>
                  <p className="text-[13px] text-[#0B01D0] font-medium">Click to upload or drag and drop</p>
                  <p className="text-[11px] text-slate-400 mt-1">Select your concept note document</p>
                  <input ref={uploadFileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => handleConceptFileUpload(e.target.files)} />
                </div>

                {/* File specifications */}
                <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                  <p className="text-[11px] font-semibold text-slate-600 mb-2">File Requirements</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-slate-400" />
                      <p className="text-[11px] text-slate-500"><span className="font-medium text-slate-600">Accepted formats:</span> PDF (.pdf), Word Document (.doc, .docx)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-slate-400" />
                      <p className="text-[11px] text-slate-500"><span className="font-medium text-slate-600">Maximum file size:</span> 10 MB</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-slate-400" />
                      <p className="text-[11px] text-slate-500"><span className="font-medium text-slate-600">Note:</span> Only one document can be uploaded per concept</p>
                    </div>
                  </div>
                </div>

                {/* Error message */}
                {uploadError && (
                  <div className="mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-[11px] text-red-600 font-medium">{uploadError}</p>
                  </div>
                )}

                {/* Uploaded file preview */}
                {conceptFile && (
                  <div className="mt-3 flex items-center justify-between px-3 py-2.5 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-green-600" />
                      <div>
                        <p className="text-[12px] text-green-800 font-medium">{conceptFile.name}</p>
                        <p className="text-[10px] text-green-600">{conceptFile.size} &middot; {conceptFile.type.toUpperCase()}</p>
                      </div>
                    </div>
                    <button onClick={() => { setConceptFile(null); setUploadError(""); }} className="p-1 hover:bg-green-100 rounded">
                      <X size={14} className="text-green-600" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50 font-medium">Cancel</button>
          <button onClick={handleSave} disabled={!isValid} className="px-4 py-2.5 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm">
            {inputMode === "manual" ? "Save Concept" : "Upload Concept"}
          </button>
        </div>
      </div>
    </div>
  );
}
