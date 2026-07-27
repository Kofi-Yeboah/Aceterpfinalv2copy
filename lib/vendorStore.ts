// ──────────────────────────────────────────────────────────────────────────────
// Vendor & Consultant master data.
//
// This is the single source of truth the requirements assume when they say
// "Sourcing Module: Select vendors directly from approved list", "Block vendor
// from future solicitations", and "The rating of the consultant or the vendor on
// past performance must be visible in both places". Previously the vendor list
// lived inside Suppliers.tsx while Sourcing carried its own hardcoded copy, so
// none of that could hold.
//
// Everything that decides whether a vendor may be engaged — suspension,
// blacklisting, document expiry, sanctions screening, performance history —
// resolves through `checkSourcingEligibility` here.
// ──────────────────────────────────────────────────────────────────────────────

import { notify, scheduleReminder, resolveReminder } from "./notificationStore";

export type VendorType = "Firm" | "Individual";
export type VendorStatus =
  | "Active"
  | "Pending Onboarding"
  | "Flagged"
  | "Blacklisted"
  | "Suspended"
  | "Pending Reactivation";
export type RiskLevel = "Low" | "Medium" | "High";

export interface PerformanceScore {
  quality: number;
  timeliness: number;
  responsiveness: number;
  costManagement: number;
  compliance: number;
}

export interface HistoricalRate {
  assignment: string;
  rate: number;
  rateType: "Daily" | "Monthly";
  period: string;
}

/** One completed evaluation, as captured at contract mid-term or close-out. */
export interface VendorEvaluation {
  id: string;
  contractNumber: string;
  contractTitle: string;
  evaluationType: "Mid-Term" | "Final";
  evaluationDate: string;
  evaluator: string;
  supervisorApproval?: string;
  criteria: { name: string; score: number; maxScore: number }[];
  overallScore: number;
  comments: string;
}

/** Award history so a vendor profile can show contracts and totals to date. */
export interface VendorContractRecord {
  contractNumber: string;
  title: string;
  value: number;
  awardDate: string;
  status: string;
  fundingSource?: string;
}

export interface VendorStatusChange {
  id: string;
  date: string;
  from: VendorStatus;
  to: VendorStatus;
  reason: string;
  performedBy: string;
  approvedBy?: string;
}

interface VendorBase {
  id: string;
  vendorId: string;
  category: string;
  subCategory: string;
  riskLevel: RiskLevel;
  status: VendorStatus;
  performance: PerformanceScore;
  totalOrders: number;
  totalSpend: number;
  documents: string[];
  documentExpiry: Record<string, string>;
  dateOnboarded: string;
  /** Set when a self-registration is awaiting Procurement review. */
  pendingReview?: boolean;
  bankValidated?: boolean;
  bankValidatedBy?: string;
  sanctionsChecked?: boolean;
  evaluations?: VendorEvaluation[];
  contractHistory?: VendorContractRecord[];
  statusHistory?: VendorStatusChange[];
  /** Source of the record, for the "registered via portal" audit question. */
  registrationSource?: "Internal" | "Self-Registration";
}

export interface FirmVendor extends VendorBase {
  type: "Firm";
  legalBusinessName: string;
  registrationNumber: string;
  taxId: string;
  registeredAddress: string;
  contactPerson: string;
  email: string;
  phone: string;
  bankName: string;
  bankAccountNumber: string;
  ownershipDetails?: string;
  specialization?: string[];
}

export interface IndividualVendor extends VendorBase {
  type: "Individual";
  legalName: string;
  contactEmail: string;
  contactPhone: string;
  idType: "Passport" | "National ID" | "Driver's License";
  idNumber: string;
  residentialAddress: string;
  bankName: string;
  bankAccountNumber: string;
  expertAreas: string[];
  historicalRates: HistoricalRate[];
}

export type Vendor = FirmVendor | IndividualVendor;

// ── Shared reference data ───────────────────────────────────────────────────

export const VENDOR_CATEGORIES = ["Goods", "Works", "Consulting", "Non-Consulting Services"];
export const SUB_CATEGORIES: Record<string, string[]> = {
  Goods: ["IT Equipment", "Office Supplies", "Medical Supplies", "Vehicles", "Furniture"],
  Works: ["Construction", "Renovation", "Installation", "Maintenance"],
  Consulting: ["Management Consulting", "IT Consulting", "Financial Advisory", "Legal Services", "Research"],
  "Non-Consulting Services": ["Logistics", "Catering", "Security", "Cleaning", "Printing"],
};
export const VENDOR_STATUSES: VendorStatus[] = [
  "Active", "Pending Onboarding", "Flagged", "Blacklisted", "Suspended", "Pending Reactivation",
];
export const RISK_LEVELS: RiskLevel[] = ["Low", "Medium", "High"];

export const EXPERT_AREAS_OPTIONS = [
  "Policy Analysis", "Data Science", "M&E", "Gender Studies", "Agricultural Economics",
  "Public Health", "Climate Change", "Education", "Governance", "Statistics",
  "Project Management", "Financial Analysis", "Legal Advisory", "IT Systems", "Human Resources",
];

export const FIRM_DOC_CHECKLIST = [
  "Certificate of Incorporation",
  "Tax Clearance Certificate",
  "SSNIT Clearance",
  "VAT Registration",
  "Performance References",
  "Policy Compliance Form",
];
export const INDIVIDUAL_DOC_CHECKLIST = [
  "CV / Resume",
  "Passport / National ID Copy",
  "Proof of Residential Address",
  "Bank Account Confirmation",
];

/** Documents whose lapse blocks engagement, per the compliance requirement. */
export const EXPIRY_CRITICAL_DOCS = [
  "Tax Clearance Certificate",
  "SSNIT Clearance",
  "Certificate of Incorporation",
  "VAT Registration",
  "Passport / National ID Copy",
];

/**
 * Donor/statutory debarment names screened at registration. In production this
 * would be the World Bank / UN / donor debarment feed; the shape is what
 * matters here.
 */
const SANCTIONS_LIST = [
  "Global Trade Partners Ltd",
  "Sahel Logistics SARL",
  "Efua Mensah-Bonsu",
  "Northern Supplies Co",
];

// ── State ───────────────────────────────────────────────────────────────────

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

let nextFirmSeq = 1009;
let nextIndividualSeq = 2007;

