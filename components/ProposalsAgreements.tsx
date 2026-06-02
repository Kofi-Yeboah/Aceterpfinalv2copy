import { useState, useEffect } from "react";
import {
  ArrowLeft, Building2, Calendar, Check, ChevronDown, Clock,
  DollarSign, Download, Edit2, Eye, FileText, Plus, Search,
  X, MoreHorizontal, Send, AlertTriangle, CheckCircle, User, Paperclip, Upload
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  type Agreement, getAgreements, subscribe, updateAgreementStatus, getPotentialProjects
} from "../lib/donorPipelineStore";

const STATUS_COLORS: Record<string, string> = {
  Draft: "bg-slate-100 text-slate-600",
  "Under Review": "bg-amber-100 text-amber-700",
  Active: "bg-emerald-100 text-emerald-700",
  Completed: "bg-green-200 text-green-800",
  Terminated: "bg-red-100 text-red-600",
};

const TYPE_COLORS: Record<string, string> = {
  "Grant Agreement": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  MOU: "bg-amber-50 text-amber-700 border border-amber-200",
  Contract: "bg-indigo-50 text-indigo-700 border border-indigo-200",
};

const TAB_FILTERS = ["All", "Grant Agreement", "MOU", "Contract"];

const fmt = (n: number, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, minimumFractionDigits: 0 }).format(n);

