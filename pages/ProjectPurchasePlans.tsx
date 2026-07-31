import { useEffect, useState } from "react";
import {
  Search, Eye, ArrowLeft, DollarSign, Package, User, Plus, Send, CheckCircle, AlertTriangle, ShieldAlert,
} from "lucide-react";
import { AddPlanActivityModal } from "../components/procurement/AddPlanActivityModal";
import {
  getPlanGroups,
  submitPlanItemForReview,
  submitPlanGroupForReview,
  subscribe as subscribeProcurement,
  type ProcurementPlanItem,
  type PlanGroup,
} from "../lib/procurementStore";
import { validateMethodAgainstThreshold } from "../lib/procurementThresholds";
import { can, denialReason, getCurrentUser, subscribe as subscribeUser } from "../lib/currentUser";

/**
 * Purchase plans that originate from an approved project, as opposed to the
 * annual departmental plans. Each project carries exactly one plan, so the list
 * is one row per project; opening it shows the planned activities, which are
 * what Approvals → Project Plan Approval acts on.
 */

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

const groupStatusStyle = (s: PlanGroup["status"]) => {
  switch (s) {
    case "Draft": return "bg-slate-100 text-slate-600";
    case "Under Review": return "bg-amber-100 text-amber-700";
    case "Approved": return "bg-green-100 text-green-700";
    case "Rejected": return "bg-red-100 text-red-700";
    case "Mixed": return "bg-blue-100 text-blue-700";
  }
};

const itemStatusStyle = (s: ProcurementPlanItem["approvalStatus"]) => {
  switch (s) {
    case "Draft": return "bg-slate-100 text-slate-600";
    case "Pending Procurement Review": return "bg-blue-100 text-blue-700";
    case "Pending Finance Review": return "bg-amber-100 text-amber-700";
    case "Approved": return "bg-green-100 text-green-700";
    case "Rejected": return "bg-red-100 text-red-700";
  }
};

