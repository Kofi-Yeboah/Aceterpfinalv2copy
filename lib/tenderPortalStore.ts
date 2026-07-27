// ──────────────────────────────────────────────────────────────────────────────
// Tender publication & electronic bid submission.
//
// This is the "Online Submission Portal" the requirements describe: vendors log
// in, download tender documents, upload their submissions, get an
// acknowledgement receipt, and the tender locks until the official opening.
// Every submission carries a unique ID, a timestamp and an IP entry for the
// audit trail, and technical and financial envelopes open independently.
//
// Sourcing publishes into this store; the vendor portal reads and writes it.
// Keeping both sides on one store is what makes "bids submitted electronically
// should auto populate here after opening" possible.
// ──────────────────────────────────────────────────────────────────────────────

import { notify } from "./notificationStore";
import { getVendorById, vendorDisplayName } from "./vendorStore";

export type EnvelopeType = "Technical" | "Financial" | "Combined" | "Quotation" | "EOI";
export type TenderStatus = "Open" | "Closed" | "Under Evaluation" | "Awarded" | "Cancelled";

export interface TenderDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  url?: string;
  uploadedAt: string;
}

export interface PublishedTender {
  id: string;
  /** The sourcing case number this tender belongs to. */
  tenderRef: string;
  title: string;
  description: string;
  category: string;
  method: string;
  department: string;
  estimatedValue?: number;
  publishedDate: string;
  closingDate: string;
  closingTime: string;
  status: TenderStatus;
  documents: TenderDocument[];
  /** Which envelopes bidders must supply. */
  requiresTechnical: boolean;
  requiresFinancial: boolean;
  /** Individual consultants may be asked for their rate at EOI stage. */
  requestRateQuote: boolean;
  /**
   * Restricted list for Limited Competition and Direct Selection. Empty means
   * open to every eligible vendor.
   */
  invitedVendorIds: string[];
  /** Where the tender was advertised, for the audit record. */
  channels: string[];
  contactEmail: string;
  /** Envelope opening state — technical and financial open separately. */
  technicalOpenedAt?: string;
  technicalOpenedBy?: string;
  financialOpenedAt?: string;
  financialOpenedBy?: string;
}

export interface TenderSubmission {
  id: string;
  /** Human-facing unique reference issued on receipt. */
  submissionId: string;
  tenderRef: string;
  vendorId: string;
  vendorName: string;
  envelope: EnvelopeType;
  submittedAt: string; // ISO timestamp
  documents: TenderDocument[];
  proposedRate?: { amount: number; rateType: "Daily" | "Monthly" };
  coverNote?: string;
  /** Sealed until the corresponding envelope is officially opened. */
  locked: boolean;
  openedAt?: string;
  openedBy?: string;
  acknowledgementRef: string;
  /** Recorded for the audit trail the requirement asks for. */
  sourceIp: string;
  withdrawn?: boolean;
}

/** A profile change a vendor submitted that Procurement must review. */
export interface VendorUpdateRequest {
  id: string;
  vendorId: string;
  vendorName: string;
  requestedAt: string;
  fields: Record<string, string>;
  note: string;
  status: "Pending Review" | "Approved" | "Rejected";
  reviewedBy?: string;
  reviewNote?: string;
}

type Listener = () => void;
let listeners: Listener[] = [];

function notifyListeners() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

let seq = 0;
const nextSeq = () => ++seq;

/**
 * The browser cannot see its own public IP. A stable pseudo-address per session
 * keeps the audit column meaningful in the prototype without pretending to be
 * something it is not.
 */
const SESSION_IP = `10.${Math.floor(Math.random() * 200) + 20}.${Math.floor(Math.random() * 200) + 10}.${
  Math.floor(Math.random() * 200) + 5
}`;

function nowISO() {
  return new Date().toISOString();
}
function todayStr() {
  return new Date().toISOString().split("T")[0];
}
function futureDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}
function pastDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

