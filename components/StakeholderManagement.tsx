import { useState, useEffect } from "react";
import {
  Plus, ArrowLeft, X, UserPlus, Link2,
  Users, Globe, Mail, Phone, MapPin,
  MessageSquare
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  subscribe, getStakeholders, getEngagementsByStakeholder,
  getRelationships, addStakeholder, addEngagement, addRelationship,
  type Stakeholder, type StakeholderEngagement, type StakeholderRelationship,
} from "../lib/advocacyStore";

const STAKEHOLDER_TYPES: Stakeholder["type"][] = ["Policymaker", "Advisor", "Government Official", "Journalist", "CSO", "Influencer", "Development Partner"];
const INFLUENCE_LEVELS: Stakeholder["influenceLevel"][] = ["High", "Medium", "Low"];
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

const NODE_FILLS: Record<string, string> = {
  Policymaker: "#3b82f6", Advisor: "#8b5cf6", "Government Official": "#6366f1",
  Journalist: "#f59e0b", CSO: "#14b8a6", Influencer: "#f43f5e", "Development Partner": "#10b981",
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

const LINE_COLORS: Record<string, string> = {
  Influence: "#6366f1", Collaboration: "#10b981", "Reports To": "#f59e0b", Advisory: "#8b5cf6",
};

export function StakeholderManagement() {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick(t => t + 1)), []);

  const [selectedStakeholder, setSelectedStakeholder] = useState<number | null>(null);
  const [showAddEngagement, setShowAddEngagement] = useState(false);
  const [showAddRelationship, setShowAddRelationship] = useState(false);
  const [showAddStakeholder, setShowAddStakeholder] = useState(false);
  const [mapSelectedNode, setMapSelectedNode] = useState<number | null>(null);

  const stakeholders = getStakeholders();
  const relationships = getRelationships();

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
            <div className="col-span-1 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#0B01D0]/10 flex items-center justify-center"><Users size={20} className="text-[#0B01D0]" /></div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-slate-900">{s.name}</h3>
                    <p className="text-[11px] text-slate-500">{s.title}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {([
                    [<Globe size={13} />, "Organization", s.organization],
                    [<MapPin size={13} />, "Country", s.country],
                    [<Mail size={13} />, "Email", s.email],
                    [<Phone size={13} />, "Phone", s.phone],
                  ] as [React.ReactNode, string, string][]).map(([icon, label, value], i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">{icon}</span>
                      <div>
                        <p className="text-[10px] text-slate-400">{label}</p>
                        <p className="text-[11px] text-slate-700">{value}</p>
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

  /* ═══ MAIN VIEW — RELATIONSHIP MAP ═══ */
  // SVG layout
  const svgW = 800, svgH = 500, cx = 400, cy = 240;
  const n = stakeholders.length;
  const rx = Math.min(280, 200 + n * 5), ry = Math.min(180, 130 + n * 3);

  const nodePos = (i: number) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-semibold text-slate-900">Relationship Map</h1>
          <p className="text-[12px] text-slate-400 mt-0.5">Visualize connections and influence networks between stakeholders</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAddStakeholder(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 shadow-sm">
            <UserPlus size={16} /><span className="text-sm font-medium">Add Stakeholder</span>
          </button>
          <button onClick={() => setShowAddRelationship(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] shadow-sm">
            <Link2 size={16} /><span className="text-sm font-medium">Add Relationship</span>
          </button>
        </div>
      </div>

      {/* Map + side panel */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex gap-6 h-full">
          {/* SVG Map */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 relative">
            {/* Stakeholder count badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-full">
              <Users size={12} className="text-slate-500" />
              <span className="text-[11px] text-slate-600 font-medium">{n} stakeholder{n !== 1 ? "s" : ""}</span>
            </div>

            {n === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Users size={28} className="text-slate-400" />
                </div>
                <h3 className="text-[14px] font-semibold text-slate-700 mb-1">No stakeholders yet</h3>
                <p className="text-[12px] text-slate-400 mb-4">Add stakeholders to start mapping relationships</p>
                <button onClick={() => setShowAddStakeholder(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-medium hover:bg-[#0a01b8]">
                  <UserPlus size={14} /> Add First Stakeholder
                </button>
              </div>
            ) : (
              <svg width="100%" height="100%" viewBox={`0 0 ${svgW} ${svgH}`} className="min-h-[400px]">
                {/* Relationship lines */}
                {relationships.map(r => {
                  const from = stakeholders.find(s => s.id === r.fromStakeholderId);
                  const to = stakeholders.find(s => s.id === r.toStakeholderId);
                  if (!from || !to) return null;
                  const p1 = nodePos(stakeholders.indexOf(from));
                  const p2 = nodePos(stakeholders.indexOf(to));
                  return (
                    <line key={r.id} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                      stroke={LINE_COLORS[r.relationshipType] || "#94a3b8"}
                      strokeWidth={Math.max(1, r.strength / 3)}
                      strokeOpacity={mapSelectedNode ? (r.fromStakeholderId === mapSelectedNode || r.toStakeholderId === mapSelectedNode ? 0.7 : 0.1) : 0.5}
                      strokeDasharray={r.relationshipType === "Advisory" ? "5,5" : undefined} />
                  );
                })}
                {/* Nodes */}
                {stakeholders.map((s, i) => {
                  const { x, y } = nodePos(i);
                  const radius = s.influenceLevel === "High" ? 22 : s.influenceLevel === "Medium" ? 17 : 13;
                  const fill = NODE_FILLS[s.type] || "#94a3b8";
                  const isSelected = mapSelectedNode === s.id;
                  const dimmed = mapSelectedNode !== null && !isSelected &&
                    !relationships.some(r => (r.fromStakeholderId === mapSelectedNode && r.toStakeholderId === s.id) ||
                                             (r.toStakeholderId === mapSelectedNode && r.fromStakeholderId === s.id));
                  return (
                    <g key={s.id} onClick={() => setMapSelectedNode(isSelected ? null : s.id)} className="cursor-pointer" opacity={dimmed ? 0.25 : 1}>
                      <circle cx={x} cy={y} r={radius + 3} fill="white" stroke={isSelected ? "#0B01D0" : "transparent"} strokeWidth={2} />
                      <circle cx={x} cy={y} r={radius} fill={fill} opacity={0.85} />
                      <text x={x} y={y + radius + 14} textAnchor="middle" className="text-[9px] fill-slate-600 font-medium">
                        {s.name.split(" ").slice(-1)[0]}
                      </text>
                    </g>
                  );
                })}
                {/* Legend */}
                {[
                  { color: "#6366f1", dash: false, label: "Influence" },
                  { color: "#10b981", dash: false, label: "Collaboration" },
                  { color: "#f59e0b", dash: false, label: "Reports To" },
                  { color: "#8b5cf6", dash: true, label: "Advisory" },
                ].map((item, i) => (
                  <g key={item.label} transform={`translate(20, ${420 + i * 18})`}>
                    <line x1={0} y1={0} x2={20} y2={0} stroke={item.color} strokeWidth={2} strokeDasharray={item.dash ? "4,4" : undefined} />
                    <text x={26} y={4} className="text-[9px] fill-slate-500">{item.label}</text>
                  </g>
                ))}
                {/* Node type legend */}
                {Object.entries(NODE_FILLS).map(([type, color], i) => (
                  <g key={type} transform={`translate(${svgW - 170}, ${380 + i * 16})`}>
                    <circle cx={5} cy={0} r={5} fill={color} opacity={0.85} />
                    <text x={16} y={4} className="text-[8px] fill-slate-500">{type}</text>
                  </g>
                ))}
              </svg>
            )}
          </div>

          {/* Side panel */}
          {mapSelectedNode !== null && (() => {
            const s = stakeholders.find(x => x.id === mapSelectedNode);
            if (!s) return null;
            const nodeRels = relationships.filter(r => r.fromStakeholderId === s.id || r.toStakeholderId === s.id);
            return (
              <div className="w-72 bg-white rounded-xl border border-slate-200 p-4 overflow-auto shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-semibold text-slate-900">{s.name}</h3>
                  <button onClick={() => setMapSelectedNode(null)} className="p-1 hover:bg-slate-100 rounded"><X size={14} className="text-slate-400" /></button>
                </div>
                <p className="text-[11px] text-slate-500 mb-1">{s.title}</p>
                <p className="text-[11px] text-slate-500 mb-3">{s.organization}</p>
                <div className="flex gap-1 mb-3 flex-wrap">
                  <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-medium", TYPE_COLORS[s.type])}>{s.type}</span>
                  <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-medium", INFLUENCE_COLORS[s.influenceLevel])}>{s.influenceLevel}</span>
                </div>
                <h4 className="text-[11px] font-semibold text-slate-700 mb-2">Relationships ({nodeRels.length})</h4>
                <div className="space-y-2">
                  {nodeRels.map(r => {
                    const otherId = r.fromStakeholderId === s.id ? r.toStakeholderId : r.fromStakeholderId;
                    const other = stakeholders.find(x => x.id === otherId);
                    return (
                      <div key={r.id} className="px-3 py-2 bg-slate-50 rounded-lg">
                        <p className="text-[11px] font-medium text-slate-800">{other?.name}</p>
                        <p className="text-[9px] text-slate-500">{r.relationshipType} (strength: {r.strength}/10)</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">{r.description}</p>
                      </div>
                    );
                  })}
                  {nodeRels.length === 0 && <p className="text-[11px] text-slate-400">No relationships mapped</p>}
                </div>
                <div className="mt-3 space-y-2">
                  <button onClick={() => setSelectedStakeholder(s.id)}
                    className="w-full px-3 py-2 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]">
                    View Full Profile
                  </button>
                  <button onClick={() => setShowAddRelationship(true)}
                    className="w-full px-3 py-2 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-medium hover:bg-slate-50">
                    <span className="flex items-center justify-center gap-1.5"><Link2 size={12} /> Add Relationship</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Quick Add Stakeholder Modal */}
      {showAddStakeholder && (
        <QuickAddStakeholderModal
          onSave={(s) => { addStakeholder(s); setShowAddStakeholder(false); }}
          onClose={() => setShowAddStakeholder(false)}
        />
      )}

      {/* Add Relationship Modal */}
      {showAddRelationship && (
        <AddRelationshipModal
          stakeholders={stakeholders}
          preselectedFrom={mapSelectedNode}
          onSave={(r) => { addRelationship(r); setShowAddRelationship(false); }}
          onClose={() => setShowAddRelationship(false)}
        />
      )}
    </div>
  );
}

/* ═══ QUICK ADD STAKEHOLDER MODAL ═══ */
function QuickAddStakeholderModal({ onSave, onClose }: { onSave: (s: Omit<Stakeholder, "id">) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: "", title: "", organization: "",
    type: "" as Stakeholder["type"] | "",
    influenceLevel: "Medium" as Stakeholder["influenceLevel"],
    country: "",
  });
  const u = (f: string, v: string) => setForm(prev => ({ ...prev, [f]: v }));
  const canSave = form.name.trim() && form.organization.trim() && form.type;
  const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 placeholder:text-slate-400";
  const labelCls = "block text-[11px] text-slate-500 font-medium mb-1.5";

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      name: form.name.trim(),
      title: form.title.trim(),
      organization: form.organization.trim(),
      type: form.type as Stakeholder["type"],
      email: "",
      phone: "",
      country: form.country.trim(),
      influenceLevel: form.influenceLevel,
      issueAreas: [],
      relationshipStrength: "New",
      notes: "",
      dateAdded: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-[#0B01D0]" />
            <h2 className="text-[16px] font-semibold text-slate-900">Add Stakeholder</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
            <input type="text" value={form.name} onChange={e => u("name", e.target.value)} placeholder="e.g. Hon. Charles Mensah" className={inputCls} autoFocus />
          </div>
          <div>
            <label className={labelCls}>Title / Position</label>
            <input type="text" value={form.title} onChange={e => u("title", e.target.value)} placeholder="e.g. Deputy Minister" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Organization <span className="text-red-500">*</span></label>
            <input type="text" value={form.organization} onChange={e => u("organization", e.target.value)} placeholder="e.g. Ministry of Finance" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Type <span className="text-red-500">*</span></label>
              <select value={form.type} onChange={e => u("type", e.target.value)} className={inputCls}>
                <option value="">Select...</option>
                {STAKEHOLDER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Influence</label>
              <select value={form.influenceLevel} onChange={e => u("influenceLevel", e.target.value)} className={inputCls}>
                {INFLUENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Country</label>
            <input type="text" value={form.country} onChange={e => u("country", e.target.value)} placeholder="e.g. Ghana" className={inputCls} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} disabled={!canSave}
            className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm">
            Add to Map
          </button>
        </div>
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

/* ═══ ADD RELATIONSHIP MODAL ═══ */
function AddRelationshipModal({ stakeholders, preselectedFrom, onSave, onClose }: {
  stakeholders: Stakeholder[];
  preselectedFrom?: number | null;
  onSave: (r: Omit<StakeholderRelationship, "id">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    from: preselectedFrom || 0,
    to: 0,
    type: "" as StakeholderRelationship["relationshipType"] | "",
    strength: 5,
    description: "",
  });
  const u = (f: string, v: any) => setForm(prev => ({ ...prev, [f]: v }));
  const canSave = form.from && form.to && form.from !== form.to && form.type;
  const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 placeholder:text-slate-400";
  const labelCls = "block text-[11px] text-slate-500 font-medium mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Link2 size={18} className="text-[#0B01D0]" />
            <h2 className="text-[16px] font-semibold text-slate-900">Add Relationship</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-4">
          <div><label className={labelCls}>From Stakeholder <span className="text-red-500">*</span></label>
            <select value={form.from} onChange={e => u("from", Number(e.target.value))} className={inputCls}>
              <option value={0}>Select...</option>
              {stakeholders.map(s => <option key={s.id} value={s.id}>{s.name} — {s.organization}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>To Stakeholder <span className="text-red-500">*</span></label>
            <select value={form.to} onChange={e => u("to", Number(e.target.value))} className={inputCls}>
              <option value={0}>Select...</option>
              {stakeholders.filter(s => s.id !== form.from).map(s => <option key={s.id} value={s.id}>{s.name} — {s.organization}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>Relationship Type <span className="text-red-500">*</span></label>
            <select value={form.type} onChange={e => u("type", e.target.value)} className={inputCls}>
              <option value="">Select...</option>
              {(["Influence", "Collaboration", "Reports To", "Advisory"] as const).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Strength: {form.strength}/10</label>
            <input type="range" min={1} max={10} value={form.strength} onChange={e => u("strength", Number(e.target.value))}
              className="w-full accent-[#0B01D0]" />
            <div className="flex justify-between text-[9px] text-slate-400 mt-0.5"><span>Weak</span><span>Strong</span></div>
          </div>
          <div><label className={labelCls}>Description</label>
            <input type="text" value={form.description} onChange={e => u("description", e.target.value)} placeholder="Describe the relationship" className={inputCls} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={() => { if (canSave) onSave({ fromStakeholderId: form.from, toStakeholderId: form.to, relationshipType: form.type as StakeholderRelationship["relationshipType"], strength: form.strength, description: form.description }); }} disabled={!canSave}
            className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm">Save</button>
        </div>
      </div>
    </div>
  );
}
