import { useEffect, useState, type ReactNode } from "react";
import {
  Search, CheckCircle2, X, AlertTriangle, FileText, Package, Users, Clock, GitPullRequest,
} from "lucide-react";
import {
  getAllChangeRequests, getContracts, reviewDeliverable,
  approveChangeRequestStep, rejectChangeRequest, CHANGE_APPROVAL_CHAIN,
  subscribe as subscribeContracts,
  type AwardedContract, type ContractDeliverable, type ContractChangeRequest,
} from "../lib/contractStore";
import {
  getSuppliers, supplierDisplayName, approveSupplierRegistration, approveReactivation,
  changeSupplierStatus, getMissingDocs, subscribe as subscribeSuppliers, type Supplier,
} from "../lib/supplierStore";
import { getCurrentUser, can, hasRole, denialReason, subscribe as subscribeUser } from "../lib/currentUser";
import { ProcurementStatCards, type ProcurementStat } from "./procurement/ProcurementStatCards";

/* ══════════════════════════════════════════════════════════════════════════════
   Approval queues for the three decisions that previously had no home.

   A variation, a submitted deliverable and a waiting supplier registration were
   each only reachable by opening the individual record, so nothing told an
   approver they were holding something up. These are the queues.
   ══════════════════════════════════════════════════════════════════════════════ */

export type QueueKey = "variations" | "deliverables" | "registrations";

const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;
const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

const TITLES: Record<QueueKey, { title: string; subtitle: string; empty: string }> = {
  variations: {
    title: "Contract Variation Approvals",
    subtitle: "Changes to signed contracts, which follow the same approval chain as a fresh procurement",
    empty: "No variations are awaiting approval.",
  },
  deliverables: {
    title: "Deliverable Acceptance",
    subtitle: "Work submitted by suppliers, waiting for someone other than the submitter to accept it",
    empty: "No deliverables are awaiting review.",
  },
  registrations: {
    title: "Supplier Registrations",
    subtitle: "New suppliers and reactivation requests waiting to join the approved list",
    empty: "No supplier registrations are awaiting review.",
  },
};