let vendors: Vendor[] = [
  {
    id: "f1", vendorId: "VND-1001", type: "Firm", legalBusinessName: "Tech Solutions Inc.",
    registrationNumber: "CS-2018-45678", taxId: "TIN-GH-2345678", registeredAddress: "14 Independence Ave, Accra",
    contactPerson: "John Smith", email: "john@techsolutions.com", phone: "+233 20 123 4567",
    bankName: "GCB Bank", bankAccountNumber: "****4521", category: "Goods", subCategory: "IT Equipment",
    riskLevel: "Low", status: "Active",
    performance: { quality: 9.2, timeliness: 8.8, responsiveness: 9.0, costManagement: 8.5, compliance: 9.4 },
    totalOrders: 45, totalSpend: 285000,
    documents: ["Certificate of Incorporation", "Tax Clearance Certificate", "SSNIT Clearance", "VAT Registration", "Performance References"],
    documentExpiry: { "Tax Clearance Certificate": "2026-06-01", "SSNIT Clearance": "2026-08-15", "VAT Registration": "2027-01-10" },
    dateOnboarded: "2022-03-15", specialization: ["IT Equipment", "Networking"],
    bankValidated: true, bankValidatedBy: "Abena Osei", sanctionsChecked: true, registrationSource: "Internal",
    contractHistory: [
      { contractNumber: "CNT-2025-003", title: "IT Infrastructure Upgrade — Phase 1", value: 125000, awardDate: "2025-01-10", status: "Active", fundingSource: "Capital Expenditure Fund" },
    ],
  },
  {
    id: "f2", vendorId: "VND-1002", type: "Firm", legalBusinessName: "Office Depot Ltd.",
    registrationNumber: "CS-2016-34521", taxId: "TIN-GH-1234567", registeredAddress: "23 Oxford Street, Osu, Accra",
    contactPerson: "Sarah Johnson", email: "sarah@officedepot.com", phone: "+233 24 234 5678",
    bankName: "Ecobank Ghana", bankAccountNumber: "****7892", category: "Goods", subCategory: "Office Supplies",
    riskLevel: "Low", status: "Active",
    performance: { quality: 8.5, timeliness: 9.0, responsiveness: 8.8, costManagement: 9.2, compliance: 8.7 },
    totalOrders: 78, totalSpend: 145000,
    documents: ["Certificate of Incorporation", "Tax Clearance Certificate", "SSNIT Clearance", "VAT Registration", "Performance References"],
    documentExpiry: { "Tax Clearance Certificate": "2026-07-20", "SSNIT Clearance": "2026-09-30", "VAT Registration": "2027-03-15" },
    dateOnboarded: "2021-08-10", specialization: ["Office Supplies", "Stationery"],
    bankValidated: true, bankValidatedBy: "Abena Osei", sanctionsChecked: true, registrationSource: "Internal",
  },
  {
    id: "f3", vendorId: "VND-1003", type: "Firm", legalBusinessName: "PrintWorks Ghana Ltd",
    registrationNumber: "CS-2019-56789", taxId: "TIN-GH-3456789", registeredAddress: "5 Ring Road East, Accra",
    contactPerson: "Michael Brown", email: "michael@printworks.com.gh", phone: "+233 27 345 6789",
    bankName: "Stanbic Bank", bankAccountNumber: "****3341", category: "Goods", subCategory: "Office Supplies",
    riskLevel: "Low", status: "Active",
    performance: { quality: 8.0, timeliness: 7.5, responsiveness: 8.2, costManagement: 8.8, compliance: 8.0 },
    totalOrders: 32, totalSpend: 52000,
    documents: ["Certificate of Incorporation", "Tax Clearance Certificate", "SSNIT Clearance", "VAT Registration"],
    documentExpiry: { "Tax Clearance Certificate": "2026-05-20", "SSNIT Clearance": "2026-04-30" },
    dateOnboarded: "2023-01-20", specialization: ["Printing", "Publishing"],
    bankValidated: true, bankValidatedBy: "Abena Osei", sanctionsChecked: true, registrationSource: "Internal",
    contractHistory: [
      { contractNumber: "CNT-2024-002", title: "Printing & Materials", value: 1050, awardDate: "2024-12-20", status: "Closed", fundingSource: "Core Program Funding" },
    ],
    evaluations: [
      {
        id: "ve-seed-1", contractNumber: "CNT-2024-002", contractTitle: "Printing & Materials",
        evaluationType: "Final", evaluationDate: "2025-03-10", evaluator: "Ama Darko", supervisorApproval: "James Owusu",
        criteria: [
          { name: "Quality of deliverables", score: 9, maxScore: 10 },
          { name: "Timeliness", score: 10, maxScore: 10 },
          { name: "Cost control", score: 10, maxScore: 10 },
          { name: "Compliance with terms", score: 9, maxScore: 10 },
          { name: "Professionalism and responsiveness", score: 8, maxScore: 10 },
        ],
        overallScore: 9.2, comments: "Excellent delivery, ahead of schedule.",
      },
    ],
  },
  {
    id: "f4", vendorId: "VND-1004", type: "Firm", legalBusinessName: "La Palm Royal Beach Hotel",
    registrationNumber: "CS-2005-12345", taxId: "TIN-GH-9876543", registeredAddress: "La Beach Road, Trade Fair, Accra",
    contactPerson: "Emily Davis", email: "events@lapalmhotel.com", phone: "+233 30 271 2500",
    bankName: "Standard Chartered", bankAccountNumber: "****6654", category: "Non-Consulting Services", subCategory: "Catering",
    riskLevel: "Medium", status: "Active",
    performance: { quality: 9.0, timeliness: 8.5, responsiveness: 9.2, costManagement: 7.8, compliance: 9.0 },
    totalOrders: 15, totalSpend: 98000,
    documents: ["Certificate of Incorporation", "Tax Clearance Certificate", "VAT Registration", "Performance References"],
    documentExpiry: { "Tax Clearance Certificate": "2026-12-01", "VAT Registration": "2027-06-01" },
    dateOnboarded: "2022-06-01", specialization: ["Conference Facilities", "Catering"],
    bankValidated: true, sanctionsChecked: true, registrationSource: "Internal",
  },
  {
    id: "f5", vendorId: "VND-1005", type: "Firm", legalBusinessName: "MedSupply GH",
    registrationNumber: "CS-2020-78901", taxId: "TIN-GH-6543210", registeredAddress: "12 Liberation Road, Accra",
    contactPerson: "Grace Owusu", email: "grace@medsupplygh.com", phone: "+233 26 456 7890",
    bankName: "Absa Bank", bankAccountNumber: "****8812", category: "Goods", subCategory: "Medical Supplies",
    riskLevel: "Medium", status: "Active",
    performance: { quality: 8.8, timeliness: 8.2, responsiveness: 7.9, costManagement: 8.0, compliance: 9.1 },
    totalOrders: 22, totalSpend: 168000,
    documents: ["Certificate of Incorporation", "Tax Clearance Certificate", "SSNIT Clearance", "VAT Registration", "Performance References"],
    documentExpiry: { "Tax Clearance Certificate": "2026-10-15", "SSNIT Clearance": "2026-11-20", "VAT Registration": "2027-02-28" },
    dateOnboarded: "2023-04-12", specialization: ["Medical Supplies", "Laboratory Equipment"],
    bankValidated: true, sanctionsChecked: true, registrationSource: "Internal",
  },
  {
    id: "f6", vendorId: "VND-1006", type: "Firm", legalBusinessName: "CreativeEdge Designs",
    registrationNumber: "CS-2021-23456", taxId: "TIN-GH-4567890", registeredAddress: "8 Cantonments Rd, Accra",
    contactPerson: "Tom Anderson", email: "tom@creativeedge.com.gh", phone: "+233 55 567 8901",
    bankName: "Fidelity Bank", bankAccountNumber: "****2209", category: "Consulting", subCategory: "Management Consulting",
    riskLevel: "Low", status: "Pending Onboarding",
    performance: { quality: 0, timeliness: 0, responsiveness: 0, costManagement: 0, compliance: 0 },
    totalOrders: 0, totalSpend: 0,
    documents: ["Certificate of Incorporation", "Tax Clearance Certificate"],
    documentExpiry: { "Tax Clearance Certificate": "2027-03-10" },
    dateOnboarded: "2026-03-10", specialization: ["Branding", "Communications"],
    sanctionsChecked: true, registrationSource: "Internal",
  },
  {
    id: "f7", vendorId: "VND-1007", type: "Firm", legalBusinessName: "Kwame Construction Ltd",
    registrationNumber: "CS-2015-89012", taxId: "TIN-GH-7890123", registeredAddress: "Industrial Area, Tema",
    contactPerson: "Kwame Asante", email: "kwame@kwameconstruction.com", phone: "+233 20 678 9012",
    bankName: "GCB Bank", bankAccountNumber: "****5567", category: "Works", subCategory: "Construction",
    riskLevel: "High", status: "Flagged",
    performance: { quality: 5.2, timeliness: 4.0, responsiveness: 6.0, costManagement: 4.5, compliance: 3.8 },
    totalOrders: 8, totalSpend: 420000,
    documents: ["Certificate of Incorporation", "Tax Clearance Certificate", "SSNIT Clearance", "VAT Registration"],
    documentExpiry: { "Tax Clearance Certificate": "2025-12-01", "SSNIT Clearance": "2026-01-15", "VAT Registration": "2025-11-30" },
    dateOnboarded: "2020-11-05", specialization: ["Civil Works"],
    sanctionsChecked: true, registrationSource: "Internal",
    statusHistory: [
      { id: "vsh-1", date: "2025-09-12", from: "Active", to: "Flagged", reason: "Repeated milestone slippage on CNT-2024-014 and unresolved quality defects.", performedBy: "Felix Addo" },
    ],
  },
  {
    id: "f8", vendorId: "VND-1008", type: "Firm", legalBusinessName: "ABC Logistics Group",
    registrationNumber: "CS-2017-34567", taxId: "TIN-GH-8901234", registeredAddress: "3 North Industrial Area, Accra",
    contactPerson: "Rachel Green", email: "rachel@abclogistics.com.gh", phone: "+233 24 789 0123",
    bankName: "Zenith Bank", bankAccountNumber: "****1198", category: "Non-Consulting Services", subCategory: "Logistics",
    riskLevel: "Medium", status: "Suspended",
    performance: { quality: 6.5, timeliness: 5.5, responsiveness: 7.0, costManagement: 6.0, compliance: 5.0 },
    totalOrders: 12, totalSpend: 156000,
    documents: ["Certificate of Incorporation", "Tax Clearance Certificate", "SSNIT Clearance"],
    documentExpiry: { "Tax Clearance Certificate": "2026-05-30", "SSNIT Clearance": "2026-06-10" },
    dateOnboarded: "2021-02-18", specialization: ["Freight", "Warehousing"],
    sanctionsChecked: true, registrationSource: "Internal",
    statusHistory: [
      { id: "vsh-2", date: "2025-11-02", from: "Flagged", to: "Suspended", reason: "Policy violation — undisclosed subcontracting on two consignments.", performedBy: "Felix Addo", approvedBy: "Nana Adjei" },
    ],
  },
  {
    id: "i1", vendorId: "VND-2001", type: "Individual", legalName: "Dr. Kwesi Appiah",
    contactEmail: "kwesi.appiah@consultant.com", contactPhone: "+233 20 111 2222",
    idType: "Passport", idNumber: "G****4521", residentialAddress: "15 East Legon, Accra",
    bankName: "GCB Bank", bankAccountNumber: "****9901", category: "Consulting", subCategory: "Research",
    riskLevel: "Low", status: "Active",
    performance: { quality: 9.5, timeliness: 9.0, responsiveness: 9.2, costManagement: 8.8, compliance: 9.6 },
    totalOrders: 12, totalSpend: 86000,
    documents: ["CV / Resume", "Passport / National ID Copy", "Proof of Residential Address", "Bank Account Confirmation"],
    documentExpiry: { "Passport / National ID Copy": "2028-03-15" },
    dateOnboarded: "2023-06-20",
    expertAreas: ["Policy Analysis", "Data Science", "Agricultural Economics"],
    historicalRates: [
      { assignment: "Agricultural Policy Review", rate: 800, rateType: "Daily", period: "Jan 2025 - Mar 2025" },
      { assignment: "Food Security Assessment", rate: 12000, rateType: "Monthly", period: "Jun 2024 - Dec 2024" },
      { assignment: "Climate Impact Study", rate: 750, rateType: "Daily", period: "Feb 2024 - Apr 2024" },
    ],
    bankValidated: true, bankValidatedBy: "Abena Osei", sanctionsChecked: true, registrationSource: "Internal",
    contractHistory: [
      { contractNumber: "CNT-2024-001", title: "Consultant Fees — Survey Design", value: 8000, awardDate: "2024-12-18", status: "Active", fundingSource: "Core Program Funding" },
    ],
  },
  {
    id: "i2", vendorId: "VND-2002", type: "Individual", legalName: "Prof. Ama Benyiwa",
    contactEmail: "ama.benyiwa@university.edu.gh", contactPhone: "+233 24 222 3333",
    idType: "National ID", idNumber: "GHA****6789", residentialAddress: "22 Labone, Accra",
    bankName: "Ecobank Ghana", bankAccountNumber: "****5543", category: "Consulting", subCategory: "Financial Advisory",
    riskLevel: "Low", status: "Active",
    performance: { quality: 9.8, timeliness: 9.5, responsiveness: 9.0, costManagement: 9.0, compliance: 9.8 },
    totalOrders: 8, totalSpend: 52000,
    documents: ["CV / Resume", "Passport / National ID Copy", "Proof of Residential Address", "Bank Account Confirmation"],
    documentExpiry: { "Passport / National ID Copy": "2027-09-01" },
    dateOnboarded: "2023-09-14",
    expertAreas: ["Financial Analysis", "Gender Studies", "M&E"],
    historicalRates: [
      { assignment: "Gender Mainstreaming Workshop", rate: 900, rateType: "Daily", period: "Sep 2025 - Oct 2025" },
      { assignment: "Financial Inclusion Study", rate: 14000, rateType: "Monthly", period: "Mar 2025 - Aug 2025" },
    ],
    bankValidated: true, sanctionsChecked: true, registrationSource: "Internal",
  },
  {
    id: "i3", vendorId: "VND-2003", type: "Individual", legalName: "Nana Yaw Mensah",
    contactEmail: "nana.yaw@facilitator.com", contactPhone: "+233 55 333 4444",
    idType: "National ID", idNumber: "GHA****3456", residentialAddress: "7 Airport Residential, Accra",
    bankName: "Stanbic Bank", bankAccountNumber: "****7782", category: "Consulting", subCategory: "Management Consulting",
    riskLevel: "Low", status: "Active",
    performance: { quality: 8.5, timeliness: 8.0, responsiveness: 8.8, costManagement: 8.2, compliance: 8.5 },
    totalOrders: 6, totalSpend: 34000,
    documents: ["CV / Resume", "Passport / National ID Copy", "Proof of Residential Address", "Bank Account Confirmation"],
    documentExpiry: { "Passport / National ID Copy": "2029-05-20" },
    dateOnboarded: "2024-01-08",
    expertAreas: ["Project Management", "Governance", "Public Health"],
    historicalRates: [
      { assignment: "Health Sector Governance Review", rate: 650, rateType: "Daily", period: "Apr 2025 - Jun 2025" },
      { assignment: "Public Sector Reform Facilitation", rate: 10000, rateType: "Monthly", period: "Jan 2025 - Mar 2025" },
    ],
    bankValidated: true, sanctionsChecked: true, registrationSource: "Internal",
  },
  {
    id: "i4", vendorId: "VND-2004", type: "Individual", legalName: "Akosua Frimpong",
    contactEmail: "akosua.f@legalconsult.com", contactPhone: "+233 26 444 5555",
    idType: "Passport", idNumber: "G****7890", residentialAddress: "31 Dzorwulu, Accra",
    bankName: "Fidelity Bank", bankAccountNumber: "****3301", category: "Consulting", subCategory: "Legal Services",
    riskLevel: "Low", status: "Active",
    performance: { quality: 9.0, timeliness: 8.5, responsiveness: 9.5, costManagement: 8.0, compliance: 9.2 },
    totalOrders: 4, totalSpend: 28000,
    documents: ["CV / Resume", "Passport / National ID Copy", "Proof of Residential Address", "Bank Account Confirmation"],
    documentExpiry: { "Passport / National ID Copy": "2028-11-10" },
    dateOnboarded: "2024-05-22",
    expertAreas: ["Legal Advisory", "Governance", "Human Resources"],
    historicalRates: [
      { assignment: "Employment Law Advisory", rate: 1000, rateType: "Daily", period: "Jul 2025 - Sep 2025" },
    ],
    bankValidated: true, sanctionsChecked: true, registrationSource: "Internal",
  },
  {
    id: "i5", vendorId: "VND-2005", type: "Individual", legalName: "Kofi Adu-Gyamfi",
    contactEmail: "kofi.adu@techconsulting.com", contactPhone: "+233 27 555 6666",
    idType: "National ID", idNumber: "GHA****1234", residentialAddress: "9 Roman Ridge, Accra",
    bankName: "Absa Bank", bankAccountNumber: "****6645", category: "Consulting", subCategory: "IT Consulting",
    riskLevel: "Medium", status: "Pending Onboarding",
    performance: { quality: 0, timeliness: 0, responsiveness: 0, costManagement: 0, compliance: 0 },
    totalOrders: 0, totalSpend: 0,
    documents: ["CV / Resume", "Passport / National ID Copy"],
    documentExpiry: { "Passport / National ID Copy": "2029-01-05" },
    dateOnboarded: "2026-03-12",
    expertAreas: ["IT Systems", "Data Science"],
    historicalRates: [],
    sanctionsChecked: true, registrationSource: "Internal",
  },
  {
    id: "i6", vendorId: "VND-2006", type: "Individual", legalName: "Efua Mensah-Bonsu",
    contactEmail: "efua.mb@researcher.org", contactPhone: "+233 50 666 7777",
    idType: "Passport", idNumber: "G****5678", residentialAddress: "4 Spintex Road, Accra",
    bankName: "Standard Chartered", bankAccountNumber: "****2234", category: "Consulting", subCategory: "Research",
    riskLevel: "High", status: "Blacklisted",
    performance: { quality: 3.0, timeliness: 2.5, responsiveness: 4.0, costManagement: 3.5, compliance: 2.0 },
    totalOrders: 3, totalSpend: 18000,
    documents: ["CV / Resume", "Passport / National ID Copy"],
    documentExpiry: { "Passport / National ID Copy": "2026-02-15" },
    dateOnboarded: "2024-08-01",
    expertAreas: ["Statistics", "M&E"],
    historicalRates: [
      { assignment: "M&E Framework Design", rate: 500, rateType: "Daily", period: "Aug 2024 - Oct 2024" },
    ],
    sanctionsChecked: true, registrationSource: "Internal",
    statusHistory: [
      { id: "vsh-3", date: "2025-06-18", from: "Flagged", to: "Blacklisted", reason: "Falsified data in submitted M&E report — referred to donor.", performedBy: "Felix Addo", approvedBy: "Nana Adjei" },
    ],
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

export function vendorDisplayName(v: Vendor): string {
  return v.type === "Firm" ? v.legalBusinessName : v.legalName;
}

export function vendorEmail(v: Vendor): string {
  return v.type === "Firm" ? v.email : v.contactEmail;
}

export function vendorAddress(v: Vendor): string {
  return v.type === "Firm" ? v.registeredAddress : v.residentialAddress;
}

export function avgScore(p: PerformanceScore): number {
  const vals = [p.quality, p.timeliness, p.responsiveness, p.costManagement, p.compliance];
  const nonZero = vals.filter((v) => v > 0);
  if (nonZero.length === 0) return 0;
  return +(nonZero.reduce((a, b) => a + b, 0) / nonZero.length).toFixed(1);
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function daysUntil(dateStr: string): number {
  const ms = new Date(dateStr).getTime() - new Date(todayStr()).getTime();
  return Math.round(ms / 86_400_000);
}

export function getExpiredDocs(v: Vendor): string[] {
  return Object.entries(v.documentExpiry)
    .filter(([, exp]) => exp < todayStr())
    .map(([doc]) => doc);
}

export function getExpiringDocs(v: Vendor, withinDays = 30): { doc: string; expiry: string; daysLeft: number }[] {
  return Object.entries(v.documentExpiry)
    .map(([doc, expiry]) => ({ doc, expiry, daysLeft: daysUntil(expiry) }))
    .filter((d) => d.daysLeft >= 0 && d.daysLeft <= withinDays);
}

export function getMissingDocs(v: Vendor): string[] {
  const required = v.type === "Firm" ? FIRM_DOC_CHECKLIST : INDIVIDUAL_DOC_CHECKLIST;
  return required.filter((d) => !v.documents.includes(d));
}

export function isSanctioned(name: string): boolean {
  const n = name.trim().toLowerCase();
  return SANCTIONS_LIST.some((s) => s.toLowerCase() === n);
}

/** Existing records whose name is the same or a near-match, for the duplicate flag. */
export function findPotentialDuplicates(name: string, excludeId?: string): Vendor[] {
  const normalise = (s: string) =>
    s.toLowerCase().replace(/\b(ltd|limited|inc|llc|plc|co|company|group|gh|ghana)\b/g, "").replace(/[^a-z0-9]/g, "");
  const target = normalise(name);
  if (!target) return [];
  return vendors.filter((v) => {
    if (v.id === excludeId) return false;
    const other = normalise(vendorDisplayName(v));
    return other === target || other.includes(target) || target.includes(other);
  });
}

/** Auto risk score, recomputed whenever performance, docs or status change. */
export function computeRiskLevel(v: Vendor): RiskLevel {
  let score = 0;
  const avg = avgScore(v.performance);
  if (avg > 0 && avg < 5) score += 3;
  else if (avg > 0 && avg < 7) score += 1;

  if (getExpiredDocs(v).length > 0) score += 2;
  if (getMissingDocs(v).length > 0) score += 1;

  if (v.status === "Flagged") score += 2;
  if (v.status === "Suspended") score += 3;
  if (v.status === "Blacklisted") score += 4;

  if (isSanctioned(vendorDisplayName(v))) score += 4;

  return score >= 4 ? "High" : score >= 2 ? "Medium" : "Low";
}

/** All the automatic warnings the requirements ask to be raised on a vendor. */
export interface VendorFlags {
  expiredDocs: string[];
  expiringDocs: { doc: string; expiry: string; daysLeft: number }[];
  missingDocs: string[];
  sanctioned: boolean;
  duplicates: Vendor[];
  poorPerformance: boolean;
  bankUnvalidated: boolean;
}

export function getVendorFlags(v: Vendor): VendorFlags {
  const avg = avgScore(v.performance);
  return {
    expiredDocs: getExpiredDocs(v),
    expiringDocs: getExpiringDocs(v),
    missingDocs: getMissingDocs(v),
    sanctioned: isSanctioned(vendorDisplayName(v)),
    duplicates: findPotentialDuplicates(vendorDisplayName(v), v.id),
    poorPerformance: avg > 0 && avg < 5,
    bankUnvalidated: !v.bankValidated,
  };
}

export function hasVendorWarning(v: Vendor): boolean {
  const f = getVendorFlags(v);
  return (
    f.expiredDocs.length > 0 ||
    f.expiringDocs.length > 0 ||
    f.missingDocs.length > 0 ||
    f.sanctioned ||
    f.poorPerformance
  );
}

// ── Reads ───────────────────────────────────────────────────────────────────

export function getVendors(): Vendor[] {
  return vendors;
}

export function getVendorById(id: string): Vendor | undefined {
  return vendors.find((v) => v.id === id || v.vendorId === id);
}

export function findVendorByName(name: string): Vendor | undefined {
  const n = name.trim().toLowerCase();
  return vendors.find((v) => vendorDisplayName(v).trim().toLowerCase() === n);
}

export interface EligibilityResult {
  eligible: boolean;
  /** True when engagement is possible but needs Senior Management sign-off. */
  requiresManagementApproval: boolean;
  blockingReasons: string[];
  warnings: string[];
}

/**
 * The gate Sourcing consults before a vendor can be invited or awarded.
 * Blacklisted, suspended and sanctioned vendors are blocked outright; poor
 * performers and vendors with lapsed compliance documents may proceed only with
 * management approval.
 */
export function checkSourcingEligibility(vendorRef: string): EligibilityResult {
  const v = getVendorById(vendorRef) ?? findVendorByName(vendorRef);
  if (!v) {
    return {
      eligible: false,
      requiresManagementApproval: false,
      blockingReasons: [`"${vendorRef}" is not in the vendor database. Register the vendor before inviting them.`],
      warnings: [],
    };
  }

  const flags = getVendorFlags(v);
  const blocking: string[] = [];
  const warnings: string[] = [];
  let requiresApproval = false;

  if (v.status === "Blacklisted") blocking.push("Vendor is blacklisted and cannot be engaged.");
  if (v.status === "Suspended") blocking.push("Vendor is suspended pending resolution of a compliance matter.");
  if (flags.sanctioned) blocking.push("Vendor appears on a donor/statutory sanctions list.");
  if (v.status === "Pending Onboarding") blocking.push("Vendor onboarding is not yet approved by Procurement.");
  if (v.status === "Pending Reactivation") blocking.push("Reactivation is awaiting Senior Management approval.");

  if (v.status === "Flagged") {
    requiresApproval = true;
    warnings.push("Vendor is flagged — engagement requires Senior Management approval.");
  }
  if (flags.poorPerformance) {
    requiresApproval = true;
    warnings.push(
      `Past performance score is ${avgScore(v.performance)}/10 (below 5). Shortlisting requires management approval.`
    );
  }
  if (flags.expiredDocs.length > 0) {
    requiresApproval = true;
    warnings.push(`Expired compliance documents: ${flags.expiredDocs.join(", ")}.`);
  }
  if (flags.missingDocs.length > 0) {
    warnings.push(`Missing documents: ${flags.missingDocs.join(", ")}.`);
  }
  if (flags.expiringDocs.length > 0) {
    warnings.push(
      `Documents expiring within 30 days: ${flags.expiringDocs.map((d) => `${d.doc} (${d.daysLeft}d)`).join(", ")}.`
    );
  }
  if (!v.bankValidated) {
    warnings.push("Banking details have not been validated by Finance.");
  }

  return {
    eligible: blocking.length === 0,
    requiresManagementApproval: requiresApproval,
    blockingReasons: blocking,
    warnings,
  };
}

/** Vendors selectable in Sourcing, optionally narrowed to a procurement category. */
export function getEligibleVendors(category?: string): Vendor[] {
  return vendors
    .filter((v) => checkSourcingEligibility(v.id).eligible)
    .filter((v) => !category || v.category === category || category === "All Categories")
    .sort((a, b) => avgScore(b.performance) - avgScore(a.performance));
}

// ── Registration ────────────────────────────────────────────────────────────

export function peekNextVendorId(type: VendorType): string {
  return type === "Firm" ? `VND-${nextFirmSeq}` : `VND-${nextIndividualSeq}`;
}

export type NewFirmInput = Omit<
  FirmVendor,
  "id" | "vendorId" | "type" | "riskLevel" | "status" | "performance" | "totalOrders" | "totalSpend" | "dateOnboarded"
> & { status?: VendorStatus };

export type NewIndividualInput = Omit<
  IndividualVendor,
  "id" | "vendorId" | "type" | "riskLevel" | "status" | "performance" | "totalOrders" | "totalSpend" | "dateOnboarded"
> & { status?: VendorStatus };

/**
 * Creates a vendor record and returns it together with the flags raised during
 * screening, so the caller can surface duplicate/sanctions warnings.
 */
export function registerVendor(
  type: VendorType,
  input: NewFirmInput | NewIndividualInput,
  opts?: { registeredBy?: string; source?: "Internal" | "Self-Registration" }
): { vendor: Vendor; flags: VendorFlags } {
  const source = opts?.source ?? "Internal";
  const vendorId = type === "Firm" ? `VND-${nextFirmSeq++}` : `VND-${nextIndividualSeq++}`;

  const base = {
    id: `${type === "Firm" ? "f" : "i"}-${Date.now()}`,
    vendorId,
    riskLevel: "Low" as RiskLevel,
    // A self-registration is never live until Procurement has reviewed it.
    status: input.status ?? "Pending Onboarding",
    performance: { quality: 0, timeliness: 0, responsiveness: 0, costManagement: 0, compliance: 0 },
    totalOrders: 0,
    totalSpend: 0,
    dateOnboarded: todayStr(),
    pendingReview: source === "Self-Registration",
    sanctionsChecked: true,
    registrationSource: source,
  };

  const vendor = (type === "Firm"
    ? { ...(input as NewFirmInput), ...base, type: "Firm" as const }
    : { ...(input as NewIndividualInput), ...base, type: "Individual" as const }) as Vendor;

  vendor.riskLevel = computeRiskLevel(vendor);

  vendors = [...vendors, vendor];
  const flags = getVendorFlags(vendor);

  notify({
    category: flags.sanctioned || flags.duplicates.length > 0 ? "Alert" : "Info",
    module: "Supplier Management",
    subject: `Vendor registration: ${vendorDisplayName(vendor)} (${vendorId})`,
    body: [
      `${source === "Self-Registration" ? "Self-registration received via the vendor portal" : "Vendor registered internally"} by ${opts?.registeredBy ?? "Procurement"}.`,
      flags.sanctioned ? "⚠ SANCTIONS MATCH — this name appears on a debarment list. Do not approve without escalation." : "",
      flags.duplicates.length > 0
        ? `⚠ Possible duplicate of: ${flags.duplicates.map((d) => `${vendorDisplayName(d)} (${d.vendorId})`).join(", ")}.`
        : "",
      flags.missingDocs.length > 0 ? `Outstanding documents: ${flags.missingDocs.join(", ")}.` : "",
      "Awaiting Procurement review before the vendor becomes active.",
    ]
      .filter(Boolean)
      .join("\n"),
    recipientRole: "Procurement",
    entityRef: vendorId,
    priority: flags.sanctioned ? "Urgent" : "Normal",
  });

  syncDocumentExpiryReminders(vendor);
  notifyListeners();
  return { vendor, flags };
}

export function updateVendor(id: string, updates: Partial<Vendor>, performedBy: string): Vendor | undefined {
  let updated: Vendor | undefined;
  vendors = vendors.map((v) => {
    if (v.id !== id) return v;
    const merged = { ...v, ...updates } as Vendor;
    merged.riskLevel = computeRiskLevel(merged);
    updated = merged;
    return merged;
  });
  if (updated) {
    syncDocumentExpiryReminders(updated);
    notify({
      category: "Info",
      module: "Supplier Management",
      subject: `Vendor record updated: ${vendorDisplayName(updated)}`,
      body: `Fields changed: ${Object.keys(updates).join(", ")}. Updated by ${performedBy}.`,
      recipientRole: "Procurement",
      entityRef: updated.vendorId,
    });
    notifyListeners();
  }
  return updated;
}

/** Procurement sign-off that moves a pending registration to Active. */
export function approveVendorRegistration(id: string, approvedBy: string): Vendor | undefined {
  const v = getVendorById(id);
  if (!v) return undefined;
  const missing = getMissingDocs(v);
  if (missing.length > 0) {
    notify({
      category: "Alert",
      module: "Supplier Management",
      subject: `Cannot approve ${vendorDisplayName(v)} — documents outstanding`,
      body: `The following mandatory documents are still missing: ${missing.join(", ")}.`,
      recipientRole: "Procurement",
      entityRef: v.vendorId,
      priority: "High",
    });
    return undefined;
  }
  return changeVendorStatus(id, "Active", "Registration reviewed and approved.", approvedBy);
}

// ── Status transitions ──────────────────────────────────────────────────────

export function changeVendorStatus(
  id: string,
  to: VendorStatus,
  reason: string,
  performedBy: string,
  approvedBy?: string
): Vendor | undefined {
  let updated: Vendor | undefined;
  vendors = vendors.map((v) => {
    if (v.id !== id) return v;
    const change: VendorStatusChange = {
      id: `vsh-${Date.now()}`,
      date: todayStr(),
      from: v.status,
      to,
      reason,
      performedBy,
      approvedBy,
    };
    const merged: Vendor = {
      ...v,
      status: to,
      pendingReview: to === "Active" ? false : v.pendingReview,
      statusHistory: [...(v.statusHistory ?? []), change],
    };
    merged.riskLevel = computeRiskLevel(merged);
    updated = merged;
    return merged;
  });

  if (updated) {
    const blocking = to === "Blacklisted" || to === "Suspended";
    notify({
      category: blocking ? "Alert" : "Info",
      module: "Supplier Management",
      subject: `${vendorDisplayName(updated)} — status changed to ${to}`,
      body: `${reason}\n\nActioned by ${performedBy}${approvedBy ? `, approved by ${approvedBy}` : ""}.${
        blocking ? "\n\nThis vendor is now blocked from all solicitations and awards." : ""
      }${to === "Pending Reactivation" ? "\n\nReactivation requires Senior Management approval." : ""}`,
      recipientRole: to === "Pending Reactivation" ? "Senior Management" : "Procurement",
      entityRef: updated.vendorId,
      priority: blocking ? "High" : "Normal",
      channels: blocking ? ["In-App", "Email", "SMS"] : ["In-App", "Email"],
    });
    notifyListeners();
  }
  return updated;
}

export function requestReactivation(id: string, reason: string, requestedBy: string) {
  return changeVendorStatus(id, "Pending Reactivation", reason, requestedBy);
}

export function approveReactivation(id: string, approvedBy: string) {
  return changeVendorStatus(id, "Active", "Reactivation approved by Senior Management.", approvedBy, approvedBy);
}

// ── Finance: banking validation ─────────────────────────────────────────────

export function validateBankingDetails(id: string, validatedBy: string): Vendor | undefined {
  let updated: Vendor | undefined;
  vendors = vendors.map((v) => {
    if (v.id !== id) return v;
    updated = { ...v, bankValidated: true, bankValidatedBy: validatedBy };
    return updated;
  });
  if (updated) {
    notify({
      category: "Info",
      module: "Supplier Management",
      subject: `Banking details validated — ${vendorDisplayName(updated)}`,
      body: `Finance confirmed the bank account on file. Validated by ${validatedBy}.`,
      recipientRole: "Procurement",
      entityRef: updated.vendorId,
    });
    notifyListeners();
  }
  return updated;
}

// ── Documents ───────────────────────────────────────────────────────────────

export function addVendorDocument(
  id: string,
  doc: { label: string; expiry?: string },
  uploadedBy: string
): Vendor | undefined {
  let updated: Vendor | undefined;
  vendors = vendors.map((v) => {
    if (v.id !== id) return v;
    const merged: Vendor = {
      ...v,
      documents: v.documents.includes(doc.label) ? v.documents : [...v.documents, doc.label],
      documentExpiry: doc.expiry ? { ...v.documentExpiry, [doc.label]: doc.expiry } : v.documentExpiry,
    };
    merged.riskLevel = computeRiskLevel(merged);
    updated = merged;
    return merged;
  });
  if (updated) {
    // A renewed certificate clears the reminder that was chasing it.
    resolveReminder(`${updated.vendorId}:${doc.label}`, "Vendor Document");
    syncDocumentExpiryReminders(updated);
    notify({
      category: "Info",
      module: "Supplier Management",
      subject: `Document uploaded — ${vendorDisplayName(updated)}`,
      body: `${doc.label} uploaded by ${uploadedBy}${doc.expiry ? `, valid until ${doc.expiry}` : ""}.`,
      recipientRole: "Procurement",
      entityRef: updated.vendorId,
    });
    notifyListeners();
  }
  return updated;
}

/** Queues renewal reminders for every compliance document nearing expiry. */
export function syncDocumentExpiryReminders(v: Vendor) {
  Object.entries(v.documentExpiry).forEach(([doc, expiry]) => {
    if (!EXPIRY_CRITICAL_DOCS.includes(doc)) return;
    const daysLeft = daysUntil(expiry);
    if (daysLeft > 60) return;
    scheduleReminder({
      entityRef: `${v.vendorId}:${doc}`,
      entityType: "Vendor Document",
      module: "Supplier Management",
      subject: `${doc} for ${vendorDisplayName(v)} ${daysLeft < 0 ? "has expired" : `expires in ${daysLeft} days`}`,
      body: `${doc} on file for ${vendorDisplayName(v)} (${v.vendorId}) is valid until ${expiry}. Request a renewed copy from the vendor to keep them eligible for solicitation.`,
      recipientRole: "Procurement",
      dueDate: expiry,
      reminderAfterHours: 24,
      escalateAfterHours: 24 * 14,
    });
  });
}

/** Runs the expiry sweep across the whole register — called on module load. */
export function syncAllDocumentReminders() {
  vendors.forEach(syncDocumentExpiryReminders);
}

// ── Performance ─────────────────────────────────────────────────────────────

const STANDARD_CRITERIA_MAP: Record<string, keyof PerformanceScore> = {
  "quality of deliverables": "quality",
  quality: "quality",
  timeliness: "timeliness",
  "cost control": "costManagement",
  "cost management": "costManagement",
  "compliance with terms": "compliance",
  compliance: "compliance",
  "professionalism and responsiveness": "responsiveness",
  professionalism: "responsiveness",
  responsiveness: "responsiveness",
};

/**
 * Records a contract evaluation against the vendor profile and rolls it into the
 * headline performance score, which is what makes the rating "visible in both
 * places" as the requirement puts it.
 */
export function recordVendorEvaluation(
  vendorRef: string,
  evaluation: Omit<VendorEvaluation, "id">
): Vendor | undefined {
  const target = getVendorById(vendorRef) ?? findVendorByName(vendorRef);
  if (!target) return undefined;

  let updated: Vendor | undefined;
  vendors = vendors.map((v) => {
    if (v.id !== target.id) return v;

    const record: VendorEvaluation = { ...evaluation, id: `ve-${Date.now()}` };
    const evaluations = [...(v.evaluations ?? []), record];

    // Recompute the headline score as the mean across every evaluation that
    // scored each standard criterion.
    const buckets: Record<keyof PerformanceScore, number[]> = {
      quality: [], timeliness: [], responsiveness: [], costManagement: [], compliance: [],
    };
    evaluations.forEach((ev) => {
      ev.criteria.forEach((c) => {
        const key = STANDARD_CRITERIA_MAP[c.name.trim().toLowerCase()];
        if (!key) return;
        // Normalise to a 10-point scale so a re-weighted template still averages.
        buckets[key].push((c.score / (c.maxScore || 10)) * 10);
      });
    });
    const mean = (arr: number[]) => (arr.length ? +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 0);
    const performance: PerformanceScore = {
      quality: mean(buckets.quality) || v.performance.quality,
      timeliness: mean(buckets.timeliness) || v.performance.timeliness,
      responsiveness: mean(buckets.responsiveness) || v.performance.responsiveness,
      costManagement: mean(buckets.costManagement) || v.performance.costManagement,
      compliance: mean(buckets.compliance) || v.performance.compliance,
    };

    const merged: Vendor = { ...v, evaluations, performance };
    merged.riskLevel = computeRiskLevel(merged);
    updated = merged;
    return merged;
  });

  if (updated) {
    const score = evaluation.overallScore;
    const poor = score < 5;
    notify({
      category: poor ? "Alert" : "Info",
      module: "Supplier Management",
      subject: `${evaluation.evaluationType} evaluation recorded — ${vendorDisplayName(updated)} scored ${score}/10`,
      body: poor
        ? `Performance on ${evaluation.contractNumber} scored ${score}/10, below the threshold of 5. This vendor is now flagged: future shortlisting or award requires Senior Management approval.`
        : `Performance on ${evaluation.contractNumber} scored ${score}/10. Recorded by ${evaluation.evaluator}${
            evaluation.supervisorApproval ? `, approved by ${evaluation.supervisorApproval}` : ""
          }.`,
      recipientRole: "Procurement",
      entityRef: updated.vendorId,
      priority: poor ? "High" : "Normal",
    });

    if (poor && updated.status === "Active") {
      changeVendorStatus(
        updated.id,
        "Flagged",
        `Automatic flag: ${evaluation.evaluationType} evaluation on ${evaluation.contractNumber} scored ${score}/10 (below 5).`,
        "System"
      );
      updated = getVendorById(updated.id);
    }
    notifyListeners();
  }
  return updated;
}

/** Called on contract award so the vendor profile shows engagement history. */
export function recordContractAward(vendorRef: string, record: VendorContractRecord): Vendor | undefined {
  const target = getVendorById(vendorRef) ?? findVendorByName(vendorRef);
  if (!target) return undefined;

  let updated: Vendor | undefined;
  vendors = vendors.map((v) => {
    if (v.id !== target.id) return v;
    const history = v.contractHistory ?? [];
    if (history.some((h) => h.contractNumber === record.contractNumber)) {
      updated = v;
      return v;
    }
    updated = {
      ...v,
      contractHistory: [...history, record],
      totalOrders: v.totalOrders + 1,
      totalSpend: v.totalSpend + record.value,
    };
    return updated;
  });
  if (updated) notifyListeners();
  return updated;
}

/** Appends a consultant's agreed rate so the last-3-assignments view stays current. */
export function recordConsultantRate(vendorRef: string, rate: HistoricalRate): Vendor | undefined {
  const target = getVendorById(vendorRef) ?? findVendorByName(vendorRef);
  if (!target || target.type !== "Individual") return undefined;
  let updated: Vendor | undefined;
  vendors = vendors.map((v) => {
    if (v.id !== target.id || v.type !== "Individual") return v;
    updated = { ...v, historicalRates: [rate, ...v.historicalRates].slice(0, 10) };
    return updated;
  });
  if (updated) notifyListeners();
  return updated;
}

// ── Aggregate reads for dashboards ──────────────────────────────────────────

export function getVendorStats() {
  const active = vendors.filter((v) => v.status === "Active").length;
  const pending = vendors.filter((v) => v.status === "Pending Onboarding" || v.pendingReview).length;
  const flagged = vendors.filter(
    (v) => v.status === "Flagged" || v.status === "Suspended" || v.status === "Blacklisted"
  ).length;
  const expiring = vendors.filter((v) => getExpiringDocs(v).length > 0 || getExpiredDocs(v).length > 0).length;
  const scored = vendors.filter((v) => avgScore(v.performance) > 0);
  const avgPerformance = scored.length
    ? +(scored.reduce((sum, v) => sum + avgScore(v.performance), 0) / scored.length).toFixed(1)
    : 0;

  return { total: vendors.length, active, pending, flagged, expiring, avgPerformance };
}

/** Ranked leaderboard used by the vendor performance report. */
export function getPerformanceRanking(): { vendor: Vendor; score: number; contracts: number }[] {
  return vendors
    .filter((v) => avgScore(v.performance) > 0)
    .map((v) => ({ vendor: v, score: avgScore(v.performance), contracts: v.contractHistory?.length ?? v.totalOrders }))
    .sort((a, b) => b.score - a.score);
}

export function getVendorsByCategory(): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  vendors.forEach((v) => counts.set(v.category, (counts.get(v.category) ?? 0) + 1));
  return Array.from(counts, ([category, count]) => ({ category, count }));
}

export function getBlockedVendors(): Vendor[] {
  return vendors.filter(
    (v) => v.status === "Blacklisted" || v.status === "Suspended" || v.status === "Flagged"
  );
}

export function getVendorsWithDocumentIssues(): { vendor: Vendor; expired: string[]; expiring: { doc: string; expiry: string; daysLeft: number }[] }[] {
  return vendors
    .map((v) => ({ vendor: v, expired: getExpiredDocs(v), expiring: getExpiringDocs(v) }))
    .filter((r) => r.expired.length > 0 || r.expiring.length > 0);
}