export function ProposalsAgreements() {
  const [agreements, setAgreements] = useState(getAgreements());
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showStatusDD, setShowStatusDD] = useState(false);
  const [selected, setSelected] = useState<Agreement | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const unsub = subscribe(() => setAgreements(getAgreements()));
    return unsub;
  }, []);

  useEffect(() => {
    if (selected) {
      const updated = agreements.find(a => a.id === selected.id);
      if (updated) setSelected(updated);
    }
  }, [agreements]);

  const filtered = agreements.filter(a => {
    if (activeTab !== "All" && a.type !== activeTab) return false;
    if (statusFilter !== "All" && a.status !== statusFilter) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.donorName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const totalValue = filtered.reduce((s, a) => s + a.amount, 0);
  const activeCount = agreements.filter(a => a.status === "Active").length;

  /* ═══ DETAIL VIEW ═══ */
  if (selected) {
    const a = selected;
    const concept = getPotentialProjects().find(p => p.id === a.conceptId);
    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        <div className="bg-white border-b border-slate-200 shrink-0 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900"><ArrowLeft size={18} /><span className="text-[13px] font-medium">Back</span></button>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><FileText size={18} className="text-emerald-600" /></div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-[18px] font-semibold text-slate-900">{a.title}</h1>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", TYPE_COLORS[a.type])}>{a.type}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", STATUS_COLORS[a.status])}>{a.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{a.donorName} — {a.programArea}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {a.status === "Draft" && (
                <button onClick={() => updateAgreementStatus(a.id, "Active")} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-[12px] font-medium hover:bg-emerald-700 shadow-sm"><CheckCircle size={13} /> Activate</button>
              )}
              <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Edit2 size={13} /> Edit</button>
              <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Download size={13} /> Export</button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Agreement Details */}
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-indigo-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center"><FileText size={13} className="text-[#0B01D0]" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Agreement Details</h2>
                </div>
                <div className="p-5 divide-y divide-slate-100">
                  {([
                    ["Title", a.title],
                    ["Type", a.type],
                    ["Donor", a.donorName],
                    ["Concept Note", a.conceptName],
                    ["Program Area", a.programArea],
                    ["Status", a.status],
                    ["Contact Person", a.contactPerson],
                    ["Created", a.createdDate],
                  ] as [string, string][]).map(([l, v], i) => (
                    <div key={i} className="flex items-center justify-between py-2.5">
                      <span className="text-[11px] text-slate-500">{l}</span>
                      <span className="text-[11px] text-slate-800 font-medium text-right max-w-[60%] truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Financial & Timeline */}
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center"><DollarSign size={13} className="text-emerald-600" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Financial & Timeline</h2>
                </div>
                <div className="p-5 divide-y divide-slate-100">
                  {([
                    ["Amount", fmt(a.amount, a.currency)],
                    ["Currency", a.currency],
                    ["Start Date", a.startDate || "TBD"],
                    ["End Date", a.endDate || "TBD"],
                  ] as [string, string][]).map(([l, v], i) => (
                    <div key={i} className="flex items-center justify-between py-2.5">
                      <span className="text-[11px] text-slate-500">{l}</span>
                      <span className="text-[11px] text-slate-800 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {a.terms && (
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-amber-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center"><AlertTriangle size={13} className="text-amber-600" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Terms & Conditions</h2>
                </div>
                <div className="p-5"><p className="text-[12px] text-slate-600 leading-relaxed">{a.terms}</p></div>
              </section>
            )}

            {a.description && (
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-purple-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center"><FileText size={13} className="text-purple-600" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Description</h2>
                </div>
                <div className="p-5"><p className="text-[12px] text-slate-600 leading-relaxed">{a.description}</p></div>
              </section>
            )}

            {/* Documents */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 bg-blue-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center"><Paperclip size={13} className="text-blue-600" /></div>
                <h2 className="text-[13px] font-semibold text-slate-800">Documents</h2>
              </div>
              <div className="p-5 space-y-2">
                {a.contractFileName && (
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><FileText size={14} className="text-emerald-500" /></div>
                      <div>
                        <p className="text-[11px] font-medium text-slate-800">{a.contractFileName}</p>
                        <p className="text-[10px] text-slate-400">Contract Document</p>
                      </div>
                    </div>
                    <button className="text-[11px] text-blue-600 hover:underline">Download</button>
                  </div>
                )}
                {a.proposalFileName && (
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><FileText size={14} className="text-blue-500" /></div>
                      <div>
                        <p className="text-[11px] font-medium text-slate-800">{a.proposalFileName}</p>
                        <p className="text-[10px] text-slate-400">Proposal Document</p>
                      </div>
                    </div>
                    <button className="text-[11px] text-blue-600 hover:underline">Download</button>
                  </div>
                )}
                {!a.contractFileName && !a.proposalFileName && (
                  <p className="text-[12px] text-slate-400 text-center py-4">No documents attached</p>
                )}
              </div>
            </section>

            {/* Linked Concept Note */}
            {concept && (
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-slate-200 flex items-center justify-center"><FileText size={13} className="text-slate-600" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Linked Concept Note</h2>
                </div>
                <div className="p-5 divide-y divide-slate-100">
                  {([
                    ["Concept Name", concept.name],
                    ["Program Area", concept.programArea],
                    ["Est. Budget", fmt(concept.estimatedBudget, concept.currency)],
                    ["Lead", concept.leadContact],
                    ["Timeline", `${concept.startDate} — ${concept.endDate}`],
                  ] as [string, string][]).map(([l, v], i) => (
                    <div key={i} className="flex items-center justify-between py-2.5">
                      <span className="text-[11px] text-slate-500">{l}</span>
                      <span className="text-[11px] text-slate-800 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ═══ LIST VIEW ═══ */
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-slate-900">Agreements</h1>
            <p className="text-[12px] text-slate-400 mt-0.5">Manage donor agreements, grant contracts, and MOUs</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Download size={14} /> Export</button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0 flex gap-3">
        {[
          { label: "Total Agreements", value: String(agreements.length), icon: <FileText size={12} className="text-[#0B01D0]" />, bg: "bg-[#0B01D0]/10" },
          { label: "Total Value", value: fmt(totalValue), icon: <DollarSign size={12} className="text-emerald-600" />, bg: "bg-emerald-50" },
          { label: "Active", value: String(activeCount), icon: <CheckCircle size={12} className="text-green-600" />, bg: "bg-green-50" },
          { label: "Draft", value: String(agreements.filter(a => a.status === "Draft").length), icon: <Clock size={12} className="text-slate-500" />, bg: "bg-slate-100" },
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

      {/* Tabs */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
            {TAB_FILTERS.map(t => (
              <button key={t} onClick={() => { setActiveTab(t); setPage(1); }}
                className={cn("px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors",
                  activeTab === t ? "bg-[#0B01D0] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}>{t}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg w-56">
              <Search size={14} className="text-slate-400" />
              <input type="text" placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="flex-1 outline-none text-[12px] text-slate-700 placeholder:text-slate-400" />
              {search && <button onClick={() => setSearch("")}><X size={13} className="text-slate-400" /></button>}
            </div>
            <div className="relative">
              <button onClick={() => setShowStatusDD(!showStatusDD)}
                className={cn("flex items-center gap-2 px-3 py-2 border rounded-lg text-[12px] min-w-[120px]",
                  statusFilter !== "All" ? "border-[#0B01D0]/30 bg-[#0B01D0]/5" : "border-slate-200")}>
                <span className="text-slate-700">{statusFilter === "All" ? "All Statuses" : statusFilter}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {showStatusDD && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDD(false)} />
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                    {["All", "Draft", "Under Review", "Active", "Completed", "Terminated"].map(s => (
                      <button key={s} onClick={() => { setStatusFilter(s); setShowStatusDD(false); setPage(1); }}
                        className={cn("w-full px-3 py-2 text-left text-[12px] hover:bg-slate-50",
                          statusFilter === s ? "bg-[#0B01D0]/5 text-[#0B01D0] font-medium" : "text-slate-700"
                        )}>{s === "All" ? "All Statuses" : s}</button>
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
              {["Title", "Donor", "Type", "Program Area", "Amount", "Status", "Contact", "Created"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-12 text-center"><p className="text-[13px] text-slate-400">No agreements found</p></td></tr>
            ) : paginated.map((a, idx) => (
              <tr key={a.id} onClick={() => setSelected(a)} className={cn("hover:bg-slate-50 cursor-pointer transition-colors", idx % 2 === 1 && "bg-slate-50/50")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0"><FileText size={14} className="text-emerald-600" /></div>
                    <span className="text-[11px] font-medium text-slate-800 max-w-[220px] truncate">{a.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{a.donorName}</td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap", TYPE_COLORS[a.type])}>{a.type}</span></td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{a.programArea}</td>
                <td className="px-4 py-3 text-[11px] text-slate-700 font-medium">{fmt(a.amount, a.currency)}</td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", STATUS_COLORS[a.status])}>{a.status}</span></td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{a.contactPerson}</td>
                <td className="px-4 py-3 text-[11px] text-slate-500">{a.createdDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
        <span className="text-[11px] text-slate-400">{filtered.length} agreement(s)</span>
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
