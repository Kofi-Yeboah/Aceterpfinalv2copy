import { useState } from "react";
import {
  ArrowLeft, Edit2, ChevronDown, AlertTriangle, CheckCircle, Circle,
  Target, Layers, GitBranch, FileText, BarChart3, Download,
  ExternalLink, ArrowRight
} from "lucide-react";
import { cn } from "../lib/utils";
import { ImageWithFallback } from "./figma/ImageWithFallback";

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════════ */

interface Indicator {
  id: string;
  name: string;
  actual: number | string;
  target: number | string;
  status: "OK" | "Warning" | "Behind";
}

interface HierarchyItem {
  id: string;
  name: string;
  parentId: string;
  indicators: Indicator[];
}

interface HierarchyLevel {
  title: string;
  items: HierarchyItem[];
}

interface ViewFrameworkProps {
  framework: {
    id: string;
    name: string;
    type: string;
    associatedProject: string;
    createdBy: string;
    createdDate: string;
    status: "Active" | "Draft" | "Archived";
  };
  onBack: () => void;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export function ViewFramework({ framework, onBack }: ViewFrameworkProps) {
  const [activeTab, setActiveTab] = useState<"structure" | "performance" | "visual" | "documents">("structure");

  // ── Mock data ──────────────────────────────────────────────────────
  const frameworkMeta = {
    program: "Economic Transformation",
    period: "2025 – 2030",
    health: 85,
    totalIndicators: 7,
    onTrack: 5,
    atRisk: 2,
    description:
      "A comprehensive Theory of Change framework mapping the causal pathway from youth digital skills training activities through outputs and outcomes to the overarching goal of reducing youth unemployment by 20% in target regions.",
  };

  // Full hierarchy with many-to-one relationships
  const hierarchy: HierarchyLevel[] = [
    {
      title: "Goal / Impact",
      items: [
        {
          id: "g1",
          name: "Reduce youth unemployment by 20% in target regions",
          parentId: "",
          indicators: [
            { id: "IND-001", name: "% Reduction in unemployment", actual: "15%", target: "20%", status: "Warning" },
            { id: "IND-002", name: "Total jobs created (Strategic)", actual: "5,000", target: "4,500", status: "OK" },
          ],
        },
      ],
    },
    {
      title: "Outcome",
      items: [
        {
          id: "o1",
          name: "Youth acquire market-relevant digital skills",
          parentId: "g1",
          indicators: [
            { id: "IND-003", name: "Youth trained in digital skills", actual: "550", target: "500", status: "OK" },
            { id: "IND-004", name: "% of trainees passing certification exam", actual: "98%", target: "90%", status: "OK" },
          ],
        },
        {
          id: "o2",
          name: "Employers increase hiring of trained youth",
          parentId: "g1",
          indicators: [
            { id: "IND-005", name: "% of trainees placed in jobs within 6 months", actual: "45%", target: "60%", status: "Warning" },
          ],
        },
      ],
    },
    {
      title: "Output",
      items: [
        {
          id: "op1",
          name: "Digital training hubs established in 3 regions",
          parentId: "o1",
          indicators: [
            { id: "IND-006", name: "# of hubs renovated and operational", actual: "2", target: "3", status: "Warning" },
          ],
        },
        {
          id: "op2",
          name: "Certification program launched",
          parentId: "o1",
          indicators: [
            { id: "IND-007", name: "# of certification modules available", actual: "5", target: "5", status: "OK" },
          ],
        },
        {
          id: "op3",
          name: "Employer partnership network created",
          parentId: "o2",
          indicators: [],
        },
      ],
    },
    {
      title: "Activity",
      items: [
        { id: "a1", name: "Renovate hub facilities", parentId: "op1", indicators: [] },
        { id: "a2", name: "Procure equipment & software", parentId: "op1", indicators: [] },
        { id: "a3", name: "Develop curriculum modules", parentId: "op2", indicators: [] },
        { id: "a4", name: "Sign MoUs with employers", parentId: "op3", indicators: [] },
        { id: "a5", name: "Conduct job-matching events", parentId: "op3", indicators: [] },
      ],
    },
  ];

  // Flatten all items for lookups
  const allItems = hierarchy.flatMap(l => l.items);
  const getItemById = (id: string) => allItems.find(i => i.id === id);
  const getChildrenOf = (itemId: string) => allItems.filter(i => i.parentId === itemId);

  // Level colors
  const levelColors = [
    { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500", badge: "bg-indigo-100 text-indigo-700", headerBg: "bg-indigo-600" },
    { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500", badge: "bg-purple-100 text-purple-700", headerBg: "bg-purple-600" },
    { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700", headerBg: "bg-emerald-600" },
    { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700", headerBg: "bg-amber-600" },
  ];
  const getColor = (i: number) => levelColors[i % levelColors.length];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OK": return <CheckCircle size={14} className="text-emerald-500" />;
      case "Warning": return <AlertTriangle size={14} className="text-amber-500" />;
      case "Behind": return <Circle size={14} className="text-red-500" />;
      default: return <Circle size={14} className="text-slate-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-100 text-emerald-700";
      case "Draft": return "bg-amber-100 text-amber-700";
      case "Archived": return "bg-slate-100 text-slate-600";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const healthColor = frameworkMeta.health >= 80 ? "text-emerald-600" : frameworkMeta.health >= 60 ? "text-amber-600" : "text-red-600";
  const healthBg = frameworkMeta.health >= 80 ? "bg-emerald-500" : frameworkMeta.health >= 60 ? "bg-amber-500" : "bg-red-500";

  const tabs = [
    { key: "structure" as const, label: "Structure", icon: <GitBranch size={13} /> },
    { key: "performance" as const, label: "Performance Matrix", icon: <BarChart3 size={13} /> },
    { key: "visual" as const, label: "Visual Model", icon: <Target size={13} /> },
    { key: "documents" as const, label: "Documents", icon: <FileText size={13} /> },
  ];

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
              <span className="text-[13px] font-medium">Back to Library</span>
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <h1 className="text-[16px] font-semibold text-slate-900">{framework.name}</h1>
              <p className="text-[11px] text-slate-400">{framework.type}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium", getStatusColor(framework.status))}>
              <Circle size={6} fill="currentColor" />
              {framework.status}
            </span>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors text-[12px] font-medium">
              <Edit2 size={13} />
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ───────────────────────────────────────────────── */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Program</p>
            <p className="text-[12px] text-slate-800 font-medium">{frameworkMeta.program}</p>
          </div>
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Period</p>
            <p className="text-[12px] text-slate-800 font-medium">{frameworkMeta.period}</p>
          </div>
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Health Score</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", healthBg)} style={{ width: `${frameworkMeta.health}%` }} />
              </div>
              <span className={cn("text-[12px] font-semibold", healthColor)}>{frameworkMeta.health}%</span>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Indicators</p>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-slate-800 font-medium">{frameworkMeta.totalIndicators} total</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{frameworkMeta.onTrack} on track</span>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Created By</p>
            <p className="text-[12px] text-slate-800 font-medium">{framework.createdBy}</p>
            <p className="text-[10px] text-slate-400">{framework.createdDate}</p>
          </div>
        </div>
      </div>

      {/* ── Tabs (Document Vault pill style) ─────────────────────────────── */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[12px] transition-colors min-w-[140px] flex items-center justify-center gap-1.5 font-medium",
                activeTab === tab.key
                  ? "bg-[#0B01D0] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        {/* ═══ STRUCTURE TAB ═══════════════════════════════════════════════ */}
        {activeTab === "structure" && (
          <div className="max-w-4xl mx-auto py-6 px-4 space-y-1">
            {/* Description card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0B01D0]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <GitBranch size={14} className="text-[#0B01D0]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[13px] font-semibold text-slate-900 mb-1">Hierarchy Overview</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{frameworkMeta.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-[10px] text-slate-400">{hierarchy.length} levels</span>
                    <span className="text-[10px] text-slate-400">{allItems.length} total items</span>
                    <span className="text-[10px] text-slate-400">{frameworkMeta.totalIndicators} linked indicators</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hierarchy tree */}
            {hierarchy.map((level, li) => {
              const color = getColor(li);

              return (
                <div key={li} className="relative">
                  {li > 0 && (
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
                      <div className="flex items-center gap-2">
                        <div className={cn("w-5 h-5 rounded-md flex items-center justify-center", color.badge)}>
                          <span className="text-[10px] font-bold">{li + 1}</span>
                        </div>
                        <h3 className={cn("text-[12px] font-semibold uppercase tracking-wider", color.text)}>
                          {level.title}
                        </h3>
                      </div>
                      <span className="text-[10px] text-slate-400">{level.items.length} item{level.items.length !== 1 ? "s" : ""}</span>
                    </div>

                    {/* Items */}
                    <div className="p-3 space-y-2">
                      {level.items.map(item => {
                        const parent = getItemById(item.parentId);
                        const children = getChildrenOf(item.id);
                        const hasIndicators = item.indicators.length > 0;

                        return (
                          <div key={item.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <div className="p-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className="text-[12px] text-slate-900 font-medium">{item.name}</p>
                                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                    {parent && (
                                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                        <ArrowRight size={8} />
                                        Leads to: <span className="text-slate-600">{parent.name}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {children.length > 0 && (
                                    <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-medium", color.badge)}>
                                      {children.length} child{children.length !== 1 ? "ren" : ""}
                                    </span>
                                  )}
                                  {hasIndicators && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-50 text-blue-600">
                                      {item.indicators.length} KPI{item.indicators.length !== 1 ? "s" : ""}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Inline indicators */}
                            {hasIndicators && (
                              <div className="border-t border-slate-100 px-3 py-2 bg-slate-50/50">
                                <div className="space-y-1.5">
                                  {item.indicators.map(ind => (
                                    <div key={ind.id} className="flex items-center gap-3 text-[11px]">
                                      {getStatusIcon(ind.status)}
                                      <span className="text-slate-600 flex-1 min-w-0 truncate">{ind.id}: {ind.name}</span>
                                      <span className="text-slate-800 font-medium shrink-0">{ind.actual}</span>
                                      <span className="text-slate-400 shrink-0">/ {ind.target}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ PERFORMANCE MATRIX TAB ═════════════════════════════════════ */}
        {activeTab === "performance" && (
          <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
            {/* Info card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <BarChart3 size={14} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-[13px] font-semibold text-slate-900 mb-1">Performance Matrix</h3>
                <p className="text-[11px] text-slate-500">This view connects your strategy logic to live indicator data. Each hierarchy level shows its linked KPIs with current actuals vs targets.</p>
              </div>
            </div>

            {/* Performance by level */}
            {hierarchy.map((level, li) => {
              const allIndicators = level.items.flatMap(i => i.indicators);
              if (allIndicators.length === 0) return null;
              const color = getColor(li);

              return (
                <section key={li} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className={cn("px-5 py-3 flex items-center justify-between border-b", color.border, color.bg)}>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-5 h-5 rounded-md flex items-center justify-center", color.badge)}>
                        <span className="text-[10px] font-bold">{li + 1}</span>
                      </div>
                      <h3 className={cn("text-[12px] font-semibold uppercase tracking-wider", color.text)}>{level.title}</h3>
                    </div>
                    <span className="text-[10px] text-slate-400">{allIndicators.length} indicator{allIndicators.length !== 1 ? "s" : ""}</span>
                  </div>

                  {level.items.map(item => {
                    if (item.indicators.length === 0) return null;
                    return (
                      <div key={item.id}>
                        <div className="px-5 py-2 bg-slate-50 border-b border-slate-100">
                          <p className="text-[11px] text-slate-600 font-medium">{item.name}</p>
                        </div>
                        <table className="w-full">
                          <thead style={{ backgroundColor: "#0B01D0" }}>
                            <tr>
                              <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-white">Linked Indicator (KPI)</th>
                              <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-white w-24">Actual</th>
                              <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-white w-24">Target</th>
                              <th className="px-5 py-2.5 text-center text-[11px] font-semibold text-white w-20">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {item.indicators.map((ind, ii) => (
                              <tr key={ind.id} className={cn("hover:bg-slate-50 transition-colors", ii % 2 === 1 && "bg-slate-50/50")}>
                                <td className="px-5 py-2.5 text-[11px] text-slate-800">
                                  <span className="text-slate-400 mr-1">{ind.id}:</span> {ind.name}
                                </td>
                                <td className="px-5 py-2.5 text-[11px] text-slate-900 font-medium">{ind.actual}</td>
                                <td className="px-5 py-2.5 text-[11px] text-slate-500">{ind.target}</td>
                                <td className="px-5 py-2.5">
                                  <div className="flex items-center justify-center">{getStatusIcon(ind.status)}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </section>
              );
            })}
          </div>
        )}

        {/* ═══ VISUAL MODEL TAB ═══════════════════════════════════════════ */}
        {activeTab === "visual" && (
          <div className="max-w-4xl mx-auto py-6 px-4">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center">
                    <Target size={13} className="text-[#0B01D0]" />
                  </div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Visual Model</h2>
                </div>
                <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white hover:border-slate-300 transition-colors text-[11px] text-slate-600 font-medium">
                  <Download size={12} />
                  Download
                </button>
              </div>
              <div className="p-6">
                <ImageWithFallback
                  src="https://accountabilitylab.org/wp-content/uploads/2020/03/Theory-of-Change-2.0-16-Jan-2019-1.png"
                  alt="Theory of Change Visual Model"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* ═══ DOCUMENTS TAB ══════════════════════════════════════════════ */}
        {activeTab === "documents" && (
          <div className="max-w-4xl mx-auto py-6 px-4 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center">
                  <FileText size={13} className="text-amber-600" />
                </div>
                <h2 className="text-[13px] font-semibold text-slate-800">Associated Documents</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { name: "Theory-of-Change-Diagram-v3.pdf", type: "Diagram", date: "Jan 15, 2025", size: "2.4 MB" },
                  { name: "Youth-Employment-LogFrame-Final.xlsx", type: "LogFrame", date: "Jan 10, 2025", size: "980 KB" },
                  { name: "Stakeholder-Consultation-Notes.docx", type: "Notes", date: "Dec 20, 2024", size: "340 KB" },
                ].map((doc, i) => (
                  <div key={i} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <FileText size={14} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[12px] text-slate-800 font-medium">{doc.name}</p>
                        <p className="text-[10px] text-slate-400">{doc.type} &middot; {doc.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400">{doc.date}</span>
                      <button className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
                        <Download size={13} className="text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* External link */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <ExternalLink size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[12px] text-slate-800 font-medium">External Link (Miro Board)</p>
                  <p className="text-[10px] text-blue-500">https://miro.com/app/board/uXjVN...</p>
                </div>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-[11px] text-blue-600 font-medium">
                <ExternalLink size={11} />
                Open
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}