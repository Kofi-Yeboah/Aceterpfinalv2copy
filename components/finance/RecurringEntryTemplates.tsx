import { Calendar, Play, ArrowLeft } from "lucide-react";
import { mockRecurringTemplates, mockSRDAccounts } from "./mockData";
import { formatCurrency } from "./helpers";

interface RecurringEntryTemplatesProps {
  onBack: () => void;
  onGenerate: (templateId: string) => void;
}

export function RecurringEntryTemplates({ onBack, onGenerate }: RecurringEntryTemplatesProps) {
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-lg">
              <ArrowLeft size={16} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-[18px] font-semibold text-slate-900">Recurring Entry Templates</h1>
              <p className="text-[12px] text-slate-500 mt-0.5">Pre-configured templates for periodic journal entries</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4">
          {mockRecurringTemplates.map(template => {
            const totalAmount = template.lines.reduce((sum, l) => sum + l.debit, 0);
            return (
              <div key={template.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-[14px] font-medium text-slate-900">{template.name}</h3>
                    <p className="text-[12px] text-slate-500 mt-0.5">{template.description}</p>
                  </div>
                  <button
                    onClick={() => onGenerate(template.id)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center gap-1.5"
                  >
                    <Play size={11} />Generate Now
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar size={12} />
                    <span>Frequency: <span className="text-slate-700 font-medium">{template.frequency}</span></span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">Amount: <span className="text-slate-700 font-mono font-medium">{formatCurrency(totalAmount, "GHS")}</span></span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">Last Generated: <span className="text-slate-700">{template.lastGenerated || "Never"}</span></span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">Next Due: <span className="text-slate-700">{template.nextDue}</span></span>
                </div>

                {/* Template Lines Preview */}
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-3 py-2 text-[9px] font-semibold text-slate-500 uppercase">Account</th>
                        <th className="text-left px-3 py-2 text-[9px] font-semibold text-slate-500 uppercase">Description</th>
                        <th className="text-right px-3 py-2 text-[9px] font-semibold text-slate-500 uppercase">Debit</th>
                        <th className="text-right px-3 py-2 text-[9px] font-semibold text-slate-500 uppercase">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {template.lines.map((line, i) => {
                        const acct = mockSRDAccounts.find(a => a.id === line.accountId);
                        return (
                          <tr key={i} className="border-t border-slate-100">
                            <td className="px-3 py-2 text-[10px] font-mono text-slate-700">{acct?.displayCode || line.accountId}</td>
                            <td className="px-3 py-2 text-[10px] text-slate-600">{line.description}</td>
                            <td className="px-3 py-2 text-right text-[10px] font-mono">{line.debit > 0 ? formatCurrency(line.debit, "GHS") : "-"}</td>
                            <td className="px-3 py-2 text-right text-[10px] font-mono">{line.credit > 0 ? formatCurrency(line.credit, "GHS") : "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
