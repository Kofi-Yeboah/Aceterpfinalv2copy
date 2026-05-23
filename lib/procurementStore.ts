// Shared procurement store for cross-component state
// When sourcing events are approved, POs are auto-generated here
// When ESS procurement plan items are initiated, PRs are auto-generated here

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
  vendor: string;
  vendorEmail?: string;
  vendorAddress?: string;
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
  vendorNotifiedAt?: string;
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
  vendor: string;
  projectName: string;
  sourcePR: string;
  estimatedValue: number;
  dateSubmitted: string;
  approvalStatus: "Pending" | "Approved" | "Rejected";
}

export type PRApprovalStepStatus = "Pending" | "Approved" | "Rejected" | "N/A";

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
  overallApprovalStatus: "Draft" | "Pending Dept Approval" | "Pending Procurement & Finance" | "Pending Senior Mgmt" | "Approved" | "Rejected";
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
}

type Listener = () => void;

let listeners: Listener[] = [];

// Sourcing items pending approval (from "Awarded" RFQs that need final approval before PO)
let sourcingApprovals: SourcingApprovalItem[] = [
  { id: "SA-1", rfqNumber: "RFQ-2024-001", title: "Consultant Fees - Survey Design", vendor: "Dr. Kwesi Appiah", projectName: "Youth Employment Skills Development", sourcePR: "PR-2024-001", estimatedValue: 8000, dateSubmitted: "2024-12-16", approvalStatus: "Approved" },
  { id: "SA-2", rfqNumber: "RFQ-2024-002", title: "Printing & Materials", vendor: "PrintWorks Ghana Ltd", projectName: "Youth Employment Skills Development", sourcePR: "PR-2024-001", estimatedValue: 1050, dateSubmitted: "2024-12-13", approvalStatus: "Approved" },
  { id: "SA-3", rfqNumber: "RFQ-2024-003", title: "Stakeholder Workshop Venue & Catering", vendor: "La Palm Royal Beach Hotel", projectName: "Youth Employment Skills Development", sourcePR: "PR-2024-001", estimatedValue: 3500, dateSubmitted: "2024-12-21", approvalStatus: "Approved" },
  { id: "SA-4", rfqNumber: "RFQ-2024-004", title: "External Reviewer Honoraria", vendor: "Prof. Ama Benyiwa", projectName: "Youth Employment Skills Development", sourcePR: "PR-2024-003", estimatedValue: 4000, dateSubmitted: "2024-12-26", approvalStatus: "Approved" },
  { id: "SA-5", rfqNumber: "RFQ-2024-005", title: "Research Assistant Stipends", vendor: "University of Ghana", projectName: "Youth Employment Skills Development", sourcePR: "PR-2024-004", estimatedValue: 6000, dateSubmitted: "2024-12-29", approvalStatus: "Approved" },
  { id: "SA-6", rfqNumber: "RFQ-2024-006", title: "Consultant Fees - Stakeholder Engagement", vendor: "Ghana Research Associates", projectName: "Youth Employment Skills Development", sourcePR: "PR-2024-010", estimatedValue: 5600, dateSubmitted: "2025-02-06", approvalStatus: "Pending" },
  { id: "SA-7", rfqNumber: "RFQ-2024-010", title: "Chromebooks for Computer Labs", vendor: "Acer Distributors", projectName: "Digital Literacy Initiative", sourcePR: "PR-2024-014", estimatedValue: 14000, dateSubmitted: "2025-01-26", approvalStatus: "Approved" },
  { id: "SA-8", rfqNumber: "RFQ-2024-008", title: "Laptops (50x Dell Latitude)", vendor: "Dell Inc. (via Telefonika Ghana)", projectName: "Youth Employment Skills Development", sourcePR: "PR-2024-012", estimatedValue: 47500, dateSubmitted: "2025-02-16", approvalStatus: "Pending" },
  { id: "SA-9", rfqNumber: "RFQ-2024-011", title: "Medical Supplies Kit", vendor: "MedSupply GH", projectName: "Community Health Project", sourcePR: "PR-2024-015", estimatedValue: 12000, dateSubmitted: "2025-01-31", approvalStatus: "Pending" },
];

