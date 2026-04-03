import { useState } from "react";
import { Search, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const staffData = [
  { id: "EMP-001", name: "Kwame Asante", role: "Project Manager", department: "Project Management", allocated: 95, billable: 85, projects: 3 },
  { id: "EMP-002", name: "Ama Mensah", role: "Program Officer", department: "Project Management", allocated: 110, billable: 90, projects: 4 },
  { id: "EMP-003", name: "Kofi Owusu", role: "M&E Specialist", department: "Monitoring & Evaluation", allocated: 80, billable: 72, projects: 2 },
  { id: "EMP-004", name: "Efua Boateng", role: "Finance Officer", department: "Financial Management", allocated: 75, billable: 65, projects: 2 },
  { id: "EMP-005", name: "Yaw Adjei", role: "Procurement Officer", department: "Procurement", allocated: 88, billable: 78, projects: 3 },
  { id: "EMP-006", name: "Akua Darko", role: "HR Coordinator", department: "HR Management", allocated: 70, billable: 60, projects: 1 },
  { id: "EMP-007", name: "Nana Agyeman", role: "Field Coordinator", department: "Project Management", allocated: 100, billable: 92, projects: 3 },
  { id: "EMP-008", name: "Abena Sarpong", role: "Data Analyst", department: "IT & Systems", allocated: 65, billable: 55, projects: 2 },
];

const deptUtilization = [
  { dept: "Project Mgmt", utilization: 92 },
  { dept: "Finance", utilization: 75 },
  { dept: "HR", utilization: 70 },
  { dept: "M&E", utilization: 80 },
  { dept: "Procurement", utilization: 88 },
  { dept: "IT", utilization: 65 },
];

export function ResourceUtilizationReport() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = staffData.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.department.toLowerCase().includes(searchQuery.toLowerCase()));

  const getUtilColor = (val: number) => val > 100 ? "text-red-600 bg-red-50" : val >= 80 ? "text-green-600 bg-green-50" : val >= 60 ? "text-yellow-600 bg-yellow-50" : "text-gray-600 bg-gray-50";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-[18px]" style={{ fontWeight: 600 }}>Staff Utilization Report</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-white text-[13px] rounded" style={{ backgroundColor: "#0B01D0" }}><Download size={14} /> Export</button>
      </div>

      <div className="grid grid-cols-4 gap-4 p-4">
        <div className="bg-white border rounded-lg p-4"><span className="text-[13px] text-gray-500">Avg Utilization</span><p className="text-[20px]" style={{ fontWeight: 700, color: "#0B01D0" }}>85%</p></div>
        <div className="bg-white border rounded-lg p-4"><span className="text-[13px] text-gray-500">Over-allocated</span><p className="text-[20px]" style={{ fontWeight: 700, color: "#EF4444" }}>1</p></div>
        <div className="bg-white border rounded-lg p-4"><span className="text-[13px] text-gray-500">Under-utilized</span><p className="text-[20px]" style={{ fontWeight: 700, color: "#F59E0B" }}>2</p></div>
        <div className="bg-white border rounded-lg p-4"><span className="text-[13px] text-gray-500">Total Staff</span><p className="text-[20px]" style={{ fontWeight: 700 }}>{staffData.length}</p></div>
      </div>

      <div className="px-4 pb-4">
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-[14px] mb-3" style={{ fontWeight: 600 }}>Utilization by Department (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptUtilization}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 120]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="utilization" fill="#0B01D0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full pl-9 pr-3 py-2 border rounded text-[13px]" placeholder="Search staff..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-[13px]">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              {["Employee ID", "Name", "Role", "Department", "Allocation %", "Billable %", "Projects"].map(h => (
                <th key={h} className="text-left text-white px-4 py-3" style={{ fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td className="px-4 py-3">{s.id}</td>
                <td className="px-4 py-3" style={{ fontWeight: 500 }}>{s.name}</td>
                <td className="px-4 py-3">{s.role}</td>
                <td className="px-4 py-3">{s.department}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-[12px] ${getUtilColor(s.allocated)}`} style={{ fontWeight: 500 }}>{s.allocated}%</span></td>
                <td className="px-4 py-3">{s.billable}%</td>
                <td className="px-4 py-3">{s.projects}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
