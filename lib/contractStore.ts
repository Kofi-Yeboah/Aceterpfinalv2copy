// ──────────────────────────────────────────────────────────────────────────────
// Contract Management Store
// Contracts pushed here from Sourcing → Contract Award.
// ContractRepository.tsx reads from this store alongside its static data.
//
// The invoice, deliverable, change-request and close-out workflows all live
// here rather than in the components, because each one is a multi-party chain
// (CC → Procurement → Supervisor → Finance) and the guards that stop a stage
// being skipped have to sit where every caller passes through.
// ──────────────────────────────────────────────────────────────────────────────

import { notify, scheduleReminder, resolveReminder } from "./notificationStore";
import { recordSupplierEvaluation, recordContractAward } from "./supplierStore";

export interface ContractDocument {
  id: string;
  name: string;
  uploadedBy: string;
  date: string;
  type: string; // MIME or short label
  size: string; // human-readable e.g. "245 KB"
  version: number;
  /** Object URL from the file picker, so the document can be opened again. */
  url?: string;
}

export interface ContractDocumentGroup {
  docId: string;      // stable id across versions
  label: string;      // e.g. "Signed Contract"
  versions: ContractDocument[];
  currentVersion: number;
}

export interface ContractAmendment {
  id: string;
  amendmentNumber: string;
  date: string;
  description: string;
  type: "Extension" | "Value Change" | "Scope Change" | "Termination" | "Renewal";
  oldValue?: string;
  newValue?: string;
  approvedBy: string;
  status?: "Pending" | "Approved" | "Rejected";
  reason?: string;
  supportingDocs?: string[];
  impactCost?: number;
  impactTime?: string;
  requestedBy?: string;
}

export interface ContractMilestone {
  id: string;
  label: string;
  date: string;
  completed: boolean;
}

// ── NEW: Deliverable tracking ──
export type DeliverableStatus = "Pending" | "Submitted" | "Under Review" | "Accepted" | "Rejected";

export interface ContractDeliverable {
  id: string;
  milestoneRef: string;
  description: string;
  dueDate: string;
  actualDate?: string;
  status: DeliverableStatus;
  documents: string[];
  comments: string;
  paymentLinked?: string; // invoice id
  amount?: number;
  /** Who uploaded the evidence — normally the Contract Coordinator. */
  submittedBy?: string;
  /** Second-person sign-off: the CC cannot accept their own upload. */
  reviewedBy?: string;
  reviewDate?: string;
  reviewComments?: string;
  /** Goods received note / inspection form flags for goods and works. */
  goodsReceived?: boolean;
  inspectionPassed?: boolean;
}

// ── NEW: Invoice / Payment tracking ──
export type InvoiceStatus =
  | "Submitted"
  | "CC Reviewed"
  | "Procurement Approved"
  | "Supervisor Approved"
  | "Paid"
  | "Queried";

/** One step in the invoice's journey, so the approval chain is auditable. */
export interface InvoiceApprovalEntry {
  stage: InvoiceStatus | "Queried" | "Resubmitted";
  action: "Reviewed" | "Approved" | "Queried" | "Paid" | "Submitted" | "Resubmitted";
  by: string;
  role: string;
  date: string;
  comments: string;
}

export interface ContractInvoice {
  id: string;
  invoiceNumber: string;
  supplier: string;
  amount: number;
  dateSubmitted: string;
  datePaid?: string;
  amountPaid?: number;
  deliverableId?: string;
  status: InvoiceStatus;
  paymentInfo?: string;
  submittedVia: "Email" | "Manual";
  reviewedBy?: string;
  approvedBy?: string;
  paymentMethod?: "Wire Transfer" | "Cheque" | "Mobile Money";
  referenceNumber?: string;
  /** Set by the CC when confirming the deliverable meets contract specifications. */
  deliverableConfirmed?: boolean;
  procurementApprovedBy?: string;
  supervisorApprovedBy?: string;
  paidBy?: string;
  queryReason?: string;
  documents?: string[];
  /** The uploaded invoice itself, so it can be shown in the detail view. */
  documentFiles?: { name: string; url: string; type: string; size: string }[];
  approvalHistory?: InvoiceApprovalEntry[];
}

// ── NEW: Change Request ──
export interface ContractChangeRequest {
  id: string;
  changeNumber: number;
  contractRef: string;
  types: ("Scope Change" | "Time Extension" | "Cost Variation" | "Amendment to Terms" | "Deliverable Change")[];
  reason: string;
  description: string;
  supportingDocs: string[];
  estimatedCostImpact: number;
  estimatedTimeImpact: string;
  revisedValue?: number;
  revisedEndDate?: string;
  status: "Draft" | "Pending Approval" | "Approved" | "Rejected" | "Implemented";
  requestedBy: string;
  requestedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  /** Mirrors the requisition chain: Dept → Procurement → Finance → Senior Mgmt. */
  approvalTrail?: { role: string; by: string; action: "Approved" | "Rejected"; date: string; comments: string }[];
  /** Set once the approved change has been written into the contract record. */
  implementedDate?: string;
  originalValue?: number;
  originalEndDate?: string;
}

// ── NEW: Supplier Performance Evaluation ──
export interface PerformanceEvaluation {
  id: string;
  evaluationType: "Mid-Term" | "Final";
  evaluationDate: string;
  evaluator: string;
  supervisorApproval?: string;
  status: "Draft" | "CC Approved" | "Supervisor Approved" | "Final";
  criteria: { name: string; score: number; maxScore: number }[];
  overallScore: number;
  comments: string;
  supplierFlagged?: boolean;
}

// ── NEW: Contract Coordinator ──
export interface ContractCoordinator {
  id: string;
  name: string;
  role: string;
  email: string;
}

// ── Audit Trail ──
export interface AuditLogEntry {
  id: string;
  date: string;
  action: string;
  performedBy: string;
  details: string;
}

// ── NEW: Close-Out state ──
export interface ContractCloseOut {
  allDeliverablesCompleted: boolean;
  procurementCompliance: boolean;
  allPaymentsCompleted: boolean;
  performanceFinalized: boolean;
  allDocsUploaded: boolean;
  completionCertificate?: string;
  closureReport?: string;
  closedDate?: string;
  closedBy?: string;
}

export interface AwardedContract {
  id: string;
  contractNumber: string;
  title: string;
  type: string;
  party: string;
  sourcePR: string;
  sourceSourcingCase: string;
  category: string;
  method: string;
  value: number;
  startDate: string;
  endDate: string;
  status: "Active" | "Expiring Soon" | "Expired" | "Pending" | "Terminated" | "Renewed" | "Suspended" | "Under Variation" | "Closed";
  department: string;
  owner: string;
  awardDate: string;
  comments: string;
  documents: ContractDocumentGroup[];
  amendments: ContractAmendment[];
  milestones: ContractMilestone[];
  description?: string;
  paymentTerms?: string;
  deliveryTerms?: string;
  contractType?: "Lump Sum" | "Time Based";
  paymentFrequency?: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Milestone-Based";
  maxAmount?: number;
  coordinators?: ContractCoordinator[];
  deliverables?: ContractDeliverable[];
  invoices?: ContractInvoice[];
  changeRequests?: ContractChangeRequest[];
  performanceEvaluations?: PerformanceEvaluation[];
  closeOut?: ContractCloseOut;
  budgetLine?: string;
  fundingSource?: string;
  renewalDate?: string;
  deliverySchedule?: { item: string; quantity: string; expectedDate: string }[];
  paymentSchedule?: { description: string; amount: number; dueDate: string; linkedTo: string }[];
  auditLog?: AuditLogEntry[];
}

type Listener = () => void;
let listeners: Listener[] = [];

// ── Seed data: contracts already awarded from completed sourcing cases ──