// POs auto-generated from approved sourcing (these are the "seed" POs that already existed)
let generatedPOs: GeneratedPO[] = [
  { id: "GPO-1", poNumber: "PO-2024-156", vendor: "Dr. Kwesi Appiah", itemDescription: "Consultant Fees - Survey Design", orderDate: "2024-12-20", deliveryDate: "2025-02-28", amount: 8000, sourcePR: "PR-2024-001", projectName: "Youth Employment Skills Development", sourceRFQ: "RFQ-2024-001" },
  { id: "GPO-2", poNumber: "PO-2024-157", vendor: "PrintWorks Ghana Ltd", itemDescription: "Printing & Materials (200 units)", orderDate: "2024-12-18", deliveryDate: "2025-01-30", amount: 1050, sourcePR: "PR-2024-001", projectName: "Youth Employment Skills Development", sourceRFQ: "RFQ-2024-002" },
  { id: "GPO-3", poNumber: "PO-2024-158", vendor: "La Palm Royal Beach Hotel", itemDescription: "Stakeholder Workshop Venue & Catering", orderDate: "2024-12-22", deliveryDate: "2025-02-15", amount: 3500, sourcePR: "PR-2024-001", projectName: "Youth Employment Skills Development", sourceRFQ: "RFQ-2024-003" },
  { id: "GPO-4", poNumber: "PO-2024-159", vendor: "Prof. Ama Benyiwa", itemDescription: "External Reviewer Honoraria", orderDate: "2024-12-28", deliveryDate: "2025-03-15", amount: 4000, sourcePR: "PR-2024-003", projectName: "Youth Employment Skills Development", sourceRFQ: "RFQ-2024-004" },
  { id: "GPO-5", poNumber: "PO-2024-160", vendor: "University of Ghana", itemDescription: "Research Assistant Stipends (3 assistants)", orderDate: "2025-01-02", deliveryDate: "2025-04-01", amount: 6000, sourcePR: "PR-2024-004", projectName: "Youth Employment Skills Development", sourceRFQ: "RFQ-2024-005" },
  { id: "GPO-6", poNumber: "PO-2024-163", vendor: "Acer Distributors", itemDescription: "Chromebooks for Computer Labs (40 units)", orderDate: "2025-01-28", deliveryDate: "2025-02-20", amount: 14000, sourcePR: "PR-2024-014", projectName: "Digital Literacy Initiative", sourceRFQ: "RFQ-2024-010" },
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
    vendor: item.vendor,
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
}) {
  nextPRNumber++;
  const today = new Date().toISOString().split("T")[0];

  const purchaseTypeMap: Record<string, string> = {
    Goods: "Competitive Bidding",
    Services: "Request for Quotation",
    Consultancy: "Single Source",
    Works: "Competitive Bidding",
    Other: "Direct Purchase",
  };

  const newPR: GeneratedPR = {
    id: `GPR-${Date.now()}-${nextPRNumber}`,
    requisitionNumber: `PR-2026-${String(nextPRNumber).padStart(3, "0")}`,
    requestedBy: opts.requestedBy,
    department: opts.department,
    itemDescription: opts.description,
    quantity: opts.quantity,
    estimatedCost: opts.estimatedCost,
    priority: opts.estimatedCost >= 30000 ? "Urgent" : opts.estimatedCost >= 10000 ? "High" : "Medium",
    status: "Pending",
    dateRequested: today,
    purchaseType: purchaseTypeMap[opts.category] || "Direct Purchase",
    sourcePlanId: opts.planId,
    sourcePlanItemId: opts.itemId,
    category: opts.category,
    unit: opts.unit,
    // Approval workflow
    currentStep: 1,
    overallApprovalStatus: "Pending Dept Approval",
    deptApproval: "Pending",
    procurementApproval: "N/A",
    financeApproval: "N/A",
    seniorMgmtApproval: "N/A",
    requiresSeniorApproval: opts.estimatedCost > 10000,
    approvalHistory: [{ step: 1, role: "Requesting Officer", action: "Submitted" as const, date: today, comments: "Purchase requisition submitted from ESS Procurement Plan" }],
    sourceType: "ESS Plan",
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
    currentResponsible: opts.requestedBy,
  };

  generatedPRs = [...generatedPRs, newPR];
  notifyListeners();
  return newPR;
}

