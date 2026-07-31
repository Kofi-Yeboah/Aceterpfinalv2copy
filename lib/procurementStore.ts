// Shared procurement store for cross-component state
// When sourcing events are approved, POs are auto-generated here
// When ESS procurement plan items are initiated, PRs are auto-generated here
//
// The plan-review and requisition workflows live here rather than in the
// components because each is a multi-station chain whose guards — no sourcing
// without an approved plan item, no payment-bearing approval by the person who
// raised the request — only hold if every caller passes through one place.

import { notify, scheduleReminder, resolveReminder } from "./notificationStore";
import {
  SENIOR_APPROVAL_THRESHOLD,
  canonicalMethod,
  isDirect,
  suggestProcurementMethod,
  validateMethodAgainstThreshold,
} from "./procurementThresholds";

export interface POLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  budgetCode: string;
}

export type POStatus = "Draft" | "Pending Signature" | "Signed" | "Dispatched";

export interface GeneratedPO {
  id: string;
  poNumber: string;
  supplier: string;
  supplierEmail?: string;
  supplierAddress?: string;
  itemDescription: string;
  orderDate: string;
  deliveryDate: string;
  amount: number;
  sourcePR: string;
  projectName: string;
  sourceRFQ: string;
  // Enhanced fields for PO generation flow
  status?: POStatus;
  lineItems?: POLineItem[];
  deliveryInstructions?: string;
  warrantyTerms?: string;
  paymentTerms?: string;
  shippingMethod?: string;
  signedBy?: string;
  signedAt?: string;
  signatureAuthority?: string;
  signatureDataUrl?: string;
  dispatchedAt?: string;
  supplierNotifiedAt?: string;
  contractNumber?: string;
  sourceSourcingCase?: string;
  category?: string;
  method?: string;
  department?: string;
  requestedBy?: string;
}

export interface SourcingApprovalItem {
  id: string;
  rfqNumber: string;
  title: string;
  supplier: string;
  projectName: string;
  sourcePR: string;
  estimatedValue: number;
  dateSubmitted: string;
  approvalStatus: "Pending" | "Approved" | "Rejected";
}

export type PRApprovalStepStatus = "Pending" | "Approved" | "Rejected" | "N/A";

/**
 * The full requisition lifecycle from the business requirements. Procurement
 * and Finance share one state because the requirement calls for them to review
 * concurrently; the individual `procurementApproval` / `financeApproval` fields
 * carry each station's own verdict within it.
 */
export type PROverallStatus =
  | "Draft"
  | "Submitted"
  | "Pending Dept Approval"
  | "Pending Procurement & Finance"
  | "Pending Senior Mgmt"
  | "Approved"
  | "Rejected"
  | "Withdrawn"
  | "Converted to Sourcing";

export interface PRApprovalHistoryEntry {
  step: number;
  role: string;
  action: "Approved" | "Rejected" | "Submitted";
  date: string;
  comments: string;
}

export interface GeneratedPR {
  id: string;
  requisitionNumber: string;
  requestedBy: string;
  department: string;
  itemDescription: string;
  quantity: number;
  estimatedCost: number;
  priority: string;
  status: string;
  dateRequested: string;
  purchaseType: string;
  sourcePlanId: string;
  sourcePlanItemId: string;
  category: string;
  unit: string;
  // Approval workflow
  currentStep: number; // 1–5
  overallApprovalStatus: PROverallStatus;
  deptApproval: PRApprovalStepStatus;
  procurementApproval: PRApprovalStepStatus;
  financeApproval: PRApprovalStepStatus;
  seniorMgmtApproval: PRApprovalStepStatus;
  requiresSeniorApproval: boolean;
  approvalHistory: PRApprovalHistoryEntry[];
  sourceType: "ESS Plan" | "Direct";
  // Enhanced fields from business requirements
  requisitionTitle?: string;
  entityType?: "Individual" | "Firm";
  fundingSource?: string;
  deliveryTimeline?: string; // for goods
  serviceStartDate?: string; // for services
  serviceEndDate?: string; // for services
  directSelectionJustification?: string;
  shortlistedEntities?: { name: string; address: string; email: string }[];
  attachments?: string[]; // TOR, specs, supporting docs
  linkedPlanItemId?: string; // dropdown-selected plan item
  daysInCurrentStage?: number;
  currentResponsible?: string;
  /** Date the requisition entered its current stage, so days-in-stage is real. */
  stageEnteredDate?: string;
  /** Documented reason from the most recent rejection, shown on resubmission. */
  rejectionReason?: string;
  rejectedAtStage?: string;
  resubmissionCount?: number;
  withdrawnReason?: string;
  /** Set when sourcing initiates without an approved plan item. */
  emergencyOverride?: boolean;
  emergencyOverrideJustification?: string;
  emergencyOverrideApprovedBy?: string;
  /** Justification when the chosen method departs from its value threshold. */
  methodDeviationJustification?: string;
  /** Sourcing case created on approval. */
  convertedToSourcingCase?: string;
  /** Populated when the estimated cost is materially above the plan item. */
  planVarianceFlag?: string;
  planVarianceComment?: string;
  attachmentFiles?: { name: string; url: string; type: string; size: string; label: string }[];
}

type Listener = () => void;

let listeners: Listener[] = [];

// Sourcing items pending approval (from "Awarded" RFQs that need final approval before PO)
let sourcingApprovals: SourcingApprovalItem[] = [
  { id: "SA-1", rfqNumber: "RFQ-2024-001", title: "Consultant Fees - Survey Design", supplier: "Dr. Kwesi Appiah", projectName: "Youth Employment Skills Development", sourcePR: "PR-2024-001", estimatedValue: 8000, dateSubmitted: "2024-12-16", approvalStatus: "Approved" },
  { id: "SA-2", rfqNumber: "RFQ-2024-002", title: "Printing & Materials", supplier: "PrintWorks Ghana Ltd", projectName: "Youth Employment Skills Development", sourcePR: "PR-2024-001", estimatedValue: 1050, dateSubmitted: "2024-12-13", approvalStatus: "Approved" },
  { id: "SA-3", rfqNumber: "RFQ-2024-003", title: "Stakeholder Workshop Venue & Catering", supplier: "La Palm Royal Beach Hotel", projectName: "Youth Employment Skills Development", sourcePR: "PR-2024-001", estimatedValue: 3500, dateSubmitted: "2024-12-21", approvalStatus: "Approved" },
  { id: "SA-4", rfqNumber: "RFQ-2024-004", title: "External Reviewer Honoraria", supplier: "Prof. Ama Benyiwa", projectName: "Youth Employment Skills Development", sourcePR: "PR-2024-003", estimatedValue: 4000, dateSubmitted: "2024-12-26", approvalStatus: "Approved" },
  { id: "SA-5", rfqNumber: "RFQ-2024-005", title: "Research Assistant Stipends", supplier: "University of Ghana", projectName: "Youth Employment Skills Development", sourcePR: "PR-2024-004", estimatedValue: 6000, dateSubmitted: "2024-12-29", approvalStatus: "Approved" },
  { id: "SA-6", rfqNumber: "RFQ-2024-006", title: "Consultant Fees - Stakeholder Engagement", supplier: "Ghana Research Associates", projectName: "Youth Employment Skills Development", sourcePR: "PR-2024-010", estimatedValue: 5600, dateSubmitted: "2025-02-06", approvalStatus: "Pending" },
  { id: "SA-7", rfqNumber: "RFQ-2024-010", title: "Chromebooks for Computer Labs", supplier: "Acer Distributors", projectName: "Digital Literacy Initiative", sourcePR: "PR-2024-014", estimatedValue: 14000, dateSubmitted: "2025-01-26", approvalStatus: "Approved" },
  { id: "SA-8", rfqNumber: "RFQ-2024-008", title: "Laptops (50x Dell Latitude)", supplier: "Dell Inc. (via Telefonika Ghana)", projectName: "Youth Employment Skills Development", sourcePR: "PR-2024-012", estimatedValue: 47500, dateSubmitted: "2025-02-16", approvalStatus: "Pending" },
  { id: "SA-9", rfqNumber: "RFQ-2024-011", title: "Medical Supplies Kit", supplier: "MedSupply GH", projectName: "Community Health Project", sourcePR: "PR-2024-015", estimatedValue: 12000, dateSubmitted: "2025-01-31", approvalStatus: "Pending" },
];

// POs auto-generated from approved sourcing (these are the "seed" POs that already existed)
let generatedPOs: GeneratedPO[] = [
  { id: "GPO-1", poNumber: "PO-2024-156", supplier: "Dr. Kwesi Appiah", itemDescription: "Consultant Fees - Survey Design", orderDate: "2024-12-20", deliveryDate: "2025-02-28", amount: 8000, sourcePR: "PR-2024-001", projectName: "Youth Employment Skills Development", sourceRFQ: "RFQ-2024-001" },
  { id: "GPO-2", poNumber: "PO-2024-157", supplier: "PrintWorks Ghana Ltd", itemDescription: "Printing & Materials (200 units)", orderDate: "2024-12-18", deliveryDate: "2025-01-30", amount: 1050, sourcePR: "PR-2024-001", projectName: "Youth Employment Skills Development", sourceRFQ: "RFQ-2024-002" },
  { id: "GPO-3", poNumber: "PO-2024-158", supplier: "La Palm Royal Beach Hotel", itemDescription: "Stakeholder Workshop Venue & Catering", orderDate: "2024-12-22", deliveryDate: "2025-02-15", amount: 3500, sourcePR: "PR-2024-001", projectName: "Youth Employment Skills Development", sourceRFQ: "RFQ-2024-003" },
  { id: "GPO-4", poNumber: "PO-2024-159", supplier: "Prof. Ama Benyiwa", itemDescription: "External Reviewer Honoraria", orderDate: "2024-12-28", deliveryDate: "2025-03-15", amount: 4000, sourcePR: "PR-2024-003", projectName: "Youth Employment Skills Development", sourceRFQ: "RFQ-2024-004" },
  { id: "GPO-5", poNumber: "PO-2024-160", supplier: "University of Ghana", itemDescription: "Research Assistant Stipends (3 assistants)", orderDate: "2025-01-02", deliveryDate: "2025-04-01", amount: 6000, sourcePR: "PR-2024-004", projectName: "Youth Employment Skills Development", sourceRFQ: "RFQ-2024-005" },
  { id: "GPO-6", poNumber: "PO-2024-163", supplier: "Acer Distributors", itemDescription: "Chromebooks for Computer Labs (40 units)", orderDate: "2025-01-28", deliveryDate: "2025-02-20", amount: 14000, sourcePR: "PR-2024-014", projectName: "Digital Literacy Initiative", sourceRFQ: "RFQ-2024-010" },
];

let nextPONumber = 165;

function notifyListeners() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function getSourcingApprovals() {
  return sourcingApprovals;
}

export function getGeneratedPOs() {
  return generatedPOs;
}

export function approveSourcing(id: string) {
  const item = sourcingApprovals.find((sa) => sa.id === id);
  if (!item || item.approvalStatus !== "Pending") return;

  // Update approval status
  sourcingApprovals = sourcingApprovals.map((sa) =>
    sa.id === id ? { ...sa, approvalStatus: "Approved" as const } : sa
  );

  // Auto-generate a PO
  nextPONumber++;
  const today = new Date().toISOString().split("T")[0];
  const deliveryDate = new Date();
  deliveryDate.setMonth(deliveryDate.getMonth() + 3);

  const newPO: GeneratedPO = {
    id: `GPO-${Date.now()}`,
    poNumber: `PO-2024-${nextPONumber}`,
    supplier: item.supplier,
    itemDescription: item.title,
    orderDate: today,
    deliveryDate: deliveryDate.toISOString().split("T")[0],
    amount: item.estimatedValue,
    sourcePR: item.sourcePR,
    projectName: item.projectName,
    sourceRFQ: item.rfqNumber,
  };

  generatedPOs = [...generatedPOs, newPO];
  notifyListeners();
}

export function rejectSourcing(id: string) {
  sourcingApprovals = sourcingApprovals.map((sa) =>
    sa.id === id ? { ...sa, approvalStatus: "Rejected" as const } : sa
  );
  notifyListeners();
}