let contracts: AwardedContract[] = [
  {
    id: "AC-1",
    contractNumber: "CNT-2024-001",
    title: "Consultant Fees — Survey Design",
    type: "Consultant",
    party: "Dr. Kwesi Appiah",
    sourcePR: "PR-2024-001",
    sourceSourcingCase: "SRC-2024-001",
    category: "Consultancy",
    method: "Direct Selection",
    value: 8000,
    startDate: "2024-12-20",
    endDate: "2025-06-20",
    status: "Active",
    department: "Programs",
    owner: "Ama Darko",
    awardDate: "2024-12-18",
    comments: "Survey design for youth employment baseline study.",
    contractType: "Lump Sum",
    paymentFrequency: "Milestone-Based",
    coordinators: [
      { id: "cc-1", name: "Ama Darko", role: "Lead Coordinator", email: "ama.darko@acet.org" },
      { id: "cc-2", name: "Kofi Mensah", role: "Technical Lead", email: "kofi.mensah@acet.org" },
    ],
    documents: [
      { docId: "dg-1", label: "Signed Contract", currentVersion: 1, versions: [{ id: "d-1-v1", name: "Contract_SurveyDesign_Signed.pdf", uploadedBy: "Ama Darko", date: "2024-12-18", type: "PDF", size: "1.2 MB", version: 1 }] },
      { docId: "dg-2", label: "Award Letter", currentVersion: 1, versions: [{ id: "d-2-v1", name: "AwardLetter_DrAppiah.pdf", uploadedBy: "Procurement Unit", date: "2024-12-17", type: "PDF", size: "340 KB", version: 1 }] },
    ],
    amendments: [],
    milestones: [
      { id: "ms-1", label: "Inception Report", date: "2025-01-15", completed: true },
      { id: "ms-2", label: "Draft Survey Instrument", date: "2025-03-01", completed: true },
      { id: "ms-3", label: "Final Survey Package", date: "2025-05-15", completed: false },
    ],
    deliverables: [
      { id: "del-1", milestoneRef: "ms-1", description: "Inception Report & Work Plan", dueDate: "2025-01-15", actualDate: "2025-01-14", status: "Accepted", documents: ["InceptionReport_v1.pdf"], comments: "Approved with minor edits", amount: 2000 },
      { id: "del-2", milestoneRef: "ms-2", description: "Draft Survey Instrument & Methodology", dueDate: "2025-03-01", actualDate: "2025-03-02", status: "Accepted", documents: ["DraftSurvey_v2.pdf", "Methodology_Note.pdf"], comments: "Accepted after revision", amount: 3000 },
      { id: "del-3", milestoneRef: "ms-3", description: "Final Survey Package with Training Manual", dueDate: "2025-05-15", status: "Pending", documents: [], comments: "", amount: 3000 },
    ],
    invoices: [
      { id: "inv-1", invoiceNumber: "INV-KA-001", supplier: "Dr. Kwesi Appiah", amount: 2000, dateSubmitted: "2025-01-16", datePaid: "2025-02-01", amountPaid: 2000, deliverableId: "del-1", status: "Paid", submittedVia: "Email", reviewedBy: "Ama Darko", approvedBy: "James Owusu", paymentInfo: "Wire transfer 01-Feb-2025" },
      { id: "inv-2", invoiceNumber: "INV-KA-002", supplier: "Dr. Kwesi Appiah", amount: 3000, dateSubmitted: "2025-03-05", datePaid: "2025-03-20", amountPaid: 3000, deliverableId: "del-2", status: "Paid", submittedVia: "Email", reviewedBy: "Ama Darko", approvedBy: "James Owusu", paymentInfo: "Wire transfer 20-Mar-2025" },
    ],
    changeRequests: [],
    performanceEvaluations: [],
    closeOut: { allDeliverablesCompleted: false, procurementCompliance: false, allPaymentsCompleted: false, performanceFinalized: false, allDocsUploaded: false },
    budgetLine: "BL-2024-PROG-001",
    fundingSource: "Core Program Funding",
    auditLog: [
      { id: "al-1", date: "2024-12-18", action: "Contract Created", performedBy: "Procurement Unit", details: "Contract CNT-2024-001 registered from sourcing case SRC-2024-001" },
      { id: "al-2", date: "2024-12-18", action: "Coordinator Assigned", performedBy: "Ama Darko", details: "Ama Darko assigned as Lead Coordinator" },
      { id: "al-3", date: "2024-12-18", action: "Document Uploaded", performedBy: "Ama Darko", details: "Signed contract uploaded: Contract_SurveyDesign_Signed.pdf" },
      { id: "al-4", date: "2025-01-14", action: "Deliverable Submitted", performedBy: "Dr. Kwesi Appiah", details: "Inception Report & Work Plan submitted" },
      { id: "al-5", date: "2025-01-15", action: "Deliverable Accepted", performedBy: "Ama Darko", details: "Inception Report approved with minor edits" },
      { id: "al-6", date: "2025-01-16", action: "Invoice Submitted", performedBy: "Dr. Kwesi Appiah", details: "INV-KA-001 for $2,000 submitted via Email" },
      { id: "al-7", date: "2025-02-01", action: "Payment Processed", performedBy: "Finance", details: "INV-KA-001 paid via wire transfer — $2,000" },
      { id: "al-8", date: "2025-03-02", action: "Deliverable Submitted", performedBy: "Dr. Kwesi Appiah", details: "Draft Survey Instrument & Methodology submitted" },
      { id: "al-9", date: "2025-03-03", action: "Deliverable Accepted", performedBy: "Ama Darko", details: "Draft Survey accepted after revision" },
      { id: "al-10", date: "2025-03-05", action: "Invoice Submitted", performedBy: "Dr. Kwesi Appiah", details: "INV-KA-002 for $3,000 submitted via Email" },
      { id: "al-11", date: "2025-03-20", action: "Payment Processed", performedBy: "Finance", details: "INV-KA-002 paid via wire transfer — $3,000" },
    ],
  },
  {
    id: "AC-2",
    contractNumber: "CNT-2024-002",
    title: "Printing & Materials",
    type: "Supplier",
    party: "PrintWorks Ghana Ltd",
    sourcePR: "PR-2024-001",
    sourceSourcingCase: "SRC-2024-002",
    category: "Goods",
    method: "Request for Quotation",
    value: 1050,
    startDate: "2024-12-22",
    endDate: "2025-03-22",
    status: "Active",
    department: "Programs",
    owner: "Ama Darko",
    awardDate: "2024-12-20",
    comments: "Printing of training materials (200 sets).",
    contractType: "Lump Sum",
    paymentFrequency: "Milestone-Based",
    coordinators: [
      { id: "cc-3", name: "Ama Darko", role: "Lead Coordinator", email: "ama.darko@acet.org" },
    ],
    documents: [
      { docId: "dg-3", label: "Signed Contract", currentVersion: 1, versions: [{ id: "d-3-v1", name: "Contract_PrintWorks_Signed.pdf", uploadedBy: "Ama Darko", date: "2024-12-20", type: "PDF", size: "890 KB", version: 1 }] },
    ],
    amendments: [],
    milestones: [
      { id: "ms-4", label: "Delivery of Printed Materials", date: "2025-02-15", completed: true },
    ],
    deliverables: [
      { id: "del-4", milestoneRef: "ms-4", description: "200 sets of training materials delivered", dueDate: "2025-02-15", actualDate: "2025-02-14", status: "Accepted", documents: ["DeliveryNote_PrintWorks.pdf", "GoodsReceivedNote.pdf"], comments: "All materials inspected and accepted", amount: 1050 },
    ],
    invoices: [
      { id: "inv-3", invoiceNumber: "INV-PW-001", supplier: "PrintWorks Ghana Ltd", amount: 1050, dateSubmitted: "2025-02-16", datePaid: "2025-03-01", amountPaid: 1050, deliverableId: "del-4", status: "Paid", submittedVia: "Manual", reviewedBy: "Ama Darko", approvedBy: "James Owusu", paymentInfo: "Cheque #2345" },
    ],
    changeRequests: [],
    performanceEvaluations: [
      { id: "pe-1", evaluationType: "Final", evaluationDate: "2025-03-10", evaluator: "Ama Darko", supervisorApproval: "James Owusu", status: "Final", criteria: [{ name: "Quality of deliverables", score: 9, maxScore: 10 }, { name: "Timeliness", score: 10, maxScore: 10 }, { name: "Cost control", score: 10, maxScore: 10 }, { name: "Compliance with terms", score: 9, maxScore: 10 }, { name: "Professionalism", score: 8, maxScore: 10 }], overallScore: 9.2, comments: "Excellent delivery, ahead of schedule." },
    ],
    closeOut: { allDeliverablesCompleted: true, procurementCompliance: true, allPaymentsCompleted: true, performanceFinalized: true, allDocsUploaded: true, completionCertificate: "CompletionCert_PrintWorks.pdf", closureReport: "ClosureReport_CNT002.pdf", closedDate: "2025-03-15", closedBy: "James Owusu" },
    budgetLine: "BL-2024-PROG-002",
    fundingSource: "Core Program Funding",
  },
  {
    id: "AC-3",
    contractNumber: "CNT-2025-003",
    title: "IT Infrastructure Upgrade — Phase 1",
    type: "Supplier",
    party: "TechSolutions Africa Ltd",
    sourcePR: "PR-2025-010",
    sourceSourcingCase: "SRC-2025-005",
    category: "Goods",
    method: "Open Competition",
    value: 125000,
    startDate: "2025-01-15",
    endDate: "2025-09-15",
    status: "Active",
    department: "IT",
    owner: "Eric Boateng",
    awardDate: "2025-01-10",
    comments: "Server room equipment, networking, and installation.",
    contractType: "Lump Sum",
    paymentFrequency: "Milestone-Based",
    coordinators: [
      { id: "cc-4", name: "Eric Boateng", role: "Lead Coordinator", email: "eric.boateng@acet.org" },
      { id: "cc-5", name: "Nana Esi", role: "IT Manager", email: "nana.esi@acet.org" },
      { id: "cc-6", name: "Felix Addo", role: "Procurement Liaison", email: "felix.addo@acet.org" },
    ],
    documents: [
      { docId: "dg-4", label: "Signed Contract", currentVersion: 1, versions: [{ id: "d-4-v1", name: "Contract_TechSolutions_Signed.pdf", uploadedBy: "Eric Boateng", date: "2025-01-10", type: "PDF", size: "2.4 MB", version: 1 }] },
      { docId: "dg-5", label: "Technical Specifications", currentVersion: 1, versions: [{ id: "d-5-v1", name: "TechSpecs_ITUpgrade.pdf", uploadedBy: "Nana Esi", date: "2025-01-12", type: "PDF", size: "4.1 MB", version: 1 }] },
    ],
    amendments: [],
    milestones: [
      { id: "ms-5", label: "Equipment Delivery", date: "2025-03-15", completed: true },
      { id: "ms-6", label: "Installation Complete", date: "2025-06-15", completed: false },
      { id: "ms-7", label: "Testing & Handover", date: "2025-08-30", completed: false },
    ],
    deliverables: [
      { id: "del-5", milestoneRef: "ms-5", description: "Delivery of all server and networking equipment", dueDate: "2025-03-15", actualDate: "2025-03-12", status: "Accepted", documents: ["DeliveryNote_TechSol.pdf", "InspectionReport.pdf"], comments: "All items verified against PO", amount: 75000 },
      { id: "del-6", milestoneRef: "ms-6", description: "Complete installation and configuration", dueDate: "2025-06-15", status: "Under Review", documents: ["InstallProgress_Mar.pdf"], comments: "On track, 60% complete", amount: 37500 },
      { id: "del-7", milestoneRef: "ms-7", description: "UAT, documentation, and handover", dueDate: "2025-08-30", status: "Pending", documents: [], comments: "", amount: 12500 },
    ],
    invoices: [
      { id: "inv-4", invoiceNumber: "INV-TS-001", supplier: "TechSolutions Africa Ltd", amount: 75000, dateSubmitted: "2025-03-14", datePaid: "2025-04-01", amountPaid: 75000, deliverableId: "del-5", status: "Paid", submittedVia: "Email", reviewedBy: "Eric Boateng", approvedBy: "Nana Esi", paymentInfo: "Wire transfer 01-Apr-2025" },
      { id: "inv-5", invoiceNumber: "INV-TS-002", supplier: "TechSolutions Africa Ltd", amount: 37500, dateSubmitted: "2025-06-10", deliverableId: "del-6", status: "CC Reviewed", submittedVia: "Email", reviewedBy: "Eric Boateng" },
    ],
    changeRequests: [
      { id: "cr-1", changeNumber: 1, contractRef: "CNT-2025-003", types: ["Scope Change", "Cost Variation"], reason: "Additional UPS units required for extended server room", description: "Add 4x 3kVA UPS units and cabling for redundancy in the new server room wing", supportingDocs: ["SupplierQuote_UPS.pdf", "JustificationMemo.pdf"], estimatedCostImpact: 18000, estimatedTimeImpact: "2 weeks", revisedValue: 143000, status: "Approved", requestedBy: "Nana Esi", requestedDate: "2025-04-10", approvedBy: "Management Committee", approvedDate: "2025-04-20" },
    ],
    performanceEvaluations: [],
    closeOut: { allDeliverablesCompleted: false, procurementCompliance: false, allPaymentsCompleted: false, performanceFinalized: false, allDocsUploaded: false },
    budgetLine: "BL-2025-IT-010",
    fundingSource: "Capital Expenditure Fund",
  },
  {
    id: "AC-4",
    contractNumber: "CNT-2025-004",
    title: "M&E Data Management System",
    type: "Service",
    party: "DataViz Consulting",
    sourcePR: "PR-2025-015",
    sourceSourcingCase: "SRC-2025-008",
    category: "Services",
    method: "Limited Competition",
    value: 45000,
    startDate: "2025-02-01",
    endDate: "2025-12-31",
    status: "Under Variation",
    department: "M&E",
    owner: "Grace Tetteh",
    awardDate: "2025-01-28",
    comments: "Custom M&E dashboard and data collection platform.",
    contractType: "Time Based",
    paymentFrequency: "Monthly",
    maxAmount: 45000,
    coordinators: [
      { id: "cc-7", name: "Grace Tetteh", role: "Lead Coordinator", email: "grace.tetteh@acet.org" },
      { id: "cc-8", name: "Samuel Osei", role: "M&E Specialist", email: "samuel.osei@acet.org" },
    ],
    documents: [
      { docId: "dg-6", label: "Signed Contract", currentVersion: 1, versions: [{ id: "d-6-v1", name: "Contract_DataViz_Signed.pdf", uploadedBy: "Grace Tetteh", date: "2025-01-28", type: "PDF", size: "1.8 MB", version: 1 }] },
    ],
    amendments: [],
    milestones: [
      { id: "ms-8", label: "Requirements & Design", date: "2025-03-01", completed: true },
      { id: "ms-9", label: "Development Sprint 1", date: "2025-05-01", completed: true },
      { id: "ms-10", label: "Development Sprint 2", date: "2025-07-01", completed: false },
      { id: "ms-11", label: "UAT & Deployment", date: "2025-10-01", completed: false },
    ],
    deliverables: [
      { id: "del-8", milestoneRef: "ms-8", description: "Requirements document & UI/UX designs", dueDate: "2025-03-01", actualDate: "2025-02-28", status: "Accepted", documents: ["Requirements_v1.pdf", "UIDesigns.pdf"], comments: "Approved by M&E team", amount: 8000 },
      { id: "del-9", milestoneRef: "ms-9", description: "Sprint 1: Core data collection module", dueDate: "2025-05-01", actualDate: "2025-05-05", status: "Accepted", documents: ["Sprint1_Release_Notes.pdf"], comments: "Minor delay, accepted", amount: 12000 },
      { id: "del-10", milestoneRef: "ms-10", description: "Sprint 2: Dashboard & reporting", dueDate: "2025-07-01", status: "Submitted", documents: ["Sprint2_Demo.pdf"], comments: "Under review", amount: 12000 },
      { id: "del-11", milestoneRef: "ms-11", description: "UAT, training, and deployment", dueDate: "2025-10-01", status: "Pending", documents: [], comments: "", amount: 13000 },
    ],
    invoices: [
      { id: "inv-6", invoiceNumber: "INV-DV-001", supplier: "DataViz Consulting", amount: 5000, dateSubmitted: "2025-02-28", datePaid: "2025-03-15", amountPaid: 5000, status: "Paid", submittedVia: "Email", reviewedBy: "Grace Tetteh", approvedBy: "James Owusu" },
      { id: "inv-7", invoiceNumber: "INV-DV-002", supplier: "DataViz Consulting", amount: 5000, dateSubmitted: "2025-03-31", datePaid: "2025-04-15", amountPaid: 5000, status: "Paid", submittedVia: "Email", reviewedBy: "Grace Tetteh", approvedBy: "James Owusu" },
      { id: "inv-8", invoiceNumber: "INV-DV-003", supplier: "DataViz Consulting", amount: 5000, dateSubmitted: "2025-04-30", datePaid: "2025-05-15", amountPaid: 5000, status: "Paid", submittedVia: "Email", reviewedBy: "Grace Tetteh", approvedBy: "James Owusu" },
      { id: "inv-9", invoiceNumber: "INV-DV-004", supplier: "DataViz Consulting", amount: 5000, dateSubmitted: "2025-05-31", status: "Procurement Approved", submittedVia: "Email", reviewedBy: "Grace Tetteh" },
    ],
    changeRequests: [
      { id: "cr-2", changeNumber: 1, contractRef: "CNT-2025-004", types: ["Scope Change", "Cost Variation", "Time Extension"], reason: "Donor requested additional beneficiary tracking module", description: "Add beneficiary tracking with GPS coordinates, photo verification, and offline sync capability", supportingDocs: ["DonorRequest_BenTracking.pdf", "TechnicalProposal_Addendum.pdf", "CostEstimate_v2.pdf"], estimatedCostImpact: 15000, estimatedTimeImpact: "3 months", revisedValue: 60000, revisedEndDate: "2026-03-31", status: "Pending Approval", requestedBy: "Grace Tetteh", requestedDate: "2025-06-01" },
    ],
    performanceEvaluations: [
      { id: "pe-2", evaluationType: "Mid-Term", evaluationDate: "2025-05-15", evaluator: "Grace Tetteh", supervisorApproval: "James Owusu", status: "Final", criteria: [{ name: "Quality of deliverables", score: 8, maxScore: 10 }, { name: "Timeliness", score: 7, maxScore: 10 }, { name: "Cost control", score: 9, maxScore: 10 }, { name: "Compliance with terms", score: 8, maxScore: 10 }, { name: "Professionalism", score: 9, maxScore: 10 }], overallScore: 8.2, comments: "Good performance overall. Minor delays in Sprint 1." },
    ],
    closeOut: { allDeliverablesCompleted: false, procurementCompliance: false, allPaymentsCompleted: false, performanceFinalized: false, allDocsUploaded: false },
    budgetLine: "BL-2025-ME-015",
    fundingSource: "Donor Grant — DFID",
  },
  {
    id: "AC-5",
    contractNumber: "CNT-2025-005",
    title: "Office Renovation Works",
    type: "Works",
    party: "BuildRight Construction Co.",
    sourcePR: "PR-2025-020",
    sourceSourcingCase: "SRC-2025-012",
    category: "Works",
    method: "Open Competition",
    value: 280000,
    startDate: "2025-03-01",
    endDate: "2025-12-31",
    status: "Suspended",
    department: "Admin",
    owner: "Felix Addo",
    awardDate: "2025-02-20",
    comments: "Complete renovation of 3rd floor office wing.",
    contractType: "Lump Sum",
    paymentFrequency: "Milestone-Based",
    coordinators: [
      { id: "cc-9", name: "Felix Addo", role: "Lead Coordinator", email: "felix.addo@acet.org" },
      { id: "cc-10", name: "Kwame Asante", role: "Facilities Manager", email: "kwame.asante@acet.org" },
    ],
    documents: [
      { docId: "dg-7", label: "Signed Contract", currentVersion: 1, versions: [{ id: "d-7-v1", name: "Contract_BuildRight_Signed.pdf", uploadedBy: "Felix Addo", date: "2025-02-20", type: "PDF", size: "3.5 MB", version: 1 }] },
      { docId: "dg-8", label: "Bill of Quantities", currentVersion: 1, versions: [{ id: "d-8-v1", name: "BOQ_Renovation.xlsx", uploadedBy: "Felix Addo", date: "2025-02-21", type: "XLSX", size: "1.1 MB", version: 1 }] },
    ],
    amendments: [
      { id: "amd-1", amendmentNumber: "1", date: "2025-04-15", description: "Suspension due to permit delays", type: "Extension", approvedBy: "Management Committee", status: "Approved", reason: "Building permit renewal delayed by municipality" },
    ],
    milestones: [
      { id: "ms-12", label: "Demolition & Structural Work", date: "2025-04-30", completed: true },
      { id: "ms-13", label: "Electrical & Plumbing", date: "2025-07-31", completed: false },
      { id: "ms-14", label: "Finishing & Handover", date: "2025-11-30", completed: false },
    ],
    deliverables: [
      { id: "del-12", milestoneRef: "ms-12", description: "Demolition complete, structural modifications done", dueDate: "2025-04-30", actualDate: "2025-04-28", status: "Accepted", documents: ["ProgressCert_Phase1.pdf", "InspectionReport_Structural.pdf"], comments: "Inspected and approved by structural engineer", amount: 84000 },
      { id: "del-13", milestoneRef: "ms-13", description: "Electrical wiring and plumbing installation", dueDate: "2025-07-31", status: "Pending", documents: [], comments: "Suspended pending permit resolution", amount: 112000 },
    ],
    invoices: [
      { id: "inv-10", invoiceNumber: "INV-BR-001", supplier: "BuildRight Construction Co.", amount: 84000, dateSubmitted: "2025-04-30", datePaid: "2025-05-20", amountPaid: 84000, deliverableId: "del-12", status: "Paid", submittedVia: "Manual", reviewedBy: "Felix Addo", approvedBy: "Kwame Asante", paymentInfo: "Wire transfer 20-May-2025" },
    ],
    changeRequests: [],
    performanceEvaluations: [],
    closeOut: { allDeliverablesCompleted: false, procurementCompliance: false, allPaymentsCompleted: false, performanceFinalized: false, allDocsUploaded: false },
    budgetLine: "BL-2025-ADMIN-020",
    fundingSource: "Operational Budget",
  },
];

