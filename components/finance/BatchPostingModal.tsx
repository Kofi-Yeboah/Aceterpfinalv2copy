import { useState } from "react";
import { X, CheckCircle2, AlertTriangle, Layers } from "lucide-react";
import type { SRDJournalEntry } from "./types";
import { getJournalTotals, formatCurrency } from "./helpers";

interface BatchPostingModalProps {
  entries: SRDJournalEntry[];
  onPost: (ids: string[]) => void;
  onClose: () => void;
}

export function BatchPostingModal({ entries, onPost, onClose }: BatchPostingModalProps) {
  const [validated, setValidated] = useState(false);

  const validationResults = entries.map(entry => {
    const { isBalanced } = getJournalTotals(entry);
    return {
      entry,
      isBalanced,
      isApprovable: entry.status === "Approved",
      valid: isBalanced && entry.status === "Approved",
    };
  });

  const validEntries = validationResults.filter(r => r.valid);
  const invalidEntries = validationResults.filter(r => !r.valid);

  const handleValidate = () => setValidated(true);

  const handlePost = () => {
    onPost(validEntries.map(r => r.entry.id));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[640px] max-h-[80vh] overflow-auto shadow-xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-blue-600" />
            <h2 className="text-[16px] font-semibold text-slate-900">Batch Posting</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-[12px] text-blue-700">
              <span className="font-medium">{entries.length}</span> entries selected for batch posting.
              Only approved and balanced entries will be posted.
            </p>
          </div>

          {!validated ? (
            <div className="space-y-3">
              <p className="text-[12px] text-slate-700 font-medium">Selected Entries</p>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Entry No.</th>
                      <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Description</th>
                      <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Amount</th>
                      <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map(entry => {
                      const { totalDebit } = getJournalTotals(entry);
                      return (
                        <tr key={entry.id} className="border-t border-slate-100">
                          <td className="px-3 py-2 text-[11px] font-mono text-slate-700">{entry.entryNo}</td>
                          <td className="px-3 py-2 text-[11px] text-slate-600 truncate max-w-[200px]">{entry.description}</td>
                          <td className="px-3 py-2 text-[11px] font-mono text-right">{formatCurrency(totalDebit, entry.currency)}</td>
                          <td className="px-3 py-2 text-center">
                            <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded">{entry.status}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button
                onClick={handleValidate}
                className="w-full py-2.5 rounded-lg text-[12px] font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Validate Entries
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Validation Results */}
              {validEntries.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={14} className="text-green-600" />
                    <p className="text-[12px] font-medium text-green-700">{validEntries.length} entries ready to post</p>
                  </div>
                  <div className="border border-green-200 rounded-lg bg-green-50 p-3 space-y-1">
                    {validEntries.map(r => (
                      <p key={r.entry.id} className="text-[11px] text-green-700">{r.entry.entryNo} - {r.entry.description}</p>
                    ))}
                  </div>
                </div>
              )}

              {invalidEntries.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={14} className="text-amber-600" />
                    <p className="text-[12px] font-medium text-amber-700">{invalidEntries.length} entries cannot be posted</p>
                  </div>
                  <div className="border border-amber-200 rounded-lg bg-amber-50 p-3 space-y-1">
                    {invalidEntries.map(r => (
                      <p key={r.entry.id} className="text-[11px] text-amber-700">
                        {r.entry.entryNo} - {!r.isBalanced ? "Unbalanced" : "Not in Approved status"}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[12px] bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</button>
          {validated && validEntries.length > 0 && (
            <button
              onClick={handlePost}
              className="px-5 py-2 rounded-lg text-[12px] font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Post {validEntries.length} Entries
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