let tenders: PublishedTender[] = [
  {
    id: "tnd-1",
    tenderRef: "SRC-2024-004",
    title: "Supply and Delivery of Laptops (50x Dell Latitude)",
    description:
      "ACET invites sealed quotations for the supply and delivery of 50 business-class laptops for field officers under the Youth Employment Skills Development programme. Full technical specifications are in the tender document.",
    category: "Goods",
    method: "Open Competition",
    department: "IT",
    estimatedValue: 47500,
    publishedDate: pastDate(6),
    closingDate: futureDate(9),
    closingTime: "15:00",
    status: "Open",
    documents: [
      { id: "td-1", name: "ITB_Laptops_2026.pdf", type: "PDF", size: "820 KB", uploadedAt: pastDate(6) },
      { id: "td-2", name: "Technical_Specifications.pdf", type: "PDF", size: "410 KB", uploadedAt: pastDate(6) },
      { id: "td-3", name: "Evaluation_Criteria_Matrix.pdf", type: "PDF", size: "180 KB", uploadedAt: pastDate(6) },
    ],
    requiresTechnical: true,
    requiresFinancial: true,
    requestRateQuote: false,
    invitedVendorIds: [],
    channels: ["ACET Portal", "ACET Website", "Daily Graphic"],
    contactEmail: "procurement@acet.org",
  },
  {
    id: "tnd-2",
    tenderRef: "SRC-2024-003",
    title: "Consultant Fees — Stakeholder Engagement",
    description:
      "ACET seeks expressions of interest from qualified individual consultants and firms to review the monitoring and evaluation framework for the Youth Employment programme. Shortlisted candidates will be invited to submit full proposals or attend an interview.",
    category: "Consultancy",
    method: "Limited Competition",
    department: "Programs",
    estimatedValue: 5600,
    publishedDate: pastDate(3),
    closingDate: futureDate(14),
    closingTime: "17:00",
    status: "Open",
    documents: [
      { id: "td-4", name: "REOI_ME_Framework_Review.pdf", type: "PDF", size: "520 KB", uploadedAt: pastDate(3) },
      { id: "td-5", name: "Terms_of_Reference.pdf", type: "PDF", size: "340 KB", uploadedAt: pastDate(3) },
    ],
    requiresTechnical: true,
    requiresFinancial: false,
    requestRateQuote: true,
    invitedVendorIds: ["i1", "i2", "i3"],
    channels: ["ACET Portal"],
    contactEmail: "procurement@acet.org",
  },
  {
    id: "tnd-3",
    tenderRef: "SRC-2024-002",
    title: "Printing & Materials — Annual Report 2025",
    description:
      "Quotations are invited for the printing and finishing of 1,000 copies of the ACET Annual Report 2025.",
    category: "Services",
    method: "Request for Quotation",
    department: "Programs",
    estimatedValue: 1050,
    publishedDate: pastDate(10),
    closingDate: pastDate(1),
    closingTime: "12:00",
    status: "Closed",
    documents: [{ id: "td-6", name: "RFQ_AnnualReport_Printing.pdf", type: "PDF", size: "260 KB", uploadedAt: pastDate(10) }],
    requiresTechnical: false,
    requiresFinancial: true,
    requestRateQuote: false,
    invitedVendorIds: ["f3", "f2"],
    channels: ["ACET Portal"],
    contactEmail: "procurement@acet.org",
  },
];

let submissions: TenderSubmission[] = [
  {
    id: "sub-seed-1",
    submissionId: "SUB-2026-0001",
    tenderRef: "SRC-2024-002",
    vendorId: "f3",
    vendorName: "PrintWorks Ghana Ltd",
    envelope: "Quotation",
    submittedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    documents: [{ id: "sd-1", name: "PrintWorks_Quotation.pdf", type: "PDF", size: "290 KB", uploadedAt: pastDate(3) }],
    locked: false,
    openedAt: new Date(Date.now() - 86400000).toISOString(),
    openedBy: "Felix Addo",
    acknowledgementRef: "ACK-2026-0001",
    sourceIp: "41.66.132.18",
  },
  {
    id: "sub-seed-2",
    submissionId: "SUB-2026-0002",
    tenderRef: "SRC-2024-002",
    vendorId: "f2",
    vendorName: "Office Depot Ltd.",
    envelope: "Quotation",
    submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    documents: [{ id: "sd-2", name: "OfficeDepot_Quote_AnnualReport.pdf", type: "PDF", size: "215 KB", uploadedAt: pastDate(2) }],
    locked: false,
    openedAt: new Date(Date.now() - 86400000).toISOString(),
    openedBy: "Felix Addo",
    acknowledgementRef: "ACK-2026-0002",
    sourceIp: "41.66.140.92",
  },
];

