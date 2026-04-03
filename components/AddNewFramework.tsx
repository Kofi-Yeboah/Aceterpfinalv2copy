import { useState } from "react";
import {
  ArrowLeft, Plus, Upload, X, ChevronDown, Eye, Check, Edit3,
  Target, Layers, FileText, CheckCircle2, AlertCircle,
  Link as LinkIcon, Info, Trash2, GitBranch, ArrowRight
} from "lucide-react";
import { cn } from "../lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════════ */

interface AddNewFrameworkProps {
  onBack: () => void;
}

interface HierarchyItem {
  id: string;
  name: string;
  parentId: string; // "" for top-level
}

interface HierarchyLevel {
  id: string;
  name: string;
  items: HierarchyItem[];
}

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export function AddNewFramework({ onBack }: AddNewFrameworkProps) {
  // Form state
  const [frameworkName, setFrameworkName] = useState("");
  const [frameworkType, setFrameworkType] = useState("");
  const [description, setDescription] = useState("");
  const [applicableLevel, setApplicableLevel] = useState("");
  const [linkedEntity, setLinkedEntity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [externalLink, setExternalLink] = useState("");

  // Hierarchy levels with items
  const [hierarchyLevels, setHierarchyLevels] = useState<HierarchyLevel[]>([
    {
      id: "l1", name: "Goal / Impact",
      items: [{ id: "g1", name: "Reduce youth unemployment by 20%", parentId: "" }],
    },
    {
      id: "l2", name: "Outcome",
      items: [
        { id: "o1", name: "Youth acquire market-relevant digital skills", parentId: "g1" },
        { id: "o2", name: "Employers increase hiring of trained youth", parentId: "g1" },
      ],
    },
    {
      id: "l3", name: "Output",
      items: [
        { id: "op1", name: "Digital training hubs established", parentId: "o1" },
        { id: "op2", name: "Certification program launched", parentId: "o1" },
        { id: "op3", name: "Employer partnership network created", parentId: "o2" },
      ],
    },
    {
      id: "l4", name: "Activity",
      items: [
        { id: "a1", name: "Renovate hub facilities", parentId: "op1" },
        { id: "a2", name: "Procure equipment & software", parentId: "op1" },
        { id: "a3", name: "Develop curriculum modules", parentId: "op2" },
        { id: "a4", name: "Sign MoUs with employers", parentId: "op3" },
      ],
    },
  ]);

  // Review confirmation state
  const [showReview, setShowReview] = useState(false);

  const showLinkedEntity = applicableLevel === "Program Level" || applicableLevel === "Project Level";

  /* ── Level handlers ────────────────────────────────────────────────── */
  const handleAddLevel = () => {
    setHierarchyLevels([
      ...hierarchyLevels,
      { id: `l${Date.now()}`, name: "", items: [] },
    ]);
  };

  const handleRemoveLevel = (levelId: string) => {
    setHierarchyLevels(hierarchyLevels.filter(l => l.id !== levelId));
  };

  const handleUpdateLevelName = (levelId: string, name: string) => {
    setHierarchyLevels(hierarchyLevels.map(l =>
      l.id === levelId ? { ...l, name } : l
    ));
  };

  /* ── Item handlers ─────────────────────────────────────────────────── */
  const handleAddItem = (levelId: string) => {
    setHierarchyLevels(hierarchyLevels.map(l =>
      l.id === levelId
        ? { ...l, items: [...l.items, { id: `i${Date.now()}`, name: "", parentId: "" }] }
        : l
    ));
  };

  const handleRemoveItem = (levelId: string, itemId: string) => {
    // Also clear any child references to this item
    setHierarchyLevels(hierarchyLevels.map(l => {
      if (l.id === levelId) {
        return { ...l, items: l.items.filter(i => i.id !== itemId) };
      }
      // Clear parentId references in child levels
      return {
        ...l,
        items: l.items.map(i => i.parentId === itemId ? { ...i, parentId: "" } : i),
      };
    }));
  };

  const handleUpdateItemName = (levelId: string, itemId: string, name: string) => {
    setHierarchyLevels(hierarchyLevels.map(l =>
      l.id === levelId
        ? { ...l, items: l.items.map(i => i.id === itemId ? { ...i, name } : i) }
        : l
    ));
  };

  const handleUpdateItemParent = (levelId: string, itemId: string, parentId: string) => {
    setHierarchyLevels(hierarchyLevels.map(l =>
      l.id === levelId
        ? { ...l, items: l.items.map(i => i.id === itemId ? { ...i, parentId } : i) }
        : l
    ));
  };

  const getParentLevel = (levelIndex: number): HierarchyLevel | null => {
    if (levelIndex <= 0) return null;
    return hierarchyLevels[levelIndex - 1];
  };

  const getChildCount = (itemId: string): number => {
    let count = 0;
    for (const level of hierarchyLevels) {
      count += level.items.filter(i => i.parentId === itemId).length;
    }
    return count;
  };

  /* ── Save ───────────────────────────────────────────────────────────── */
  const handleSave = () => {
    console.log("Saving framework:", {
      frameworkName, frameworkType, description, applicableLevel,
      linkedEntity, startDate, endDate, hierarchyLevels, uploadedFile, externalLink,
    });
    onBack();
  };

  // Completion tracker
  const totalItems = hierarchyLevels.reduce((sum, l) => sum + l.items.length, 0);
  const completedFields = [
    frameworkName, frameworkType, applicableLevel, startDate, endDate,
    totalItems > 0 ? "yes" : "",
  ].filter(Boolean).length;
  const totalFields = 6;
  const completionPct = Math.round((completedFields / totalFields) * 100);

  // Color palette for levels
  const levelColors = [
    { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500", badge: "bg-indigo-100 text-indigo-700" },
    { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500", badge: "bg-purple-100 text-purple-700" },
    { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
    { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700" },
    { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500", badge: "bg-rose-100 text-rose-700" },
    { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", dot: "bg-cyan-500", badge: "bg-cyan-100 text-cyan-700" },
  ];

  const getColor = (index: number) => levelColors[index % levelColors.length];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-[13px] font-medium">Back to Frameworks</span>
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <h1 className="text-[16px] font-semibold text-slate-900">Add New Framework</h1>
              <p className="text-[11px] text-slate-400">Define framework structure, scope, and hierarchy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Completion indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    completionPct >= 80 ? "bg-emerald-500" : completionPct >= 50 ? "bg-blue-500" : "bg-amber-400"
                  )}
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-medium">{completionPct}%</span>
            </div>

            <button
              onClick={() => setShowReview(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors text-[12px] font-medium"
            >
              <Eye size={14} />
              Review & Save
            </button>
          </div>
        </div>
      </div>

      {/* ── Form Content ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">

          {/* ─── SECTION 1: FRAMEWORK DETAILS ─────────────────────────────── */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center">
                <Target size={13} className="text-[#0B01D0]" />
              </div>
              <h2 className="text-[13px] font-semibold text-slate-800">Framework Details</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                  Framework Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={frameworkName}
                  onChange={e => setFrameworkName(e.target.value)}
                  placeholder="e.g., Youth Employment Strategy 2025-2030"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                  Framework Type <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={frameworkType}
                    onChange={e => setFrameworkType(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 bg-white cursor-pointer appearance-none pr-8"
                  >
                    <option value="">Select type...</option>
                    <option value="Theory of Change (ToC)">Theory of Change (ToC)</option>
                    <option value="Results Framework">Results Framework</option>
                    <option value="Logical Framework">Logical Framework</option>
                    <option value="Logic Model">Logic Model</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                  Description / Narrative
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the high-level change pathway..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 resize-none"
                />
              </div>
            </div>
          </section>

          {/* ─── SECTION 2: SCOPE & ALIGNMENT ─────────────────────────────── */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center">
                <Layers size={13} className="text-purple-600" />
              </div>
              <h2 className="text-[13px] font-semibold text-slate-800">Scope & Alignment</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                  Applicable Level <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={applicableLevel}
                    onChange={e => setApplicableLevel(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 bg-white cursor-pointer appearance-none pr-8"
                  >
                    <option value="">Select level...</option>
                    <option value="Institutional">Institutional</option>
                    <option value="Program Level">Program Level</option>
                    <option value="Project Level">Project Level</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              {showLinkedEntity && (
                <div>
                  <label className="block text-[11px] text-slate-500 font-medium mb-1.5">Linked Entity</label>
                  <div className="relative">
                    <select
                      value={linkedEntity}
                      onChange={e => setLinkedEntity(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 bg-white cursor-pointer appearance-none pr-8"
                    >
                      <option value="">Select entity...</option>
                      <option value="Economic Transformation Program">Economic Transformation Program</option>
                      <option value="Youth Employment Initiative">Youth Employment Initiative</option>
                      <option value="Community Development Project">Community Development Project</option>
                      <option value="Education Reform Program">Education Reform Program</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                    Start Date <span className="text-red-400">*</span>
                  </label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20" />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                    End Date <span className="text-red-400">*</span>
                  </label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20" />
                </div>
              </div>
              {applicableLevel && (
                <div className="flex items-start gap-2">
                  <Info size={12} className="text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-purple-500 leading-relaxed">
                    {applicableLevel === "Institutional"
                      ? "This framework will apply across the entire organization and guide institutional-level monitoring."
                      : applicableLevel === "Program Level"
                      ? "This framework is scoped to a specific program. Select the linked entity above."
                      : "This framework is scoped to a specific project. Select the linked entity above."}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ─── SECTION 3: STRUCTURE & HIERARCHY (tree-based) ────────────── */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                  <GitBranch size={13} className="text-emerald-600" />
                </div>
                <h2 className="text-[13px] font-semibold text-slate-800">Structure & Hierarchy</h2>
              </div>
              <button
                onClick={handleAddLevel}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white hover:border-slate-300 transition-colors text-[11px] text-slate-600 font-medium"
              >
                <Plus size={12} />
                Add Level
              </button>
            </div>
            <div className="p-6 space-y-1">
              <div className="flex items-start gap-2 mb-4">
                <Info size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-emerald-600 leading-relaxed">
                  Define hierarchy levels and add items within each. Items can link to a parent in the level above — multiple items can share the same parent (many-to-one).
                </p>
              </div>

              {hierarchyLevels.map((level, levelIndex) => {
                const color = getColor(levelIndex);
                const parentLevel = getParentLevel(levelIndex);

                return (
                  <div key={level.id} className="relative">
                    {/* Connector line between levels */}
                    {levelIndex > 0 && (
                      <div className="flex justify-center py-1">
                        <div className="flex flex-col items-center gap-0.5">
                          <div className="w-px h-3 bg-slate-300" />
                          <ChevronDown size={12} className="text-slate-400 -mt-1" />
                        </div>
                      </div>
                    )}

                    <div className={cn("rounded-xl border overflow-hidden", color.border, color.bg)}>
                      {/* Level header */}
                      <div className={cn("px-4 py-2.5 flex items-center justify-between border-b", color.border)}>
                        <div className="flex items-center gap-2 flex-1">
                          <div className={cn("w-5 h-5 rounded-md flex items-center justify-center shrink-0", color.badge)}>
                            <span className="text-[10px] font-bold">{levelIndex + 1}</span>
                          </div>
                          <input
                            type="text"
                            value={level.name}
                            onChange={e => handleUpdateLevelName(level.id, e.target.value)}
                            placeholder="Level name (e.g., Goal / Impact)"
                            className={cn("flex-1 bg-transparent text-[12px] font-semibold outline-none placeholder:text-slate-400", color.text)}
                          />
                          <span className="text-[10px] text-slate-400 shrink-0">{level.items.length} item{level.items.length !== 1 ? "s" : ""}</span>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => handleAddItem(level.id)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/60 transition-colors text-[10px] text-slate-500 font-medium"
                          >
                            <Plus size={11} />
                            Add Item
                          </button>
                          {hierarchyLevels.length > 1 && (
                            <button
                              onClick={() => handleRemoveLevel(level.id)}
                              className="w-6 h-6 rounded-md hover:bg-white/60 flex items-center justify-center transition-colors"
                            >
                              <Trash2 size={12} className="text-slate-400 hover:text-red-500" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-3 space-y-2">
                        {level.items.length === 0 ? (
                          <p className="text-[11px] text-slate-400 text-center py-3 italic">
                            No items yet. Click "Add Item" above.
                          </p>
                        ) : (
                          level.items.map(item => (
                            <div
                              key={item.id}
                              className="bg-white rounded-lg border border-slate-200 p-3 group hover:shadow-sm transition-shadow"
                            >
                              <div className="flex items-start gap-3">
                                {/* Item name */}
                                <div className="flex-1 space-y-2">
                                  <input
                                    type="text"
                                    value={item.name}
                                    onChange={e => handleUpdateItemName(level.id, item.id, e.target.value)}
                                    placeholder="Enter item name..."
                                    className="w-full text-[12px] text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                                  />
                                  {/* Parent link (only if not the top level) */}
                                  {parentLevel && parentLevel.items.length > 0 && (
                                    <div className="flex items-center gap-2">
                                      <ArrowRight size={10} className="text-slate-400 shrink-0" />
                                      <span className="text-[10px] text-slate-400 shrink-0">Leads to:</span>
                                      <div className="relative flex-1">
                                        <select
                                          value={item.parentId}
                                          onChange={e => handleUpdateItemParent(level.id, item.id, e.target.value)}
                                          className="w-full px-2 py-1 border border-slate-200 rounded text-[10px] text-slate-700 outline-none focus:border-[#0B01D0] bg-white cursor-pointer appearance-none pr-6"
                                        >
                                          <option value="">— Select {parentLevel.name || "parent"} —</option>
                                          {parentLevel.items.map(pi => (
                                            <option key={pi.id} value={pi.id}>
                                              {pi.name || `(Unnamed ${parentLevel.name})`}
                                            </option>
                                          ))}
                                        </select>
                                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {/* Children count badge & delete */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {getChildCount(item.id) > 0 && (
                                    <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-medium", color.badge)}>
                                      {getChildCount(item.id)} child{getChildCount(item.id) !== 1 ? "ren" : ""}
                                    </span>
                                  )}
                                  <button
                                    onClick={() => handleRemoveItem(level.id, item.id)}
                                    className="w-6 h-6 rounded hover:bg-red-50 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    <X size={12} className="text-slate-400 hover:text-red-500" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ─── SECTION 4: VISUALIZATION & DOCUMENTS ─────────────────────── */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center">
                <FileText size={13} className="text-amber-600" />
              </div>
              <h2 className="text-[13px] font-semibold text-slate-800">Visualization & Documents</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1.5">Upload Diagram (Visual Model)</label>
                <p className="text-[10px] text-slate-400 mb-2">Upload the visual Theory of Change or Logic Model diagram</p>
                <label
                  htmlFor="fw-diagram-upload"
                  className="flex flex-col items-center gap-2 py-6 border-2 border-dashed border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50/50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Upload size={16} className="text-slate-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-[12px] text-slate-600">Click to upload or drag and drop</p>
                    <p className="text-[10px] text-slate-400">Supports .PDF, .PNG, .Visio</p>
                  </div>
                  {uploadedFile && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg mt-1">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      <span className="text-[11px] text-emerald-700">{uploadedFile.name}</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.png,.vsd,.vsdx"
                    onChange={e => { if (e.target.files?.[0]) setUploadedFile(e.target.files[0]); }}
                    className="hidden"
                    id="fw-diagram-upload"
                  />
                </label>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1.5">External Link (Optional)</label>
                <div className="relative">
                  <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={externalLink}
                    onChange={e => setExternalLink(e.target.value)}
                    placeholder="Paste URL to Miro / Lucidchart..."
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="h-4" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          REVIEW CONFIRMATION MODAL
          ═══════════════════════════════════════════════════════════════════ */}
      {showReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowReview(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden mx-4">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-[#0B01D0]/5 to-indigo-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0B01D0]/10 flex items-center justify-center">
                  <Eye size={16} className="text-[#0B01D0]" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-900">Review Framework</h2>
                  <p className="text-[11px] text-slate-500">Verify all details before saving</p>
                </div>
              </div>
              <button onClick={() => setShowReview(false)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
                <X size={16} className="text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto px-6 py-5 space-y-5">
              {/* Framework Details */}
              <div>
                <ReviewSectionHeader icon={<Target size={11} className="text-[#0B01D0]" />} color="bg-[#0B01D0]/10" title="Framework Details" />
                <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
                  <ReviewRow label="Framework Name" value={frameworkName} required />
                  <ReviewRow label="Framework Type" value={frameworkType} required />
                  <ReviewRow label="Description" value={description} multiline />
                </div>
              </div>

              {/* Scope */}
              <div>
                <ReviewSectionHeader icon={<Layers size={11} className="text-purple-600" />} color="bg-purple-50" title="Scope & Alignment" />
                <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
                  <ReviewRow label="Applicable Level" value={applicableLevel} required />
                  {showLinkedEntity && <ReviewRow label="Linked Entity" value={linkedEntity} />}
                  <ReviewRow label="Start Date" value={startDate ? new Date(startDate + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""} required />
                  <ReviewRow label="End Date" value={endDate ? new Date(endDate + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""} required />
                </div>
              </div>

              {/* Structure */}
              <div>
                <ReviewSectionHeader icon={<GitBranch size={11} className="text-emerald-600" />} color="bg-emerald-50" title="Structure & Hierarchy" />
                <div className="space-y-2">
                  {hierarchyLevels.map((level, li) => {
                    const c = getColor(li);
                    const parentLvl = getParentLevel(li);
                    return (
                      <div key={level.id} className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                        <p className={cn("text-[11px] font-semibold mb-2", c.text)}>
                          Level {li + 1}: {level.name || "(Unnamed)"}
                        </p>
                        {level.items.length === 0 ? (
                          <p className="text-[10px] text-slate-400 italic">No items</p>
                        ) : (
                          <div className="space-y-1.5">
                            {level.items.map(item => {
                              const parent = parentLvl?.items.find(pi => pi.id === item.parentId);
                              return (
                                <div key={item.id} className="flex items-center gap-2 text-[11px]">
                                  <CheckCircle2 size={11} className={item.name ? "text-emerald-400" : "text-slate-300"} />
                                  <span className={item.name ? "text-slate-800" : "text-slate-400 italic"}>
                                    {item.name || "Unnamed"}
                                  </span>
                                  {parent && (
                                    <span className="text-[9px] text-slate-400 ml-auto flex items-center gap-1">
                                      <ArrowRight size={8} /> {parent.name}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Documents */}
              <div>
                <ReviewSectionHeader icon={<FileText size={11} className="text-amber-600" />} color="bg-amber-50" title="Visualization & Documents" />
                <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
                  <ReviewRow label="Diagram File" value={uploadedFile?.name || ""} />
                  <ReviewRow label="External Link" value={externalLink} />
                </div>
              </div>

              {/* Completion */}
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-[11px] text-slate-500 mb-1.5">Form Completion</p>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", completionPct >= 80 ? "bg-emerald-500" : completionPct >= 50 ? "bg-blue-500" : "bg-amber-400")}
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>
                <span className={cn("text-[13px] font-semibold", completionPct >= 80 ? "text-emerald-600" : completionPct >= 50 ? "text-blue-600" : "text-amber-600")}>
                  {completionPct}%
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <button
                onClick={() => setShowReview(false)}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-white hover:border-slate-300 transition-colors font-medium"
              >
                <Edit3 size={13} />
                Go Back & Edit
              </button>
              <button
                onClick={() => { setShowReview(false); handleSave(); }}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors text-[12px] font-medium"
              >
                <Check size={14} />
                Confirm & Save Framework
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   HELPER COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════════ */

function ReviewSectionHeader({ icon, color, title }: { icon: React.ReactNode; color: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className={cn("w-5 h-5 rounded-md flex items-center justify-center", color)}>
        {icon}
      </div>
      <h3 className="text-[12px] text-slate-900 font-semibold uppercase tracking-wider">{title}</h3>
    </div>
  );
}

function ReviewRow({ label, value, required, multiline }: {
  label: string;
  value: string;
  required?: boolean;
  multiline?: boolean;
}) {
  const isEmpty = !value || value.trim() === "";

  return (
    <div className="flex items-start gap-4 px-4 py-3">
      <div className="w-[160px] shrink-0 flex items-center gap-1">
        <span className="text-[11px] text-slate-500">{label}</span>
        {required && isEmpty && <AlertCircle size={11} className="text-amber-500 shrink-0" />}
      </div>
      <div className="flex-1 min-w-0">
        {isEmpty ? (
          <span className="text-[12px] text-slate-400 italic">Not provided</span>
        ) : multiline ? (
          <p className="text-[12px] text-slate-800 leading-relaxed whitespace-pre-wrap">{value}</p>
        ) : (
          <span className="text-[12px] text-slate-800">{value}</span>
        )}
      </div>
      {!isEmpty && <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />}
    </div>
  );
}