// ─── Auto-generated Purchase Requisitions from ESS Procurement Plan ──────────

let generatedPRs: GeneratedPR[] = [
  // Seed data at various approval stages
  {
    id: "GPR-SEED-1", requisitionNumber: "PR-2026-081", requestedBy: "Ama Darko", department: "Programs",
    itemDescription: "Training Materials — Stakeholder Engagement Workshop", quantity: 500, estimatedCost: 4500,
    priority: "Medium", status: "Pending Dept Approval", dateRequested: "2026-03-01", purchaseType: "Competitive Bidding",
    sourcePlanId: "plan-1", sourcePlanItemId: "item-s1", category: "Goods", unit: "sets",
    currentStep: 2, overallApprovalStatus: "Pending Dept Approval", deptApproval: "Pending",
    procurementApproval: "N/A", financeApproval: "N/A", seniorMgmtApproval: "N/A",
    requiresSeniorApproval: false,
    approvalHistory: [{ step: 1, role: "Requesting Officer", action: "Submitted", date: "2026-03-01", comments: "Submitted from ESS Procurement Plan" }],
    sourceType: "ESS Plan",
    requisitionTitle: "Stakeholder Engagement Workshop Materials",
    entityType: "Firm",
    fundingSource: "TAP",
    deliveryTimeline: "4 weeks",
    linkedPlanItemId: "PP-2026-001",
    daysInCurrentStage: 14,
    currentResponsible: "Dept Head — Programs",
  },
  {
    id: "GPR-SEED-2", requisitionNumber: "PR-2026-082", requestedBy: "Kwame Boateng", department: "IT",
    itemDescription: "Laptops for Field Officers (20x HP ProBook)", quantity: 20, estimatedCost: 24000,
    priority: "High", status: "Pending Dept Approval", dateRequested: "2026-03-03", purchaseType: "Competitive Bidding",
    sourcePlanId: "plan-1", sourcePlanItemId: "item-s2", category: "Goods", unit: "units",
    currentStep: 2, overallApprovalStatus: "Pending Dept Approval", deptApproval: "Pending",
    procurementApproval: "N/A", financeApproval: "N/A", seniorMgmtApproval: "N/A",
    requiresSeniorApproval: true,
    approvalHistory: [{ step: 1, role: "Requesting Officer", action: "Submitted", date: "2026-03-03", comments: "Submitted from ESS Procurement Plan" }],
    sourceType: "ESS Plan",
    requisitionTitle: "Field Officer Laptops — Youth Employment Program",
    entityType: "Firm",
    fundingSource: "ATTP",
    deliveryTimeline: "6 weeks",
    linkedPlanItemId: "PP-2026-002",
    daysInCurrentStage: 11,
    currentResponsible: "Dept Head — IT",
  },
  {
    id: "GPR-SEED-3", requisitionNumber: "PR-2026-083", requestedBy: "Grace Owusu", department: "Programs",
    itemDescription: "External Consultant — M&E Framework Review", quantity: 1, estimatedCost: 15000,
    priority: "High", status: "Pending Procurement & Finance", dateRequested: "2026-02-20", purchaseType: "Single Source",
    sourcePlanId: "plan-1", sourcePlanItemId: "item-s3", category: "Consultancy", unit: "engagement",
    currentStep: 3, overallApprovalStatus: "Pending Procurement & Finance", deptApproval: "Approved",
    procurementApproval: "Pending", financeApproval: "Pending", seniorMgmtApproval: "N/A",
    requiresSeniorApproval: true,
    approvalHistory: [
      { step: 1, role: "Requesting Officer", action: "Submitted", date: "2026-02-20", comments: "Submitted from ESS Procurement Plan" },
      { step: 2, role: "Department Head", action: "Approved", date: "2026-02-22", comments: "Approved — critical for project reporting" },
    ],
    sourceType: "ESS Plan",
    requisitionTitle: "M&E Framework Review Consultancy",
    entityType: "Individual",
    fundingSource: "Gates Foundation",
    serviceStartDate: "2026-04-01",
    serviceEndDate: "2026-06-30",
    directSelectionJustification: "Specialist expertise required — limited pool of qualified M&E consultants with ACET project experience",
    shortlistedEntities: [
      { name: "Dr. Ama Serwaa", address: "P.O. Box 1234, Accra", email: "ama.serwaa@consultant.gh" },
      { name: "Kofi Mensah Consulting", address: "12 Independence Ave, Accra", email: "kofi@kmconsult.gh" },
    ],
    attachments: ["TOR_ME_Framework_Review.pdf", "Budget_Breakdown.xlsx"],
    linkedPlanItemId: "PP-2026-003",
    daysInCurrentStage: 8,
    currentResponsible: "Procurement Unit",
  },
  {
    id: "GPR-SEED-4", requisitionNumber: "PR-2026-084", requestedBy: "Yaw Mensah", department: "Operations",
    itemDescription: "Office Furniture — Standing Desks (10x)", quantity: 10, estimatedCost: 8500,
    priority: "Medium", status: "Pending Procurement & Finance", dateRequested: "2026-02-18", purchaseType: "Competitive Bidding",
    sourcePlanId: "plan-1", sourcePlanItemId: "item-s4", category: "Goods", unit: "units",
    currentStep: 3, overallApprovalStatus: "Pending Procurement & Finance", deptApproval: "Approved",
    procurementApproval: "Approved", financeApproval: "Pending", seniorMgmtApproval: "N/A",
    requiresSeniorApproval: false,
    approvalHistory: [
      { step: 1, role: "Requesting Officer", action: "Submitted", date: "2026-02-18", comments: "Submitted from ESS Procurement Plan" },
      { step: 2, role: "Department Head", action: "Approved", date: "2026-02-19", comments: "Approved" },
      { step: 3, role: "Procurement Unit", action: "Approved", date: "2026-02-21", comments: "Aligned with annual procurement plan" },
    ],
    sourceType: "ESS Plan",
    requisitionTitle: "Standing Desks for Operations Team",
    entityType: "Firm",
    fundingSource: "ATTP",
    deliveryTimeline: "3 weeks",
    linkedPlanItemId: "PP-2026-004",
    daysInCurrentStage: 5,
    currentResponsible: "Finance Team",
  },
  {
    id: "GPR-SEED-5", requisitionNumber: "PR-2026-085", requestedBy: "Abena Osei", department: "Finance",
    itemDescription: "Audit Software License Renewal", quantity: 1, estimatedCost: 12000,
    priority: "High", status: "Pending Senior Mgmt", dateRequested: "2026-02-10", purchaseType: "Direct Purchase",
    sourcePlanId: "plan-1", sourcePlanItemId: "item-s5", category: "Services", unit: "license",
    currentStep: 5, overallApprovalStatus: "Pending Senior Mgmt", deptApproval: "Approved",
    procurementApproval: "Approved", financeApproval: "Approved", seniorMgmtApproval: "Pending",
    requiresSeniorApproval: true,
    approvalHistory: [
      { step: 1, role: "Requesting Officer", action: "Submitted", date: "2026-02-10", comments: "Submitted from ESS Procurement Plan" },
      { step: 2, role: "Department Head", action: "Approved", date: "2026-02-11", comments: "Essential for audit compliance" },
      { step: 3, role: "Procurement Unit", action: "Approved", date: "2026-02-13", comments: "Sole distributor — direct purchase justified" },
      { step: 4, role: "Finance Team", action: "Approved", date: "2026-02-13", comments: "Budget available under IT line item" },
    ],
    sourceType: "ESS Plan",
    requisitionTitle: "Audit Software License — Annual Renewal",
    entityType: "Firm",
    fundingSource: "TAP",
    serviceStartDate: "2026-04-01",
    serviceEndDate: "2027-03-31",
    directSelectionJustification: "Sole distributor for TeamMate+ audit software in West Africa",
    linkedPlanItemId: "PP-2026-005",
    daysInCurrentStage: 3,
    currentResponsible: "Senior Management",
  },
  {
    id: "GPR-SEED-6", requisitionNumber: "PR-2026-086", requestedBy: "Nana Yaw", department: "Programs",
    itemDescription: "Printing Services — Annual Report 2025", quantity: 1000, estimatedCost: 3200,
    priority: "Medium", status: "Approved", dateRequested: "2026-01-25", purchaseType: "Request for Quotation",
    sourcePlanId: "plan-1", sourcePlanItemId: "item-s6", category: "Services", unit: "copies",
    currentStep: 5, overallApprovalStatus: "Approved", deptApproval: "Approved",
    procurementApproval: "Approved", financeApproval: "Approved", seniorMgmtApproval: "N/A",
    requiresSeniorApproval: false,
    approvalHistory: [
      { step: 1, role: "Requesting Officer", action: "Submitted", date: "2026-01-25", comments: "Submitted from ESS Procurement Plan" },
      { step: 2, role: "Department Head", action: "Approved", date: "2026-01-26", comments: "Approved" },
      { step: 3, role: "Procurement Unit", action: "Approved", date: "2026-01-28", comments: "Verified" },
      { step: 4, role: "Finance Team", action: "Approved", date: "2026-01-28", comments: "Budget confirmed" },
    ],
    sourceType: "ESS Plan",
    requisitionTitle: "Annual Report 2025 Printing",
    entityType: "Firm",
    fundingSource: "TAP",
    deliveryTimeline: "2 weeks",
    linkedPlanItemId: "PP-2026-006",
    currentResponsible: "Procurement Unit",
  },
  {
    id: "GPR-SEED-7", requisitionNumber: "PR-2026-087", requestedBy: "Kwaku Anane", department: "Programs",
    itemDescription: "Vehicle Rental — Community Outreach Campaign", quantity: 3, estimatedCost: 6000,
    priority: "Medium", status: "Rejected", dateRequested: "2026-02-05", purchaseType: "Request for Quotation",
    sourcePlanId: "plan-1", sourcePlanItemId: "item-s7", category: "Services", unit: "vehicles",
    currentStep: 2, overallApprovalStatus: "Rejected", deptApproval: "Rejected",
    procurementApproval: "N/A", financeApproval: "N/A", seniorMgmtApproval: "N/A",
    requiresSeniorApproval: false,
    approvalHistory: [
      { step: 1, role: "Requesting Officer", action: "Submitted", date: "2026-02-05", comments: "Submitted from ESS Procurement Plan" },
      { step: 2, role: "Department Head", action: "Rejected", date: "2026-02-06", comments: "Use existing fleet vehicles instead" },
    ],
    sourceType: "ESS Plan",
    requisitionTitle: "Vehicle Rental — Community Outreach",
    entityType: "Firm",
    fundingSource: "ATTP",
    serviceStartDate: "2026-03-01",
    serviceEndDate: "2026-03-15",
    linkedPlanItemId: "PP-2026-007",
  },
];
let nextPRNumber = 100;

export function getGeneratedPRs() {
  return generatedPRs;
}

