// ──────────────────────────────────────────────────────────────────────────────
// Identity & role context for the procurement suite.
//
// Every approval gate in the business requirements is role-specific ("Procurement
// reviews", "the supervisor of the CC gives final approval", "Audit: read-only").
// Without a current actor those gates cannot be enforced or recorded, so this
// module supplies one and exposes `can()` for the components to gate on.
//
// The role switcher exists because a single browser session has to be able to
// walk a requisition through five different approvers to demonstrate the flow.
// ──────────────────────────────────────────────────────────────────────────────

export type ProcurementRole =
  | "Requestor"
  | "Department Head"
  | "Procurement"
  | "Finance"
  | "Senior Management"
  | "Contract Coordinator"
  | "Supervisor"
  | "Audit"
  | "Supplier";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  department: string;
  jobTitle: string;
  roles: ProcurementRole[];
  /** Who countersigns this user's approvals (CC → supervisor chain). */
  supervisorName?: string;
}

export type Capability =
  // Procurement planning
  | "plan.create"
  | "plan.edit"
  | "plan.submitForReview"
  | "plan.reviewProcurement"
  | "plan.reviewFinance"
  | "plan.emergencyOverride"
  // Requisitions
  | "pr.create"
  | "pr.approveDept"
  | "pr.approveProcurement"
  | "pr.approveFinance"
  | "pr.approveSenior"
  // Suppliers
  | "supplier.create"
  | "supplier.approveRegistration"
  | "supplier.suspend"
  | "supplier.approveReactivation"
  | "supplier.validateBanking"
  // Sourcing
  | "sourcing.manage"
  | "sourcing.award"
  // Contracts
  | "contract.register"
  | "contract.uploadDeliverable"
  | "contract.reviewDeliverable"
  | "contract.invoiceCCReview"
  | "contract.invoiceProcurementReview"
  | "contract.invoiceSupervisorApprove"
  | "contract.processPayment"
  | "contract.approveChange"
  | "contract.evaluatePerformance"
  | "contract.approveEvaluation"
  | "contract.close"
  // Cross-cutting
  | "report.view"
  | "report.export"
  | "audit.view";

const ROLE_CAPABILITIES: Record<ProcurementRole, Capability[]> = {
  Requestor: ["plan.create", "plan.edit", "plan.submitForReview", "pr.create", "report.view"],
  "Department Head": [
    "plan.create", "plan.edit", "plan.submitForReview", "pr.create", "pr.approveDept",
    "contract.uploadDeliverable", "report.view", "report.export",
  ],
  Procurement: [
    "plan.create", "plan.edit", "plan.submitForReview", "plan.reviewProcurement", "plan.emergencyOverride",
    "pr.create", "pr.approveProcurement",
    "supplier.create", "supplier.approveRegistration", "supplier.suspend",
    "sourcing.manage", "sourcing.award",
    "contract.register", "contract.reviewDeliverable", "contract.invoiceProcurementReview",
    "contract.approveChange", "contract.close",
    "report.view", "report.export",
  ],
  Finance: [
    "plan.reviewFinance", "pr.approveFinance", "supplier.validateBanking",
    "contract.processPayment", "contract.close",
    "report.view", "report.export",
  ],
  "Senior Management": [
    "pr.approveSenior", "supplier.approveReactivation", "supplier.suspend",
    "contract.approveChange", "contract.approveEvaluation", "contract.close",
    "plan.emergencyOverride", "report.view", "report.export", "audit.view",
  ],
  "Contract Coordinator": [
    "contract.uploadDeliverable", "contract.invoiceCCReview", "contract.evaluatePerformance",
    "report.view",
  ],
  Supervisor: [
    "contract.invoiceSupervisorApprove", "contract.approveEvaluation", "contract.reviewDeliverable",
    "report.view", "report.export",
  ],
  Audit: ["report.view", "report.export", "audit.view"],
  Supplier: [],
};

/** Demo directory — one representative user per approval station. */
export const USER_DIRECTORY: AppUser[] = [
  {
    id: "u-req", name: "Ama Darko", email: "ama.darko@acet.org", department: "Programs",
    jobTitle: "Programme Officer", roles: ["Requestor", "Contract Coordinator"],
    supervisorName: "James Owusu",
  },
  {
    id: "u-dept", name: "James Owusu", email: "james.owusu@acet.org", department: "Programs",
    jobTitle: "Director of Programmes", roles: ["Department Head", "Supervisor"],
    supervisorName: "Nana Adjei",
  },
  {
    id: "u-proc", name: "Felix Addo", email: "felix.addo@acet.org", department: "Procurement",
    jobTitle: "Procurement Manager", roles: ["Procurement"],
    supervisorName: "Nana Adjei",
  },
  {
    id: "u-fin", name: "Abena Osei", email: "abena.osei@acet.org", department: "Finance",
    jobTitle: "Finance Manager", roles: ["Finance"],
    supervisorName: "Nana Adjei",
  },
  {
    id: "u-exec", name: "Nana Adjei", email: "nana.adjei@acet.org", department: "Executive",
    jobTitle: "Chief Operating Officer", roles: ["Senior Management"],
  },
  {
    id: "u-audit", name: "Selorm Agbo", email: "selorm.agbo@acet.org", department: "Internal Audit",
    jobTitle: "Internal Auditor", roles: ["Audit"],
  },
];

type Listener = () => void;
let listeners: Listener[] = [];

// Procurement is the widest-access role, so it is the most useful default for a
// prototype landing on the procurement module.
let currentUser: AppUser = USER_DIRECTORY.find((u) => u.id === "u-proc")!;

function notify() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function getCurrentUser(): AppUser {
  return currentUser;
}

export function setCurrentUser(userId: string) {
  const found = USER_DIRECTORY.find((u) => u.id === userId);
  if (!found) return;
  currentUser = found;
  notify();
}

export function hasRole(role: ProcurementRole, user: AppUser = currentUser): boolean {
  return user.roles.includes(role);
}

export function can(capability: Capability, user: AppUser = currentUser): boolean {
  return user.roles.some((role) => ROLE_CAPABILITIES[role]?.includes(capability));
}

/** Capabilities the user does NOT have, for "why is this disabled" tooltips. */
export function requiredRolesFor(capability: Capability): ProcurementRole[] {
  return (Object.keys(ROLE_CAPABILITIES) as ProcurementRole[]).filter((role) =>
    ROLE_CAPABILITIES[role].includes(capability)
  );
}

/** Human-readable reason a control is locked, used as a title/tooltip. */
export function denialReason(capability: Capability): string {
  const roles = requiredRolesFor(capability);
  return `Requires ${roles.join(" or ")} role — you are signed in as ${currentUser.name} (${currentUser.roles.join(", ")}).`;
}
