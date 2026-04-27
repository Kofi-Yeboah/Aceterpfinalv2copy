import { ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";

interface Invoice {
  id: string;
  invoiceNumber: string;
  poNumber: string;
  supplier: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  amountPaid: number;
  status: string;
}

interface PaymentHistory {
  id: string;
  paymentDate: string;
  amountPaid: number;
  paymentMethod: string;
  referenceNumber: string;
  processedBy: string;
  notes: string;
}

interface InvoiceDetailsViewProps {
  invoice: Invoice;
  onBack: () => void;
}

export function InvoiceDetailsView({ invoice, onBack }: InvoiceDetailsViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-50 text-green-600";
      case "Pending":
        return "bg-orange-50 text-orange-600";
      case "Approved":
        return "bg-blue-50 text-blue-600";
      case "Overdue":
        return "bg-red-50 text-red-600";
      case "Cancelled":
        return "bg-slate-50 text-slate-600";
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

  const balanceDue = invoice.amount - invoice.amountPaid;

  // Mock payment history
  const paymentHistory: PaymentHistory[] = 
    invoice.amountPaid > 0 
      ? [
          { 
            id: "1", 
            paymentDate: "2024-12-05", 
            amountPaid: invoice.amountPaid, 
            paymentMethod: "Bank Transfer", 
            referenceNumber: "TXN-2024-5678", 
            processedBy: "Finance Team", 
            notes: "Payment processed successfully" 
          },
        ]
      : [];

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
          <h1 className="text-2xl font-semibold text-slate-900">{invoice.invoiceNumber}</h1>
          <p className="text-sm text-slate-500 mt-1">Invoice Details</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        {/* Invoice Information Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Invoice Information</h2>
          
          {/* Row 1 */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Supplier</p>
              <p className="text-sm font-medium text-slate-900">{invoice.supplier}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">PO Number</p>
              <p className="text-sm font-medium text-slate-900">{invoice.poNumber}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Invoice Date</p>
              <p className="text-sm font-medium text-slate-900">{formatDate(invoice.invoiceDate)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Due Date</p>
              <p className="text-sm font-medium text-slate-900">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <Badge className={cn("text-xs font-medium shadow-none border-0", getStatusColor(invoice.status))}>
                {invoice.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Invoice Amount</p>
              <p className="text-sm font-medium text-slate-900">{formatCurrency(invoice.amount)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Amount Paid</p>
              <p className="text-sm font-medium text-slate-900">{formatCurrency(invoice.amountPaid)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Balance Due</p>
              <p className="text-sm font-medium text-slate-900">{formatCurrency(balanceDue)}</p>
            </div>
          </div>

          {/* Row 3 - Progress Bar */}
          <div>
            <p className="text-xs text-slate-500 mb-2">Payment Progress</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${(invoice.amountPaid / invoice.amount) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-slate-900">
                {Math.round((invoice.amountPaid / invoice.amount) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Payment History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-800">
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Payment Date
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Amount Paid
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Payment Method
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Reference Number
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Processed By
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.length > 0 ? (
                  paymentHistory.map((payment) => (
                    <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <p className="text-[12px] text-slate-500">{formatDate(payment.paymentDate)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[12px] font-medium text-slate-900">{formatCurrency(payment.amountPaid)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[12px] text-slate-500">{payment.paymentMethod}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[12px] text-slate-900">{payment.referenceNumber}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[12px] text-slate-500">{payment.processedBy}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[12px] text-slate-900">{payment.notes}</p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <p className="text-sm text-slate-500">No payment records yet</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