export function createRequisitionFromPlan(opts: {
  planId: string;
  itemId: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  targetDate: string;
  requestedBy: string;
  department: string;
  // Enhanced optional fields
  requisitionTitle?: string;
  entityType?: "Individual" | "Firm";
  fundingSource?: string;
  deliveryTimeline?: string;
  serviceStartDate?: string;
  serviceEndDate?: string;
  directSelectionJustification?: string;
  shortlistedEntities?: { name: string; address: string; email: string }[];
  attachments?: string[];
  linkedPlanItemId?: string;
  attachmentFiles?: { name: string; url: string; type: string; size: string; label: string }[];
}) {
  nextPRNumber++;
  const today = new Date().toISOString().split("T")[0];

  // The plan item's own method wins where it exists; otherwise the value
  // thresholds decide, rather than a fixed category→method table.
  const planItem = opts.linkedPlanItemId
    ? procurementPlanItems.find((p) => p.ppItemId === opts.linkedPlanItemId)
    : undefined;
  const resolvedMethod = canonicalMethod(planItem?.procurementMethod) ??
    suggestProcurementMethod(opts.estimatedCost);

  const newPR: GeneratedPR = {
    id: `GPR-${Date.now()}-${nextPRNumber}`,
    requisitionNumber: `PR-${new Date().getFullYear()}-${String(nextPRNumber).padStart(3, "0")}`,
    requestedBy: opts.requestedBy,
    department: opts.department,
    itemDescription: opts.description,
    quantity: opts.quantity,
    estimatedCost: opts.estimatedCost,
    priority: opts.estimatedCost >= 30000 ? "Urgent" : opts.estimatedCost >= 10000 ? "High" : "Medium",
    status: "Pending Dept Approval",
    dateRequested: today,
    purchaseType: resolvedMethod,
    sourcePlanId: opts.planId,
    sourcePlanItemId: opts.itemId,
    category: opts.category,
    unit: opts.unit,
    // Approval workflow
    currentStep: 2,
    overallApprovalStatus: "Pending Dept Approval",
    deptApproval: "Pending",
    procurementApproval: "N/A",
    financeApproval: "N/A",
    seniorMgmtApproval: "N/A",
    requiresSeniorApproval: opts.estimatedCost > SENIOR_APPROVAL_THRESHOLD,
    approvalHistory: [{ step: 1, role: "Requesting Officer", action: "Submitted" as const, date: today, comments: "Purchase requisition submitted from ESS Procurement Plan" }],
    sourceType: "ESS Plan",
    stageEnteredDate: today,
    resubmissionCount: 0,
    // Enhanced fields
    requisitionTitle: opts.requisitionTitle,
    entityType: opts.entityType,
    fundingSource: opts.fundingSource,
    deliveryTimeline: opts.deliveryTimeline,
    serviceStartDate: opts.serviceStartDate,
    serviceEndDate: opts.serviceEndDate,
    directSelectionJustification: opts.directSelectionJustification,
    shortlistedEntities: opts.shortlistedEntities,
    attachments: opts.attachments,
    linkedPlanItemId: opts.linkedPlanItemId,
    daysInCurrentStage: 0,
    currentResponsible: "Department Head",
    attachmentFiles: opts.attachmentFiles,
  };

  const variance = checkPlanVariance(newPR);
  if (variance.flagged) newPR.planVarianceFlag = variance.message;

  generatedPRs = [...generatedPRs, newPR];
  notifyStage(newPR, "Pending Dept Approval", variance.flagged ? `⚠ ${variance.message}` : "");
  notifyListeners();
  return newPR;
}

// ─── PR Submission (Step 1 → Step 2) ─────────────────────────────────────────
/**
 * Runs the full validation gate before the requisition enters the workflow.
 * Returns the blocking issues rather than throwing, so the form can show them
 * against the offending fields.
 */
export function submitPRForApproval(
  prId: string,
  submittedBy?: string
): { ok: boolean; issues?: PRValidationIssue[]; error?: string } {
  const pr = generatedPRs.find(p => p.id === prId);
  if (!pr) return { ok: false, error: "Requisition not found." };

  const issues = validatePRForSubmission(pr);
  if (issues.length) return { ok: false, issues, error: "Resolve the validation errors before submitting." };

  const variance = checkPlanVariance(pr);
  const today = todayISO();

  generatedPRs = generatedPRs.map(p => {
    if (p.id !== prId) return p;
    return {
      ...advanceStage(p, "Pending Dept Approval"),
      currentStep: 2,
      deptApproval: "Pending" as const,
      requiresSeniorApproval: p.estimatedCost > SENIOR_APPROVAL_THRESHOLD,
      planVarianceFlag: variance.flagged ? variance.message : undefined,
      approvalHistory: [
        ...p.approvalHistory,
        { step: 1, role: "Requesting Officer", action: "Submitted" as const, date: today, comments: `Submitted for department approval by ${submittedBy ?? p.requestedBy}` },
      ],
    };
  });

  const updated = generatedPRs.find(p => p.id === prId)!;
  notifyStage(updated, "Pending Dept Approval", variance.flagged ? `⚠ ${variance.message}` : "");
  notifyListeners();
  return { ok: true };
}

// ─── Department Head Approval (Step 2 → Step 3&4) ───────────────────────────
export function approvePRDept(prId: string, comments: string = "", approvedBy = "Department Head") {
  const today = todayISO();
  generatedPRs = generatedPRs.map(pr => {
    if (pr.id !== prId) return pr;
    return {
      ...advanceStage(pr, "Pending Procurement & Finance"),
      currentStep: 3,
      deptApproval: "Approved" as const,
      procurementApproval: "Pending" as const,
      financeApproval: "Pending" as const,
      approvalHistory: [...pr.approvalHistory, { step: 2, role: "Department Head", action: "Approved" as const, date: today, comments: comments || `Approved by ${approvedBy}` }],
    };
  });
  const updated = generatedPRs.find(p => p.id === prId);
  if (updated) {
    resolveReminder(updated.requisitionNumber, "Requisition");
    notifyStage(updated, "Pending Procurement & Finance");
  }
  notifyListeners();
}

/** Rejection requires a documented reason — the resubmission route depends on it. */
export function rejectPRDept(prId: string, comments: string = "", rejectedBy = "Department Head") {
  return rejectPRAtStage(prId, 2, "Department Head", rejectedBy, comments);
}

function rejectPRAtStage(
  prId: string,
  step: number,
  role: string,
  rejectedBy: string,
  comments: string
): { ok: boolean; error?: string } {
  if (!comments.trim()) {
    return { ok: false, error: "A documented reason is required when rejecting a requisition." };
  }
  const today = todayISO();
  const stageField: Record<number, keyof GeneratedPR> = {
    2: "deptApproval", 3: "procurementApproval", 4: "financeApproval", 5: "seniorMgmtApproval",
  };

  let target: GeneratedPR | undefined;
  generatedPRs = generatedPRs.map(pr => {
    if (pr.id !== prId) return pr;
    target = {
      ...advanceStage(pr, "Rejected"),
      [stageField[step]]: "Rejected" as PRApprovalStepStatus,
      rejectionReason: comments,
      rejectedAtStage: role,
      approvalHistory: [...pr.approvalHistory, { step, role, action: "Rejected" as const, date: today, comments }],
    } as GeneratedPR;
    return target;
  });

  if (!target) return { ok: false, error: "Requisition not found." };

  resolveReminder(target.requisitionNumber, "Requisition");
  resolveReminder(`${target.requisitionNumber}-FIN`, "Requisition");
  notify({
    category: "Alert",
    module: "Requisitions",
    subject: `${target.requisitionNumber} rejected at ${role}`,
    body: `${rejectedBy} rejected "${target.requisitionTitle || target.itemDescription}".\n\nReason: ${comments}\n\nCorrect the issues identified and resubmit — the requisition will re-enter the workflow at department approval.`,
    recipientName: target.requestedBy,
    recipientRole: "Requestor",
    entityRef: target.requisitionNumber,
    channels: ["In-App", "Email", "SMS"],
    priority: "High",
  });
  notifyListeners();
  return { ok: true };
}

// ─── Procurement Unit Approval (Step 3 — parallel with Finance) ─────────────
export function approvePRProcurement(prId: string, comments: string = "", approvedBy = "Procurement Unit") {
  const today = todayISO();
  generatedPRs = generatedPRs.map(pr => {
    if (pr.id !== prId) return pr;
    let updated: GeneratedPR = {
      ...pr,
      procurementApproval: "Approved" as const,
      approvalHistory: [...pr.approvalHistory, { step: 3, role: "Procurement Unit", action: "Approved" as const, date: today, comments: comments || `Policy and plan alignment verified by ${approvedBy}` }],
    };
    // Advance only once the parallel Finance review has also cleared.
    if (updated.financeApproval === "Approved") {
      updated = { ...advanceStage(updated, updated.requiresSeniorApproval ? "Pending Senior Mgmt" : "Approved"), currentStep: 5 };
      if (updated.requiresSeniorApproval) updated.seniorMgmtApproval = "Pending";
    }
    return updated;
  });
  handleParallelAdvance(prId);
  notifyListeners();
}

export function rejectPRProcurement(prId: string, comments: string = "", rejectedBy = "Procurement Unit") {
  return rejectPRAtStage(prId, 3, "Procurement Unit", rejectedBy, comments);
}

/** Fires the next stage's notifications once both parallel reviews have landed. */
function handleParallelAdvance(prId: string) {
  const pr = generatedPRs.find(p => p.id === prId);
  if (!pr) return;
  if (pr.procurementApproval !== "Approved" || pr.financeApproval !== "Approved") return;

  resolveReminder(pr.requisitionNumber, "Requisition");
  resolveReminder(`${pr.requisitionNumber}-FIN`, "Requisition");

  if (pr.overallApprovalStatus === "Pending Senior Mgmt") {
    notifyStage(
      pr,
      "Pending Senior Mgmt",
      `Value of $${pr.estimatedCost.toLocaleString()} exceeds the $${SENIOR_APPROVAL_THRESHOLD.toLocaleString()} threshold, so final approval rests with Senior Management.`
    );
  } else if (pr.overallApprovalStatus === "Approved") {
    notifyApproved(pr);
  }
}

function notifyApproved(pr: GeneratedPR) {
  notify({
    category: "Info",
    module: "Requisitions",
    subject: `${pr.requisitionNumber} approved`,
    body: `"${pr.requisitionTitle || pr.itemDescription}" ($${pr.estimatedCost.toLocaleString()}) has completed the approval workflow. Procurement will initiate a ${canonicalMethod(pr.purchaseType)} sourcing case.`,
    recipientName: pr.requestedBy,
    recipientRole: "Requestor",
    entityRef: pr.requisitionNumber,
  });
  notify({
    category: "Approval",
    module: "Requisitions",
    subject: `${pr.requisitionNumber} ready for sourcing initiation`,
    body: `The requisition is fully approved. Initiate a ${canonicalMethod(pr.purchaseType)} sourcing case for ${pr.category}.`,
    recipientRole: "Procurement",
    entityRef: pr.requisitionNumber,
  });
}

// ─── Finance Team Approval (Step 4 — parallel with Procurement) ─────────────
export function approvePRFinance(prId: string, comments: string = "", approvedBy = "Finance Team") {
  const today = todayISO();
  generatedPRs = generatedPRs.map(pr => {
    if (pr.id !== prId) return pr;
    let updated: GeneratedPR = {
      ...pr,
      financeApproval: "Approved" as const,
      approvalHistory: [...pr.approvalHistory, { step: 4, role: "Finance Team", action: "Approved" as const, date: today, comments: comments || `Budget availability and funding source verified by ${approvedBy}` }],
    };
    if (updated.procurementApproval === "Approved") {
      updated = { ...advanceStage(updated, updated.requiresSeniorApproval ? "Pending Senior Mgmt" : "Approved"), currentStep: 5 };
      if (updated.requiresSeniorApproval) updated.seniorMgmtApproval = "Pending";
    }
    return updated;
  });
  handleParallelAdvance(prId);
  notifyListeners();
}

export function rejectPRFinance(prId: string, comments: string = "", rejectedBy = "Finance Team") {
  return rejectPRAtStage(prId, 4, "Finance Team", rejectedBy, comments);
}

// ─── Senior Management Approval (Step 5 — only if > $10,000) ────────────────
export function approvePRSeniorMgmt(prId: string, comments: string = "", approvedBy = "Senior Management") {
  const today = todayISO();
  generatedPRs = generatedPRs.map(pr => {
    if (pr.id !== prId) return pr;
    return {
      ...advanceStage(pr, "Approved"),
      currentStep: 5,
      seniorMgmtApproval: "Approved" as const,
      approvalHistory: [...pr.approvalHistory, { step: 5, role: "Senior Management", action: "Approved" as const, date: today, comments: comments || `Final approval granted by ${approvedBy}` }],
    };
  });
  const updated = generatedPRs.find(p => p.id === prId);
  if (updated) {
    resolveReminder(updated.requisitionNumber, "Requisition");
    notifyApproved(updated);
  }
  notifyListeners();
}

export function rejectPRSeniorMgmt(prId: string, comments: string = "", rejectedBy = "Senior Management") {
  return rejectPRAtStage(prId, 5, "Senior Management", rejectedBy, comments);
}

// ─── PO Generation from Sourcing Flow ────────────────────────────────────────