// ─── PR Submission (Step 1 → Step 2) ─────────────────────────────────────────
export function submitPRForApproval(prId: string) {
  const today = new Date().toISOString().split("T")[0];
  generatedPRs = generatedPRs.map(pr => {
    if (pr.id !== prId) return pr;
    return {
      ...pr,
      currentStep: 2,
      status: "Pending Dept Approval",
      overallApprovalStatus: "Pending Dept Approval" as const,
      deptApproval: "Pending" as const,
      approvalHistory: [...pr.approvalHistory, { step: 1, role: "Requesting Officer", action: "Submitted" as const, date: today, comments: "PR submitted for department approval" }],
    };
  });
  notifyListeners();
}

// ─── Department Head Approval (Step 2 → Step 3&4) ───────────────────────────
export function approvePRDept(prId: string, comments: string = "") {
  const today = new Date().toISOString().split("T")[0];
  generatedPRs = generatedPRs.map(pr => {
    if (pr.id !== prId) return pr;
    return {
      ...pr,
      currentStep: 3,
      status: "Pending Procurement & Finance",
      overallApprovalStatus: "Pending Procurement & Finance" as const,
      deptApproval: "Approved" as const,
      procurementApproval: "Pending" as const,
      financeApproval: "Pending" as const,
      approvalHistory: [...pr.approvalHistory, { step: 2, role: "Department Head", action: "Approved" as const, date: today, comments: comments || "Approved by department head" }],
    };
  });
  notifyListeners();
}

export function rejectPRDept(prId: string, comments: string = "") {
  const today = new Date().toISOString().split("T")[0];
  generatedPRs = generatedPRs.map(pr => {
    if (pr.id !== prId) return pr;
    return {
      ...pr,
      status: "Rejected",
      overallApprovalStatus: "Rejected" as const,
      deptApproval: "Rejected" as const,
      approvalHistory: [...pr.approvalHistory, { step: 2, role: "Department Head", action: "Rejected" as const, date: today, comments: comments || "Rejected by department head" }],
    };
  });
  notifyListeners();
}

// ─── Procurement Unit Approval (Step 3 — parallel with Finance) ─────────────
export function approvePRProcurement(prId: string, comments: string = "") {
  const today = new Date().toISOString().split("T")[0];
  generatedPRs = generatedPRs.map(pr => {
    if (pr.id !== prId) return pr;
    const updated = {
      ...pr,
      procurementApproval: "Approved" as const,
      approvalHistory: [...pr.approvalHistory, { step: 3, role: "Procurement Unit", action: "Approved" as const, date: today, comments: comments || "Policy and plan alignment verified" }],
    };
    // Check if both parallel approvals are done
    if (updated.financeApproval === "Approved") {
      if (updated.requiresSeniorApproval) {
        updated.currentStep = 5;
        updated.status = "Pending Senior Mgmt";
        updated.overallApprovalStatus = "Pending Senior Mgmt";
        updated.seniorMgmtApproval = "Pending";
      } else {
        updated.currentStep = 5;
        updated.status = "Approved";
        updated.overallApprovalStatus = "Approved";
      }
    }
    return updated;
  });
  notifyListeners();
}

export function rejectPRProcurement(prId: string, comments: string = "") {
  const today = new Date().toISOString().split("T")[0];
  generatedPRs = generatedPRs.map(pr => {
    if (pr.id !== prId) return pr;
    return {
      ...pr,
      status: "Rejected",
      overallApprovalStatus: "Rejected" as const,
      procurementApproval: "Rejected" as const,
      approvalHistory: [...pr.approvalHistory, { step: 3, role: "Procurement Unit", action: "Rejected" as const, date: today, comments: comments || "Rejected by procurement unit" }],
    };
  });
  notifyListeners();
}