export function ProjectPurchasePlans() {
  const [, force] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const bump = () => force((n) => n + 1);
    const unsubs = [subscribeProcurement(bump), subscribeUser(bump)];
    return () => unsubs.forEach((u) => u());
  }, []);

  const user = getCurrentUser();
  const groups = getPlanGroups("Project");
  const selected = selectedProject ? groups.find((g) => g.owner === selectedProject) : null;

  const canSubmit = can("plan.submitForReview");
  const canCreate = can("plan.create");

  const submitOne = (item: ProcurementPlanItem) => {
    const result = submitPlanItemForReview(item.id, user.name);
    if (result) {
      setError("");
      setNotice(`${item.ppItemId} was submitted for procurement review.`);
    } else {
      setNotice("");
      setError(`${item.ppItemId} could not be submitted — it may already have moved on.`);
    }
  };

  const submitDrafts = (owner: string) => {
    const { submitted, blocked } = submitPlanGroupForReview("Project", owner, user.name);
    if (submitted === 0 && blocked.length === 0) {
      setNotice("");
      setError(`There are no drafts on the ${owner} plan to submit.`);
      return;
    }
    setError(blocked.length ? `${blocked.length} entr${blocked.length === 1 ? "y" : "ies"} could not be submitted.` : "");
    setNotice(`${submitted} activit${submitted === 1 ? "y" : "ies"} on the ${owner} plan sent for procurement review.`);
  };

  const Notices = () => (
    <>
      {notice && (
        <p className="flex items-center gap-2 text-[12px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <CheckCircle size={13} /> {notice}
        </p>
      )}
      {error && (
        <p className="flex items-center gap-2 text-[12px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertTriangle size={13} /> {error}
        </p>
      )}
    </>
  );

  // ─── Plan detail ────────────────────────────────────────────────────────

  if (selected) {
    return (
      <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-4 shrink-0">
          <button
            onClick={() => { setSelectedProject(null); setNotice(""); setError(""); }}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-[16px] font-semibold text-slate-900">{selected.owner} — Procurement Plan</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">
              {selected.items.length} planned activit{selected.items.length === 1 ? "y" : "ies"} · {formatCurrency(selected.totalValue)}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${groupStatusStyle(selected.status)}`}>
            {selected.status}
          </span>
          <button
            onClick={() => submitDrafts(selected.owner)}
            disabled={!canSubmit || selected.draftCount === 0}
            title={canSubmit ? undefined : denialReason("plan.submitForReview")}
            className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={14} className="text-purple-700" /> Submit {selected.draftCount} draft{selected.draftCount === 1 ? "" : "s"}
          </button>
          <button
            onClick={() => setShowAdd(true)}
            disabled={!canCreate}
            title={canCreate ? undefined : denialReason("plan.create")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#0B01D0" }}
          >
            <Plus size={14} /> Add activity
          </button>
        </div>

        <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center gap-6 shrink-0 flex-wrap">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <span className="text-[12px] text-slate-600">
              Responsible: <span className="font-semibold text-slate-900">{selected.responsiblePeople.join(", ") || "—"}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="text-[12px] text-slate-600">
              Planned value: <span className="font-semibold text-slate-900">{formatCurrency(selected.totalValue)}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-violet-600" />
            <span className="text-[12px] text-slate-600">
              Activities: <span className="font-semibold text-slate-900">{selected.items.length}</span>
            </span>
          </div>
        </div>

        {(notice || error) && <div className="px-6 py-3 bg-white border-b border-slate-200 space-y-2 shrink-0"><Notices /></div>}

        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
              <tr>
                {["Plan item", "Activity", "Category", "Value", "Funding", "Method", "Responsible", "Completion", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-white text-[11px] font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selected.items.map((i) => {
                const check = validateMethodAgainstThreshold(i.procurementMethod, i.estimatedValue);
                return (
                  <tr key={i.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-[12px] text-purple-700 font-medium whitespace-nowrap">{i.ppItemId}</td>
                    <td className="px-4 py-3 text-[12px] text-slate-900 max-w-[280px]">{i.activityDescription}</td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">{i.category}</td>
                    <td className="px-4 py-3 text-[12px] text-slate-900 tabular-nums whitespace-nowrap">{formatCurrency(i.estimatedValue)}</td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">{i.fundingSource}</td>
                    <td className="px-4 py-3">
                      <p className="text-[12px] text-slate-600">{i.procurementMethod}</p>
                      {!check.compliant && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-amber-700">
                          <ShieldAlert size={10} /> off threshold
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-600 whitespace-nowrap">{i.responsiblePerson}</td>
                    <td className="px-4 py-3 text-[12px] text-slate-600 whitespace-nowrap">{formatDate(i.completionDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${itemStatusStyle(i.approvalStatus)}`}>
                        {i.approvalStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {i.approvalStatus === "Draft" || i.approvalStatus === "Rejected" ? (
                        <button
                          onClick={() => submitOne(i)}
                          disabled={!canSubmit}
                          title={canSubmit ? undefined : denialReason("plan.submitForReview")}
                          className="px-3 py-1.5 text-[12px] font-medium text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 disabled:opacity-40 whitespace-nowrap"
                        >
                          {i.approvalStatus === "Rejected" ? "Resubmit" : "Submit"}
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <AddPlanActivityModal
          open={showAdd}
          onClose={() => setShowAdd(false)}
          planType="Project"
          projectName={selected.owner}
          onCreated={(message) => { setError(""); setNotice(message); }}
        />
      </div>
    );
  }

  // ─── Plan list ──────────────────────────────────────────────────────────

  const q = searchQuery.toLowerCase();
  const filtered = groups.filter(
    (g) => !q || g.owner.toLowerCase().includes(q) || g.responsiblePeople.some((p) => p.toLowerCase().includes(q))
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <h1 className="text-[18px] font-semibold text-slate-900">Project Purchase Plans</h1>
        <p className="text-[12px] text-slate-500 mt-1">
          One procurement plan per approved project. Entries reach Approvals → Project Plan Approval once submitted.
        </p>
      </div>

      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0 space-y-2">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project or responsible person..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <Notices />
      </div>

      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
            <tr>
              {["Project", "Responsible", "Activities", "Awaiting review", "Drafts", "Planned value", "Last activity", "Status", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-white text-[12px] font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-12 text-[13px] text-slate-400">No project purchase plans found.</td></tr>
            ) : (
              filtered.map((g, index) => (
                <tr
                  key={g.key}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                  onClick={() => { setSelectedProject(g.owner); setNotice(""); setError(""); }}
                >
                  <td className="px-4 py-3 text-[12px] text-slate-900 font-medium">{g.owner}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">{g.responsiblePeople.join(", ")}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-900 font-medium">{g.items.length}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">{g.pendingCount || "—"}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">{g.draftCount || "—"}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-900 font-medium tabular-nums whitespace-nowrap">{formatCurrency(g.totalValue)}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600 whitespace-nowrap">{formatDate(g.lastActivity)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${groupStatusStyle(g.status)}`}>{g.status}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedProject(g.owner); }}
                      className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-purple-700"
                      title="Open plan"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProjectPurchasePlans;
