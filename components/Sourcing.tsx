import { useState, useEffect } from "react";
import { Search, Download, ChevronDown, MoreHorizontal, Eye, AlertTriangle, ChevronRight, Users, Activity, CheckCircle2, Clock, FileText } from "lucide-react";
import { getGeneratedPRs, subscribe } from "../lib/procurementStore";
import { pushContract } from "../lib/contractStore";
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
} from "./SourcingCaseDetail";
import { POGenerationFlow } from "./POGenerationFlow";

/* ══════════════════════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════════════════════ */

const F = "'Montserrat Variable', sans-serif";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const CATEGORIES = ["All Categories", "Goods", "Services", "Works", "Consultancy"];
const METHODS: SourcingMethod[] = ["Open Competition", "Limited Competition", "Direct Selection", "Request for Quotation"];
const METHOD_FILTER = ["All Methods", ...METHODS];
const STATUS_FILTER = ["All Statuses", "In Progress", "Completed", "Cancelled"];

function mapPurchaseTypeToMethod(pt: string): SourcingMethod {
  switch (pt) {
    case "Competitive Bidding": return "Open Competition";
    case "Single Source": return "Direct Selection";
    case "Request for Quotation": return "Request for Quotation";
    case "Direct Purchase": return "Direct Selection";
    default: return "Open Competition";
  }
}

function mapCategory(cat: string): CategoryType {
  if (cat === "Consultancy") return "Consultancy";
  if (cat === "Services") return "Services";
  if (cat === "Works") return "Works";
  return "Goods";
}

/* ── Step builder based on method + category ─────────────────────────────── */