// ─── Finance Team Approval (Step 4 — parallel with Procurement) ─────────────
export function approvePRFinance(prId: string, comments: string = "") {
  const today = new Date().toISOString().split("T")[0];
  generatedPRs = generatedPRs.map(pr => {
    if (pr.id !== prId) return pr;
    const updated = {
      ...pr,
      financeApproval: "Approved" as const,
      approvalHistory: [...pr.approvalHistory, { step: 4, role: "Finance Team", action: "Approved" as const, date: today, comments: comments || "Budget availability and funding source verified" }],
    };
    // Check if both parallel approvals are done
    if (updated.procurementApproval === "Approved") {
      if (updated.requiresSeniorApproval) {
        updated.currentStep = 5;
        updated.status = "Pending Senior Mgmt";
        updated.overallApprovalStatus = "Pending Senior Mgmt";
        updated.seniorMgmtApproval = "Pending";
      } else {
        updated.currentStep = 5;
        updated.status = "Approved";
        updated.overallApprovalStatus = "Approved";
      }
    }
    return updated;
  });
  notifyListeners();
}

export function rejectPRFinance(prId: string, comments: string = "") {
  const today = new Date().toISOString().split("T")[0];
  generatedPRs = generatedPRs.map(pr => {
    if (pr.id !== prId) return pr;
    return {
      ...pr,
      status: "Rejected",
      overallApprovalStatus: "Rejected" as const,
      financeApproval: "Rejected" as const,
      approvalHistory: [...pr.approvalHistory, { step: 4, role: "Finance Team", action: "Rejected" as const, date: today, comments: comments || "Rejected by finance team" }],
    };
  });
  notifyListeners();
}

// ─── Senior Management Approval (Step 5 — only if > $10,000) ────────────────
export function approvePRSeniorMgmt(prId: string, comments: string = "") {
  const today = new Date().toISOString().split("T")[0];
  generatedPRs = generatedPRs.map(pr => {
    if (pr.id !== prId) return pr;
    return {
      ...pr,
      currentStep: 5,
      status: "Approved",
      overallApprovalStatus: "Approved" as const,
      seniorMgmtApproval: "Approved" as const,
      approvalHistory: [...pr.approvalHistory, { step: 5, role: "Senior Management", action: "Approved" as const, date: today, comments: comments || "Final approval granted by senior management" }],
    };
  });
  notifyListeners();
}

export function rejectPRSeniorMgmt(prId: string, comments: string = "") {
  const today = new Date().toISOString().split("T")[0];
  generatedPRs = generatedPRs.map(pr => {
    if (pr.id !== prId) return pr;
    return {
      ...pr,
      status: "Rejected",
      overallApprovalStatus: "Rejected" as const,
      seniorMgmtApproval: "Rejected" as const,
      approvalHistory: [...pr.approvalHistory, { step: 5, role: "Senior Management", action: "Rejected" as const, date: today, comments: comments || "Rejected by senior management" }],
    };
  });
  notifyListeners();
}

// ─── PO Generation from Sourcing Flow ────────────────────────────────────────

export interface POGenerationInput {
  sourcePR: string;
  sourceSourcingCase: string;
  vendor: string;
  vendorEmail: string;
  vendorAddress: string;
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
    vendor: input.vendor,
    vendorEmail: input.vendorEmail,
    vendorAddress: input.vendorAddress,
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
    return { ...po, status: "Dispatched" as POStatus, dispatchedAt: now, vendorNotifiedAt: now };
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
  status: "Not Started" | "In Progress" | "Under Evaluation" | "Awarded" | "Contracted" | "Completed" | "Delayed";
  linkedBudgetLine?: string;
  linkedWorkPlan?: string;
  approvalStatus: "Draft" | "Pending Review" | "Approved" | "Rejected";
  version: number;
  changeHistory: PlanItemChange[];
  createdDate: string;
  lastModified: string;
}

let nextPlanItemSeq = 9; // seed uses 1–8