let nextContractSeq = 20;

// ── "Last awarded" signal for cross-module navigation ──
let _lastAwardedContractNumber: string | null = null;
export function getLastAwardedContractNumber() { return _lastAwardedContractNumber; }
export function clearLastAwardedContractNumber() { _lastAwardedContractNumber = null; }

function notifyStoreListeners() {
  listeners.forEach(l => l());
}

export function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => { listeners = listeners.filter(l => l !== listener); };
}

export function getContracts(): AwardedContract[] {
  return contracts;
}

export function pushContract(opts: {
  contractNumber: string;
  title: string;
  party: string;
  sourcePR: string;
  sourceSourcingCase: string;
  category: string;
  method: string;
  value: number;
  department: string;
  owner: string;
  comments: string;
}): AwardedContract {
  const today = new Date().toISOString().split("T")[0];
  const end = new Date();
  end.setFullYear(end.getFullYear() + 1);

  const typeMap: Record<string, string> = {
    Consultancy: "Consultant",
    Services: "Service",
    Goods: "Supplier",
    Works: "Works",
  };

  nextContractSeq++;
  const newContract: AwardedContract = {
    id: `AC-${Date.now()}-${nextContractSeq}`,
    contractNumber: opts.contractNumber,
    title: opts.title,
    type: typeMap[opts.category] || "Supplier",
    party: opts.party,
    sourcePR: opts.sourcePR,
    sourceSourcingCase: opts.sourceSourcingCase,
    category: opts.category,
    method: opts.method,
    value: opts.value,
    startDate: today,
    endDate: end.toISOString().split("T")[0],
    status: "Active",
    department: opts.department,
    owner: opts.owner,
    awardDate: today,
    comments: opts.comments,
    documents: [],
    amendments: [],
    milestones: [],
  };

  contracts = [...contracts, newContract];
  _lastAwardedContractNumber = newContract.contractNumber;
  notifyStoreListeners();
  return newContract;
}

export function generateContractNumber(requisitionNumber: string): string {
  const year = new Date().getFullYear();
  if (requisitionNumber) {
    const digits = requisitionNumber.replace(/\D/g, "").slice(-3) || String(nextContractSeq).padStart(3, "0");
    return `CNT-${year}-${digits}`;
  }
  nextContractSeq++;
  return `CNT-${year}-${String(nextContractSeq).padStart(3, "0")}`;
}

export function registerContract(data: {
  title: string;
  party: string;
  sourcePR: string;
  category: string;
  method: string;
  value: number;
  startDate: string;
  endDate: string;
  renewalDate?: string;
  department: string;
  owner: string;
  comments: string;
  contractType: "Lump Sum" | "Time Based";
  paymentFrequency: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Milestone-Based";
  maxAmount?: number;
  coordinators: ContractCoordinator[];
  milestones: ContractMilestone[];
  deliverySchedule?: { item: string; quantity: string; expectedDate: string }[];
  paymentSchedule?: { description: string; amount: number; dueDate: string; linkedTo: string }[];
  budgetLine?: string;
  fundingSource?: string;
}): AwardedContract {
  const contractNumber = generateContractNumber(data.sourcePR);
  const typeMap: Record<string, string> = { Consultancy: "Consultant", Services: "Service", Goods: "Supplier", Works: "Works" };
  const today = new Date().toISOString().split("T")[0];

  const newContract: AwardedContract = {
    id: `AC-${Date.now()}-${++nextContractSeq}`,
    contractNumber,
    title: data.title,
    type: typeMap[data.category] || "Supplier",
    party: data.party,
    sourcePR: data.sourcePR,
    sourceSourcingCase: "",
    category: data.category,
    method: data.method,
    value: data.value,
    startDate: data.startDate,
    endDate: data.endDate,
    renewalDate: data.renewalDate,
    status: "Active",
    department: data.department,
    owner: data.owner,
    awardDate: today,
    comments: data.comments,
    contractType: data.contractType,
    paymentFrequency: data.paymentFrequency,
    maxAmount: data.maxAmount,
    coordinators: data.coordinators,
    documents: [],
    amendments: [],
    milestones: data.milestones,
    deliverables: data.milestones.map((ms, i) => ({
      id: `del-reg-${Date.now()}-${i}`,
      milestoneRef: ms.id,
      description: ms.label,
      dueDate: ms.date,
      status: "Pending" as const,
      documents: [],
      comments: "",
    })),
    invoices: [],
    changeRequests: [],
    performanceEvaluations: [],
    closeOut: { allDeliverablesCompleted: false, procurementCompliance: false, allPaymentsCompleted: false, performanceFinalized: false, allDocsUploaded: false },
    deliverySchedule: data.deliverySchedule,
    paymentSchedule: data.paymentSchedule,
    budgetLine: data.budgetLine,
    fundingSource: data.fundingSource,
  };

  contracts = [...contracts, newContract];
  _lastAwardedContractNumber = newContract.contractNumber;
  notifyStoreListeners();
  return newContract;
}

