import { ArrowLeft, PenLine, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getSignature, subscribe as subscribeSignature, getCurrentUserId, canUseSignature } from "../lib/signatureStore";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  itemDescription: string;
  orderDate: string;
  deliveryDate: string;
  amount: number;
  sourcePR?: string;
  projectName?: string;
}

interface DeliveryHistory {
  id: string;
  deliveryDate: string;
  itemsReceived: string;
  quantity: number;
  receivedBy: string;
  condition: string;
  notes: string;
}

interface PurchaseOrderDetailsViewProps {
  purchaseOrder: PurchaseOrder;
  onBack: () => void;
}

export function PurchaseOrderDetailsView({ purchaseOrder, onBack }: PurchaseOrderDetailsViewProps) {
  const [signatureData, setSignatureData] = useState(getSignature());
  const [showSignModal, setShowSignModal] = useState(false);
  const [signed, setSigned] = useState(false);
  const [signedAt, setSignedAt] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeSignature(() => setSignatureData(getSignature()));
    return unsub;
  }, []);

  const handleApplySignature = () => {
    if (!canUseSignature(getCurrentUserId())) return;
    setSigned(true);
    setSignedAt(new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }));
    setShowSignModal(false);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Good":
        return "bg-green-50 text-green-600";
      case "Damaged":
        return "bg-red-50 text-red-600";
      case "Partial":
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

  // Mock delivery history
  const deliveryHistory: DeliveryHistory[] = [
    { id: "1", deliveryDate: "2024-12-15", itemsReceived: "Dell Laptops", quantity: 10, receivedBy: "John Smith", condition: "Good", notes: "All items in perfect condition" },
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
          <h1 className="text-2xl font-semibold text-slate-900">{purchaseOrder.poNumber}</h1>
          <p className="text-sm text-slate-500 mt-1">Purchase Order Details</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        {/* PO Information Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Purchase Order Information</h2>
          
          {/* Row 1 */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Vendor</p>
              <p className="text-sm font-medium text-slate-900">{purchaseOrder.vendor}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Order Date</p>
              <p className="text-sm font-medium text-slate-900">{formatDate(purchaseOrder.orderDate)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Delivery Date</p>
              <p className="text-sm font-medium text-slate-900">{formatDate(purchaseOrder.deliveryDate)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Amount</p>
              <p className="text-sm font-medium text-slate-900">{formatCurrency(purchaseOrder.amount)}</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Source PR</p>
              <p className="text-sm font-medium text-indigo-700">{purchaseOrder.sourcePR || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Project</p>
              <p className="text-sm font-medium text-slate-900">{purchaseOrder.projectName || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Invoice Status</p>
              <p className="text-sm font-medium text-slate-900">Pending</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Payment Status</p>
              <p className="text-sm font-medium text-slate-900">Not Paid</p>
            </div>
          </div>

          {/* Row 3 - Full Width */}
          <div>
            <p className="text-xs text-slate-500 mb-1">Item Description</p>
            <p className="text-sm font-medium text-slate-900">{purchaseOrder.itemDescription}</p>
          </div>
        </div>

        {/* Delivery History */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Delivery History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-800">
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Delivery Date
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Items Received
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Quantity
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Received By
                  </th>
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Condition
                  </th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {deliveryHistory.length > 0 ? (
                  deliveryHistory.map((delivery) => (
                    <tr key={delivery.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <p className="text-[12px] text-slate-500">{formatDate(delivery.deliveryDate)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[12px] font-medium text-slate-900">{delivery.itemsReceived}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[12px] text-slate-900">{delivery.quantity}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[12px] text-slate-500">{delivery.receivedBy}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getConditionColor(delivery.condition)}`}>
                          {delivery.condition}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[12px] text-slate-900">{delivery.notes}</p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <p className="text-sm text-slate-500">No delivery records yet</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Digital Signature */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mt-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Digital Signature</h2>
          {signed && signatureData ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span className="text-sm text-emerald-700">Signed by {signatureData.employeeName} on {signedAt}</span>
              </div>
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 inline-flex items-center justify-center">
                <img src={signatureData.dataUrl} alt="Applied Signature" className="max-w-[200px] max-h-[80px] object-contain" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {signatureData ? (
                <button
                  onClick={() => setShowSignModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-purple-700 text-white rounded-lg text-sm hover:bg-purple-800 transition-colors"
                >
                  <PenLine size={16} />
                  Apply My Signature
                </button>
              ) : (
                <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-amber-800">No signature uploaded</p>
                    <p className="text-xs text-amber-600 mt-0.5">Go to My Personal Information &rarr; My Signature tab to upload your signature.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        </div>

      {/* Sign Confirmation Modal */}
      {showSignModal && signatureData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowSignModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">Apply Signature</h3>
              <button onClick={() => setShowSignModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">You are about to sign this purchase order with your personal signature:</p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">PO Number</span>
                  <span className="text-xs text-slate-900">{purchaseOrder.poNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Vendor</span>
                  <span className="text-xs text-slate-900">{purchaseOrder.vendor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Amount</span>
                  <span className="text-xs text-slate-900">{formatCurrency(purchaseOrder.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Signed By</span>
                  <span className="text-xs text-slate-900">{signatureData.employeeName}</span>
                </div>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 flex items-center justify-center">
                <img src={signatureData.dataUrl} alt="My Signature" className="max-w-[220px] max-h-[90px] object-contain" />
              </div>
              <p className="text-xs text-slate-400">By clicking "Confirm & Sign", you confirm this is your personal signature.</p>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => setShowSignModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleApplySignature} className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm hover:bg-purple-800 transition-colors flex items-center gap-1.5">
                <PenLine size={14} />
                Confirm & Sign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}