export interface POGenerationInput {
  sourcePR: string;
  sourceSourcingCase: string;
  supplier: string;
  supplierEmail: string;
  supplierAddress: string;
  itemDescription: string;
  lineItems: POLineItem[];
  totalAmount: number;
  projectName: string;
  category: string;
  method: string;
  department: string;
  requestedBy: string;
  deliveryDate: string;
  deliveryInstructions: string;
  warrantyTerms: string;
  paymentTerms: string;
  shippingMethod: string;
  contractNumber?: string;
}

export function generatePOFromSourcing(input: POGenerationInput): GeneratedPO {
  nextPONumber++;
  const today = new Date().toISOString().split("T")[0];
  const poNumber = `PO-2026-${String(nextPONumber).padStart(3, "0")}`;

  const newPO: GeneratedPO = {
    id: `GPO-${Date.now()}`,
    poNumber,
    supplier: input.supplier,
    supplierEmail: input.supplierEmail,
    supplierAddress: input.supplierAddress,
    itemDescription: input.itemDescription,
    orderDate: today,
    deliveryDate: input.deliveryDate,
    amount: input.totalAmount,
    sourcePR: input.sourcePR,
    projectName: input.projectName,
    sourceRFQ: input.sourceSourcingCase,
    status: "Draft",
    lineItems: input.lineItems,
    deliveryInstructions: input.deliveryInstructions,
    warrantyTerms: input.warrantyTerms,
    paymentTerms: input.paymentTerms,
    shippingMethod: input.shippingMethod,
    sourceSourcingCase: input.sourceSourcingCase,
    category: input.category,
    method: input.method,
    department: input.department,
    requestedBy: input.requestedBy,
    contractNumber: input.contractNumber,
  };

  generatedPOs = [...generatedPOs, newPO];
  notifyListeners();
  return newPO;
}

export function submitPOForSignature(poId: string): void {
  generatedPOs = generatedPOs.map(po => {
    if (po.id !== poId) return po;
    const authority = po.amount >= 10000 ? "COO" : "Procurement Head";
    return { ...po, status: "Pending Signature" as POStatus, signatureAuthority: authority };
  });
  notifyListeners();
}

export function signPO(poId: string, signedBy: string, signatureDataUrl: string): void {
  const now = new Date().toISOString();
  generatedPOs = generatedPOs.map(po => {
    if (po.id !== poId) return po;
    return { ...po, status: "Signed" as POStatus, signedBy, signedAt: now, signatureDataUrl };
  });
  notifyListeners();
}

export function dispatchPO(poId: string): void {
  const now = new Date().toISOString();
  generatedPOs = generatedPOs.map(po => {
    if (po.id !== poId) return po;
    return { ...po, status: "Dispatched" as POStatus, dispatchedAt: now, supplierNotifiedAt: now };
  });
  notifyListeners();
}

export function getPOByNumber(poNumber: string): GeneratedPO | undefined {
  return generatedPOs.find(po => po.poNumber === poNumber);
}

export function getNextPONumber(): string {
  return `PO-2026-${String(nextPONumber + 1).padStart(3, "0")}`;
}

// ─── Procurement Plan Management ────────────────────────────────────────────

export interface PlanItemChange {
  id: string;
  date: string;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  approvedBy?: string;
}

export type PlanType = "Departmental" | "Project";

/** Projects that can own a procurement plan. */
export const PLAN_PROJECTS = [
  "Youth Employment Skills Development",
  "Digital Literacy Initiative",
  "Community Health Project",
  "Clean Water Access Program",
] as const;

export interface ProcurementPlanItem {
  id: string;
  ppItemId: string; // auto-generated e.g. PP-2026-001
  activityDescription: string;
  category: "Goods" | "Services" | "Works" | "Consultancy";
  estimatedValue: number;
  fundingSource: string;
  procurementMethod: string;
  initiationDate: string;
  awardDate: string;
  completionDate: string;
  responsiblePerson: string;
  department: string;
  /**
   * Departmental plans are the annual plans each department submits; project
   * plans belong to an approved project. They are reviewed against different
   * budgets by different people, so each has its own approval queue.
   */
  planType: PlanType;
  /** Set on project plan items — the project whose plan the activity belongs to. */
  projectName?: string;
  status: "Not Started" | "In Progress" | "Under Evaluation" | "Awarded" | "Contracted" | "Completed" | "Delayed";
  linkedBudgetLine?: string;
  linkedWorkPlan?: string;
  /**
   * "For an entry to be accepted, it should have been reviewed by procurement
   * and finance for compliance before appearing on portal" — hence two review
   * stations rather than a single Approved flag.
   */
  approvalStatus: PlanApprovalStatus;
  procurementReview?: PRApprovalStepStatus;
  procurementReviewedBy?: string;
  financeReview?: PRApprovalStepStatus;
  financeReviewedBy?: string;
  rejectionReason?: string;
  submittedBy?: string;
  submittedDate?: string;
  /** Recorded when Procurement overrides the threshold-suggested method. */
  methodDeviationJustification?: string;
  /** Pending amendment awaiting approval, so edits are not applied silently. */
  pendingChange?: PendingPlanChange;
  version: number;
  changeHistory: PlanItemChange[];
  createdDate: string;
  lastModified: string;
}

export type PlanApprovalStatus =
  | "Draft"
  | "Pending Procurement Review"
  | "Pending Finance Review"
  | "Approved"
  | "Rejected";

/** A requested amendment held until it clears review. */
export interface PendingPlanChange {
  id: string;
  requestedBy: string;
  requestedDate: string;
  reason: string;
  updates: Partial<ProcurementPlanItem>;
  status: "Pending Procurement Review" | "Pending Finance Review";
  procurementApprovedBy?: string;
}

let nextPlanItemSeq = 17; // seed uses 1–16

let procurementPlanItems: ProcurementPlanItem[] = [
  {
    id: "ppi-1", ppItemId: "PP-2026-001",
    activityDescription: "Training Materials — Stakeholder Engagement Workshops (Youth Employment)",
    category: "Goods", estimatedValue: 4500, fundingSource: "TAP",
    procurementMethod: "Competitive Bidding", initiationDate: "2026-02-15", awardDate: "2026-04-01", completionDate: "2026-05-15",
    responsiblePerson: "Ama Darko", department: "Programs",
    planType: "Project", projectName: "Youth Employment Skills Development",
    status: "In Progress", linkedBudgetLine: "BL-PROG-001", linkedWorkPlan: "WP-YE-2026",
    approvalStatus: "Approved", version: 1, changeHistory: [], createdDate: "2026-01-10", lastModified: "2026-02-15",
  },
  {
    id: "ppi-2", ppItemId: "PP-2026-002",
    activityDescription: "Laptops for Field Officers — Youth Employment Skills Development",
    category: "Goods", estimatedValue: 24000, fundingSource: "ATTP",
    procurementMethod: "Competitive Bidding", initiationDate: "2026-02-20", awardDate: "2026-04-15", completionDate: "2026-06-01",
    responsiblePerson: "Kwame Boateng", department: "IT",
    planType: "Project", projectName: "Youth Employment Skills Development",
    status: "In Progress", linkedBudgetLine: "BL-IT-003", linkedWorkPlan: "WP-YE-2026",
    approvalStatus: "Approved", version: 1, changeHistory: [], createdDate: "2026-01-10", lastModified: "2026-02-20",
  },
  {
    id: "ppi-3", ppItemId: "PP-2026-003",
    activityDescription: "M&E Framework Review Consultancy — Youth Employment Program",
    category: "Consultancy", estimatedValue: 15000, fundingSource: "Gates Foundation",
    procurementMethod: "Single Source", initiationDate: "2026-02-01", awardDate: "2026-03-15", completionDate: "2026-06-30",
    responsiblePerson: "Grace Owusu", department: "Programs",
    planType: "Project", projectName: "Youth Employment Skills Development",
    status: "Under Evaluation", linkedBudgetLine: "BL-PROG-004", linkedWorkPlan: "WP-YE-2026",
    approvalStatus: "Approved", version: 2,
    changeHistory: [
      { id: "ch-1", date: "2026-02-10", field: "estimatedValue", oldValue: "12000", newValue: "15000", changedBy: "Grace Owusu", approvedBy: "Director Programs" },
    ],
    createdDate: "2026-01-10", lastModified: "2026-02-10",
  },
  {
    id: "ppi-4", ppItemId: "PP-2026-004",
    activityDescription: "Office Furniture — Standing Desks for Operations",
    category: "Goods", estimatedValue: 8500, fundingSource: "ATTP",
    procurementMethod: "Competitive Bidding", initiationDate: "2026-02-10", awardDate: "2026-03-20", completionDate: "2026-04-15",
    responsiblePerson: "Yaw Mensah", department: "Operations",
    planType: "Departmental",
    status: "Awarded", linkedBudgetLine: "BL-OPS-002",
    approvalStatus: "Approved", version: 1, changeHistory: [], createdDate: "2026-01-10", lastModified: "2026-03-20",
  },
  {
    id: "ppi-5", ppItemId: "PP-2026-005",
    activityDescription: "Audit Software License Renewal (TeamMate+)",
    category: "Services", estimatedValue: 12000, fundingSource: "TAP",
    procurementMethod: "Direct Purchase", initiationDate: "2026-01-15", awardDate: "2026-03-01", completionDate: "2026-03-31",
    responsiblePerson: "Abena Osei", department: "Finance",
    planType: "Departmental",
    status: "Contracted", linkedBudgetLine: "BL-FIN-001", linkedWorkPlan: "WP-ADMIN-2026",
    approvalStatus: "Approved", version: 1, changeHistory: [], createdDate: "2026-01-05", lastModified: "2026-03-01",
  },
  {
    id: "ppi-6", ppItemId: "PP-2026-006",
    activityDescription: "Printing Services — Annual Report 2025",
    category: "Services", estimatedValue: 3200, fundingSource: "TAP",
    procurementMethod: "Request for Quotation", initiationDate: "2026-01-10", awardDate: "2026-02-15", completionDate: "2026-03-15",
    responsiblePerson: "Nana Yaw", department: "Programs",
    planType: "Departmental",
    status: "Completed", linkedBudgetLine: "BL-PROG-005",
    approvalStatus: "Approved", version: 1, changeHistory: [], createdDate: "2026-01-05", lastModified: "2026-03-15",
  },
  {
    id: "ppi-7", ppItemId: "PP-2026-007",
    activityDescription: "Vehicle Rental — Community Outreach Campaign (Digital Literacy)",
    category: "Services", estimatedValue: 6000, fundingSource: "ATTP",
    procurementMethod: "Request for Quotation", initiationDate: "2026-02-01", awardDate: "2026-02-28", completionDate: "2026-03-31",
    responsiblePerson: "Kwaku Anane", department: "Programs",
    planType: "Project", projectName: "Digital Literacy Initiative",
    status: "Not Started", linkedBudgetLine: "BL-PROG-006", linkedWorkPlan: "WP-DL-2026",
    approvalStatus: "Approved", version: 1, changeHistory: [], createdDate: "2026-01-10", lastModified: "2026-01-10",
  },
  {
    id: "ppi-8", ppItemId: "PP-2026-008",
    activityDescription: "Chromebooks for Digital Literacy Computer Labs",
    category: "Goods", estimatedValue: 14000, fundingSource: "Gates Foundation",
    procurementMethod: "Competitive Bidding", initiationDate: "2026-01-20", awardDate: "2026-03-10", completionDate: "2026-04-30",
    responsiblePerson: "Kwame Boateng", department: "IT",
    planType: "Project", projectName: "Digital Literacy Initiative",
    status: "Awarded", linkedBudgetLine: "BL-IT-005", linkedWorkPlan: "WP-DL-2026",
    approvalStatus: "Approved", version: 1, changeHistory: [], createdDate: "2026-01-05", lastModified: "2026-03-10",
  },

  // ── Departmental plan entries still moving through review ──
  {
    id: "ppi-9", ppItemId: "PP-2026-009",
    activityDescription: "Office Internet & Connectivity Renewal",
    category: "Services", estimatedValue: 18000, fundingSource: "TAP",
    procurementMethod: "Request for Quotation", initiationDate: "2026-03-01", awardDate: "2026-04-10", completionDate: "2026-05-01",
    responsiblePerson: "Kwame Boateng", department: "IT",
    planType: "Departmental",
    status: "Not Started", linkedBudgetLine: "BL-IT-008",
    approvalStatus: "Pending Procurement Review", submittedBy: "Kwame Boateng", submittedDate: "2026-02-24",
    version: 1, changeHistory: [], createdDate: "2026-02-20", lastModified: "2026-02-24",
  },
  {
    id: "ppi-10", ppItemId: "PP-2026-010",
    activityDescription: "Staff Wellness Programme — Annual Provision",
    category: "Services", estimatedValue: 9500, fundingSource: "TAP",
    procurementMethod: "Request for Quotation", initiationDate: "2026-03-05", awardDate: "2026-04-20", completionDate: "2026-12-31",
    responsiblePerson: "Ama Serwaa", department: "HR",
    planType: "Departmental",
    status: "Not Started", linkedBudgetLine: "BL-HR-002",
    approvalStatus: "Pending Finance Review", submittedBy: "Ama Serwaa", submittedDate: "2026-02-20",
    procurementReview: "Approved", procurementReviewedBy: "Felix Addo",
    version: 1, changeHistory: [], createdDate: "2026-02-16", lastModified: "2026-02-26",
  },
  {
    id: "ppi-11", ppItemId: "PP-2026-011",
    activityDescription: "Legal Retainer — Corporate Advisory",
    category: "Services", estimatedValue: 22000, fundingSource: "ATTP",
    procurementMethod: "Limited Competition", initiationDate: "2026-04-01", awardDate: "2026-05-15", completionDate: "2027-03-31",
    responsiblePerson: "Yaw Mensah", department: "Operations",
    planType: "Departmental",
    status: "Not Started", linkedBudgetLine: "BL-OPS-007",
    approvalStatus: "Draft",
    version: 1, changeHistory: [], createdDate: "2026-03-02", lastModified: "2026-03-02",
  },
  {
    id: "ppi-12", ppItemId: "PP-2026-012",
    activityDescription: "Media Monitoring Subscription",
    category: "Services", estimatedValue: 6400, fundingSource: "TAP",
    procurementMethod: "Request for Quotation", initiationDate: "2026-03-10", awardDate: "2026-04-05", completionDate: "2027-03-31",
    responsiblePerson: "Nana Yaw", department: "Communications",
    planType: "Departmental",
    status: "Not Started", linkedBudgetLine: "BL-COM-003",
    approvalStatus: "Pending Procurement Review", submittedBy: "Nana Yaw", submittedDate: "2026-02-28",
    version: 1, changeHistory: [], createdDate: "2026-02-25", lastModified: "2026-02-28",
  },

  // ── Project plan entries still moving through review ──
  {
    id: "ppi-13", ppItemId: "PP-2026-013",
    activityDescription: "Cold Chain Equipment — Rural Clinics",
    category: "Goods", estimatedValue: 37500, fundingSource: "Gates Foundation",
    procurementMethod: "Limited Competition", initiationDate: "2026-03-15", awardDate: "2026-05-01", completionDate: "2026-06-30",
    responsiblePerson: "Yaw Mensah", department: "Programs",
    planType: "Project", projectName: "Community Health Project",
    status: "Not Started", linkedBudgetLine: "BL-PROG-011", linkedWorkPlan: "WP-CHP-2026",
    approvalStatus: "Pending Procurement Review", submittedBy: "Yaw Mensah", submittedDate: "2026-02-27",
    version: 1, changeHistory: [], createdDate: "2026-02-22", lastModified: "2026-02-27",
  },
  {
    id: "ppi-14", ppItemId: "PP-2026-014",
    activityDescription: "Health Worker Training Programme",
    category: "Services", estimatedValue: 48000, fundingSource: "Gates Foundation",
    procurementMethod: "Open Competition", initiationDate: "2026-04-01", awardDate: "2026-06-01", completionDate: "2026-08-15",
    responsiblePerson: "Grace Owusu", department: "Programs",
    planType: "Project", projectName: "Community Health Project",
    status: "Not Started", linkedBudgetLine: "BL-PROG-012", linkedWorkPlan: "WP-CHP-2026",
    approvalStatus: "Pending Finance Review", submittedBy: "Grace Owusu", submittedDate: "2026-02-18",
    procurementReview: "Approved", procurementReviewedBy: "Felix Addo",
    version: 1, changeHistory: [], createdDate: "2026-02-14", lastModified: "2026-02-25",
  },
  {
    id: "ppi-15", ppItemId: "PP-2026-015",
    activityDescription: "Computer Lab Furniture & Installation",
    category: "Works", estimatedValue: 48000, fundingSource: "Gates Foundation",
    procurementMethod: "Open Competition", initiationDate: "2026-04-10", awardDate: "2026-06-15", completionDate: "2026-08-30",
    responsiblePerson: "Kwame Boateng", department: "IT",
    planType: "Project", projectName: "Digital Literacy Initiative",
    status: "Not Started", linkedBudgetLine: "BL-IT-009", linkedWorkPlan: "WP-DL-2026",
    approvalStatus: "Draft",
    version: 1, changeHistory: [], createdDate: "2026-03-04", lastModified: "2026-03-04",
  },
  {
    id: "ppi-16", ppItemId: "PP-2026-016",
    activityDescription: "Baseline Survey Design Consultancy",
    category: "Consultancy", estimatedValue: 8000, fundingSource: "TAP",
    procurementMethod: "Request for Quotation", initiationDate: "2026-03-20", awardDate: "2026-05-10", completionDate: "2026-06-15",
    responsiblePerson: "Ama Darko", department: "Programs",
    planType: "Project", projectName: "Youth Employment Skills Development",
    status: "Not Started", linkedBudgetLine: "BL-PROG-013", linkedWorkPlan: "WP-YE-2026",
    approvalStatus: "Pending Procurement Review", submittedBy: "Ama Darko", submittedDate: "2026-03-01",
    version: 1, changeHistory: [], createdDate: "2026-02-26", lastModified: "2026-03-01",
  },
];

