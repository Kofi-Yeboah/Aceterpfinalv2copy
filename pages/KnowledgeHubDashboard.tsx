import { useState } from "react";
import { FileText, Folder, BookOpen, Users, TrendingUp, Award, Clock, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { DashboardConfigPanel, useDashboardConfig } from "../components/DashboardConfigPanel";

const proposalStats = [
  { month: "Aug", won: 8, lost: 3 },
  { month: "Sep", won: 12, lost: 2 },
  { month: "Oct", won: 10, lost: 4 },
  { month: "Nov", won: 15, lost: 3 },
  { month: "Dec", won: 11, lost: 5 },
  { month: "Jan", won: 14, lost: 2 },
];

const proposalsBySector = [
  { name: "Health", value: 35, color: "#0B01D0" },
  { name: "Education", value: 28, color: "#4338ca" },
  { name: "Agriculture", value: 18, color: "#6366f1" },
  { name: "Environment", value: 12, color: "#818cf8" },
  { name: "Other", value: 7, color: "#a5b4fc" },
];

const recentProposals = [
  { id: "1", title: "Community Health Initiative", donor: "WHO", sector: "Health", value: "$250,000", status: "Won", date: "Jan 20, 2026" },
  { id: "2", title: "Girls Education Program", donor: "UNESCO", sector: "Education", value: "$180,000", status: "Won", date: "Jan 15, 2026" },
  { id: "3", title: "Agriculture Innovation Project", donor: "Gates Foundation", sector: "Agriculture", value: "$320,000", status: "Lost", date: "Jan 10, 2026" },
  { id: "4", title: "Environmental Conservation", donor: "Green Fund", sector: "Environment", value: "$150,000", status: "Won", date: "Jan 5, 2026" },
];

const recentDocuments = [
  { id: "1", title: "Project Closure Report - Health Initiative 2025", type: "Closure Report", uploadedBy: "Sarah Johnson", date: "Jan 22, 2026" },
  { id: "2", title: "Policy Brief - Rural Education Access", type: "Policy Brief", uploadedBy: "Michael Chen", date: "Jan 18, 2026" },
  { id: "3", title: "Quarterly Deliverable - Water Project", type: "Funder Deliverable", uploadedBy: "Emily Davis", date: "Jan 12, 2026" },
];

const topDonors = [
  { donor: "WHO", proposals: 12, winRate: "85%", totalValue: "$2.1M" },
  { donor: "Gates Foundation", proposals: 8, winRate: "75%", totalValue: "$3.2M" },
  { donor: "UNESCO", proposals: 10, winRate: "80%", totalValue: "$1.8M" },
  { donor: "Green Fund", proposals: 6, winRate: "67%", totalValue: "$950K" },
];

const KH_SECTIONS = [
  { id: "kpis", label: "KPI Cards" },
  { id: "proposalTrend", label: "Proposal Win/Loss Trend" },
  { id: "sectorDist", label: "Proposals by Sector" },
  { id: "recentProposals", label: "Recent Proposals" },
  { id: "donorPerf", label: "Donor Performance" },
];

export function KnowledgeHubDashboard() {
  const [timeframe, setTimeframe] = useState("Last 6 Months");
  const { visibleSections, onToggle, onShowAll, onHideAll, isVisible } = useDashboardConfig(KH_SECTIONS);

  const getStatusColor = (status: string) => {
    return status === "Won" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700";
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="px-8 py-6 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Knowledge Hub Dashboard</h1>
          <div className="flex items-center gap-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
            >
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
            <DashboardConfigPanel sections={KH_SECTIONS} visibleSections={visibleSections} onToggle={onToggle} onShowAll={onShowAll} onHideAll={onHideAll} />
          </div>
        </div>

        {/* Summary Cards */}
        {isVisible("kpis") && (
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Award className="text-[#0B01D0]" size={24} />
                </div>
                <TrendingUp className="text-emerald-600" size={20} />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">287</div>
              <div className="text-sm text-slate-600">Total Proposals</div>
              <div className="mt-2 text-xs text-emerald-600 font-medium">82% Win Rate</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Folder className="text-purple-600" size={24} />
                </div>
                <Database className="text-slate-400" size={20} />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">1,245</div>
              <div className="text-sm text-slate-600">Project Artifacts</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
                  <BookOpen className="text-amber-600" size={24} />
                </div>
                <FileText className="text-slate-400" size={20} />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">156</div>
              <div className="text-sm text-slate-600">Templates Available</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Users className="text-emerald-600" size={24} />
                </div>
                <Clock className="text-slate-400" size={20} />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">48</div>
              <div className="text-sm text-slate-600">Donor Profiles</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Proposal Success Rate */}
          {isVisible("proposalTrend") && (
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Proposal Success Rate (Last 6 Months)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={proposalStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="won" fill="#10b981" name="Won" />
                  <Bar dataKey="lost" fill="#ef4444" name="Lost" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Proposals by Sector */}
          {isVisible("sectorDist") && (
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Proposals by Sector</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={proposalsBySector}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {proposalsBySector.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Proposals */}
        {isVisible("recentProposals") && (
          <div className="bg-white border border-slate-200 rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Recent Proposals</h3>
              <button className="text-sm text-[#0B01D0] hover:underline">View All</button>
            </div>
            <table className="w-full">
              <thead className="bg-[#0B01D0]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs text-white">Proposal Title</th>
                  <th className="px-6 py-4 text-left text-xs text-white">Donor</th>
                  <th className="px-6 py-4 text-left text-xs text-white">Sector</th>
                  <th className="px-6 py-4 text-left text-xs text-white">Value</th>
                  <th className="px-6 py-4 text-left text-xs text-white">Status</th>
                  <th className="px-6 py-4 text-left text-xs text-white">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentProposals.map((proposal, index) => (
                  <tr
                    key={proposal.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                  >
                    <td className="px-6 py-4 text-[12px] font-semibold text-slate-900">{proposal.title}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-600">{proposal.donor}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-600">{proposal.sector}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{proposal.value}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getStatusColor(proposal.status)}`}>
                        {proposal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[12px] text-slate-600">{proposal.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Top Donors */}
          {isVisible("donorPerf") && (
            <div className="bg-white border border-slate-200 rounded-lg">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Top Donors by Success Rate</h3>
              </div>
              <table className="w-full">
                <thead className="bg-[#0B01D0]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs text-white">Donor</th>
                    <th className="px-6 py-4 text-left text-xs text-white">Proposals</th>
                    <th className="px-6 py-4 text-left text-xs text-white">Win Rate</th>
                    <th className="px-6 py-4 text-left text-xs text-white">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {topDonors.map((donor, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                    >
                      <td className="px-6 py-4 text-[12px] font-semibold text-slate-900">{donor.donor}</td>
                      <td className="px-6 py-4 text-[12px] text-slate-600">{donor.proposals}</td>
                      <td className="px-6 py-4 text-[12px] text-emerald-600 font-semibold">{donor.winRate}</td>
                      <td className="px-6 py-4 text-[12px] text-slate-900">{donor.totalValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Recent Documents */}
          <div className="bg-white border border-slate-200 rounded-lg">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Recently Uploaded Documents</h3>
            </div>
            <table className="w-full">
              <thead className="bg-[#0B01D0]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs text-white">Document Title</th>
                  <th className="px-6 py-4 text-left text-xs text-white">Type</th>
                  <th className="px-6 py-4 text-left text-xs text-white">Uploaded By</th>
                  <th className="px-6 py-4 text-left text-xs text-white">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentDocuments.map((doc, index) => (
                  <tr
                    key={doc.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                  >
                    <td className="px-6 py-4 text-[12px] font-semibold text-slate-900">{doc.title}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-600">{doc.type}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-600">{doc.uploadedBy}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-600">{doc.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KnowledgeHubDashboard;