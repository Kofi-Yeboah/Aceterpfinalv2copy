import { useState } from "react";
import { Search, Download, ChevronDown, Plus, Calendar, MoreHorizontal, X } from "lucide-react";

interface Fund {
  id: number;
  fundName: string;
  fundCode: string;
  donor: string;
  project?: string;
  totalAmount: string;
  disbursed: string;
  balance: string;
  status: "Available" | "Depleted" | "Closed" | "Reserved";
}

const fundsData: Fund[] = [
  { id: 1, fundName: "Education Initiative 2024", fundCode: "FUND-EDU-001", donor: "Global Education Fund", project: "Literacy Program", totalAmount: "$500,000", disbursed: "$385,000", balance: "$115,000", status: "Available" },
  { id: 2, fundName: "Health & Wellness Program", fundCode: "FUND-HLT-002", donor: "Health International", project: "Healthcare Access", totalAmount: "$750,000", disbursed: "$425,000", balance: "$325,000", status: "Available" },
  { id: 3, fundName: "Community Development", fundCode: "FUND-COM-003", donor: "Community Partners", project: "Infrastructure", totalAmount: "$300,000", disbursed: "$300,000", balance: "$0", status: "Depleted" },
  { id: 4, fundName: "Youth Empowerment", fundCode: "FUND-YOU-004", donor: "Youth Foundation", totalAmount: "$450,000", disbursed: "$180,000", balance: "$270,000", status: "Available" },
  { id: 5, fundName: "Environmental Conservation", fundCode: "FUND-ENV-005", donor: "Green Earth Alliance", project: "Wildlife Protection", totalAmount: "$600,000", disbursed: "$145,000", balance: "$455,000", status: "Available" },
  { id: 6, fundName: "Technology Access", fundCode: "FUND-TEC-006", donor: "Tech for Good", totalAmount: "$350,000", disbursed: "$0", balance: "$350,000", status: "Reserved" },
  { id: 7, fundName: "Women Empowerment", fundCode: "FUND-WOM-007", donor: "Women's Advancement Fund", project: "Economic Empowerment", totalAmount: "$425,000", disbursed: "$295,000", balance: "$130,000", status: "Available" },
  { id: 8, fundName: "Agriculture Development", fundCode: "FUND-AGR-008", donor: "Agricultural Sustainability", project: "Sustainable Farming", totalAmount: "$550,000", disbursed: "$550,000", balance: "$0", status: "Closed" },
];

// Projects list from the system
const AVAILABLE_PROJECTS = [
  "West Africa Regional Integration Study",
  "Digital Economy Policy Brief Series",
  "Climate Finance Readiness Program",
  "Sustainable Agriculture Development Initiative",
  "Renewable Energy Transition Framework",
];

export function FundsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDonor, setSelectedDonor] = useState("All Donors");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [dateRange, setDateRange] = useState("All Time");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fundName: "",
    fundCode: "",
    donor: "",
    project: "",
    totalAmount: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-50 text-green-700";
      case "Depleted": return "bg-red-50 text-red-700";
      case "Closed": return "bg-slate-50 text-slate-700";
      case "Reserved": return "bg-yellow-50 text-yellow-700";
      default: return "bg-slate-50 text-slate-700";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Funds Management</h1>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by fund name, code, donor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Donor Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedDonor}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedStatus}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <Calendar className="w-4 h-4" />
              <span>{dateRange}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              className="px-4 py-2 rounded-lg text-sm text-white hover:opacity-90 transition-opacity flex items-center gap-2"
              style={{ backgroundColor: "#0B01D0" }}
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              New Fund
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Fund Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Fund Code</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Donor</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Project</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Total Amount</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Disbursed</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Balance</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {fundsData.map((fund) => (
              <tr key={fund.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{fund.fundName}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{fund.fundCode}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{fund.donor}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{fund.project || "-"}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] font-medium text-slate-900">{fund.totalAmount}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] text-slate-900">{fund.disbursed}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] font-medium text-slate-900">{fund.balance}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(fund.status)}`}>
                    {fund.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Fund Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-slate-900">Add New Fund</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <div className="space-y-5">
                {/* Fund Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Fund Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fundName}
                    onChange={(e) => setFormData({ ...formData, fundName: e.target.value })}
                    placeholder="Enter fund name"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Fund Code */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Fund Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fundCode}
                    onChange={(e) => setFormData({ ...formData, fundCode: e.target.value })}
                    placeholder="e.g., FUND-XXX-001"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Row: Donor and Project */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Donor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.donor}
                      onChange={(e) => setFormData({ ...formData, donor: e.target.value })}
                      placeholder="Enter donor name"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Project
                    </label>
                    <select
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select a project (optional)</option>
                      {AVAILABLE_PROJECTS.map((project) => (
                        <option key={project} value={project}>
                          {project}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Total Amount */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Total Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    placeholder="$0.00"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Row: Start Date and End Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter fund description..."
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle form submission here
                  console.log("Form data:", formData);
                  setIsModalOpen(false);
                  setFormData({
                    fundName: "",
                    fundCode: "",
                    donor: "",
                    project: "",
                    totalAmount: "",
                    description: "",
                    startDate: "",
                    endDate: "",
                  });
                }}
                className="px-4 py-2 rounded-lg text-sm text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#0B01D0" }}
              >
                Add Fund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}