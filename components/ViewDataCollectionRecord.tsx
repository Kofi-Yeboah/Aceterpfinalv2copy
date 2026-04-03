import { useState } from "react";
import {
  ArrowLeft, Printer, Edit2, Circle, Download,
  Target, BarChart3, FileText, Layers, MessageSquare, ShieldCheck,
  CheckCircle, AlertTriangle, Flag, Clock, User, Paperclip,
  ChevronRight, ExternalLink,
} from "lucide-react";
import { cn } from "../lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════════ */

interface DataRecord {
  id: string;
  indicator: string;
  indicatorId: string;
  project: string;
  reportingPeriod: string;
  actualValue: number;
  targetValue: number;
  hasEvidence: boolean;
  evidenceCount: number;
  qaStatus: "Draft" | "Pending" | "Verified" | "Flagged";
  explanation?: string;
}

interface ViewDataCollectionRecordProps {
  recordId?: string;
  record: DataRecord;
  onBack: () => void;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export function ViewDataCollectionRecord({ record, onBack }: ViewDataCollectionRecordProps) {
  const [activeTab, setActiveTab] = useState<"results" | "evidence" | "narrative" | "review">("results");
  const [managerComment, setManagerComment] = useState("Evidence looks good, but please double-check the female count...");

  // Derived values
  const variance = ((record.actualValue - record.targetValue) / record.targetValue) * 100;
  const varianceText = variance > 0 ? `+${variance.toFixed(1)}%` : `${variance.toFixed(1)}%`;
  const varianceType = variance > 0 ? "Exceeded" : variance < 0 ? "Below Target" : "On Target";

  const maleCount = Math.floor(record.actualValue * 0.45);
  const femaleCount = record.actualValue - maleCount;

  const getQaStatusStyle = () => {
    switch (record.qaStatus) {
      case "Verified": return { color: "bg-emerald-100 text-emerald-700", dotColor: "bg-emerald-500", label: "Verified" };
      case "Pending": return { color: "bg-amber-100 text-amber-700", dotColor: "bg-amber-500", label: "Pending Review" };
      case "Flagged": return { color: "bg-red-100 text-red-700", dotColor: "bg-red-500", label: "Flagged" };
      default: return { color: "bg-slate-100 text-slate-600", dotColor: "bg-slate-400", label: "Draft" };
    }
  };
  const qaStyle = getQaStatusStyle();

  // Evidence files
  const evidence = record.hasEvidence ? [
    { id: "ev1", name: "YEP_Attendance_Q1_Verified.pdf", type: "Scanned Doc", size: "2.4 MB", uploadDate: "Jan 15, 2025" },
    { id: "ev2", name: "Training_Photos_Batch1.zip", type: "Images", size: "15 MB", uploadDate: "Jan 15, 2025" },
  ] : [];

  const tabs = [
    { key: "results" as const, label: "Quantitative Results", icon: <BarChart3 size={13} /> },
    { key: "evidence" as const, label: "Evidence", icon: <Paperclip size={13} />, count: evidence.length },
    { key: "narrative" as const, label: "Narrative", icon: <MessageSquare size={13} /> },
    { key: "review" as const, label: "Quality Review", icon: <ShieldCheck size={13} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft size={18} />
              <span className="text-[13px] font-medium">Back to Data Collection</span>
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <h1 className="text-[16px] font-semibold text-slate-900">Record {record.id}</h1>
              <p className="text-[11px] text-slate-400">{record.indicator}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium", qaStyle.color)}>
              <Circle size={6} fill="currentColor" />
              {qaStyle.label}
            </span>
            <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-[12px] text-slate-600 font-medium">
              <Printer size={13} />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ───────────────────────────────────────────────── */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Indicator</p>
            <p className="text-[12px] text-slate-800 font-medium truncate">{record.indicatorId}</p>
            <p className="text-[10px] text-slate-400 truncate">{record.indicator}</p>
          </div>
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Project</p>
            <p className="text-[12px] text-slate-800 font-medium">{record.project}</p>
          </div>
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Reporting Period</p>
            <p className="text-[12px] text-slate-800 font-medium">{record.reportingPeriod}</p>
          </div>
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Target vs Actual</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[16px] text-slate-800 font-semibold">{record.actualValue}</span>
              <span className="text-[11px] text-slate-400">/ {record.targetValue}</span>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Variance</p>
            <p className={cn("text-[16px] font-semibold", variance >= 0 ? "text-emerald-600" : "text-red-600")}>{varianceText}</p>
            <p className="text-[10px] text-slate-400">{varianceType}</p>
          </div>
        </div>
      </div>

      {/* ── Tabs (Document Vault pill style) ─────────────────────────────── */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[12px] transition-colors min-w-[140px] flex items-center justify-center gap-1.5 font-medium",
                activeTab === tab.key
                  ? "bg-[#0B01D0] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.icon} {tab.label}
              {tab.count !== undefined && (
                <span className={cn("px-1.5 py-0.5 rounded-full text-[10px]", activeTab === tab.key ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500")}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        {/* ═══ QUANTITATIVE RESULTS TAB ════════════════════════════════════ */}
        {activeTab === "results" && (
          <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
            {/* Target / Actual / Variance cards */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center">
                  <Target size={13} className="text-[#0B01D0]" />
                </div>
                <h2 className="text-[13px] font-semibold text-slate-800">Result Summary</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-2">Target ({record.reportingPeriod})</p>
                    <p className="text-[24px] text-slate-800 font-semibold">{record.targetValue}</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-2">Actual Result</p>
                    <p className="text-[24px] text-slate-800 font-semibold">{record.actualValue}</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-2">Variance</p>
                    <p className={cn("text-[24px] font-semibold", variance >= 0 ? "text-emerald-600" : "text-red-600")}>{varianceText}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{varianceType}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Disaggregation */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center">
                  <Layers size={13} className="text-purple-600" />
                </div>
                <h2 className="text-[13px] font-semibold text-slate-800">Disaggregation Data</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: "#0B01D0" }}>
                    <tr>
                      <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-white">Group</th>
                      <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-white">Count</th>
                      <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-white">% Share</th>
                      <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-white">Validation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 text-[11px] text-slate-800 font-medium">Male</td>
                      <td className="px-5 py-3 text-[11px] text-slate-700">{maleCount}</td>
                      <td className="px-5 py-3 text-[11px] text-slate-500">{((maleCount / record.actualValue) * 100).toFixed(1)}%</td>
                      <td className="px-5 py-3 text-[11px] text-slate-500">—</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors bg-slate-50/50">
                      <td className="px-5 py-3 text-[11px] text-slate-800 font-medium">Female</td>
                      <td className="px-5 py-3 text-[11px] text-slate-700">{femaleCount}</td>
                      <td className="px-5 py-3 text-[11px] text-slate-500">{((femaleCount / record.actualValue) * 100).toFixed(1)}%</td>
                      <td className="px-5 py-3 text-[11px] text-slate-500">—</td>
                    </tr>
                    <tr className="bg-slate-50 hover:bg-slate-100 transition-colors">
                      <td className="px-5 py-3 text-[11px] text-slate-900 font-semibold">TOTAL</td>
                      <td className="px-5 py-3 text-[11px] text-slate-900 font-semibold">{record.actualValue}</td>
                      <td className="px-5 py-3 text-[11px] text-slate-700 font-medium">100%</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                          <CheckCircle size={11} />
                          Matches Actual
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Submission info */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center">
                  <Clock size={13} className="text-amber-600" />
                </div>
                <h2 className="text-[13px] font-semibold text-slate-800">Submission Details</h2>
              </div>
              <div className="p-6 space-y-0 divide-y divide-slate-100">
                {[
                  { label: "Submitted By", value: "John Doe (M&E Officer)" },
                  { label: "Submitted On", value: "January 15, 2025 at 2:34 PM" },
                  { label: "Time Since Submission", value: "2 days ago" },
                  { label: "QA Status", value: qaStyle.label },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <span className="text-[11px] text-slate-500">{row.label}</span>
                    <span className="text-[11px] text-slate-800 font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ═══ EVIDENCE TAB ═══════════════════════════════════════════════ */}
        {activeTab === "evidence" && (
          <div className="flex-1 overflow-auto">
            {evidence.length > 0 ? (
              <table className="w-full">
                <thead style={{ backgroundColor: "#0B01D0" }}>
                  <tr>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-white">File Name</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-white">Type</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-white">Size</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-white">Uploaded</th>
                    <th className="px-5 py-3 text-center text-[11px] font-semibold text-white w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {evidence.map((file, i) => (
                    <tr key={file.id} className={cn("hover:bg-slate-50 transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <FileText size={13} className="text-slate-400" />
                          </div>
                          <span className="text-[11px] text-slate-800 font-medium">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[11px] text-slate-600">{file.type}</td>
                      <td className="px-5 py-3 text-[11px] text-slate-600">{file.size}</td>
                      <td className="px-5 py-3 text-[11px] text-slate-500">{file.uploadDate}</td>
                      <td className="px-5 py-3 text-center">
                        <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                          {file.type === "Scanned Doc" ? <ExternalLink size={11} /> : <Download size={11} />}
                          {file.type === "Scanned Doc" ? "View" : "Download"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                  <Paperclip size={20} className="text-slate-400" />
                </div>
                <p className="text-[13px] text-slate-500">No evidence documents attached</p>
                <p className="text-[11px] text-slate-400 mt-1">Evidence files will appear here once uploaded</p>
              </div>
            )}
          </div>
        )}

        {/* ═══ NARRATIVE TAB ══════════════════════════════════════════════ */}
        {activeTab === "narrative" && (
          <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center">
                  <MessageSquare size={13} className="text-[#0B01D0]" />
                </div>
                <h2 className="text-[13px] font-semibold text-slate-800">Variance Explanation</h2>
              </div>
              <div className="p-6">
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                  <p className="text-[12px] text-slate-800 leading-relaxed">
                    {record.explanation || "We partnered with a local church community which provided a larger venue, allowing us to admit 50 extra students."}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <User size={11} className="text-slate-400" />
                  <span className="text-[10px] text-slate-400">Submitted by John Doe &middot; January 15, 2025</span>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center">
                  <FileText size={13} className="text-purple-600" />
                </div>
                <h2 className="text-[13px] font-semibold text-slate-800">Qualitative Notes</h2>
              </div>
              <div className="p-6">
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                  <p className="text-[12px] text-slate-800 leading-relaxed">
                    Participant engagement was high. Two students have already secured internships.
                    The community partnership model proved effective and has been recommended for replication
                    in the other two target regions.
                  </p>
                </div>
              </div>
            </section>

            {/* Context cards */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                  <Layers size={13} className="text-emerald-600" />
                </div>
                <h2 className="text-[13px] font-semibold text-slate-800">Contextual Factors</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {[
                    { label: "Enabling Factors", text: "Community partnership provided larger venue; additional funding from local government." },
                    { label: "Challenges", text: "Internet connectivity remained inconsistent at two hub locations." },
                    { label: "Lessons Learned", text: "Community partnerships can be leveraged to expand reach beyond original targets." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <ChevronRight size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] text-slate-500 font-medium mb-0.5">{item.label}</p>
                        <p className="text-[12px] text-slate-800 leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ═══ QUALITY REVIEW TAB ═════════════════════════════════════════ */}
        {activeTab === "review" && (
          <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
            {/* Current status */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center">
                  <ShieldCheck size={13} className="text-amber-600" />
                </div>
                <h2 className="text-[13px] font-semibold text-slate-800">Quality Assessment Status</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", qaStyle.color)}>
                    {record.qaStatus === "Verified" ? <CheckCircle size={18} /> :
                     record.qaStatus === "Flagged" ? <Flag size={18} /> :
                     <Clock size={18} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] text-slate-800 font-medium">{qaStyle.label}</p>
                    <p className="text-[11px] text-slate-500">
                      {record.qaStatus === "Pending"
                        ? "Submitted by John Doe, 2 days ago — awaiting manager review"
                        : record.qaStatus === "Verified"
                        ? "Record verified and published to reporting dashboard"
                        : record.qaStatus === "Flagged"
                        ? "Returned to submitter for correction"
                        : "Record is still in draft state"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Checklist */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center">
                  <Target size={13} className="text-[#0B01D0]" />
                </div>
                <h2 className="text-[13px] font-semibold text-slate-800">Verification Checklist</h2>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { label: "Actual value provided", passed: true },
                  { label: "Disaggregation totals match actual", passed: true },
                  { label: "Evidence documents attached", passed: record.hasEvidence },
                  { label: "Variance explanation provided", passed: !!(record.explanation || true) },
                  { label: "Qualitative notes included", passed: true },
                ].map((check, i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", check.passed ? "bg-emerald-100" : "bg-red-100")}>
                      {check.passed
                        ? <CheckCircle size={12} className="text-emerald-600" />
                        : <AlertTriangle size={12} className="text-red-500" />}
                    </div>
                    <span className={cn("text-[12px]", check.passed ? "text-slate-800" : "text-red-600")}>{check.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Manager comments & actions */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center">
                  <MessageSquare size={13} className="text-purple-600" />
                </div>
                <h2 className="text-[13px] font-semibold text-slate-800">Manager Action</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-[11px] text-slate-500 font-medium mb-1.5">Comments</label>
                  <textarea
                    value={managerComment}
                    onChange={e => setManagerComment(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[12px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 resize-none"
                    placeholder="Add review comments..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-[12px] font-medium">
                    <Flag size={13} />
                    Flag for Correction
                  </button>
                  <button className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-[12px] font-medium">
                    <CheckCircle size={13} />
                    Verify & Publish
                  </button>
                </div>

                <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <Flag size={11} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      <span className="font-medium text-slate-600">Flag for Correction:</span> Returns record to Draft status. The submitter will be notified to make corrections and resubmit.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={11} className="text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      <span className="font-medium text-slate-600">Verify & Publish:</span> Locks the record, marks it as verified, and pushes data to the Reporting Dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