// ── Attach a document to an existing contract ──
export function addDocumentToContract(contractId: string, doc: { label: string; name: string; uploadedBy: string; type: string; size: string }) {
  const today = new Date().toISOString().split("T")[0];
  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    const existing = c.documents.find(dg => dg.label === doc.label);
    if (existing) {
      // New version
      const nextVer = existing.currentVersion + 1;
      existing.versions.push({
        id: `d-${Date.now()}-v${nextVer}`,
        name: doc.name,
        uploadedBy: doc.uploadedBy,
        date: today,
        type: doc.type,
        size: doc.size,
        version: nextVer,
      });
      existing.currentVersion = nextVer;
    } else {
      c.documents.push({
        docId: `dg-${Date.now()}`,
        label: doc.label,
        currentVersion: 1,
        versions: [{
          id: `d-${Date.now()}-v1`,
          name: doc.name,
          uploadedBy: doc.uploadedBy,
          date: today,
          type: doc.type,
          size: doc.size,
          version: 1,
        }],
      });
    }
    return { ...c };
  });
  notifyStoreListeners();
}

// ── Add amendment to a contract ──
export function addAmendment(contractId: string, amendment: Omit<ContractAmendment, "id">) {
  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    return {
      ...c,
      amendments: [...c.amendments, { ...amendment, id: `amd-${Date.now()}` }],
    };
  });
  notifyStoreListeners();
}

// ── Update contract status ──
export function updateContractStatus(contractId: string, status: AwardedContract["status"]) {
  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    return { ...c, status };
  });
  notifyStoreListeners();
}

// ── Find a contract by contractNumber ──
export function getContractByNumber(contractNumber: string): AwardedContract | undefined {
  return contracts.find(c => c.contractNumber === contractNumber);
}

// ── Update a contract in-place (used by Contract Management) ──
export function updateContract(contractId: string, updates: Partial<AwardedContract>) {
  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    return { ...c, ...updates };
  });
  notifyStoreListeners();
}

// ── Add audit log entry ──
export function addAuditLog(contractId: string, action: string, performedBy: string, details: string) {
  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    const log: AuditLogEntry = { id: `al-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, date: new Date().toISOString().split("T")[0], action, performedBy, details };
    return { ...c, auditLog: [...(c.auditLog || []), log] };
  });
  notifyStoreListeners();
}

// ── Add a deliverable to an existing contract (CC upload) ──
export function addDeliverableToContract(contractId: string, deliverable: Omit<ContractDeliverable, "id">) {
  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    const newDel: ContractDeliverable = { ...deliverable, id: `del-${Date.now()}` };
    return { ...c, deliverables: [...(c.deliverables || []), newDel] };
  });
  notifyDeliverableSubmitted(contractId, deliverable.description, deliverable.submittedBy ?? "Contract Coordinator");
  notifyStoreListeners();
}

// ══════════════════════════════════════════════════════════════════════════════
// WORKFLOWS
// ══════════════════════════════════════════════════════════════════════════════

const today = () => new Date().toISOString().split("T")[0];

function coordinatorNames(c: AwardedContract): string[] {
  return (c.coordinators ?? []).map(cc => cc.name);
}

function pushAudit(c: AwardedContract, action: string, performedBy: string, details: string): AwardedContract {
  const log: AuditLogEntry = {
    id: `al-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    date: today(),
    action,
    performedBy,
    details,
  };
  return { ...c, auditLog: [...(c.auditLog ?? []), log] };
}

// ── Deliverables ────────────────────────────────────────────────────────────

function notifyDeliverableSubmitted(contractId: string, description: string, by: string) {
  const c = contracts.find(x => x.id === contractId);
  if (!c) return;
  notify({
    category: "Approval",
    module: "Contract Management",
    subject: `Deliverable awaiting review — ${c.contractNumber}`,
    body: `"${description}" was submitted by ${by} on ${c.contractNumber} (${c.title}). A second reviewer must accept or reject it before it can support an invoice.`,
    recipientRole: "Procurement",
    entityRef: c.contractNumber,
  });
}

/**
 * Contract Coordinator submits evidence against a milestone. The status is
 * forced to "Submitted" regardless of what the form offered: the requirement is
 * that whatever the CC uploads "may be approved by another person before the
 * system would accept it", so a CC cannot mark their own work Accepted.
 */
export function submitDeliverable(
  contractId: string,
  deliverable: Omit<ContractDeliverable, "id" | "status" | "reviewedBy" | "reviewDate">,
  submittedBy: string
): ContractDeliverable | undefined {
  let created: ContractDeliverable | undefined;
  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;

    // Registration seeds one Pending deliverable per milestone. Evidence
    // arriving for that milestone advances the existing record rather than
    // creating a second one alongside it, which would leave the original
    // Pending for ever and block close-out.
    const existing = (c.deliverables ?? []).find(
      d => d.milestoneRef === deliverable.milestoneRef && d.status === "Pending" && d.documents.length === 0
    );

    created = {
      ...deliverable,
      id: existing?.id ?? `del-${Date.now()}`,
      status: "Submitted",
      submittedBy,
      actualDate: deliverable.actualDate || today(),
      // Keep whatever the plan set up where the upload did not restate it.
      amount: deliverable.amount ?? existing?.amount,
      dueDate: deliverable.dueDate || existing?.dueDate || today(),
    };

    const deliverables = existing
      ? (c.deliverables ?? []).map(d => (d.id === existing.id ? created! : d))
      : [...(c.deliverables ?? []), created];

    const next = { ...c, deliverables };
    return pushAudit(next, "Deliverable Submitted", submittedBy, `${deliverable.description} submitted with ${deliverable.documents.length} document(s)`);
  });

  if (created) {
    resolveReminder(`${contractId}:${created.milestoneRef}`, "Deliverable");
    notifyDeliverableSubmitted(contractId, created.description, submittedBy);
    notifyStoreListeners();
  }
  return created;
}

/** Updates an existing deliverable's evidence without changing its review state. */
export function updateDeliverable(
  contractId: string,
  deliverableId: string,
  updates: Partial<Omit<ContractDeliverable, "id">>,
  updatedBy: string
) {
  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    const next = {
      ...c,
      deliverables: (c.deliverables ?? []).map(d => (d.id === deliverableId ? { ...d, ...updates } : d)),
    };
    return pushAudit(next, "Deliverable Updated", updatedBy, `Deliverable ${deliverableId} updated: ${Object.keys(updates).join(", ")}`);
  });
  notifyStoreListeners();
}

/**
 * Second-person review. `reviewer` must differ from the submitter — that
 * separation is the whole point of the control.
 */
export function reviewDeliverable(
  contractId: string,
  deliverableId: string,
  decision: "Under Review" | "Accepted" | "Rejected",
  reviewer: string,
  comments: string
): { ok: boolean; error?: string } {
  const contract = contracts.find(c => c.id === contractId);
  const deliverable = contract?.deliverables?.find(d => d.id === deliverableId);
  if (!contract || !deliverable) return { ok: false, error: "Deliverable not found." };

  if (decision !== "Under Review" && deliverable.submittedBy && deliverable.submittedBy === reviewer) {
    return {
      ok: false,
      error: `${reviewer} submitted this deliverable and cannot also approve it. A second reviewer is required.`,
    };
  }
  if (decision === "Rejected" && !comments.trim()) {
    return { ok: false, error: "A reason is required when rejecting a deliverable." };
  }

  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    const next = {
      ...c,
      deliverables: (c.deliverables ?? []).map(d =>
        d.id === deliverableId
          ? { ...d, status: decision, reviewedBy: reviewer, reviewDate: today(), reviewComments: comments }
          : d
      ),
      // Accepting the final evidence for a milestone marks that milestone done.
      milestones: c.milestones.map(m =>
        decision === "Accepted" && m.id === deliverable.milestoneRef ? { ...m, completed: true } : m
      ),
    };
    return pushAudit(next, `Deliverable ${decision}`, reviewer, `${deliverable.description}: ${comments || decision}`);
  });

  notify({
    category: decision === "Rejected" ? "Alert" : "Info",
    module: "Contract Management",
    subject: `Deliverable ${decision.toLowerCase()} — ${contract.contractNumber}`,
    body: `"${deliverable.description}" was ${decision.toLowerCase()} by ${reviewer}.${comments ? `\n\n${comments}` : ""}`,
    recipientName: deliverable.submittedBy,
    recipientRole: "Contract Coordinator",
    entityRef: contract.contractNumber,
    priority: decision === "Rejected" ? "High" : "Normal",
  });

  notifyStoreListeners();
  return { ok: true };
}

// ── Invoices ────────────────────────────────────────────────────────────────

function appendInvoiceHistory(inv: ContractInvoice, entry: InvoiceApprovalEntry): ContractInvoice {
  return { ...inv, approvalHistory: [...(inv.approvalHistory ?? []), entry] };
}

function mapInvoice(
  contractId: string,
  invoiceId: string,
  fn: (inv: ContractInvoice, c: AwardedContract) => ContractInvoice,
  audit?: { action: string; by: string; details: string }
) {
  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    const next = {
      ...c,
      invoices: (c.invoices ?? []).map(i => (i.id === invoiceId ? fn(i, c) : i)),
    };
    return audit ? pushAudit(next, audit.action, audit.by, audit.details) : next;
  });
  notifyStoreListeners();
}

export function getInvoice(contractId: string, invoiceId: string): ContractInvoice | undefined {
  return contracts.find(c => c.id === contractId)?.invoices?.find(i => i.id === invoiceId);
}

/**
 * Records a supplier invoice against the contract.
 *
 * A deliverable link is mandatory: "Before payment, the Contract Coordinator
 * must upload related deliverables, link each invoice to the corresponding
 * deliverable". Enforcing it here rather than in the form means an invoice
 * arriving from the supplier portal is held to the same rule.
 */
