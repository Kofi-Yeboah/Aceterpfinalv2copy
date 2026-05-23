import { useState } from "react";
import { Search, Download, Filter, Eye } from "lucide-react";
import type { AuditLogEntry } from "./types";
import { mockAuditLog } from "./mockData";

export function AuditTrail() {
  const [entries] = useState<AuditLogEntry[]>(mockAuditLog);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<string>("All");
  const [filterModule, setFilterModule] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const actions = [...new Set(entries.map(e => e.action))];
  const modules = [...new Set(entries.map(e => e.module))];

  const filtered = entries.filter(e => {
    if (filterAction !== "All" && e.action !== filterAction) return false;
    if (filterModule !== "All" && e.module !== filterModule) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return e.userName.toLowerCase().includes(q) || e.entityDescription.toLowerCase().includes(q) || e.entityId.toLowerCase().includes(q);
    }
    return true;
  });

  const actionColors: Record<string, string> = {
    Create: "bg-green-50 text-green-700",
    Update: "bg-blue-50 text-blue-700",
    Delete: "bg-red-50 text-red-700",
    Approve: "bg-purple-50 text-purple-700",
    Post: "bg-emerald-50 text-emerald-700",
    Reverse: "bg-orange-50 text-orange-700",
    Login: "bg-slate-100 text-slate-600",
    StatusChange: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Audit Trail</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">Immutable log of all system actions | {entries.length} total entries</p>
          </div>
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2 bg-white">
            <Download size={14} />Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 bg-white border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by user, description, entity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white"
          >
            <option value="All">All Actions</option>
            {actions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select
            value={filterModule}
            onChange={e => setFilterModule(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white"
          >
            <option value="All">All Modules</option>
            {modules.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Timestamp</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">User</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Action</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Module</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Entity</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Description</th>
              <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(entry => (
              <>
                <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-[11px] font-mono text-slate-600">{entry.timestamp}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-800">{entry.userName}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${actionColors[entry.action] || "bg-slate-100 text-slate-600"}`}>
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">{entry.module}</td>
                  <td className="px-4 py-3 text-[11px] font-mono text-slate-500">{entry.entityId}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-700 max-w-[250px] truncate">{entry.entityDescription}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                      className="p-1 hover:bg-slate-100 rounded"
                    >
                      <Eye size={13} className="text-slate-400" />
                    </button>
                  </td>
                </tr>
                {expandedId === entry.id && (
                  <tr key={`${entry.id}-detail`} className="bg-slate-50">
                    <td colSpan={7} className="px-6 py-3">
                      <div className="grid grid-cols-2 gap-4">
                        {entry.beforeValue && (
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Before</p>
                            <pre className="text-[10px] text-slate-700 bg-white border border-slate-200 rounded-lg p-2 font-mono overflow-x-auto">{entry.beforeValue}</pre>
                          </div>
                        )}
                        {entry.afterValue && (
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">After</p>
                            <pre className="text-[10px] text-slate-700 bg-white border border-slate-200 rounded-lg p-2 font-mono overflow-x-auto">{entry.afterValue}</pre>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-[10px] text-slate-400">
                        <span>IP: {entry.ipAddress}</span>
                        <span>User ID: {entry.userId}</span>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