function buildSteps(method: SourcingMethod, category: CategoryType): SourcingStep[] {
  const isService = category === "Services" || category === "Consultancy";
  const isCompetition = method === "Open Competition" || method === "Limited Competition";
  const isDirect = method === "Direct Selection";

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

  // 2. Advertisement — competition only (optional for Direct/RFQ)
  if (isCompetition) {
    steps.push({
      key: "advertisement",
      label: "Advertisement",
      icon: null,
      status: "locked",
      description: "Post to portal/ACET website and upload external ad proof.",
      documents: [],
    });
  } else if (!isDirect) {
    steps.push({
      key: "advertisement",
      label: "Advertisement",
      icon: null,
      status: "locked",
      description: "Post to portal (optional for this method).",
      optional: true,
      documents: [],
    });
  }

  // 3. EoI & Shortlisting — services competition only
  if (isCompetition && isService) {
    steps.push({
      key: "eoi_shortlisting",
      label: "EoI & Shortlisting",
      icon: null,
      status: "locked",
      description: "Evaluate Expressions of Interest and create a shortlist.",
      documents: [],
    });
  }

  // 4. Invitation — always
  steps.push({
    key: "invitation",
    label: isDirect ? "Select Vendor" : "Invite Bidders",
    icon: null,
    status: "locked",
    description: isDirect
      ? "Select the vendor directly from the database."
      : "Upload invitation letters and select shortlisted bidders.",
    documents: [],
  });

  // 5. Online Submission Portal — competition only, optional
  if (isCompetition) {
    steps.push({
      key: "submission_portal",
      label: "Online Submissions",
      icon: null,
      status: "locked",
      description: isService
        ? "Vendors submit electronically. Technical and financial proposals are separated."
        : "Vendors submit bids electronically. Encrypted and timestamped.",
      optional: true,
      documents: [],
    });
  }

  // 6. Bid Opening — always
  steps.push({
    key: "bid_opening",
    label: "Bid Opening",
    icon: null,
    status: "locked",
    description: "Upload minutes, attendance. Automated notifications sent to stakeholders.",
    documents: [],
  });

  // 7. Evaluation & Approvals — always
  steps.push({
    key: "evaluation",
    label: "Evaluation & Approvals",
    icon: null,
    status: "locked",
    description: isService
      ? "Upload combined evaluation report for technical and financial proposals."
      : "Upload standard evaluation report.",
    documents: [],
  });

  // 8. Negotiations — always optional
  steps.push({
    key: "negotiations",
    label: "Negotiations",
    icon: null,
    status: "locked",
    description: "Upload negotiation reports or minutes.",
    optional: true,
    documents: [],
  });

  // 9. Contract Award — always
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

/* ══════════════════════════════════════════════════════════════════════════════
   SEED SOURCING CASES (legacy + from approved PRs)
   ══════════════════════════════════════════════════════════════════════════════ */

function buildSeedCases(): SourcingCase[] {
  // Existing legacy RFQ data as sourcing cases at various stages
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

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

interface SourcingProps {
  onNavigate?: (navKey: string) => void;
}

export function Sourcing({ onNavigate }: SourcingProps) {
  const [, setTick] = useState(0);
  const [sourcingCases, setSourcingCases] = useState<SourcingCase[]>(buildSeedCases);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedMethod, setSelectedMethod] = useState("All Methods");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Detail view
  const [selectedCase, setSelectedCase] = useState<SourcingCase | null>(null);

  // PO Generation flow
  const [showPOFlow, setShowPOFlow] = useState(false);
  const [generatedPOs, setGeneratedPOs] = useState<Record<string, string>>({}); // caseId -> poNumber

  // Subscribe to store and auto-pull approved PRs as new sourcing cases
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
            newCases.push({
              id: `SC-${pr.id}`,
              caseNumber: `SRC-${pr.requisitionNumber.replace("PR-", "")}`,
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

        if (newCases.length > 0) return [...prev, ...newCases];
        return prev;
      });

      setTick(t => t + 1);
    };

    sync();
    const unsub = subscribe(sync);
    return unsub;
  }, []);

  // ── Filter ──
  const filtered = sourcingCases.filter(sc => {
    const q = searchQuery.toLowerCase();
    const matchSearch = sc.caseNumber.toLowerCase().includes(q) ||
      sc.sourcePR.toLowerCase().includes(q) ||
      sc.description.toLowerCase().includes(q) ||
      sc.requestedBy.toLowerCase().includes(q);
    const matchCat = selectedCategory === "All Categories" || sc.category === selectedCategory;
    const matchMethod = selectedMethod === "All Methods" || sc.method === selectedMethod;
    const matchStatus = selectedStatus === "All Statuses" || sc.overallStatus === selectedStatus;
    return matchSearch && matchCat && matchMethod && matchStatus;
  });

  // Stats
  const totalCases = sourcingCases.length;
  const inProgress = sourcingCases.filter(sc => sc.overallStatus === "In Progress").length;
  const completed = sourcingCases.filter(sc => sc.overallStatus === "Completed").length;

  // ── Method change handler ──
  const handleMethodChange = (caseId: string, newMethod: SourcingMethod) => {
    setSourcingCases(prev => prev.map(sc => {
      if (sc.id !== caseId) return sc;
      const newSteps = buildSteps(newMethod, sc.category);
      // Preserve completed steps where keys match
      const updated = newSteps.map(ns => {
        const old = sc.steps.find(os => os.key === ns.key);
        if (old && old.status === "completed") return { ...ns, status: "completed" as StepStatus, documents: old.documents };
        return ns;
      });
      // Set first non-completed step as active
      let foundActive = false;
      const final = updated.map(s => {
        if (s.status !== "completed" && !foundActive) {
          foundActive = true;
          return { ...s, status: "active" as StepStatus };
        }
        if (s.status !== "completed" && foundActive) return { ...s, status: "locked" as StepStatus };
        return s;
      });
      const currentKey = final.find(s => s.status === "active")?.key || final[0].key;
      return { ...sc, method: newMethod, steps: final, currentStepKey: currentKey };
    }));
    // Update selectedCase if viewing detail
    if (selectedCase?.id === caseId) {
      setSourcingCases(prev => {
        const updated = prev.find(sc => sc.id === caseId);
        if (updated) setSelectedCase({ ...updated });
        return prev;
      });
    }
  };

  // ── Step advance handler ──
  const handleStepAdvance = (caseId: string, stepKey: string) => {
    setSourcingCases(prev => {
      const updated = prev.map(sc => {
        if (sc.id !== caseId) return sc;
        const stepIdx = sc.steps.findIndex(s => s.key === stepKey);
        if (stepIdx === -1) return sc;

        const newSteps = [...sc.steps];
        newSteps[stepIdx] = { ...newSteps[stepIdx], status: "completed" as StepStatus };

        // Find next locked step and set to active
        let nextActiveKey = sc.currentStepKey;
        let isCompleted = true;
        for (let i = stepIdx + 1; i < newSteps.length; i++) {
          if (newSteps[i].status === "locked") {
            newSteps[i] = { ...newSteps[i], status: "active" as StepStatus };
            nextActiveKey = newSteps[i].key;
            isCompleted = false;
            break;
          }
        }

        const overallStatus = isCompleted && newSteps.every(s => s.status === "completed") ? "Completed" as const : sc.overallStatus;

        return { ...sc, steps: newSteps, currentStepKey: nextActiveKey, overallStatus };
      });
      // Re-sync detail view
      const current = updated.find(sc => sc.id === caseId);
      if (current) setSelectedCase({ ...current });
      return updated;
    });
  };

  // ── Contract Award handler ──
  const handleContractAward = (payload: ContractAwardPayload) => {
    // Push to contract store
    const sc = sourcingCases.find(c => c.id === payload.caseId);
    if (!sc) return;

    pushContract({
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

    // Update sourcing case
    setSourcingCases(prev => {
      const updated = prev.map(c => {
        if (c.id !== payload.caseId) return c;
        const newSteps = c.steps.map(s =>
          s.key === "contract_award" ? { ...s, status: "completed" as StepStatus } : s
        );
        return {
          ...c,
          steps: newSteps,
          awardedVendor: payload.vendor,
          contractNumber: payload.contractNumber,
          overallStatus: "Completed" as const,
          currentStepKey: "contract_award",
        };
      });
      const current = updated.find(c => c.id === payload.caseId);
      if (current) setSelectedCase({ ...current });
      return updated;
    });
  };

  // ── Vendor Bid Update handler ──
  const handleVendorBidUpdate = (payload: VendorBidUpdatePayload) => {
    setSourcingCases(prev => {
      const updated = prev.map(sc => {
        if (sc.id !== payload.caseId) return sc;
        return { ...sc, vendorsBidding: payload.vendorsBidding };
      });
      const current = updated.find(sc => sc.id === payload.caseId);
      if (current) setSelectedCase({ ...current });
      return updated;
    });
  };

  // ── Document Upload handler ──
  const handleDocUpload = (payload: DocUploadPayload) => {
    setSourcingCases(prev => {
      const updated = prev.map(sc => {
        if (sc.id !== payload.caseId) return sc;
        const newSteps = sc.steps.map(step => {
          if (step.key !== payload.stepKey) return step;
          // Check if replacing existing doc with same label
          const existingIdx = step.documents.findIndex(d => d.label === payload.doc.label);
          let newDocs: UploadedDoc[];
          if (existingIdx >= 0) {
            newDocs = [...step.documents];
            newDocs[existingIdx] = payload.doc;
          } else {
            newDocs = [...step.documents, payload.doc];
          }
          return { ...step, documents: newDocs };
        });
        return { ...sc, steps: newSteps };
      });
      const current = updated.find(sc => sc.id === payload.caseId);
      if (current) setSelectedCase({ ...current });
      return updated;
    });
  };

  // ── Helpers ──
  const getMethodColor = (m: SourcingMethod) => {
    switch (m) {
      case "Open Competition": return "bg-blue-50 text-blue-700";
      case "Limited Competition": return "bg-purple-50 text-purple-700";
      case "Direct Selection": return "bg-amber-50 text-amber-700";
      case "Request for Quotation": return "bg-green-50 text-green-700";
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

  const getVendorBidCount = (sc: SourcingCase) => sc.vendorsBidding?.length || 0;

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
          Sourcing cases are automatically created from fully approved purchase requisitions. Procurement can alter the sourcing method at any stage before contract award.
        </p>
      </div>

      {/* Dashboard Stat Cards */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#0B01D015" }}>
              <Activity size={18} style={{ color: "#0B01D0" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold text-slate-900" style={{ fontFamily: F }}>{inProgress}</p>
              <p className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Active Sourcing Cases</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#0B01D015" }}>
              <CheckCircle2 size={18} style={{ color: "#0B01D0" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold text-slate-900" style={{ fontFamily: F }}>
                {sourcingCases.filter(sc => sc.overallStatus === "Completed" && new Date(sc.dateCreated).getMonth() === new Date().getMonth() && new Date(sc.dateCreated).getFullYear() === new Date().getFullYear()).length}
              </p>
              <p className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Completed This Month</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#0B01D015" }}>
              <Clock size={18} style={{ color: "#0B01D0" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold text-slate-900" style={{ fontFamily: F }}>18 days</p>
              <p className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Avg. Processing Time</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#0B01D015" }}>
              <FileText size={18} style={{ color: "#0B01D0" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold text-slate-900" style={{ fontFamily: F }}>
                {sourcingCases.filter(sc => sc.overallStatus === "In Progress").reduce((acc, sc) => {
                  const activeStep = sc.steps.find(s => s.status === "active");
                  if (!activeStep) return acc;
                  const requiredDocs = activeStep.key === "contract_award" ? 1 : 2;
                  return acc + Math.max(0, requiredDocs - activeStep.documents.length);
                }, 0)}
              </p>
              <p className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Pending Documents</p>
            </div>
          </div>
        </div>
      </div>

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
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-[12px] text-slate-900" style={{ fontFamily: F }}>
              Export <Download size={14} className="text-purple-700" />
            </button>
            {/* Category */}
            <div className="relative">
              <button onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowMethodDropdown(false); setShowStatusDropdown(false); }}
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
              <button onClick={() => { setShowMethodDropdown(!showMethodDropdown); setShowCategoryDropdown(false); setShowStatusDropdown(false); }}
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
              <button onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowCategoryDropdown(false); setShowMethodDropdown(false); }}
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
            ) : filtered.map((sc, i) => (
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
                    <Users size={13} className={getVendorBidCount(sc) > 0 ? "text-purple-500" : "text-slate-300"} />
                    <span className={`text-[12px] font-medium ${getVendorBidCount(sc) > 0 ? "text-slate-900" : "text-slate-400"}`} style={{ fontFamily: F }}>
                      {getVendorBidCount(sc)}
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
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                          <button onClick={() => { setSelectedCase(sc); setOpenActionMenuId(null); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}>
                            <Eye size={13} /> Open Case
                          </button>
                          <button onClick={() => { setOpenActionMenuId(null); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}>
                            <ChevronRight size={13} /> View PR
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}