export function addInvoice(
  contractId: string,
  invoice: Omit<ContractInvoice, "id" | "status" | "approvalHistory">,
  submittedBy: string
): { ok: boolean; error?: string; invoice?: ContractInvoice } {
  const contract = contracts.find(c => c.id === contractId);
  if (!contract) return { ok: false, error: "Contract not found." };

  if (!invoice.invoiceNumber?.trim()) return { ok: false, error: "An invoice number is required." };
  if (!invoice.amount || invoice.amount <= 0) return { ok: false, error: "Invoice amount must be greater than zero." };

  const duplicate = (contract.invoices ?? []).some(
    i => i.invoiceNumber.trim().toLowerCase() === invoice.invoiceNumber.trim().toLowerCase()
  );
  if (duplicate) {
    return { ok: false, error: `Invoice ${invoice.invoiceNumber} has already been recorded against this contract.` };
  }

  // Guard against paying out more than the contract (or its revised ceiling) allows.
  const ceiling = contract.maxAmount ?? contract.value;
  const committed = (contract.invoices ?? [])
    .filter(i => i.status !== "Queried")
    .reduce((sum, i) => sum + i.amount, 0);
  if (committed + invoice.amount > ceiling) {
    return {
      ok: false,
      error: `This invoice would bring total invoiced value to $${(committed + invoice.amount).toLocaleString()}, above the contract ceiling of $${ceiling.toLocaleString()}. Raise a cost variation first.`,
    };
  }

  const created: ContractInvoice = {
    ...invoice,
    id: `inv-${Date.now()}`,
    status: "Submitted",
    approvalHistory: [
      {
        stage: "Submitted",
        action: "Submitted",
        by: submittedBy,
        role: "Contract Coordinator",
        date: today(),
        comments: `Invoice received via ${invoice.submittedVia}`,
      },
    ],
  };

  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    const next = { ...c, invoices: [...(c.invoices ?? []), created] };
    return pushAudit(next, "Invoice Submitted", submittedBy, `${created.invoiceNumber} for $${created.amount.toLocaleString()} submitted via ${created.submittedVia}`);
  });

  notify({
    category: "Approval",
    module: "Invoices & Payments",
    subject: `Invoice ${created.invoiceNumber} awaiting deliverable matching`,
    body: `${created.supplier} submitted ${created.invoiceNumber} for $${created.amount.toLocaleString()} against ${contract.contractNumber}. The Contract Coordinator must match it to a deliverable and confirm the deliverable meets contract specifications before it can progress.`,
    recipientRole: "Contract Coordinator",
    entityRef: created.invoiceNumber,
  });

  scheduleReminder({
    entityRef: created.invoiceNumber,
    entityType: "Invoice",
    module: "Invoices & Payments",
    subject: `Invoice ${created.invoiceNumber} awaiting Contract Coordinator review`,
    body: `${created.supplier}'s invoice for $${created.amount.toLocaleString()} on ${contract.contractNumber} has not yet been matched to a deliverable.`,
    recipientRole: "Contract Coordinator",
    dueDate: today(),
    reminderAfterHours: 48,
    escalateAfterHours: 72,
    escalateToRole: "Procurement",
  });

  notifyStoreListeners();
  return { ok: true, invoice: created };
}

/**
 * Stage 1 — Contract Coordinator matches the invoice to a deliverable and
 * confirms the deliverable meets specification.
 */
export function ccReviewInvoice(
  contractId: string,
  invoiceId: string,
  opts: { deliverableId: string; specificationsConfirmed: boolean; reviewedBy: string; comments?: string }
): { ok: boolean; error?: string } {
  const contract = contracts.find(c => c.id === contractId);
  const invoice = contract?.invoices?.find(i => i.id === invoiceId);
  if (!contract || !invoice) return { ok: false, error: "Invoice not found." };
  if (invoice.status !== "Submitted" && invoice.status !== "Queried") {
    return { ok: false, error: `Invoice is already at "${invoice.status}" and cannot be reviewed again at this stage.` };
  }
  if (!opts.deliverableId) {
    return { ok: false, error: "Link the invoice to a deliverable before submitting the review." };
  }

  const deliverable = contract.deliverables?.find(d => d.id === opts.deliverableId);
  if (!deliverable) return { ok: false, error: "The selected deliverable no longer exists." };
  if (deliverable.status !== "Accepted") {
    return {
      ok: false,
      error: `Deliverable "${deliverable.description}" is ${deliverable.status}. Only an Accepted deliverable can support an invoice.`,
    };
  }
  if (!opts.specificationsConfirmed) {
    return { ok: false, error: "You must confirm the deliverable meets contract specifications." };
  }

  mapInvoice(
    contractId,
    invoiceId,
    inv =>
      appendInvoiceHistory(
        {
          ...inv,
          status: "CC Reviewed",
          deliverableId: opts.deliverableId,
          deliverableConfirmed: true,
          reviewedBy: opts.reviewedBy,
        },
        {
          stage: "CC Reviewed",
          action: "Reviewed",
          by: opts.reviewedBy,
          role: "Contract Coordinator",
          date: today(),
          comments: opts.comments || `Matched to "${deliverable.description}"; specifications confirmed.`,
        }
      ),
    {
      action: "Invoice Reviewed by Coordinator",
      by: opts.reviewedBy,
      details: `${invoice.invoiceNumber} matched to deliverable "${deliverable.description}"`,
    }
  );

  // Link back so the deliverable shows which invoice it paid.
  updateDeliverable(contractId, opts.deliverableId, { paymentLinked: invoiceId }, opts.reviewedBy);

  resolveReminder(invoice.invoiceNumber, "Invoice");
  notify({
    category: "Approval",
    module: "Invoices & Payments",
    subject: `Invoice ${invoice.invoiceNumber} ready for Procurement review`,
    body: `${opts.reviewedBy} matched ${invoice.invoiceNumber} ($${invoice.amount.toLocaleString()}) to "${deliverable.description}" and confirmed it meets specification. Procurement must now validate compliance with the contract.`,
    recipientRole: "Procurement",
    entityRef: invoice.invoiceNumber,
  });
  scheduleReminder({
    entityRef: invoice.invoiceNumber,
    entityType: "Invoice",
    module: "Invoices & Payments",
    subject: `Invoice ${invoice.invoiceNumber} awaiting Procurement review`,
    body: `${invoice.supplier}'s invoice on ${contract.contractNumber} has been matched and is awaiting Procurement validation.`,
    recipientRole: "Procurement",
    dueDate: today(),
    reminderAfterHours: 48,
    escalateAfterHours: 72,
    escalateToRole: "Senior Management",
  });

  return { ok: true };
}

/** Stage 2 — Procurement validates compliance with the contract. */
export function procurementApproveInvoice(
  contractId: string,
  invoiceId: string,
  approvedBy: string,
  comments = ""
): { ok: boolean; error?: string } {
  const contract = contracts.find(c => c.id === contractId);
  const invoice = contract?.invoices?.find(i => i.id === invoiceId);
  if (!contract || !invoice) return { ok: false, error: "Invoice not found." };
  if (invoice.status !== "CC Reviewed") {
    return {
      ok: false,
      error: `Invoice must be reviewed and matched by the Contract Coordinator first (currently "${invoice.status}").`,
    };
  }

  mapInvoice(
    contractId,
    invoiceId,
    inv =>
      appendInvoiceHistory(
        { ...inv, status: "Procurement Approved", procurementApprovedBy: approvedBy },
        {
          stage: "Procurement Approved",
          action: "Approved",
          by: approvedBy,
          role: "Procurement",
          date: today(),
          comments: comments || "Compliance with contract terms verified.",
        }
      ),
    { action: "Invoice Approved by Procurement", by: approvedBy, details: `${invoice.invoiceNumber} cleared procurement review` }
  );

  resolveReminder(invoice.invoiceNumber, "Invoice");
  const supervisors = coordinatorNames(contract);
  notify({
    category: "Approval",
    module: "Invoices & Payments",
    subject: `Invoice ${invoice.invoiceNumber} awaiting supervisor approval`,
    body: `Procurement cleared ${invoice.invoiceNumber} ($${invoice.amount.toLocaleString()}) on ${contract.contractNumber}. The coordinator's supervisor must give final approval before Finance can pay.${
      supervisors.length ? `\n\nContract coordinators: ${supervisors.join(", ")}.` : ""
    }`,
    recipientRole: "Supervisor",
    entityRef: invoice.invoiceNumber,
  });
  scheduleReminder({
    entityRef: invoice.invoiceNumber,
    entityType: "Invoice",
    module: "Invoices & Payments",
    subject: `Invoice ${invoice.invoiceNumber} awaiting supervisor approval`,
    body: `Procurement-approved invoice on ${contract.contractNumber} is awaiting final supervisor sign-off.`,
    recipientRole: "Supervisor",
    dueDate: today(),
    reminderAfterHours: 48,
    escalateAfterHours: 72,
    escalateToRole: "Senior Management",
  });

  return { ok: true };
}

/** Stage 3 — the coordinator's supervisor gives final approval. */
export function supervisorApproveInvoice(
  contractId: string,
  invoiceId: string,
  approvedBy: string,
  comments = ""
): { ok: boolean; error?: string } {
  const contract = contracts.find(c => c.id === contractId);
  const invoice = contract?.invoices?.find(i => i.id === invoiceId);
  if (!contract || !invoice) return { ok: false, error: "Invoice not found." };
  if (invoice.status !== "Procurement Approved") {
    return {
      ok: false,
      error: `Procurement must approve the invoice before supervisor sign-off (currently "${invoice.status}").`,
    };
  }
  if (invoice.reviewedBy === approvedBy) {
    return {
      ok: false,
      error: `${approvedBy} performed the coordinator review and cannot also give supervisor approval.`,
    };
  }

  mapInvoice(
    contractId,
    invoiceId,
    inv =>
      appendInvoiceHistory(
        { ...inv, status: "Supervisor Approved", supervisorApprovedBy: approvedBy, approvedBy },
        {
          stage: "Supervisor Approved",
          action: "Approved",
          by: approvedBy,
          role: "Supervisor",
          date: today(),
          comments: comments || "Final approval granted.",
        }
      ),
    { action: "Invoice Approved by Supervisor", by: approvedBy, details: `${invoice.invoiceNumber} approved for payment` }
  );

  resolveReminder(invoice.invoiceNumber, "Invoice");
  notify({
    category: "Approval",
    module: "Invoices & Payments",
    subject: `Invoice ${invoice.invoiceNumber} cleared for payment`,
    body: `${invoice.supplier}'s invoice for $${invoice.amount.toLocaleString()} on ${contract.contractNumber} has completed all approvals. Finance may now process payment.`,
    recipientRole: "Finance",
    entityRef: invoice.invoiceNumber,
    priority: "High",
  });
  scheduleReminder({
    entityRef: invoice.invoiceNumber,
    entityType: "Invoice",
    module: "Invoices & Payments",
    subject: `Invoice ${invoice.invoiceNumber} awaiting payment`,
    body: `Fully approved invoice on ${contract.contractNumber} is awaiting Finance payment processing.`,
    recipientRole: "Finance",
    dueDate: today(),
    reminderAfterHours: 72,
    escalateAfterHours: 120,
    escalateToRole: "Senior Management",
  });

  return { ok: true };
}

/** Any reviewer can query an invoice back to the supplier with a documented reason. */
export function queryInvoice(
  contractId: string,
  invoiceId: string,
  reason: string,
  queriedBy: string,
  role: string
): { ok: boolean; error?: string } {
  if (!reason.trim()) return { ok: false, error: "A reason is required when querying an invoice." };
  const contract = contracts.find(c => c.id === contractId);
  const invoice = contract?.invoices?.find(i => i.id === invoiceId);
  if (!contract || !invoice) return { ok: false, error: "Invoice not found." };
  if (invoice.status === "Paid") return { ok: false, error: "A paid invoice cannot be queried." };

  mapInvoice(
    contractId,
    invoiceId,
    inv =>
      appendInvoiceHistory(
        { ...inv, status: "Queried", queryReason: reason },
        { stage: "Queried", action: "Queried", by: queriedBy, role, date: today(), comments: reason }
      ),
    { action: "Invoice Queried", by: queriedBy, details: `${invoice.invoiceNumber} queried: ${reason}` }
  );

  resolveReminder(invoice.invoiceNumber, "Invoice");
  notify({
    category: "Alert",
    module: "Invoices & Payments",
    subject: `Invoice ${invoice.invoiceNumber} queried`,
    body: `${queriedBy} (${role}) queried ${invoice.invoiceNumber} on ${contract.contractNumber}.\n\nReason: ${reason}\n\nThe invoice must be corrected and resubmitted.`,
    recipientRole: "Contract Coordinator",
    entityRef: invoice.invoiceNumber,
    priority: "High",
  });

  return { ok: true };
}

