import { useState } from "react";
import { Search, Download, Calendar } from "lucide-react";

const projects = [
  { id: "PRJ-001", name: "Community Health Initiative", start: "2025-01-15", end: "2026-06-30", completion: 48, status: "On Track", milestones: 4, milestonesCompleted: 2 },
  { id: "PRJ-002", name: "Rural Education Program", start: "2024-09-01", end: "2026-03-31", completion: 72, status: "At Risk", milestones: 6, milestonesCompleted: 4 },
  { id: "PRJ-003", name: "Water & Sanitation Project", start: "2025-03-01", end: "2026-12-31", completion: 21, status: "On Track", milestones: 5, milestonesCompleted: 1 },
  { id: "PRJ-004", name: "Agricultural Development Fund", start: "2024-06-01", end: "2025-12-31", completion: 85, status: "Delayed", milestones: 8, milestonesCompleted: 6 },
  { id: "PRJ-005", name: "Youth Empowerment Initiative", start: "2025-02-01", end: "2026-08-31", completion: 15, status: "On Track", milestones: 3, milestonesCompleted: 0 },
  { id: "PRJ-006", name: "Infrastructure Rehabilitation", start: "2023-11-01", end: "2025-10-31", completion: 100, status: "Completed", milestones: 10, milestonesCompleted: 10 },
  { id: "PRJ-007", name: "Climate Resilience Program", start: "2025-05-01", end: "2027-04-30", completion: 8, status: "On Track", milestones: 7, milestonesCompleted: 0 },
];

export function TimelineReport() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase()));

  const getStatusColor = (s: string) => {
    switch (s) { case "On Track": return "text-green-600 bg-green-50"; case "At Risk": return "text-yellow-600 bg-yellow-50"; case "Delayed": return "text-red-600 bg-red-50"; case "Completed": return "text-blue-700 bg-blue-50"; default: return "text-gray-600 bg-gray-50"; }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-[18px]" style={{ fontWeight: 600 }}>Timeline Report</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-white text-[13px] rounded" style={{ backgroundColor: "#0B01D0" }}><Download size={14} /> Export</button>
      </div>

      <div className="grid grid-cols-4 gap-4 p-4">
        <div className="bg-white border rounded-lg p-4"><span className="text-[13px] text-gray-500">Total Projects</span><p className="text-[20px]" style={{ fontWeight: 700, color: "#0B01D0" }}>{projects.length}</p></div>
        <div className="bg-white border rounded-lg p-4"><span className="text-[13px] text-gray-500">On Schedule</span><p className="text-[20px]" style={{ fontWeight: 700, color: "#10B981" }}>{projects.filter(p => p.status === "On Track").length}</p></div>
        <div className="bg-white border rounded-lg p-4"><span className="text-[13px] text-gray-500">Delayed</span><p className="text-[20px]" style={{ fontWeight: 700, color: "#EF4444" }}>{projects.filter(p => p.status === "Delayed").length}</p></div>
        <div className="bg-white border rounded-lg p-4"><span className="text-[13px] text-gray-500">Milestones Completed</span><p className="text-[20px]" style={{ fontWeight: 700 }}>{projects.reduce((a, p) => a + p.milestonesCompleted, 0)}/{projects.reduce((a, p) => a + p.milestones, 0)}</p></div>
      </div>

      <div className="px-4 pb-3">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full pl-9 pr-3 py-2 border rounded text-[13px]" placeholder="Search projects..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-[13px]">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              {["Project ID", "Project Name", "Start Date", "End Date", "Milestones", "Completion", "Status"].map(h => (
                <th key={h} className="text-left text-white px-4 py-3" style={{ fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3" style={{ fontWeight: 500 }}>{p.name}</td>
                <td className="px-4 py-3">{p.start}</td>
                <td className="px-4 py-3">{p.end}</td>
                <td className="px-4 py-3">{p.milestonesCompleted}/{p.milestones}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full"><div className="h-2 rounded-full" style={{ width: `${p.completion}%`, backgroundColor: p.completion === 100 ? "#0B01D0" : "#10B981" }} /></div>
                    <span>{p.completion}%</span>
                  </div>
                </td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-[12px] ${getStatusColor(p.status)}`} style={{ fontWeight: 500 }}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