export function getProcurementPlanItems(): ProcurementPlanItem[] {
  return procurementPlanItems;
}

export function getPlanItemsByType(planType: PlanType): ProcurementPlanItem[] {
  return procurementPlanItems.filter((i) => i.planType === planType);
}

/**
 * The plan screens present a plan as a container of activities, while the store
 * holds one record per activity because that is the unit that gets approved.
 * A "plan" is therefore derived: departmental plans group by department, project
 * plans group by project — one per project, which is the rule the project plan
 * screen relies on.
 */
export interface PlanGroup {
  key: string;
  /** Department name, or project name for project plans. */
  owner: string;
  planType: PlanType;
  items: ProcurementPlanItem[];
  totalValue: number;
  /** Rolled up from the items, so it can never disagree with them. */
  status: "Draft" | "Under Review" | "Approved" | "Rejected" | "Mixed";
  draftCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  lastActivity: string;
  responsiblePeople: string[];
}

function rollUpStatus(items: ProcurementPlanItem[]): PlanGroup["status"] {
  if (items.length === 0) return "Draft";
  const every = (s: PlanApprovalStatus) => items.every((i) => i.approvalStatus === s);
  if (every("Draft")) return "Draft";
  if (every("Approved")) return "Approved";
  if (every("Rejected")) return "Rejected";
  if (items.some((i) => i.approvalStatus === "Pending Procurement Review" || i.approvalStatus === "Pending Finance Review")) {
    return "Under Review";
  }
  return "Mixed";
}

export function getPlanGroups(planType: PlanType): PlanGroup[] {
  const items = getPlanItemsByType(planType);
  const buckets = new Map<string, ProcurementPlanItem[]>();

  for (const item of items) {
    // A project item with no project recorded still has to appear somewhere.
    const owner = planType === "Project" ? item.projectName || "Unassigned project" : item.department;
    const existing = buckets.get(owner);
    if (existing) existing.push(item);
    else buckets.set(owner, [item]);
  }

  return [...buckets.entries()]
    .map(([owner, groupItems]) => ({
      key: `${planType}:${owner}`,
      owner,
      planType,
      items: groupItems,
      totalValue: groupItems.reduce((sum, i) => sum + i.estimatedValue, 0),
      status: rollUpStatus(groupItems),
      draftCount: groupItems.filter((i) => i.approvalStatus === "Draft").length,
      pendingCount: groupItems.filter(
        (i) => i.approvalStatus === "Pending Procurement Review" || i.approvalStatus === "Pending Finance Review"
      ).length,
      approvedCount: groupItems.filter((i) => i.approvalStatus === "Approved").length,
      rejectedCount: groupItems.filter((i) => i.approvalStatus === "Rejected").length,
      lastActivity: groupItems.reduce((latest, i) => (i.lastModified > latest ? i.lastModified : latest), ""),
      responsiblePeople: [...new Set(groupItems.map((i) => i.responsiblePerson))],
    }))
    .sort((a, b) => a.owner.localeCompare(b.owner));
}

/**
 * Submits every draft in a plan in one action, so a department does not have to
 * walk its own list item by item. Returns what actually moved.
 */
export function submitPlanGroupForReview(
  planType: PlanType,
  owner: string,
  submittedBy: string
): { submitted: number; blocked: { ppItemId: string; reason: string }[] } {
  const group = getPlanGroups(planType).find((g) => g.owner === owner);
  if (!group) return { submitted: 0, blocked: [] };

  let submitted = 0;
  const blocked: { ppItemId: string; reason: string }[] = [];

  for (const item of group.items.filter((i) => i.approvalStatus === "Draft")) {
    const result = submitPlanItemForReview(item.id, submittedBy);
    if (result) submitted++;
    else blocked.push({ ppItemId: item.ppItemId, reason: "The entry could not be submitted — check it is complete." });
  }

  return { submitted, blocked };
}

export function addProcurementPlanItem(
  item: Omit<ProcurementPlanItem, "id" | "ppItemId" | "version" | "changeHistory" | "createdDate" | "lastModified">
): ProcurementPlanItem {
  const today = new Date().toISOString().split("T")[0];
  const ppItemId = `PP-2026-${String(nextPlanItemSeq).padStart(3, "0")}`;
  nextPlanItemSeq++;

  const newItem: ProcurementPlanItem = {
    ...item,
    id: `ppi-${Date.now()}`,
    ppItemId,
    version: 1,
    changeHistory: [],
    createdDate: today,
    lastModified: today,
  };

  procurementPlanItems = [...procurementPlanItems, newItem];
  notifyListeners();
  return newItem;
}

export function updateProcurementPlanItem(
  id: string,
  updates: Partial<Omit<ProcurementPlanItem, "id" | "ppItemId" | "changeHistory" | "createdDate">>,
  changedBy: string
): ProcurementPlanItem | undefined {
  const today = new Date().toISOString().split("T")[0];
  let updated: ProcurementPlanItem | undefined;

  procurementPlanItems = procurementPlanItems.map((item) => {
    if (item.id !== id) return item;

    const changes: PlanItemChange[] = [];
    for (const [key, newVal] of Object.entries(updates)) {
      if (key === "version" || key === "lastModified") continue;
      const oldVal = String((item as unknown as Record<string, unknown>)[key] ?? "");
      const newValStr = String(newVal);
      if (oldVal !== newValStr) {
        changes.push({
          id: `ch-${Date.now()}-${key}`,
          date: today,
          field: key,
          oldValue: oldVal,
          newValue: newValStr,
          changedBy,
        });
      }
    }

    updated = {
      ...item,
      ...updates,
      version: item.version + 1,
      changeHistory: [...item.changeHistory, ...changes],
      lastModified: today,
    };
    return updated;
  });

  if (updated) notifyListeners();
  return updated;
}

export function approvePlanItem(id: string, approvedBy: string): ProcurementPlanItem | undefined {
  return updateProcurementPlanItem(id, { approvalStatus: "Approved" }, approvedBy);
}

export function getApprovedPlanItems(): ProcurementPlanItem[] {
  return procurementPlanItems.filter((item) => item.approvalStatus === "Approved");
}

// ══════════════════════════════════════════════════════════════════════════════
// PLAN REVIEW WORKFLOW
// ══════════════════════════════════════════════════════════════════════════════

const todayISO = () => new Date().toISOString().split("T")[0];

