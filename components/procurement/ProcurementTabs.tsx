/**
 * The one tab control for the whole Procurement module.
 *
 * The Purchase Plans screen set the house style — a pill group on a slate
 * tray, purple when active, with an optional count badge. Every procurement
 * screen imports this rather than hand-rolling its own, so the module reads as
 * one product instead of a dozen different tab treatments.
 */

export interface ProcurementTab<T extends string = string> {
  key: T;
  label: string;
  /** Omit where a count would be meaningless. */
  count?: number;
}

export function ProcurementTabs<T extends string>({
  tabs,
  active,
  onChange,
  minWidth = 80,
}: {
  tabs: ProcurementTab<T>[];
  active: T;
  onChange: (key: T) => void;
  /** Narrow this for long labels so the pills don't stretch the row. */
  minWidth?: number;
}) {
  return (
    <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1 flex-wrap">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{ minWidth }}
            className={`px-4 py-1.5 rounded-lg text-[12px] transition-colors flex items-center justify-center gap-1.5 ${
              isActive ? "bg-purple-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** The standard row the tab group sits in, so spacing matches across screens. */
export function ProcurementTabBar({
  children,
  /** "flush" drops the band chrome for pages that are already padded. */
  variant = "band",
}: {
  children: React.ReactNode;
  variant?: "band" | "flush";
}) {
  if (variant === "flush") return <div>{children}</div>;
  return (
    <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">{children}</div>
  );
}
