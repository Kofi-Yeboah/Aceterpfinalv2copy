import { useState } from "react";
import { Search, Download, ChevronDown, CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const statusData = [
  { name: "On Track", value: 12, color: "#10B981" },
  { name: "At Risk", value: 5, color: "#F59E0B" },
  { name: "Delayed", value: 3, color: "#EF4444" },
  { name: "Completed", value: 8, color: "#0B01D0" },
];

const projectList = [
  { id: "PRJ-001", name: "Community Health Initiative", manager: "Kwame Asante", startDate: "2025-01-15", endDate: "2026-06-30", budget: 450000, spent: 215000, status: "On Track", completion: 48 },
  { id: "PRJ-002", name: "Rural Education Program", manager: "Ama Mensah", startDate: "2024-09-01", endDate: "2026-03-31", budget: 320000, spent: 280000, status: "At Risk", completion: 72 },
  { id: "PRJ-003", name: "Water & Sanitation Project", manager: "Kofi Owusu", startDate: "2025-03-01", endDate: "2026-12-31", budget: 580000, spent: 120000, status: "On Track", completion: 21 },
  { id: "PRJ-004", name: "Agricultural Development Fund", manager: "Efua Boateng", startDate: "2024-06-01", endDate: "2025-12-31", budget: 275000, spent: 260000, status: "Delayed", completion: 85 },
  { id: "PRJ-005", name: "Youth Empowerment Initiative", manager: "Yaw Adjei", startDate: "2025-02-01", endDate: "2026-08-31", budget: 190000, spent: 45000, status: "On Track", completion: 15 },
  { id: "PRJ-006", name: "Infrastructure Rehabilitation", manager: "Akua Darko", startDate: "2023-11-01", endDate: "2025-10-31", budget: 820000, spent: 810000, status: "Completed", completion: 100 },
  { id: "PRJ-007", name: "Maternal Health Support", manager: "Nana Agyeman", startDate: "2024-01-15", endDate: "2025-07-31", budget: 410000, spent: 395000, status: "Completed", completion: 100 },
  { id: "PRJ-008", name: "Climate Resilience Program", manager: "Kwame Asante", startDate: "2025-05-01", endDate: "2027-04-30", budget: 650000, spent: 50000, status: "On Track", completion: 8 },
];

const budgetByProject = projectList.slice(0, 6).map(p => ({ name: p.name.length > 20 ? p.name.substring(0, 20) + "..." : p.name, budget: p.budget / 1000, spent: p.spent / 1000 }));

export function ProjectStatusReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = projectList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track": return "text-green-600 bg-green-50";
      case "At Risk": return "text-yellow-600 bg-yellow-50";
      case "Delayed": return "text-red-600 bg-red-50";
      case "Completed": return "text-blue-700 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "On Track": return <CheckCircle size={14} />;
      case "At Risk": return <AlertTriangle size={14} />;
      case "Delayed": return <XCircle size={14} />;
      case "Completed": return <Clock size={14} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-[18px]" style={{ fontWeight: 600 }}>Project Status Report</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-white text-[13px] rounded" style={{ backgroundColor: "#0B01D0" }}>
          <Download size={14} /> Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 p-4">
        {statusData.map(s => (
          <div key={s.name} className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-500">{s.name}</span>
              <span className="text-[20px]" style={{ fontWeight: 700, color: s.color }}>{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 px-4 pb-4">
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-[14px] mb-3" style={{ fontWeight: 600 }}>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-[14px] mb-3" style={{ fontWeight: 600 }}>Budget vs Spent (in $K)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={budgetByProject}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="budget" fill="#0B01D0" name="Budget" />
              <Bar dataKey="spent" fill="#10B981" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 px-4 pb-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full pl-9 pr-3 py-2 border rounded text-[13px]" placeholder="Search projects..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <select className="border rounded px-3 py-2 text-[13px]" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>On Track</option>
          <option>At Risk</option>
          <option>Delayed</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[13px]">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              {["Project ID", "Project Name", "Manager", "Start Date", "End Date", "Budget ($)", "Spent ($)", "Completion", "Status"].map(h => (
                <th key={h} className="text-left text-white px-4 py-3" style={{ fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3" style={{ fontWeight: 500 }}>{p.name}</td>
                <td className="px-4 py-3">{p.manager}</td>
                <td className="px-4 py-3">{p.startDate}</td>
                <td className="px-4 py-3">{p.endDate}</td>
                <td className="px-4 py-3">{p.budget.toLocaleString()}</td>
                <td className="px-4 py-3">{p.spent.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="h-2 rounded-full" style={{ width: `${p.completion}%`, backgroundColor: p.completion === 100 ? "#0B01D0" : "#10B981" }} />
                    </div>
                    <span>{p.completion}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[12px] ${getStatusColor(p.status)}`} style={{ fontWeight: 500 }}>
                    {getStatusIcon(p.status)} {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
