import { useState } from "react";
import { X, Send, AlertCircle } from "lucide-react";
import {
  addProcurementPlanItem,
  submitPlanItemForReview,
  type PlanType,
} from "../../lib/procurementStore";
import { can, denialReason, getCurrentUser } from "../../lib/currentUser";
import {
  PlanFormFields,
  emptyPlanForm,
  validatePlanForm,
  toUpdatable,
  type PlanFormState,
} from "../ProcurementPlanView";

/**
 * Adding an activity to a plan, shared by the departmental and project plan
 * screens. The plan type is fixed by whichever screen opened it, so the entry
 * lands in that screen's approval queue and cannot be filed against the other.
 */
export function AddPlanActivityModal({
  open,
  onClose,
  planType,
  projectName,
  department,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  planType: PlanType;
  /** Pre-set for project plans. */
  projectName?: string;
  /** Pre-set when a department tab is active. */
  department?: string;
  onCreated?: (message: string) => void;
}) {
  const [form, setForm] = useState<PlanFormState>(() => ({
    ...emptyPlanForm(planType, projectName ?? ""),
    ...(department ? { department } : {}),
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const user = getCurrentUser();
  const canSubmitForReview = can("plan.submitForReview");

  const reset = () => {
    setForm({
      ...emptyPlanForm(planType, projectName ?? ""),
      ...(department ? { department } : {}),
    });
    setErrors({});
  };

  const submit = (thenSubmitForReview: boolean) => {
    const found = validatePlanForm(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload = toUpdatable(form);
    const created = addProcurementPlanItem({
      ...payload,
      status: "Not Started",
      approvalStatus: "Draft",
    });

    if (thenSubmitForReview) {
      submitPlanItemForReview(created.id, user.name);
      onCreated?.(`${created.ppItemId} was submitted for procurement review.`);
    } else {
      onCreated?.(`${created.ppItemId} was saved as a draft.`);
    }

    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Add plan activity</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {planType === "Project" ? projectName || "Project plan" : `${department ?? "Departmental"} plan`} · saved as a
              draft until Procurement and Finance have both cleared it.
            </p>
          </div>
          <button onClick={() => { reset(); onClose(); }} className="text-slate-400 hover:text-slate-600">
            <X className="size-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {Object.keys(errors).length > 0 && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle className="size-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-[12px] text-red-700">
                {Object.keys(errors).length} field{Object.keys(errors).length === 1 ? "" : "s"} need attention before this
                activity can be saved.
              </p>
            </div>
          )}
          <PlanFormFields form={form} setForm={setForm} errors={errors} lockPlanType />
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-slate-50 rounded-b-2xl">
          <button
            onClick={() => { reset(); onClose(); }}
            className="px-5 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={() => submit(false)}
            className="px-5 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
          >
            Save as draft
          </button>
          <button
            onClick={() => submit(true)}
            disabled={!canSubmitForReview}
            title={canSubmitForReview ? "Save and route to procurement review" : denialReason("plan.submitForReview")}
            className="px-5 py-2 rounded-lg text-sm text-white font-medium flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#0B01D0" }}
          >
            <Send className="size-3.5" /> Save &amp; submit for review
          </button>
        </div>
      </div>
    </div>
  );
}