let procurementPlanItems: ProcurementPlanItem[] = [
  {
    id: "ppi-1", ppItemId: "PP-2026-001",
    activityDescription: "Training Materials — Stakeholder Engagement Workshops (Youth Employment)",
    category: "Goods", estimatedValue: 4500, fundingSource: "TAP",
    procurementMethod: "Competitive Bidding", initiationDate: "2026-02-15", awardDate: "2026-04-01", completionDate: "2026-05-15",
    responsiblePerson: "Ama Darko", department: "Programs",
    status: "In Progress", linkedBudgetLine: "BL-PROG-001", linkedWorkPlan: "WP-YE-2026",
    approvalStatus: "Approved", version: 1, changeHistory: [], createdDate: "2026-01-10", lastModified: "2026-02-15",
  },
  {
    id: "ppi-2", ppItemId: "PP-2026-002",
    activityDescription: "Laptops for Field Officers — Youth Employment Skills Development",
    category: "Goods", estimatedValue: 24000, fundingSource: "ATTP",
    procurementMethod: "Competitive Bidding", initiationDate: "2026-02-20", awardDate: "2026-04-15", completionDate: "2026-06-01",
    responsiblePerson: "Kwame Boateng", department: "IT",
    status: "In Progress", linkedBudgetLine: "BL-IT-003", linkedWorkPlan: "WP-YE-2026",
    approvalStatus: "Approved", version: 1, changeHistory: [], createdDate: "2026-01-10", lastModified: "2026-02-20",
  },
  {
    id: "ppi-3", ppItemId: "PP-2026-003",
    activityDescription: "M&E Framework Review Consultancy — Youth Employment Program",
    category: "Consultancy", estimatedValue: 15000, fundingSource: "Gates Foundation",
    procurementMethod: "Single Source", initiationDate: "2026-02-01", awardDate: "2026-03-15", completionDate: "2026-06-30",
    responsiblePerson: "Grace Owusu", department: "Programs",
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
    status: "Awarded", linkedBudgetLine: "BL-OPS-002",
    approvalStatus: "Approved", version: 1, changeHistory: [], createdDate: "2026-01-10", lastModified: "2026-03-20",
  },
  {
    id: "ppi-5", ppItemId: "PP-2026-005",
    activityDescription: "Audit Software License Renewal (TeamMate+)",
    category: "Services", estimatedValue: 12000, fundingSource: "TAP",
    procurementMethod: "Direct Purchase", initiationDate: "2026-01-15", awardDate: "2026-03-01", completionDate: "2026-03-31",
    responsiblePerson: "Abena Osei", department: "Finance",
    status: "Contracted", linkedBudgetLine: "BL-FIN-001", linkedWorkPlan: "WP-ADMIN-2026",
    approvalStatus: "Approved", version: 1, changeHistory: [], createdDate: "2026-01-05", lastModified: "2026-03-01",
  },
  {
    id: "ppi-6", ppItemId: "PP-2026-006",
    activityDescription: "Printing Services — Annual Report 2025",
    category: "Services", estimatedValue: 3200, fundingSource: "TAP",
    procurementMethod: "Request for Quotation", initiationDate: "2026-01-10", awardDate: "2026-02-15", completionDate: "2026-03-15",
    responsiblePerson: "Nana Yaw", department: "Programs",
    status: "Completed", linkedBudgetLine: "BL-PROG-005",
    approvalStatus: "Approved", version: 1, changeHistory: [], createdDate: "2026-01-05", lastModified: "2026-03-15",
  },
  {
    id: "ppi-7", ppItemId: "PP-2026-007",
    activityDescription: "Vehicle Rental — Community Outreach Campaign (Digital Literacy)",
    category: "Services", estimatedValue: 6000, fundingSource: "ATTP",
    procurementMethod: "Request for Quotation", initiationDate: "2026-02-01", awardDate: "2026-02-28", completionDate: "2026-03-31",
    responsiblePerson: "Kwaku Anane", department: "Programs",
    status: "Not Started", linkedBudgetLine: "BL-PROG-006", linkedWorkPlan: "WP-DL-2026",
    approvalStatus: "Approved", version: 1, changeHistory: [], createdDate: "2026-01-10", lastModified: "2026-01-10",
  },
  {
    id: "ppi-8", ppItemId: "PP-2026-008",
    activityDescription: "Chromebooks for Digital Literacy Computer Labs",
    category: "Goods", estimatedValue: 14000, fundingSource: "Gates Foundation",
    procurementMethod: "Competitive Bidding", initiationDate: "2026-01-20", awardDate: "2026-03-10", completionDate: "2026-04-30",
    responsiblePerson: "Kwame Boateng", department: "IT",
    status: "Awarded", linkedBudgetLine: "BL-IT-005", linkedWorkPlan: "WP-DL-2026",
    approvalStatus: "Approved", version: 1, changeHistory: [], createdDate: "2026-01-05", lastModified: "2026-03-10",
  },
];

export function getProcurementPlanItems(): ProcurementPlanItem[] {
  return procurementPlanItems;
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