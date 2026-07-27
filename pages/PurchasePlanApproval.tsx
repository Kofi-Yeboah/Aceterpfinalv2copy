import { useEffect, useState } from "react";
import {
  Search, ArrowLeft, CheckCircle, X, Clock, DollarSign, User, AlertTriangle,
  Calendar, FileSpreadsheet, FileText, Download, History, GitPullRequest, ShieldAlert,
} from "lucide-react";
import {
  getProcurementPlanItems, subscribe as subscribeProcurement,
  reviewPlanItemProcurement, reviewPlanItemFinance, rejectPlanItem,
  approvePlanItemChange, rejectPlanItemChange,
  type ProcurementPlanItem,
} from "../lib/procurementStore";
import { validateMethodAgainstThreshold } from "../lib/procurementThresholds";
import { getCurrentUser, can, denialReason, subscribe as subscribeUser, type Capability } from "../lib/currentUser";
import { exportToCSV, exportToExcel, exportToPDF, type ExportColumn } from "../lib/exportUtils";
import { ProcurementTabs, ProcurementTabBar, type ProcurementTab } from "../components/procurement/ProcurementTabs";

/* ══════════════════════════════════════════════════════════════════════════════
   Procurement plan review queue.

   "For an entry to be accepted, it should have been reviewed by procurement and
   finance for compliance before appearing on portal." This is where that review
   happens: two stations, each with its own queue, plus the queue of amendments
   raised against plan items that are already approved.
   ══════════════════════════════════════════════════════════════════════════════ */

type QueueKey = "procurement" | "finance" | "amendments" | "decided";

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

const exportColumns: ExportColumn<Record<string, unknown>>[] = [
  { key: "ppItemId", header: "Plan Item" },
  { key: "activityDescription", header: "Activity" },
  { key: "category", header: "Category" },
  { key: "estimatedValue", header: "Estimated Value (USD)" },
  { key: "fundingSource", header: "Funding Source" },
  { key: "procurementMethod", header: "Method" },
  { key: "department", header: "Department" },
  { key: "responsiblePerson", header: "Responsible" },
  { key: "initiationDate", header: "Initiation" },
  { key: "completionDate", header: "Completion" },
  { key: "approvalStatus", header: "Review Status" },
  { key: "procurementReviewedBy", header: "Procurement Reviewer" },
  { key: "financeReviewedBy", header: "Finance Reviewer" },
  { key: "rejectionReason", header: "Rejection Reason" },
];