/** Returns a queried invoice to the start of the chain after correction. */
export function resubmitInvoice(
  contractId: string,
  invoiceId: string,
  resubmittedBy: string,
  comments = ""
): { ok: boolean; error?: string } {
  const invoice = getInvoice(contractId, invoiceId);
  if (!invoice) return { ok: false, error: "Invoice not found." };
  if (invoice.status !== "Queried") return { ok: false, error: "Only a queried invoice can be resubmitted." };

  mapInvoice(
    contractId,
    invoiceId,
    inv =>
      appendInvoiceHistory(
        { ...inv, status: "Submitted", queryReason: undefined, deliverableConfirmed: false },
        {
          stage: "Resubmitted",
          action: "Resubmitted",
          by: resubmittedBy,
          role: "Contract Coordinator",
          date: today(),
          comments: comments || "Query addressed and invoice resubmitted.",
        }
      ),
    { action: "Invoice Resubmitted", by: resubmittedBy, details: `${invoice.invoiceNumber} resubmitted after query` }
  );

  notify({
    category: "Approval",
    module: "Invoices & Payments",
    subject: `Invoice ${invoice.invoiceNumber} resubmitted`,
    body: `${resubmittedBy} addressed the query on ${invoice.invoiceNumber} and resubmitted it for coordinator review.`,
    recipientRole: "Contract Coordinator",
    entityRef: invoice.invoiceNumber,
  });

  return { ok: true };
}

/** Stage 4 — Finance pays and the contract balance moves. */
export function recordInvoicePayment(
  contractId: string,
  invoiceId: string,
  payment: {
    datePaid: string;
    amountPaid: number;
    paymentMethod: "Wire Transfer" | "Cheque" | "Mobile Money";
    referenceNumber: string;
    paidBy: string;
  }
): { ok: boolean; error?: string } {
  const contract = contracts.find(c => c.id === contractId);
  const invoice = contract?.invoices?.find(i => i.id === invoiceId);
  if (!contract || !invoice) return { ok: false, error: "Invoice not found." };
  if (invoice.status !== "Supervisor Approved") {
    return {
      ok: false,
      error: `Payment requires full approval. Invoice is currently "${invoice.status}" — it must reach "Supervisor Approved" first.`,
    };
  }
  if (!payment.referenceNumber.trim()) return { ok: false, error: "A payment reference number is required." };
  if (!payment.amountPaid || payment.amountPaid <= 0) return { ok: false, error: "Amount paid must be greater than zero." };

  mapInvoice(
    contractId,
    invoiceId,
    inv =>
      appendInvoiceHistory(
        {
          ...inv,
          status: "Paid",
          datePaid: payment.datePaid,
          amountPaid: payment.amountPaid,
          paymentMethod: payment.paymentMethod,
          referenceNumber: payment.referenceNumber,
          paidBy: payment.paidBy,
          paymentInfo: `${payment.paymentMethod} ref ${payment.referenceNumber} on ${payment.datePaid}`,
        },
        {
          stage: "Paid",
          action: "Paid",
          by: payment.paidBy,
          role: "Finance",
          date: payment.datePaid,
          comments: `${payment.paymentMethod} — reference ${payment.referenceNumber}`,
        }
      ),
    {
      action: "Payment Processed",
      by: payment.paidBy,
      details: `${invoice.invoiceNumber} paid $${payment.amountPaid.toLocaleString()} via ${payment.paymentMethod} (ref ${payment.referenceNumber})`,
    }
  );

  resolveReminder(invoice.invoiceNumber, "Invoice");
  notify({
    category: "Info",
    module: "Invoices & Payments",
    subject: `Payment processed — ${invoice.invoiceNumber}`,
    body: `$${payment.amountPaid.toLocaleString()} paid to ${invoice.supplier} on ${payment.datePaid} via ${payment.paymentMethod} (ref ${payment.referenceNumber}).`,
    recipientRole: "Contract Coordinator",
    entityRef: invoice.invoiceNumber,
  });

  return { ok: true };
}

/** Total paid and remaining balance, honouring any approved cost variation. */
export function getContractFinancials(c: AwardedContract) {
  const invoices = c.invoices ?? [];
  const totalPaid = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + (i.amountPaid ?? i.amount), 0);
  const pending = invoices
    .filter(i => i.status !== "Paid" && i.status !== "Queried")
    .reduce((s, i) => s + i.amount, 0);
  const ceiling = c.maxAmount ?? c.value;
  return { totalPaid, pending, balance: ceiling - totalPaid, ceiling };
}

// ── Change requests ─────────────────────────────────────────────────────────

/** The chain an amendment walks, mirroring a fresh procurement request. */
export const CHANGE_APPROVAL_CHAIN = ["Department Head", "Procurement", "Finance", "Senior Management"] as const;

export function submitChangeRequest(
  contractId: string,
  cr: Omit<ContractChangeRequest, "id" | "changeNumber" | "status" | "approvalTrail" | "revisedValue" | "revisedEndDate">
): { ok: boolean; error?: string; changeRequest?: ContractChangeRequest } {
  const contract = contracts.find(c => c.id === contractId);
  if (!contract) return { ok: false, error: "Contract not found." };
  if (!cr.reason.trim()) return { ok: false, error: "A reason for the change is required." };
  if (!cr.description.trim()) return { ok: false, error: "A detailed description of the change is required." };
  if (!cr.types.length) return { ok: false, error: "Select at least one change type." };
  if (!cr.supportingDocs.length) {
    return { ok: false, error: "At least one supporting document is required (supplier proposal, justification memo, or an approved change document)." };
  }

  const existing = contract.changeRequests ?? [];
  const revisedValue = contract.value + (cr.estimatedCostImpact || 0);
  const revisedEndDate = computeRevisedEndDate(contract.endDate, cr.estimatedTimeImpact);

  const created: ContractChangeRequest = {
    ...cr,
    id: `cr-${Date.now()}`,
    changeNumber: existing.length + 1,
    status: "Pending Approval",
    revisedValue,
    revisedEndDate,
    originalValue: contract.value,
    originalEndDate: contract.endDate,
    approvalTrail: [],
  };

  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    const next = { ...c, changeRequests: [...existing, created], status: "Under Variation" as const };
    return pushAudit(next, "Change Request Submitted", cr.requestedBy, `Amendment #${created.changeNumber}: ${cr.types.join(", ")} — ${cr.reason}`);
  });

  notify({
    category: "Approval",
    module: "Contract Management",
    subject: `Amendment #${created.changeNumber} raised on ${contract.contractNumber}`,
    body: `${cr.requestedBy} raised a change request on ${contract.contractNumber} (${contract.title}).\n\nTypes: ${cr.types.join(", ")}\nReason: ${cr.reason}\nCost impact: $${(cr.estimatedCostImpact || 0).toLocaleString()} (revised value $${revisedValue.toLocaleString()})\nTime impact: ${cr.estimatedTimeImpact || "none"}\n\nIt follows the standard procurement approval chain: ${CHANGE_APPROVAL_CHAIN.join(" → ")}.`,
    recipientRole: "Department Head",
    entityRef: contract.contractNumber,
    priority: "High",
  });
  scheduleReminder({
    entityRef: `${contract.contractNumber}-CR${created.changeNumber}`,
    entityType: "Change Request",
    module: "Contract Management",
    subject: `Amendment #${created.changeNumber} on ${contract.contractNumber} awaiting approval`,
    body: `Change request raised by ${cr.requestedBy} is awaiting the next approval in the chain.`,
    recipientRole: "Department Head",
    dueDate: today(),
    reminderAfterHours: 48,
    escalateAfterHours: 72,
    escalateToRole: "Senior Management",
  });

  notifyStoreListeners();
  return { ok: true, changeRequest: created };
}

/** Parses "3 months" / "2 weeks" / "14 days" into a revised completion date. */
export function computeRevisedEndDate(endDate: string, timeImpact: string): string | undefined {
  if (!timeImpact?.trim()) return undefined;
  const match = timeImpact.match(/(-?\d+(?:\.\d+)?)\s*(day|week|month|year)/i);
  if (!match) return undefined;
  const qty = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  const d = new Date(endDate);
  if (Number.isNaN(d.getTime())) return undefined;
  if (unit === "day") d.setDate(d.getDate() + qty);
  else if (unit === "week") d.setDate(d.getDate() + qty * 7);
  else if (unit === "month") d.setMonth(d.getMonth() + qty);
  else if (unit === "year") d.setFullYear(d.getFullYear() + qty);
  return d.toISOString().split("T")[0];
}

/**
 * Records one approval in the chain. The change is only written into the
 * contract once every station has signed — see `implementChangeRequest`.
 */
export function approveChangeRequestStep(
  contractId: string,
  crId: string,
  role: (typeof CHANGE_APPROVAL_CHAIN)[number],
  approvedBy: string,
  comments = ""
): { ok: boolean; error?: string; fullyApproved?: boolean } {
  const contract = contracts.find(c => c.id === contractId);
  const cr = contract?.changeRequests?.find(x => x.id === crId);
  if (!contract || !cr) return { ok: false, error: "Change request not found." };
  if (cr.status !== "Pending Approval") {
    return { ok: false, error: `Change request is "${cr.status}" and is no longer awaiting approval.` };
  }

  const trail = cr.approvalTrail ?? [];
  const expectedIndex = trail.filter(t => t.action === "Approved").length;
  const expectedRole = CHANGE_APPROVAL_CHAIN[expectedIndex];
  if (role !== expectedRole) {
    return { ok: false, error: `${expectedRole} must approve next in the chain, not ${role}.` };
  }
  if (trail.some(t => t.by === approvedBy && t.action === "Approved")) {
    return { ok: false, error: `${approvedBy} has already approved this amendment.` };
  }

  const newTrail = [...trail, { role, by: approvedBy, action: "Approved" as const, date: today(), comments }];
  const fullyApproved = newTrail.filter(t => t.action === "Approved").length === CHANGE_APPROVAL_CHAIN.length;

  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    const next = {
      ...c,
      changeRequests: (c.changeRequests ?? []).map(x =>
        x.id === crId
          ? {
              ...x,
              approvalTrail: newTrail,
              status: fullyApproved ? ("Approved" as const) : x.status,
              approvedBy: fullyApproved ? approvedBy : x.approvedBy,
              approvedDate: fullyApproved ? today() : x.approvedDate,
            }
          : x
      ),
    };
    return pushAudit(next, `Change Request ${role} Approval`, approvedBy, `Amendment #${cr.changeNumber} approved by ${role}${comments ? `: ${comments}` : ""}`);
  });

  if (fullyApproved) {
    resolveReminder(`${contract.contractNumber}-CR${cr.changeNumber}`, "Change Request");
    notify({
      category: "Info",
      module: "Contract Management",
      subject: `Amendment #${cr.changeNumber} approved — ${contract.contractNumber}`,
      body: `The change request has cleared all approvals. Applying it will revise the contract value to $${(cr.revisedValue ?? contract.value).toLocaleString()}${cr.revisedEndDate ? ` and the completion date to ${cr.revisedEndDate}` : ""}.`,
      recipientRole: "Procurement",
      entityRef: contract.contractNumber,
      priority: "High",
    });
    // Apply immediately: the approved amendment is the contract from here on.
    implementChangeRequest(contractId, crId, approvedBy);
  } else {
    const nextRole = CHANGE_APPROVAL_CHAIN[expectedIndex + 1];
    notify({
      category: "Approval",
      module: "Contract Management",
      subject: `Amendment #${cr.changeNumber} awaiting ${nextRole} approval`,
      body: `${role} approved the amendment on ${contract.contractNumber}. It now requires ${nextRole} approval.`,
      recipientRole: nextRole,
      entityRef: contract.contractNumber,
    });
    scheduleReminder({
      entityRef: `${contract.contractNumber}-CR${cr.changeNumber}`,
      entityType: "Change Request",
      module: "Contract Management",
      subject: `Amendment #${cr.changeNumber} on ${contract.contractNumber} awaiting ${nextRole}`,
      body: `Change request is awaiting ${nextRole} approval.`,
      recipientRole: nextRole,
      dueDate: today(),
      reminderAfterHours: 48,
      escalateAfterHours: 72,
      escalateToRole: "Senior Management",
    });
  }

  notifyStoreListeners();
  return { ok: true, fullyApproved };
}

