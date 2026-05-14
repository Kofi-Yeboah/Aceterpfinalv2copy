import { useState } from "react";
import {
  Search, Download, Upload, ChevronDown, MoreHorizontal, Plus, X, Eye, Edit2,
  Building2, User, Star, AlertTriangle, ShieldAlert, ShieldBan, ShieldCheck,
  ArrowLeft, FileText, Check, Paperclip, Upload as UploadIcon, Clock,
  Users, Loader, Flag, TrendingUp, CalendarClock
} from "lucide-react";
import { SupplierDetailsView, type SupplierDetailData } from "./SupplierDetailsView";

/* ══════════════════════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════════════════════ */

type VendorType = "Firm" | "Individual";
type VendorStatus = "Active" | "Pending Onboarding" | "Flagged" | "Blacklisted" | "Suspended" | "Pending Reactivation";
type RiskLevel = "Low" | "Medium" | "High";

interface PerformanceScore {
  quality: number;
  timeliness: number;
  responsiveness: number;
  costManagement: number;
  compliance: number;
}

interface FirmVendor {
  id: string;
  vendorId: string;
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
}

interface HistoricalRate {
  assignment: string;
  rate: number;
  rateType: "Daily" | "Monthly";
  period: string;
}

interface IndividualVendor {
  id: string;
  vendorId: string;
  type: "Individual";
  legalName: string;
  contactEmail: string;
  contactPhone: string;
  idType: "Passport" | "National ID" | "Driver's License";
  idNumber: string;
  residentialAddress: string;
  bankName: string;
  bankAccountNumber: string;
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
  expertAreas: string[];
  historicalRates: HistoricalRate[];
}

type Vendor = FirmVendor | IndividualVendor;

/* ══════════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════��══════════════════════ */

const CATEGORIES = ["All Categories", "Goods", "Works", "Consulting"];
const SUB_CATEGORIES: Record<string, string[]> = {
  Goods: ["IT Equipment", "Office Supplies", "Medical Supplies", "Vehicles", "Furniture"],
  Works: ["Construction", "Renovation", "Installation", "Maintenance"],
  Consulting: ["Management Consulting", "IT Consulting", "Financial Advisory", "Legal Services", "Research"],
};
const STATUSES: VendorStatus[] = ["Active", "Pending Onboarding", "Flagged", "Blacklisted", "Suspended", "Pending Reactivation"];
const STATUS_FILTERS = ["All Statuses", ...STATUSES];
const RISK_LEVELS: RiskLevel[] = ["Low", "Medium", "High"];

const EXPERT_AREAS_OPTIONS = [
  "Policy Analysis", "Data Science", "M&E", "Gender Studies", "Agricultural Economics",
  "Public Health", "Climate Change", "Education", "Governance", "Statistics",
  "Project Management", "Financial Analysis", "Legal Advisory", "IT Systems", "Human Resources",
];

const FIRM_DOC_CHECKLIST = [
  "Certificate of Incorporation",
  "Tax Clearance Certificate",
  "SSNIT Clearance",
  "VAT Registration",
  "Performance References",
];
const INDIVIDUAL_DOC_CHECKLIST = [
  "CV / Resume",
  "Passport / National ID Copy",
  "Proof of Residential Address",
  "Bank Account Confirmation",
];

/* ══════════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════════════════════════════════════════ */

let nextVendorNumber = 1009;

const firmVendors: FirmVendor[] = [
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
    dateOnboarded: "2022-03-15",
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
    dateOnboarded: "2021-08-10",
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
    dateOnboarded: "2023-01-20",
  },
  {
    id: "f4", vendorId: "VND-1004", type: "Firm", legalBusinessName: "La Palm Royal Beach Hotel",
    registrationNumber: "CS-2005-12345", taxId: "TIN-GH-9876543", registeredAddress: "La Beach Road, Trade Fair, Accra",
    contactPerson: "Emily Davis", email: "events@lapalmhotel.com", phone: "+233 30 271 2500",
    bankName: "Standard Chartered", bankAccountNumber: "****6654", category: "Works", subCategory: "Maintenance",
    riskLevel: "Medium", status: "Active",
    performance: { quality: 9.0, timeliness: 8.5, responsiveness: 9.2, costManagement: 7.8, compliance: 9.0 },
    totalOrders: 15, totalSpend: 98000,
    documents: ["Certificate of Incorporation", "Tax Clearance Certificate", "VAT Registration", "Performance References"],
    documentExpiry: { "Tax Clearance Certificate": "2026-12-01", "VAT Registration": "2027-06-01" },
    dateOnboarded: "2022-06-01",
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
    dateOnboarded: "2023-04-12",
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
    dateOnboarded: "2026-03-10",
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
    dateOnboarded: "2020-11-05",
  },
  {
    id: "f8", vendorId: "VND-1008", type: "Firm", legalBusinessName: "ABC Logistics Group",
    registrationNumber: "CS-2017-34567", taxId: "TIN-GH-8901234", registeredAddress: "3 North Industrial Area, Accra",
    contactPerson: "Rachel Green", email: "rachel@abclogistics.com.gh", phone: "+233 24 789 0123",
    bankName: "Zenith Bank", bankAccountNumber: "****1198", category: "Works", subCategory: "Installation",
    riskLevel: "Medium", status: "Suspended",
    performance: { quality: 6.5, timeliness: 5.5, responsiveness: 7.0, costManagement: 6.0, compliance: 5.0 },
    totalOrders: 12, totalSpend: 156000,
    documents: ["Certificate of Incorporation", "Tax Clearance Certificate", "SSNIT Clearance"],
    documentExpiry: { "Tax Clearance Certificate": "2026-05-30", "SSNIT Clearance": "2026-06-10" },
    dateOnboarded: "2021-02-18",
  },
];

