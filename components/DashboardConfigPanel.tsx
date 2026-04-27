import { useState, useRef, useEffect } from "react";
import { Settings, Eye, EyeOff, X } from "lucide-react";

export interface DashboardSection {
  id: string;
  label: string;
}

interface DashboardConfigPanelProps {
  sections: DashboardSection[];
  visibleSections: Record<string, boolean>;
  onToggle: (id: string) => void;
  onShowAll: () => void;
  onHideAll: () => void;
}

export function DashboardConfigPanel({
  sections,
  visibleSections,
  onToggle,
  onShowAll,
  onHideAll,
}: DashboardConfigPanelProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const visibleCount = Object.values(visibleSections).filter(Boolean).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors text-[13px] text-slate-700"
      >
        <Settings className="w-4 h-4 text-slate-400" />
        <span className="whitespace-nowrap">Configuration</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-[300px] bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div>
                <p className="text-[13px] text-slate-900">Dashboard Cards</p>
                <p className="text-[11px] text-slate-400">{visibleCount} of {sections.length} visible</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-slate-100 rounded transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100">
              <button
                onClick={onShowAll}
                className="flex-1 px-2 py-1.5 text-[11px] text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center"
              >
                Show All
              </button>
              <button
                onClick={onHideAll}
                className="flex-1 px-2 py-1.5 text-[11px] text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-center"
              >
                Hide All
              </button>
            </div>

            {/* Section toggles */}
            <div className="max-h-[360px] overflow-y-auto py-1">
              {sections.map((section) => {
                const isVisible = visibleSections[section.id] !== false;
                return (
                  <button
                    key={section.id}
                    onClick={() => onToggle(section.id)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                  >
                    <span className={`text-[12px] ${isVisible ? "text-slate-900" : "text-slate-400"}`}>
                      {section.label}
                    </span>
                    {isVisible ? (
                      <Eye className="w-4 h-4 text-purple-600 shrink-0" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Hook for managing dashboard section visibility
export function useDashboardConfig(sections: DashboardSection[]) {
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((s) => { initial[s.id] = true; });
    return initial;
  });

  const onToggle = (id: string) => {
    setVisibleSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const onShowAll = () => {
    const all: Record<string, boolean> = {};
    sections.forEach((s) => { all[s.id] = true; });
    setVisibleSections(all);
  };

  const onHideAll = () => {
    const all: Record<string, boolean> = {};
    sections.forEach((s) => { all[s.id] = false; });
    setVisibleSections(all);
  };

  const isVisible = (id: string) => visibleSections[id] !== false;

  return { visibleSections, onToggle, onShowAll, onHideAll, isVisible };
}
