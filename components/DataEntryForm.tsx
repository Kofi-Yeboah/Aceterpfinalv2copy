import { useState } from "react";
import {
  ArrowLeft, Upload, Link as LinkIcon, AlertTriangle, ChevronDown,
  Eye, Check, Edit3, X, Target, BarChart3, FileText, MessageSquare,
  CheckCircle2, AlertCircle, TrendingUp, Users
} from "lucide-react";
import { cn } from "../lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════════ */

interface DataEntryFormProps {
  onBack: () => void;
  selectedProject: string;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════��═══════════ */

export function DataEntryForm({ onBack, selectedProject }: DataEntryFormProps) {
  // Indicator 1 state
  const [actualValue1, setActualValue1] = useState("");
  const [maleCount, setMaleCount] = useState("");
  const [femaleCount, setFemaleCount] = useState("");
  const [urbanCount, setUrbanCount] = useState("");
  const [ruralCount, setRuralCount] = useState("");
  const [narrative, setNarrative] = useState("");
  const [evidence1File, setEvidence1File] = useState<File | null>(null);
  const [evidence1Link, setEvidence1Link] = useState("");

  // Indicator 2 state
  const [actualValue2, setActualValue2] = useState("");
  const [varianceExplanation, setVarianceExplanation] = useState("");
  const [evidence2File, setEvidence2File] = useState<File | null>(null);

  // Review confirmation state
  const [showReview, setShowReview] = useState(false);

  const achievement1 = parseFloat(actualValue1) ? Math.round((parseFloat(actualValue1) / 500) * 100) : 0;
  const achievement2 = parseFloat(actualValue2) ? Math.round((parseFloat(actualValue2) / 60) * 100) : 0;
  const showVarianceAlert = parseFloat(actualValue2) > 0 && achievement2 < 85;

  const handleSubmit = () => {
    console.log("Submitting impact record:", {
      selectedProject,
      indicator1: { actualValue1, maleCount, femaleCount, urbanCount, ruralCount, narrative },
      indicator2: { actualValue2, varianceExplanation },
    });
    onBack();
  };

  // Completion tracker
  const completedFields = [
    actualValue1, actualValue2,
    narrative || evidence1File || evidence1Link ? "yes" : "",
    (showVarianceAlert && varianceExplanation) || !showVarianceAlert ? "yes" : "",
  ].filter(Boolean).length;
  const totalFields = 4;
  const completionPct = Math.round((completedFields / totalFields) * 100);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-[13px] font-medium">Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <h1 className="text-[16px] font-semibold text-slate-900">Submit New Impact Record</h1>
              <p className="text-[11px] text-slate-400">Data Entry: Q1 2025 (Jan – Mar)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Completion indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    completionPct >= 80 ? "bg-emerald-500" : completionPct >= 50 ? "bg-blue-500" : "bg-amber-400"
                  )}
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-medium">{completionPct}%</span>
            </div>

            <button
              onClick={() => setShowReview(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors text-[12px] font-medium"
            >
              <Eye size={14} />
              Review & Submit
            </button>
          </div>
        </div>
      </div>

      {/* ── Form Content ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">

          {/* ─── PROJECT INFO CARD ────────────────────────────────────────── */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center">
                <Target size={13} className="text-[#0B01D0]" />
              </div>
              <h2 className="text-[13px] font-semibold text-slate-800">Submission Context</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-lg border border-slate-100 p-3">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Project</p>
                  <p className="text-[12px] text-slate-800 font-medium">{selectedProject}</p>
                </div>
                <div className="bg-slate-50 rounded-lg border border-slate-100 p-3">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Reporting Period</p>
                  <p className="text-[12px] text-slate-800 font-medium">Jan 1 – Mar 31, 2025</p>
                </div>
                <div className="bg-slate-50 rounded-lg border border-slate-100 p-3">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Status</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-slate-800 font-medium">Draft</span>
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Due in 3 days</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── INDICATOR 1 ──────────────────────────────────────────────── */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                  <TrendingUp size={13} className="text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-[13px] font-semibold text-slate-800"># of Youth Trained in Digital Skills</h2>
                  <p className="text-[10px] text-slate-400">IND-003</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Target (Q1)</p>
                  <p className="text-[12px] text-slate-700 font-medium">500</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Baseline</p>
                  <p className="text-[12px] text-slate-700 font-medium">0</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Actual Value */}
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                  Actual Value <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={actualValue1}
                  onChange={e => setActualValue1(e.target.value)}
                  placeholder="Enter actual value..."
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20"
                />
                {actualValue1 && (
                  <p className={cn(
                    "text-[11px] mt-1.5 font-medium",
                    achievement1 >= 100 ? "text-emerald-600" : achievement1 >= 80 ? "text-blue-600" : "text-amber-600"
                  )}>
                    Calculated Achievement: {achievement1}%
                  </p>
                )}
              </div>

              {/* Disaggregation */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Users size={13} className="text-indigo-600" />
                  <p className="text-[10px] text-indigo-700 uppercase tracking-widest font-semibold">Disaggregation (Breakdown)</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 w-14 shrink-0">Male:</span>
                    <input
                      type="number"
                      value={maleCount}
                      onChange={e => setMaleCount(e.target.value)}
                      placeholder="0"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 w-14 shrink-0">Female:</span>
                    <input
                      type="number"
                      value={femaleCount}
                      onChange={e => setFemaleCount(e.target.value)}
                      placeholder="0"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 w-14 shrink-0">Urban:</span>
                    <input
                      type="number"
                      value={urbanCount}
                      onChange={e => setUrbanCount(e.target.value)}
                      placeholder="0"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 w-14 shrink-0">Rural:</span>
                    <input
                      type="number"
                      value={ruralCount}
                      onChange={e => setRuralCount(e.target.value)}
                      placeholder="0"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Evidence */}
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                  Evidence / Verification Source <span className="text-red-400">*</span>
                </label>
                <p className="text-[10px] text-slate-400 mb-2">
                  e.g., Scanned Attendance Sheets or Link to KoboToolbox dataset
                </p>
                <div className="flex gap-3 items-center">
                  <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-colors group">
                    <Upload size={14} className="text-slate-400 group-hover:text-slate-600" />
                    <span className="text-[12px] text-slate-600">
                      {evidence1File ? evidence1File.name : "Upload File"}
                    </span>
                    <input
                      type="file"
                      onChange={e => { if (e.target.files?.[0]) setEvidence1File(e.target.files[0]); }}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">or</span>
                  <div className="flex-1 relative">
                    <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={evidence1Link}
                      onChange={e => setEvidence1Link(e.target.value)}
                      placeholder="Paste Link"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Narrative */}
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                  Narrative / Qualitative Impact
                </label>
                <textarea
                  value={narrative}
                  onChange={e => setNarrative(e.target.value)}
                  placeholder="Describe the qualitative impact and any relevant context..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 resize-none"
                />
              </div>
            </div>
          </section>

          {/* ─── INDICATOR 2 ──────────────────────────────────────────────── */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center">
                  <BarChart3 size={13} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-[13px] font-semibold text-slate-800">% of Trainees Placed in Jobs</h2>
                  <p className="text-[10px] text-slate-400">IND-004</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Target (Q1)</p>
                  <p className="text-[12px] text-slate-700 font-medium">60%</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Baseline</p>
                  <p className="text-[12px] text-slate-700 font-medium">10%</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Actual Value */}
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                  Actual Value <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={actualValue2}
                  onChange={e => setActualValue2(e.target.value)}
                  placeholder="Enter percentage..."
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20"
                />
                {actualValue2 && (
                  <p className={cn(
                    "text-[11px] mt-1.5 font-medium",
                    achievement2 >= 100 ? "text-emerald-600" : achievement2 >= 85 ? "text-blue-600" : "text-amber-600"
                  )}>
                    Calculated Achievement: {achievement2}%
                  </p>
                )}
              </div>

              {/* Variance Alert */}
              {showVarianceAlert && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-[12px] text-amber-800">
                      Alert: Value is {60 - parseFloat(actualValue2)}% below target. Please provide an explanation.
                    </p>
                  </div>
                  <div>
                    <label className="block text-[11px] text-amber-700 font-medium mb-1.5">
                      Variance Explanation <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={varianceExplanation}
                      onChange={e => setVarianceExplanation(e.target.value)}
                      placeholder="Explain the reason for the variance..."
                      rows={3}
                      className="w-full px-3 py-2.5 border border-amber-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 resize-none bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Evidence */}
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                  Evidence / Verification Source <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-3 items-center">
                  <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-colors group">
                    <Upload size={14} className="text-slate-400 group-hover:text-slate-600" />
                    <span className="text-[12px] text-slate-600">
                      {evidence2File ? evidence2File.name : "Upload File"}
                    </span>
                    <input
                      type="file"
                      onChange={e => { if (e.target.files?.[0]) setEvidence2File(e.target.files[0]); }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* ─── FOOTER ACTIONS ───────────────────────────────────────────── */}
          <div className="flex items-center justify-between py-2">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-white hover:border-slate-300 transition-colors font-medium"
            >
              Save Draft
            </button>
            <button
              onClick={() => setShowReview(true)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors text-[12px] font-medium"
            >
              <Eye size={14} />
              Review & Submit for Approval
            </button>
          </div>

          {/* Bottom spacer */}
          <div className="h-4" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          REVIEW CONFIRMATION MODAL
          ═══════════════════════════════════════════════════════════════════ */}
      {showReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowReview(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden mx-4">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-[#0B01D0]/5 to-indigo-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0B01D0]/10 flex items-center justify-center">
                  <Eye size={16} className="text-[#0B01D0]" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-900">Review Impact Record</h2>
                  <p className="text-[11px] text-slate-500">Verify all data before submission</p>
                </div>
              </div>
              <button
                onClick={() => setShowReview(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto px-6 py-5 space-y-5">
              {/* Submission Context */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-md bg-[#0B01D0]/10 flex items-center justify-center">
                    <Target size={11} className="text-[#0B01D0]" />
                  </div>
                  <h3 className="text-[12px] text-slate-900 font-semibold uppercase tracking-wider">Submission Context</h3>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
                  <ReviewRow label="Project" value={selectedProject} />
                  <ReviewRow label="Reporting Period" value="Q1 2025 (Jan – Mar)" />
                  <ReviewRow label="Status" value="Draft" />
                </div>
              </div>

              {/* Indicator 1 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center">
                    <TrendingUp size={11} className="text-emerald-600" />
                  </div>
                  <h3 className="text-[12px] text-slate-900 font-semibold uppercase tracking-wider"># of Youth Trained (IND-003)</h3>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
                  <ReviewRow label="Actual Value" value={actualValue1 ? `${actualValue1} (${achievement1}% of target)` : ""} required />
                  <ReviewRow label="Male / Female" value={maleCount || femaleCount ? `${maleCount || 0} / ${femaleCount || 0}` : ""} />
                  <ReviewRow label="Urban / Rural" value={urbanCount || ruralCount ? `${urbanCount || 0} / ${ruralCount || 0}` : ""} />
                  <ReviewRow label="Evidence" value={evidence1File?.name || evidence1Link || ""} />
                  <ReviewRow label="Narrative" value={narrative} multiline />
                </div>
              </div>

              {/* Indicator 2 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-md bg-purple-50 flex items-center justify-center">
                    <BarChart3 size={11} className="text-purple-600" />
                  </div>
                  <h3 className="text-[12px] text-slate-900 font-semibold uppercase tracking-wider">% Trainees Placed (IND-004)</h3>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
                  <ReviewRow label="Actual Value" value={actualValue2 ? `${actualValue2}% (${achievement2}% of target)` : ""} required />
                  {showVarianceAlert && <ReviewRow label="Variance Explanation" value={varianceExplanation} required multiline />}
                  <ReviewRow label="Evidence" value={evidence2File?.name || ""} />
                </div>
              </div>

              {/* Completion summary */}
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-[11px] text-slate-500 mb-1.5">Form Completion</p>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        completionPct >= 80 ? "bg-emerald-500" : completionPct >= 50 ? "bg-blue-500" : "bg-amber-400"
                      )}
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>
                <span className={cn(
                  "text-[13px] font-semibold",
                  completionPct >= 80 ? "text-emerald-600" : completionPct >= 50 ? "text-blue-600" : "text-amber-600"
                )}>
                  {completionPct}%
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <button
                onClick={() => setShowReview(false)}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-white hover:border-slate-300 transition-colors font-medium"
              >
                <Edit3 size={13} />
                Go Back & Edit
              </button>
              <button
                onClick={() => { setShowReview(false); handleSubmit(); }}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors text-[12px] font-medium"
              >
                <Check size={14} />
                Confirm & Submit for Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   REVIEW ROW COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

function ReviewRow({ label, value, required, multiline }: {
  label: string;
  value: string;
  required?: boolean;
  multiline?: boolean;
}) {
  const isEmpty = !value || value.trim() === "";

  return (
    <div className="flex items-start gap-4 px-4 py-3">
      <div className="w-[160px] shrink-0 flex items-center gap-1">
        <span className="text-[11px] text-slate-500">{label}</span>
        {required && isEmpty && (
          <AlertCircle size={11} className="text-amber-500 shrink-0" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        {isEmpty ? (
          <span className="text-[12px] text-slate-400 italic">Not provided</span>
        ) : multiline ? (
          <p className="text-[12px] text-slate-800 leading-relaxed whitespace-pre-wrap">{value}</p>
        ) : (
          <span className="text-[12px] text-slate-800">{value}</span>
        )}
      </div>
      {!isEmpty && (
        <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
      )}
    </div>
  );
}