export function PurchasePlanApproval() {
  const [, force] = useState(0);
  const [queue, setQueue] = useState<QueueKey>("procurement");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectFor, setRejectFor] = useState<{ item: ProcurementPlanItem; kind: "item" | "amendment" } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    const bump = () => force((n) => n + 1);
    const unsubs = [subscribeProcurement(bump), subscribeUser(bump)];
    return () => unsubs.forEach((u) => u());
  }, []);

  const user = getCurrentUser();
  const all = getProcurementPlanItems();

  const queues: Record<QueueKey, ProcurementPlanItem[]> = {
    procurement: all.filter((i) => i.approvalStatus === "Pending Procurement Review"),
    finance: all.filter((i) => i.approvalStatus === "Pending Finance Review"),
    amendments: all.filter((i) => !!i.pendingChange),
    decided: all.filter((i) => i.approvalStatus === "Approved" || i.approvalStatus === "Rejected"),
  };

  const matchesSearch = (i: ProcurementPlanItem) => {
    const q = search.toLowerCase();
    return (
      !q ||
      i.ppItemId.toLowerCase().includes(q) ||
      i.activityDescription.toLowerCase().includes(q) ||
      i.department.toLowerCase().includes(q) ||
      i.responsiblePerson.toLowerCase().includes(q) ||
      i.fundingSource.toLowerCase().includes(q)
    );
  };

  const queueTabs: ProcurementTab<QueueKey>[] = [
    { key: "procurement", label: "Procurement review", count: queues.procurement.length },
    { key: "finance", label: "Finance verification", count: queues.finance.length },
    { key: "amendments", label: "Amendments", count: queues.amendments.length },
    { key: "decided", label: "Decided", count: queues.decided.length },
  ];

  const rows = queues[queue].filter(matchesSearch);
  const selected = selectedId ? all.find((i) => i.id === selectedId) : null;
  const exportRows = rows.map((i) => ({ ...i } as unknown as Record<string, unknown>));

  /**
   * Item reviews return the updated record (or undefined when the transition was
   * refused); amendment reviews return `{ok, error}`. Both shapes land here.
   */
  function act(result: unknown, message: string) {
    if (result && typeof result === "object" && "ok" in result) {
      const r = result as { ok: boolean; error?: string };
      if (!r.ok) {
        setError(r.error ?? "That action could not be completed.");
        setNotice("");
        return;
      }
    } else if (!result) {
      setError("That action could not be completed — the item may have moved to another stage.");
      setNotice("");
      return;
    }
    setError("");
    setNotice(message);
    setComments("");
  }

  /* ── Detail view ── */
  if (selected) {
    const check = validateMethodAgainstThreshold(selected.procurementMethod, selected.estimatedValue);
    const pending = selected.pendingChange;

    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-auto">
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
          <button
            onClick={() => { setSelectedId(null); setError(""); setNotice(""); }}
            className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-1"
          >
            <ArrowLeft size={15} /> Back to queue
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold text-slate-900">{selected.ppItemId}</h1>
            <StatusBadge status={selected.approvalStatus} />
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{selected.activityDescription}</p>
        </div>

        <div className="p-6 space-y-5 max-w-5xl">
          {error && <Banner tone="error">{error}</Banner>}
          {notice && <Banner tone="ok">{notice}</Banner>}

          {selected.rejectionReason && selected.approvalStatus === "Rejected" && (
            <Banner tone="error">
              <strong>Rejected.</strong> {selected.rejectionReason}
            </Banner>
          )}

          {!check.compliant && (
            <Banner tone="warn">
              <strong>Method deviates from the value threshold.</strong> {check.message}
              <br />
              {selected.methodDeviationJustification
                ? <>Justification recorded: “{selected.methodDeviationJustification}”</>
                : <>No justification has been recorded for this deviation.</>}
            </Banner>
          )}

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Plan entry</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Fact icon={<FileText />} label="Category" value={selected.category} />
              <Fact icon={<DollarSign />} label="Estimated value" value={currency(selected.estimatedValue)} />
              <Fact icon={<FileText />} label="Procurement method" value={selected.procurementMethod} />
              <Fact icon={<User />} label="Responsible" value={`${selected.responsiblePerson} · ${selected.department}`} />
              <Fact icon={<DollarSign />} label="Funding source" value={selected.fundingSource} />
              <Fact icon={<FileText />} label="Budget line" value={selected.linkedBudgetLine || "Not linked"} />
              <Fact icon={<Calendar />} label="Initiation" value={formatDate(selected.initiationDate)} />
              <Fact icon={<Calendar />} label="Target award" value={formatDate(selected.awardDate)} />
              <Fact icon={<Calendar />} label="Completion" value={formatDate(selected.completionDate)} />
              <Fact icon={<FileText />} label="Work plan" value={selected.linkedWorkPlan || "Not linked"} />
              <Fact icon={<User />} label="Submitted by" value={selected.submittedBy || "—"} />
              <Fact icon={<Calendar />} label="Submitted" value={formatDate(selected.submittedDate)} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Review trail</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              <Station label="Submitted" done={!!selected.submittedDate} by={selected.submittedBy} when={selected.submittedDate} />
              <Station
                label="Procurement compliance"
                done={selected.procurementReview === "Approved"}
                rejected={selected.procurementReview === "Rejected"}
                by={selected.procurementReviewedBy}
                current={selected.approvalStatus === "Pending Procurement Review"}
              />
              <Station
                label="Finance budget verification"
                done={selected.financeReview === "Approved"}
                rejected={selected.financeReview === "Rejected"}
                by={selected.financeReviewedBy}
                current={selected.approvalStatus === "Pending Finance Review"}
              />
            </div>
          </div>

          {pending && (
            <div className="bg-white rounded-xl border border-amber-300 p-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <GitPullRequest size={16} className="text-amber-600" />
                <h2 className="text-sm font-semibold text-slate-900">Amendment awaiting review</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-700">
                  {pending.status}
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Requested by {pending.requestedBy} on {formatDate(pending.requestedDate)}.
              </p>
              <p className="text-sm text-slate-700 mt-2"><strong>Reason:</strong> {pending.reason}</p>
              <div className="mt-3 rounded-lg border border-slate-200 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {["Field", "Current", "Proposed"].map((h) => (
                        <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-slate-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(pending.updates).map(([field, value]) => (
                      <tr key={field} className="border-t border-slate-100">
                        <td className="px-3 py-2 text-slate-900">{field}</td>
                        <td className="px-3 py-2 text-slate-500">
                          {String((selected as unknown as Record<string, unknown>)[field] ?? "—")}
                        </td>
                        <td className="px-3 py-2 text-slate-900 font-medium">{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                {pending.status === "Pending Procurement Review" && (
                  <Action
                    capability="plan.reviewProcurement"
                    label="Approve amendment — Procurement"
                    onClick={() => act(
                      approvePlanItemChange(selected.id, user.name, "Procurement"),
                      "Amendment cleared procurement review. Finance must now confirm the budget impact."
                    )}
                  />
                )}
                {pending.status === "Pending Finance Review" && (
                  <Action
                    capability="plan.reviewFinance"
                    label="Approve amendment — Finance"
                    onClick={() => act(
                      approvePlanItemChange(selected.id, user.name, "Finance"),
                      "Amendment approved and applied to the plan item."
                    )}
                  />
                )}
                <button
                  onClick={() => { setRejectFor({ item: selected, kind: "amendment" }); setRejectReason(""); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-700 border border-red-300 hover:bg-red-50"
                >
                  Reject amendment
                </button>
              </div>
            </div>
          )}

          {(selected.approvalStatus === "Pending Procurement Review" || selected.approvalStatus === "Pending Finance Review") && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-slate-900 mb-1">Your decision</h2>
              <p className="text-xs text-slate-500 mb-4">Signed in as {user.name} — {user.roles.join(", ")}.</p>
              <label className="block text-xs font-medium text-slate-600 mb-1">Comments (optional)</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
              <div className="flex flex-wrap gap-3">
                {selected.approvalStatus === "Pending Procurement Review" ? (
                  <Action
                    capability="plan.reviewProcurement"
                    label="Approve — policy and plan compliance"
                    onClick={() => act(
                      reviewPlanItemProcurement(selected.id, user.name, comments),
                      "Compliance review recorded. The entry now awaits Finance budget verification."
                    )}
                  />
                ) : (
                  <Action
                    capability="plan.reviewFinance"
                    label="Approve — budget verified"
                    onClick={() => act(
                      reviewPlanItemFinance(selected.id, user.name, comments),
                      "Budget verified. The plan entry is approved and now available for requisition."
                    )}
                  />
                )}
                <button
                  onClick={() => { setRejectFor({ item: selected, kind: "item" }); setRejectReason(""); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-700 border border-red-300 hover:bg-red-50"
                >
                  Reject with reason
                </button>
              </div>
            </div>
          )}

          {selected.changeHistory.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <History size={15} className="text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-900">Change history — version {selected.version}</h2>
              </div>
              <div className="rounded-lg border border-slate-200 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {["Date", "Field", "From", "To", "Changed by", "Approved by"].map((h) => (
                        <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-slate-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selected.changeHistory.map((c) => (
                      <tr key={c.id} className="border-t border-slate-100">
                        <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{formatDate(c.date)}</td>
                        <td className="px-3 py-2 text-slate-900">{c.field}</td>
                        <td className="px-3 py-2 text-slate-500">{c.oldValue}</td>
                        <td className="px-3 py-2 text-slate-900">{c.newValue}</td>
                        <td className="px-3 py-2 text-slate-500">{c.changedBy}</td>
                        <td className="px-3 py-2 text-slate-500">{c.approvedBy ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {rejectFor && (
          <RejectModal
            title={rejectFor.kind === "amendment" ? "Reject amendment" : "Reject plan entry"}
            reason={rejectReason}
            setReason={setRejectReason}
            onCancel={() => setRejectFor(null)}
            onConfirm={() => {
              const stage = rejectFor.item.approvalStatus === "Pending Finance Review" ? "Finance" : "Procurement";
              const result =
                rejectFor.kind === "amendment"
                  ? rejectPlanItemChange(rejectFor.item.id, user.name, rejectReason)
                  : rejectPlanItem(rejectFor.item.id, user.name, rejectReason, stage);
              act(
                result,
                rejectFor.kind === "amendment"
                  ? "Amendment rejected and the requester notified."
                  : "Plan entry rejected. The originator can correct it and resubmit."
              );
              setRejectFor(null);
            }}
          />
        )}
      </div>
    );
  }

  /* ── Queue list ── */
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Procurement plan approvals</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Plan entries must clear procurement compliance and finance budget verification before they become available
          for requisition.
        </p>
      </div>

      <ProcurementTabBar>
        <ProcurementTabs tabs={queueTabs} active={queue} onChange={setQueue} minWidth={80} />
      </ProcurementTabBar>

      <div className="px-6 py-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-80">
          <Search size={18} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Plan item, activity, department or funding source"
            className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowExport(!showExport)}
            disabled={!can("report.export")}
            title={can("report.export") ? undefined : denialReason("report.export")}
            className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 shadow-sm disabled:opacity-40"
          >
            <span className="text-sm text-slate-900">Export</span>
            <Download size={16} className="text-purple-700" />
          </button>
          {showExport && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowExport(false)} />
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                <button
                  onClick={() => { exportToExcel("Procurement Plan Approvals", exportColumns, exportRows, { subtitle: `Queue: ${queue}`, generatedBy: user.name }); setShowExport(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileSpreadsheet size={14} className="text-green-600" /> Excel
                </button>
                <button
                  onClick={() => { exportToPDF("Procurement Plan Approvals", exportColumns, exportRows, { subtitle: `Queue: ${queue}`, generatedBy: user.name }); setShowExport(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileText size={14} className="text-red-600" /> PDF
                </button>
                <button
                  onClick={() => { exportToCSV("Procurement Plan Approvals", exportColumns, exportRows); setShowExport(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                >
                  <Download size={14} className="text-slate-500" /> CSV
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        {rows.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <CheckCircle size={34} className="text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">
              {queue === "procurement" && "No plan entries are awaiting procurement compliance review."}
              {queue === "finance" && "No plan entries are awaiting finance budget verification."}
              {queue === "amendments" && "No amendments are awaiting review."}
              {queue === "decided" && "No plan entries have been decided yet."}
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Entries arrive here when someone submits them for review from the Procurement Plan screen.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }}>
              <tr>
                {["Plan item", "Activity", "Category", "Value", "Funding", "Method", "Responsible", "Completion", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-white text-[12px] font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((i) => {
                const check = validateMethodAgainstThreshold(i.procurementMethod, i.estimatedValue);
                return (
                  <tr key={i.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="text-[12px] font-medium text-slate-900">{i.ppItemId}</p>
                      {i.pendingChange && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-amber-700">
                          <GitPullRequest size={10} /> amendment pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-700 max-w-[260px]">{i.activityDescription}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{i.category}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-900 tabular-nums">{currency(i.estimatedValue)}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{i.fundingSource}</p></td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{i.procurementMethod}</p>
                      {!check.compliant && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-amber-700">
                          <ShieldAlert size={10} /> off threshold
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{i.responsiblePerson}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500 whitespace-nowrap">{formatDate(i.completionDate)}</p></td>
                    <td className="px-4 py-4"><StatusBadge status={i.approvalStatus} /></td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => { setSelectedId(i.id); setError(""); setNotice(""); }}
                        className="px-3 py-1.5 text-[12px] font-medium text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 whitespace-nowrap"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ── Small pieces ── */

function StatusBadge({ status }: { status: ProcurementPlanItem["approvalStatus"] }) {
  const tone =
    status === "Approved" ? "bg-green-50 text-green-700"
      : status === "Rejected" ? "bg-red-50 text-red-600"
      : status === "Draft" ? "bg-slate-100 text-slate-600"
      : "bg-orange-50 text-orange-700";
  return <span className={`inline-flex px-2 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap ${tone}`}>{status}</span>;
}

function Banner({ tone, children }: { tone: "ok" | "error" | "warn"; children: React.ReactNode }) {
  const style =
    tone === "ok" ? "border-green-300 bg-green-50 text-green-800"
      : tone === "warn" ? "border-amber-300 bg-amber-50 text-amber-900"
      : "border-red-300 bg-red-50 text-red-800";
  const Icon = tone === "ok" ? CheckCircle : AlertTriangle;
  return (
    <div className={`rounded-xl border p-4 text-sm flex gap-2.5 ${style}`}>
      <Icon size={17} className="shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-2.5">
      <div className="text-slate-400 mt-0.5 [&>svg]:size-4">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm text-slate-900 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

function Station({
  label, done, rejected, current, by, when,
}: {
  label: string; done?: boolean; rejected?: boolean; current?: boolean; by?: string; when?: string;
}) {
  const tone = rejected ? "border-red-200 bg-red-50"
    : done ? "border-green-200 bg-green-50"
    : current ? "border-purple-300 bg-purple-50"
    : "border-slate-200";
  return (
    <div className={`rounded-lg border p-3 ${tone}`}>
      <div className="flex items-center gap-1.5">
        {rejected ? <X size={14} className="text-red-600" />
          : done ? <CheckCircle size={14} className="text-green-600" />
          : current ? <Clock size={14} className="text-purple-600" />
          : <Clock size={14} className="text-slate-300" />}
        <p className="text-[12px] font-medium text-slate-900">{label}</p>
      </div>
      <p className="text-[11px] text-slate-500 mt-1">
        {by ? `${by}${when ? ` · ${formatDate(when)}` : ""}` : current ? "Awaiting action" : "—"}
      </p>
    </div>
  );
}

function Action({ capability, label, onClick }: { capability: Capability; label: string; onClick: () => void }) {
  const allowed = can(capability);
  return (
    <button
      onClick={onClick}
      disabled={!allowed}
      title={allowed ? undefined : denialReason(capability)}
      className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
}

function RejectModal({
  title, reason, setReason, onCancel, onConfirm,
}: {
  title: string; reason: string; setReason: (v: string) => void; onCancel: () => void; onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[520px]">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onCancel} className="p-1 hover:bg-slate-100 rounded-lg"><X size={20} className="text-slate-500" /></button>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-slate-600 mb-3">
            A documented reason is required. It is sent to the originator so the entry can be corrected and resubmitted.
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Explain what must be corrected…"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40"
          />
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm border border-slate-300 hover:bg-slate-50">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={!reason.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm rejection
          </button>
        </div>
      </div>
    </div>
  );
}

export default PurchasePlanApproval;
