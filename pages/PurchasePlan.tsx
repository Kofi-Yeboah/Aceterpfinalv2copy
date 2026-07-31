import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Send, CheckCircle, AlertTriangle, ShieldAlert } from "lucide-react";
import { ProcurementTabs, ProcurementTabBar } from "../components/procurement/ProcurementTabs";
import { AddPlanActivityModal } from "../components/procurement/AddPlanActivityModal";
import {
  getPlanItemsByType,
  submitPlanItemForReview,
  submitPlanGroupForReview,
  subscribe as subscribeProcurement,
  type ProcurementPlanItem,
} from "../lib/procurementStore";
import { validateMethodAgainstThreshold } from "../lib/procurementThresholds";
import { can, denialReason, getCurrentUser, subscribe as subscribeUser } from "../lib/currentUser";

/**
 * The annual plans departments prepare, one tab per department. Rows are the
 * planned activities themselves — the unit Procurement and Finance approve —
 * so what is created here is exactly what arrives in the departmental plan
 * approval queue.
 */

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

const statusStyle = (s: ProcurementPlanItem["approvalStatus"]) => {
  switch (s) {
    case "Draft": return "bg-slate-100 text-slate-600";
    case "Pending Procurement Review": return "bg-blue-100 text-blue-700";
    case "Pending Finance Review": return "bg-amber-100 text-amber-700";
    case "Approved": return "bg-green-100 text-green-700";
    case "Rejected": return "bg-red-100 text-red-700";
  }
};

export function PurchasePlan() {
  const [, force] = useState(0);
  const [activeDept, setActiveDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const bump = () => force((n) => n + 1);
    const unsubs = [subscribeProcurement(bump), subscribeUser(bump)];
    return () => unsubs.forEach((u) => u());
  }, []);

  const user = getCurrentUser();
  const items = getPlanItemsByType("Departmental");

  const departments = useMemo(
    () => ["All", ...[...new Set(items.map((i) => i.department))].sort()],
    [items]
  );

  const inTab = (i: ProcurementPlanItem) => activeDept === "All" || i.department === activeDept;

  const rows = items.filter((i) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      i.ppItemId.toLowerCase().includes(q) ||
      i.activityDescription.toLowerCase().includes(q) ||
      i.responsiblePerson.toLowerCase().includes(q) ||
      i.fundingSource.toLowerCase().includes(q);
    return inTab(i) && matchesSearch;
  });

  const scoped = items.filter(inTab);
  const drafts = scoped.filter((i) => i.approvalStatus === "Draft");
  const pending = scoped.filter(
    (i) => i.approvalStatus === "Pending Procurement Review" || i.approvalStatus === "Pending Finance Review"
  );

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

  const submitAllDrafts = () => {
    if (activeDept === "All") {
      // Submitting across every department at once would hide which plan moved.
      setNotice("");
      setError("Choose a department tab first — drafts are submitted one department's plan at a time.");
      return;
    }
    const { submitted, blocked } = submitPlanGroupForReview("Departmental", activeDept, user.name);
    if (submitted === 0 && blocked.length === 0) {
      setNotice("");
      setError(`There are no drafts on the ${activeDept} plan to submit.`);
      return;
    }
    setError(blocked.length ? `${blocked.length} entr${blocked.length === 1 ? "y" : "ies"} could not be submitted.` : "");
    setNotice(`${submitted} activit${submitted === 1 ? "y" : "ies"} on the ${activeDept} plan sent for procurement review.`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-900">Departmental Purchase Plans</h1>
          <p className="text-[12px] text-slate-500 mt-1">
            Annual plans prepared by each department. Entries reach Approvals → Departmental Plan Approval once submitted.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={submitAllDrafts}
            disabled={!canSubmit || drafts.length === 0}
            title={canSubmit ? undefined : denialReason("plan.submitForReview")}
            className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={14} className="text-purple-700" />
            Submit {drafts.length} draft{drafts.length === 1 ? "" : "s"}
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
      </div>

      <ProcurementTabBar>
        <ProcurementTabs
          tabs={departments.map((d) => ({
            key: d,
            label: d,
            count: d === "All" ? items.length : items.filter((i) => i.department === d).length,
          }))}
          active={activeDept}
          onChange={(d) => { setActiveDept(d); setNotice(""); setError(""); }}
        />
      </ProcurementTabBar>

      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0 space-y-2">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by activity, plan item, responsible person or funding source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
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
      </div>

      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
            <tr>
              {["Plan item", "Activity", "Department", "Category", "Value", "Funding", "Method", "Responsible", "Completion", "Status", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-white text-[12px] font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-12 text-[13px] text-slate-400">
                  No plan activities {activeDept === "All" ? "yet" : `for ${activeDept}`}.
                </td>
              </tr>
            ) : (
              rows.map((i) => {
                const check = validateMethodAgainstThreshold(i.procurementMethod, i.estimatedValue);
                return (
                  <tr key={i.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-[12px] text-purple-700 font-medium whitespace-nowrap">{i.ppItemId}</td>
                    <td className="px-4 py-3 text-[12px] text-slate-900 max-w-[280px]">{i.activityDescription}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700">{i.department}</span>
                    </td>
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
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${statusStyle(i.approvalStatus)}`}>
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
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-2.5 bg-white border-t border-slate-200 shrink-0">
        <span className="text-[12px] text-slate-500">
          {rows.length} activit{rows.length === 1 ? "y" : "ies"}
          {activeDept !== "All" && ` on the ${activeDept} plan`}
        </span>
      </div>

      <AddPlanActivityModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        planType="Departmental"
        department={activeDept === "All" ? undefined : activeDept}
        onCreated={(message) => { setError(""); setNotice(message); }}
      />
    </div>
  );
}

export default PurchasePlan;