function daysBetween(from: string, to: string = todayISO()): number {
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000);
}

/** Draft → Procurement review. Nothing reaches the portal without this. */
export function submitPlanItemForReview(id: string, submittedBy: string): ProcurementPlanItem | undefined {
  const item = procurementPlanItems.find((p) => p.id === id);
  if (!item) return undefined;
  if (item.approvalStatus !== "Draft" && item.approvalStatus !== "Rejected") return item;

  const updated = updateProcurementPlanItem(
    id,
    {
      approvalStatus: "Pending Procurement Review",
      procurementReview: "Pending",
      financeReview: "N/A",
      submittedBy,
      submittedDate: todayISO(),
      rejectionReason: undefined,
    },
    submittedBy
  );

  if (updated) {
    notify({
      category: "Approval",
      module: "Procurement Planning",
      subject: `Plan item ${updated.ppItemId} submitted for compliance review`,
      body: `${submittedBy} submitted "${updated.activityDescription}" (${updated.category}, $${updated.estimatedValue.toLocaleString()}, ${updated.procurementMethod}) for review. Procurement must confirm policy and plan compliance before Finance verifies the budget line.`,
      recipientRole: "Procurement",
      entityRef: updated.ppItemId,
    });
    scheduleReminder({
      entityRef: updated.ppItemId,
      entityType: "Plan Item",
      module: "Procurement Planning",
      subject: `Plan item ${updated.ppItemId} awaiting Procurement review`,
      body: `"${updated.activityDescription}" has been awaiting compliance review since ${todayISO()}.`,
      recipientRole: "Procurement",
      dueDate: todayISO(),
      reminderAfterHours: 48,
      escalateAfterHours: 72,
      escalateToRole: "Senior Management",
    });
  }
  return updated;
}

/** Procurement compliance review → hands to Finance. */
export function reviewPlanItemProcurement(
  id: string,
  reviewedBy: string,
  comments = ""
): ProcurementPlanItem | undefined {
  const item = procurementPlanItems.find((p) => p.id === id);
  if (!item || item.approvalStatus !== "Pending Procurement Review") return undefined;

  const updated = updateProcurementPlanItem(
    id,
    {
      approvalStatus: "Pending Finance Review",
      procurementReview: "Approved",
      procurementReviewedBy: reviewedBy,
      financeReview: "Pending",
    },
    reviewedBy
  );

  if (updated) {
    resolveReminder(updated.ppItemId, "Plan Item");
    notify({
      category: "Approval",
      module: "Procurement Planning",
      subject: `Plan item ${updated.ppItemId} awaiting Finance verification`,
      body: `Procurement cleared "${updated.activityDescription}" for policy compliance${comments ? `: ${comments}` : "."} Finance must now confirm the budget line ${updated.linkedBudgetLine || "(not set)"} and funding source ${updated.fundingSource}.`,
      recipientRole: "Finance",
      entityRef: updated.ppItemId,
    });
    scheduleReminder({
      entityRef: updated.ppItemId,
      entityType: "Plan Item",
      module: "Procurement Planning",
      subject: `Plan item ${updated.ppItemId} awaiting Finance verification`,
      body: `"${updated.activityDescription}" is awaiting budget confirmation.`,
      recipientRole: "Finance",
      dueDate: todayISO(),
      reminderAfterHours: 48,
      escalateAfterHours: 72,
      escalateToRole: "Senior Management",
    });
  }
  return updated;
}

/** Finance budget verification → the item goes live on the plan. */
export function reviewPlanItemFinance(
  id: string,
  reviewedBy: string,
  comments = ""
): ProcurementPlanItem | undefined {
  const item = procurementPlanItems.find((p) => p.id === id);
  if (!item || item.approvalStatus !== "Pending Finance Review") return undefined;

  const updated = updateProcurementPlanItem(
    id,
    { approvalStatus: "Approved", financeReview: "Approved", financeReviewedBy: reviewedBy },
    reviewedBy
  );

  if (updated) {
    resolveReminder(updated.ppItemId, "Plan Item");
    notify({
      category: "Info",
      module: "Procurement Planning",
      subject: `Plan item ${updated.ppItemId} approved and live`,
      body: `"${updated.activityDescription}" has cleared Procurement and Finance review${comments ? `: ${comments}` : "."} It is now available for requisition and sourcing initiation.`,
      recipientName: updated.responsiblePerson,
      recipientRole: "Requestor",
      entityRef: updated.ppItemId,
    });
  }
  return updated;
}

export function rejectPlanItem(
  id: string,
  rejectedBy: string,
  reason: string,
  stage: "Procurement" | "Finance"
): ProcurementPlanItem | undefined {
  if (!reason.trim()) return undefined;
  const item = procurementPlanItems.find((p) => p.id === id);
  if (!item) return undefined;

  const updated = updateProcurementPlanItem(
    id,
    {
      approvalStatus: "Rejected",
      rejectionReason: reason,
      ...(stage === "Procurement"
        ? { procurementReview: "Rejected" as PRApprovalStepStatus, procurementReviewedBy: rejectedBy }
        : { financeReview: "Rejected" as PRApprovalStepStatus, financeReviewedBy: rejectedBy }),
    },
    rejectedBy
  );

  if (updated) {
    resolveReminder(updated.ppItemId, "Plan Item");
    notify({
      category: "Alert",
      module: "Procurement Planning",
      subject: `Plan item ${updated.ppItemId} rejected at ${stage} review`,
      body: `"${updated.activityDescription}" was rejected by ${rejectedBy}.\n\nReason: ${reason}\n\nCorrect the entry and resubmit for review.`,
      recipientName: updated.submittedBy ?? updated.responsiblePerson,
      recipientRole: "Requestor",
      entityRef: updated.ppItemId,
      priority: "High",
    });
  }
  return updated;
}

// ── Plan change management ──────────────────────────────────────────────────

/**
 * Amendments to an approved plan item are held until reviewed rather than
 * applied straight away, which is what "tracks all changes with version control
 * and approval workflow" requires.
 */
export function requestPlanItemChange(
  id: string,
  updates: Partial<ProcurementPlanItem>,
  reason: string,
  requestedBy: string
): { ok: boolean; error?: string } {
  const item = procurementPlanItems.find((p) => p.id === id);
  if (!item) return { ok: false, error: "Plan item not found." };
  if (!reason.trim()) return { ok: false, error: "A reason for the change is required." };
  if (item.pendingChange) return { ok: false, error: "An amendment is already awaiting review on this item." };

  // A draft or rejected item is not yet live, so it can simply be edited.
  if (item.approvalStatus !== "Approved") {
    updateProcurementPlanItem(id, updates, requestedBy);
    return { ok: true };
  }

  const change: PendingPlanChange = {
    id: `pc-${Date.now()}`,
    requestedBy,
    requestedDate: todayISO(),
    reason,
    updates,
    status: "Pending Procurement Review",
  };

  procurementPlanItems = procurementPlanItems.map((p) => (p.id === id ? { ...p, pendingChange: change } : p));

  notify({
    category: "Approval",
    module: "Procurement Planning",
    subject: `Amendment requested on plan item ${item.ppItemId}`,
    body: `${requestedBy} requested changes to "${item.activityDescription}".\n\nReason: ${reason}\nFields: ${Object.keys(updates).join(", ")}\n\nProcurement and Finance must approve before the plan is revised.`,
    recipientRole: "Procurement",
    entityRef: item.ppItemId,
  });
  notifyListeners();
  return { ok: true };
}

export function approvePlanItemChange(
  id: string,
  approvedBy: string,
  stage: "Procurement" | "Finance"
): { ok: boolean; error?: string } {
  const item = procurementPlanItems.find((p) => p.id === id);
  if (!item?.pendingChange) return { ok: false, error: "No amendment is awaiting review." };
  const change = item.pendingChange;

  if (stage === "Procurement") {
    if (change.status !== "Pending Procurement Review") {
      return { ok: false, error: "This amendment has already cleared Procurement review." };
    }
    procurementPlanItems = procurementPlanItems.map((p) =>
      p.id === id
        ? { ...p, pendingChange: { ...change, status: "Pending Finance Review", procurementApprovedBy: approvedBy } }
        : p
    );
    notify({
      category: "Approval",
      module: "Procurement Planning",
      subject: `Amendment on ${item.ppItemId} awaiting Finance approval`,
      body: `Procurement approved the amendment to "${item.activityDescription}". Finance must confirm the budget impact.`,
      recipientRole: "Finance",
      entityRef: item.ppItemId,
    });
    notifyListeners();
    return { ok: true };
  }

  if (change.status !== "Pending Finance Review") {
    return { ok: false, error: "Procurement must approve the amendment first." };
  }

  // Clear the holder before applying, so the change history records the real edit.
  procurementPlanItems = procurementPlanItems.map((p) => (p.id === id ? { ...p, pendingChange: undefined } : p));
  updateProcurementPlanItem(id, change.updates, change.requestedBy);

  // Stamp the approver onto the entries this amendment produced.
  procurementPlanItems = procurementPlanItems.map((p) => {
    if (p.id !== id) return p;
    const changedFields = new Set(Object.keys(change.updates));
    return {
      ...p,
      changeHistory: p.changeHistory.map((h) =>
        h.date === todayISO() && changedFields.has(h.field) && !h.approvedBy
          ? { ...h, approvedBy: `${change.procurementApprovedBy} / ${approvedBy}` }
          : h
      ),
    };
  });

  notify({
    category: "Info",
    module: "Procurement Planning",
    subject: `Amendment approved on plan item ${item.ppItemId}`,
    body: `The amendment requested by ${change.requestedBy} has been applied.\n\nReason: ${change.reason}\nApproved by ${change.procurementApprovedBy} (Procurement) and ${approvedBy} (Finance).`,
    recipientName: change.requestedBy,
    recipientRole: "Requestor",
    entityRef: item.ppItemId,
  });
  notifyListeners();
  return { ok: true };
}

export function rejectPlanItemChange(id: string, rejectedBy: string, reason: string): { ok: boolean; error?: string } {
  const item = procurementPlanItems.find((p) => p.id === id);
  if (!item?.pendingChange) return { ok: false, error: "No amendment is awaiting review." };
  if (!reason.trim()) return { ok: false, error: "A reason is required when rejecting an amendment." };

  const requester = item.pendingChange.requestedBy;
  procurementPlanItems = procurementPlanItems.map((p) => (p.id === id ? { ...p, pendingChange: undefined } : p));

  notify({
    category: "Alert",
    module: "Procurement Planning",
    subject: `Amendment rejected on plan item ${item.ppItemId}`,
    body: `${rejectedBy} rejected the amendment to "${item.activityDescription}".\n\nReason: ${reason}`,
    recipientName: requester,
    recipientRole: "Requestor",
    entityRef: item.ppItemId,
    priority: "High",
  });
  notifyListeners();
  return { ok: true };
}

// ── Schedule monitoring ─────────────────────────────────────────────────────

/**
 * Marks approved items as Delayed when their completion date has passed without
 * reaching a terminal state, and raises the alert the dashboard needs. Nothing
 * previously compared plan dates to the calendar, so "Delayed" only ever
 * appeared if a user set it by hand.
 */
export function detectOverduePlanItems(): ProcurementPlanItem[] {
  const terminal: ProcurementPlanItem["status"][] = ["Completed", "Contracted", "Awarded"];
  const overdue: ProcurementPlanItem[] = [];

  procurementPlanItems = procurementPlanItems.map((item) => {
    if (item.approvalStatus !== "Approved") return item;
    if (terminal.includes(item.status) || item.status === "Delayed") return item;
    if (item.completionDate >= todayISO()) return item;

    overdue.push(item);
    return { ...item, status: "Delayed" as const, lastModified: todayISO() };
  });

  overdue.forEach((item) => {
    notify({
      category: "Alert",
      module: "Procurement Planning",
      subject: `Plan item ${item.ppItemId} is overdue`,
      body: `"${item.activityDescription}" was due to complete on ${item.completionDate} — ${daysBetween(item.completionDate)} days ago — and is still ${item.status}. It has been marked Delayed.`,
      recipientName: item.responsiblePerson,
      recipientRole: "Procurement",
      entityRef: item.ppItemId,
      priority: "High",
    });
    scheduleReminder({
      entityRef: item.ppItemId,
      entityType: "Plan Item",
      module: "Procurement Planning",
      subject: `Overdue plan item ${item.ppItemId}`,
      body: `"${item.activityDescription}" is past its completion date of ${item.completionDate}.`,
      recipientName: item.responsiblePerson,
      recipientRole: "Procurement",
      dueDate: item.completionDate,
      reminderAfterHours: 24 * 7,
      escalateAfterHours: 24 * 14,
    });
  });

  if (overdue.length) notifyListeners();
  return overdue;
}

