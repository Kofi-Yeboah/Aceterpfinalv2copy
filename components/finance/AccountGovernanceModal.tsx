import { X, CheckCircle2, Clock, FileText, ArrowRight } from "lucide-react";
import type { SRDAccount, AccountStatus } from "./types";
import { getStatusTransitions } from "./helpers";

interface AccountGovernanceModalProps {
  account: SRDAccount;
  onClose: () => void;
  onStatusChange: (accountId: string, newStatus: AccountStatus) => void;
}

const STATUS_COLORS: Record<AccountStatus, string> = {
  Draft: "bg-slate-100 text-slate-700",
  PendingApproval: "bg-amber-50 text-amber-700",
  Approved: "bg-blue-50 text-blue-700",
  Active: "bg-green-50 text-green-700",
  Inactive: "bg-red-50 text-red-700",
};

const STATUS_ICONS: Record<AccountStatus, React.ReactNode> = {
  Draft: <FileText size={14} />,
  PendingApproval: <Clock size={14} />,
  Approved: <CheckCircle2 size={14} />,
  Active: <CheckCircle2 size={14} />,
  Inactive: <X size={14} />,
};

export function AccountGovernanceModal({ account, onClose, onStatusChange }: AccountGovernanceModalProps) {
  const transitions = getStatusTransitions(account.status) as AccountStatus[];
  const allStates: AccountStatus[] = ["Draft", "PendingApproval", "Approved", "Active", "Inactive"];
  const currentIndex = allStates.indexOf(account.status);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[560px] max-h-[80vh] overflow-auto shadow-xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-slate-900">Account Governance</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Account Info */}
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">Account</p>
            <p className="text-[14px] font-medium text-slate-900">{account.name}</p>
            <p className="text-[12px] text-slate-500 font-mono mt-0.5">{account.displayCode}</p>
          </div>

          {/* Status Timeline */}
          <div>
            <p className="text-[12px] font-medium text-slate-700 mb-3">Governance Lifecycle</p>
            <div className="flex items-center gap-1">
              {allStates.filter(s => s !== "Inactive").map((state, i) => (
                <div key={state} className="flex items-center">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] ${
                    state === account.status ? "ring-2 ring-blue-400 " + STATUS_COLORS[state] :
                    i < currentIndex ? "bg-green-50 text-green-600" : STATUS_COLORS[state]
                  }`}>
                    {STATUS_ICONS[state]}
                    <span>{state === "PendingApproval" ? "Pending" : state}</span>
                  </div>
                  {i < 3 && <ArrowRight size={12} className="text-slate-300 mx-1" />}
                </div>
              ))}
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-[11px] text-blue-600 uppercase tracking-wider mb-1">Current Status</p>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] ${STATUS_COLORS[account.status]}`}>
                {STATUS_ICONS[account.status]}
                {account.status}
              </span>
              <span className="text-[11px] text-slate-500">since {account.effectiveDate}</span>
            </div>
          </div>

          {/* Available Transitions */}
          {transitions.length > 0 && (
            <div>
              <p className="text-[12px] font-medium text-slate-700 mb-3">Available Actions</p>
              <div className="flex flex-wrap gap-2">
                {transitions.map(target => (
                  <button
                    key={target}
                    onClick={() => onStatusChange(account.id, target)}
                    className="px-4 py-2 rounded-lg text-[12px] font-medium transition-colors bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700"
                  >
                    Move to {target === "PendingApproval" ? "Pending Approval" : target}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Version History */}
          <div>
            <p className="text-[12px] font-medium text-slate-700 mb-3">Version History</p>
            <div className="space-y-2">
              {account.versionHistory.map((v) => (
                <div key={v.version} className="flex items-start gap-3 text-[11px] border-l-2 border-slate-200 pl-3 py-1">
                  <div className="flex-1">
                    <p className="text-slate-700 font-medium">v{v.version}: {v.changes}</p>
                    <p className="text-slate-500">By {v.changedBy} on {v.changedDate} (effective {v.effectiveDate})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[13px] bg-slate-100 text-slate-700 hover:bg-slate-200">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
