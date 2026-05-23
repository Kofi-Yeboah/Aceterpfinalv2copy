import { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, MoreHorizontal, X, FileText, Tag, Clock,
  Upload, Eye, Archive, CheckCircle, XCircle, Folder, ChevronRight,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  subscribe, getAdvocacyDocuments, getDocumentVersions, getAllDocumentVersions,
  addAdvocacyDocument, updateDocumentStatus, addDocumentVersion, updateDocVersionStatus,
  type AdvocacyDocument, type DocumentVersion,
} from "../lib/advocacyStore";

const DOC_TYPES: AdvocacyDocument["type"][] = ["Policy Brief", "Fact Sheet", "Talking Points", "Media Kit", "Memo", "Report", "Presentation"];
const DOC_STATUSES: AdvocacyDocument["status"][] = ["Draft", "Under Review", "Approved", "Published", "Archived"];
const AUDIENCE_TYPES: AdvocacyDocument["audienceType"][] = ["Policymakers", "Media", "Public", "Internal", "Donors"];
const ISSUE_AREAS = ["Digital Economy", "Youth Employment", "Trade Policy", "Climate Finance", "Gender Equality", "Agriculture", "Infrastructure", "Health Systems", "SME Development", "Governance", "Education", "Energy"];

const TYPE_COLORS: Record<string, string> = {
  "Policy Brief": "bg-blue-50 text-blue-700 border border-blue-200",
  "Fact Sheet": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Talking Points": "bg-purple-50 text-purple-700 border border-purple-200",
  "Media Kit": "bg-rose-50 text-rose-700 border border-rose-200",
  Memo: "bg-amber-50 text-amber-700 border border-amber-200",
  Report: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  Presentation: "bg-teal-50 text-teal-700 border border-teal-200",
};
const STATUS_COLORS: Record<string, string> = {
  Draft: "bg-slate-100 text-slate-700", "Under Review": "bg-amber-50 text-amber-700",
  Approved: "bg-emerald-50 text-emerald-700", Published: "bg-blue-50 text-blue-700",
  Archived: "bg-slate-50 text-slate-500",
};
const VER_STATUS_COLORS: Record<string, string> = {
  Draft: "bg-slate-100 text-slate-600", "Pending Approval": "bg-amber-50 text-amber-700",
  Approved: "bg-emerald-50 text-emerald-700", Rejected: "bg-red-50 text-red-700",
};

