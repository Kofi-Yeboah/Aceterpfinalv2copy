// ──────────────────────────────────────────────────────────────────────────────
// Contract Management Store
// Contracts pushed here from Sourcing → Contract Award.
// ContractRepository.tsx reads from this store alongside its static data.
// ──────────────────────────────────────────────────────────────────────────────

export interface ContractDocument {
  id: string;
  name: string;
  uploadedBy: string;
  date: string;
  type: string; // MIME or short label
  size: string; // human-readable e.g. "245 KB"
  version: number;
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
export interface ContractDeliverable {
  id: string;
  milestoneRef: string;
  description: string;
  dueDate: string;
  actualDate?: string;
  status: "Pending" | "Submitted" | "Under Review" | "Accepted" | "Rejected";
  documents: string[];
  comments: string;
  paymentLinked?: string; // invoice id
  amount?: number;
}

// ── NEW: Invoice / Payment tracking ──
export interface ContractInvoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  amount: number;
  dateSubmitted: string;
  datePaid?: string;
  amountPaid?: number;
  deliverableId?: string;
  status: "Submitted" | "CC Reviewed" | "Procurement Approved" | "Supervisor Approved" | "Paid" | "Queried";
  paymentInfo?: string;
  submittedVia: "Vendor Portal" | "Email" | "Manual";
  reviewedBy?: string;
  approvedBy?: string;
  paymentMethod?: "Wire Transfer" | "Cheque" | "Mobile Money";
  referenceNumber?: string;
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
}