export function rejectChangeRequest(
  contractId: string,
  crId: string,
  role: string,
  rejectedBy: string,
  reason: string
): { ok: boolean; error?: string } {
  if (!reason.trim()) return { ok: false, error: "A reason is required when rejecting a change request." };
  const contract = contracts.find(c => c.id === contractId);
  const cr = contract?.changeRequests?.find(x => x.id === crId);
  if (!contract || !cr) return { ok: false, error: "Change request not found." };

  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    const remaining = (c.changeRequests ?? []).filter(x => x.id !== crId && x.status === "Pending Approval");
    const next = {
      ...c,
      changeRequests: (c.changeRequests ?? []).map(x =>
        x.id === crId
          ? {
              ...x,
              status: "Rejected" as const,
              rejectionReason: reason,
              approvalTrail: [...(x.approvalTrail ?? []), { role, by: rejectedBy, action: "Rejected" as const, date: today(), comments: reason }],
            }
          : x
      ),
      // Only drop out of "Under Variation" when nothing else is pending.
      status: remaining.length === 0 && c.status === "Under Variation" ? ("Active" as const) : c.status,
    };
    return pushAudit(next, "Change Request Rejected", rejectedBy, `Amendment #${cr.changeNumber} rejected by ${role}: ${reason}`);
  });

  resolveReminder(`${contract.contractNumber}-CR${cr.changeNumber}`, "Change Request");
  notify({
    category: "Alert",
    module: "Contract Management",
    subject: `Amendment #${cr.changeNumber} rejected — ${contract.contractNumber}`,
    body: `${rejectedBy} (${role}) rejected the change request.\n\nReason: ${reason}`,
    recipientName: cr.requestedBy,
    recipientRole: "Contract Coordinator",
    entityRef: contract.contractNumber,
    priority: "High",
  });

  notifyStoreListeners();
  return { ok: true };
}

/**
 * Writes an approved amendment into the contract: revised value, revised
 * completion date, extended deliverable schedule, and an entry in the formal
 * amendment register.
 */
export function implementChangeRequest(contractId: string, crId: string, by: string): { ok: boolean; error?: string } {
  const contract = contracts.find(c => c.id === contractId);
  const cr = contract?.changeRequests?.find(x => x.id === crId);
  if (!contract || !cr) return { ok: false, error: "Change request not found." };
  if (cr.status !== "Approved") return { ok: false, error: "Only an approved change request can be implemented." };

  const newValue = cr.revisedValue ?? contract.value;
  const newEnd = cr.revisedEndDate ?? contract.endDate;

  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    const stillPending = (c.changeRequests ?? []).some(x => x.id !== crId && x.status === "Pending Approval");

    const amendment: ContractAmendment = {
      id: `amd-${Date.now()}`,
      amendmentNumber: String(cr.changeNumber),
      date: today(),
      description: cr.description,
      type: cr.types.includes("Time Extension")
        ? "Extension"
        : cr.types.includes("Cost Variation")
          ? "Value Change"
          : cr.types.includes("Scope Change")
            ? "Scope Change"
            : "Renewal",
      oldValue: `$${c.value.toLocaleString()} / ends ${c.endDate}`,
      newValue: `$${newValue.toLocaleString()} / ends ${newEnd}`,
      approvedBy: cr.approvedBy ?? by,
      status: "Approved",
      reason: cr.reason,
      supportingDocs: cr.supportingDocs,
      impactCost: cr.estimatedCostImpact,
      impactTime: cr.estimatedTimeImpact,
      requestedBy: cr.requestedBy,
    };

    const next: AwardedContract = {
      ...c,
      value: newValue,
      // A time-based contract's ceiling moves with an approved cost variation.
      maxAmount: c.maxAmount !== undefined ? c.maxAmount + (cr.estimatedCostImpact || 0) : c.maxAmount,
      endDate: newEnd,
      status: stillPending ? "Under Variation" : "Active",
      amendments: [...c.amendments, amendment],
      changeRequests: (c.changeRequests ?? []).map(x =>
        x.id === crId ? { ...x, status: "Implemented" as const, implementedDate: today() } : x
      ),
    };
    return pushAudit(next, "Change Request Implemented", by, `Amendment #${cr.changeNumber} applied: value $${c.value.toLocaleString()} → $${newValue.toLocaleString()}, end date ${c.endDate} → ${newEnd}`);
  });

  notify({
    category: "Info",
    module: "Contract Management",
    subject: `Contract ${contract.contractNumber} revised by Amendment #${cr.changeNumber}`,
    body: `Contract value is now $${newValue.toLocaleString()} and the completion date is ${newEnd}. Payment schedule and deliverable dates should be reviewed against the revised terms.`,
    recipientRole: "Finance",
    entityRef: contract.contractNumber,
  });

  notifyStoreListeners();
  return { ok: true };
}

// ── Performance evaluation ──────────────────────────────────────────────────

export function addPerformanceEvaluation(
  contractId: string,
  evaluation: Omit<PerformanceEvaluation, "id">
): { ok: boolean; error?: string } {
  const contract = contracts.find(c => c.id === contractId);
  if (!contract) return { ok: false, error: "Contract not found." };
  if (!evaluation.evaluator.trim()) return { ok: false, error: "An evaluator is required." };
  if (evaluation.supervisorApproval && evaluation.supervisorApproval === evaluation.evaluator) {
    return { ok: false, error: "The supervisor approval must come from someone other than the evaluator." };
  }

  const record: PerformanceEvaluation = { ...evaluation, id: `pe-${Date.now()}` };

  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    const next = { ...c, performanceEvaluations: [...(c.performanceEvaluations ?? []), record] };
    return pushAudit(next, "Performance Evaluation", evaluation.evaluator, `${evaluation.evaluationType} evaluation scored ${evaluation.overallScore}/10${evaluation.supervisorApproval ? `, approved by ${evaluation.supervisorApproval}` : " (awaiting supervisor approval)"}`);
  });

  // Push the scorecard onto the supplier profile so it informs future sourcing.
  recordSupplierEvaluation(contract.party, {
    contractNumber: contract.contractNumber,
    contractTitle: contract.title,
    evaluationType: evaluation.evaluationType,
    evaluationDate: evaluation.evaluationDate,
    evaluator: evaluation.evaluator,
    supervisorApproval: evaluation.supervisorApproval,
    criteria: evaluation.criteria,
    overallScore: evaluation.overallScore,
    comments: evaluation.comments,
  });

  notifyStoreListeners();
  return { ok: true };
}

// ── Close-out ───────────────────────────────────────────────────────────────

export function updateCloseOut(contractId: string, updates: Partial<ContractCloseOut>, by: string) {
  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    const base: ContractCloseOut = c.closeOut ?? {
      allDeliverablesCompleted: false, procurementCompliance: false, allPaymentsCompleted: false,
      performanceFinalized: false, allDocsUploaded: false,
    };
    const next = { ...c, closeOut: { ...base, ...updates } };
    return pushAudit(next, "Close-Out Updated", by, `Checklist updated: ${Object.keys(updates).join(", ")}`);
  });
  notifyStoreListeners();
}

/** Verifies each close-out condition against the contract's actual state. */
export function verifyCloseOutReadiness(c: AwardedContract): { key: keyof ContractCloseOut; label: string; satisfied: boolean; detail: string }[] {
  const deliverables = c.deliverables ?? [];
  const invoices = c.invoices ?? [];
  const outstandingDeliverables = deliverables.filter(d => d.status !== "Accepted");
  const unpaidInvoices = invoices.filter(i => i.status !== "Paid" && i.status !== "Queried");
  const finalEval = (c.performanceEvaluations ?? []).find(e => e.evaluationType === "Final");
  const hasSignedContract = c.documents.some(d => /signed contract|purchase order/i.test(d.label));

  return [
    {
      key: "allDeliverablesCompleted",
      label: "All deliverables completed and accepted",
      satisfied: deliverables.length > 0 && outstandingDeliverables.length === 0,
      detail: deliverables.length === 0
        ? "No deliverables recorded on this contract."
        : outstandingDeliverables.length === 0
          ? `All ${deliverables.length} deliverables accepted.`
          : `${outstandingDeliverables.length} outstanding: ${outstandingDeliverables.map(d => d.description).join(", ")}.`,
    },
    {
      key: "procurementCompliance",
      label: "Procurement confirms compliance with contract terms",
      satisfied: !!c.closeOut?.procurementCompliance,
      detail: "Manual confirmation by the Procurement Unit.",
    },
    {
      key: "allPaymentsCompleted",
      label: "All payments completed",
      satisfied: invoices.length > 0 && unpaidInvoices.length === 0,
      detail: unpaidInvoices.length === 0
        ? `All ${invoices.length} invoices settled.`
        : `${unpaidInvoices.length} invoice(s) not yet paid: ${unpaidInvoices.map(i => i.invoiceNumber).join(", ")}.`,
    },
    {
      key: "performanceFinalized",
      label: "Final supplier performance evaluation completed",
      satisfied: !!finalEval && !!finalEval.supervisorApproval,
      detail: !finalEval
        ? "No final evaluation recorded."
        : finalEval.supervisorApproval
          ? `Scored ${finalEval.overallScore}/10, approved by ${finalEval.supervisorApproval}.`
          : "Final evaluation awaiting supervisor approval.",
    },
    {
      key: "allDocsUploaded",
      label: "All required documents uploaded",
      satisfied: hasSignedContract,
      detail: hasSignedContract
        ? `${c.documents.length} document group(s) on file.`
        : "The signed contract or purchase order has not been uploaded.",
    },
  ];
}

export function closeContract(
  contractId: string,
  by: string,
  artefacts: { completionCertificate: string; closureReport: string }
): { ok: boolean; error?: string } {
  const contract = contracts.find(c => c.id === contractId);
  if (!contract) return { ok: false, error: "Contract not found." };

  const checks = verifyCloseOutReadiness(contract);
  const failed = checks.filter(ch => !ch.satisfied);
  if (failed.length > 0) {
    return { ok: false, error: `Cannot close: ${failed.map(f => f.label).join("; ")}.` };
  }
  if (!artefacts.completionCertificate || !artefacts.closureReport) {
    return { ok: false, error: "Generate the Certificate of Completion and the Final Closure Report before closing." };
  }

  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    const next: AwardedContract = {
      ...c,
      status: "Closed",
      closeOut: {
        allDeliverablesCompleted: true,
        procurementCompliance: true,
        allPaymentsCompleted: true,
        performanceFinalized: true,
        allDocsUploaded: true,
        completionCertificate: artefacts.completionCertificate,
        closureReport: artefacts.closureReport,
        closedDate: today(),
        closedBy: by,
      },
    };
    return pushAudit(next, "Contract Closed", by, `Contract closed. Certificate: ${artefacts.completionCertificate}; Closure report: ${artefacts.closureReport}`);
  });

  resolveReminder(contract.contractNumber, "Contract");
  notify({
    category: "Info",
    module: "Contract Management",
    subject: `Contract ${contract.contractNumber} closed`,
    body: `${contract.title} with ${contract.party} was closed by ${by}. Certificate of Completion and Final Closure Report have been generated.`,
    recipientRole: "Procurement",
    entityRef: contract.contractNumber,
  });

  notifyStoreListeners();
  return { ok: true };
}