let updateRequests: VendorUpdateRequest[] = [];

// ── Reads ───────────────────────────────────────────────────────────────────

export function getTenders(): PublishedTender[] {
  return tenders;
}

export function getTenderByRef(ref: string): PublishedTender | undefined {
  return tenders.find((t) => t.tenderRef === ref);
}

/** Tenders a given vendor may see: open to all, or explicitly invited. */
export function getTendersForVendor(vendorId: string): PublishedTender[] {
  return tenders.filter(
    (t) => t.status !== "Cancelled" && (t.invitedVendorIds.length === 0 || t.invitedVendorIds.includes(vendorId))
  );
}

export function isTenderOpen(t: PublishedTender): boolean {
  if (t.status !== "Open") return false;
  const closesAt = new Date(`${t.closingDate}T${t.closingTime || "23:59"}`);
  return Date.now() < closesAt.getTime();
}

export function getSubmissions(tenderRef?: string): TenderSubmission[] {
  return submissions.filter((s) => !s.withdrawn && (!tenderRef || s.tenderRef === tenderRef));
}

export function getSubmissionsByVendor(vendorId: string): TenderSubmission[] {
  return submissions.filter((s) => s.vendorId === vendorId).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

/** Only submissions whose envelope has been opened are visible to evaluators. */
export function getOpenedSubmissions(tenderRef: string): TenderSubmission[] {
  return submissions.filter((s) => s.tenderRef === tenderRef && !s.withdrawn && !s.locked);
}

export function getUpdateRequests(status?: VendorUpdateRequest["status"]): VendorUpdateRequest[] {
  return updateRequests.filter((r) => !status || r.status === status);
}

// ── Publication (called from Sourcing) ──────────────────────────────────────

export function publishTender(input: Omit<PublishedTender, "id" | "publishedDate" | "status">): PublishedTender {
  const existing = tenders.find((t) => t.tenderRef === input.tenderRef);
  const record: PublishedTender = {
    ...input,
    id: existing?.id ?? `tnd-${Date.now()}`,
    publishedDate: existing?.publishedDate ?? todayStr(),
    status: "Open",
  };

  tenders = existing ? tenders.map((t) => (t.id === existing.id ? record : t)) : [...tenders, record];

  notify({
    category: "Info",
    module: "Sourcing",
    subject: `Tender ${record.tenderRef} published`,
    body: `"${record.title}" is now open on the vendor portal${record.channels.length ? ` and advertised via ${record.channels.join(", ")}` : ""}. Bids close ${record.closingDate} at ${record.closingTime}.`,
    recipientRole: "Procurement",
    entityRef: record.tenderRef,
  });

  notifyListeners();
  return record;
}

export function updateTenderStatus(tenderRef: string, status: TenderStatus) {
  tenders = tenders.map((t) => (t.tenderRef === tenderRef ? { ...t, status } : t));
  notifyListeners();
}

/**
 * Officially opens an envelope. Until this runs, submissions stay sealed —
 * which is what stops an evaluator seeing prices before the technical scores
 * are settled.
 */
export function openEnvelope(
  tenderRef: string,
  envelope: "Technical" | "Financial" | "All",
  openedBy: string
): { ok: boolean; error?: string; opened: number } {
  const tender = tenders.find((t) => t.tenderRef === tenderRef);
  if (!tender) return { ok: false, error: "Tender not found.", opened: 0 };
  if (isTenderOpen(tender)) {
    return {
      ok: false,
      error: `Tender ${tenderRef} is still open for submission until ${tender.closingDate} ${tender.closingTime}. Close it before opening bids.`,
      opened: 0,
    };
  }

  const matches = (s: TenderSubmission) =>
    envelope === "All" ||
    s.envelope === envelope ||
    s.envelope === "Combined" ||
    s.envelope === "Quotation" ||
    s.envelope === "EOI";

  let opened = 0;
  const at = nowISO();
  submissions = submissions.map((s) => {
    if (s.tenderRef !== tenderRef || s.withdrawn || !s.locked || !matches(s)) return s;
    opened += 1;
    return { ...s, locked: false, openedAt: at, openedBy };
  });

  tenders = tenders.map((t) => {
    if (t.tenderRef !== tenderRef) return t;
    return {
      ...t,
      status: "Under Evaluation",
      ...(envelope === "Technical" || envelope === "All" ? { technicalOpenedAt: at, technicalOpenedBy: openedBy } : {}),
      ...(envelope === "Financial" || envelope === "All" ? { financialOpenedAt: at, financialOpenedBy: openedBy } : {}),
    };
  });

  notify({
    category: "Info",
    module: "Sourcing",
    subject: `${envelope} envelope opened — ${tenderRef}`,
    body: `${openedBy} opened the ${envelope.toLowerCase()} envelope for ${tender.title}. ${opened} submission(s) are now available for evaluation.`,
    recipientRole: "Procurement",
    entityRef: tenderRef,
  });

  notifyListeners();
  return { ok: true, opened };
}

// ── Submission (called from the vendor portal) ──────────────────────────────

export interface SubmissionReceipt {
  submissionId: string;
  acknowledgementRef: string;
  receivedAt: string;
  tenderRef: string;
  tenderTitle: string;
  vendorName: string;
  envelope: EnvelopeType;
  documentCount: number;
}

export function submitBid(input: {
  tenderRef: string;
  vendorId: string;
  envelope: EnvelopeType;
  documents: TenderDocument[];
  proposedRate?: { amount: number; rateType: "Daily" | "Monthly" };
  coverNote?: string;
}): { ok: boolean; error?: string; receipt?: SubmissionReceipt } {
  const tender = tenders.find((t) => t.tenderRef === input.tenderRef);
  if (!tender) return { ok: false, error: "Tender not found." };
  if (!isTenderOpen(tender)) {
    return { ok: false, error: `Submissions for ${tender.tenderRef} closed on ${tender.closingDate} at ${tender.closingTime}.` };
  }
  if (tender.invitedVendorIds.length > 0 && !tender.invitedVendorIds.includes(input.vendorId)) {
    return { ok: false, error: "This is a restricted tender and your organisation is not on the invitation list." };
  }
  if (!input.documents.length) {
    return { ok: false, error: "Attach at least one document before submitting." };
  }

  const vendor = getVendorById(input.vendorId);
  if (!vendor) return { ok: false, error: "Vendor profile not found." };

  const duplicate = submissions.find(
    (s) => s.tenderRef === input.tenderRef && s.vendorId === input.vendorId && s.envelope === input.envelope && !s.withdrawn
  );
  if (duplicate) {
    return {
      ok: false,
      error: `You have already submitted a ${input.envelope.toLowerCase()} envelope for this tender (${duplicate.submissionId}). Withdraw it first if you need to replace it.`,
    };
  }

  const n = nextSeq();
  const submittedAt = nowISO();
  const record: TenderSubmission = {
    id: `sub-${Date.now()}`,
    submissionId: `SUB-${new Date().getFullYear()}-${String(n).padStart(4, "0")}`,
    tenderRef: input.tenderRef,
    vendorId: input.vendorId,
    vendorName: vendorDisplayName(vendor),
    envelope: input.envelope,
    submittedAt,
    documents: input.documents,
    proposedRate: input.proposedRate,
    coverNote: input.coverNote,
    // Sealed on arrival; only the official opening unseals it.
    locked: true,
    acknowledgementRef: `ACK-${new Date().getFullYear()}-${String(n).padStart(4, "0")}`,
    sourceIp: SESSION_IP,
  };

  submissions = [...submissions, record];

  notify({
    category: "Info",
    module: "Sourcing",
    subject: `Bid received for ${tender.tenderRef}`,
    body: `${record.vendorName} submitted a ${input.envelope.toLowerCase()} envelope (${record.submissionId}) at ${new Date(submittedAt).toLocaleString()}. The submission is sealed until the official opening.`,
    recipientRole: "Procurement",
    entityRef: tender.tenderRef,
  });

  notifyListeners();
  return {
    ok: true,
    receipt: {
      submissionId: record.submissionId,
      acknowledgementRef: record.acknowledgementRef,
      receivedAt: submittedAt,
      tenderRef: tender.tenderRef,
      tenderTitle: tender.title,
      vendorName: record.vendorName,
      envelope: input.envelope,
      documentCount: input.documents.length,
    },
  };
}

/** A vendor may pull a submission back while the tender is still open. */
export function withdrawSubmission(submissionId: string, vendorId: string): { ok: boolean; error?: string } {
  const sub = submissions.find((s) => s.submissionId === submissionId);
  if (!sub) return { ok: false, error: "Submission not found." };
  if (sub.vendorId !== vendorId) return { ok: false, error: "You can only withdraw your own submissions." };
  const tender = tenders.find((t) => t.tenderRef === sub.tenderRef);
  if (!tender || !isTenderOpen(tender)) {
    return { ok: false, error: "The tender has closed — submissions can no longer be withdrawn." };
  }

  submissions = submissions.map((s) => (s.submissionId === submissionId ? { ...s, withdrawn: true } : s));
  notifyListeners();
  return { ok: true };
}

/** Timestamp report for a tender, as the requirement asks. */
export function getSubmissionTimestampReport(tenderRef: string) {
  const tender = tenders.find((t) => t.tenderRef === tenderRef);
  return submissions
    .filter((s) => s.tenderRef === tenderRef)
    .sort((a, b) => a.submittedAt.localeCompare(b.submittedAt))
    .map((s) => ({
      submissionId: s.submissionId,
      vendor: s.vendorName,
      envelope: s.envelope,
      submittedAt: new Date(s.submittedAt).toLocaleString(),
      onTime: tender ? s.submittedAt <= new Date(`${tender.closingDate}T${tender.closingTime}`).toISOString() : true,
      documents: s.documents.length,
      acknowledgement: s.acknowledgementRef,
      sourceIp: s.sourceIp,
      status: s.withdrawn ? "Withdrawn" : s.locked ? "Sealed" : `Opened ${s.openedAt ? new Date(s.openedAt).toLocaleString() : ""}`,
    }));
}

// ── Vendor profile update requests ──────────────────────────────────────────

/**
 * Vendors cannot edit their own live record. "Where vendor is merely updating
 * Registration History, they can only be added to the system after internal
 * review of the submitted information."
 */
export function requestProfileUpdate(input: {
  vendorId: string;
  fields: Record<string, string>;
  note: string;
}): { ok: boolean; error?: string } {
  const vendor = getVendorById(input.vendorId);
  if (!vendor) return { ok: false, error: "Vendor profile not found." };
  if (!Object.keys(input.fields).length) return { ok: false, error: "No changes were entered." };

  const record: VendorUpdateRequest = {
    id: `vur-${Date.now()}`,
    vendorId: input.vendorId,
    vendorName: vendorDisplayName(vendor),
    requestedAt: nowISO(),
    fields: input.fields,
    note: input.note,
    status: "Pending Review",
  };
  updateRequests = [...updateRequests, record];

  notify({
    category: "Approval",
    module: "Supplier Management",
    subject: `Profile update submitted by ${record.vendorName}`,
    body: `${record.vendorName} requested changes to ${Object.keys(input.fields).join(", ")} via the vendor portal. The changes will not take effect until Procurement reviews them.${input.note ? `\n\nVendor note: ${input.note}` : ""}`,
    recipientRole: "Procurement",
    entityRef: vendor.vendorId,
  });

  notifyListeners();
  return { ok: true };
}

export function reviewUpdateRequest(
  id: string,
  decision: "Approved" | "Rejected",
  reviewedBy: string,
  reviewNote = ""
): VendorUpdateRequest | undefined {
  let updated: VendorUpdateRequest | undefined;
  updateRequests = updateRequests.map((r) => {
    if (r.id !== id) return r;
    updated = { ...r, status: decision, reviewedBy, reviewNote };
    return updated;
  });
  if (updated) notifyListeners();
  return updated;
}
