import { useState, useEffect } from "react";
import {
  ArrowLeft, FileText, Edit3, Send, CheckCircle2, PenLine, X,
  AlertCircle, Truck, Mail, Bell, Clock, ShieldCheck,
  Package, Building2, ChevronRight, Printer, Download,
  AlertTriangle
} from "lucide-react";
import {
  generatePOFromSourcing, submitPOForSignature, signPO, dispatchPO,
  getNextPONumber,
  type GeneratedPO, type POLineItem
} from "../lib/procurementStore";
import { pushContract } from "../lib/contractStore";
import { getSignature, subscribe as subscribeSignature, getCurrentUserId, canUseSignature, getCurrentUserName } from "../lib/signatureStore";

/* ══════════════════════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════════════════════ */

export interface POGenerationProps {
  sourcePR: string;
  sourceSourcingCase: string;
  vendor: string;
  itemDescription: string;
  budget: number;
  category: string;
  method: string;
  department: string;
  requestedBy: string;
  projectName: string;
  contractNumber?: string;
  onBack: () => void;
  onComplete: (poNumber: string) => void;
}

type FlowStep = "preview" | "pending_signature" | "signing" | "completed";

/* ══════════════════════════════════════════════════════════════════════════════
   CONSTANTS & HELPERS
   ══════════════════════════════════════════════════════════════════════════════ */

const F = "'Montserrat Variable', sans-serif";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const formatDateTime = (s: string) =>
  new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

const VENDOR_EMAILS: Record<string, string> = {
  "Tech Solutions Inc.": "orders@techsolutions.com.gh",
  "Office Depot Ltd.": "procurement@officedepot.com.gh",
  "PrintWorks Ghana Ltd": "sales@printworks.com.gh",
  "MedSupply GH": "orders@medsupply.com.gh",
  "Dr. Kwesi Appiah": "k.appiah@consultant.com.gh",
  "Prof. Ama Benyiwa": "a.benyiwa@university.edu.gh",
  "La Palm Royal Beach Hotel": "events@lapalm.com.gh",
  "CreativeEdge Designs": "info@creativeedge.com.gh",
  "Kwame Construction Ltd": "projects@kwameconstruction.com.gh",
  "University of Ghana": "procurement@ug.edu.gh",
  "Ghana Research Associates": "admin@ghanaresearch.org",
  "Acer Distributors": "sales@acerdist.com.gh",
  "Dell Inc. (via Telefonika Ghana)": "enterprise@telefonika.com.gh",
  "Nana Yaw Mensah": "n.mensah@consultant.com.gh",
  "Akosua Frimpong": "a.frimpong@services.com.gh",
};

const VENDOR_ADDRESSES: Record<string, string> = {
  "Tech Solutions Inc.": "14 Independence Ave, Accra, Ghana",
  "PrintWorks Ghana Ltd": "22 Graphic Road, Adabraka, Accra",
  "MedSupply GH": "5 Hospital Road, Korle-Bu, Accra",
  "Dr. Kwesi Appiah": "University of Cape Coast, Central Region",
  "La Palm Royal Beach Hotel": "La Beach Road, Trade Fair, Accra",
  "University of Ghana": "P.O. Box LG 25, Legon, Accra",
  "Ghana Research Associates": "12 Research Lane, East Legon, Accra",
};