export function ProcurementApprovalQueues({ queue }: { queue: QueueKey }) {
  const [, force] = useState(0);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [reject, setReject] = useState<{ label: string; run: (reason: string) => { ok: boolean; error?: string } } | null>(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const bump = () => force((n) => n + 1);
    const unsubs = [subscribeContracts(bump), subscribeSuppliers(bump), subscribeUser(bump)];
    return () => unsubs.forEach((u) => u());
  }, []);
  useEffect(() => { setQuery(""); setNotice(null); }, [queue]);

  const user = getCurrentUser();
  const meta = TITLES[queue];

  const act = (r: { ok: boolean; error?: string } | undefined, okText: string) => {
    if (!r || r.ok) setNotice({ tone: "ok", text: okText });
    else setNotice({ tone: "error", text: r.error ?? "That action could not be completed." });
  };

  /* ── Rows per queue ── */
  let stats: ProcurementStat[] = [];
  let head: string[] = [];
  let rows: { key: string; search: string; cells: ReactNode[] }[] = [];

  if (queue === "variations") {
    const all = getAllChangeRequests();
    const pending = all.filter((r) => r.changeRequest.status === "Pending Approval");
    const costImpact = pending.reduce((s, r) => s + (r.changeRequest.estimatedCostImpact || 0), 0);

    stats = [
      { label: "Awaiting Approval", value: pending.length, icon: <GitPullRequest size={14} />, tone: "warning" },
      { label: "Combined Cost Impact", value: fmt(costImpact), icon: <AlertTriangle size={14} />, tone: "danger", sub: "if all are approved" },
      { label: "Approved This Period", value: all.filter((r) => r.changeRequest.status === "Approved" || r.changeRequest.status === "Implemented").length, icon: <CheckCircle2 size={14} />, tone: "success" },
      { label: "Contracts Affected", value: new Set(pending.map((r) => r.contract.id)).size, icon: <FileText size={14} />, tone: "neutral" },
    ];
    head = ["Contract", "Amendment", "Type", "Reason", "Cost Impact", "Revised Value", "Next Station", "Action"];

    rows = pending.map(({ contract, changeRequest: cr }) => {
      const done = (cr.approvalTrail ?? []).filter((t) => t.action === "Approved").length;
      const next = CHANGE_APPROVAL_CHAIN[done];
      const mine = hasRole(next) && can("contract.approveChange");
      return {
        key: cr.id,
        search: `${contract.contractNumber} ${contract.title} ${cr.reason} ${cr.types.join(" ")} ${next}`,
        cells: [
          <span className="text-[12px] text-purple-700 font-medium">{contract.contractNumber}</span>,
          <span className="text-[12px] text-slate-900">#{cr.changeNumber}</span>,
          <span className="text-[12px] text-slate-600">{cr.types.join(", ")}</span>,
          <span className="text-[12px] text-slate-600 max-w-[240px] block">{cr.reason}</span>,
          <span className="text-[12px] text-slate-900 font-medium tabular-nums">{fmt(cr.estimatedCostImpact || 0)}</span>,
          <span className="text-[12px] text-slate-900 font-medium tabular-nums">{fmt(cr.revisedValue ?? contract.value)}</span>,
          <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 whitespace-nowrap">
            {done}/{CHANGE_APPROVAL_CHAIN.length} · {next}
          </span>,
          <ActionPair
            allowed={mine}
            why={mine ? "" : `Awaiting ${next}. You are signed in as ${user.name}.`}
            onApprove={() => act(approveChangeRequestStep(contract.id, cr.id, next, user.name, ""), `Amendment #${cr.changeNumber} approved at ${next}.`)}
            onReject={() => { setReason(""); setReject({ label: `Reject amendment #${cr.changeNumber}`, run: (rs) => rejectChangeRequest(contract.id, cr.id, next, user.name, rs) }); }}
          />,
        ],
      };
    });
  }

  if (queue === "deliverables") {
    const waiting: { c: AwardedContract; d: ContractDeliverable }[] = [];
    getContracts().forEach((c) => {
      if (c.status === "Closed") return;
      (c.deliverables ?? []).forEach((d) => {
        if (d.status === "Submitted" || d.status === "Under Review") waiting.push({ c, d });
      });
    });
    const value = waiting.reduce((s, r) => s + (r.d.amount ?? 0), 0);

    stats = [
      { label: "Awaiting Acceptance", value: waiting.length, icon: <Package size={14} />, tone: "warning" },
      { label: "Value Held Up", value: fmt(value), icon: <AlertTriangle size={14} />, tone: "danger", sub: "cannot be invoiced until accepted" },
      { label: "Under Review", value: waiting.filter((r) => r.d.status === "Under Review").length, icon: <Clock size={14} />, tone: "info" },
      { label: "Contracts Affected", value: new Set(waiting.map((r) => r.c.id)).size, icon: <FileText size={14} />, tone: "neutral" },
    ];
    head = ["Contract", "Supplier", "Deliverable", "Due", "Submitted By", "Value", "Status", "Action"];

    rows = waiting.map(({ c, d }) => {
      // Whoever submitted it cannot also accept it.
      const ownWork = d.submittedBy === user.name;
      const mine = can("contract.reviewDeliverable") && !ownWork;
      return {
        key: d.id,
        search: `${c.contractNumber} ${c.party} ${d.description} ${d.submittedBy ?? ""}`,
        cells: [
          <span className="text-[12px] text-purple-700 font-medium">{c.contractNumber}</span>,
          <span className="text-[12px] text-slate-600">{c.party}</span>,
          <span className="text-[12px] text-slate-900 max-w-[240px] block">{d.description}</span>,
          <span className="text-[12px] text-slate-600 whitespace-nowrap">{fmtDate(d.dueDate)}</span>,
          <span className="text-[12px] text-slate-600">{d.submittedBy ?? "—"}</span>,
          <span className="text-[12px] text-slate-900 font-medium tabular-nums">{d.amount ? fmt(d.amount) : "—"}</span>,
          <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 whitespace-nowrap">{d.status}</span>,
          <ActionPair
            allowed={mine}
            approveLabel="Accept"
            why={ownWork ? "You submitted this — a second person must accept it." : denialReason("contract.reviewDeliverable")}
            onApprove={() => act(reviewDeliverable(c.id, d.id, "Accepted", user.name, "Accepted from the approval queue."), `"${d.description}" accepted.`)}
            onReject={() => { setReason(""); setReject({ label: `Reject "${d.description}"`, run: (rs) => reviewDeliverable(c.id, d.id, "Rejected", user.name, rs) }); }}
          />,
        ],
      };
    });
  }

  if (queue === "registrations") {
    const waiting = getSuppliers().filter(
      (v) => v.status === "Pending Onboarding" || v.status === "Pending Reactivation" || v.pendingReview
    );

    stats = [
      { label: "Awaiting Review", value: waiting.length, icon: <Users size={14} />, tone: "warning" },
      { label: "New Registrations", value: waiting.filter((v) => v.status === "Pending Onboarding").length, icon: <FileText size={14} />, tone: "info" },
      { label: "Reactivations", value: waiting.filter((v) => v.status === "Pending Reactivation").length, icon: <Clock size={14} />, tone: "accent", sub: "need senior management" },
      { label: "Documents Missing", value: waiting.filter((v) => getMissingDocs(v).length > 0).length, icon: <AlertTriangle size={14} />, tone: "danger" },
    ];
    head = ["Supplier ID", "Supplier / Consultant", "Type", "Category", "Registered", "Outstanding Documents", "Waiting For", "Action"];

    rows = waiting.map((v) => {
      const missing = getMissingDocs(v);
      const isReactivation = v.status === "Pending Reactivation";
      const mine = isReactivation ? can("supplier.approveReactivation") : can("supplier.approveRegistration");
      return {
        key: v.id,
        search: `${v.supplierId} ${supplierDisplayName(v)} ${v.category} ${v.status}`,
        cells: [
          <span className="text-[12px] text-purple-700 font-medium">{v.supplierId}</span>,
          <span className="text-[12px] text-slate-900">{supplierDisplayName(v)}</span>,
          <span className="text-[12px] text-slate-600">{v.type}</span>,
          <span className="text-[12px] text-slate-600">{v.category}</span>,
          <span className="text-[12px] text-slate-600 whitespace-nowrap">{fmtDate(v.dateOnboarded)}</span>,
          missing.length === 0
            ? <span className="text-[12px] text-green-600">All provided</span>
            : <span className="text-[12px] text-red-600 max-w-[220px] block">{missing.join(", ")}</span>,
          <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${
            isReactivation ? "bg-violet-50 text-violet-700" : "bg-amber-50 text-amber-700"
          }`}>{isReactivation ? "Senior Management" : "Procurement"}</span>,
          <ActionPair
            allowed={mine}
            why={isReactivation ? denialReason("supplier.approveReactivation") : denialReason("supplier.approveRegistration")}
            onApprove={() => {
              if (isReactivation) { approveReactivation(v.id, user.name); act(undefined, `${supplierDisplayName(v)} reactivated.`); return; }
              const r = approveSupplierRegistration(v.id, user.name);
              act(r ? { ok: true } : { ok: false, error: `Cannot approve — outstanding documents: ${missing.join(", ")}.` },
                  `${supplierDisplayName(v)} approved and added to the supplier list.`);
            }}
            onReject={() => { setReason(""); setReject({ label: `Reject ${supplierDisplayName(v)}`, run: (rs) => { changeSupplierStatus(v.id, "Rejected" as never, rs, user.name); return { ok: true }; } }); }}
          />,
        ],
      };
    });
  }

  const visible = rows.filter((r) => !query.trim() || r.search.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <h1 className="text-2xl font-semibold text-slate-900">{meta.title}</h1>
        <p className="text-[12px] text-slate-500 mt-1">{meta.subtitle}</p>
      </div>

      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-72">
          <Search size={18} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {notice && (
        <div className={`px-6 py-2.5 border-b shrink-0 flex items-center justify-between ${
          notice.tone === "error" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
        }`}>
          <p className={`text-[12px] flex items-center gap-2 ${notice.tone === "error" ? "text-red-700" : "text-green-700"}`}>
            {notice.tone === "error" ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />} {notice.text}
          </p>
          <button onClick={() => setNotice(null)}><X size={14} className="text-slate-400" /></button>
        </div>
      )}

      <ProcurementStatCards stats={stats} />

      <div className="flex-1 overflow-auto bg-white">
        {visible.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <CheckCircle2 size={30} className="text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">{query ? "No records match your search." : meta.empty}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
              <tr>
                {head.map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-white text-[12px] font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((r, i) => (
                <tr key={r.key} className={`border-b border-slate-100 hover:bg-slate-50 ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                  {r.cells.map((c, ci) => <td key={ci} className="px-4 py-3 align-top">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-6 py-3 border-t border-slate-200 bg-white shrink-0">
        <p className="text-[12px] text-slate-500">{visible.length} awaiting your queue</p>
      </div>

      {reject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[520px]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">{reject.label}</h2>
              <button onClick={() => setReject(null)}><X size={20} className="text-slate-500" /></button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-slate-600 mb-3">A documented reason is required. It is sent to whoever raised the item.</p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Explain what must be corrected…"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40"
              />
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setReject(null)} className="px-4 py-2 rounded-lg text-sm border border-slate-300 hover:bg-slate-50">Cancel</button>
              <button
                onClick={() => { act(reject.run(reason), "Rejected, and the requester notified."); setReject(null); }}
                disabled={!reason.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionPair({
  allowed, why, onApprove, onReject, approveLabel = "Approve",
}: {
  allowed: boolean; why: string; onApprove: () => void; onReject: () => void; approveLabel?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onApprove}
        disabled={!allowed}
        title={allowed ? undefined : why}
        className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-white bg-green-700 hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {approveLabel}
      </button>
      <button
        onClick={onReject}
        disabled={!allowed}
        title={allowed ? undefined : why}
        className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-red-700 border border-red-300 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Reject
      </button>
    </div>
  );
}

export default ProcurementApprovalQueues;