// ── Enrichment from sourcing ────────────────────────────────────────────────

/**
 * Fills in a contract created by the sourcing award, which arrives as a shell
 * with no coordinators, schedule or deliverables. Without this the awarded
 * record could never be brought up to a manageable state.
 */
export function enrichContract(
  contractId: string,
  data: {
    title?: string;
    startDate?: string;
    endDate?: string;
    renewalDate?: string;
    contractType?: "Lump Sum" | "Time Based";
    paymentFrequency?: AwardedContract["paymentFrequency"];
    maxAmount?: number;
    coordinators?: ContractCoordinator[];
    milestones?: ContractMilestone[];
    deliverySchedule?: AwardedContract["deliverySchedule"];
    paymentSchedule?: AwardedContract["paymentSchedule"];
    budgetLine?: string;
    fundingSource?: string;
    value?: number;
  },
  by: string
): { ok: boolean; error?: string } {
  const contract = contracts.find(c => c.id === contractId);
  if (!contract) return { ok: false, error: "Contract not found." };

  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;

    // Milestones supplied here seed deliverables, but never duplicate ones
    // already tracked against the same milestone.
    const existingRefs = new Set((c.deliverables ?? []).map(d => d.milestoneRef));
    const newMilestones = data.milestones ?? c.milestones;
    const seeded = (data.milestones ?? [])
      .filter(m => !existingRefs.has(m.id))
      .map((m, i) => ({
        id: `del-enr-${Date.now()}-${i}`,
        milestoneRef: m.id,
        description: m.label,
        dueDate: m.date,
        status: "Pending" as const,
        documents: [],
        comments: "",
      }));

    const next: AwardedContract = {
      ...c,
      ...(data.title ? { title: data.title } : {}),
      ...(data.value !== undefined ? { value: data.value } : {}),
      startDate: data.startDate ?? c.startDate,
      endDate: data.endDate ?? c.endDate,
      renewalDate: data.renewalDate ?? c.renewalDate,
      contractType: data.contractType ?? c.contractType,
      paymentFrequency: data.paymentFrequency ?? c.paymentFrequency,
      maxAmount: data.maxAmount ?? c.maxAmount,
      coordinators: data.coordinators ?? c.coordinators ?? [],
      milestones: newMilestones,
      deliverables: [...(c.deliverables ?? []), ...seeded],
      invoices: c.invoices ?? [],
      changeRequests: c.changeRequests ?? [],
      performanceEvaluations: c.performanceEvaluations ?? [],
      closeOut: c.closeOut ?? {
        allDeliverablesCompleted: false, procurementCompliance: false, allPaymentsCompleted: false,
        performanceFinalized: false, allDocsUploaded: false,
      },
      deliverySchedule: data.deliverySchedule ?? c.deliverySchedule,
      paymentSchedule: data.paymentSchedule ?? c.paymentSchedule,
      budgetLine: data.budgetLine ?? c.budgetLine,
      fundingSource: data.fundingSource ?? c.fundingSource,
    };
    return pushAudit(next, "Contract Details Completed", by, `Contract enriched with ${data.coordinators?.length ?? 0} coordinator(s), ${newMilestones.length} milestone(s) and payment schedule`);
  });

  const updated = contracts.find(c => c.id === contractId);
  if (updated) syncContractReminders(updated);
  notifyStoreListeners();
  return { ok: true };
}

// ── Reminders ───────────────────────────────────────────────────────────────

/** Queues deliverable-due and contract-expiry reminders for one contract. */
export function syncContractReminders(c: AwardedContract) {
  if (c.status === "Closed") return;

  (c.deliverables ?? [])
    .filter(d => d.status === "Pending" || d.status === "Submitted" || d.status === "Under Review")
    .forEach(d => {
      scheduleReminder({
        entityRef: `${c.id}:${d.milestoneRef}`,
        entityType: "Deliverable",
        module: "Contract Management",
        subject: `Deliverable due on ${c.contractNumber}: ${d.description}`,
        body: `"${d.description}" under ${c.contractNumber} (${c.party}) is due ${d.dueDate}. Current status: ${d.status}.`,
        recipientName: c.coordinators?.[0]?.name,
        recipientRole: "Contract Coordinator",
        dueDate: d.dueDate,
        reminderAfterHours: 24 * 7,
        escalateAfterHours: 24 * 14,
        escalateToRole: "Procurement",
      });
    });

  scheduleReminder({
    entityRef: c.contractNumber,
    entityType: "Contract",
    module: "Contract Management",
    subject: `Contract ${c.contractNumber} expires ${c.endDate}`,
    body: `${c.title} with ${c.party} reaches its end date on ${c.endDate}. Confirm whether it will be closed out, extended or renewed.`,
    recipientRole: "Procurement",
    dueDate: c.endDate,
    reminderAfterHours: 24 * 7,
    escalateAfterHours: 24 * 30,
  });
}

export function syncAllContractReminders() {
  contracts.forEach(syncContractReminders);
}

// ── Aggregate reads ─────────────────────────────────────────────────────────

export function daysUntil(dateStr: string): number {
  return Math.round((new Date(dateStr).getTime() - new Date(today()).getTime()) / 86_400_000);
}

export function getOverdueDeliverables(): { contract: AwardedContract; deliverable: ContractDeliverable; daysOverdue: number }[] {
  const out: { contract: AwardedContract; deliverable: ContractDeliverable; daysOverdue: number }[] = [];
  contracts.forEach(c => {
    if (c.status === "Closed") return;
    (c.deliverables ?? []).forEach(d => {
      if (d.status === "Accepted") return;
      const days = daysUntil(d.dueDate);
      if (days < 0) out.push({ contract: c, deliverable: d, daysOverdue: -days });
    });
  });
  return out.sort((a, b) => b.daysOverdue - a.daysOverdue);
}

export function getUpcomingDeliverables(withinDays = 30) {
  const out: { contract: AwardedContract; deliverable: ContractDeliverable; daysLeft: number }[] = [];
  contracts.forEach(c => {
    if (c.status === "Closed") return;
    (c.deliverables ?? []).forEach(d => {
      if (d.status === "Accepted") return;
      const days = daysUntil(d.dueDate);
      if (days >= 0 && days <= withinDays) out.push({ contract: c, deliverable: d, daysLeft: days });
    });
  });
  return out.sort((a, b) => a.daysLeft - b.daysLeft);
}

export function getExpiringContracts(withinDays = 90) {
  return contracts
    .filter(c => c.status !== "Closed")
    .map(c => ({ contract: c, daysLeft: daysUntil(c.endDate) }))
    .filter(r => r.daysLeft >= 0 && r.daysLeft <= withinDays)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

export function getContractStats() {
  const active = contracts.filter(c => c.status === "Active").length;
  const totalValue = contracts.reduce((s, c) => s + c.value, 0);
  const totalPaid = contracts.reduce((s, c) => s + getContractFinancials(c).totalPaid, 0);
  const pendingDeliverables = contracts.reduce(
    (s, c) => s + (c.deliverables ?? []).filter(d => d.status !== "Accepted").length, 0
  );
  const unpaidInvoices = contracts.reduce(
    (s, c) => s + (c.invoices ?? []).filter(i => i.status !== "Paid" && i.status !== "Queried").length, 0
  );
  const pendingVariations = contracts.reduce(
    (s, c) => s + (c.changeRequests ?? []).filter(cr => cr.status === "Pending Approval").length, 0
  );
  return {
    total: contracts.length, active, totalValue, totalPaid,
    pendingDeliverables, unpaidInvoices, pendingVariations,
    expiringSoon: getExpiringContracts(60).length,
    overdueDeliverables: getOverdueDeliverables().length,
  };
}

/** Every invoice across every contract, for the invoice & payment report. */
export function getAllInvoices(): { contract: AwardedContract; invoice: ContractInvoice }[] {
  return contracts.flatMap(c => (c.invoices ?? []).map(invoice => ({ contract: c, invoice })));
}

export function getAllChangeRequests(): { contract: AwardedContract; changeRequest: ContractChangeRequest }[] {
  return contracts.flatMap(c => (c.changeRequests ?? []).map(changeRequest => ({ contract: c, changeRequest })));
}

/** Contract-level risk signals for the contract risk report. */
export function getContractRisks(): { contract: AwardedContract; risks: string[]; severity: "Low" | "Medium" | "High" }[] {
  return contracts
    .filter(c => c.status !== "Closed")
    .map(c => {
      const risks: string[] = [];
      const overdue = (c.deliverables ?? []).filter(d => d.status !== "Accepted" && daysUntil(d.dueDate) < 0);
      if (overdue.length) risks.push(`${overdue.length} overdue deliverable(s)`);

      const queried = (c.invoices ?? []).filter(i => i.status === "Queried");
      if (queried.length >= 2) risks.push(`${queried.length} queried invoices — recurring billing disputes`);
      else if (queried.length === 1) risks.push("1 queried invoice");

      const variations = (c.changeRequests ?? []).filter(cr => cr.status === "Approved" || cr.status === "Implemented");
      if (variations.length >= 3) risks.push(`${variations.length} approved variations — excessive change`);
      const scopeChanges = variations.filter(cr => cr.types.includes("Scope Change"));
      if (scopeChanges.length >= 2) risks.push("Repeated scope changes — scope creep");

      const costGrowth = variations.reduce((s, cr) => s + (cr.estimatedCostImpact || 0), 0);
      if (costGrowth > 0 && c.value > 0 && costGrowth / (c.value - costGrowth) > 0.2) {
        risks.push(`Contract value grown ${Math.round((costGrowth / (c.value - costGrowth)) * 100)}% through variations`);
      }

      const expiry = daysUntil(c.endDate);
      if (expiry >= 0 && expiry <= 30) risks.push(`Expires in ${expiry} days`);
      else if (expiry < 0) risks.push(`Passed end date ${-expiry} days ago without close-out`);

      const evals = c.performanceEvaluations ?? [];
      const poor = evals.filter(e => e.overallScore < 5);
      if (poor.length) risks.push(`Performance scored below 5 on ${poor.length} evaluation(s)`);

      const severity: "Low" | "Medium" | "High" = risks.length >= 3 ? "High" : risks.length >= 1 ? "Medium" : "Low";
      return { contract: c, risks, severity };
    })
    .filter(r => r.risks.length > 0)
    .sort((a, b) => b.risks.length - a.risks.length);
}

// ── Award registration into the supplier profile ──────────────────────────────

/** Called after an award so the supplier's contract history and totals update. */
export function registerAwardWithSupplier(c: AwardedContract) {
  recordContractAward(c.party, {
    contractNumber: c.contractNumber,
    title: c.title,
    value: c.value,
    awardDate: c.awardDate,
    status: c.status,
    fundingSource: c.fundingSource,
  });
}