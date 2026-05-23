import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ENTITY_CODES, BUSINESS_UNIT_CODES, DEPARTMENT_CODES, COST_CENTER_CODES, ACCOUNT_SEGMENTS } from "./constants";

interface SegmentFilterProps {
  onFilterChange: (filters: Record<string, string>) => void;
}

export function SegmentFilter({ onFilterChange }: SegmentFilterProps) {
  const [filters, setFilters] = useState<Record<string, string>>({
    entity: "",
    businessUnit: "",
    department: "",
    account: "",
    costCenter: "",
    intercompany: "",
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleChange = (segment: string, value: string) => {
    const updated = { ...filters, [segment]: value };
    setFilters(updated);
    onFilterChange(updated);
    setOpenDropdown(null);
  };

  const segments = [
    { key: "entity", options: ENTITY_CODES.map(e => ({ value: e.code, label: `${e.code} - ${e.name}` })) },
    { key: "businessUnit", options: BUSINESS_UNIT_CODES.map(b => ({ value: b.code, label: `${b.code} - ${b.name}` })) },
    { key: "department", options: DEPARTMENT_CODES.map(d => ({ value: d.code, label: `${d.code} - ${d.name}` })) },
    { key: "account", options: [] as { value: string; label: string }[] },
    { key: "costCenter", options: COST_CENTER_CODES.map(c => ({ value: c.code, label: `${c.code} - ${c.name}` })) },
    { key: "intercompany", options: [{ value: "00", label: "00 - None" }, { value: "02", label: "02 - ACET Nigeria" }, { value: "03", label: "03 - ACET Kenya" }] },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] text-slate-500 uppercase tracking-wider">Segment Filter:</span>
      {segments.map(({ key, options }) => {
        const segInfo = ACCOUNT_SEGMENTS[key as keyof typeof ACCOUNT_SEGMENTS];
        return (
          <div key={key} className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
              className={`px-2.5 py-1.5 border rounded-lg text-[11px] flex items-center gap-1.5 transition-colors ${
                filters[key] ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="font-medium">{segInfo.label}</span>
              <span className="font-mono">{filters[key] || "All"}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {openDropdown === key && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-48 overflow-auto">
                <button
                  onClick={() => handleChange(key, "")}
                  className="w-full px-3 py-2 text-left text-[11px] text-slate-600 hover:bg-slate-50"
                >
                  All
                </button>
                {key === "account" ? (
                  <div className="px-3 py-2">
                    <input
                      type="text"
                      placeholder="Type account #..."
                      className="w-full px-2 py-1 border border-slate-200 rounded text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onChange={(e) => handleChange(key, e.target.value)}
                      autoFocus
                    />
                  </div>
                ) : (
                  options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleChange(key, opt.value)}
                      className={`w-full px-3 py-2 text-left text-[11px] hover:bg-slate-50 ${
                        filters[key] === opt.value ? "bg-blue-50 text-blue-700" : "text-slate-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
      {Object.values(filters).some(v => v) && (
        <button
          onClick={() => {
            const cleared = { entity: "", businessUnit: "", department: "", account: "", costCenter: "", intercompany: "" };
            setFilters(cleared);
            onFilterChange(cleared);
          }}
          className="text-[11px] text-red-600 hover:text-red-700 ml-1"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