const COMPANY_NAME = "National Development Authority";
const COMPANY_ADDRESS = "27 Castle Road, Osu, Accra, Greater Accra Region, Ghana";

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export function POGenerationFlow({
  sourcePR, sourceSourcingCase, vendor, itemDescription, budget,
  category, method, department, requestedBy, projectName, contractNumber,
  onBack, onComplete,
}: POGenerationProps) {
  const [step, setStep] = useState<FlowStep>("preview");
  const [generatedPO, setGeneratedPO] = useState<GeneratedPO | null>(null);
  const poNumber = getNextPONumber();
  const today = new Date().toISOString().split("T")[0];
  const deliveryDefault = new Date();
  deliveryDefault.setMonth(deliveryDefault.getMonth() + 2);

  // Editable fields
  const [deliveryDate, setDeliveryDate] = useState(deliveryDefault.toISOString().split("T")[0]);
  const [deliveryInstructions, setDeliveryInstructions] = useState("Deliver to main office reception. Contact coordinator 24 hours before delivery.");
  const [warrantyTerms, setWarrantyTerms] = useState(category === "Goods" ? "12-month manufacturer warranty from date of delivery." : "N/A — Service engagement.");
  const [paymentTerms, setPaymentTerms] = useState("Net 30 days upon satisfactory delivery and inspection.");
  const [shippingMethod, setShippingMethod] = useState(category === "Goods" ? "Standard Ground Shipping" : "N/A");
  const [vendorEmail, setVendorEmail] = useState(VENDOR_EMAILS[vendor] || `orders@${vendor.toLowerCase().replace(/\s+/g, "")}.com`);
  const [vendorAddress, setVendorAddress] = useState(VENDOR_ADDRESSES[vendor] || "To be confirmed");

  // Line items — auto-generated from requisition data
  const [lineItems, setLineItems] = useState<POLineItem[]>(() => {
    const unitPrice = budget;
    return [{
      id: "li-1",
      description: itemDescription,
      quantity: 1,
      unit: category === "Goods" ? "units" : category === "Consultancy" ? "engagement" : "service",
      unitPrice,
      totalPrice: unitPrice,
      budgetCode: `${department.substring(0, 3).toUpperCase()}-${sourcePR.replace("PR-", "")}`,
    }];
  });

  // Signature
  const [signatureData, setSignatureData] = useState(getSignature());
  const [showSignConfirm, setShowSignConfirm] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; icon: React.ReactNode; time: string }>>([]);

  useEffect(() => {
    const unsub = subscribeSignature(() => setSignatureData(getSignature()));
    return unsub;
  }, []);

  const totalAmount = lineItems.reduce((sum, li) => sum + li.totalPrice, 0);
  const signatureAuthority = totalAmount >= 10000 ? "COO" : "Procurement Head";
  const signatoryName = totalAmount >= 10000 ? "Dr. Nana Akufo-Mensah (COO)" : "Kofi Asante (Procurement Head)";

  const updateLineItem = (id: string, field: keyof POLineItem, value: string | number) => {
    setLineItems(prev => prev.map(li => {
      if (li.id !== id) return li;
      const updated = { ...li, [field]: value };
      if (field === "quantity" || field === "unitPrice") {
        updated.totalPrice = Number(updated.quantity) * Number(updated.unitPrice);
      }
      return updated;
    }));
  };

  const addLineItem = () => {
    setLineItems(prev => [...prev, {
      id: `li-${Date.now()}`,
      description: "",
      quantity: 1,
      unit: "units",
      unitPrice: 0,
      totalPrice: 0,
      budgetCode: "",
    }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems(prev => prev.filter(li => li.id !== id));
  };

  // ── Step 1: Generate & Submit for Signature ──
  const handleSubmitForSignature = () => {
    const po = generatePOFromSourcing({
      sourcePR,
      sourceSourcingCase,
      vendor,
      vendorEmail,
      vendorAddress,
      itemDescription,
      lineItems,
      totalAmount,
      projectName,
      category,
      method,
      department,
      requestedBy,
      deliveryDate,
      deliveryInstructions,
      warrantyTerms,
      paymentTerms,
      shippingMethod,
      contractNumber,
    });
    setGeneratedPO(po);
    submitPOForSignature(po.id);

    setNotifications(prev => [...prev, {
      id: `n-${Date.now()}`,
      message: `PO ${po.poNumber} has been submitted for signature to ${signatoryName}.`,
      icon: <Bell size={14} className="text-blue-600" />,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }]);

    setStep("pending_signature");
  };

  // ── Step 2: Simulate signatory review → sign ──
  const handleSignatoryReview = () => {
    setStep("signing");
  };

  // ── Step 3: Sign & Approve ──
  const handleSignAndApprove = () => {
    if (!generatedPO || !signatureData) return;
    if (!canUseSignature(getCurrentUserId())) return;

    signPO(generatedPO.id, getCurrentUserName(), signatureData.dataUrl);

    // Auto-dispatch
    dispatchPO(generatedPO.id);

    // Push to Contract Repository
    if (contractNumber) {
      // Already pushed during contract award — we just update
    } else {
      pushContract({
        contractNumber: generatedPO.poNumber,
        title: itemDescription,
        party: vendor,
        sourcePR,
        sourceSourcingCase,
        category,
        method,
        value: totalAmount,
        department,
        owner: requestedBy,
        comments: `Auto-generated PO from sourcing case ${sourceSourcingCase}`,
      });
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    setNotifications(prev => [
      ...prev,
      {
        id: `n-${Date.now()}-1`,
        message: `PO ${generatedPO.poNumber} has been digitally signed by ${getCurrentUserName()}.`,
        icon: <PenLine size={14} className="text-green-600" />,
        time: timeStr,
      },
      {
        id: `n-${Date.now()}-2`,
        message: `Signed PO PDF emailed to ${vendor} at ${vendorEmail}.`,
        icon: <Mail size={14} className="text-purple-600" />,
        time: timeStr,
      },
      {
        id: `n-${Date.now()}-3`,
        message: `PO ${generatedPO.poNumber} pushed to Purchase Order Management module.`,
        icon: <Package size={14} className="text-indigo-600" />,
        time: timeStr,
      },
      {
        id: `n-${Date.now()}-4`,
        message: `Contract Coordinator alerted — delivery expected by ${formatDate(deliveryDate)}.`,
        icon: <Truck size={14} className="text-amber-600" />,
        time: timeStr,
      },
    ]);

    setShowSignConfirm(false);
    setStep("completed");
  };

  /* ══════════════════════════════════════════════════════════════════════════════
     STEPPER
     ══════════════════════════════════════════════════════════════════════════════ */

  const steps: Array<{ key: FlowStep; label: string; icon: React.ReactNode }> = [
    { key: "preview", label: "Preview & Edit", icon: <Edit3 size={14} /> },
    { key: "pending_signature", label: "Submit for Signature", icon: <Send size={14} /> },
    { key: "signing", label: "Sign & Approve", icon: <PenLine size={14} /> },
    { key: "completed", label: "Dispatched", icon: <CheckCircle2 size={14} /> },
  ];

  const stepIndex = steps.findIndex(s => s.key === step);

  /* ══════════════════════════════════════════════════════════════════════════════
     PDF PREVIEW PANEL
     ════════════════���═════════════════════════════════════════════════════════════ */

  const PDFPreview = () => (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
      {/* PDF Header Bar */}
      <div className="px-4 py-2.5 bg-slate-800 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileText size={14} />
          <span className="text-[11px] font-medium" style={{ fontFamily: F }}>PO Document Preview</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="p-1 hover:bg-slate-700 rounded" title="Print"><Printer size={13} /></button>
          <button className="p-1 hover:bg-slate-700 rounded" title="Download"><Download size={13} /></button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-slate-100 p-4">
        <div className="bg-white mx-auto max-w-[600px] shadow-lg" style={{ fontFamily: "Georgia, serif", padding: "48px 40px", minHeight: 800 }}>
          {/* Company Header */}
          <div className="text-center mb-6 pb-4 border-b-2 border-slate-800">
            <h1 className="text-[18px] font-bold text-slate-900 tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
              {COMPANY_NAME}
            </h1>
            <p className="text-[9px] text-slate-500 mt-1" style={{ fontFamily: F }}>{COMPANY_ADDRESS}</p>
            <div className="mt-3 inline-block px-4 py-1 bg-slate-900 text-white text-[13px] tracking-widest" style={{ fontFamily: F }}>
              PURCHASE ORDER
            </div>
          </div>

          {/* PO Meta */}
          <div className="flex justify-between mb-6">
            <div className="space-y-1">
              <p className="text-[9px] text-slate-500" style={{ fontFamily: F }}>PO Number</p>
              <p className="text-[13px] font-bold text-slate-900" style={{ fontFamily: F }}>{generatedPO?.poNumber || poNumber}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[9px] text-slate-500" style={{ fontFamily: F }}>Date Issued</p>
              <p className="text-[11px] text-slate-900" style={{ fontFamily: F }}>{formatDate(today)}</p>
            </div>
          </div>

          {/* Vendor / Buyer */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b border-slate-200">
            <div>
              <p className="text-[8px] text-slate-400 uppercase tracking-wider mb-1" style={{ fontFamily: F }}>VENDOR</p>
              <p className="text-[11px] font-semibold text-slate-900" style={{ fontFamily: F }}>{vendor}</p>
              <p className="text-[9px] text-slate-600" style={{ fontFamily: F }}>{vendorAddress}</p>
              <p className="text-[9px] text-slate-600" style={{ fontFamily: F }}>{vendorEmail}</p>
            </div>
            <div>
              <p className="text-[8px] text-slate-400 uppercase tracking-wider mb-1" style={{ fontFamily: F }}>SHIP TO</p>
              <p className="text-[11px] font-semibold text-slate-900" style={{ fontFamily: F }}>{COMPANY_NAME}</p>
              <p className="text-[9px] text-slate-600" style={{ fontFamily: F }}>{COMPANY_ADDRESS}</p>
            </div>
          </div>

          {/* Reference */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-[9px]" style={{ fontFamily: F }}>
            <div><span className="text-slate-400">PR Ref:</span> <span className="text-slate-700 font-medium">{sourcePR}</span></div>
            <div><span className="text-slate-400">Sourcing:</span> <span className="text-slate-700 font-medium">{sourceSourcingCase}</span></div>
            <div><span className="text-slate-400">Project:</span> <span className="text-slate-700 font-medium">{projectName}</span></div>
          </div>

          {/* Line Items Table */}
          <table className="w-full mb-4 text-[9px]" style={{ fontFamily: F }}>
            <thead style={{ backgroundColor: "#0B01D0" }}>
              <tr className="bg-slate-800 text-white">
                <th className="px-2 py-1.5 text-left text-white font-semibold text-[12px]">#</th>
                <th className="px-2 py-1.5 text-left text-white font-semibold text-[12px]">Description</th>
                <th className="px-2 py-1.5 text-center text-white font-semibold text-[12px]">Qty</th>
                <th className="px-2 py-1.5 text-center text-white font-semibold text-[12px]">Unit</th>
                <th className="px-2 py-1.5 text-right text-white font-semibold text-[12px]">Unit Price</th>
                <th className="px-2 py-1.5 text-right text-white font-semibold text-[12px]">Total</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((li, i) => (
                <tr key={li.id} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-2 py-1.5 text-slate-500">{i + 1}</td>
                  <td className="px-2 py-1.5 text-slate-900">{li.description || "—"}</td>
                  <td className="px-2 py-1.5 text-center">{li.quantity}</td>
                  <td className="px-2 py-1.5 text-center">{li.unit}</td>
                  <td className="px-2 py-1.5 text-right">{formatCurrency(li.unitPrice)}</td>
                  <td className="px-2 py-1.5 text-right font-medium">{formatCurrency(li.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-800">
                <td colSpan={5} className="px-2 py-2 text-right font-bold text-slate-900">TOTAL</td>
                <td className="px-2 py-2 text-right font-bold text-slate-900">{formatCurrency(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>

          {/* Terms */}
          <div className="space-y-2 mb-6 text-[9px]" style={{ fontFamily: F }}>
            <div className="flex gap-2">
              <span className="text-slate-400 w-28 shrink-0">Delivery Date:</span>
              <span className="text-slate-700">{formatDate(deliveryDate)}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-400 w-28 shrink-0">Payment Terms:</span>
              <span className="text-slate-700">{paymentTerms}</span>
            </div>
            {warrantyTerms !== "N/A — Service engagement." && (
              <div className="flex gap-2">
                <span className="text-slate-400 w-28 shrink-0">Warranty:</span>
                <span className="text-slate-700">{warrantyTerms}</span>
              </div>
            )}
            {deliveryInstructions && (
              <div className="flex gap-2">
                <span className="text-slate-400 w-28 shrink-0">Delivery Notes:</span>
                <span className="text-slate-700">{deliveryInstructions}</span>
              </div>
            )}
          </div>

          {/* Signature Block */}
          <div className="border-t border-slate-300 pt-4 mt-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-[8px] text-slate-400 uppercase tracking-wider mb-2" style={{ fontFamily: F }}>AUTHORIZED SIGNATORY</p>
                {generatedPO?.signedBy && generatedPO?.signatureDataUrl ? (
                  <div>
                    <img src={generatedPO.signatureDataUrl} alt="Signature" className="max-w-[140px] max-h-[50px] object-contain mb-1" />
                    <p className="text-[10px] font-semibold text-slate-900" style={{ fontFamily: F }}>{generatedPO.signedBy}</p>
                    <p className="text-[8px] text-slate-500" style={{ fontFamily: F }}>{generatedPO.signatureAuthority}</p>
                    <p className="text-[8px] text-slate-500" style={{ fontFamily: F }}>{generatedPO.signedAt ? formatDateTime(generatedPO.signedAt) : ""}</p>
                  </div>
                ) : step === "completed" && signatureData ? (
                  <div>
                    <img src={signatureData.dataUrl} alt="Signature" className="max-w-[140px] max-h-[50px] object-contain mb-1" />
                    <p className="text-[10px] font-semibold text-slate-900" style={{ fontFamily: F }}>{getCurrentUserName()}</p>
                    <p className="text-[8px] text-slate-500" style={{ fontFamily: F }}>{signatureAuthority}</p>
                    <p className="text-[8px] text-slate-500" style={{ fontFamily: F }}>{formatDateTime(new Date().toISOString())}</p>
                  </div>
                ) : (
                  <div className="h-[50px] border-b border-dashed border-slate-300 mb-1" />
                )}
              </div>
              <div>
                <p className="text-[8px] text-slate-400 uppercase tracking-wider mb-2" style={{ fontFamily: F }}>PROCUREMENT OFFICER</p>
                <div className="h-[50px] border-b border-dashed border-slate-300 mb-1" />
                <p className="text-[10px] text-slate-600" style={{ fontFamily: F }}>{requestedBy}</p>
                <p className="text-[8px] text-slate-500" style={{ fontFamily: F }}>{department}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════════════════════ */

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden" style={{ fontFamily: F }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-[16px] font-semibold text-slate-900" style={{ fontFamily: F }}>
              Purchase Order Generation
            </h1>
            <p className="text-[11px] text-slate-500" style={{ fontFamily: F }}>
              {sourceSourcingCase} &middot; {sourcePR} &middot; {vendor}
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-lg text-[11px] font-medium" style={{
            backgroundColor: step === "completed" ? "#dcfce7" : step === "signing" || step === "pending_signature" ? "#fef3c7" : "#eff6ff",
            color: step === "completed" ? "#166534" : step === "signing" || step === "pending_signature" ? "#92400e" : "#1e40af",
            fontFamily: F,
          }}>
            {step === "preview" ? "Draft" : step === "pending_signature" ? "Pending Signature" : step === "signing" ? "Awaiting Sign" : "Dispatched"}
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium transition-colors ${
                i < stepIndex ? "bg-green-100 text-green-700" :
                i === stepIndex ? "text-white" :
                "bg-slate-100 text-slate-400"
              }`} style={i === stepIndex ? { backgroundColor: "#0B01D0" } : undefined}>
                {i < stepIndex ? <CheckCircle2 size={12} /> : s.icon}
                <span>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight size={14} className={`mx-1 ${i < stepIndex ? "text-green-400" : "text-slate-300"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">

        {/* ════════════════════════════════════════════════════════════════════
           STEP: PREVIEW & EDIT
           ═══════════════════════════════════════════════════════════════════ */}
        {step === "preview" && (
          <>
            {/* Left — Editable Fields */}
            <div className="w-[480px] shrink-0 border-r border-slate-200 bg-white overflow-y-auto p-5 space-y-5">
              <div>
                <h2 className="text-[13px] font-semibold text-slate-900 mb-3 flex items-center gap-1.5" style={{ fontFamily: F }}>
                  <Edit3 size={13} className="text-indigo-600" /> Edit PO Details
                </h2>
                <p className="text-[11px] text-slate-500 mb-4" style={{ fontFamily: F }}>
                  Review and adjust the auto-filled fields below. Changes are reflected live in the PDF preview.
                </p>
              </div>

              {/* Auto-filled summary */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-2">
                <p className="text-[10px] text-indigo-500 uppercase tracking-wider font-medium" style={{ fontFamily: F }}>Auto-Filled from Sourcing</p>
                {[
                  ["PO Number", poNumber],
                  ["Source PR", sourcePR],
                  ["Sourcing Case", sourceSourcingCase],
                  ["Project", projectName],
                  ["Method", method],
                  ["Category", category],
                  ["Department", department],
                  ["Requested By", requestedBy],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-[11px]" style={{ fontFamily: F }}>
                    <span className="text-indigo-400">{label}</span>
                    <span className="text-indigo-800 font-medium">{val}</span>
                  </div>
                ))}
              </div>

              {/* Vendor Info */}
              <div className="space-y-3">
                <h3 className="text-[12px] font-semibold text-slate-900 flex items-center gap-1.5" style={{ fontFamily: F }}>
                  <Building2 size={12} className="text-purple-600" /> Vendor Information
                </h3>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 block" style={{ fontFamily: F }}>Vendor Name</label>
                  <input type="text" value={vendor} readOnly className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 h-[34px] text-[12px] text-slate-700" style={{ fontFamily: F }} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 block" style={{ fontFamily: F }}>Vendor Email</label>
                  <input type="email" value={vendorEmail} onChange={e => setVendorEmail(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 h-[34px] text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400" style={{ fontFamily: F }} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 block" style={{ fontFamily: F }}>Vendor Address</label>
                  <input type="text" value={vendorAddress} onChange={e => setVendorAddress(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 h-[34px] text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400" style={{ fontFamily: F }} />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[12px] font-semibold text-slate-900 flex items-center gap-1.5" style={{ fontFamily: F }}>
                    <Package size={12} className="text-blue-600" /> Line Items
                  </h3>
                  <button onClick={addLineItem} className="text-[10px] text-indigo-600 hover:underline" style={{ fontFamily: F }}>+ Add Line</button>
                </div>

                {lineItems.map((li, i) => (
                  <div key={li.id} className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium" style={{ fontFamily: F }}>Item {i + 1}</span>
                      {lineItems.length > 1 && (
                        <button onClick={() => removeLineItem(li.id)} className="text-[10px] text-red-500 hover:underline" style={{ fontFamily: F }}>Remove</button>
                      )}
                    </div>
                    <input type="text" value={li.description} onChange={e => updateLineItem(li.id, "description", e.target.value)} placeholder="Item description" className="w-full border border-slate-200 rounded px-2.5 h-[30px] text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-400" style={{ fontFamily: F }} />
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5" style={{ fontFamily: F }}>Qty</label>
                        <input type="number" min={1} value={li.quantity} onChange={e => updateLineItem(li.id, "quantity", Number(e.target.value))} className="w-full border border-slate-200 rounded px-2 h-[28px] text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-400" style={{ fontFamily: F }} />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5" style={{ fontFamily: F }}>Unit</label>
                        <input type="text" value={li.unit} onChange={e => updateLineItem(li.id, "unit", e.target.value)} className="w-full border border-slate-200 rounded px-2 h-[28px] text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-400" style={{ fontFamily: F }} />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5" style={{ fontFamily: F }}>Unit Price</label>
                        <input type="number" min={0} step={0.01} value={li.unitPrice} onChange={e => updateLineItem(li.id, "unitPrice", Number(e.target.value))} className="w-full border border-slate-200 rounded px-2 h-[28px] text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-400" style={{ fontFamily: F }} />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5" style={{ fontFamily: F }}>Budget Code</label>
                        <input type="text" value={li.budgetCode} onChange={e => updateLineItem(li.id, "budgetCode", e.target.value)} className="w-full border border-slate-200 rounded px-2 h-[28px] text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-400" style={{ fontFamily: F }} />
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-slate-700 font-medium" style={{ fontFamily: F }}>
                      Subtotal: {formatCurrency(li.totalPrice)}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center px-1">
                  <span className="text-[12px] font-semibold text-slate-900" style={{ fontFamily: F }}>Total</span>
                  <span className="text-[14px] font-bold text-slate-900" style={{ fontFamily: F }}>{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Delivery & Terms */}
              <div className="space-y-3">
                <h3 className="text-[12px] font-semibold text-slate-900 flex items-center gap-1.5" style={{ fontFamily: F }}>
                  <Truck size={12} className="text-amber-600" /> Delivery & Terms
                </h3>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 block" style={{ fontFamily: F }}>Expected Delivery Date</label>
                  <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 h-[34px] text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400" style={{ fontFamily: F }} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 block" style={{ fontFamily: F }}>Delivery Instructions</label>
                  <textarea value={deliveryInstructions} onChange={e => setDeliveryInstructions(e.target.value)} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[11px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" style={{ fontFamily: F }} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 block" style={{ fontFamily: F }}>Payment Terms</label>
                  <input type="text" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 h-[34px] text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400" style={{ fontFamily: F }} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 block" style={{ fontFamily: F }}>Warranty Terms</label>
                  <input type="text" value={warrantyTerms} onChange={e => setWarrantyTerms(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 h-[34px] text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400" style={{ fontFamily: F }} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 block" style={{ fontFamily: F }}>Shipping Method</label>
                  <select value={shippingMethod} onChange={e => setShippingMethod(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 h-[34px] text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400" style={{ fontFamily: F }}>
                    <option>Standard Ground Shipping</option>
                    <option>Express Delivery</option>
                    <option>Vendor Delivery</option>
                    <option>Pickup</option>
                    <option>N/A</option>
                  </select>
                </div>
              </div>

              {/* Signature Authority Info */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <ShieldCheck size={14} className="text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-amber-800" style={{ fontFamily: F }}>Signature Authority Matrix</p>
                    <p className="text-[10px] text-amber-700 mt-1" style={{ fontFamily: F }}>
                      PO value: {formatCurrency(totalAmount)} — Requires approval from <span className="font-semibold">{signatoryName}</span>
                    </p>
                    <p className="text-[9px] text-amber-500 mt-0.5" style={{ fontFamily: F }}>
                      {totalAmount >= 10000 ? "POs ≥ $10,000 require COO approval" : "POs under $10,000 approved by Procurement Head"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button onClick={handleSubmitForSignature}
                className="w-full py-3 text-white rounded-lg text-[13px] font-medium hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                <Send size={14} />
                Submit for Signature
              </button>
            </div>

            {/* Right — PDF Preview */}
            <div className="flex-1 overflow-hidden p-4">
              <PDFPreview />
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════════
           STEP: PENDING SIGNATURE
           ════════════════════════════════════════════════════════════════════ */}
        {step === "pending_signature" && (
          <>
            <div className="w-[480px] shrink-0 border-r border-slate-200 bg-white overflow-y-auto p-5 space-y-5">
              {/* Notification Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Bell size={16} className="text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[12px] font-semibold text-blue-900" style={{ fontFamily: F }}>PO Submitted for Signature</p>
                    <p className="text-[11px] text-blue-700 mt-1" style={{ fontFamily: F }}>
                      {generatedPO?.poNumber} has been routed to <span className="font-semibold">{signatoryName}</span> for digital signature.
                    </p>
                  </div>
                </div>
              </div>

              {/* Signature Authority Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                <h3 className="text-[12px] font-semibold text-slate-900 flex items-center gap-1.5" style={{ fontFamily: F }}>
                  <ShieldCheck size={13} className="text-indigo-600" /> Signature Authority
                </h3>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-semibold" style={{ backgroundColor: "#0B01D0" }}>
                    {signatoryName.split(" ").map(w => w[0]).join("").substring(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: F }}>{signatoryName}</p>
                    <p className="text-[10px] text-slate-500" style={{ fontFamily: F }}>{signatureAuthority}</p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 rounded text-[10px] text-amber-700 font-medium">
                    <Clock size={10} /> Pending
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 space-y-1" style={{ fontFamily: F }}>
                  <p>PO Value: {formatCurrency(totalAmount)}</p>
                  <p>Threshold: {totalAmount >= 10000 ? "≥ $10,000 → COO required" : "< $10,000 → Procurement Head"}</p>
                </div>
              </div>

              {/* Simulate action */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-[11px] text-purple-700 mb-3" style={{ fontFamily: F }}>
                  <span className="font-semibold">Demo:</span> In production, the signatory would receive an in-app notification. Click below to simulate the signatory opening this PO.
                </p>
                <button onClick={handleSignatoryReview}
                  className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-[12px] font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  style={{ fontFamily: F }}>
                  <PenLine size={13} />
                  Open as Signatory ({signatureAuthority})
                </button>
              </div>

              {/* Activity Log */}
              {notifications.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[11px] font-semibold text-slate-900" style={{ fontFamily: F }}>Activity Log</h3>
                  {notifications.map(n => (
                    <div key={n.id} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                      {n.icon}
                      <div className="flex-1">
                        <p className="text-[10px] text-slate-700" style={{ fontFamily: F }}>{n.message}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5" style={{ fontFamily: F }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-hidden p-4">
              <PDFPreview />
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════════
           STEP: SIGNING
           ════════════════════════════════════════════════════════════════════ */}
        {step === "signing" && (
          <>
            <div className="w-[480px] shrink-0 border-r border-slate-200 bg-white overflow-y-auto p-5 space-y-5">
              {/* Signatory Banner */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <PenLine size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[12px] font-semibold text-indigo-900" style={{ fontFamily: F }}>
                      Review & Sign Purchase Order
                    </p>
                    <p className="text-[11px] text-indigo-700 mt-1" style={{ fontFamily: F }}>
                      {generatedPO?.poNumber} requires your signature as {signatureAuthority}.
                    </p>
                  </div>
                </div>
              </div>

              {/* PO Summary */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
                <h3 className="text-[12px] font-semibold text-slate-900" style={{ fontFamily: F }}>PO Summary</h3>
                {[
                  ["PO Number", generatedPO?.poNumber || poNumber],
                  ["Vendor", vendor],
                  ["Total Value", formatCurrency(totalAmount)],
                  ["Source PR", sourcePR],
                  ["Project", projectName],
                  ["Delivery Date", formatDate(deliveryDate)],
                  ["Payment Terms", paymentTerms],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-[11px]" style={{ fontFamily: F }}>
                    <span className="text-slate-500">{label}</span>
                    <span className="text-slate-900 font-medium">{val}</span>
                  </div>
                ))}
              </div>

              {/* Line Items */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-900" style={{ fontFamily: F }}>Line Items</p>
                </div>
                <table className="w-full text-[10px]" style={{ fontFamily: F }}>
                  <thead style={{ backgroundColor: "#0B01D0" }}>
                    <tr className="border-b border-slate-100">
                      <th className="px-3 py-2 text-left text-white font-semibold text-[12px]">#</th>
                      <th className="px-3 py-2 text-left text-white font-semibold text-[12px]">Item</th>
                      <th className="px-3 py-2 text-right text-white font-semibold text-[12px]">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((li, i) => (
                      <tr key={li.id} className="border-b border-slate-50">
                        <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                        <td className="px-3 py-2 text-slate-900">{li.description}</td>
                        <td className="px-3 py-2 text-right text-slate-900 font-medium">{formatCurrency(li.totalPrice)}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50">
                      <td colSpan={2} className="px-3 py-2 text-right font-semibold text-slate-900">Total</td>
                      <td className="px-3 py-2 text-right font-bold text-slate-900">{formatCurrency(totalAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* What happens next */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                <p className="text-[11px] font-semibold text-green-800" style={{ fontFamily: F }}>Upon signing, the system will automatically:</p>
                <div className="space-y-1.5">
                  {[
                    ["Stamp the PO PDF with your digital signature, name & timestamp", <PenLine key="1" size={11} className="text-green-600 shrink-0 mt-0.5" />],
                    [`Email signed PO to ${vendor} at ${vendorEmail}`, <Mail key="2" size={11} className="text-green-600 shrink-0 mt-0.5" />],
                    ["Push to Purchase Order Management & Contract Repository", <Package key="3" size={11} className="text-green-600 shrink-0 mt-0.5" />],
                    ["Alert Contract Coordinator for delivery tracking", <Truck key="4" size={11} className="text-green-600 shrink-0 mt-0.5" />],
                  ].map(([text, icon], i) => (
                    <div key={i} className="flex items-start gap-2">
                      {icon}
                      <span className="text-[10px] text-green-700" style={{ fontFamily: F }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sign Button */}
              {signatureData ? (
                <button onClick={() => setShowSignConfirm(true)}
                  className="w-full py-3 text-white rounded-lg text-[13px] font-medium hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                  <PenLine size={14} />
                  Sign & Approve
                </button>
              ) : (
                <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] text-amber-800 font-medium" style={{ fontFamily: F }}>No signature on file</p>
                    <p className="text-[10px] text-amber-600 mt-0.5" style={{ fontFamily: F }}>
                      Go to My Personal Information &rarr; My Signature to upload your digital signature first.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-hidden p-4">
              <PDFPreview />
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════════
           STEP: COMPLETED / DISPATCHED
           ════════════════════════════════════════════════════════════════���══ */}
        {step === "completed" && (
          <>
            <div className="w-[480px] shrink-0 border-r border-slate-200 bg-white overflow-y-auto p-5 space-y-5">
              {/* Success Banner */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-green-600" />
                </div>
                <h2 className="text-[15px] font-bold text-green-900" style={{ fontFamily: F }}>
                  Purchase Order Dispatched!
                </h2>
                <p className="text-[12px] text-green-700 mt-1" style={{ fontFamily: F }}>
                  {generatedPO?.poNumber} has been signed, dispatched, and all parties notified.
                </p>
              </div>

              {/* Summary */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
                <h3 className="text-[12px] font-semibold text-slate-900 mb-2" style={{ fontFamily: F }}>Dispatch Summary</h3>
                {[
                  ["PO Number", generatedPO?.poNumber || poNumber],
                  ["Vendor", vendor],
                  ["Total Value", formatCurrency(totalAmount)],
                  ["Signed By", getCurrentUserName()],
                  ["Authority", signatureAuthority],
                  ["Vendor Notified", vendorEmail],
                  ["Expected Delivery", formatDate(deliveryDate)],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-[11px]" style={{ fontFamily: F }}>
                    <span className="text-slate-500">{label}</span>
                    <span className="text-slate-900 font-medium">{val}</span>
                  </div>
                ))}
              </div>

              {/* Activity Log */}
              {notifications.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[11px] font-semibold text-slate-900" style={{ fontFamily: F }}>Complete Activity Log</h3>
                  {notifications.map(n => (
                    <div key={n.id} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                      {n.icon}
                      <div className="flex-1">
                        <p className="text-[10px] text-slate-700" style={{ fontFamily: F }}>{n.message}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5" style={{ fontFamily: F }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Back Button */}
              <button onClick={() => onComplete(generatedPO?.poNumber || poNumber)}
                className="w-full py-3 bg-slate-900 text-white rounded-lg text-[12px] font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: F }}>
                <ArrowLeft size={14} />
                Return to Sourcing
              </button>
            </div>

            <div className="flex-1 overflow-hidden p-4">
              <PDFPreview />
            </div>
          </>
        )}
      </div>

      {/* Sign Confirmation Modal */}
      {showSignConfirm && signatureData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowSignConfirm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Confirm Signature</h3>
              <button onClick={() => setShowSignConfirm(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[12px] text-slate-600" style={{ fontFamily: F }}>
                You are about to digitally sign and approve this Purchase Order. This action is irreversible.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                {[
                  ["PO Number", generatedPO?.poNumber || poNumber],
                  ["Vendor", vendor],
                  ["Total Value", formatCurrency(totalAmount)],
                  ["Authority Level", signatureAuthority],
                  ["Signed By", signatureData.employeeName],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-[11px]" style={{ fontFamily: F }}>
                    <span className="text-slate-500">{label}</span>
                    <span className="text-slate-900 font-medium">{val}</span>
                  </div>
                ))}
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 flex items-center justify-center">
                <img src={signatureData.dataUrl} alt="My Signature" className="max-w-[220px] max-h-[90px] object-contain" />
              </div>
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-[10px] text-amber-700" style={{ fontFamily: F }}>
                  Upon confirmation, the system will automatically email the signed PO to the vendor, push it to the PO Management module, and notify the Contract Coordinator.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => setShowSignConfirm(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-[12px] hover:bg-slate-200 transition-colors" style={{ fontFamily: F }}>
                Cancel
              </button>
              <button onClick={handleSignAndApprove}
                className="px-5 py-2 text-white rounded-lg text-[12px] font-medium hover:opacity-90 transition-colors flex items-center gap-1.5"
                style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                <PenLine size={13} />
                Sign & Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}