// ── NEW: Vendor Performance Evaluation ──
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
  vendorFlagged?: boolean;
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
      { id: "inv-1", invoiceNumber: "INV-KA-001", vendor: "Dr. Kwesi Appiah", amount: 2000, dateSubmitted: "2025-01-16", datePaid: "2025-02-01", amountPaid: 2000, deliverableId: "del-1", status: "Paid", submittedVia: "Email", reviewedBy: "Ama Darko", approvedBy: "James Owusu", paymentInfo: "Wire transfer 01-Feb-2025" },
      { id: "inv-2", invoiceNumber: "INV-KA-002", vendor: "Dr. Kwesi Appiah", amount: 3000, dateSubmitted: "2025-03-05", datePaid: "2025-03-20", amountPaid: 3000, deliverableId: "del-2", status: "Paid", submittedVia: "Email", reviewedBy: "Ama Darko", approvedBy: "James Owusu", paymentInfo: "Wire transfer 20-Mar-2025" },
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
    type: "Vendor",
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
      { id: "inv-3", invoiceNumber: "INV-PW-001", vendor: "PrintWorks Ghana Ltd", amount: 1050, dateSubmitted: "2025-02-16", datePaid: "2025-03-01", amountPaid: 1050, deliverableId: "del-4", status: "Paid", submittedVia: "Manual", reviewedBy: "Ama Darko", approvedBy: "James Owusu", paymentInfo: "Cheque #2345" },
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
    type: "Vendor",
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
      { id: "inv-4", invoiceNumber: "INV-TS-001", vendor: "TechSolutions Africa Ltd", amount: 75000, dateSubmitted: "2025-03-14", datePaid: "2025-04-01", amountPaid: 75000, deliverableId: "del-5", status: "Paid", submittedVia: "Vendor Portal", reviewedBy: "Eric Boateng", approvedBy: "Nana Esi", paymentInfo: "Wire transfer 01-Apr-2025" },
      { id: "inv-5", invoiceNumber: "INV-TS-002", vendor: "TechSolutions Africa Ltd", amount: 37500, dateSubmitted: "2025-06-10", deliverableId: "del-6", status: "CC Reviewed", submittedVia: "Vendor Portal", reviewedBy: "Eric Boateng" },
    ],
    changeRequests: [
      { id: "cr-1", changeNumber: 1, contractRef: "CNT-2025-003", types: ["Scope Change", "Cost Variation"], reason: "Additional UPS units required for extended server room", description: "Add 4x 3kVA UPS units and cabling for redundancy in the new server room wing", supportingDocs: ["VendorQuote_UPS.pdf", "JustificationMemo.pdf"], estimatedCostImpact: 18000, estimatedTimeImpact: "2 weeks", revisedValue: 143000, status: "Approved", requestedBy: "Nana Esi", requestedDate: "2025-04-10", approvedBy: "Management Committee", approvedDate: "2025-04-20" },
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
      { id: "inv-6", invoiceNumber: "INV-DV-001", vendor: "DataViz Consulting", amount: 5000, dateSubmitted: "2025-02-28", datePaid: "2025-03-15", amountPaid: 5000, status: "Paid", submittedVia: "Email", reviewedBy: "Grace Tetteh", approvedBy: "James Owusu" },
      { id: "inv-7", invoiceNumber: "INV-DV-002", vendor: "DataViz Consulting", amount: 5000, dateSubmitted: "2025-03-31", datePaid: "2025-04-15", amountPaid: 5000, status: "Paid", submittedVia: "Email", reviewedBy: "Grace Tetteh", approvedBy: "James Owusu" },
      { id: "inv-8", invoiceNumber: "INV-DV-003", vendor: "DataViz Consulting", amount: 5000, dateSubmitted: "2025-04-30", datePaid: "2025-05-15", amountPaid: 5000, status: "Paid", submittedVia: "Email", reviewedBy: "Grace Tetteh", approvedBy: "James Owusu" },
      { id: "inv-9", invoiceNumber: "INV-DV-004", vendor: "DataViz Consulting", amount: 5000, dateSubmitted: "2025-05-31", status: "Procurement Approved", submittedVia: "Email", reviewedBy: "Grace Tetteh" },
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
      { id: "inv-10", invoiceNumber: "INV-BR-001", vendor: "BuildRight Construction Co.", amount: 84000, dateSubmitted: "2025-04-30", datePaid: "2025-05-20", amountPaid: 84000, deliverableId: "del-12", status: "Paid", submittedVia: "Manual", reviewedBy: "Felix Addo", approvedBy: "Kwame Asante", paymentInfo: "Wire transfer 20-May-2025" },
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

function notify() {
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
    Goods: "Vendor",
    Works: "Works",
  };

  nextContractSeq++;
  const newContract: AwardedContract = {
    id: `AC-${Date.now()}-${nextContractSeq}`,
    contractNumber: opts.contractNumber,
    title: opts.title,
    type: typeMap[opts.category] || "Vendor",
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
  notify();
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
  const typeMap: Record<string, string> = { Consultancy: "Consultant", Services: "Service", Goods: "Vendor", Works: "Works" };
  const today = new Date().toISOString().split("T")[0];

  const newContract: AwardedContract = {
    id: `AC-${Date.now()}-${++nextContractSeq}`,
    contractNumber,
    title: data.title,
    type: typeMap[data.category] || "Vendor",
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
  notify();
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
  notify();
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
  notify();
}

// ── Update contract status ──
export function updateContractStatus(contractId: string, status: AwardedContract["status"]) {
  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    return { ...c, status };
  });
  notify();
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
  notify();
}

// ── Add audit log entry ──
export function addAuditLog(contractId: string, action: string, performedBy: string, details: string) {
  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    const log: AuditLogEntry = { id: `al-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, date: new Date().toISOString().split("T")[0], action, performedBy, details };
    return { ...c, auditLog: [...(c.auditLog || []), log] };
  });
  notify();
}

// ── Add a deliverable to an existing contract (CC upload) ──
export function addDeliverableToContract(contractId: string, deliverable: Omit<ContractDeliverable, "id">) {
  contracts = contracts.map(c => {
    if (c.id !== contractId) return c;
    const newDel: ContractDeliverable = { ...deliverable, id: `del-${Date.now()}` };
    return { ...c, deliverables: [...(c.deliverables || []), newDel] };
  });
  notify();
}