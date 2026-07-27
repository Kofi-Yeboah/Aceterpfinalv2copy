import type { ReactNode } from "react";

/**
 * The one metric card for the whole Procurement module.
 *
 * Layout: icon and label on the top row, the figure beneath it. The surface is
 * plain white with a standard border — colour appears only on the icon, so a
 * row of these sits quietly above the blue table headers used throughout the
 * module rather than competing with them.
 *
 * Every procurement screen imports this instead of hand-rolling its own cards.
 */

export type StatTone = "neutral" | "success" | "warning" | "danger" | "info" | "accent";

const TONE_COLOR: Record<StatTone, string> = {
  neutral: "#64748b", // slate-500
  success: "#15803d", // green-700
  warning: "#a16207", // amber-700
  danger: "#b91c1c",  // red-700
  info: "#0369a1",    // sky-700
  accent: "#6d28d9",  // violet-700
};

export interface ProcurementStat {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: StatTone;
  /** Optional second line, e.g. "of $1.2M planned". Keep it short. */
  sub?: string;
  onClick?: () => void;
}

export function ProcurementStatCards({
  stats,
  className = "",
  /**
   * "band" draws the full-bleed white strip used directly under a screen
   * header. "flush" drops that chrome for rows sitting inside an already
   * padded panel, where a second white panel and a stray rule would read wrong.
   */
  variant = "band",
}: {
  stats: ProcurementStat[];
  className?: string;
  variant?: "band" | "flush";
}) {
  if (stats.length === 0) return null;

  const row = (
    <div className="flex items-stretch gap-3 flex-wrap">
      {stats.map((s) => (
        <ProcurementStatCard key={s.label} {...s} />
      ))}
    </div>
  );

  if (variant === "flush") return <div className={className}>{row}</div>;

  return (
    <div className={`px-6 py-3 bg-white border-b border-slate-200 shrink-0 ${className}`}>{row}</div>
  );
}

/** A single card, for the rare screen that needs one outside the standard row. */
export function ProcurementStatCard({ label, value, icon, tone = "neutral", sub, onClick }: ProcurementStat) {
  const color = TONE_COLOR[tone];
  const interactive = typeof onClick === "function";

  return (
    <div
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick!(); } } : undefined}
      className={`flex-1 min-w-[150px] bg-white border border-slate-200 rounded-xl px-3.5 py-3 ${
        interactive ? "cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="shrink-0 flex items-center" style={{ color }}>{icon}</span>}
        <span className="text-[11px] font-medium text-slate-500 truncate">{label}</span>
      </div>
      <p className="text-[22px] font-semibold text-slate-900 leading-tight mt-1.5">{value}</p>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5 truncate">{sub}</p>}
    </div>
  );
}
