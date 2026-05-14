import { useState } from "react";
import { Search, ChevronDown, Download, Calendar } from "lucide-react";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";

type RequestType = "Travel Request" | "Expense Claim" | "Leave Request" | "Refund Request";

interface ApprovedRequestData {
  id: string;
  requestType: RequestType;
  description: string;
  submittedDate: string;
  approvedDate: string;
  approvedBy: string;
  amount?: string;
  duration?: string;
}

const MOCK_APPROVED_REQUESTS: ApprovedRequestData[] = [
  {
    id: "TR-001",
    requestType: "Travel Request",
    description: "Regional Conference on Climate Change",
    submittedDate: "Nov 20, 2025",
    approvedDate: "Nov 22, 2025",
    approvedBy: "Kwame Asante",
    amount: "$2,500"
  },
  {
    id: "EC-001",
    requestType: "Expense Claim",
    description: "Flight tickets to Accra for conference",
    submittedDate: "Nov 20, 2025",
    approvedDate: "Nov 21, 2025",
    approvedBy: "Ama Darko",
    amount: "$850"
  },
  {
    id: "LR-045",
    requestType: "Leave Request",
    description: "Annual",
    submittedDate: "Nov 18, 2025",
    approvedDate: "Nov 19, 2025",
    approvedBy: "Yaw Osei",
    duration: "5 days"
  },
  {
    id: "TR-004",
    requestType: "Travel Request",
    description: "Project Monitoring and Evaluation in Abidjan",
    submittedDate: "Nov 15, 2025",
    approvedDate: "Nov 17, 2025",
    approvedBy: "Kwame Asante",
    amount: "$2,100"
  },
  {
    id: "EC-004",
    requestType: "Expense Claim",
    description: "Taxi and local transport during field visit",
    submittedDate: "Nov 18, 2025",
    approvedDate: "Nov 19, 2025",
    approvedBy: "Ama Darko",
    amount: "$85"
  },
  {
    id: "RR-012",
    requestType: "Refund Request",
    description: "Advance payment refund for workshop materials",
    submittedDate: "Nov 16, 2025",
    approvedDate: "Nov 18, 2025",
    approvedBy: "Kofi Mensah",
    amount: "$340"
  },
  {
    id: "EC-008",
    requestType: "Expense Claim",
    description: "Conference registration fee",
    submittedDate: "Nov 16, 2025",
    approvedDate: "Nov 17, 2025",
    approvedBy: "Ama Darko",
    amount: "$250"
  },
  {
    id: "LR-048",
    requestType: "Leave Request",
    description: "Sickness Absence",
    submittedDate: "Nov 14, 2025",
    approvedDate: "Nov 14, 2025",
    approvedBy: "Yaw Osei",
    duration: "2 days"
  },
  {
    id: "TR-007",
    requestType: "Travel Request",
    description: "Training Workshop in Dakar",
    submittedDate: "Nov 12, 2025",
    approvedDate: "Nov 14, 2025",
    approvedBy: "Kwame Asante",
    amount: "$2,800"
  },
  {
    id: "EC-015",
    requestType: "Expense Claim",
    description: "Office supplies and printing materials",
    submittedDate: "Nov 10, 2025",
    approvedDate: "Nov 11, 2025",
    approvedBy: "Ama Darko",
    amount: "$125"
  }
];

const getRequestTypeColor = (type: RequestType) => {
  switch (type) {
    case "Travel Request":
      return "bg-purple-100 text-purple-800";
    case "Expense Claim":
      return "bg-blue-100 text-blue-800";
    case "Leave Request":
      return "bg-green-100 text-green-800";
    case "Refund Request":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

export function ApprovedRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequestType, setSelectedRequestType] = useState("All Request Types");
  const [selectedDateRange, setSelectedDateRange] = useState("All Time");

  const filteredRequests = MOCK_APPROVED_REQUESTS.filter((request) => {
    const matchesSearch = 
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.approvedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedRequestType === "All Request Types" || request.requestType === selectedRequestType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Approved</h1>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Request Type Filter */}
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              {selectedRequestType}
              <ChevronDown size={16} className="text-slate-400" />
            </button>
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <Calendar size={16} />
              {selectedDateRange}
              <ChevronDown size={16} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10" style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="px-4 py-4 text-left text-[12px] font-semibold text-white border-b border-slate-100">
                Request ID
              </th>
              <th className="px-4 py-4 text-left text-[12px] font-semibold text-white border-b border-slate-100">
                Request Type
              </th>
              <th className="px-4 py-4 text-left text-[12px] font-semibold text-white border-b border-slate-100">
                Description
              </th>
              <th className="px-4 py-4 text-left text-[12px] font-semibold text-white border-b border-slate-100">
                Submitted Date
              </th>
              <th className="px-4 py-4 text-left text-[12px] font-semibold text-white border-b border-slate-100">
                Approved Date
              </th>
              <th className="px-4 py-4 text-left text-[12px] font-semibold text-white border-b border-slate-100">
                Approved By
              </th>
              <th className="px-4 py-4 text-left text-[12px] font-semibold text-white border-b border-slate-100">
                Amount/Duration
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredRequests.map((request) => (
              <tr key={request.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-blue-800">{request.id}</p>
                </td>
                <td className="px-4 py-4">
                  <Badge className={cn("text-[12px] font-medium shadow-none border-0", getRequestTypeColor(request.requestType))}>
                    {request.requestType}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{request.description}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{request.submittedDate}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{request.approvedDate}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{request.approvedBy}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">
                    {request.amount || request.duration || "-"}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}