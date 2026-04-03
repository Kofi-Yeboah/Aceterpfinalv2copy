import { 
  CheckCircle2, TrendingUp, DollarSign, Layers, ShoppingCart, AlertTriangle, 
  MessageSquare, BarChart3, Users, Plane, FolderOpen, ArrowRight, 
  Target, Shield
} from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";

interface ProjectOverviewDashboardProps {
  project: {
    id: string;
    name: string;
    projectManager: string;
    startDate: string;
    endDate: string;
    progress: number;
    milestoneStatus: string;
    riskLevel: string;
    budgetSpent?: string;
    status: string;
    stage?: string;
  };
  onNavigateToTab: (tabId: string) => void;
  onNavigateToResourcePlan?: () => void;
  onNavigateToTravelPlan?: () => void;
}

export function ProjectOverviewDashboard({ project, onNavigateToTab, onNavigateToResourcePlan, onNavigateToTravelPlan }: ProjectOverviewDashboardProps) {
  const isClosure = project.stage === "Closure";
  const isDelivery = project.stage === "Delivery";

  // ─── Milestones for Delivery / Closure ────────────────────────────
  interface Milestone {
    id: string;
    title: string;
    phase: string;
    dueDate: string;
    completed: boolean;
    completedDate?: string;
    type: "contract" | "deliverable" | "reporting";
  }

  const initialMilestones: Milestone[] = [
    { id: "MS-1", title: "Inception Report Submitted", phase: "Procurement & Contracting", dueDate: "Feb 15, 2025", completed: true, completedDate: "Feb 12, 2025", type: "deliverable" },
    { id: "MS-2", title: "All Vendor Contracts Signed", phase: "Procurement & Contracting", dueDate: "Feb 28, 2025", completed: true, completedDate: "Feb 25, 2025", type: "contract" },
    { id: "MS-3", title: "Field Data Collection Complete", phase: "Implementation", dueDate: "Mar 31, 2025", completed: true, completedDate: "Mar 28, 2025", type: "deliverable" },
    { id: "MS-4", title: "Stakeholder Engagement Plan Delivered", phase: "Implementation", dueDate: "May 15, 2025", completed: isDelivery ? true : true, completedDate: isDelivery ? "May 10, 2025" : "May 10, 2025", type: "deliverable" },
    { id: "MS-5", title: "Mid-term Progress Report", phase: "Implementation", dueDate: "May 31, 2025", completed: isDelivery ? true : true, completedDate: isDelivery ? "May 28, 2025" : "May 28, 2025", type: "reporting" },
    { id: "MS-6", title: "Internal Peer Review Complete", phase: "Quality Assurance", dueDate: "Jul 10, 2025", completed: isClosure, completedDate: isClosure ? "Jul 8, 2025" : undefined, type: "deliverable" },
    { id: "MS-7", title: "Final Report Layout Approved", phase: "Production & Editorial", dueDate: "Aug 10, 2025", completed: isClosure, completedDate: isClosure ? "Aug 7, 2025" : undefined, type: "deliverable" },
    { id: "MS-8", title: "Project Sign-off & Handover", phase: "Delivery Stage Complete", dueDate: "Sep 30, 2025", completed: isClosure, completedDate: isClosure ? "Sep 28, 2025" : undefined, type: "contract" },
  ];

  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);

  const handleToggleMilestone = (id: string) => {
    if (isClosure) return; // Can't modify in closure
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              completed: !m.completed,
              completedDate: !m.completed ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : undefined,
            }
          : m
      )
    );
  };

  const completedCount = milestones.filter((m) => m.completed).length;
  const totalMilestones = milestones.length;
  const milestoneProgress = Math.round((completedCount / totalMilestones) * 100);

  const typeStyles: Record<string, { bg: string; text: string }> = {
    contract: { bg: "bg-blue-100", text: "text-blue-700" },
    deliverable: { bg: "bg-purple-100", text: "text-purple-700" },
    reporting: { bg: "bg-amber-100", text: "text-amber-700" },
  };

  // --- KPI Data ---
  const kpis = isClosure ? [
    { label: "Overall Progress", value: "100%", icon: TrendingUp, color: "blue", subtext: "Project Complete", subtextColor: "text-emerald-600" },
    { label: "Milestones", value: "8 / 8", icon: Target, color: "purple", subtext: "All achieved", subtextColor: "text-emerald-600" },
    { label: "Budget Utilization", value: "100%", icon: DollarSign, color: "green", subtext: "$150,000 of $150,000", subtextColor: "text-emerald-600" },
    { label: "Risks Closed", value: "9", icon: Shield, color: "green", subtext: "All risks closed", subtextColor: "text-emerald-600" },
  ] : [
    { label: "Overall Progress", value: `${project.progress}%`, icon: TrendingUp, color: "blue", subtext: "On track", subtextColor: "text-emerald-600" },
    { label: "Milestones", value: "5 / 8", icon: Target, color: "purple", subtext: "3 remaining", subtextColor: "text-slate-500" },
    { label: "Budget Utilization", value: "44.9%", icon: DollarSign, color: "green", subtext: "$67,350 of $150,000", subtextColor: "text-slate-500" },
    { label: "Active Risks", value: "6", icon: Shield, color: "red", subtext: "3 Critical/High", subtextColor: "text-red-600" },
  ];

  const kpiColorMap: Record<string, { bg: string; icon: string }> = {
    blue: { bg: "bg-blue-50 border-blue-100", icon: "text-[#0B01D0]" },
    purple: { bg: "bg-purple-50 border-purple-100", icon: "text-purple-600" },
    green: { bg: "bg-emerald-50 border-emerald-100", icon: "text-emerald-600" },
    red: { bg: "bg-red-50 border-red-100", icon: "text-red-600" },
  };

  // --- Summary cards data ---
  const summaryCards = [
    {
      icon: Layers,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50",
      title: "Work Breakdown / Tasks",
      tabId: "wbs" as string | null,
      onCustomNav: null as (() => void) | null,
      metrics: isClosure
        ? [
            { label: "Total Tasks", value: "45", color: "text-slate-900" },
            { label: "Completed", value: "45", color: "text-emerald-600" },
          ]
        : [
            { label: "Total Tasks", value: "45", color: "text-slate-900" },
            { label: "Completed", value: "34", color: "text-emerald-600" },
            { label: "In Progress", value: "7", color: "text-blue-600" },
            { label: "Pending", value: "4", color: "text-slate-400" },
          ],
      progress: isClosure ? 100 : Math.round((34 / 45) * 100),
    },
    {
      icon: DollarSign,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      title: "Budget",
      tabId: "budget",
      onCustomNav: null,
      metrics: isClosure
        ? [
            { label: "Total", value: "$150k", color: "text-slate-900" },
            { label: "Spent", value: "$150k", color: "text-emerald-600" },
          ]
        : [
            { label: "Total", value: "$150k", color: "text-slate-900" },
            { label: "Spent", value: "$67.4k", color: "text-orange-600" },
            { label: "Committed", value: "$38.2k", color: "text-blue-600" },
            { label: "Remaining", value: "$44.5k", color: "text-emerald-600" },
          ],
      progress: isClosure ? 100 : 45,
    },
    {
      icon: ShoppingCart,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
      title: "Procurement",
      tabId: "procurement",
      onCustomNav: null,
      metrics: isClosure
        ? [
            { label: "Plan Items", value: "3", color: "text-slate-900" },
            { label: "Completed", value: "3", color: "text-emerald-600" },
          ]
        : [
            { label: "Plan Items", value: "3", color: "text-slate-900" },
            { label: "Approved", value: "2", color: "text-emerald-600" },
            { label: "Contracts", value: "2", color: "text-blue-600" },
            { label: "POs", value: "2", color: "text-purple-600" },
          ],
      progress: isClosure ? 100 : 67,
    },
    {
      icon: AlertTriangle,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
      title: "Risk Management",
      tabId: "risk",
      onCustomNav: null,
      metrics: isClosure
        ? [
            { label: "Total Risks", value: "9", color: "text-slate-900" },
            { label: "All Closed", value: "9", color: "text-emerald-600" },
          ]
        : [
            { label: "Total", value: "9", color: "text-slate-900" },
            { label: "Critical", value: "1", color: "text-red-600" },
            { label: "High", value: "2", color: "text-orange-600" },
            { label: "Mitigated", value: "3", color: "text-emerald-600" },
          ],
      progress: isClosure ? 100 : 33,
    },
    {
      icon: MessageSquare,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      title: "Communications Plan",
      tabId: "comms",
      onCustomNav: null,
      metrics: isClosure
        ? [
            { label: "Total Activities", value: "8", color: "text-slate-900" },
            { label: "Completed", value: "8", color: "text-emerald-600" },
          ]
        : [
            { label: "Total", value: "8", color: "text-slate-900" },
            { label: "Completed", value: "3", color: "text-emerald-600" },
            { label: "In Progress", value: "3", color: "text-blue-600" },
            { label: "Pending", value: "2", color: "text-slate-400" },
          ],
      progress: isClosure ? 100 : 38,
    },
    {
      icon: BarChart3,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
      title: "Monitoring & Evaluation",
      tabId: "mel",
      onCustomNav: null,
      metrics: isClosure
        ? [
            { label: "Indicators", value: "10", color: "text-slate-900" },
            { label: "On Track", value: "10", color: "text-emerald-600" },
          ]
        : [
            { label: "Indicators", value: "10", color: "text-slate-900" },
            { label: "On Track", value: "4", color: "text-emerald-600" },
            { label: "Baseline Set", value: "8", color: "text-blue-600" },
            { label: "Sources", value: "6", color: "text-purple-600" },
          ],
      progress: isClosure ? 100 : 40,
    },
    {
      icon: Users,
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-50",
      title: "Resource Plan",
      tabId: null,
      onCustomNav: onNavigateToResourcePlan || null,
      metrics: [
        { label: "Staff", value: "10/12", color: "text-slate-900" },
        { label: "Total LOE", value: "1,485 hrs", color: "text-cyan-600" },
      ],
      progress: 83,
    },
    {
      icon: Plane,
      iconColor: "text-sky-600",
      iconBg: "bg-sky-50",
      title: "Travel Plan",
      tabId: null,
      onCustomNav: onNavigateToTravelPlan || null,
      metrics: isClosure
        ? [
            { label: "Total Trips", value: "6", color: "text-slate-900" },
            { label: "Completed", value: "6", color: "text-emerald-600" },
          ]
        : [
            { label: "Total Trips", value: "6", color: "text-slate-900" },
            { label: "Completed", value: "2", color: "text-emerald-600" },
            { label: "Upcoming", value: "3", color: "text-sky-600" },
          ],
      progress: isClosure ? 100 : 33,
    },
    {
      icon: FolderOpen,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
      title: "Project Documents",
      tabId: "documents",
      onCustomNav: null,
      metrics: [
        { label: "Total Files", value: "47", color: "text-slate-900" },
        { label: "Folders", value: "4", color: "text-amber-600" },
      ],
      progress: null,
    },
  ];

  const MiniProgress = ({ value, color = "bg-blue-500" }: { value: number; color?: string }) => (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const colors = kpiColorMap[kpi.color];
          return (
            <div key={kpi.label} className={cn("rounded-lg border p-5", colors.bg)}>
              <div className="flex items-start gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", kpi.color === "blue" ? "bg-blue-100" : kpi.color === "purple" ? "bg-purple-100" : kpi.color === "green" ? "bg-emerald-100" : "bg-red-100")}>
                  <kpi.icon className={cn("w-5 h-5", colors.icon)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-slate-500 mb-0.5">{kpi.label}</p>
                  <p className="text-2xl font-semibold text-slate-900">{kpi.value}</p>
                  <p className={cn("text-[11px] mt-0.5", kpi.subtextColor)}>{kpi.subtext}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestone Tracker — Delivery & Closure */}
      {(isDelivery || isClosure) && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                <Target className="w-[18px] h-[18px] text-purple-600" />
              </div>
              <div>
                <h2 className="text-[14px] font-semibold text-slate-900">Project Milestones</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isClosure
                    ? "All milestones achieved — project closed successfully"
                    : "Track and mark milestones as completed during delivery"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[12px] text-slate-500">{completedCount} of {totalMilestones} completed</p>
                <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div
                    className={cn("h-full rounded-full transition-all", milestoneProgress === 100 ? "bg-emerald-500" : "bg-blue-500")}
                    style={{ width: `${milestoneProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Milestones List */}
          <div className="divide-y divide-slate-100">
            {milestones.map((ms) => {
              const style = typeStyles[ms.type];
              return (
                <div
                  key={ms.id}
                  className={cn(
                    "px-6 py-3.5 flex items-center gap-4 transition-colors",
                    !isClosure && "hover:bg-slate-50 cursor-pointer"
                  )}
                  onClick={() => handleToggleMilestone(ms.id)}
                >
                  {/* Checkbox */}
                  <div className="shrink-0">
                    {ms.completed ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-300 hover:border-blue-400 transition-colors" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-[13px] font-medium", ms.completed ? "text-slate-500 line-through" : "text-slate-900")}>{ms.title}</p>
                      <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", style.bg, style.text)}>
                        {ms.type === "contract" ? "Contract" : ms.type === "deliverable" ? "Deliverable" : "Reporting"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ms.phase}</p>
                  </div>

                  {/* Due / Completed Date */}
                  <div className="shrink-0 text-right">
                    {ms.completed && ms.completedDate ? (
                      <div>
                        <p className="text-[11px] text-emerald-600 font-medium">Completed {ms.completedDate}</p>
                        <p className="text-[10px] text-slate-400">Due: {ms.dueDate}</p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500">Due: {ms.dueDate}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
        {summaryCards.map((card) => {
          const handleNavigate = () => {
            if (card.onCustomNav) {
              card.onCustomNav();
            } else if (card.tabId) {
              onNavigateToTab(card.tabId);
            }
          };

          return (
            <div
              key={card.title}
              className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow-sm transition-all group cursor-pointer"
              onClick={handleNavigate}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", card.iconBg)}>
                    <card.icon className={cn("w-4 h-4", card.iconColor)} />
                  </div>
                  <h3 className="text-[13px] font-semibold text-slate-900">{card.title}</h3>
                </div>
                <div className="flex items-center gap-1 text-[12px] text-[#0B01D0] opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                  View
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Metrics */}
              <div className={cn(
                "grid gap-3 mb-3",
                card.metrics.length <= 2 ? "grid-cols-2" : "grid-cols-4"
              )}>
                {card.metrics.map((metric) => (
                  <div key={metric.label} className="text-center">
                    <p className={cn("text-lg font-semibold", metric.color)}>{metric.value}</p>
                    <p className="text-[11px] text-slate-500">{metric.label}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              {card.progress !== null && (
                <MiniProgress
                  value={card.progress}
                  color={card.progress === 100 ? "bg-emerald-500" : card.progress >= 50 ? "bg-blue-500" : "bg-amber-500"}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}