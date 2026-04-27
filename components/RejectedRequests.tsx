import { useState } from "react";
import { Search, ChevronDown, Download, Calendar } from "lucide-react";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";

type RequestType = "Travel Request" | "Expense Claim" | "Leave Request" | "Refund Request";

interface RejectedRequestData {
  id: string;
  requestType: RequestType;
  description: string;
  submittedDate: string;
  rejectedDate: string;
  rejectedBy: string;
  reason: string;
  amount?: string;
  duration?: string;
}

const MOCK_REJECTED_REQUESTS: RejectedRequestData[] = [
  {
    id: "TR-006",
    requestType: "Travel Request",
    description: "Policy Dialogue Session in Addis Ababa",
    submittedDate: "Nov 10, 2025",
    rejectedDate: "Nov 12, 2025",
    rejectedBy: "Kwame Asante",
    reason: "Budget constraints for Q4 travel. Please resubmit in Q1 2026.",
    amount: "$4,500"
  },
  {
    id: "EC-006",
    requestType: "Expense Claim",
    description: "International flight to Nairobi",
    submittedDate: "Nov 17, 2025",
    rejectedDate: "Nov 18, 2025",
    rejectedBy: "Ama Darko",
    reason: "Missing required receipts and supporting documentation.",
    amount: "$1,200"
  },
  {
    id: "LR-039",
    requestType: "Leave Request",
    description: "Annual",
    submittedDate: "Nov 15, 2025",
    rejectedDate: "Nov 16, 2025",
    rejectedBy: "Yaw Osei",
    reason: "Requested dates conflict with critical project deadline. Please select alternative dates.",
    duration: "7 days"
  },
  {
    id: "RR-008",
    requestType: "Refund Request",
    description: "Conference fee overpayment refund",
    submittedDate: "Nov 12, 2025",
    rejectedDate: "Nov 14, 2025",
    rejectedBy: "Kofi Mensah",
    reason: "No record of overpayment found. Original payment amount matches invoice.",
    amount: "$150"
  },
  {
    id: "EC-011",
    requestType: "Expense Claim",
    description: "Entertainment expenses for client dinner",
    submittedDate: "Nov 8, 2025",
    rejectedDate: "Nov 9, 2025",
    rejectedBy: "Ama Darko",
    reason: "Amount exceeds per diem policy limit by $85. Please resubmit with policy-compliant amount.",
    amount: "$285"
  },
  {
    id: "TR-009",
    requestType: "Travel Request",
    description: "Workshop attendance in Dubai",
    submittedDate: "Nov 5, 2025",
    rejectedDate: "Nov 7, 2025",
    rejectedBy: "Kwame Asante",
    reason: "Travel not aligned with current project objectives. Virtual attendance option available.",
    amount: "$6,200"
  },
  {
    id: "LR-041",
    requestType: "Leave Request",
    description: "Extended Leave",
    submittedDate: "Nov 3, 2025",
    rejectedDate: "Nov 4, 2025",
    rejectedBy: "Yaw Osei",
    reason: "Insufficient leave balance remaining for requested duration.",
    duration: "10 days"
  },
  {
    id: "EC-018",
    requestType: "Expense Claim",
    description: "Mobile phone upgrade",
    submittedDate: "Oct 28, 2025",
    rejectedDate: "Oct 30, 2025",
    rejectedBy: "Ama Darko",
    reason: "Personal equipment purchases not covered under expense policy.",
    amount: "$450"
  },
  {
    id: "RR-005",
    requestType: "Refund Request",
    description: "Cancelled training course refund",
    submittedDate: "Oct 25, 2025",
    rejectedDate: "Oct 27, 2025",
    rejectedBy: "Kofi Mensah",
    reason: "Refund request submitted after policy deadline (30 days from payment).",
    amount: "$780"
  },
  {
    id: "TR-012",
    requestType: "Travel Request",
    description: "Field visit to rural project sites",
    submittedDate: "Oct 22, 2025",
    rejectedDate: "Oct 24, 2025",
    rejectedBy: "Kwame Asante",
    reason: "Security concerns in requested travel region. Travel advisory level red.",
    amount: "$1,850"
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

export function RejectedRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequestType, setSelectedRequestType] = useState("All Request Types");
  const [selectedDateRange, setSelectedDateRange] = useState("All Time");

  const filteredRequests = MOCK_REJECTED_REQUESTS.filter((request) => {
    const matchesSearch = 
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.rejectedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedRequestType === "All Request Types" || request.requestType === selectedRequestType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Rejected</h1>
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
          <thead className="bg-blue-800 sticky top-0 z-10">
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
                Rejected Date
              </th>
              <th className="px-4 py-4 text-left text-[12px] font-semibold text-white border-b border-slate-100">
                Rejected By
              </th>
              <th className="px-4 py-4 text-left text-[12px] font-semibold text-white border-b border-slate-100">
                Reason
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
                  <p className="text-[12px] text-slate-900">{request.rejectedDate}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{request.rejectedBy}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-700 max-w-xs">{request.reason}</p>
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