const individualVendors: IndividualVendor[] = [
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
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════════════════════ */

function avgScore(p: PerformanceScore) {
  const vals = [p.quality, p.timeliness, p.responsiveness, p.costManagement, p.compliance];
  const nonZero = vals.filter(v => v > 0);
  if (nonZero.length === 0) return 0;
  return +(nonZero.reduce((a, b) => a + b, 0) / nonZero.length).toFixed(1);
}

function hasExpiredDocs(v: Vendor): boolean {
  const now = new Date();
  return Object.values(v.documentExpiry).some(d => new Date(d) < now);
}

function hasDocExpiringWithin30Days(v: Vendor): boolean {
  const now = new Date();
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);
  return Object.values(v.documentExpiry).some(d => {
    const exp = new Date(d);
    return exp >= now && exp <= in30;
  });
}

function hasMissingDocs(v: Vendor): boolean {
  const checklist = v.type === "Firm" ? FIRM_DOC_CHECKLIST : INDIVIDUAL_DOC_CHECKLIST;
  return checklist.some(doc => !v.documents.includes(doc));
}

function hasDocWarning(v: Vendor): boolean {
  return hasExpiredDocs(v) || hasMissingDocs(v);
}

function getStatusColor(s: VendorStatus) {
  switch (s) {
    case "Active": return "bg-green-50 text-green-600";
    case "Pending Onboarding": return "bg-amber-50 text-amber-600";
    case "Flagged": return "bg-orange-50 text-orange-700";
    case "Blacklisted": return "bg-red-50 text-red-700";
    case "Suspended": return "bg-slate-100 text-slate-600";
    case "Pending Reactivation": return "bg-blue-50 text-blue-600";
  }
}

