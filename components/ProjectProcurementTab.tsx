import { useState } from "react";
import { ChevronDown, ChevronRight, ChevronUp, MoreHorizontal, Package, FileText, ShoppingCart, TrendingUp, AlertTriangle, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { Badge } from "./ui/badge";

// ─── Budget-aligned procurement data ────────────────────────────────────────
// Each line item from the budget that has an external/procurable component

interface ProcurementLineItem {
  budgetLineId: string;
  name: string;
  planned: number;
  actual: number;
  procurementMethod: "Direct Purchase" | "Competitive Bidding" | "Request for Quotation" | "Single Source" | "Framework Agreement";
  category: "Goods/Equipment" | "Services" | "Works" | "Consulting";
  vendor: string | null;
  procurementStatus: "Not Started" | "Requisition Raised" | "RFQ Issued" | "Evaluation" | "PO Issued" | "Delivered" | "Completed" | "Cancelled";
  poNumber: string | null;
  contractId: string | null;
  expectedDelivery: string;
}

interface ProcurementTask {
  taskId: string;
  taskName: string;
  lineItems: ProcurementLineItem[];
}

interface ProcurementPhase {
  phaseId: string;
  phaseName: string;
  tasks: ProcurementTask[];
}

const PROCUREMENT_DATA: ProcurementPhase[] = [
  {
    phaseId: "P1",
    phaseName: "Stage 1: Procurement & Contracting (Optional)",
    tasks: [
      {
        taskId: "T001",
        taskName: "Draft Request for Proposals (RFP)",
        lineItems: [
          { budgetLineId: "L001", name: "Consultant Fees - Survey Design", planned: 8000, actual: 8000, procurementMethod: "Single Source", category: "Consulting", vendor: "Dr. Kwesi Appiah", procurementStatus: "Completed", poNumber: "PO-10001", contractId: "CTR-2025-001", expectedDelivery: "2025-02-28" },
          { budgetLineId: "L002", name: "Printing & Materials", planned: 1200, actual: 1050, procurementMethod: "Direct Purchase", category: "Goods/Equipment", vendor: "PrintWorks Ghana Ltd", procurementStatus: "Completed", poNumber: "PO-10002", contractId: null, expectedDelivery: "2025-01-30" },
          { budgetLineId: "L003", name: "Stakeholder Workshop", planned: 3500, actual: 3500, procurementMethod: "Request for Quotation", category: "Services", vendor: "La Palm Royal Beach Hotel", procurementStatus: "Completed", poNumber: "PO-10003", contractId: null, expectedDelivery: "2025-02-15" },
        ],
      },
      {
        taskId: "T002",
        taskName: "Evaluate Vendor Submissions",
        lineItems: [
          { budgetLineId: "L004", name: "External Reviewer Honoraria", planned: 4000, actual: 4000, procurementMethod: "Single Source", category: "Consulting", vendor: "Prof. Ama Benyiwa", procurementStatus: "Completed", poNumber: "PO-10004", contractId: "CTR-2025-002", expectedDelivery: "2025-03-15" },
          { budgetLineId: "L005", name: "Review Meeting Logistics", planned: 1500, actual: 1200, procurementMethod: "Direct Purchase", category: "Services", vendor: "Accra Events Hub", procurementStatus: "Completed", poNumber: "PO-10005", contractId: null, expectedDelivery: "2025-03-10" },
        ],
      },
      {
        taskId: "T003",
        taskName: "Finalize Service Agreements",
        lineItems: [
          { budgetLineId: "L006", name: "Research Assistant Stipends", planned: 6000, actual: 6000, procurementMethod: "Direct Purchase", category: "Services", vendor: "University of Ghana - Dept of Economics", procurementStatus: "Completed", poNumber: "PO-10006", contractId: "CTR-2025-003", expectedDelivery: "2025-04-01" },
          { budgetLineId: "L007", name: "Database Subscriptions", planned: 2000, actual: 1800, procurementMethod: "Framework Agreement", category: "Services", vendor: "JSTOR / Elsevier", procurementStatus: "Completed", poNumber: "PO-10007", contractId: null, expectedDelivery: "2025-01-15" },
          { budgetLineId: "L008", name: "Reference Materials", planned: 800, actual: 650, procurementMethod: "Direct Purchase", category: "Goods/Equipment", vendor: "Bookshop Ghana Ltd", procurementStatus: "Completed", poNumber: "PO-10008", contractId: null, expectedDelivery: "2025-02-10" },
        ],
      },
    ],
  },
  {
    phaseId: "P2",
    phaseName: "Stage 2: Implementation (Mandatory)",
    tasks: [
      {
        taskId: "T004",
        taskName: "Coordinate Field Data Collection",
        lineItems: [
          { budgetLineId: "L009", name: "Venue & Catering", planned: 5000, actual: 4800, procurementMethod: "Request for Quotation", category: "Services", vendor: "Kempinski Hotel Gold Coast", procurementStatus: "Completed", poNumber: "PO-10009", contractId: null, expectedDelivery: "2025-05-01" },
          { budgetLineId: "L010", name: "Audio-Visual Equipment Rental", planned: 2000, actual: 1950, procurementMethod: "Direct Purchase", category: "Services", vendor: "AV Solutions Accra", procurementStatus: "Completed", poNumber: "PO-10010", contractId: null, expectedDelivery: "2025-05-01" },
          { budgetLineId: "L011", name: "Facilitator Fees", planned: 3000, actual: 3000, procurementMethod: "Single Source", category: "Consulting", vendor: "Nana Yaw Mensah", procurementStatus: "Completed", poNumber: "PO-10011", contractId: null, expectedDelivery: "2025-05-01" },
        ],
      },
      {
        taskId: "T005",
        taskName: "Conduct Stakeholder Engagement Sessions",
        lineItems: [
          { budgetLineId: "L012", name: "Consultant Fees - Engagement", planned: 7000, actual: 5600, procurementMethod: "Competitive Bidding", category: "Consulting", vendor: "Ghana Research Associates", procurementStatus: "PO Issued", poNumber: "PO-10012", contractId: "CTR-2025-004", expectedDelivery: "2025-07-15" },
          { budgetLineId: "L013", name: "Community Outreach Materials", planned: 3000, actual: 2100, procurementMethod: "Request for Quotation", category: "Goods/Equipment", vendor: "CreativeEdge Designs", procurementStatus: "Delivered", poNumber: "PO-10013", contractId: null, expectedDelivery: "2025-06-30" },
          { budgetLineId: "L014", name: "Travel - Stakeholder Visits", planned: 4500, actual: 3200, procurementMethod: "Direct Purchase", category: "Services", vendor: null, procurementStatus: "Requisition Raised", poNumber: null, contractId: null, expectedDelivery: "2025-08-01" },
        ],
      },
      {
        taskId: "T009",
        taskName: "Procure IT Equipment",
        lineItems: [
          { budgetLineId: "L015", name: "Laptops (50x Dell Latitude)", planned: 47500, actual: 47500, procurementMethod: "Competitive Bidding", category: "Goods/Equipment", vendor: "Dell Inc. (via Telefonika Ghana)", procurementStatus: "Delivered", poNumber: "PO-10014", contractId: "CTR-2025-005", expectedDelivery: "2025-06-15" },
          { budgetLineId: "L016", name: "Networking Equipment", planned: 3500, actual: 0, procurementMethod: "Request for Quotation", category: "Goods/Equipment", vendor: null, procurementStatus: "RFQ Issued", poNumber: null, contractId: null, expectedDelivery: "2025-09-01" },
          { budgetLineId: "L017", name: "Software Licences", planned: 8000, actual: 0, procurementMethod: "Framework Agreement", category: "Services", vendor: null, procurementStatus: "Evaluation", poNumber: null, contractId: null, expectedDelivery: "2025-09-15" },
        ],
      },
    ],
  },
  {
    phaseId: "P3",
    phaseName: "Stage 3: Quality Assurance (Mandatory)",
    tasks: [
      {
        taskId: "T006",
        taskName: "Conduct Internal Peer Review of Draft",
        lineItems: [
          { budgetLineId: "L018", name: "QA Reviewer Wages", planned: 12000, actual: 0, procurementMethod: "Request for Quotation", category: "Services", vendor: null, procurementStatus: "Not Started", poNumber: null, contractId: null, expectedDelivery: "2026-01-15" },
          { budgetLineId: "L019", name: "Testing Tools & Subscriptions", planned: 5000, actual: 0, procurementMethod: "Direct Purchase", category: "Services", vendor: null, procurementStatus: "Not Started", poNumber: null, contractId: null, expectedDelivery: "2026-01-15" },
        ],
      },
    ],
  },
  {
    phaseId: "P4",
    phaseName: "Stage 4: Production & Editorial (Mandatory)",
    tasks: [
      {
        taskId: "T007",
        taskName: "Design and Layout Report",
        lineItems: [
          { budgetLineId: "L020", name: "Graphic Design Services", planned: 6000, actual: 0, procurementMethod: "Single Source", category: "Consulting", vendor: null, procurementStatus: "Not Started", poNumber: null, contractId: null, expectedDelivery: "2026-03-01" },
          { budgetLineId: "L021", name: "Editorial Review Services", planned: 4000, actual: 0, procurementMethod: "Request for Quotation", category: "Services", vendor: null, procurementStatus: "Not Started", poNumber: null, contractId: null, expectedDelivery: "2026-04-01" },
        ],
      },
    ],
  },
  {
    phaseId: "P5",
    phaseName: "Stage 5: Dissemination (Optional)",
    tasks: [
      {
        taskId: "T010",
        taskName: "Plan Distribution Channels",
        lineItems: [
          { budgetLineId: "L022", name: "Distribution Platform Fees", planned: 3500, actual: 0, procurementMethod: "Direct Purchase", category: "Services", vendor: null, procurementStatus: "Not Started", poNumber: null, contractId: null, expectedDelivery: "2026-05-01" },
        ],
      },
    ],
  },
  {
    phaseId: "P6",
    phaseName: "Stage 6: Reporting (Mandatory)",
    tasks: [
      {
        taskId: "T008",
        taskName: "Submit Final Technical Report",
        lineItems: [
          { budgetLineId: "L023", name: "Report Design & Layout", planned: 3000, actual: 0, procurementMethod: "Request for Quotation", category: "Services", vendor: null, procurementStatus: "Not Started", poNumber: null, contractId: null, expectedDelivery: "2026-07-01" },
          { budgetLineId: "L024", name: "Printing & Distribution", planned: 2000, actual: 0, procurementMethod: "Direct Purchase", category: "Goods/Equipment", vendor: null, procurementStatus: "Not Started", poNumber: null, contractId: null, expectedDelivery: "2026-08-01" },
          { budgetLineId: "L025", name: "Final Audit Fees", planned: 4500, actual: 0, procurementMethod: "Single Source", category: "Consulting", vendor: null, procurementStatus: "Not Started", poNumber: null, contractId: null, expectedDelivery: "2026-08-15" },
        ],
      },
    ],
  },
  {
    phaseId: "P7",
    phaseName: "Delivery Stage Complete (Checkpoint)",
    tasks: [
      {
        taskId: "T015",
        taskName: "Sign-off and Handover",
        lineItems: [
          { budgetLineId: "L026", name: "Final Review & Sign-off Meeting", planned: 1500, actual: 0, procurementMethod: "Direct Purchase", category: "Services", vendor: null, procurementStatus: "Not Started", poNumber: null, contractId: null, expectedDelivery: "2026-09-01" },
        ],
      },
    ],
  },
];

// ─── Contracts derived from budget line items ──────────────────────────────

interface Contract {
  contractId: string;
  vendor: string;
  service: string;
  linkedBudgetLines: string[];
  startDate: string;
  endDate: string;
  contractValue: number;
  amountPaid: number;
  status: "Active" | "Completed" | "Pending Signature" | "Terminated";
}

const CONTRACTS: Contract[] = [
  { contractId: "CTR-2025-001", vendor: "Dr. Kwesi Appiah", service: "Survey Design Consultancy", linkedBudgetLines: ["L001"], startDate: "Jan 10, 2025", endDate: "Feb 28, 2025", contractValue: 8000, amountPaid: 8000, status: "Completed" },
  { contractId: "CTR-2025-002", vendor: "Prof. Ama Benyiwa", service: "External Peer Review", linkedBudgetLines: ["L004"], startDate: "Feb 15, 2025", endDate: "Mar 15, 2025", contractValue: 4000, amountPaid: 4000, status: "Completed" },
  { contractId: "CTR-2025-003", vendor: "University of Ghana", service: "Research Assistant Services", linkedBudgetLines: ["L006"], startDate: "Jan 20, 2025", endDate: "Apr 1, 2025", contractValue: 6000, amountPaid: 6000, status: "Completed" },
  { contractId: "CTR-2025-004", vendor: "Ghana Research Associates", service: "Stakeholder Engagement Consultancy", linkedBudgetLines: ["L012"], startDate: "May 1, 2025", endDate: "Jul 31, 2025", contractValue: 7000, amountPaid: 5600, status: "Active" },
  { contractId: "CTR-2025-005", vendor: "Dell Inc. (via Telefonika Ghana)", service: "IT Equipment Supply", linkedBudgetLines: ["L015"], startDate: "Apr 15, 2025", endDate: "Jun 15, 2025", contractValue: 47500, amountPaid: 47500, status: "Completed" },
];

// ─── Purchase Orders derived from budget line items ────────────────────────

interface PurchaseOrder {
  poNumber: string;
  linkedBudgetLine: string;
  linkedBudgetLineName: string;
  vendor: string;
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
  dateIssued: string;
  status: "Draft" | "Issued" | "Received" | "Paid" | "Cancelled";
}

const PURCHASE_ORDERS: PurchaseOrder[] = [
  { poNumber: "PO-10001", linkedBudgetLine: "L001", linkedBudgetLineName: "Consultant Fees - Survey Design", vendor: "Dr. Kwesi Appiah", description: "Survey design consultancy - full engagement", qty: 1, unitPrice: 8000, total: 8000, dateIssued: "Jan 12, 2025", status: "Paid" },
  { poNumber: "PO-10002", linkedBudgetLine: "L002", linkedBudgetLineName: "Printing & Materials", vendor: "PrintWorks Ghana Ltd", description: "Survey instrument printing (200 copies)", qty: 200, unitPrice: 5.25, total: 1050, dateIssued: "Jan 25, 2025", status: "Paid" },
  { poNumber: "PO-10003", linkedBudgetLine: "L003", linkedBudgetLineName: "Stakeholder Workshop", vendor: "La Palm Royal Beach Hotel", description: "Full-day workshop venue + catering (40 pax)", qty: 1, unitPrice: 3500, total: 3500, dateIssued: "Feb 5, 2025", status: "Paid" },
  { poNumber: "PO-10006", linkedBudgetLine: "L006", linkedBudgetLineName: "Research Assistant Stipends", vendor: "University of Ghana", description: "3 Research Assistants - 3 months", qty: 3, unitPrice: 2000, total: 6000, dateIssued: "Jan 22, 2025", status: "Paid" },
  { poNumber: "PO-10009", linkedBudgetLine: "L009", linkedBudgetLineName: "Venue & Catering", vendor: "Kempinski Hotel Gold Coast", description: "Kick-off meeting venue + catering (60 pax)", qty: 1, unitPrice: 4800, total: 4800, dateIssued: "Apr 20, 2025", status: "Paid" },
  { poNumber: "PO-10010", linkedBudgetLine: "L010", linkedBudgetLineName: "Audio-Visual Equipment Rental", vendor: "AV Solutions Accra", description: "Projector, PA system, recording equipment", qty: 1, unitPrice: 1950, total: 1950, dateIssued: "Apr 22, 2025", status: "Paid" },
  { poNumber: "PO-10012", linkedBudgetLine: "L012", linkedBudgetLineName: "Consultant Fees - Engagement", vendor: "Ghana Research Associates", description: "Stakeholder engagement consultancy (Phase 1)", qty: 1, unitPrice: 5600, total: 5600, dateIssued: "May 5, 2025", status: "Issued" },
  { poNumber: "PO-10013", linkedBudgetLine: "L013", linkedBudgetLineName: "Community Outreach Materials", vendor: "CreativeEdge Designs", description: "Brochures, banners, IEC materials", qty: 500, unitPrice: 4.20, total: 2100, dateIssued: "May 15, 2025", status: "Received" },
  { poNumber: "PO-10014", linkedBudgetLine: "L015", linkedBudgetLineName: "Laptops (50x Dell Latitude)", vendor: "Dell Inc. (via Telefonika Ghana)", description: "Dell Latitude 5520, 16GB RAM, 512GB SSD", qty: 50, unitPrice: 950, total: 47500, dateIssued: "Apr 18, 2025", status: "Received" },
];

// ─── Implementation stage overrides ─────────────────────────────────────────
// When in Implementation stage, procurement is mostly done

const IMPL_PROCUREMENT_OVERRIDES: Record<string, Partial<ProcurementLineItem>> = {
  L012: { actual: 7000, procurementStatus: "Completed", poNumber: "PO-10012", vendor: "Ghana Research Associates" },
  L013: { actual: 2800, procurementStatus: "Completed", poNumber: "PO-10013", vendor: "CreativeEdge Designs" },
  L014: { actual: 4200, procurementStatus: "Completed", poNumber: "PO-10015", vendor: "GH Transport Services", contractId: null },
  L016: { actual: 3200, procurementStatus: "Delivered", poNumber: "PO-10016", vendor: "Cisco Systems (via CompuGhana)", contractId: "CTR-2025-006" },
  L017: { actual: 7500, procurementStatus: "Completed", poNumber: "PO-10017", vendor: "Microsoft (via SoftLogic Ghana)", contractId: "CTR-2025-007" },
  L018: { actual: 8400, procurementStatus: "PO Issued", poNumber: "PO-10018", vendor: "Ghana Field Services Ltd", contractId: "CTR-2025-008" },
  L019: { actual: 3200, procurementStatus: "PO Issued", poNumber: "PO-10019", vendor: "Star Transport Co." },
  L020: { actual: 3500, procurementStatus: "Delivered", poNumber: "PO-10020", vendor: "SurveyGo Technologies", contractId: "CTR-2025-009" },
  L021: { actual: 2400, procurementStatus: "PO Issued", poNumber: "PO-10021", vendor: "Dr. Kwame Boakye", contractId: "CTR-2025-010" },
  L022: { actual: 0, procurementStatus: "Requisition Raised", vendor: null, poNumber: null },
};

function getProcurementData(projectStage: string): ProcurementPhase[] {
  if (projectStage === "Closure") {
    // In Closure, all procurement items are completed with full spend
    const closureVendors: Record<string, { vendor: string; poNumber: string; contractId: string | null }> = {
      L014: { vendor: "GH Transport Services", poNumber: "PO-10015", contractId: null },
      L016: { vendor: "Cisco Systems (via CompuGhana)", poNumber: "PO-10016", contractId: "CTR-2025-006" },
      L017: { vendor: "Microsoft (via SoftLogic Ghana)", poNumber: "PO-10017", contractId: "CTR-2025-007" },
      L018: { vendor: "Ghana Field Services Ltd", poNumber: "PO-10018", contractId: "CTR-2025-008" },
      L019: { vendor: "Star Transport Co.", poNumber: "PO-10019", contractId: null },
      L020: { vendor: "SurveyGo Technologies", poNumber: "PO-10020", contractId: "CTR-2025-009" },
      L021: { vendor: "Dr. Kwame Boakye", poNumber: "PO-10021", contractId: "CTR-2025-010" },
      L022: { vendor: "Accra International Conference Centre", poNumber: "PO-10022", contractId: null },
      L023: { vendor: "GraphicDesign Pro", poNumber: "PO-10023", contractId: null },
      L024: { vendor: "PrintWorks Ghana Ltd", poNumber: "PO-10024", contractId: null },
      L025: { vendor: "KPMG Ghana", poNumber: "PO-10025", contractId: "CTR-2025-011" },
    };
    return PROCUREMENT_DATA.map(phase => ({
      ...phase,
      tasks: phase.tasks.map(task => ({
        ...task,
        lineItems: task.lineItems.map(li => {
          const closureOverride = closureVendors[li.budgetLineId];
          return {
            ...li,
            actual: li.planned,
            procurementStatus: "Completed" as const,
            vendor: closureOverride?.vendor || li.vendor,
            poNumber: closureOverride?.poNumber || li.poNumber,
            contractId: closureOverride?.contractId !== undefined ? closureOverride.contractId : li.contractId,
          };
        }),
      })),
    }));
  }

  if (projectStage !== "Delivery") return PROCUREMENT_DATA;
  
  return PROCUREMENT_DATA.map(phase => ({
    ...phase,
    tasks: phase.tasks.map(task => ({
      ...task,
      lineItems: task.lineItems.map(li => {
        const override = IMPL_PROCUREMENT_OVERRIDES[li.budgetLineId];
        return override ? { ...li, ...override } as ProcurementLineItem : li;
      }),
    })),
  }));
}

const IMPL_CONTRACTS: Contract[] = [
  ...CONTRACTS.map(c => c.contractId === "CTR-2025-004" ? { ...c, amountPaid: 7000, status: "Completed" as const } : c),
  { contractId: "CTR-2025-006", vendor: "Cisco Systems (via CompuGhana)", service: "Network Infrastructure Supply", linkedBudgetLines: ["L016"], startDate: "Jul 1, 2025", endDate: "Sep 15, 2025", contractValue: 3500, amountPaid: 3200, status: "Completed" },
  { contractId: "CTR-2025-007", vendor: "Microsoft (via SoftLogic Ghana)", service: "Enterprise Software Licences", linkedBudgetLines: ["L017"], startDate: "Jul 15, 2025", endDate: "Jul 15, 2026", contractValue: 8000, amountPaid: 7500, status: "Active" },
  { contractId: "CTR-2025-008", vendor: "Ghana Field Services Ltd", service: "Field Data Collection Services", linkedBudgetLines: ["L018"], startDate: "Oct 1, 2025", endDate: "Mar 31, 2026", contractValue: 12000, amountPaid: 8400, status: "Active" },
  { contractId: "CTR-2025-009", vendor: "SurveyGo Technologies", service: "Mobile Data Collection Platform", linkedBudgetLines: ["L020"], startDate: "Sep 15, 2025", endDate: "Sep 14, 2026", contractValue: 3500, amountPaid: 3500, status: "Active" },
  { contractId: "CTR-2025-010", vendor: "Dr. Kwame Boakye", service: "Policy Expert Consultation", linkedBudgetLines: ["L021"], startDate: "Nov 1, 2025", endDate: "Apr 30, 2026", contractValue: 6000, amountPaid: 2400, status: "Active" },
];

const IMPL_PURCHASE_ORDERS: PurchaseOrder[] = [
  ...PURCHASE_ORDERS.map(po => {
    if (po.poNumber === "PO-10012") return { ...po, total: 7000, unitPrice: 7000, status: "Paid" as const };
    if (po.poNumber === "PO-10013") return { ...po, total: 2800, unitPrice: 5.60, status: "Paid" as const };
    if (po.poNumber === "PO-10014") return { ...po, status: "Paid" as const };
    return po;
  }),
  { poNumber: "PO-10015", linkedBudgetLine: "L014", linkedBudgetLineName: "Travel - Stakeholder Visits", vendor: "GH Transport Services", description: "Regional travel for stakeholder engagement", qty: 1, unitPrice: 4200, total: 4200, dateIssued: "Jun 10, 2025", status: "Paid" },
  { poNumber: "PO-10016", linkedBudgetLine: "L016", linkedBudgetLineName: "Networking Equipment", vendor: "Cisco Systems (via CompuGhana)", description: "Switches, routers, cabling (8 sites)", qty: 8, unitPrice: 400, total: 3200, dateIssued: "Jul 5, 2025", status: "Received" },
  { poNumber: "PO-10017", linkedBudgetLine: "L017", linkedBudgetLineName: "Software Licences", vendor: "Microsoft (via SoftLogic Ghana)", description: "Office 365 + Azure AD licences (50 users)", qty: 50, unitPrice: 150, total: 7500, dateIssued: "Jul 18, 2025", status: "Paid" },
  { poNumber: "PO-10018", linkedBudgetLine: "L018", linkedBudgetLineName: "Field Enumerator Wages", vendor: "Ghana Field Services Ltd", description: "20 enumerators - monthly wages", qty: 20, unitPrice: 420, total: 8400, dateIssued: "Oct 5, 2025", status: "Issued" },
  { poNumber: "PO-10019", linkedBudgetLine: "L019", linkedBudgetLineName: "Transport & Fuel", vendor: "Star Transport Co.", description: "Vehicle hire + fuel for field operations", qty: 1, unitPrice: 3200, total: 3200, dateIssued: "Oct 8, 2025", status: "Issued" },
  { poNumber: "PO-10020", linkedBudgetLine: "L020", linkedBudgetLineName: "Mobile Data Collection Tools", vendor: "SurveyGo Technologies", description: "20x tablets + SurveyGo licences", qty: 20, unitPrice: 175, total: 3500, dateIssued: "Sep 20, 2025", status: "Received" },
  { poNumber: "PO-10021", linkedBudgetLine: "L021", linkedBudgetLineName: "Policy Expert Consultation", vendor: "Dr. Kwame Boakye", description: "Policy review consultancy - Phase 1", qty: 1, unitPrice: 2400, total: 2400, dateIssued: "Nov 5, 2025", status: "Issued" },
];

// Closure-stage contracts: all completed
const CLOSURE_CONTRACTS: Contract[] = [
  ...IMPL_CONTRACTS.map(c => ({ ...c, amountPaid: c.contractValue, status: "Completed" as const })),
  { contractId: "CTR-2025-011", vendor: "KPMG Ghana", service: "Final Project Audit", linkedBudgetLines: ["L025"], startDate: "Jun 1, 2026", endDate: "Aug 15, 2026", contractValue: 4500, amountPaid: 4500, status: "Completed" },
];

// Closure-stage POs: all paid
const CLOSURE_PURCHASE_ORDERS: PurchaseOrder[] = [
  ...IMPL_PURCHASE_ORDERS.map(po => ({ ...po, status: "Paid" as const })),
  { poNumber: "PO-10022", linkedBudgetLine: "L022", linkedBudgetLineName: "Validation Workshop", vendor: "Accra International Conference Centre", description: "Workshop venue + catering (50 pax)", qty: 1, unitPrice: 4000, total: 4000, dateIssued: "Mar 10, 2026", status: "Paid" },
  { poNumber: "PO-10023", linkedBudgetLine: "L023", linkedBudgetLineName: "Report Design & Layout", vendor: "GraphicDesign Pro", description: "Final report design and layout services", qty: 1, unitPrice: 3000, total: 3000, dateIssued: "Jun 5, 2026", status: "Paid" },
  { poNumber: "PO-10024", linkedBudgetLine: "L024", linkedBudgetLineName: "Printing & Distribution", vendor: "PrintWorks Ghana Ltd", description: "Final report printing (500 copies)", qty: 500, unitPrice: 4, total: 2000, dateIssued: "Jul 1, 2026", status: "Paid" },
  { poNumber: "PO-10025", linkedBudgetLine: "L025", linkedBudgetLineName: "Final Audit Fees", vendor: "KPMG Ghana", description: "Independent project audit", qty: 1, unitPrice: 4500, total: 4500, dateIssued: "Jun 1, 2026", status: "Paid" },
];

function getContracts(projectStage: string) {
  if (projectStage === "Closure") return CLOSURE_CONTRACTS;
  return (projectStage === "Delivery") ? IMPL_CONTRACTS : CONTRACTS;
}

function getPurchaseOrders(projectStage: string) {
  if (projectStage === "Closure") return CLOSURE_PURCHASE_ORDERS;
  return (projectStage === "Delivery") ? IMPL_PURCHASE_ORDERS : PURCHASE_ORDERS;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getVarianceColor(variance: number) {
  if (variance > 0) return "text-emerald-600";
  if (variance < 0) return "text-red-600";
  return "text-slate-600";
}

function getUsageBarColor(pct: number) {
  if (pct >= 100) return "bg-blue-500";
  if (pct >= 80) return "bg-amber-500";
  if (pct >= 50) return "bg-emerald-500";
  if (pct > 0) return "bg-emerald-400";
  return "bg-slate-300";
}

function getStatusBadge(status: string) {
  const map: Record<string, { bg: string; text: string }> = {
    "Not Started": { bg: "bg-slate-100", text: "text-slate-600" },
    "Requisition Raised": { bg: "bg-yellow-100", text: "text-yellow-700" },
    "RFQ Issued": { bg: "bg-orange-100", text: "text-orange-700" },
    "Evaluation": { bg: "bg-purple-100", text: "text-purple-700" },
    "PO Issued": { bg: "bg-blue-100", text: "text-blue-700" },
    "Delivered": { bg: "bg-teal-100", text: "text-teal-700" },
    "Completed": { bg: "bg-emerald-100", text: "text-emerald-700" },
    "Cancelled": { bg: "bg-red-100", text: "text-red-700" },
    // Contract statuses
    "Active": { bg: "bg-emerald-100", text: "text-emerald-700" },
    "Pending Signature": { bg: "bg-yellow-100", text: "text-yellow-700" },
    "Terminated": { bg: "bg-red-100", text: "text-red-700" },
    // PO statuses
    "Draft": { bg: "bg-slate-100", text: "text-slate-600" },
    "Issued": { bg: "bg-blue-100", text: "text-blue-700" },
    "Received": { bg: "bg-teal-100", text: "text-teal-700" },
    "Paid": { bg: "bg-emerald-100", text: "text-emerald-700" },
  };
  const style = map[status] || { bg: "bg-slate-100", text: "text-slate-600" };
  return (
    <Badge className={`${style.bg} ${style.text} hover:${style.bg} text-[11px] font-medium shadow-none border-0`}>
      {status}
    </Badge>
  );
}

function getMethodBadge(method: string) {
  const map: Record<string, { bg: string; text: string }> = {
    "Direct Purchase": { bg: "bg-slate-100", text: "text-slate-700" },
    "Competitive Bidding": { bg: "bg-blue-100", text: "text-blue-700" },
    "Request for Quotation": { bg: "bg-indigo-100", text: "text-indigo-700" },
    "Single Source": { bg: "bg-amber-100", text: "text-amber-700" },
    "Framework Agreement": { bg: "bg-purple-100", text: "text-purple-700" },
  };
  const style = map[method] || { bg: "bg-slate-100", text: "text-slate-600" };
  return (
    <Badge className={`${style.bg} ${style.text} hover:${style.bg} text-[11px] font-medium shadow-none border-0 whitespace-nowrap`}>
      {method}
    </Badge>
  );
}

function getCategoryBadge(category: string) {
  const map: Record<string, { bg: string; text: string }> = {
    "Goods/Equipment": { bg: "bg-cyan-100", text: "text-cyan-700" },
    "Services": { bg: "bg-violet-100", text: "text-violet-700" },
    "Works": { bg: "bg-orange-100", text: "text-orange-700" },
    "Consulting": { bg: "bg-rose-100", text: "text-rose-700" },
  };
  const style = map[category] || { bg: "bg-slate-100", text: "text-slate-600" };
  return (
    <Badge className={`${style.bg} ${style.text} hover:${style.bg} text-[11px] font-medium shadow-none border-0 whitespace-nowrap`}>
      {category}
    </Badge>
  );
}

// ─── Compute summary metrics ────────────────────────────────────────────────

function computeMetrics(procData: ProcurementPhase[], contracts: Contract[], purchaseOrders: PurchaseOrder[]) {
  let totalPlanned = 0;
  let totalActual = 0;
  let totalLineItems = 0;
  let completedCount = 0;
  let inProgressCount = 0;
  let notStartedCount = 0;
  let withPO = 0;
  let withContract = 0;

  for (const phase of procData) {
    for (const task of phase.tasks) {
      for (const li of task.lineItems) {
        totalPlanned += li.planned;
        totalActual += li.actual;
        totalLineItems++;
        if (li.procurementStatus === "Completed" || li.procurementStatus === "Delivered") completedCount++;
        else if (li.procurementStatus === "Not Started") notStartedCount++;
        else inProgressCount++;
        if (li.poNumber) withPO++;
        if (li.contractId) withContract++;
      }
    }
  }

  return {
    totalPlanned,
    totalActual,
    variance: totalPlanned - totalActual,
    utilizationPct: totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0,
    totalLineItems,
    completedCount,
    inProgressCount,
    notStartedCount,
    withPO,
    withContract,
    contractsValue: contracts.reduce((s, c) => s + c.contractValue, 0),
    contractsPaid: contracts.reduce((s, c) => s + c.amountPaid, 0),
    poTotal: purchaseOrders.reduce((s, po) => s + po.total, 0),
  };
}

// ─── Main Component ─────────────────────────────────────────────────────────

interface ProjectProcurementTabProps {
  projectStage: string;
}

export function ProjectProcurementTab({ projectStage }: ProjectProcurementTabProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(
    projectStage === "Closure" ? ["P1", "P2", "P3", "P4"] :
    projectStage === "Delivery" ? ["P2", "P3"] : ["P2"]
  ));
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set(
    projectStage === "Closure" ? ["T001", "T002", "T003", "T004", "T005", "T009", "T006", "T007", "T008"] :
    projectStage === "Delivery" ? ["T009", "T006"] : ["T009", "T005"]
  ));
  const [isContractsExpanded, setIsContractsExpanded] = useState(true);
  const [isPOExpanded, setIsPOExpanded] = useState(true);

  const procData = getProcurementData(projectStage);
  const contracts = getContracts(projectStage);
  const purchaseOrders = getPurchaseOrders(projectStage);
  const metrics = computeMetrics(procData, contracts, purchaseOrders);

  const togglePhase = (id: string) => {
    setExpandedPhases(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleTask = (id: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Stage banners */}
      {projectStage === "Procurement" && (
        <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-blue-800 font-medium">Tendering Mode — Expression of Interest & Evaluation active</span>
        </div>
      )}
      {projectStage === "Delivery" && (
        <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-emerald-800 font-medium">Execution Mode — Purchase Orders active</span>
        </div>
      )}
      {projectStage === "Closure" && (
        <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-sm text-emerald-800 font-medium">Project Closed — All procurement completed, contracts settled, and POs paid in full</span>
        </div>
      )}

      {/* ── KPI Summary Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <DollarSignIcon className="size-4 text-blue-600" />
            </div>
            <span className="text-[12px] text-slate-500">Total Planned</span>
          </div>
          <div className="text-lg font-semibold text-slate-900">{formatCurrency(metrics.totalPlanned)}</div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${getUsageBarColor(metrics.utilizationPct)}`} style={{ width: `${Math.min(metrics.utilizationPct, 100)}%` }} />
            </div>
            <span className="text-[11px] text-slate-500">{metrics.utilizationPct}% utilized</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="size-4 text-emerald-600" />
            </div>
            <span className="text-[12px] text-slate-500">Committed / Spent</span>
          </div>
          <div className="text-lg font-semibold text-slate-900">{formatCurrency(metrics.totalActual)}</div>
          <div className="mt-1 text-[11px] text-slate-500">
            Variance: <span className={getVarianceColor(metrics.variance)}>{formatCurrency(metrics.variance)}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <Package className="size-4 text-violet-600" />
            </div>
            <span className="text-[12px] text-slate-500">Line Items</span>
          </div>
          <div className="text-lg font-semibold text-slate-900">{metrics.totalLineItems}</div>
          <div className="mt-1 flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {metrics.completedCount} done
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {metrics.inProgressCount} active
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              {metrics.notStartedCount} pending
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <FileText className="size-4 text-amber-600" />
            </div>
            <span className="text-[12px] text-slate-500">Contracts & POs</span>
          </div>
          <div className="text-lg font-semibold text-slate-900">{CONTRACTS.length} / {PURCHASE_ORDERS.length}</div>
          <div className="mt-1 text-[11px] text-slate-500">
            PO Value: <span className="text-slate-900 font-medium">{formatCurrency(metrics.poTotal)}</span>
          </div>
        </div>
      </div>

      {/* ── Procurement Plan — Budget-Aligned Tree Table ─────────────── */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Procurement Plan — Budget Alignment</h2>
          <span className="text-[12px] text-slate-500">
            {metrics.totalLineItems} items across {PROCUREMENT_DATA.length} phases
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }}>
              <tr>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold w-[22%]">Item</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Category</th>
                <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Planned</th>
                <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Actual</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold w-[10%]">% Used</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Method</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Vendor</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Status</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold w-10"></th>
              </tr>
            </thead>
            <tbody>
              {procData.map(phase => {
                const phasePlanned = phase.tasks.reduce((s, t) => s + t.lineItems.reduce((s2, li) => s2 + li.planned, 0), 0);
                const phaseActual = phase.tasks.reduce((s, t) => s + t.lineItems.reduce((s2, li) => s2 + li.actual, 0), 0);
                const phasePct = phasePlanned > 0 ? Math.round((phaseActual / phasePlanned) * 100) : 0;
                const isExpanded = expandedPhases.has(phase.phaseId);
                const phaseCompleted = phase.tasks.every(t => t.lineItems.every(li => li.procurementStatus === "Completed" || li.procurementStatus === "Delivered"));
                const phaseNotStarted = phase.tasks.every(t => t.lineItems.every(li => li.procurementStatus === "Not Started"));

                return (
                  <PhaseSection
                    key={phase.phaseId}
                    phase={phase}
                    phasePlanned={phasePlanned}
                    phaseActual={phaseActual}
                    phasePct={phasePct}
                    isExpanded={isExpanded}
                    expandedTasks={expandedTasks}
                    phaseCompleted={phaseCompleted}
                    phaseNotStarted={phaseNotStarted}
                    onTogglePhase={() => togglePhase(phase.phaseId)}
                    onToggleTask={toggleTask}
                  />
                );
              })}

              {/* Grand Total */}
              <tr className="bg-slate-100 border-t-2 border-slate-300">
                <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">Grand Total</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">{formatCurrency(metrics.totalPlanned)}</td>
                <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">{formatCurrency(metrics.totalActual)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${getUsageBarColor(metrics.utilizationPct)}`} style={{ width: `${Math.min(metrics.utilizationPct, 100)}%` }} />
                    </div>
                    <span className="text-[12px] font-semibold text-slate-900 min-w-[35px]">{metrics.utilizationPct}%</span>
                  </div>
                </td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Active Contracts ────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsContractsExpanded(!isContractsExpanded)}
          className="w-full px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Active Contracts</h2>
            <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-[11px] font-medium shadow-none border-0">{CONTRACTS.length}</Badge>
          </div>
          {isContractsExpanded ? <ChevronUp size={20} className="text-slate-600" /> : <ChevronDown size={20} className="text-slate-600" />}
        </button>

        {isContractsExpanded && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Contract ID</th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Vendor</th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Service / Good</th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Budget Line</th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Period</th>
                  <th className="px-4 py-3 text-right text-[12px] font-semibold text-white">Value</th>
                  <th className="px-4 py-3 text-right text-[12px] font-semibold text-white">Paid</th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white w-[10%]">% Paid</th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Status</th>
                  <th className="px-4 py-3 text-center text-[12px] font-semibold text-white w-10"></th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((c, idx) => {
                  const paidPct = c.contractValue > 0 ? Math.round((c.amountPaid / c.contractValue) * 100) : 0;
                  return (
                    <tr key={c.contractId} className={`border-b border-slate-100 hover:bg-slate-50 ${idx % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                      <td className="px-4 py-3 text-[12px] font-medium text-slate-900">{c.contractId}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-700">{c.vendor}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-600">{c.service}</td>
                      <td className="px-4 py-3 text-[12px] text-[#0B01D0] font-medium">{c.linkedBudgetLines.join(", ")}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-600 whitespace-nowrap">{c.startDate} — {c.endDate}</td>
                      <td className="px-4 py-3 text-right text-[12px] text-slate-900 font-medium">{formatCurrency(c.contractValue)}</td>
                      <td className="px-4 py-3 text-right text-[12px] text-slate-700">{formatCurrency(c.amountPaid)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${getUsageBarColor(paidPct)}`} style={{ width: `${Math.min(paidPct, 100)}%` }} />
                          </div>
                          <span className="text-[11px] text-slate-500 min-w-[30px]">{paidPct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(c.status)}</td>
                      <td className="px-4 py-3 text-center">
                        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="size-4" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Purchase Orders ─────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsPOExpanded(!isPOExpanded)}
          className="w-full px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Purchase Orders</h2>
            <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-[11px] font-medium shadow-none border-0">{PURCHASE_ORDERS.length}</Badge>
          </div>
          {isPOExpanded ? <ChevronUp size={20} className="text-slate-600" /> : <ChevronDown size={20} className="text-slate-600" />}
        </button>

        {isPOExpanded && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">PO Number</th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Budget Line</th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Vendor</th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Description</th>
                  <th className="px-4 py-3 text-right text-[12px] font-semibold text-white">Qty</th>
                  <th className="px-4 py-3 text-right text-[12px] font-semibold text-white">Unit Price</th>
                  <th className="px-4 py-3 text-right text-[12px] font-semibold text-white">Total</th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Date Issued</th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Status</th>
                  <th className="px-4 py-3 text-center text-[12px] font-semibold text-white w-10"></th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((po, idx) => (
                  <tr key={po.poNumber} className={`border-b border-slate-100 hover:bg-slate-50 ${idx % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                    <td className="px-4 py-3 text-[12px] font-medium text-slate-900">{po.poNumber}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-[12px] text-[#0B01D0] font-medium">{po.linkedBudgetLine}</span>
                        <span className="text-[11px] text-slate-500 truncate max-w-[140px]">{po.linkedBudgetLineName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-700">{po.vendor}</td>
                    <td className="px-4 py-3 text-[12px] text-slate-600 max-w-[200px] truncate">{po.description}</td>
                    <td className="px-4 py-3 text-right text-[12px] text-slate-700">{po.qty}</td>
                    <td className="px-4 py-3 text-right text-[12px] text-slate-700">{formatCurrency(po.unitPrice)}</td>
                    <td className="px-4 py-3 text-right text-[12px] font-medium text-slate-900">{formatCurrency(po.total)}</td>
                    <td className="px-4 py-3 text-[12px] text-slate-600 whitespace-nowrap">{po.dateIssued}</td>
                    <td className="px-4 py-3">{getStatusBadge(po.status)}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="size-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dollar sign icon (inline to avoid import conflicts) ────────────────────
function DollarSignIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

// ─── Phase Section (collapsible) ─────────────────────────────────────────────

function PhaseSection({
  phase,
  phasePlanned,
  phaseActual,
  phasePct,
  isExpanded,
  expandedTasks,
  phaseCompleted,
  phaseNotStarted,
  onTogglePhase,
  onToggleTask,
}: {
  phase: ProcurementPhase;
  phasePlanned: number;
  phaseActual: number;
  phasePct: number;
  isExpanded: boolean;
  expandedTasks: Set<string>;
  phaseCompleted: boolean;
  phaseNotStarted: boolean;
  onTogglePhase: () => void;
  onToggleTask: (id: string) => void;
}) {
  return (
    <>
      {/* Phase Row */}
      <tr className="bg-slate-50 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" onClick={onTogglePhase}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {isExpanded ? <ChevronDown className="size-4 text-slate-500 shrink-0" /> : <ChevronRight className="size-4 text-slate-500 shrink-0" />}
            <span className="text-[12px] font-semibold text-slate-900">{phase.phaseName}</span>
          </div>
        </td>
        <td className="px-4 py-3"></td>
        <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">{formatCurrency(phasePlanned)}</td>
        <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">{formatCurrency(phaseActual)}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${getUsageBarColor(phasePct)}`} style={{ width: `${Math.min(phasePct, 100)}%` }} />
            </div>
            <span className="text-[12px] text-slate-600 min-w-[35px]">{phasePct}%</span>
          </div>
        </td>
        <td className="px-4 py-3"></td>
        <td className="px-4 py-3"></td>
        <td className="px-4 py-3">
          {phaseCompleted ? getStatusBadge("Completed") : phaseNotStarted ? getStatusBadge("Not Started") : (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[11px] font-medium shadow-none border-0">In Progress</Badge>
          )}
        </td>
        <td className="px-4 py-3 text-center">
          <button className="text-slate-400 hover:text-slate-600" onClick={e => e.stopPropagation()}>
            <MoreHorizontal className="size-4" />
          </button>
        </td>
      </tr>

      {/* Task Rows */}
      {isExpanded && phase.tasks.map(task => {
        const taskPlanned = task.lineItems.reduce((s, li) => s + li.planned, 0);
        const taskActual = task.lineItems.reduce((s, li) => s + li.actual, 0);
        const taskPct = taskPlanned > 0 ? Math.round((taskActual / taskPlanned) * 100) : 0;
        const isTaskExpanded = expandedTasks.has(task.taskId);
        const taskAllCompleted = task.lineItems.every(li => li.procurementStatus === "Completed" || li.procurementStatus === "Delivered");
        const taskAllNotStarted = task.lineItems.every(li => li.procurementStatus === "Not Started");

        return (
          <TaskSection
            key={task.taskId}
            task={task}
            taskPlanned={taskPlanned}
            taskActual={taskActual}
            taskPct={taskPct}
            isExpanded={isTaskExpanded}
            taskAllCompleted={taskAllCompleted}
            taskAllNotStarted={taskAllNotStarted}
            onToggle={() => onToggleTask(task.taskId)}
          />
        );
      })}
    </>
  );
}

// ─── Task Section (collapsible with line items) ──────────────────────────────

function TaskSection({
  task,
  taskPlanned,
  taskActual,
  taskPct,
  isExpanded,
  taskAllCompleted,
  taskAllNotStarted,
  onToggle,
}: {
  task: ProcurementTask;
  taskPlanned: number;
  taskActual: number;
  taskPct: number;
  isExpanded: boolean;
  taskAllCompleted: boolean;
  taskAllNotStarted: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      {/* Task Row */}
      <tr className="border-b border-slate-100 cursor-pointer hover:bg-blue-50/30 transition-colors" onClick={onToggle}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2 pl-6">
            {isExpanded ? <ChevronDown className="size-3.5 text-slate-400 shrink-0" /> : <ChevronRight className="size-3.5 text-slate-400 shrink-0" />}
            <span className="text-[12px] font-medium text-slate-800">{task.taskId} — {task.taskName}</span>
          </div>
        </td>
        <td className="px-4 py-3"></td>
        <td className="px-4 py-3 text-right text-[12px] font-medium text-slate-700">{formatCurrency(taskPlanned)}</td>
        <td className="px-4 py-3 text-right text-[12px] font-medium text-slate-700">{formatCurrency(taskActual)}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${getUsageBarColor(taskPct)}`} style={{ width: `${Math.min(taskPct, 100)}%` }} />
            </div>
            <span className="text-[12px] text-slate-500 min-w-[35px]">{taskPct}%</span>
          </div>
        </td>
        <td className="px-4 py-3"></td>
        <td className="px-4 py-3"></td>
        <td className="px-4 py-3">
          {taskAllCompleted ? getStatusBadge("Completed") : taskAllNotStarted ? getStatusBadge("Not Started") : (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[11px] font-medium shadow-none border-0">In Progress</Badge>
          )}
        </td>
        <td className="px-4 py-3 text-center">
          <button className="text-slate-400 hover:text-slate-600" onClick={e => e.stopPropagation()}>
            <MoreHorizontal className="size-4" />
          </button>
        </td>
      </tr>

      {/* Line Item Rows */}
      {isExpanded && task.lineItems.map(li => {
        const liPct = li.planned > 0 ? Math.round((li.actual / li.planned) * 100) : 0;
        return (
          <tr key={li.budgetLineId} className="border-b border-slate-50 bg-white hover:bg-slate-50/50">
            <td className="px-4 py-2.5">
              <div className="pl-14 flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-mono">{li.budgetLineId}</span>
                <span className="text-[12px] text-slate-700">{li.name}</span>
              </div>
            </td>
            <td className="px-4 py-2.5">{getCategoryBadge(li.category)}</td>
            <td className="px-4 py-2.5 text-right text-[12px] text-slate-500">{formatCurrency(li.planned)}</td>
            <td className="px-4 py-2.5 text-right text-[12px] text-slate-500">{formatCurrency(li.actual)}</td>
            <td className="px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${getUsageBarColor(liPct)}`} style={{ width: `${Math.min(liPct, 100)}%` }} />
                </div>
                <span className="text-[11px] text-slate-400 min-w-[35px]">{liPct}%</span>
              </div>
            </td>
            <td className="px-4 py-2.5">{getMethodBadge(li.procurementMethod)}</td>
            <td className="px-4 py-2.5">
              <span className="text-[12px] text-slate-600">{li.vendor || "—"}</span>
            </td>
            <td className="px-4 py-2.5">{getStatusBadge(li.procurementStatus)}</td>
            <td className="px-4 py-2.5 text-center">
              {li.poNumber && (
                <span className="text-[10px] text-[#0B01D0] font-medium">{li.poNumber}</span>
              )}
            </td>
          </tr>
        );
      })}
    </>
  );
}
