import { useState, useEffect, useMemo } from "react";
import {
  Search, Download, ChevronDown, MoreHorizontal, Eye, AlertTriangle, ChevronRight, Users,
  Activity, CheckCircle2, Clock, FileText, FileSpreadsheet, UserCircle,
} from "lucide-react";
import { getGeneratedPRs, subscribe, markPRConvertedToSourcing } from "../lib/procurementStore";
import { pushContract, registerAwardWithVendor } from "../lib/contractStore";
import { recordConsultantRate } from "../lib/vendorStore";
import { notifyAll } from "../lib/notificationStore";
import { can, getCurrentUser, denialReason, subscribe as subscribeUser, type AppUser } from "../lib/currentUser";
import {
  PROCUREMENT_METHODS, canonicalMethod, isCompetitive, isDirect, isRFQ, requiresAdvertisement,
  validateMethodAgainstThreshold,
} from "../lib/procurementThresholds";
import { exportToCSV, exportToExcel, exportToPDF, type ExportColumn } from "../lib/exportUtils";
import { getOpenedSubmissions, subscribe as subscribeTenders } from "../lib/tenderPortalStore";
import {
  SourcingCaseDetail,
  type SourcingCase,
  type SourcingMethod,
  type SourcingStep,
  type CategoryType,
  type StepStatus,
  type ContractAwardPayload,
  type DocUploadPayload,
  type VendorBidUpdatePayload,
  type UploadedDoc,
  type MethodChangeRecord,
} from "./SourcingCaseDetail";
import { POGenerationFlow } from "./POGenerationFlow";
import { ProcurementTabs, type ProcurementTab } from "./procurement/ProcurementTabs";
import { ProcurementStatCards } from "./procurement/ProcurementStatCards";

/* ══════════════════════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════════════════════ */

const F = "'Montserrat Variable', sans-serif";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const CATEGORIES = ["All Categories", "Goods", "Services", "Works", "Consultancy"];
const METHOD_FILTER = ["All Methods", ...PROCUREMENT_METHODS];
const STATUS_FILTER = ["All Statuses", "In Progress", "Completed", "Cancelled"];
const ALL_REQUESTORS = "All Requestors";

/** Requisition purchase types fold onto the four canonical procurement methods. */
function mapPurchaseTypeToMethod(pt: string): SourcingMethod {
  return canonicalMethod(pt);
}

function mapCategory(cat: string): CategoryType {
  if (cat === "Consultancy") return "Consultancy";
  if (cat === "Services") return "Services";
  if (cat === "Works") return "Works";
  return "Goods";
}