export function AdvocacyContentCollateral() {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick(t => t + 1)), []);

  const [activeTab, setActiveTab] = useState<"documents" | "versions" | "tags">("documents");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [issueFilter, setIssueFilter] = useState("all");
  const [showTypeDD, setShowTypeDD] = useState(false);
  const [showStatusDD, setShowStatusDD] = useState(false);
  const [showIssueDD, setShowIssueDD] = useState(false);
  const [showActionDD, setShowActionDD] = useState<number | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [showAddVersion, setShowAddVersion] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedAreas, setExpandedAreas] = useState<string[]>([]);
  const itemsPerPage = 8;

  const documents = getAdvocacyDocuments();
  const allVersions = getAllDocumentVersions();

  const filtered = documents.filter(d => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || d.title.toLowerCase().includes(q) || d.author.toLowerCase().includes(q) || d.campaign.toLowerCase().includes(q);
    const matchType = typeFilter === "all" || d.type === typeFilter;
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    const matchIssue = issueFilter === "all" || d.issueAreas.includes(issueFilter);
    return matchSearch && matchType && matchStatus && matchIssue;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const tabs = [
    { key: "documents" as const, label: "Documents", icon: <FileText size={14} /> },
    { key: "versions" as const, label: "Version History", icon: <Clock size={14} /> },
    { key: "tags" as const, label: "Tags & Themes", icon: <Tag size={14} /> },
  ];

  const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 placeholder:text-slate-400";
  const labelCls = "block text-[11px] text-slate-500 font-medium mb-1.5";

  /* Group documents by issue area for Tags tab */
  const docsByIssueArea = ISSUE_AREAS.map(area => ({
    area,
    docs: documents.filter(d => d.issueAreas.includes(area)),
  })).filter(g => g.docs.length > 0);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Content & Collateral</h1>
        {activeTab === "documents" && (
          <button onClick={() => setShowAddDoc(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] shadow-sm">
            <Plus size={16} /><span className="text-sm font-medium">Add Document</span>
          </button>
        )}
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

      {/* ═══ DOCUMENTS TAB ═══ */}
      {activeTab === "documents" && (
        <>
          <div className="px-6 py-3 bg-white border-b border-slate-200">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
                <Search size={20} className="text-slate-400" />
                <input type="text" placeholder="Search documents..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400" />
              </div>
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <button onClick={() => { setShowTypeDD(!showTypeDD); setShowStatusDD(false); setShowIssueDD(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 shadow-sm min-w-[140px]">
                    <span className="text-sm text-slate-900 truncate">{typeFilter === "all" ? "All Types" : typeFilter}</span>
                    <ChevronDown size={16} className="text-slate-600" />
                  </button>
                  {showTypeDD && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowTypeDD(false)} />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                        {["all", ...DOC_TYPES].map(t => (
                          <button key={t} onClick={() => { setTypeFilter(t); setShowTypeDD(false); }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700">{t === "all" ? "All Types" : t}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="relative">
                  <button onClick={() => { setShowStatusDD(!showStatusDD); setShowTypeDD(false); setShowIssueDD(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 shadow-sm min-w-[130px]">
                    <span className="text-sm text-slate-900 truncate">{statusFilter === "all" ? "All Statuses" : statusFilter}</span>
                    <ChevronDown size={16} className="text-slate-600" />
                  </button>
                  {showStatusDD && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowStatusDD(false)} />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                        {["all", ...DOC_STATUSES].map(s => (
                          <button key={s} onClick={() => { setStatusFilter(s); setShowStatusDD(false); }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700">{s === "all" ? "All Statuses" : s}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="relative">
                  <button onClick={() => { setShowIssueDD(!showIssueDD); setShowTypeDD(false); setShowStatusDD(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 shadow-sm min-w-[150px]">
                    <span className="text-sm text-slate-900 truncate">{issueFilter === "all" ? "All Issue Areas" : issueFilter}</span>
                    <ChevronDown size={16} className="text-slate-600" />
                  </button>
                  {showIssueDD && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowIssueDD(false)} />
                      <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-[300px] overflow-auto">
                        {["all", ...ISSUE_AREAS].map(a => (
                          <button key={a} onClick={() => { setIssueFilter(a); setShowIssueDD(false); }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700">{a === "all" ? "All Issue Areas" : a}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  {["Title", "Type", "Campaign", "Audience", "Status", "Version", "Last Modified", "Author", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.length > 0 ? paginated.map((d, idx) => (
                  <tr key={d.id} className={cn("hover:bg-slate-50 transition-colors", idx % 2 === 1 && "bg-slate-50/50")}>
                    <td className="px-4 py-3">
                      <p className="text-[11px] text-slate-900 font-medium">{d.title}</p>
                      <p className="text-[9px] text-slate-400">{d.fileName} ({d.fileSize})</p>
                    </td>
                    <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", TYPE_COLORS[d.type])}>{d.type}</span></td>
                    <td className="px-4 py-3"><p className="text-[11px] text-slate-600">{d.campaign}</p></td>
                    <td className="px-4 py-3"><p className="text-[11px] text-slate-600">{d.audienceType}</p></td>
                    <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", STATUS_COLORS[d.status])}>{d.status}</span></td>
                    <td className="px-4 py-3"><p className="text-[11px] text-slate-600">v{d.currentVersion}</p></td>
                    <td className="px-4 py-3"><p className="text-[11px] text-slate-600">{new Date(d.lastModified).toLocaleDateString()}</p></td>
                    <td className="px-4 py-3"><p className="text-[11px] text-slate-600">{d.author}</p></td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <button onClick={() => setShowActionDD(showActionDD === d.id ? null : d.id)} className="p-1.5 hover:bg-slate-100 rounded">
                          <MoreHorizontal size={16} className="text-slate-600" />
                        </button>
                        {showActionDD === d.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowActionDD(null)} />
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                              <button onClick={() => { setSelectedDoc(d.id); setActiveTab("versions"); setShowActionDD(null); }} className="w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Clock size={12} /> Versions</button>
                              {d.status !== "Archived" && <button onClick={() => { updateDocumentStatus(d.id, "Archived"); setShowActionDD(null); }} className="w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Archive size={12} /> Archive</button>}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={9} className="px-4 py-12 text-center text-[13px] text-slate-400">No documents found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-slate-200 shrink-0">
              <span className="text-[11px] text-slate-400">{filtered.length} document(s)</span>
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
        </>
      )}

      {/* ═══ VERSION HISTORY TAB ═══ */}
      {activeTab === "versions" && (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Document selector */}
            <div className="mb-6">
              <label className={labelCls}>Select Document</label>
              <select value={selectedDoc ?? ""} onChange={e => setSelectedDoc(e.target.value ? Number(e.target.value) : null)} className={inputCls}>
                <option value="">Choose a document to view versions...</option>
                {documents.map(d => <option key={d.id} value={d.id}>{d.title} (v{d.currentVersion})</option>)}
              </select>
            </div>

            {selectedDoc !== null ? (() => {
              const doc = documents.find(d => d.id === selectedDoc);
              const versions = getDocumentVersions(selectedDoc).sort((a, b) => b.version - a.version);
              if (!doc) return null;
              return (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-indigo-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-[#0B01D0]" />
                      <h3 className="text-[13px] font-semibold text-slate-800">{doc.title}</h3>
                      <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-medium", STATUS_COLORS[doc.status])}>{doc.status}</span>
                    </div>
                    <button onClick={() => setShowAddVersion(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]">
                      <Plus size={12} /> New Version
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {versions.map(v => (
                      <div key={v.id} className="px-5 py-4 hover:bg-slate-50">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-semibold text-slate-900">Version {v.version}</span>
                            <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-medium", VER_STATUS_COLORS[v.status])}>{v.status}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{new Date(v.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{v.changes}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-slate-400">By {v.author}{v.approvedBy ? ` | Approved by ${v.approvedBy}` : ""}</span>
                          {v.status === "Pending Approval" && (
                            <div className="flex gap-2">
                              <button onClick={() => updateDocVersionStatus(v.id, "Approved", "Admin")} className="flex items-center gap-1 px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-medium hover:bg-emerald-700">
                                <CheckCircle size={10} /> Approve
                              </button>
                              <button onClick={() => updateDocVersionStatus(v.id, "Rejected")} className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded text-[10px] font-medium hover:bg-red-700">
                                <XCircle size={10} /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {versions.length === 0 && <div className="px-5 py-8 text-center text-[12px] text-slate-400">No versions recorded</div>}
                  </div>
                </div>
              );
            })() : (
              <div className="text-center py-16 text-slate-400">
                <Clock size={32} className="mx-auto mb-3" />
                <p className="text-[13px]">Select a document to view its version history</p>
              </div>
            )}
          </div>

          {/* Add Version Modal */}
          {showAddVersion && selectedDoc !== null && (() => {
            const doc = documents.find(d => d.id === selectedDoc);
            if (!doc) return null;
            return <AddVersionModal documentId={selectedDoc} currentVersion={doc.currentVersion} onSave={v => { addDocumentVersion(v); setShowAddVersion(false); }} onClose={() => setShowAddVersion(false)} />;
          })()}
        </div>
      )}

      {/* ═══ TAGS & THEMES TAB ═══ */}
      {activeTab === "tags" && (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-3">
            {docsByIssueArea.map(group => {
              const isExpanded = expandedAreas.includes(group.area);
              const campaigns = [...new Set(group.docs.map(d => d.campaign))];
              return (
                <div key={group.area} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <button onClick={() => setExpandedAreas(prev => prev.includes(group.area) ? prev.filter(a => a !== group.area) : [...prev, group.area])}
                    className="w-full px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Folder size={16} className="text-[#0B01D0]" />
                      <span className="text-[13px] font-semibold text-slate-800">{group.area}</span>
                      <span className="text-[10px] bg-[#0B01D0]/10 text-[#0B01D0] px-2 py-0.5 rounded-full font-medium">{group.docs.length} docs</span>
                    </div>
                    <ChevronRight size={16} className={cn("text-slate-400 transition-transform", isExpanded && "rotate-90")} />
                  </button>
                  {isExpanded && (
                    <div className="border-t border-slate-100">
                      {campaigns.map(campaign => {
                        const campaignDocs = group.docs.filter(d => d.campaign === campaign);
                        return (
                          <div key={campaign} className="border-b border-slate-50 last:border-0">
                            <div className="px-5 py-2 bg-slate-50/50 flex items-center gap-2">
                              <Tag size={12} className="text-slate-400" />
                              <span className="text-[11px] font-medium text-slate-600">{campaign}</span>
                              <span className="text-[9px] text-slate-400">({campaignDocs.length})</span>
                            </div>
                            <div className="divide-y divide-slate-50">
                              {campaignDocs.map(d => (
                                <div key={d.id} className="px-5 py-2.5 flex items-center justify-between hover:bg-slate-50">
                                  <div className="flex items-center gap-3">
                                    <FileText size={14} className="text-slate-400" />
                                    <div>
                                      <p className="text-[11px] font-medium text-slate-800">{d.title}</p>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-medium", TYPE_COLORS[d.type])}>{d.type}</span>
                                        <span className="text-[9px] text-slate-400">v{d.currentVersion} | {d.author}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-medium", STATUS_COLORS[d.status])}>{d.status}</span>
                                    <div className="flex flex-wrap gap-1">
                                      {d.tags.slice(0, 3).map(t => <span key={t} className="px-1.5 py-0.5 rounded text-[8px] bg-slate-100 text-slate-500">#{t}</span>)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            {docsByIssueArea.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <Tag size={32} className="mx-auto mb-3" />
                <p className="text-[13px]">No documents to organize</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ ADD DOCUMENT MODAL ═══ */}
      {showAddDoc && <AddDocModal onSave={d => { addAdvocacyDocument(d); setShowAddDoc(false); }} onClose={() => setShowAddDoc(false)} />}
    </div>
  );
}

/* ═══ ADD DOCUMENT MODAL ═══ */
function AddDocModal({ onSave, onClose }: { onSave: (d: Omit<AdvocacyDocument, "id">) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    title: "", type: "" as AdvocacyDocument["type"] | "", issueAreas: [] as string[], campaign: "",
    audienceType: "" as AdvocacyDocument["audienceType"] | "", status: "Draft" as AdvocacyDocument["status"],
    author: "", fileName: "", fileSize: "", tags: "",
  });
  const u = (f: string, v: any) => setForm(prev => ({ ...prev, [f]: v }));
  const canSave = form.title && form.type && form.audienceType;
  const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 placeholder:text-slate-400";
  const labelCls = "block text-[11px] text-slate-500 font-medium mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h2 className="text-[16px] font-semibold text-slate-900">Add Document</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-4">
          <div><label className={labelCls}>Title <span className="text-red-500">*</span></label><input type="text" value={form.title} onChange={e => u("title", e.target.value)} placeholder="Document title" className={inputCls} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Type <span className="text-red-500">*</span></label>
              <select value={form.type} onChange={e => u("type", e.target.value)} className={inputCls}>
                <option value="">Select...</option>
                {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Audience <span className="text-red-500">*</span></label>
              <select value={form.audienceType} onChange={e => u("audienceType", e.target.value)} className={inputCls}>
                <option value="">Select...</option>
                {AUDIENCE_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div><label className={labelCls}>Campaign</label><input type="text" value={form.campaign} onChange={e => u("campaign", e.target.value)} placeholder="Campaign name" className={inputCls} /></div>
          <div><label className={labelCls}>Author</label><input type="text" value={form.author} onChange={e => u("author", e.target.value)} placeholder="Author name" className={inputCls} /></div>
          <div>
            <label className={labelCls}>Issue Areas</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {ISSUE_AREAS.map(area => (
                <button key={area} onClick={() => u("issueAreas", form.issueAreas.includes(area) ? form.issueAreas.filter(a => a !== area) : [...form.issueAreas, area])}
                  className={cn("px-2 py-1 rounded-lg border text-[10px] font-medium transition-colors",
                    form.issueAreas.includes(area) ? "border-[#0B01D0] bg-[#0B01D0]/5 text-[#0B01D0]" : "border-slate-200 text-slate-500")}>
                  {area}
                </button>
              ))}
            </div>
          </div>
          <div><label className={labelCls}>Tags</label><input type="text" value={form.tags} onChange={e => u("tags", e.target.value)} placeholder="Comma-separated tags" className={inputCls} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>File Name</label><input type="text" value={form.fileName} onChange={e => u("fileName", e.target.value)} placeholder="document.pdf" className={inputCls} /></div>
            <div><label className={labelCls}>File Size</label><input type="text" value={form.fileSize} onChange={e => u("fileSize", e.target.value)} placeholder="e.g. 2.4 MB" className={inputCls} /></div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={() => {
            if (canSave) {
              const now = new Date().toISOString().split("T")[0];
              onSave({
                ...form, type: form.type as AdvocacyDocument["type"], audienceType: form.audienceType as AdvocacyDocument["audienceType"],
                currentVersion: 1, createdDate: now, lastModified: now,
                tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
              });
            }
          }} disabled={!canSave}
            className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm">Save</button>
        </div>
      </div>
    </div>
  );
}

/* ═══ ADD VERSION MODAL ═══ */
function AddVersionModal({ documentId, currentVersion, onSave, onClose }: { documentId: number; currentVersion: number; onSave: (v: Omit<DocumentVersion, "id">) => void; onClose: () => void }) {
  const [form, setForm] = useState({ author: "", changes: "", status: "Draft" as DocumentVersion["status"] });
  const u = (f: string, v: any) => setForm(prev => ({ ...prev, [f]: v }));
  const canSave = form.author && form.changes;
  const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 placeholder:text-slate-400";
  const labelCls = "block text-[11px] text-slate-500 font-medium mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h2 className="text-[16px] font-semibold text-slate-900">Add Version {currentVersion + 1}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div><label className={labelCls}>Author <span className="text-red-500">*</span></label><input type="text" value={form.author} onChange={e => u("author", e.target.value)} placeholder="Author name" className={inputCls} /></div>
          <div><label className={labelCls}>Changes <span className="text-red-500">*</span></label><textarea rows={3} value={form.changes} onChange={e => u("changes", e.target.value)} placeholder="Describe what changed..." className={cn(inputCls, "resize-none")} /></div>
          <div><label className={labelCls}>Status</label>
            <select value={form.status} onChange={e => u("status", e.target.value)} className={inputCls}>
              {(["Draft", "Pending Approval"] as const).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={() => { if (canSave) onSave({ documentId, version: currentVersion + 1, date: new Date().toISOString().split("T")[0], ...form }); }} disabled={!canSave}
            className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm">Save</button>
        </div>
      </div>
    </div>
  );
}