function getRiskColor(r: RiskLevel) {
  switch (r) {
    case "Low": return "bg-green-50 text-green-700";
    case "Medium": return "bg-amber-50 text-amber-700";
    case "High": return "bg-red-50 text-red-700";
  }
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

function ratingStars(score: number) {
  if (score === 0) return "—";
  return `${score}/10`;
}

const F = "Montserrat, sans-serif";

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export function Suppliers() {
  const [activeTab, setActiveTab] = useState<"firms" | "individuals">("firms");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showOnboardModal, setShowOnboardModal] = useState<VendorType | null>(null);

  // Detail view
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedSupplierForDetail, setSelectedSupplierForDetail] = useState<SupplierDetailData | null>(null);

  // Onboard form states — Firm
  const [firmForm, setFirmForm] = useState({
    legalBusinessName: "", registrationNumber: "", taxId: "", registeredAddress: "",
    contactPerson: "", email: "", phone: "",
    bankName: "", bankAccountNumber: "",
    category: "", subCategory: "",
  });
  const [firmDocs, setFirmDocs] = useState<string[]>([]);

  // Onboard form states — Individual
  const [indForm, setIndForm] = useState({
    legalName: "", contactEmail: "", contactPhone: "",
    idType: "Passport" as "Passport" | "National ID" | "Driver's License",
    idNumber: "", residentialAddress: "",
    bankName: "", bankAccountNumber: "",
    category: "", subCategory: "",
  });
  const [indDocs, setIndDocs] = useState<string[]>([]);

  const [indExpertAreas, setIndExpertAreas] = useState<string[]>([]);
  const [showExpertDropdown, setShowExpertDropdown] = useState(false);

  // Document expiry fields for onboarding forms
  const [firmDocExpiry, setFirmDocExpiry] = useState<Record<string, string>>({});
  const [indDocExpiry, setIndDocExpiry] = useState<Record<string, string>>({});

  // Reactivation confirmation modal
  const [showReactivateModal, setShowReactivateModal] = useState<Vendor | null>(null);

  const [formCategoryDropdown, setFormCategoryDropdown] = useState(false);
  const [formSubCategoryDropdown, setFormSubCategoryDropdown] = useState(false);

  // ── Dashboard Stats ──────────────────────────────────────────────────────
  const allVendors: Vendor[] = [...firmVendors, ...individualVendors];
  const activeCount = allVendors.filter(v => v.status === "Active").length;
  const pendingOnboardingCount = allVendors.filter(v => v.status === "Pending Onboarding").length;
  const flaggedSuspendedCount = allVendors.filter(v => v.status === "Flagged" || v.status === "Suspended" || v.status === "Blacklisted").length;
  const expiringDocsCount = allVendors.filter(v => hasDocExpiringWithin30Days(v) || hasExpiredDocs(v)).length;
  const activeWithScores = allVendors.filter(v => v.status === "Active" && avgScore(v.performance) > 0);
  const avgPerformanceScore = activeWithScores.length > 0
    ? +(activeWithScores.reduce((sum, v) => sum + avgScore(v.performance), 0) / activeWithScores.length).toFixed(1)
    : 0;

  // ── Filtering ───────────────────────────────────���──────────────────────────

  const filteredFirms = firmVendors.filter(v => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = v.legalBusinessName.toLowerCase().includes(q) ||
      v.vendorId.toLowerCase().includes(q) || v.contactPerson.toLowerCase().includes(q);
    const matchesCat = selectedCategory === "All Categories" || v.category === selectedCategory;
    const matchesStat = selectedStatus === "All Statuses" || v.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStat;
  });

  const filteredIndividuals = individualVendors.filter(v => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = v.legalName.toLowerCase().includes(q) ||
      v.vendorId.toLowerCase().includes(q) || v.contactEmail.toLowerCase().includes(q);
    const matchesCat = selectedCategory === "All Categories" || v.category === selectedCategory;
    const matchesStat = selectedStatus === "All Statuses" || v.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStat;
  });

  // Counts
  const firmCount = firmVendors.length;
  const indCount = individualVendors.length;

  const closeAllDropdowns = () => { setShowCategoryDropdown(false); setShowStatusDropdown(false); };

  // ── Detail view adapter ──────────────────────��─────────────────────────────
  const openDetail = (v: Vendor) => {
    const base = {
      id: v.id,
      vendorId: v.vendorId,
      type: v.type,
      name: v.type === "Firm" ? v.legalBusinessName : v.legalName,
      contactPerson: v.type === "Firm" ? v.contactPerson : v.legalName,
      email: v.type === "Firm" ? v.email : v.contactEmail,
      phone: v.type === "Firm" ? v.phone : v.contactPhone,
      category: v.category,
      subCategory: v.subCategory,
      riskLevel: v.riskLevel,
      status: v.status,
      performance: v.performance,
      totalOrders: v.totalOrders,
      totalSpend: v.totalSpend,
      documents: v.documents,
      documentExpiry: v.documentExpiry,
      dateOnboarded: v.dateOnboarded,
      bankName: v.bankName,
    };
    const extra = v.type === "Firm"
      ? { registrationNumber: v.registrationNumber, taxId: v.taxId, registeredAddress: v.registeredAddress }
      : { idType: v.idType, idNumber: v.idNumber, residentialAddress: v.residentialAddress, expertAreas: v.expertAreas, historicalRates: v.historicalRates };
    setSelectedSupplierForDetail({ ...base, ...extra } as SupplierDetailData);
    setShowDetailView(true);
  };

  const handleUploadDoc = (type: "firm" | "individual") => {
    const list = type === "firm" ? FIRM_DOC_CHECKLIST : INDIVIDUAL_DOC_CHECKLIST;
    const current = type === "firm" ? firmDocs : indDocs;
    const next = list.find(d => !current.includes(d));
    if (next) {
      if (type === "firm") setFirmDocs(prev => [...prev, next]);
      else setIndDocs(prev => [...prev, next]);
    }
  };

  const resetForms = () => {
    setFirmForm({ legalBusinessName: "", registrationNumber: "", taxId: "", registeredAddress: "", contactPerson: "", email: "", phone: "", bankName: "", bankAccountNumber: "", category: "", subCategory: "" });
    setIndForm({ legalName: "", contactEmail: "", contactPhone: "", idType: "Passport", idNumber: "", residentialAddress: "", bankName: "", bankAccountNumber: "", category: "", subCategory: "" });
    setFirmDocs([]);
    setIndDocs([]);
    setIndExpertAreas([]);
    setFirmDocExpiry({});
    setIndDocExpiry({});
    setFormCategoryDropdown(false);
    setFormSubCategoryDropdown(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (showDetailView && selectedSupplierForDetail) {
    return (
      <SupplierDetailsView
        supplier={selectedSupplierForDetail}
        onBack={() => { setShowDetailView(false); setSelectedSupplierForDetail(null); }}
      />
    );
  }

  const tabs = [
    { key: "firms" as const, label: "Firms", icon: <Building2 size={14} />, count: firmCount },
    { key: "individuals" as const, label: "Individual Consultants", icon: <User size={14} />, count: indCount },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden" style={{ fontFamily: F }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-900" style={{ fontFamily: F }}>Supplier Management</h1>
          <p className="text-[12px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>Vendor registration, onboarding, categorization & performance</p>
        </div>
        <button
          onClick={() => setShowOnboardModal(activeTab === "firms" ? "Firm" : "Individual")}
          className="px-4 py-2 text-white rounded-lg text-[12px] font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
          style={{ backgroundColor: "#0B01D0", fontFamily: F }}
        >
          <Plus size={14} />
          Onboard {activeTab === "firms" ? "Firm" : "Individual"}
        </button>
      </div>

      {/* Tabs — Document Vault style */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearchQuery(""); setSelectedCategory("All Categories"); setSelectedStatus("All Statuses"); }}
              className={`px-4 py-1.5 rounded-lg text-[12px] transition-colors min-w-[140px] flex items-center justify-center gap-1.5 ${
                activeTab === tab.key ? "bg-purple-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
              style={{ fontFamily: F }}
            >
              {tab.icon} {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="relative max-w-[280px] flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by name, ID, email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              style={{ fontFamily: F }}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm text-[12px] text-slate-900" style={{ fontFamily: F }}>
              Export <Download size={14} className="text-purple-700" />
            </button>
            {/* Category Filter */}
            <div className="relative">
              <button onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowStatusDropdown(false); }}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm text-[12px] text-slate-900" style={{ fontFamily: F }}>
                {selectedCategory} <ChevronDown size={14} className="text-purple-700" />
              </button>
              {showCategoryDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowCategoryDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {CATEGORIES.map(c => (
                      <button key={c} onClick={() => { setSelectedCategory(c); setShowCategoryDropdown(false); }} className="w-full px-4 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{c}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Status Filter */}
            <div className="relative">
              <button onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowCategoryDropdown(false); }}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm text-[12px] text-slate-900" style={{ fontFamily: F }}>
                {selectedStatus} <ChevronDown size={14} className="text-purple-700" />
              </button>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {STATUS_FILTERS.map(s => (
                      <button key={s} onClick={() => { setSelectedStatus(s); setShowStatusDropdown(false); }} className="w-full px-4 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{s}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Dashboard Summary Cards ── */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          {[
            { label: "Active Vendors", value: activeCount, icon: <Users size={16} />, color: "text-green-600", bg: "bg-green-50" },
            { label: "Pending Onboarding", value: pendingOnboardingCount, icon: <Loader size={16} />, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Flagged / Suspended", value: flaggedSuspendedCount, icon: <Flag size={16} />, color: "text-red-600", bg: "bg-red-50" },
            { label: "Expiring Documents", value: expiringDocsCount, icon: <CalendarClock size={16} />, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Avg Performance", value: avgPerformanceScore > 0 ? `${avgPerformanceScore}/10` : "N/A", icon: <TrendingUp size={16} />, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((card) => (
            <div key={card.label} className="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center shrink-0`} style={{ color: "#0B01D0" }}>
                {card.icon}
              </div>
              <div>
                <p className="text-[18px] font-semibold text-slate-900" style={{ fontFamily: F }}>{card.value}</p>
                <p className="text-[10px] text-slate-500" style={{ fontFamily: F }}>{card.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tables ── */}
      <div className="flex-1 overflow-auto">
        {activeTab === "firms" ? (
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
              <tr>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Vendor ID</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Legal Business Name</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Registration #</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Tax ID</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Category</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Risk</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Rating</th>
                <th className="text-right px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Total Spend</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Status</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFirms.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-12 text-[13px] text-slate-400" style={{ fontFamily: F }}>No firms found.</td></tr>
              ) : filteredFirms.map((v, i) => (
                <tr key={v.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`} onClick={() => openDetail(v)}>
                  <td className="px-4 py-3 text-[12px] text-purple-700 font-medium" style={{ fontFamily: F }}>
                    <div className="flex items-center gap-1.5">
                      {v.vendorId}
                      {hasDocWarning(v) && <AlertTriangle size={12} className="text-amber-500" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-slate-900 font-medium" style={{ fontFamily: F }}>{v.legalBusinessName}</p>
                    <p className="text-[11px] text-slate-400" style={{ fontFamily: F }}>{v.contactPerson}</p>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: F }}>{v.registrationNumber}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: F }}>{v.taxId}</td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-slate-900" style={{ fontFamily: F }}>{v.category}</p>
                    <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{v.subCategory}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getRiskColor(v.riskLevel)}`}>{v.riskLevel}</span>
                  </td>
                  <td className="px-4 py-3">
                    {avgScore(v.performance) > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-[12px] text-slate-900" style={{ fontFamily: F }}>{ratingStars(avgScore(v.performance))}</span>
                      </div>
                    ) : <span className="text-[11px] text-slate-400" style={{ fontFamily: F }}>N/A</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-[12px] text-slate-900 font-medium" style={{ fontFamily: F }}>{formatCurrency(v.totalSpend)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(v.status)}`}>{v.status}</span>
                  </td>
                  <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                    <div className="relative">
                      <button onClick={() => setOpenActionMenuId(openActionMenuId === v.id ? null : v.id)} className="inline-flex items-center justify-center w-8 h-8 hover:bg-slate-100 rounded transition-colors">
                        <MoreHorizontal size={16} className="text-slate-600" />
                      </button>
                      {openActionMenuId === v.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenActionMenuId(null)} />
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                            <button onClick={() => { openDetail(v); setOpenActionMenuId(null); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}><Eye size={13} /> View Details</button>
                            <button onClick={() => setOpenActionMenuId(null)} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}><Edit2 size={13} /> Edit</button>
                            {v.status === "Active" && <button onClick={() => setOpenActionMenuId(null)} className="w-full px-3 py-2 text-left text-[12px] text-amber-700 hover:bg-amber-50 flex items-center gap-2" style={{ fontFamily: F }}><AlertTriangle size={13} /> Flag Vendor</button>}
                            {v.status === "Flagged" && <button onClick={() => setOpenActionMenuId(null)} className="w-full px-3 py-2 text-left text-[12px] text-red-700 hover:bg-red-50 flex items-center gap-2" style={{ fontFamily: F }}><ShieldBan size={13} /> Blacklist</button>}
                            {(v.status === "Active" || v.status === "Flagged") && <button onClick={() => setOpenActionMenuId(null)} className="w-full px-3 py-2 text-left text-[12px] text-slate-600 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}><ShieldAlert size={13} /> Suspend</button>}
                            {(v.status === "Suspended" || v.status === "Flagged" || v.status === "Blacklisted") && <button onClick={() => { setShowReactivateModal(v); setOpenActionMenuId(null); }} className="w-full px-3 py-2 text-left text-[12px] text-green-700 hover:bg-green-50 flex items-center gap-2" style={{ fontFamily: F }}><ShieldCheck size={13} /> Reactivate</button>}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* ── Individuals Table ── */
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
              <tr>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Vendor ID</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Legal Name</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Contact</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>ID Type</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Category</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Risk</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Rating</th>
                <th className="text-right px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Total Spend</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Status</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIndividuals.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-12 text-[13px] text-slate-400" style={{ fontFamily: F }}>No individual consultants found.</td></tr>
              ) : filteredIndividuals.map((v, i) => (
                <tr key={v.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`} onClick={() => openDetail(v)}>
                  <td className="px-4 py-3 text-[12px] text-purple-700 font-medium" style={{ fontFamily: F }}>
                    <div className="flex items-center gap-1.5">
                      {v.vendorId}
                      {hasDocWarning(v) && <AlertTriangle size={12} className="text-amber-500" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-900 font-medium" style={{ fontFamily: F }}>{v.legalName}</td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-slate-900" style={{ fontFamily: F }}>{v.contactEmail}</p>
                    <p className="text-[11px] text-slate-400" style={{ fontFamily: F }}>{v.contactPhone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-slate-600" style={{ fontFamily: F }}>{v.idType}</p>
                    <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{v.idNumber}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-slate-900" style={{ fontFamily: F }}>{v.category}</p>
                    <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{v.subCategory}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getRiskColor(v.riskLevel)}`}>{v.riskLevel}</span>
                  </td>
                  <td className="px-4 py-3">
                    {avgScore(v.performance) > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-[12px] text-slate-900" style={{ fontFamily: F }}>{ratingStars(avgScore(v.performance))}</span>
                      </div>
                    ) : <span className="text-[11px] text-slate-400" style={{ fontFamily: F }}>N/A</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-[12px] text-slate-900 font-medium" style={{ fontFamily: F }}>{formatCurrency(v.totalSpend)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(v.status)}`}>{v.status}</span>
                  </td>
                  <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                    <div className="relative">
                      <button onClick={() => setOpenActionMenuId(openActionMenuId === v.id ? null : v.id)} className="inline-flex items-center justify-center w-8 h-8 hover:bg-slate-100 rounded transition-colors">
                        <MoreHorizontal size={16} className="text-slate-600" />
                      </button>
                      {openActionMenuId === v.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenActionMenuId(null)} />
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                            <button onClick={() => { openDetail(v); setOpenActionMenuId(null); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}><Eye size={13} /> View Details</button>
                            <button onClick={() => setOpenActionMenuId(null)} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}><Edit2 size={13} /> Edit</button>
                            {v.status === "Active" && <button onClick={() => setOpenActionMenuId(null)} className="w-full px-3 py-2 text-left text-[12px] text-amber-700 hover:bg-amber-50 flex items-center gap-2" style={{ fontFamily: F }}><AlertTriangle size={13} /> Flag</button>}
                            {v.status === "Flagged" && <button onClick={() => setOpenActionMenuId(null)} className="w-full px-3 py-2 text-left text-[12px] text-red-700 hover:bg-red-50 flex items-center gap-2" style={{ fontFamily: F }}><ShieldBan size={13} /> Blacklist</button>}
                            {(v.status === "Active" || v.status === "Flagged") && <button onClick={() => setOpenActionMenuId(null)} className="w-full px-3 py-2 text-left text-[12px] text-slate-600 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}><ShieldAlert size={13} /> Suspend</button>}
                            {(v.status === "Suspended" || v.status === "Flagged" || v.status === "Blacklisted") && <button onClick={() => { setShowReactivateModal(v); setOpenActionMenuId(null); }} className="w-full px-3 py-2 text-left text-[12px] text-green-700 hover:bg-green-50 flex items-center gap-2" style={{ fontFamily: F }}><ShieldCheck size={13} /> Reactivate</button>}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         ONBOARDING MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[640px] max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-[16px] font-semibold text-slate-900" style={{ fontFamily: F }}>
                  Onboard {showOnboardModal === "Firm" ? "Firm" : "Individual Consultant"}
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>
                  Generated Vendor ID: <span className="font-medium text-purple-700">VND-{showOnboardModal === "Firm" ? "1" : "2"}{String(nextVendorNumber).padStart(3, "0")}</span>
                </p>
              </div>
              <button onClick={() => { setShowOnboardModal(null); resetForms(); }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {showOnboardModal === "Firm" ? (
                /* ── Firm Form ── */
                <div className="flex flex-col gap-5">
                  <p className="text-[13px] font-semibold text-slate-800" style={{ fontFamily: F }}>Business Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Legal Business Name *</label>
                      <input type="text" value={firmForm.legalBusinessName} onChange={e => setFirmForm({ ...firmForm, legalBusinessName: e.target.value })} placeholder="e.g., PrintWorks Ghana Ltd" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Business Registration Number *</label>
                      <input type="text" value={firmForm.registrationNumber} onChange={e => setFirmForm({ ...firmForm, registrationNumber: e.target.value })} placeholder="e.g., CS-2021-12345" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Tax ID (TIN) *</label>
                      <input type="text" value={firmForm.taxId} onChange={e => setFirmForm({ ...firmForm, taxId: e.target.value })} placeholder="e.g., TIN-GH-1234567" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Registered Address *</label>
                      <input type="text" value={firmForm.registeredAddress} onChange={e => setFirmForm({ ...firmForm, registeredAddress: e.target.value })} placeholder="e.g., 14 Independence Ave, Accra" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-2" style={{ fontFamily: F }}>Contact Information</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Contact Person *</label>
                      <input type="text" value={firmForm.contactPerson} onChange={e => setFirmForm({ ...firmForm, contactPerson: e.target.value })} placeholder="Full name" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Email *</label>
                      <input type="email" value={firmForm.email} onChange={e => setFirmForm({ ...firmForm, email: e.target.value })} placeholder="email@company.com" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Phone *</label>
                      <input type="tel" value={firmForm.phone} onChange={e => setFirmForm({ ...firmForm, phone: e.target.value })} placeholder="+233 XX XXX XXXX" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-2" style={{ fontFamily: F }}>Bank Account Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Bank Name *</label>
                      <input type="text" value={firmForm.bankName} onChange={e => setFirmForm({ ...firmForm, bankName: e.target.value })} placeholder="e.g., GCB Bank" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Account Number *</label>
                      <input type="text" value={firmForm.bankAccountNumber} onChange={e => setFirmForm({ ...firmForm, bankAccountNumber: e.target.value })} placeholder="Account number" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-2" style={{ fontFamily: F }}>Categorization</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Category *</label>
                      <div className="relative">
                        <button onClick={() => { setFormCategoryDropdown(!formCategoryDropdown); setFormSubCategoryDropdown(false); }} className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 flex items-center justify-between text-[12px]" style={{ fontFamily: F }}>
                          <span className={firmForm.category ? "text-slate-900" : "text-slate-400"}>{firmForm.category || "Select category"}</span>
                          <ChevronDown size={14} className="text-purple-700" />
                        </button>
                        {formCategoryDropdown && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setFormCategoryDropdown(false)} />
                            <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                              {["Goods", "Works", "Consulting"].map(c => (
                                <button key={c} onClick={() => { setFirmForm({ ...firmForm, category: c, subCategory: "" }); setFormCategoryDropdown(false); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{c}</button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Sub-category</label>
                      <div className="relative">
                        <button onClick={() => { if (firmForm.category) { setFormSubCategoryDropdown(!formSubCategoryDropdown); setFormCategoryDropdown(false); } }} className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 flex items-center justify-between text-[12px]" style={{ fontFamily: F }}>
                          <span className={firmForm.subCategory ? "text-slate-900" : "text-slate-400"}>{firmForm.subCategory || "Select sub-category"}</span>
                          <ChevronDown size={14} className="text-purple-700" />
                        </button>
                        {formSubCategoryDropdown && firmForm.category && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setFormSubCategoryDropdown(false)} />
                            <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-[160px] overflow-y-auto">
                              {(SUB_CATEGORIES[firmForm.category] || []).map(sc => (
                                <button key={sc} onClick={() => { setFirmForm({ ...firmForm, subCategory: sc }); setFormSubCategoryDropdown(false); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{sc}</button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-2" style={{ fontFamily: F }}>Required Documents</p>
                  <div className="space-y-2">
                    {FIRM_DOC_CHECKLIST.map(doc => (
                      <div key={doc} className="space-y-1.5">
                        <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${firmDocs.includes(doc) ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"}`}>
                          <div className="flex items-center gap-2">
                            {firmDocs.includes(doc) ? <Check size={14} className="text-green-600" /> : <FileText size={14} className="text-slate-400" />}
                            <span className="text-[12px] text-slate-700" style={{ fontFamily: F }}>{doc}</span>
                          </div>
                          {!firmDocs.includes(doc) && (
                            <button onClick={() => handleUploadDoc("firm")} className="text-[11px] text-purple-700 hover:underline flex items-center gap-1" style={{ fontFamily: F }}>
                              <Paperclip size={12} /> Upload
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2 pl-6">
                          <label className="text-[10px] text-slate-500" style={{ fontFamily: F }}>Expiry Date:</label>
                          <input type="date" value={firmDocExpiry[doc] || ""} onChange={e => setFirmDocExpiry(prev => ({ ...prev, [doc]: e.target.value }))}
                            className="bg-slate-50 border border-slate-200 rounded h-[28px] px-2 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500" style={{ fontFamily: F }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* ── Individual Form ── */
                <div className="flex flex-col gap-5">
                  <p className="text-[13px] font-semibold text-slate-800" style={{ fontFamily: F }}>Personal Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Legal Name *</label>
                      <input type="text" value={indForm.legalName} onChange={e => setIndForm({ ...indForm, legalName: e.target.value })} placeholder="Full legal name" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Email *</label>
                      <input type="email" value={indForm.contactEmail} onChange={e => setIndForm({ ...indForm, contactEmail: e.target.value })} placeholder="email@example.com" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Phone *</label>
                      <input type="tel" value={indForm.contactPhone} onChange={e => setIndForm({ ...indForm, contactPhone: e.target.value })} placeholder="+233 XX XXX XXXX" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-2" style={{ fontFamily: F }}>Identification</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>ID Type *</label>
                      <select value={indForm.idType} onChange={e => setIndForm({ ...indForm, idType: e.target.value as any })} className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }}>
                        <option value="Passport">Passport</option>
                        <option value="National ID">National ID</option>
                        <option value="Driver's License">Driver's License</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>ID Number *</label>
                      <input type="text" value={indForm.idNumber} onChange={e => setIndForm({ ...indForm, idNumber: e.target.value })} placeholder="ID number" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Residential Address *</label>
                      <input type="text" value={indForm.residentialAddress} onChange={e => setIndForm({ ...indForm, residentialAddress: e.target.value })} placeholder="Full residential address" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-2" style={{ fontFamily: F }}>Bank Account Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Bank Name *</label>
                      <input type="text" value={indForm.bankName} onChange={e => setIndForm({ ...indForm, bankName: e.target.value })} placeholder="e.g., GCB Bank" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Account Number *</label>
                      <input type="text" value={indForm.bankAccountNumber} onChange={e => setIndForm({ ...indForm, bankAccountNumber: e.target.value })} placeholder="Account number" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-2" style={{ fontFamily: F }}>Categorization</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Category *</label>
                      <div className="relative">
                        <button onClick={() => { setFormCategoryDropdown(!formCategoryDropdown); setFormSubCategoryDropdown(false); }} className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 flex items-center justify-between text-[12px]" style={{ fontFamily: F }}>
                          <span className={indForm.category ? "text-slate-900" : "text-slate-400"}>{indForm.category || "Select"}</span>
                          <ChevronDown size={14} className="text-purple-700" />
                        </button>
                        {formCategoryDropdown && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setFormCategoryDropdown(false)} />
                            <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                              {["Goods", "Works", "Consulting"].map(c => (
                                <button key={c} onClick={() => { setIndForm({ ...indForm, category: c, subCategory: "" }); setFormCategoryDropdown(false); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{c}</button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Sub-category</label>
                      <div className="relative">
                        <button onClick={() => { if (indForm.category) { setFormSubCategoryDropdown(!formSubCategoryDropdown); setFormCategoryDropdown(false); } }} className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 flex items-center justify-between text-[12px]" style={{ fontFamily: F }}>
                          <span className={indForm.subCategory ? "text-slate-900" : "text-slate-400"}>{indForm.subCategory || "Select"}</span>
                          <ChevronDown size={14} className="text-purple-700" />
                        </button>
                        {formSubCategoryDropdown && indForm.category && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setFormSubCategoryDropdown(false)} />
                            <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-[160px] overflow-y-auto">
                              {(SUB_CATEGORIES[indForm.category] || []).map(sc => (
                                <button key={sc} onClick={() => { setIndForm({ ...indForm, subCategory: sc }); setFormSubCategoryDropdown(false); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{sc}</button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-2" style={{ fontFamily: F }}>Expert Areas</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {indExpertAreas.map(area => (
                      <span key={area} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[11px]" style={{ fontFamily: F }}>
                        {area}
                        <button onClick={() => setIndExpertAreas(prev => prev.filter(a => a !== area))} className="hover:text-red-500"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <button onClick={() => setShowExpertDropdown(!showExpertDropdown)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 flex items-center justify-between text-[12px]" style={{ fontFamily: F }}>
                      <span className="text-slate-400">Add expert areas...</span>
                      <ChevronDown size={14} className="text-purple-700" />
                    </button>
                    {showExpertDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowExpertDropdown(false)} />
                        <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-[180px] overflow-y-auto">
                          {EXPERT_AREAS_OPTIONS.filter(a => !indExpertAreas.includes(a)).map(area => (
                            <button key={area} onClick={() => { setIndExpertAreas(prev => [...prev, area]); }}
                              className="w-full px-3 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{area}</button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-4" style={{ fontFamily: F }}>Required Documents</p>
                  <div className="space-y-2">
                    {INDIVIDUAL_DOC_CHECKLIST.map(doc => (
                      <div key={doc} className="space-y-1.5">
                        <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${indDocs.includes(doc) ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"}`}>
                          <div className="flex items-center gap-2">
                            {indDocs.includes(doc) ? <Check size={14} className="text-green-600" /> : <FileText size={14} className="text-slate-400" />}
                            <span className="text-[12px] text-slate-700" style={{ fontFamily: F }}>{doc}</span>
                          </div>
                          {!indDocs.includes(doc) && (
                            <button onClick={() => handleUploadDoc("individual")} className="text-[11px] text-purple-700 hover:underline flex items-center gap-1" style={{ fontFamily: F }}>
                              <Paperclip size={12} /> Upload
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2 pl-6">
                          <label className="text-[10px] text-slate-500" style={{ fontFamily: F }}>Expiry Date:</label>
                          <input type="date" value={indDocExpiry[doc] || ""} onChange={e => setIndDocExpiry(prev => ({ ...prev, [doc]: e.target.value }))}
                            className="bg-slate-50 border border-slate-200 rounded h-[28px] px-2 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500" style={{ fontFamily: F }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button onClick={() => { setShowOnboardModal(null); resetForms(); }} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 hover:bg-slate-50 transition-colors" style={{ fontFamily: F }}>Cancel</button>
              <button
                onClick={() => { console.log("Onboarding:", showOnboardModal === "Firm" ? firmForm : indForm); setShowOnboardModal(null); resetForms(); }}
                className="px-4 py-2 text-white rounded-lg text-[12px] font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#0B01D0", fontFamily: F }}
              >
                Complete Onboarding
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         REACTIVATION CONFIRMATION MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {showReactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[440px] overflow-hidden">
            <div className="px-6 py-4 border-b border-blue-200 bg-blue-50">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-blue-600" />
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Reactivation Requires Approval</h3>
                  <p className="text-[11px] text-slate-500" style={{ fontFamily: F }}>
                    {showReactivateModal.type === "Firm"
                      ? (showReactivateModal as FirmVendor).legalBusinessName
                      : (showReactivateModal as IndividualVendor).legalName} ({showReactivateModal.vendorId})
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-[12px] text-slate-600" style={{ fontFamily: F }}>
                Reactivation of blacklisted or suspended vendors requires management approval. Clicking "Request Reactivation" will change the vendor status to <span className="font-semibold text-blue-700">Pending Reactivation</span> and notify the management team for review.
              </p>
              <div className="mt-3 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-[11px] text-amber-700 flex items-center gap-1.5" style={{ fontFamily: F }}>
                  <AlertTriangle size={12} /> The vendor will not be eligible for sourcing until management approves the reactivation.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button onClick={() => setShowReactivateModal(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50 transition-colors" style={{ fontFamily: F }}>
                Cancel
              </button>
              <button onClick={() => {
                // Change status to Pending Reactivation
                const vendor = showReactivateModal;
                if (vendor.type === "Firm") {
                  const idx = firmVendors.findIndex(v => v.id === vendor.id);
                  if (idx !== -1) firmVendors[idx].status = "Pending Reactivation";
                } else {
                  const idx = individualVendors.findIndex(v => v.id === vendor.id);
                  if (idx !== -1) individualVendors[idx].status = "Pending Reactivation";
                }
                console.log(`Reactivation requested for ${vendor.vendorId} — status set to Pending Reactivation`);
                setShowReactivateModal(null);
              }}
                className="px-5 py-2 rounded-lg text-[12px] font-medium text-white transition-opacity hover:opacity-90 bg-blue-600" style={{ fontFamily: F }}>
                Request Reactivation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
