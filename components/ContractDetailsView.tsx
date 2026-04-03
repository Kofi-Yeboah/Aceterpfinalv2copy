import { ArrowLeft, FileText, User, Calendar, Briefcase, Building2, AlertCircle, CheckCircle2, PenLine, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getSignature, subscribe as subscribeSignature, getCurrentUserId, canUseSignature } from "../lib/signatureStore";

interface Contract {
  id: number;
  employeeName: string;
  contractType: "Staff" | "Consultant" | "National Service Personnel" | "Intern";
  position: string;
  department: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Pending" | "Terminated";
}

interface ContractDetailsViewProps {
  contract: Contract;
  onBack: () => void;
}

export function ContractDetailsView({ contract, onBack }: ContractDetailsViewProps) {
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-600 border-green-200";
      case "Expired":
        return "bg-red-50 text-red-600 border-red-200";
      case "Pending":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "Terminated":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case "Staff":
        return "bg-blue-50 text-blue-600";
      case "Consultant":
        return "bg-purple-50 text-purple-600";
      case "National Service Personnel":
        return "bg-amber-50 text-amber-600";
      case "Intern":
        return "bg-amber-50 text-amber-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Back to Contracts</span>
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">{contract.employeeName} - Contract Details</h1>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <Briefcase size={16} />
                <span>{contract.position}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 size={16} />
                <span>{contract.department}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`inline-flex items-center px-2 py-1 rounded-xl text-xs ${getContractTypeColor(contract.contractType)}`}>
                  {contract.contractType}
                </span>
              </div>
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium border ${getStatusColor(contract.status)}`}>
            {contract.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Contract Overview */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Contract Overview</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-1">Contract ID</p>
                <p className="text-sm text-slate-900 font-medium">CT{String(contract.id).padStart(4, '0')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Contract Type</p>
                <p className="text-sm text-slate-900">{contract.contractType}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Start Date</p>
                <p className="text-sm text-slate-900">{contract.startDate}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">End Date</p>
                <p className="text-sm text-slate-900">{contract.endDate}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Status</p>
                <p className="text-sm text-slate-900">{contract.status}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Duration</p>
                <p className="text-sm text-slate-900">
                  {contract.contractType === "Staff" ? "Indefinite" : contract.contractType === "National Service Personnel" ? "12 months" : "36 months"}
                </p>
              </div>
            </div>
          </div>

          {/* Employee Information */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Employee Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-1">Full Name</p>
                <p className="text-sm text-slate-900 font-medium">{contract.employeeName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Employee ID</p>
                <p className="text-sm text-slate-900">EMP{String(contract.id).padStart(4, '0')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Position</p>
                <p className="text-sm text-slate-900">{contract.position}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Department</p>
                <p className="text-sm text-slate-900">{contract.department}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Email</p>
                <p className="text-sm text-slate-900">{contract.employeeName.toLowerCase().replace(' ', '.')}@company.com</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Phone</p>
                <p className="text-sm text-slate-900">+233 24 123 4567</p>
              </div>
            </div>
          </div>

          {/* Contract Terms */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Contract Terms & Conditions</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-900 mb-2">Compensation</p>
                <p className="text-sm text-slate-600">
                  Annual salary as per grade level with standard benefits including health insurance, 
                  annual leave entitlement, and professional development opportunities.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 mb-2">Working Hours</p>
                <p className="text-sm text-slate-600">
                  Standard 40 hours per week, Monday to Friday, 8:00 AM to 5:00 PM with one-hour lunch break.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 mb-2">Probation Period</p>
                <p className="text-sm text-slate-600">
                  {contract.contractType === "Staff" || contract.contractType === "Consultant" 
                    ? "6 months probationary period from start date" 
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 mb-2">Notice Period</p>
                <p className="text-sm text-slate-600">
                  {contract.contractType === "Staff" 
                    ? "3 months written notice required from either party" 
                    : contract.contractType === "Consultant" || contract.contractType === "National Service Personnel"
                    ? "1 month written notice required from either party"
                    : "2 weeks written notice"}
                </p>
              </div>
            </div>
          </div>

          {/* Contract Documents */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Contract Documents</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="p-2 bg-blue-50 rounded">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Employment Contract.pdf</p>
                  <p className="text-xs text-slate-500">Signed on {contract.startDate}</p>
                </div>
                <button className="text-sm text-blue-600 hover:underline">Download</button>
              </div>
              <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="p-2 bg-blue-50 rounded">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Job Description.pdf</p>
                  <p className="text-xs text-slate-500">Updated Nov 15, 2025</p>
                </div>
                <button className="text-sm text-blue-600 hover:underline">Download</button>
              </div>
              <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="p-2 bg-blue-50 rounded">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Benefits Package.pdf</p>
                  <p className="text-xs text-slate-500">Effective {contract.startDate}</p>
                </div>
                <button className="text-sm text-blue-600 hover:underline">Download</button>
              </div>
            </div>
          </div>

          {/* Digital Signature */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Digital Signature</h2>
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

          {/* Contract History */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Contract History</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <CheckCircle2 size={18} className="text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Contract Signed</p>
                  <p className="text-xs text-slate-600">{contract.startDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <CheckCircle2 size={18} className="text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Employment Started</p>
                  <p className="text-xs text-slate-600">{contract.startDate}</p>
                </div>
              </div>
              {contract.status === "Expired" && (
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Contract Expired</p>
                    <p className="text-xs text-slate-600">{contract.endDate}</p>
                  </div>
                </div>
              )}
              {contract.status === "Terminated" && (
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Contract Terminated</p>
                    <p className="text-xs text-slate-600">{contract.endDate}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
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
              <p className="text-sm text-slate-600">You are about to sign this contract with your personal signature:</p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Document</span>
                  <span className="text-xs text-slate-900">Employment Contract</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Employee</span>
                  <span className="text-xs text-slate-900">{contract.employeeName}</span>
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