/** Items whose initiation date falls inside the next N days. */
export function getPlanPipeline(days: number): ProcurementPlanItem[] {
  return procurementPlanItems
    .filter((i) => i.approvalStatus === "Approved")
    .filter((i) => {
      const d = daysBetween(todayISO(), i.initiationDate);
      return d >= 0 && d <= days;
    })
    .sort((a, b) => a.initiationDate.localeCompare(b.initiationDate));
}

export function getPlanBottlenecks(): { item: ProcurementPlanItem; stage: string; daysStuck: number; responsible: string }[] {
  return procurementPlanItems
    .filter((i) => i.approvalStatus !== "Approved" || i.status === "Delayed")
    .map((i) => {
      const stage =
        i.approvalStatus !== "Approved" ? i.approvalStatus : `${i.status} since ${i.lastModified}`;
      const responsible =
        i.approvalStatus === "Pending Procurement Review"
          ? "Procurement Unit"
          : i.approvalStatus === "Pending Finance Review"
            ? "Finance Team"
            : i.responsiblePerson;
      return { item: i, stage, daysStuck: daysBetween(i.lastModified), responsible };
    })
    .filter((r) => r.daysStuck > 0)
    .sort((a, b) => b.daysStuck - a.daysStuck);
}

export function getPlanStats() {
  const approved = procurementPlanItems.filter((i) => i.approvalStatus === "Approved");
  const byCategory = new Map<string, { count: number; value: number }>();
  const byDonor = new Map<string, { count: number; value: number }>();

  approved.forEach((i) => {
    const cat = byCategory.get(i.category) ?? { count: 0, value: 0 };
    byCategory.set(i.category, { count: cat.count + 1, value: cat.value + i.estimatedValue });
    const don = byDonor.get(i.fundingSource) ?? { count: 0, value: 0 };
    byDonor.set(i.fundingSource, { count: don.count + 1, value: don.value + i.estimatedValue });
  });

  return {
    total: procurementPlanItems.length,
    approved: approved.length,
    pendingApproval: procurementPlanItems.filter(
      (i) => i.approvalStatus === "Pending Procurement Review" || i.approvalStatus === "Pending Finance Review"
    ).length,
    pendingAmendments: procurementPlanItems.filter((i) => i.pendingChange).length,
    draft: procurementPlanItems.filter((i) => i.approvalStatus === "Draft").length,
    delayed: approved.filter((i) => i.status === "Delayed").length,
    completed: approved.filter((i) => i.status === "Completed").length,
    active: approved.filter((i) => !["Completed", "Delayed"].includes(i.status)).length,
    totalValue: approved.reduce((s, i) => s + i.estimatedValue, 0),
    byCategory: Array.from(byCategory, ([category, v]) => ({ category, ...v })),
    byDonor: Array.from(byDonor, ([donor, v]) => ({ donor, ...v })),
    pipeline30: getPlanPipeline(30).length,
    pipeline60: getPlanPipeline(60).length,
    pipeline90: getPlanPipeline(90).length,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// REQUISITION LIFECYCLE
// ══════════════════════════════════════════════════════════════════════════════

export interface PRValidationIssue {
  field: string;
  message: string;
}

/**
 * The pre-submission gate. Every rule here comes from the requirement that the
 * system "shall block submission and display clear error messages" when the
 * requisition is not linked to an approved plan activity, the method does not
 * match the threshold, mandatory documents are absent, or funding rules are
 * unmet.
 */
export function validatePRForSubmission(pr: GeneratedPR): PRValidationIssue[] {
  const issues: PRValidationIssue[] = [];

  if (!pr.requisitionTitle?.trim()) issues.push({ field: "requisitionTitle", message: "A requisition title is required." });
  if (!pr.itemDescription?.trim()) issues.push({ field: "itemDescription", message: "A detailed description of the need is required." });
  if (!pr.department?.trim()) issues.push({ field: "department", message: "The requesting department or project is required." });
  if (!pr.estimatedCost || pr.estimatedCost <= 0) issues.push({ field: "estimatedCost", message: "An estimated cost greater than zero is required." });
  if (!pr.fundingSource?.trim()) issues.push({ field: "fundingSource", message: "A funding source must be selected." });
  if (!pr.category?.trim()) issues.push({ field: "category", message: "A procurement category must be selected." });

  // Category-specific timing
  if (pr.category === "Goods" && !pr.deliveryTimeline?.trim()) {
    issues.push({ field: "deliveryTimeline", message: "Goods requisitions require a desired delivery timeline." });
  }
  if ((pr.category === "Services" || pr.category === "Consultancy" || pr.category === "Works") &&
      (!pr.serviceStartDate || !pr.serviceEndDate)) {
    issues.push({ field: "serviceDates", message: `${pr.category} requisitions require estimated start and end dates.` });
  }
  if (pr.serviceStartDate && pr.serviceEndDate && pr.serviceEndDate < pr.serviceStartDate) {
    issues.push({ field: "serviceDates", message: "The service end date cannot fall before the start date." });
  }

  // Plan linkage — waived only by an approved emergency override
  const planItem = pr.linkedPlanItemId
    ? procurementPlanItems.find((p) => p.ppItemId === pr.linkedPlanItemId)
    : undefined;
  if (!planItem && !pr.emergencyOverride) {
    issues.push({
      field: "linkedPlanItemId",
      message: "The requisition must be linked to an approved procurement plan activity, or carry an approved emergency override.",
    });
  }
  if (planItem && planItem.approvalStatus !== "Approved") {
    issues.push({
      field: "linkedPlanItemId",
      message: `Plan item ${planItem.ppItemId} is "${planItem.approvalStatus}". Only approved plan activities can be requisitioned against.`,
    });
  }
  if (pr.emergencyOverride && !pr.emergencyOverrideJustification?.trim()) {
    issues.push({ field: "emergencyOverride", message: "An emergency override requires a written justification." });
  }

  // Method vs threshold
  const methodCheck = validateMethodAgainstThreshold(pr.purchaseType, pr.estimatedCost);
  if (!methodCheck.compliant && !pr.methodDeviationJustification?.trim()) {
    issues.push({ field: "purchaseType", message: `${methodCheck.message} Record a justification for the deviation to proceed.` });
  }

  // Direct selection justification and shortlist details
  if (isDirect(pr.purchaseType)) {
    if (!pr.directSelectionJustification?.trim()) {
      issues.push({ field: "directSelectionJustification", message: "Direct selection requires a written justification." });
    }
    if (!pr.shortlistedEntities?.length) {
      issues.push({ field: "shortlistedEntities", message: "Direct selection requires the supplier or individual to be identified." });
    } else {
      const incomplete = pr.shortlistedEntities.filter((e) => !e.name?.trim() || !e.address?.trim() || !e.email?.trim());
      if (incomplete.length) {
        issues.push({ field: "shortlistedEntities", message: "Each identified supplier needs a full legal name, registered address and email." });
      }
    }
  }
  if (canonicalMethod(pr.purchaseType) === "Limited Competition" && !pr.shortlistedEntities?.length) {
    issues.push({ field: "shortlistedEntities", message: "Limited competition requires the shortlisted firms or individuals to be entered." });
  }

  // Mandatory supporting documents
  const attachmentCount = (pr.attachments?.length ?? 0) + (pr.attachmentFiles?.length ?? 0);
  if (attachmentCount === 0) {
    issues.push({
      field: "attachments",
      message: pr.category === "Goods"
        ? "Technical Specifications must be uploaded before submission."
        : "Terms of Reference (TOR) must be uploaded before submission.",
    });
  }

  // Funding source rules against the plan item
  if (planItem && pr.fundingSource && planItem.fundingSource !== pr.fundingSource) {
    issues.push({
      field: "fundingSource",
      message: `Funding source "${pr.fundingSource}" does not match plan item ${planItem.ppItemId}, which is funded by "${planItem.fundingSource}".`,
    });
  }

  return issues;
}

/** Flags a requisition whose cost materially exceeds its plan item. */
export function checkPlanVariance(pr: GeneratedPR): { flagged: boolean; message?: string; variancePct?: number } {
  if (!pr.linkedPlanItemId) return { flagged: false };
  const planItem = procurementPlanItems.find((p) => p.ppItemId === pr.linkedPlanItemId);
  if (!planItem || planItem.estimatedValue <= 0) return { flagged: false };

  const variancePct = ((pr.estimatedCost - planItem.estimatedValue) / planItem.estimatedValue) * 100;
  if (variancePct <= 10) return { flagged: false, variancePct };

  return {
    flagged: true,
    variancePct,
    message: `Estimated cost of $${pr.estimatedCost.toLocaleString()} is ${variancePct.toFixed(0)}% above plan item ${planItem.ppItemId} ($${planItem.estimatedValue.toLocaleString()}). A comment is required, and the plan item may need revision.`,
  };
}

function stageResponsible(status: PROverallStatus): string {
  switch (status) {
    case "Pending Dept Approval": return "Department Head";
    case "Pending Procurement & Finance": return "Procurement Unit / Finance Team";
    case "Pending Senior Mgmt": return "Senior Management";
    case "Approved": return "Procurement Unit";
    default: return "Requesting Officer";
  }
}

/** Real days-in-stage, computed from when the requisition entered it. */
export function computeDaysInStage(pr: GeneratedPR): number {
  if (!pr.stageEnteredDate) return pr.daysInCurrentStage ?? 0;
  return Math.max(0, daysBetween(pr.stageEnteredDate));
}

function advanceStage(pr: GeneratedPR, status: PROverallStatus): GeneratedPR {
  return {
    ...pr,
    overallApprovalStatus: status,
    status,
    stageEnteredDate: todayISO(),
    daysInCurrentStage: 0,
    currentResponsible: stageResponsible(status),
  };
}

function notifyStage(pr: GeneratedPR, status: PROverallStatus, extra = "") {
  const roleMap: Record<string, "Department Head" | "Procurement" | "Finance" | "Senior Management" | "Requestor"> = {
    "Pending Dept Approval": "Department Head",
    "Pending Procurement & Finance": "Procurement",
    "Pending Senior Mgmt": "Senior Management",
  };
  const role = roleMap[status];
  if (!role) return;

  notify({
    category: "Approval",
    module: "Requisitions",
    subject: `${pr.requisitionNumber} awaiting your approval`,
    body: `${pr.requisitionTitle || pr.itemDescription} — $${pr.estimatedCost.toLocaleString()}, ${pr.category}, funded by ${pr.fundingSource || "unspecified"}. Raised by ${pr.requestedBy} (${pr.department}).${extra ? `\n\n${extra}` : ""}`,
    recipientRole: role,
    entityRef: pr.requisitionNumber,
    channels: ["In-App", "Email", "SMS"],
    priority: pr.estimatedCost > SENIOR_APPROVAL_THRESHOLD ? "High" : "Normal",
  });

  scheduleReminder({
    entityRef: pr.requisitionNumber,
    entityType: "Requisition",
    module: "Requisitions",
    subject: `${pr.requisitionNumber} awaiting ${stageResponsible(status)}`,
    body: `${pr.requisitionTitle || pr.itemDescription} ($${pr.estimatedCost.toLocaleString()}) has been awaiting action since ${todayISO()}.`,
    recipientRole: role,
    dueDate: todayISO(),
    reminderAfterHours: 48,
    escalateAfterHours: 72,
    escalateToRole: "Senior Management",
  });

  // Parallel stage: Finance is a second, independent station.
  if (status === "Pending Procurement & Finance") {
    notify({
      category: "Approval",
      module: "Requisitions",
      subject: `${pr.requisitionNumber} awaiting budget verification`,
      body: `${pr.requisitionTitle || pr.itemDescription} — $${pr.estimatedCost.toLocaleString()} against ${pr.fundingSource || "unspecified funding"}. Procurement is reviewing in parallel.`,
      recipientRole: "Finance",
      entityRef: pr.requisitionNumber,
      channels: ["In-App", "Email"],
    });
    scheduleReminder({
      entityRef: `${pr.requisitionNumber}-FIN`,
      entityType: "Requisition",
      module: "Requisitions",
      subject: `${pr.requisitionNumber} awaiting Finance budget verification`,
      body: `Budget availability has not yet been confirmed for ${pr.requisitionNumber}.`,
      recipientRole: "Finance",
      dueDate: todayISO(),
      reminderAfterHours: 48,
      escalateAfterHours: 72,
      escalateToRole: "Senior Management",
    });
  }
}

/** Requestor withdraws a requisition that has not yet been approved. */
export function withdrawPR(prId: string, withdrawnBy: string, reason: string): { ok: boolean; error?: string } {
  const pr = generatedPRs.find((p) => p.id === prId);
  if (!pr) return { ok: false, error: "Requisition not found." };
  if (pr.overallApprovalStatus === "Approved" || pr.overallApprovalStatus === "Converted to Sourcing") {
    return { ok: false, error: "An approved requisition cannot be withdrawn. Raise a cancellation with Procurement instead." };
  }
  if (pr.overallApprovalStatus === "Withdrawn") return { ok: false, error: "This requisition is already withdrawn." };
  if (!reason.trim()) return { ok: false, error: "A reason is required when withdrawing a requisition." };

  generatedPRs = generatedPRs.map((p) =>
    p.id !== prId
      ? p
      : {
          ...advanceStage(p, "Withdrawn"),
          withdrawnReason: reason,
          deptApproval: "N/A" as const,
          procurementApproval: "N/A" as const,
          financeApproval: "N/A" as const,
          seniorMgmtApproval: "N/A" as const,
          approvalHistory: [
            ...p.approvalHistory,
            { step: p.currentStep, role: "Requesting Officer", action: "Rejected" as const, date: todayISO(), comments: `Withdrawn by ${withdrawnBy}: ${reason}` },
          ],
        }
  );

  resolveReminder(pr.requisitionNumber, "Requisition");
  resolveReminder(`${pr.requisitionNumber}-FIN`, "Requisition");
  notify({
    category: "Info",
    module: "Requisitions",
    subject: `${pr.requisitionNumber} withdrawn`,
    body: `${withdrawnBy} withdrew this requisition.\n\nReason: ${reason}`,
    recipientRole: "Procurement",
    entityRef: pr.requisitionNumber,
  });
  notifyListeners();
  return { ok: true };
}

/**
 * Returns a rejected requisition to the start of the chain after correction.
 * Rejection was previously terminal, which left the requester with no route
 * back despite the requirement to "correct the identified issues and resubmit".
 */
export function resubmitPR(
  prId: string,
  resubmittedBy: string,
  corrections: Partial<GeneratedPR>,
  comments: string
): { ok: boolean; error?: string; issues?: PRValidationIssue[] } {
  const pr = generatedPRs.find((p) => p.id === prId);
  if (!pr) return { ok: false, error: "Requisition not found." };
  if (pr.overallApprovalStatus !== "Rejected" && pr.overallApprovalStatus !== "Withdrawn") {
    return { ok: false, error: "Only a rejected or withdrawn requisition can be resubmitted." };
  }

  const candidate: GeneratedPR = { ...pr, ...corrections };
  const issues = validatePRForSubmission(candidate);
  if (issues.length) return { ok: false, error: "The requisition still has validation errors.", issues };

  generatedPRs = generatedPRs.map((p) =>
    p.id !== prId
      ? p
      : {
          ...advanceStage(candidate, "Pending Dept Approval"),
          currentStep: 2,
          deptApproval: "Pending" as const,
          procurementApproval: "N/A" as const,
          financeApproval: "N/A" as const,
          seniorMgmtApproval: "N/A" as const,
          rejectionReason: undefined,
          rejectedAtStage: undefined,
          resubmissionCount: (p.resubmissionCount ?? 0) + 1,
          requiresSeniorApproval: candidate.estimatedCost > SENIOR_APPROVAL_THRESHOLD,
          approvalHistory: [
            ...p.approvalHistory,
            { step: 1, role: "Requesting Officer", action: "Submitted" as const, date: todayISO(), comments: `Resubmitted by ${resubmittedBy} (attempt ${(p.resubmissionCount ?? 0) + 2}): ${comments}` },
          ],
        }
  );

  const updated = generatedPRs.find((p) => p.id === prId)!;
  notifyStage(updated, "Pending Dept Approval", `Resubmitted after rejection. Requester's note: ${comments}`);
  notifyListeners();
  return { ok: true };
}

/** Records that an approved requisition has become a sourcing case. */
export function markPRConvertedToSourcing(prNumber: string, sourcingCaseNumber: string) {
  let changed = false;
  generatedPRs = generatedPRs.map((p) => {
    if (p.requisitionNumber !== prNumber || p.overallApprovalStatus !== "Approved") return p;
    changed = true;
    return {
      ...advanceStage(p, "Converted to Sourcing"),
      convertedToSourcingCase: sourcingCaseNumber,
      approvalHistory: [
        ...p.approvalHistory,
        { step: 5, role: "Procurement Unit", action: "Approved" as const, date: todayISO(), comments: `Converted to sourcing case ${sourcingCaseNumber}` },
      ],
    };
  });
  if (changed) {
    resolveReminder(prNumber, "Requisition");
    notifyListeners();
  }
}

/** Grants the emergency override that lets sourcing proceed off-plan. */
export function grantEmergencyOverride(
  prId: string,
  justification: string,
  approvedBy: string
): { ok: boolean; error?: string } {
  if (!justification.trim()) return { ok: false, error: "An emergency override requires a written justification." };
  const pr = generatedPRs.find((p) => p.id === prId);
  if (!pr) return { ok: false, error: "Requisition not found." };

  generatedPRs = generatedPRs.map((p) =>
    p.id !== prId
      ? p
      : {
          ...p,
          emergencyOverride: true,
          emergencyOverrideJustification: justification,
          emergencyOverrideApprovedBy: approvedBy,
          approvalHistory: [
            ...p.approvalHistory,
            { step: p.currentStep, role: "Senior Management", action: "Approved" as const, date: todayISO(), comments: `Emergency override granted by ${approvedBy}: ${justification}` },
          ],
        }
  );

  notify({
    category: "Alert",
    module: "Requisitions",
    subject: `Emergency override granted on ${pr.requisitionNumber}`,
    body: `${approvedBy} authorised this requisition to proceed without an approved plan item.\n\nJustification: ${justification}\n\nThis is an exception to the standard control and will appear in the audit trail.`,
    recipientRole: "Audit",
    entityRef: pr.requisitionNumber,
    priority: "High",
  });
  notifyListeners();
  return { ok: true };
}

/** Records the requester's comment on a flagged cost variance against plan. */
export function recordPlanVarianceComment(prId: string, comment: string, by: string) {
  generatedPRs = generatedPRs.map((p) =>
    p.id !== prId
      ? p
      : {
          ...p,
          planVarianceComment: comment,
          approvalHistory: [
            ...p.approvalHistory,
            { step: p.currentStep, role: "Requesting Officer", action: "Submitted" as const, date: todayISO(), comments: `Plan variance explained by ${by}: ${comment}` },
          ],
        }
  );
  notifyListeners();
}

/** Requisitions awaiting a given station, for the role dashboards. */
export function getPRsAwaiting(role: "Department Head" | "Procurement" | "Finance" | "Senior Management"): GeneratedPR[] {
  return generatedPRs.filter((pr) => {
    switch (role) {
      case "Department Head":
        return pr.overallApprovalStatus === "Pending Dept Approval" && pr.deptApproval === "Pending";
      case "Procurement":
        return pr.overallApprovalStatus === "Pending Procurement & Finance" && pr.procurementApproval === "Pending";
      case "Finance":
        return pr.overallApprovalStatus === "Pending Procurement & Finance" && pr.financeApproval === "Pending";
      case "Senior Management":
        return pr.overallApprovalStatus === "Pending Senior Mgmt" && pr.seniorMgmtApproval === "Pending";
    }
  });
}

export function getPRStats() {
  const byStatus = new Map<string, number>();
  generatedPRs.forEach((pr) => byStatus.set(pr.overallApprovalStatus, (byStatus.get(pr.overallApprovalStatus) ?? 0) + 1));

  const approved = generatedPRs.filter((p) => p.overallApprovalStatus === "Approved" || p.overallApprovalStatus === "Converted to Sourcing");
  const cycleTimes = approved
    .map((p) => {
      const submitted = p.approvalHistory.find((h) => h.action === "Submitted")?.date;
      const finalStep = [...p.approvalHistory].reverse().find((h) => h.action === "Approved")?.date;
      return submitted && finalStep ? daysBetween(submitted, finalStep) : null;
    })
    .filter((d): d is number => d !== null && d >= 0);

  return {
    total: generatedPRs.length,
    draft: byStatus.get("Draft") ?? 0,
    pendingDept: byStatus.get("Pending Dept Approval") ?? 0,
    pendingProcFin: byStatus.get("Pending Procurement & Finance") ?? 0,
    pendingSenior: byStatus.get("Pending Senior Mgmt") ?? 0,
    approved: byStatus.get("Approved") ?? 0,
    rejected: byStatus.get("Rejected") ?? 0,
    withdrawn: byStatus.get("Withdrawn") ?? 0,
    converted: byStatus.get("Converted to Sourcing") ?? 0,
    totalValue: generatedPRs.reduce((s, p) => s + p.estimatedCost, 0),
    avgCycleTimeDays: cycleTimes.length ? +(cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length).toFixed(1) : 0,
    awaitingAction: generatedPRs.filter((p) =>
      ["Pending Dept Approval", "Pending Procurement & Finance", "Pending Senior Mgmt"].includes(p.overallApprovalStatus)
    ).length,
  };
}

/** Adds a requisition raised directly (not from the ESS plan). */
export function createDirectRequisition(opts: Partial<GeneratedPR> & {
  requisitionTitle: string;
  itemDescription: string;
  requestedBy: string;
  department: string;
  estimatedCost: number;
  category: string;
}): GeneratedPR {
  nextPRNumber++;
  const today = todayISO();
  const method = opts.purchaseType || suggestProcurementMethod(opts.estimatedCost);

  const newPR: GeneratedPR = {
    // Caller-supplied fields first; the identity and workflow fields below are
    // system-owned and must not be overridable.
    quantity: 1,
    unit: "unit",
    sourcePlanId: "",
    sourcePlanItemId: "",
    priority: opts.estimatedCost >= 30000 ? "Urgent" : opts.estimatedCost >= 10000 ? "High" : "Medium",
    ...opts,
    id: `GPR-${Date.now()}-${nextPRNumber}`,
    requisitionNumber: `PR-${new Date().getFullYear()}-${String(nextPRNumber).padStart(3, "0")}`,
    status: "Draft",
    dateRequested: today,
    purchaseType: method,
    currentStep: 1,
    overallApprovalStatus: "Draft",
    deptApproval: "N/A",
    procurementApproval: "N/A",
    financeApproval: "N/A",
    seniorMgmtApproval: "N/A",
    requiresSeniorApproval: opts.estimatedCost > SENIOR_APPROVAL_THRESHOLD,
    approvalHistory: [],
    sourceType: "Direct",
    stageEnteredDate: today,
    daysInCurrentStage: 0,
    currentResponsible: opts.requestedBy,
    resubmissionCount: 0,
  };

  generatedPRs = [...generatedPRs, newPR];
  notifyListeners();
  return newPR;
}

/** Persists edits to a draft requisition. */
export function updatePR(prId: string, updates: Partial<GeneratedPR>): GeneratedPR | undefined {
  let updated: GeneratedPR | undefined;
  generatedPRs = generatedPRs.map((p) => {
    if (p.id !== prId) return p;
    updated = { ...p, ...updates };
    return updated;
  });
  if (updated) notifyListeners();
  return updated;
}