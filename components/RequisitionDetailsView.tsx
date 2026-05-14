import { ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";

interface Requisition {
  id: string;
  requisitionNumber: string;
  requestedBy: string;
  department: string;
  itemDescription: string;
  quantity: number;
  estimatedCost: number;
  priority: string;
  status: string;
  dateRequested: string;
}

interface ApprovalHistory {
  id: string;
  approver: string;
  role: string;
  action: string;
  date: string;
  comments: string;
}

interface RequisitionDetailsViewProps {
  requisition: Requisition;
  onBack: () => void;
}

export function RequisitionDetailsView({ requisition, onBack }: RequisitionDetailsViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-50 text-green-600";
      case "Pending":
        return "bg-orange-50 text-orange-600";
      case "In Progress":
        return "bg-blue-50 text-blue-600";
      case "Completed":
        return "bg-purple-50 text-purple-600";
      case "Rejected":
        return "bg-red-50 text-red-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-50 text-red-600";
      case "High":
        return "bg-orange-50 text-orange-600";
      case "Medium":
        return "bg-yellow-50 text-yellow-600";
      case "Low":
        return "bg-green-50 text-green-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "Approved":
        return "bg-green-50 text-green-600";
      case "Rejected":
        return "bg-red-50 text-red-600";
      case "Pending Review":
        return "bg-orange-50 text-orange-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Mock approval history
  const approvalHistory: ApprovalHistory[] = [
    { id: "1", approver: "John Smith", role: "Department Head", action: "Approved", date: "2024-11-26T10:30:00", comments: "Approved for procurement" },
    { id: "2", approver: "Sarah Johnson", role: "Finance Manager", action: "Approved", date: "2024-11-26T14:15:00", comments: "Budget allocation confirmed" },
    { id: "3", approver: "Michael Brown", role: "Procurement Manager", action: "Pending Review", date: "2024-11-27T09:00:00", comments: "Reviewing supplier options" },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-900">{requisition.requisitionNumber}</h1>
          <p className="text-sm text-slate-500 mt-1">Requisition Details</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        {/* Requisition Information Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Requisition Information</h2>
          
          {/* Row 1 */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Requested By</p>
              <p className="text-sm font-medium text-slate-900">{requisition.requestedBy}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Department</p>
              <p className="text-sm font-medium text-slate-900">{requisition.department}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Date Requested</p>
              <p className="text-sm font-medium text-slate-900">{formatDate(requisition.dateRequested)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Quantity</p>
              <p className="text-sm font-medium text-slate-900">{requisition.quantity}</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <Badge className={cn("text-xs font-medium shadow-none border-0", getStatusColor(requisition.status))}>
                {requisition.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Priority</p>
              <Badge className={cn("text-xs font-medium shadow-none border-0", getPriorityColor(requisition.priority))}>
                {requisition.priority}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Estimated Cost</p>
              <p className="text-sm font-medium text-slate-900">{formatCurrency(requisition.estimatedCost)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Requisition #</p>
              <p className="text-sm font-medium text-slate-900">{requisition.requisitionNumber}</p>
            </div>
          </div>

          {/* Row 3 - Full Width */}
          <div>
            <p className="text-xs text-slate-500 mb-1">Item Description</p>
            <p className="text-sm font-medium text-slate-900">{requisition.itemDescription}</p>
          </div>
        </div>

        {/* Approval History */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Approval History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Approver
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Role
                  </th>
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Action
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Date & Time
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Comments
                  </th>
                </tr>
              </thead>
              <tbody>
                {approvalHistory.map((approval) => (
                  <tr key={approval.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="text-[12px] font-medium text-slate-900">{approval.approver}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{approval.role}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getActionColor(approval.action)}`}>
                        {approval.action}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{formatDateTime(approval.date)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-900">{approval.comments}</p>
                    </td>
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