function daysBetween(from: string, to: string): number {
  const ms = new Date(to).getTime() - new Date(from).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

/* ── Step builder based on method + category ─────────────────────────────── */

function buildSteps(
  method: SourcingMethod,
  category: CategoryType,
  opts?: { individualRoute?: boolean }
): SourcingStep[] {
  const isService = category === "Services" || category === "Consultancy";
  const competition = isCompetitive(method);
  const direct = isDirect(method);
  const rfq = isRFQ(method);
  // The EoI step only exists for competitive service procurements, and the
  // individual-consultant route hangs off it.
  const hasEoi = competition && isService;
  const individualRoute = !!opts?.individualRoute && category === "Consultancy" && hasEoi;

  const steps: SourcingStep[] = [];

  // 1. Solicitation Docs — always
  steps.push({
    key: "solicitation",
    label: isService ? "Solicitation (RFP)" : "Solicitation (ITB)",
    icon: null,
    status: "active",
    description: isService
      ? "Upload finalized RFP and evaluation criteria for services/consultancy."
      : "Upload finalized ITB and evaluation criteria for goods/works.",
    documents: [],
  });

  // 2. Advertisement — Open Competition only; nothing else is publicly advertised
  if (requiresAdvertisement(method)) {
    steps.push({
      key: "advertisement",
      label: "Advertisement",
      icon: null,
      status: "locked",
      description: "Publish to the vendor portal / ACET website and upload external ad proof.",
      documents: [],
    });
  }

  // 3. EoI & Shortlisting — services competition only
  if (hasEoi) {
    steps.push({
      key: "eoi_shortlisting",
      label: "EoI & Shortlisting",
      icon: null,
      status: "locked",
      description: "Score Expressions of Interest and record the shortlist.",
      documents: [],
    });
  }

  // 4. Interview — individual consultants go straight from shortlist to interview
  if (individualRoute) {
    steps.push({
      key: "interview",
      label: "Interviews",
      icon: null,
      status: "locked",
      description: "Interview shortlisted individual consultants and record panel scores.",
      documents: [],
    });
  }

  // 5. Invitation — skipped on the individual-consultant route, optional for RFQ
  if (!individualRoute) {
    steps.push({
      key: "invitation",
      label: direct ? "Select Vendor" : "Invite Bidders",
      icon: null,
      status: "locked",
      description: direct
        ? "Select the vendor directly from the approved supplier register."
        : "Select bidders from the supplier register, issue invitations and upload the letters.",
      // "Invitation to Shortlisted Bidders: optional" for RFQ.
      optional: rfq,
      documents: [],
    });

    // 6. Online Submission Portal — wherever a tender is published to vendors.
    // Direct Selection is a single negotiated engagement, so it has no portal step.
    if (!direct) {
      steps.push({
        key: "submission_portal",
        label: "Online Submissions",
        icon: null,
        status: "locked",
        description: isService
          ? "Vendors submit electronically. Technical and financial envelopes open separately."
          : "Vendors submit bids electronically. Sealed, timestamped and opened on the record.",
        optional: true,
        documents: [],
      });
    }

    // 7. Bid Opening
    steps.push({
      key: "bid_opening",
      label: "Bid Opening",
      icon: null,
      status: "locked",
      description: "Open envelopes, log bids, upload minutes and attendance. Stakeholders are notified.",
      documents: [],
    });
  }

  // 8. Evaluation & Approvals — optional for Direct Selection
  steps.push({
    key: "evaluation",
    label: "Evaluation & Approvals",
    icon: null,
    status: "locked",
    description: direct
      ? "Optional for Direct Selection — upload an evaluation note where one was produced."
      : isService
      ? "Upload combined evaluation report for technical and financial proposals."
      : "Upload standard evaluation report.",
    optional: direct,
    documents: [],
  });

  // 9. Negotiations — always optional
  steps.push({
    key: "negotiations",
    label: "Negotiations",
    icon: null,
    status: "locked",
    description: "Upload negotiation reports or minutes.",
    optional: true,
    documents: [],
  });

  // 10. Contract Award — always
  steps.push({
    key: "contract_award",
    label: "Contract Award",
    icon: null,
    status: "locked",
    description: "Upload signed contract. PR number converts to Contract Number.",
    documents: [],
  });

  return steps;
}

/* ── Pure case transforms ─────────────────────────────────────────────────── */

/** Rebuilds the step list after a method/route change, preserving completed work. */
function rebuildSteps(sc: SourcingCase, method: SourcingMethod, individualRoute?: boolean): SourcingCase {
  const fresh = buildSteps(method, sc.category, { individualRoute: individualRoute ?? sc.individualConsultantRoute });
  const merged = fresh.map(ns => {
    const old = sc.steps.find(os => os.key === ns.key);
    if (old && old.status === "completed") {
      return { ...ns, status: "completed" as StepStatus, documents: old.documents };
    }
    if (old && old.documents.length > 0) return { ...ns, documents: old.documents };
    return ns;
  });

  let foundActive = false;
  const final = merged.map(s => {
    if (s.status !== "completed" && !foundActive) {
      foundActive = true;
      return { ...s, status: "active" as StepStatus };
    }
    if (s.status !== "completed" && foundActive) return { ...s, status: "locked" as StepStatus };
    return s;
  });

  const currentKey = final.find(s => s.status === "active")?.key || final[final.length - 1].key;
  return { ...sc, method, steps: final, currentStepKey: currentKey };
}

function advanceStep(sc: SourcingCase, stepKey: string): SourcingCase {
  const stepIdx = sc.steps.findIndex(s => s.key === stepKey);
  if (stepIdx === -1) return sc;

  const newSteps = [...sc.steps];
  newSteps[stepIdx] = { ...newSteps[stepIdx], status: "completed" as StepStatus };

  let nextActiveKey = sc.currentStepKey;
  let advanced = false;
  for (let i = stepIdx + 1; i < newSteps.length; i++) {
    if (newSteps[i].status === "locked") {
      newSteps[i] = { ...newSteps[i], status: "active" as StepStatus };
      nextActiveKey = newSteps[i].key;
      advanced = true;
      break;
    }
  }

  const allDone = !advanced && newSteps.every(s => s.status === "completed");
  return {
    ...sc,
    steps: newSteps,
    currentStepKey: advanced ? nextActiveKey : stepKey,
    overallStatus: allDone ? ("Completed" as const) : sc.overallStatus,
    completedDate: allDone ? (sc.completedDate ?? new Date().toISOString().split("T")[0]) : sc.completedDate,
  };
}

function applyDocUpload(sc: SourcingCase, stepKey: string, doc: UploadedDoc): SourcingCase {
  const newSteps = sc.steps.map(step => {
    if (step.key !== stepKey) return step;
    const existingIdx = step.documents.findIndex(d => d.label === doc.label);
    let newDocs: UploadedDoc[];
    if (existingIdx >= 0) {
      newDocs = [...step.documents];
      newDocs[existingIdx] = doc;
    } else {
      newDocs = [...step.documents, doc];
    }
    return { ...step, documents: newDocs };
  });
  return { ...sc, steps: newSteps };
}

/* ══════════════════════════════════════════════════════════════════════════════
   SEED SOURCING CASES (legacy + from approved PRs)
   ══════════════════════════════════════════════════════════════════════════════ */

function buildSeedCases(): SourcingCase[] {
  const seeds: SourcingCase[] = [
    {
      id: "SC-SEED-1",
      caseNumber: "SRC-2024-001",
      sourcePR: "PR-2024-001",
      description: "Consultant Fees — Survey Design",
      category: "Consultancy",
      method: "Direct Selection",
      budget: 8000,
      requestedBy: "John Smith",
      department: "Programs",
      projectName: "Youth Employment Skills Development",
      dateCreated: "2024-12-01",
      completedDate: "2024-12-18",
      currentStepKey: "contract_award",
      overallStatus: "Completed",
      awardedVendor: "Dr. Kwesi Appiah",
      contractNumber: "CNT-2024-001",
      steps: buildCompletedSteps("Direct Selection", "Consultancy"),
      vendorsBidding: [
        { id: "bid-s1-1", vendorName: "Dr. Kwesi Appiah", dateReceived: "2024-12-05", bidReference: "BID-DS-001", notes: "Direct selection — single vendor" },
      ],
    },
    {
      id: "SC-SEED-2",
      caseNumber: "SRC-2024-002",
      sourcePR: "PR-2024-001",
      description: "Printing & Materials",
      category: "Goods",
      method: "Request for Quotation",
      budget: 1050,
      requestedBy: "John Smith",
      department: "Programs",
      projectName: "Youth Employment Skills Development",
      dateCreated: "2024-12-02",
      completedDate: "2024-12-20",
      currentStepKey: "contract_award",
      overallStatus: "Completed",
      awardedVendor: "PrintWorks Ghana Ltd",
      contractNumber: "CNT-2024-002",
      steps: buildCompletedSteps("Request for Quotation", "Goods"),
      vendorsBidding: [
        { id: "bid-s2-1", vendorName: "PrintWorks Ghana Ltd", dateReceived: "2024-12-08", bidReference: "BID-RFQ-001", notes: "Received via email" },
        { id: "bid-s2-2", vendorName: "Office Depot Ltd.", dateReceived: "2024-12-09", bidReference: "BID-RFQ-002", notes: "Sealed envelope, hand-delivered" },
        { id: "bid-s2-3", vendorName: "QuickPrint Services", dateReceived: "2024-12-10", bidReference: "BID-RFQ-003", notes: "Courier delivery" },
      ],
    },
    {
      id: "SC-SEED-3",
      caseNumber: "SRC-2024-003",
      sourcePR: "PR-2024-010",
      description: "Consultant Fees — Stakeholder Engagement",
      category: "Consultancy",
      method: "Limited Competition",
      budget: 5600,
      requestedBy: "Ama Darko",
      department: "Programs",
      projectName: "Youth Employment Skills Development",
      dateCreated: "2025-01-20",
      currentStepKey: "evaluation",
      overallStatus: "In Progress",
      steps: buildInProgressSteps("Limited Competition", "Consultancy", "evaluation"),
      vendorsBidding: [
        { id: "bid-s3-1", vendorName: "Prof. Ama Benyiwa", dateReceived: "2025-02-01", bidReference: "BID-LC-001", notes: "Technical & financial proposals, sealed" },
        { id: "bid-s3-2", vendorName: "Nana Yaw Mensah", dateReceived: "2025-02-02", bidReference: "BID-LC-002", notes: "Hand-delivered, 3 copies" },
        { id: "bid-s3-3", vendorName: "Dr. Kwesi Appiah", dateReceived: "2025-02-03", bidReference: "BID-LC-003", notes: "Received via courier" },
        { id: "bid-s3-4", vendorName: "Akosua Frimpong", dateReceived: "2025-02-03", bidReference: "BID-LC-004", notes: "Email submission, PDF attached" },
      ],
    },
    {
      id: "SC-SEED-4",
      caseNumber: "SRC-2024-004",
      sourcePR: "PR-2024-012",
      description: "Laptops (50x Dell Latitude)",
      category: "Goods",
      method: "Open Competition",
      budget: 47500,
      requestedBy: "Kwame Boateng",
      department: "IT",
      projectName: "Youth Employment Skills Development",
      dateCreated: "2025-01-25",
      currentStepKey: "bid_opening",
      overallStatus: "In Progress",
      steps: buildInProgressSteps("Open Competition", "Goods", "bid_opening"),
      vendorsBidding: [
        { id: "bid-s4-1", vendorName: "Tech Solutions Inc.", dateReceived: "2025-02-15", bidReference: "BID-OC-001", notes: "Sealed bid box, 2 copies" },
        { id: "bid-s4-2", vendorName: "CompuTech Ghana", dateReceived: "2025-02-15", bidReference: "BID-OC-002", notes: "Courier delivery" },
        { id: "bid-s4-3", vendorName: "Dell Direct Sales", dateReceived: "2025-02-16", bidReference: "BID-OC-003", notes: "Hand-delivered by agent" },
        { id: "bid-s4-4", vendorName: "Electromart Ltd", dateReceived: "2025-02-16", bidReference: "BID-OC-004", notes: "Sealed envelope via post" },
        { id: "bid-s4-5", vendorName: "Office Depot Ltd.", dateReceived: "2025-02-17", bidReference: "BID-OC-005", notes: "Email confirmation + physical copy" },
      ],
    },
    {
      id: "SC-SEED-5",
      caseNumber: "SRC-2024-005",
      sourcePR: "PR-2024-015",
      description: "Medical Supplies Kit",
      category: "Goods",
      method: "Open Competition",
      budget: 12000,
      requestedBy: "Grace Owusu",
      department: "Programs",
      projectName: "Community Health Project",
      dateCreated: "2025-01-15",
      currentStepKey: "invitation",
      overallStatus: "In Progress",
      steps: buildInProgressSteps("Open Competition", "Goods", "invitation"),
      vendorsBidding: [],
    },
  ];
  return seeds;
}

function buildCompletedSteps(method: SourcingMethod, category: CategoryType): SourcingStep[] {
  const steps = buildSteps(method, category);
  return steps.map(s => ({
    ...s,
    status: "completed" as StepStatus,
    documents: [{
      id: `d-${s.key}`,
      name: `${s.label} — Final.pdf`,
      uploadedBy: "Procurement Unit",
      date: "2024-12-10",
      type: "PDF",
      size: "1.2 MB",
      version: 1,
      versions: [{ versionNumber: 1, name: `${s.label} — Final.pdf`, size: "1.2 MB", uploadedBy: "Procurement Unit", date: "2024-12-10", type: "PDF" }],
      label: s.label,
    }],
  }));
}

function buildInProgressSteps(method: SourcingMethod, category: CategoryType, currentKey: string): SourcingStep[] {
  const steps = buildSteps(method, category);
  let reachedCurrent = false;
  return steps.map(s => {
    if (s.key === currentKey) {
      reachedCurrent = true;
      return { ...s, status: "active" as StepStatus };
    }
    if (!reachedCurrent) {
      return {
        ...s,
        status: "completed" as StepStatus,
        documents: [{
          id: `d-${s.key}`,
          name: `${s.label} — Uploaded.pdf`,
          uploadedBy: "Procurement Unit",
          date: "2025-01-20",
          type: "PDF",
          size: "890 KB",
          version: 1,
          versions: [{ versionNumber: 1, name: `${s.label} — Uploaded.pdf`, size: "890 KB", uploadedBy: "Procurement Unit", date: "2025-01-20", type: "PDF" }],
          label: s.label,
        }],
      };
    }
    return { ...s, status: "locked" as StepStatus };
  });
}

/* ── Export columns for the sourcing register ─────────────────────────────── */

const EXPORT_COLUMNS: ExportColumn<Record<string, unknown>>[] = [
  { key: "caseNumber", header: "Case #" },
  { key: "sourcePR", header: "Source PR" },
  { key: "description", header: "Description" },
  { key: "category", header: "Category" },
  { key: "method", header: "Method" },
  { key: "budget", header: "Budget (USD)" },
  { key: "requestedBy", header: "Requested By" },
  { key: "department", header: "Department" },
  { key: "dateCreated", header: "Date Created" },
  { key: "currentStep", header: "Current Step" },
  { key: "bids", header: "Bids" },
  { key: "status", header: "Status" },
  { key: "processingDays", header: "Days Elapsed" },
  { key: "awardedVendor", header: "Awarded Vendor" },
  { key: "contractNumber", header: "Contract #" },
];

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

interface SourcingProps {
  onNavigate?: (navKey: string) => void;
}

export function Sourcing({ onNavigate }: SourcingProps) {
  const [, setTick] = useState(0);
  const [sourcingCases, setSourcingCases] = useState<SourcingCase[]>(buildSeedCases);

  // Identity & permissions
  const [user, setUser] = useState<AppUser>(getCurrentUser());
  useEffect(() => subscribeUser(() => setUser(getCurrentUser())), []);
  const canManage = can("sourcing.manage", user);
  const canExport = can("report.export", user);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedMethod, setSelectedMethod] = useState("All Methods");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedRequestor, setSelectedRequestor] = useState(ALL_REQUESTORS);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showRequestorDropdown, setShowRequestorDropdown] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Detail view
  const [selectedCase, setSelectedCase] = useState<SourcingCase | null>(null);

  // PO Generation flow
  const [showPOFlow, setShowPOFlow] = useState(false);
  const [generatedPOs, setGeneratedPOs] = useState<Record<string, string>>({});

  // Subscribe to the requisition store and auto-pull approved PRs as new cases
  useEffect(() => {
    const sync = () => {
      const prs = getGeneratedPRs();
      const approvedPRs = prs.filter(pr => pr.overallApprovalStatus === "Approved");

      setSourcingCases(prev => {
        const existingSourcePRs = new Set(prev.map(sc => sc.sourcePR));
        const newCases: SourcingCase[] = [];

        for (const pr of approvedPRs) {
          if (!existingSourcePRs.has(pr.requisitionNumber)) {
            const cat = mapCategory(pr.category);
            const method = mapPurchaseTypeToMethod(pr.purchaseType);
            const caseNumber = `SRC-${pr.requisitionNumber.replace("PR-", "")}`;
            newCases.push({
              id: `SC-${pr.id}`,
              caseNumber,
              sourcePR: pr.requisitionNumber,
              description: pr.requisitionTitle || pr.itemDescription,
              category: cat,
              method,
              budget: pr.estimatedCost,
              requestedBy: pr.requestedBy,
              department: pr.department,
              projectName: "Youth Employment Skills Development",
              fundingSource: pr.fundingSource || undefined,
              dateCreated: new Date().toISOString().split("T")[0],
              currentStepKey: "solicitation",
              overallStatus: "In Progress",
              steps: buildSteps(method, cat),
            });
          }
        }

        if (newCases.length > 0) {
          newCases.forEach(nc => {
            const check = validateMethodAgainstThreshold(nc.method, nc.budget);
            notifyAll([{ name: nc.requestedBy }, { role: "Procurement" }], {
              category: "Info",
              module: "Sourcing",
              subject: `Sourcing case ${nc.caseNumber} opened from ${nc.sourcePR}`,
              body: [
                `"${nc.description}" (${formatCurrency(nc.budget)}, ${nc.category}) has been converted into a sourcing case.`,
                `Procurement method: ${nc.method}.`,
                check.compliant
                  ? "The method matches the value threshold."
                  : `⚠ ${check.message}`,
                "First step: prepare and upload the solicitation documents.",
              ].join("\n"),
              entityRef: nc.caseNumber,
              priority: check.compliant ? "Normal" : "High",
            });
          });
          return [...prev, ...newCases];
        }
        return prev;
      });

      setTick(t => t + 1);
    };

    sync();
    const unsub = subscribe(sync);
    const unsubTenders = subscribeTenders(() => setTick(t => t + 1));
    return () => { unsub(); unsubTenders(); };
  }, []);

  /* ── Notification helper ── */
  const announce = (
    sc: SourcingCase,
    subject: string,
    body: string,
    opts?: { category?: "Info" | "Alert"; priority?: "Normal" | "High" | "Urgent"; sms?: boolean }
  ) => {
    notifyAll([{ name: sc.requestedBy }, { role: "Procurement" }, { role: "Department Head" }], {
      category: opts?.category ?? "Info",
      module: "Sourcing",
      subject,
      body,
      entityRef: sc.caseNumber,
      priority: opts?.priority ?? "Normal",
      channels: opts?.sms ? ["In-App", "Email", "SMS"] : ["In-App", "Email"],
    });
  };

  /* ── Case mutation helpers ── */

  const mutateCase = (caseId: string, transform: (sc: SourcingCase) => SourcingCase) => {
    setSourcingCases(prev => prev.map(c => (c.id === caseId ? transform(c) : c)));
    setSelectedCase(prev => (prev && prev.id === caseId ? transform(prev) : prev));
  };

  const bidCountFor = (sc: SourcingCase) =>
    (sc.vendorsBidding?.length ?? 0) + getOpenedSubmissions(sc.caseNumber).length;

  /* ── Method change ── */
  const handleMethodChange = (caseId: string, newMethod: SourcingMethod, justification: string) => {
    const target = sourcingCases.find(c => c.id === caseId);
    if (!target || !canManage) return;
    const check = validateMethodAgainstThreshold(newMethod, target.budget);
    const record: MethodChangeRecord = {
      from: target.method,
      to: newMethod,
      at: new Date().toISOString(),
      by: user.name,
      justification,
      compliant: check.compliant,
    };
    mutateCase(caseId, sc => ({
      ...rebuildSteps(sc, newMethod),
      methodHistory: [...(sc.methodHistory ?? []), record],
    }));
  };

  /* ── Individual-consultant route / generic case patch ── */
  const handleCaseUpdate = (caseId: string, patch: Partial<SourcingCase>) => {
    mutateCase(caseId, sc => {
      const next = { ...sc, ...patch };
      if (patch.individualConsultantRoute !== undefined && patch.individualConsultantRoute !== sc.individualConsultantRoute) {
        return rebuildSteps(next, next.method, patch.individualConsultantRoute);
      }
      return next;
    });
  };

  /* ── Step advance ── */
  const handleStepAdvance = (caseId: string, stepKey: string) => {
    const before = sourcingCases.find(c => c.id === caseId);
    if (!before || !canManage) return;
    const after = advanceStep(before, stepKey);
    mutateCase(caseId, sc => advanceStep(sc, stepKey));

    const completedLabel = before.steps.find(s => s.key === stepKey)?.label ?? stepKey;
    const nextStep = after.steps.find(s => s.key === after.currentStepKey && s.status === "active");
    const isFinished = after.overallStatus === "Completed";

    announce(
      before,
      `${before.caseNumber} — ${completedLabel} completed`,
      [
        `${user.name} completed the "${completedLabel}" step on "${before.description}" (${before.method}).`,
        isFinished
          ? "All workflow steps are now complete and the sourcing case is closed."
          : nextStep
          ? `Next: ${nextStep.label}${nextStep.optional ? " (optional)" : ""} — ${nextStep.description}`
          : "Awaiting the next action.",
        `Progress: ${after.steps.filter(s => s.status === "completed").length} of ${after.steps.length} steps.`,
      ].join("\n"),
      { priority: isFinished ? "High" : "Normal" }
    );
  };

  /* ── Contract Award ── */
  const handleContractAward = (payload: ContractAwardPayload) => {
    const sc = sourcingCases.find(c => c.id === payload.caseId);
    if (!sc) return;

    const contract = pushContract({
      contractNumber: payload.contractNumber,
      title: sc.description,
      party: payload.vendor,
      sourcePR: sc.sourcePR,
      sourceSourcingCase: sc.caseNumber,
      category: sc.category,
      method: sc.method,
      value: sc.budget,
      department: sc.department,
      owner: sc.requestedBy,
      comments: payload.comments,
    });

    // The vendor profile gains the contract history and updated totals.
    registerAwardWithVendor(contract);

    // The requisition is now shown as Converted to Sourcing.
    markPRConvertedToSourcing(sc.sourcePR, sc.caseNumber);

    // An individual consultant's agreed rate joins their rate history.
    if (payload.consultantRate && payload.vendorRef) {
      recordConsultantRate(payload.vendorRef, {
        assignment: sc.description,
        rate: payload.consultantRate.rate,
        rateType: payload.consultantRate.rateType,
        period: `${formatDate(contract.startDate)} – ${formatDate(contract.endDate)}`,
      });
    }

    const today = new Date().toISOString().split("T")[0];
    mutateCase(payload.caseId, c => ({
      ...c,
      steps: c.steps.map(s => (s.key === "contract_award" ? { ...s, status: "completed" as StepStatus } : s)),
      awardedVendor: payload.vendor,
      contractNumber: payload.contractNumber,
      overallStatus: "Completed" as const,
      currentStepKey: "contract_award",
      completedDate: c.completedDate ?? today,
    }));

    announce(
      sc,
      `${sc.caseNumber} — contract ${payload.contractNumber} awarded to ${payload.vendor}`,
      [
        `${payload.awardedBy} awarded "${sc.description}" (${formatCurrency(sc.budget)}) to ${payload.vendor} under ${sc.method}.`,
        `Contract ${payload.contractNumber} is registered in Contract Management and against the vendor's profile.`,
        `Requisition ${sc.sourcePR} is now marked Converted to Sourcing.`,
        payload.consultantRate
          ? `Agreed consultant rate: ${formatCurrency(payload.consultantRate.rate)} ${payload.consultantRate.rateType.toLowerCase()} — recorded in the rate history.`
          : "",
        payload.managementApproval
          ? `⚠ Awarded with Senior Management approval (${payload.managementApproval.approvedBy}): ${payload.managementApproval.justification}`
          : "",
        payload.comments ? `Comments: ${payload.comments}` : "",
      ].filter(Boolean).join("\n"),
      { category: payload.managementApproval ? "Alert" : "Info", priority: "High", sms: true }
    );
  };

  /* ── Vendor bid update ── */
  const handleVendorBidUpdate = (payload: VendorBidUpdatePayload) => {
    mutateCase(payload.caseId, sc => ({ ...sc, vendorsBidding: payload.vendorsBidding }));
  };

  /* ── Document upload ── */
  const handleDocUpload = (payload: DocUploadPayload) => {
    const sc = sourcingCases.find(c => c.id === payload.caseId);
    mutateCase(payload.caseId, c => applyDocUpload(c, payload.stepKey, payload.doc));
    if (sc) {
      const stepLabel = sc.steps.find(s => s.key === payload.stepKey)?.label ?? payload.stepKey;
      announce(
        sc,
        `${sc.caseNumber} — ${payload.doc.label} uploaded`,
        `${payload.doc.uploadedBy} uploaded "${payload.doc.name}" (v${payload.doc.version}) against ${stepLabel} on ${sc.caseNumber}.`
      );
    }
  };

  /* ── Filters ── */
  const requestors = useMemo(
    () => [ALL_REQUESTORS, ...Array.from(new Set(sourcingCases.map(sc => sc.requestedBy))).sort()],
    [sourcingCases]
  );

  const filtered = sourcingCases.filter(sc => {
    const q = searchQuery.toLowerCase();
    const matchSearch = sc.caseNumber.toLowerCase().includes(q) ||
      sc.sourcePR.toLowerCase().includes(q) ||
      sc.description.toLowerCase().includes(q) ||
      sc.requestedBy.toLowerCase().includes(q);
    const matchCat = selectedCategory === "All Categories" || sc.category === selectedCategory;
    const matchMethod = selectedMethod === "All Methods" || sc.method === selectedMethod;
    const matchStatus = selectedStatus === "All Statuses" || sc.overallStatus === selectedStatus;
    const matchRequestor = selectedRequestor === ALL_REQUESTORS || sc.requestedBy === selectedRequestor;
    return matchSearch && matchCat && matchMethod && matchStatus && matchRequestor;
  });

  // Stats
  const totalCases = sourcingCases.length;
  const inProgress = sourcingCases.filter(sc => sc.overallStatus === "In Progress").length;
  const completed = sourcingCases.filter(sc => sc.overallStatus === "Completed").length;
  const completedThisMonth = sourcingCases.filter(sc => {
    const ref = sc.completedDate ?? sc.dateCreated;
    return sc.overallStatus === "Completed" &&
      new Date(ref).getMonth() === new Date().getMonth() &&
      new Date(ref).getFullYear() === new Date().getFullYear();
  }).length;

  /**
   * Average processing time, measured from case creation to completion. With no
   * completed cases yet it falls back to the average age of the open ones, which
   * is the only honest number available.
   */
  const processingTime = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const done = sourcingCases.filter(sc => sc.overallStatus === "Completed" && sc.completedDate);
    if (done.length > 0) {
      const total = done.reduce((sum, sc) => sum + daysBetween(sc.dateCreated, sc.completedDate!), 0);
      return {
        value: `${Math.round(total / done.length)} days`,
        label: "Avg. Processing Time",
        sub: `${done.length} completed case${done.length === 1 ? "" : "s"}`,
      };
    }
    const open = sourcingCases.filter(sc => sc.overallStatus === "In Progress");
    if (open.length > 0) {
      const total = open.reduce((sum, sc) => sum + daysBetween(sc.dateCreated, today), 0);
      return {
        value: `${Math.round(total / open.length)} days`,
        label: "Avg. Age of Open Cases",
        sub: "No completed cases yet",
      };
    }
    return { value: "—", label: "Avg. Processing Time", sub: "No cases yet" };
  }, [sourcingCases]);

  /** Requestor-based summary the reporting requirement asks for. */
  const requestorSummary = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const map = new Map<string, { name: string; total: number; inProgress: number; completed: number; value: number; days: number[] }>();
    sourcingCases.forEach(sc => {
      const row = map.get(sc.requestedBy) ?? { name: sc.requestedBy, total: 0, inProgress: 0, completed: 0, value: 0, days: [] };
      row.total += 1;
      row.value += sc.budget;
      if (sc.overallStatus === "In Progress") row.inProgress += 1;
      if (sc.overallStatus === "Completed") row.completed += 1;
      row.days.push(daysBetween(sc.dateCreated, sc.completedDate ?? today));
      map.set(sc.requestedBy, row);
    });
    return Array.from(map.values())
      .map(r => ({ ...r, avgDays: r.days.length ? Math.round(r.days.reduce((a, b) => a + b, 0) / r.days.length) : 0 }))
      .sort((a, b) => b.total - a.total);
  }, [sourcingCases]);

  /** The requestor strip doubles as the requestor filter, so it reads as tabs. */
  const requestorTabs: ProcurementTab<string>[] = useMemo(
    () => requestorSummary.map(r => ({ key: r.name, label: r.name, count: r.total })),
    [requestorSummary]
  );

  const pendingDocuments = sourcingCases
    .filter(sc => sc.overallStatus === "In Progress")
    .reduce((acc, sc) => {
      const activeStep = sc.steps.find(s => s.status === "active");
      if (!activeStep) return acc;
      const requiredDocs = activeStep.key === "contract_award" ? 1 : 2;
      return acc + Math.max(0, requiredDocs - activeStep.documents.length);
    }, 0);

  /* ── Export ── */
  const exportRows = (): Record<string, unknown>[] => {
    const today = new Date().toISOString().split("T")[0];
    return filtered.map(sc => ({
      caseNumber: sc.caseNumber,
      sourcePR: sc.sourcePR,
      description: sc.description,
      category: sc.category,
      method: sc.method,
      budget: sc.budget,
      requestedBy: sc.requestedBy,
      department: sc.department,
      dateCreated: formatDate(sc.dateCreated),
      currentStep: sc.steps.find(s => s.key === sc.currentStepKey)?.label ?? "—",
      bids: bidCountFor(sc),
      status: sc.overallStatus,
      processingDays: daysBetween(sc.dateCreated, sc.completedDate ?? today),
      awardedVendor: sc.awardedVendor ?? "—",
      contractNumber: sc.contractNumber ?? "—",
    }));
  };

  const exportMeta = () => ({
    subtitle: [
      selectedRequestor !== ALL_REQUESTORS ? `Requestor: ${selectedRequestor}` : "All requestors",
      selectedCategory !== "All Categories" ? selectedCategory : "All categories",
      selectedMethod !== "All Methods" ? selectedMethod : "All methods",
      selectedStatus !== "All Statuses" ? selectedStatus : "All statuses",
    ].join(" · "),
    generatedBy: user.name,
  });

  const handleExport = (format: "excel" | "pdf" | "csv") => {
    const rows = exportRows();
    const title = "Sourcing Register";
    if (format === "excel") exportToExcel(title, EXPORT_COLUMNS, rows, exportMeta());
    else if (format === "pdf") exportToPDF(title, EXPORT_COLUMNS, rows, { ...exportMeta(), orientation: "landscape" });
    else exportToCSV(title, EXPORT_COLUMNS, rows);
    setShowExportMenu(false);
  };

  /* ── Helpers ── */
  const getMethodColor = (m: SourcingMethod) => {
    switch (canonicalMethod(m)) {
      case "Open Competition": return "bg-blue-50 text-blue-700";
      case "Limited Competition": return "bg-purple-50 text-purple-700";
      case "Direct Selection": return "bg-amber-50 text-amber-700";
      default: return "bg-green-50 text-green-700";
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case "In Progress": return "bg-blue-50 text-blue-700";
      case "Completed": return "bg-green-50 text-green-700";
      case "Cancelled": return "bg-red-50 text-red-700";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  const getCurrentStepLabel = (sc: SourcingCase) => {
    const step = sc.steps.find(s => s.key === sc.currentStepKey);
    return step ? step.label : "—";
  };

  // ── PO Generation Flow ──
  if (showPOFlow && selectedCase && selectedCase.contractNumber && selectedCase.awardedVendor) {
    return (
      <POGenerationFlow
        sourcePR={selectedCase.sourcePR}
        sourceSourcingCase={selectedCase.caseNumber}
        vendor={selectedCase.awardedVendor}
        itemDescription={selectedCase.description}
        budget={selectedCase.budget}
        category={selectedCase.category}
        method={selectedCase.method}
        department={selectedCase.department}
        requestedBy={selectedCase.requestedBy}
        projectName={selectedCase.projectName}
        contractNumber={selectedCase.contractNumber}
        onBack={() => setShowPOFlow(false)}
        onComplete={(poNum) => {
          setGeneratedPOs(prev => ({ ...prev, [selectedCase.id]: poNum }));
          setShowPOFlow(false);
        }}
      />
    );
  }

  // ── Detail View ──
  if (selectedCase) {
    return (
      <SourcingCaseDetail
        sourcingCase={selectedCase}
        onBack={() => setSelectedCase(null)}
        onMethodChange={handleMethodChange}
        onStepAdvance={handleStepAdvance}
        onContractAward={handleContractAward}
        onDocUpload={handleDocUpload}
        onVendorBidUpdate={handleVendorBidUpdate}
        onCaseUpdate={handleCaseUpdate}
        onNavigateToContract={onNavigate ? () => onNavigate("LEGAL & CONTRACTS-Contract Repository") : undefined}
        onGeneratePO={() => setShowPOFlow(true)}
        poGenerated={!!generatedPOs[selectedCase.id]}
        poNumber={generatedPOs[selectedCase.id]}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden" style={{ fontFamily: F }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-900" style={{ fontFamily: F }}>Sourcing</h1>
          <p className="text-[12px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>
            Approved requisitions automatically create sourcing cases. Manage the full procurement lifecycle.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>Signed in as</p>
            <p className="text-[11px] font-medium text-slate-700" style={{ fontFamily: F }}>
              {user.name} &middot; {user.roles.join(", ")}
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-[11px] text-blue-600" style={{ fontFamily: F }}>In Progress</span>
            <span className="text-[14px] font-semibold text-blue-700" style={{ fontFamily: F }}>{inProgress}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
            <span className="text-[11px] text-green-600" style={{ fontFamily: F }}>Completed</span>
            <span className="text-[14px] font-semibold text-green-700" style={{ fontFamily: F }}>{completed}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Total</span>
            <span className="text-[14px] font-semibold text-slate-700" style={{ fontFamily: F }}>{totalCases}</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center gap-2 shrink-0">
        <AlertTriangle size={14} className="text-amber-600 shrink-0" />
        <p className="text-[11px] text-amber-800" style={{ fontFamily: F }}>
          Sourcing cases are automatically created from fully approved purchase requisitions. Procurement can alter the sourcing method at any stage before contract award — deviations from the value thresholds must be justified.
        </p>
      </div>

      {/* Dashboard Stat Cards */}
      <ProcurementStatCards
        stats={[
          { label: "Active Sourcing Cases", value: inProgress, icon: <Activity size={14} />, tone: "info" },
          { label: "Completed This Month", value: completedThisMonth, icon: <CheckCircle2 size={14} />, tone: "success" },
          { label: processingTime.label, value: processingTime.value, sub: processingTime.sub, icon: <Clock size={14} />, tone: "accent" },
          { label: "Pending Documents", value: pendingDocuments, icon: <FileText size={14} />, tone: "warning" },
        ]}
      />

      {/* Requestor Summary */}
      {requestorSummary.length > 0 && (
        <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5" style={{ fontFamily: F }}>
              <UserCircle size={13} className="text-purple-600" /> Cases by Requestor
            </p>
            {selectedRequestor !== ALL_REQUESTORS && (
              <button onClick={() => setSelectedRequestor(ALL_REQUESTORS)}
                className="text-[10px] text-purple-600 hover:underline" style={{ fontFamily: F }}>
                Clear requestor filter
              </button>
            )}
          </div>
          <ProcurementTabs
            tabs={requestorTabs}
            active={selectedRequestor}
            onChange={name => setSelectedRequestor(selectedRequestor === name ? ALL_REQUESTORS : name)}
            minWidth={120}
          />
        </div>
      )}

      {/* Filters */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="relative max-w-[280px] flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search case #, PR, description..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{ fontFamily: F }}
            />
          </div>
          <div className="flex items-center gap-2">
            {/* Export */}
            <div className="relative">
              <button onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={!canExport}
                title={!canExport ? denialReason("report.export") : `Export ${filtered.length} case(s)`}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-[12px] text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontFamily: F }}>
                Export <Download size={14} className="text-purple-700" />
              </button>
              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    <p className="px-3 py-2 text-[10px] text-slate-400 border-b border-slate-100" style={{ fontFamily: F }}>
                      {filtered.length} case{filtered.length === 1 ? "" : "s"} in the current view
                    </p>
                    <button onClick={() => handleExport("excel")} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}>
                      <FileSpreadsheet size={13} className="text-green-600" /> Export to Excel
                    </button>
                    <button onClick={() => handleExport("pdf")} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}>
                      <FileText size={13} className="text-red-500" /> Export to PDF
                    </button>
                    <button onClick={() => handleExport("csv")} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}>
                      <Download size={13} className="text-slate-500" /> Export to CSV
                    </button>
                  </div>
                </>
              )}
            </div>
            {/* Requestor */}
            <div className="relative">
              <button onClick={() => { setShowRequestorDropdown(!showRequestorDropdown); setShowCategoryDropdown(false); setShowMethodDropdown(false); setShowStatusDropdown(false); }}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-[12px] text-slate-900" style={{ fontFamily: F }}>
                {selectedRequestor} <ChevronDown size={13} className="text-purple-700" />
              </button>
              {showRequestorDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowRequestorDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                    {requestors.map(r => (
                      <button key={r} onClick={() => { setSelectedRequestor(r); setShowRequestorDropdown(false); }} className="w-full px-4 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{r}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Category */}
            <div className="relative">
              <button onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowMethodDropdown(false); setShowStatusDropdown(false); setShowRequestorDropdown(false); }}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-[12px] text-slate-900" style={{ fontFamily: F }}>
                {selectedCategory} <ChevronDown size={13} className="text-purple-700" />
              </button>
              {showCategoryDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowCategoryDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                    {CATEGORIES.map(c => (
                      <button key={c} onClick={() => { setSelectedCategory(c); setShowCategoryDropdown(false); }} className="w-full px-4 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{c}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Method */}
            <div className="relative">
              <button onClick={() => { setShowMethodDropdown(!showMethodDropdown); setShowCategoryDropdown(false); setShowStatusDropdown(false); setShowRequestorDropdown(false); }}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-[12px] text-slate-900" style={{ fontFamily: F }}>
                {selectedMethod} <ChevronDown size={13} className="text-purple-700" />
              </button>
              {showMethodDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMethodDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                    {METHOD_FILTER.map(m => (
                      <button key={m} onClick={() => { setSelectedMethod(m); setShowMethodDropdown(false); }} className="w-full px-4 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{m}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Status */}
            <div className="relative">
              <button onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowCategoryDropdown(false); setShowMethodDropdown(false); setShowRequestorDropdown(false); }}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-[12px] text-slate-900" style={{ fontFamily: F }}>
                {selectedStatus} <ChevronDown size={13} className="text-purple-700" />
              </button>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                    {STATUS_FILTER.map(s => (
                      <button key={s} onClick={() => { setSelectedStatus(s); setShowStatusDropdown(false); }} className="w-full px-4 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{s}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Case #</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Source PR</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Description</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Category</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Method</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Budget</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Current Step</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Vendors Bidding</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-[13px] text-slate-400" style={{ fontFamily: F }}>
                  No sourcing cases match your filters.
                </td>
              </tr>
            ) : filtered.map((sc, i) => {
              const bidCount = bidCountFor(sc);
              return (
                <tr
                  key={sc.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                  onClick={() => setSelectedCase(sc)}
                >
                  <td className="px-4 py-3 text-[12px] text-purple-700 font-medium" style={{ fontFamily: F }}>{sc.caseNumber}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-indigo-50 text-indigo-700 font-medium">
                      {sc.sourcePR}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-slate-900 truncate max-w-[200px]" style={{ fontFamily: F }}>{sc.description}</p>
                    <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{sc.requestedBy} &middot; {sc.department}</p>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: F }}>{sc.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getMethodColor(sc.method)}`}>
                      {sc.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-[12px] text-slate-900 font-medium" style={{ fontFamily: F }}>
                    {formatCurrency(sc.budget)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-slate-700" style={{ fontFamily: F }}>{getCurrentStepLabel(sc)}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Users size={13} className={bidCount > 0 ? "text-purple-500" : "text-slate-300"} />
                      <span className={`text-[12px] font-medium ${bidCount > 0 ? "text-slate-900" : "text-slate-400"}`} style={{ fontFamily: F }}>
                        {bidCount}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(sc.overallStatus)}`}>
                      {sc.overallStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                    <div className="relative">
                      <button onClick={() => setOpenActionMenuId(openActionMenuId === sc.id ? null : sc.id)} className="inline-flex items-center justify-center w-8 h-8 hover:bg-slate-100 rounded transition-colors">
                        <MoreHorizontal size={16} className="text-slate-600" />
                      </button>
                      {openActionMenuId === sc.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenActionMenuId(null)} />
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                            <button onClick={() => { setSelectedCase(sc); setOpenActionMenuId(null); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}>
                              <Eye size={13} /> Open Case
                            </button>
                            <button onClick={() => { setOpenActionMenuId(null); onNavigate?.("PROCUREMENT-Purchase Requisitions"); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}>
                              <ChevronRight size={13} /> View {sc.sourcePR}
                            </button>
                            <button onClick={() => { setSelectedRequestor(sc.requestedBy); setOpenActionMenuId(null); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}>
                              <UserCircle size={13} /> Filter by requestor
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
