import { useState } from "react";
import { Search, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const projects = [
  { id: "PRJ-001", name: "Community Health Initiative", budget: 450000, actual: 215000, variance: 235000, variancePct: 52.2, status: "Under Budget" },
  { id: "PRJ-002", name: "Rural Education Program", budget: 320000, actual: 280000, variance: 40000, variancePct: 12.5, status: "Under Budget" },
  { id: "PRJ-003", name: "Water & Sanitation Project", budget: 580000, actual: 120000, variance: 460000, variancePct: 79.3, status: "Under Budget" },
  { id: "PRJ-004", name: "Agricultural Development Fund", budget: 275000, actual: 290000, variance: -15000, variancePct: -5.5, status: "Over Budget" },
  { id: "PRJ-005", name: "Youth Empowerment Initiative", budget: 190000, actual: 45000, variance: 145000, variancePct: 76.3, status: "Under Budget" },
  { id: "PRJ-006", name: "Infrastructure Rehabilitation", budget: 820000, actual: 810000, variance: 10000, variancePct: 1.2, status: "On Budget" },
  { id: "PRJ-007", name: "Maternal Health Support", budget: 410000, actual: 395000, variance: 15000, variancePct: 3.7, status: "On Budget" },
  { id: "PRJ-008", name: "Climate Resilience Program", budget: 650000, actual: 50000, variance: 600000, variancePct: 92.3, status: "Under Budget" },
];

const chartData = projects.slice(0, 6).map(p => ({ name: p.name.length > 18 ? p.name.substring(0, 18) + "..." : p.name, Budget: p.budget / 1000, Actual: p.actual / 1000 }));

export function BudgetVsActualProjectReport() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalBudget = projects.reduce((a, p) => a + p.budget, 0);
  const totalActual = projects.reduce((a, p) => a + p.actual, 0);

  const getStatusColor = (s: string) => s === "Over Budget" ? "text-red-600 bg-red-50" : s === "On Budget" ? "text-blue-700 bg-blue-50" : "text-green-600 bg-green-50";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-[18px]" style={{ fontWeight: 600 }}>Budget vs Actual Report</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-white text-[13px] rounded" style={{ backgroundColor: "#0B01D0" }}><Download size={14} /> Export</button>
      </div>

      <div className="grid grid-cols-4 gap-4 p-4">
        <div className="bg-white border rounded-lg p-4"><span className="text-[13px] text-gray-500">Total Budget</span><p className="text-[20px]" style={{ fontWeight: 700, color: "#0B01D0" }}>${(totalBudget / 1000).toFixed(0)}K</p></div>
        <div className="bg-white border rounded-lg p-4"><span className="text-[13px] text-gray-500">Total Actual</span><p className="text-[20px]" style={{ fontWeight: 700 }}>${(totalActual / 1000).toFixed(0)}K</p></div>
        <div className="bg-white border rounded-lg p-4"><span className="text-[13px] text-gray-500">Total Variance</span><p className="text-[20px]" style={{ fontWeight: 700, color: "#10B981" }}>${((totalBudget - totalActual) / 1000).toFixed(0)}K</p></div>
        <div className="bg-white border rounded-lg p-4"><span className="text-[13px] text-gray-500">Over Budget</span><p className="text-[20px]" style={{ fontWeight: 700, color: "#EF4444" }}>{projects.filter(p => p.status === "Over Budget").length}</p></div>
      </div>

      <div className="px-4 pb-4">
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-[14px] mb-3" style={{ fontWeight: 600 }}>Budget vs Actual ($K)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Budget" fill="#0B01D0" />
              <Bar dataKey="Actual" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
              {["Project ID", "Project Name", "Budget ($)", "Actual ($)", "Variance ($)", "Variance %", "Status"].map(h => (
                <th key={h} className="text-left text-white px-4 py-3" style={{ fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3" style={{ fontWeight: 500 }}>{p.name}</td>
                <td className="px-4 py-3">{p.budget.toLocaleString()}</td>
                <td className="px-4 py-3">{p.actual.toLocaleString()}</td>
                <td className="px-4 py-3" style={{ color: p.variance < 0 ? "#EF4444" : "#10B981" }}>{p.variance < 0 ? "-" : ""}${Math.abs(p.variance).toLocaleString()}</td>
                <td className="px-4 py-3">{p.variancePct}%</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-[12px] ${getStatusColor(p.status)}`} style={{ fontWeight: 500 }}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
