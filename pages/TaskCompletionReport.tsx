import { useState } from "react";
import { Search, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const statusData = [
  { name: "Completed", value: 45, color: "#10B981" },
  { name: "In Progress", value: 28, color: "#0B01D0" },
  { name: "Overdue", value: 8, color: "#EF4444" },
  { name: "Not Started", value: 12, color: "#9CA3AF" },
];

const tasks = [
  { id: "TSK-001", title: "Baseline Survey Report", project: "Community Health Initiative", assignee: "Kwame Asante", dueDate: "2025-11-30", completedDate: "2025-11-28", status: "Completed" },
  { id: "TSK-002", title: "Quarterly Financial Report Q3", project: "Rural Education Program", assignee: "Efua Boateng", dueDate: "2025-10-15", completedDate: "-", status: "Overdue" },
  { id: "TSK-003", title: "Stakeholder Engagement Plan", project: "Water & Sanitation Project", assignee: "Ama Mensah", dueDate: "2026-01-15", completedDate: "-", status: "In Progress" },
  { id: "TSK-004", title: "Mid-Term Evaluation", project: "Agricultural Development Fund", assignee: "Kofi Owusu", dueDate: "2025-12-31", completedDate: "-", status: "In Progress" },
  { id: "TSK-005", title: "Procurement Plan Update", project: "Youth Empowerment Initiative", assignee: "Yaw Adjei", dueDate: "2026-02-28", completedDate: "-", status: "Not Started" },
  { id: "TSK-006", title: "Final Project Report", project: "Infrastructure Rehabilitation", assignee: "Akua Darko", dueDate: "2025-10-31", completedDate: "2025-10-29", status: "Completed" },
  { id: "TSK-007", title: "Risk Assessment Update", project: "Climate Resilience Program", assignee: "Nana Agyeman", dueDate: "2026-01-31", completedDate: "-", status: "In Progress" },
  { id: "TSK-008", title: "Training Needs Assessment", project: "Maternal Health Support", assignee: "Abena Sarpong", dueDate: "2025-12-15", completedDate: "2025-12-10", status: "Completed" },
];

const byProject = [
  { project: "Health", completed: 12, pending: 5 },
  { project: "Education", completed: 8, pending: 6 },
  { project: "WASH", completed: 5, pending: 8 },
  { project: "Agriculture", completed: 10, pending: 3 },
  { project: "Youth", completed: 3, pending: 4 },
  { project: "Infrastructure", completed: 7, pending: 2 },
];

export function TaskCompletionReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusColor = (s: string) => {
    switch (s) { case "Completed": return "text-green-600 bg-green-50"; case "In Progress": return "text-blue-700 bg-blue-50"; case "Overdue": return "text-red-600 bg-red-50"; case "Not Started": return "text-gray-600 bg-gray-100"; default: return ""; }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-[18px]" style={{ fontWeight: 600 }}>Task Completion Report</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-white text-[13px] rounded" style={{ backgroundColor: "#0B01D0" }}><Download size={14} /> Export</button>
      </div>

      <div className="grid grid-cols-4 gap-4 p-4">
        {statusData.map(s => (
          <div key={s.name} className="bg-white border rounded-lg p-4">
            <span className="text-[13px] text-gray-500">{s.name}</span>
            <p className="text-[20px]" style={{ fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 px-4 pb-4">
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-[14px] mb-3" style={{ fontWeight: 600 }}>Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={statusData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>{statusData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Legend /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-[14px] mb-3" style={{ fontWeight: 600 }}>Completion by Project</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byProject}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="project" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Bar dataKey="completed" fill="#10B981" /><Bar dataKey="pending" fill="#F59E0B" /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 pb-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full pl-9 pr-3 py-2 border rounded text-[13px]" placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <select className="border rounded px-3 py-2 text-[13px]" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option>All</option><option>Completed</option><option>In Progress</option><option>Overdue</option><option>Not Started</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-[13px]">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              {["Task ID", "Title", "Project", "Assignee", "Due Date", "Completed Date", "Status"].map(h => (
                <th key={h} className="text-left text-white px-4 py-3" style={{ fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={t.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td className="px-4 py-3">{t.id}</td>
                <td className="px-4 py-3" style={{ fontWeight: 500 }}>{t.title}</td>
                <td className="px-4 py-3">{t.project}</td>
                <td className="px-4 py-3">{t.assignee}</td>
                <td className="px-4 py-3">{t.dueDate}</td>
                <td className="px-4 py-3">{t.completedDate}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-[12px] ${getStatusColor(t.status)}`} style={{ fontWeight: 500 }}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
