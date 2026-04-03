import { useState, useRef, cloneElement } from "react";
import type { ReactElement } from "react";
import {
  Search,
  Shield,
  Lock,
  FileText,
  ChevronDown,
  Eye,
  Download,
  ArrowUpRight,
  X,
  Bot,
  Users,
  Briefcase,
  DollarSign,
  ShoppingCart,
  FolderKanban,
  Scale,
  Receipt,
  FileCheck,
  FileBadge,
  FileSignature,
  ClipboardCheck,
  AlertTriangle,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Filter,
  FileImage,
  FileSpreadsheet,
  Handshake,
  BarChart3,
} from "lucide-react";

// ── Module definitions ──
type ModuleKey = "hr" | "financials" | "procurement" | "payroll" | "project" | "legal" | "stakeholders" | "mel";

interface ModuleConfig {
  key: ModuleKey;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  badgeColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  accessLabel: string;
}

const modules: ModuleConfig[] = [
  {
    key: "hr", label: "HR Management", shortLabel: "HR Mgt.",
    icon: <Users size={16} />,
    badgeColor: "bg-green-50 text-green-700 border-green-200",
    bgColor: "bg-green-50", borderColor: "border-green-200", textColor: "text-green-700",
    accentColor: "bg-green-600", accessLabel: "HR Only",
  },
  {
    key: "financials", label: "Finance", shortLabel: "Finance",
    icon: <DollarSign size={16} />,
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    bgColor: "bg-amber-50", borderColor: "border-amber-200", textColor: "text-amber-700",
    accentColor: "bg-amber-500", accessLabel: "Finance Only",
  },
  {
    key: "procurement", label: "Procurement", shortLabel: "Procurement",
    icon: <ShoppingCart size={16} />,
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    bgColor: "bg-purple-50", borderColor: "border-purple-200", textColor: "text-purple-700",
    accentColor: "bg-purple-600", accessLabel: "Procurement Only",
  },
  {
    key: "payroll", label: "Payroll Management", shortLabel: "Payroll",
    icon: <Briefcase size={16} />,
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
    bgColor: "bg-orange-50", borderColor: "border-orange-200", textColor: "text-orange-700",
    accentColor: "bg-orange-500", accessLabel: "Payroll Only",
  },
  {
    key: "project", label: "Project Management", shortLabel: "Projects",
    icon: <FolderKanban size={16} />,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    bgColor: "bg-blue-50", borderColor: "border-blue-200", textColor: "text-blue-700",
    accentColor: "bg-blue-600", accessLabel: "Project Team",
  },
  {
    key: "legal", label: "Legal & Contracts", shortLabel: "Legal",
    icon: <Scale size={16} />,
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    bgColor: "bg-cyan-50", borderColor: "border-cyan-200", textColor: "text-cyan-700",
    accentColor: "bg-cyan-600", accessLabel: "Legal Only",
  },
  {
    key: "stakeholders", label: "CRM", shortLabel: "CRM",
    icon: <Handshake size={16} />,
    badgeColor: "bg-pink-50 text-pink-700 border-pink-200",
    bgColor: "bg-pink-50", borderColor: "border-pink-200", textColor: "text-pink-700",
    accentColor: "bg-pink-600", accessLabel: "Stakeholder Team",
  },
  {
    key: "mel", label: "Monitoring & Evaluation", shortLabel: "MEL",
    icon: <BarChart3 size={16} />,
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    bgColor: "bg-indigo-50", borderColor: "border-indigo-200", textColor: "text-indigo-700",
    accentColor: "bg-indigo-600", accessLabel: "M&E Team",
  },
];

// ── Document type config ──
interface DocTypeStyle {
  icon: React.ReactNode;
  bgFrom: string;
  bgTo: string;
  label: string;
}

function getDocTypeStyle(docType: string): DocTypeStyle {
  switch (docType) {
    case "receipt":
      return { icon: <Receipt size={28} className="text-white" />, bgFrom: "from-amber-400", bgTo: "to-amber-600", label: "Receipt" };
    case "contract":
      return { icon: <FileSignature size={28} className="text-white" />, bgFrom: "from-cyan-500", bgTo: "to-cyan-700", label: "Contract" };
    case "certificate":
      return { icon: <FileBadge size={28} className="text-white" />, bgFrom: "from-purple-500", bgTo: "to-purple-700", label: "Certificate" };
    case "appraisal":
      return { icon: <ClipboardCheck size={28} className="text-white" />, bgFrom: "from-green-500", bgTo: "to-green-700", label: "Appraisal" };
    case "approval":
      return { icon: <FileCheck size={28} className="text-white" />, bgFrom: "from-blue-500", bgTo: "to-blue-700", label: "Approval" };
    default:
      return { icon: <FileText size={28} className="text-white" />, bgFrom: "from-slate-400", bgTo: "to-slate-600", label: "Document" };
  }
}

function getFileExtension(name: string): { ext: string; color: string; icon: React.ReactNode } {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return { ext: "PDF", color: "bg-red-500", icon: <FileText size={10} className="text-white" /> };
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png"))
    return { ext: lower.endsWith(".jpg") || lower.endsWith(".jpeg") ? "JPG" : "PNG", color: "bg-emerald-500", icon: <FileImage size={10} className="text-white" /> };
  if (lower.endsWith(".xlsx") || lower.endsWith(".csv"))
    return { ext: "XLS", color: "bg-green-600", icon: <FileSpreadsheet size={10} className="text-white" /> };
  return { ext: "FILE", color: "bg-slate-500", icon: <FileText size={10} className="text-white" /> };
}

function getDocTypeIconSmall(docType: string) {
  switch (docType) {
    case "receipt": return <Receipt size={13} className="text-amber-500" />;
    case "contract": return <FileSignature size={13} className="text-cyan-600" />;
    case "certificate": return <FileBadge size={13} className="text-purple-600" />;
    case "appraisal": return <ClipboardCheck size={13} className="text-green-600" />;
    case "approval": return <FileCheck size={13} className="text-blue-600" />;
    default: return <FileText size={13} className="text-slate-400" />;
  }
}

// ── Mock documents ──
interface VaultDocument {
  id: string;
  name: string;
  module: ModuleKey;
  docType: string;
  filedBy: "System" | string;
  sourceRecord: string;
  sourceModule: string;
  sourceNavKey: string;
  dateFiled: string;
  dateValue: Date;
  size: string;
  accessLevel: string;
}

const vaultDocuments: VaultDocument[] = [
  // HR
  { id: "v1", name: "Employment-Contract-Yaw-Osei.pdf", module: "hr", docType: "contract", filedBy: "System", sourceRecord: "Employee Profile #EMP-003", sourceModule: "HR Management → Employees", sourceNavKey: "HR MANAGEMENT-Employees-Employee Profiles", dateFiled: "Feb 18, 2026", dateValue: new Date(2026, 1, 18), size: "1.2 MB", accessLevel: "HR Only" },
  { id: "v2", name: "Performance-Appraisal-Q4-Ama-Darko.pdf", module: "hr", docType: "appraisal", filedBy: "System", sourceRecord: "Performance Review #PR-0041", sourceModule: "HR Management → Performance Mgmt", sourceNavKey: "HR MANAGEMENT-Performance Mgmt", dateFiled: "Feb 14, 2026", dateValue: new Date(2026, 1, 14), size: "820 KB", accessLevel: "HR Only" },
  { id: "v3", name: "Medical-Certificate-Kwame-Asante.pdf", module: "hr", docType: "certificate", filedBy: "Kwame Asante", sourceRecord: "Leave Request #LR-2209", sourceModule: "Employee Self-Service → Leave", sourceNavKey: "EMPLOYEE SELF-SERVICE-My Requests-Leave Request", dateFiled: "Feb 12, 2026", dateValue: new Date(2026, 1, 12), size: "340 KB", accessLevel: "HR Only" },
  { id: "v4", name: "Onboarding-Checklist-Naomi-Ansah.pdf", module: "hr", docType: "approval", filedBy: "System", sourceRecord: "Employee Profile #EMP-024", sourceModule: "HR Management → Employees", sourceNavKey: "HR MANAGEMENT-Employees-Employee Profiles", dateFiled: "Feb 10, 2026", dateValue: new Date(2026, 1, 10), size: "510 KB", accessLevel: "HR Only" },
  { id: "v5", name: "Signed-NDA-Beatrice-Osei.pdf", module: "hr", docType: "contract", filedBy: "Ama Darko", sourceRecord: "Employee Profile #EMP-028", sourceModule: "HR Management → Employees", sourceNavKey: "HR MANAGEMENT-Employees-Employee Profiles", dateFiled: "Feb 06, 2026", dateValue: new Date(2026, 1, 6), size: "290 KB", accessLevel: "HR Only" },
  { id: "v20", name: "Sick-Note-Priscilla-Tetteh.pdf", module: "hr", docType: "certificate", filedBy: "Priscilla Tetteh", sourceRecord: "Leave Request #LR-2215", sourceModule: "Employee Self-Service → Leave", sourceNavKey: "EMPLOYEE SELF-SERVICE-My Requests-Leave Request", dateFiled: "Jan 28, 2026", dateValue: new Date(2026, 0, 28), size: "180 KB", accessLevel: "HR Only" },
  // Financials
  { id: "v6", name: "Expense-Receipt-Travel-Jan-2026.pdf", module: "financials", docType: "receipt", filedBy: "System", sourceRecord: "Expense Claim #EXP-0087", sourceModule: "Financials → Expenditure Mgmt", sourceNavKey: "FINANCIALS-Expenditure Management", dateFiled: "Feb 20, 2026", dateValue: new Date(2026, 1, 20), size: "2.1 MB", accessLevel: "Finance Only" },
  { id: "v7", name: "Bank-Statement-Jan-2026.pdf", module: "financials", docType: "document", filedBy: "Abena Owusu", sourceRecord: "Banking Mgmt → Reconciliation", sourceModule: "Financials → Banking Mgmt", sourceNavKey: "FINANCIALS-Banking Management", dateFiled: "Feb 15, 2026", dateValue: new Date(2026, 1, 15), size: "4.5 MB", accessLevel: "Finance Only" },
  { id: "v8", name: "Journal-Entry-Attachment-JE-0412.pdf", module: "financials", docType: "document", filedBy: "System", sourceRecord: "Journal Entry #JE-0412", sourceModule: "Financials → Journal Entries", sourceNavKey: "FINANCIALS-Journal Entries", dateFiled: "Feb 11, 2026", dateValue: new Date(2026, 1, 11), size: "680 KB", accessLevel: "Finance Only" },
  { id: "v9", name: "Expense-Receipt-Office-Supplies.jpg", module: "financials", docType: "receipt", filedBy: "System", sourceRecord: "Expense Claim #EXP-0092", sourceModule: "Financials → Expenditure Mgmt", sourceNavKey: "FINANCIALS-Expenditure Management", dateFiled: "Feb 08, 2026", dateValue: new Date(2026, 1, 8), size: "1.8 MB", accessLevel: "Finance Only" },
  { id: "v21", name: "Budget-Approval-Q1-2026.pdf", module: "financials", docType: "approval", filedBy: "System", sourceRecord: "Budget Approval #BA-0015", sourceModule: "Financials → Budget Approvals", sourceNavKey: "FINANCIALS-Approvals-Budget Approvals", dateFiled: "Jan 22, 2026", dateValue: new Date(2026, 0, 22), size: "1.4 MB", accessLevel: "Finance Only" },
  // Procurement
  { id: "v10", name: "Vendor-Tax-Certificate-ABC-Ltd.pdf", module: "procurement", docType: "certificate", filedBy: "System", sourceRecord: "Supplier #SUP-014", sourceModule: "Procurement → Vendors", sourceNavKey: "PROCUREMENT-Vendors", dateFiled: "Feb 19, 2026", dateValue: new Date(2026, 1, 19), size: "950 KB", accessLevel: "Procurement Only" },
  { id: "v11", name: "Purchase-Order-PO-2026-0034.pdf", module: "procurement", docType: "approval", filedBy: "System", sourceRecord: "Purchase Order #PO-2026-0034", sourceModule: "Procurement → Purchase Orders", sourceNavKey: "PROCUREMENT-Purchase Order Mgnt", dateFiled: "Feb 17, 2026", dateValue: new Date(2026, 1, 17), size: "1.4 MB", accessLevel: "Procurement Only" },
  { id: "v12", name: "Supplier-Contract-GlobalTech.pdf", module: "procurement", docType: "contract", filedBy: "Nana Yaw", sourceRecord: "Supplier #SUP-008", sourceModule: "Procurement → Vendors", sourceNavKey: "PROCUREMENT-Vendors", dateFiled: "Feb 13, 2026", dateValue: new Date(2026, 1, 13), size: "2.3 MB", accessLevel: "Procurement Only" },
  { id: "v13", name: "RFQ-Response-Vendor-XYZ.pdf", module: "procurement", docType: "document", filedBy: "System", sourceRecord: "RFQ #RFQ-0019", sourceModule: "Procurement → Sourcing", sourceNavKey: "PROCUREMENT-Sourcing", dateFiled: "Feb 05, 2026", dateValue: new Date(2026, 1, 5), size: "3.1 MB", accessLevel: "Procurement Only" },
  { id: "v22", name: "Invoice-Scan-INV-2026-0088.pdf", module: "procurement", docType: "receipt", filedBy: "System", sourceRecord: "Invoice #INV-2026-0088", sourceModule: "Procurement → Invoices", sourceNavKey: "PROCUREMENT-Invoices", dateFiled: "Jan 30, 2026", dateValue: new Date(2026, 0, 30), size: "760 KB", accessLevel: "Procurement Only" },
  // Payroll
  { id: "v14", name: "Payslip-Jan-2026-All-Staff.pdf", module: "payroll", docType: "document", filedBy: "System", sourceRecord: "Payroll Run #PAY-2026-01", sourceModule: "Payroll Mgmt → Payroll", sourceNavKey: "PAYROLL MANAGEMENT-Payroll", dateFiled: "Feb 01, 2026", dateValue: new Date(2026, 1, 1), size: "8.2 MB", accessLevel: "Payroll Only" },
  { id: "v15", name: "Advance-Approval-Kofi-Boateng.pdf", module: "payroll", docType: "approval", filedBy: "System", sourceRecord: "Advance Request #ADV-0056", sourceModule: "Payroll Mgmt → Advance", sourceNavKey: "PAYROLL MANAGEMENT-Advance", dateFiled: "Feb 09, 2026", dateValue: new Date(2026, 1, 9), size: "410 KB", accessLevel: "Payroll Only" },
  { id: "v23", name: "Tax-Deduction-Summary-Jan-2026.pdf", module: "payroll", docType: "document", filedBy: "System", sourceRecord: "Deductions #DED-2026-01", sourceModule: "Payroll Mgmt → Deductions", sourceNavKey: "PAYROLL MANAGEMENT-Deductions", dateFiled: "Jan 31, 2026", dateValue: new Date(2026, 0, 31), size: "520 KB", accessLevel: "Payroll Only" },
  // Project
  { id: "v16", name: "Project-Charter-Clean-Water-Initiative.pdf", module: "project", docType: "approval", filedBy: "System", sourceRecord: "Project #PRJ-007", sourceModule: "Project Mgmt → Projects", sourceNavKey: "PROJECT MANAGEMENT-Projects", dateFiled: "Feb 16, 2026", dateValue: new Date(2026, 1, 16), size: "3.6 MB", accessLevel: "Project Team" },
  { id: "v17", name: "Milestone-Signoff-Phase2-Education.pdf", module: "project", docType: "approval", filedBy: "System", sourceRecord: "Project #PRJ-003 → Milestone 2", sourceModule: "Project Mgmt → Projects", sourceNavKey: "PROJECT MANAGEMENT-Projects", dateFiled: "Feb 07, 2026", dateValue: new Date(2026, 1, 7), size: "1.1 MB", accessLevel: "Project Team" },
  { id: "v24", name: "Status-Report-Jan-2026-PRJ-003.pdf", module: "project", docType: "document", filedBy: "Kofi Mensah", sourceRecord: "Project #PRJ-003 → Status Report", sourceModule: "Project Mgmt → Reports", sourceNavKey: "PROJECT MANAGEMENT-Reports-Project Status Report", dateFiled: "Jan 25, 2026", dateValue: new Date(2026, 0, 25), size: "2.4 MB", accessLevel: "Project Team" },
  // Legal
  { id: "v18", name: "Signed-MoU-Partner-NGO.pdf", module: "legal", docType: "contract", filedBy: "Mercy Adjei", sourceRecord: "Contract #CTR-0023", sourceModule: "Legal & Contracts → Repository", sourceNavKey: "LEGAL & CONTRACTS-Contract Repository", dateFiled: "Feb 21, 2026", dateValue: new Date(2026, 1, 21), size: "2.8 MB", accessLevel: "Legal Only" },
  { id: "v19", name: "Compliance-Audit-Report-2025.pdf", module: "legal", docType: "document", filedBy: "Richard Antwi", sourceRecord: "Contract #CTR-0018", sourceModule: "Legal & Contracts → Repository", sourceNavKey: "LEGAL & CONTRACTS-Contract Repository", dateFiled: "Feb 04, 2026", dateValue: new Date(2026, 1, 4), size: "5.4 MB", accessLevel: "Legal Only" },
  { id: "v25", name: "NDA-Signed-Vendor-TechPlus.pdf", module: "legal", docType: "contract", filedBy: "System", sourceRecord: "Contract #CTR-0025", sourceModule: "Legal & Contracts → Repository", sourceNavKey: "LEGAL & CONTRACTS-Contract Repository", dateFiled: "Jan 20, 2026", dateValue: new Date(2026, 0, 20), size: "340 KB", accessLevel: "Legal Only" },
  // CRM
  { id: "v26", name: "Donor-Agreement-USAID-2026.pdf", module: "stakeholders", docType: "contract", filedBy: "System", sourceRecord: "Grant #GRT-0012", sourceModule: "CRM → Grant Pipeline", sourceNavKey: "CRM-Grant Management-Grant Pipeline", dateFiled: "Feb 22, 2026", dateValue: new Date(2026, 1, 22), size: "3.2 MB", accessLevel: "Stakeholder Team" },
  { id: "v27", name: "Stakeholder-Engagement-Report-Q4.pdf", module: "stakeholders", docType: "document", filedBy: "Mercy Adjei", sourceRecord: "Campaign #CMP-0045", sourceModule: "CRM → Advocacy & Impact Hub", sourceNavKey: "CRM-Advocacy & Impact Hub", dateFiled: "Feb 19, 2026", dateValue: new Date(2026, 1, 19), size: "1.8 MB", accessLevel: "Stakeholder Team" },
  { id: "v28", name: "Donor-Report-World-Bank-Jan-2026.pdf", module: "stakeholders", docType: "approval", filedBy: "System", sourceRecord: "Donor Report #DR-0031", sourceModule: "CRM → Reporting & Analytics", sourceNavKey: "CRM-Reporting & Analytics-Donor Reports", dateFiled: "Feb 14, 2026", dateValue: new Date(2026, 1, 14), size: "2.6 MB", accessLevel: "Stakeholder Team" },
  { id: "v29", name: "Grant-Compliance-Checklist-EU-Fund.pdf", module: "stakeholders", docType: "approval", filedBy: "Nana Yaw", sourceRecord: "Grant #GRT-0009", sourceModule: "CRM → Grant Compliance", sourceNavKey: "CRM-Grant Management-Grant Compliance", dateFiled: "Feb 03, 2026", dateValue: new Date(2026, 1, 3), size: "920 KB", accessLevel: "Stakeholder Team" },
  { id: "v30", name: "Contact-Directory-Export-Feb-2026.xlsx", module: "stakeholders", docType: "document", filedBy: "System", sourceRecord: "Contact Directory Export", sourceModule: "CRM → Contact Management", sourceNavKey: "CRM-Contact Management", dateFiled: "Jan 27, 2026", dateValue: new Date(2026, 0, 27), size: "1.1 MB", accessLevel: "Stakeholder Team" },
  // Monitoring & Evaluation
  { id: "v31", name: "MEL-Framework-Clean-Water-PRJ-007.pdf", module: "mel", docType: "document", filedBy: "System", sourceRecord: "Framework #MEL-F-003", sourceModule: "Monitoring & Evaluation → MEL Frameworks", sourceNavKey: "MONITORING & EVALUATION-MEL Frameworks", dateFiled: "Feb 21, 2026", dateValue: new Date(2026, 1, 21), size: "4.1 MB", accessLevel: "M&E Team" },
  { id: "v32", name: "Performance-Indicator-Report-Q4-2025.pdf", module: "mel", docType: "appraisal", filedBy: "System", sourceRecord: "Indicator Set #KPI-0018", sourceModule: "Monitoring & Evaluation → Performance Indicators", sourceNavKey: "MONITORING & EVALUATION-Performance Indicators", dateFiled: "Feb 16, 2026", dateValue: new Date(2026, 1, 16), size: "2.9 MB", accessLevel: "M&E Team" },
  { id: "v33", name: "Baseline-Survey-Education-PRJ-003.pdf", module: "mel", docType: "document", filedBy: "Kofi Mensah", sourceRecord: "Data Collection #DC-0027", sourceModule: "Monitoring & Evaluation → Data Collection", sourceNavKey: "MONITORING & EVALUATION-Data Collection", dateFiled: "Feb 10, 2026", dateValue: new Date(2026, 1, 10), size: "5.7 MB", accessLevel: "M&E Team" },
  { id: "v34", name: "Impact-Assessment-Midterm-2025.pdf", module: "mel", docType: "appraisal", filedBy: "System", sourceRecord: "Assessment #IA-0014", sourceModule: "Monitoring & Evaluation → Dashboard", sourceNavKey: "MONITORING & EVALUATION-Dashboard", dateFiled: "Feb 02, 2026", dateValue: new Date(2026, 1, 2), size: "3.4 MB", accessLevel: "M&E Team" },
  { id: "v35", name: "Data-Collection-Template-Field-Survey.xlsx", module: "mel", docType: "document", filedBy: "System", sourceRecord: "Template #DCT-0008", sourceModule: "Monitoring & Evaluation → Data Collection", sourceNavKey: "MONITORING & EVALUATION-Data Collection", dateFiled: "Jan 24, 2026", dateValue: new Date(2026, 0, 24), size: "680 KB", accessLevel: "M&E Team" },
];

// ── Stats ──
const totalDocuments = vaultDocuments.length;
const autoFiledCount = vaultDocuments.filter((d) => d.filedBy === "System").length;
const autoFiledPercent = Math.round((autoFiledCount / totalDocuments) * 100);

// ── Date range presets ──
type DatePreset = "all" | "today" | "7d" | "30d" | "90d" | "custom";

function getPresetRange(preset: DatePreset): { start: Date | null; end: Date | null } {
  const today = new Date(2026, 1, 23);
  today.setHours(23, 59, 59, 999);
  switch (preset) {
    case "today": { const s = new Date(today); s.setHours(0, 0, 0, 0); return { start: s, end: today }; }
    case "7d": { const s = new Date(today); s.setDate(s.getDate() - 7); s.setHours(0, 0, 0, 0); return { start: s, end: today }; }
    case "30d": { const s = new Date(today); s.setDate(s.getDate() - 30); s.setHours(0, 0, 0, 0); return { start: s, end: today }; }
    case "90d": { const s = new Date(today); s.setDate(s.getDate() - 90); s.setHours(0, 0, 0, 0); return { start: s, end: today }; }
    default: return { start: null, end: null };
  }
}

const presetLabels: Record<DatePreset, string> = {
  all: "All Time", today: "Today", "7d": "Last 7 Days", "30d": "Last 30 Days", "90d": "Last 90 Days", custom: "Custom Range",
};

// ── Simulated download ──
function downloadDocument(doc: VaultDocument) {
  const content = `
────────────────────────────────────────────
  DOCUMENT VAULT — SIMULATED DOWNLOAD
────────────────────────────────────────────

  Document:     ${doc.name}
  Module:       ${modules.find(m => m.key === doc.module)?.label}
  Source:       ${doc.sourceRecord}
  Source Path:  ${doc.sourceModule}
  Filed By:     ${doc.filedBy === "System" ? "Auto-filed by System" : doc.filedBy}
  Date Filed:   ${doc.dateFiled}
  File Size:    ${doc.size}
  Access Level: ${doc.accessLevel}

────────────────────────────────────────────
  This is a simulated document download.
  In production, the actual file would be
  retrieved from secure storage.
────────────────────────────────────────────
`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = doc.name.replace(/\.(pdf|jpg|png)$/i, ".txt");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Props ──
interface DocumentVaultProps {
  onNavigate?: (navKey: string) => void;
}

export function DocumentVault({ onNavigate }: DocumentVaultProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ModuleKey>(modules[0].key);
  const [filterFiled, setFilterFiled] = useState<"all" | "system" | "manual">("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null);
  const [viewerDoc, setViewerDoc] = useState<VaultDocument | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Date range state
  const [datePreset, setDatePreset] = useState<DatePreset>("all");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const dateRef = useRef<HTMLDivElement>(null);

  // Compute date range
  const dateRange = datePreset === "custom"
    ? { start: customStart ? new Date(customStart + "T00:00:00") : null, end: customEnd ? new Date(customEnd + "T23:59:59") : null }
    : getPresetRange(datePreset);

  // Filtering
  const filtered = vaultDocuments.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || doc.name.toLowerCase().includes(q) || doc.sourceRecord.toLowerCase().includes(q) || doc.sourceModule.toLowerCase().includes(q);
    const matchModule = doc.module === activeTab;
    const matchFiled = filterFiled === "all" || (filterFiled === "system" && doc.filedBy === "System") || (filterFiled === "manual" && doc.filedBy !== "System");
    let matchDate = true;
    if (dateRange.start) matchDate = matchDate && doc.dateValue >= dateRange.start;
    if (dateRange.end) matchDate = matchDate && doc.dateValue <= dateRange.end;
    return matchSearch && matchModule && matchFiled && matchDate;
  }).sort((a, b) => b.dateValue.getTime() - a.dateValue.getTime());

  const hasActiveFilters = filterFiled !== "all" || searchQuery || datePreset !== "all";

  // Counts per module (pre-filter by search/date/filed, not by tab)
  const baseFiltered = vaultDocuments.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || doc.name.toLowerCase().includes(q) || doc.sourceRecord.toLowerCase().includes(q) || doc.sourceModule.toLowerCase().includes(q);
    const matchFiled = filterFiled === "all" || (filterFiled === "system" && doc.filedBy === "System") || (filterFiled === "manual" && doc.filedBy !== "System");
    let matchDate = true;
    if (dateRange.start) matchDate = matchDate && doc.dateValue >= dateRange.start;
    if (dateRange.end) matchDate = matchDate && doc.dateValue <= dateRange.end;
    return matchSearch && matchFiled && matchDate;
  });
  const tabCounts: Record<string, number> = { all: baseFiltered.length };
  modules.forEach(m => { tabCounts[m.key] = baseFiltered.filter(d => d.module === m.key).length; });

  // Handle download with toast
  const handleDownload = (doc: VaultDocument) => {
    downloadDocument(doc);
    setDownloadToast(doc.name);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  // Navigate to source
  const navigateToSource = (doc: VaultDocument) => {
    if (onNavigate && doc.sourceNavKey) onNavigate(doc.sourceNavKey);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">Document Vault</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] border border-blue-200">
            <Shield size={12} />
            Access-Restricted
          </span>
        </div>
        {/* Stats inline */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="text-slate-900">{totalDocuments}</span> records
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Bot size={11} className="text-green-600" />
            <span className="text-slate-900">{autoFiledPercent}%</span> auto-filed
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Lock size={11} className="text-amber-600" />
            <span className="text-slate-900">{modules.length}</span> restricted sections
          </div>
        </div>
      </div>

      {/* Module Tabs */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1 overflow-x-auto">
          {modules.map((mod) => (
            <button
              key={mod.key}
              onClick={() => setActiveTab(mod.key)}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[120px] flex items-center justify-center gap-1.5 ${
                activeTab === mod.key
                  ? "bg-purple-700 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {mod.shortLabel}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === mod.key ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"}`}>
                {tabCounts[mod.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
        {/* Search */}
        <div className="flex items-center gap-3 px-3.5 py-2 border border-slate-200 rounded-lg bg-white w-72">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search documents, source records…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-[12px] text-slate-900 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X size={13} className="text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Date Range Filter */}
          <div className="relative" ref={dateRef}>
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-[12px] transition-colors ${
                datePreset !== "all"
                  ? "border-blue-300 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Calendar size={13} />
              {presetLabels[datePreset]}
              <ChevronDown size={11} />
            </button>
            {showDateDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDateDropdown(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-3">
                  <p className="text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider">Filing Period</p>
                  <div className="flex flex-col gap-0.5 mb-2">
                    {(["all", "today", "7d", "30d", "90d", "custom"] as DatePreset[]).map((preset) => (
                      <button
                        key={preset}
                        onClick={() => { setDatePreset(preset); if (preset !== "custom") setShowDateDropdown(false); }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-[12px] transition-colors flex items-center justify-between ${
                          datePreset === preset ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span>{presetLabels[preset]}</span>
                        {datePreset === preset && <CheckCircle2 size={13} className="text-blue-600" />}
                      </button>
                    ))}
                  </div>
                  {datePreset === "custom" && (
                    <div className="border-t border-slate-100 pt-2.5 flex flex-col gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5 block">From</label>
                        <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] text-slate-700 outline-none focus:border-blue-400" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5 block">To</label>
                        <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] text-slate-700 outline-none focus:border-blue-400" />
                      </div>
                      <button onClick={() => setShowDateDropdown(false)} className="w-full py-1.5 bg-blue-700 text-white rounded-lg text-[12px] hover:bg-blue-800 transition-colors">
                        Apply Range
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Filed-by Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-[12px] transition-colors ${
                filterFiled !== "all"
                  ? "border-purple-300 bg-purple-50 text-purple-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter size={13} />
              {filterFiled === "all" ? "Filed By" : filterFiled === "system" ? "Auto-filed" : "Manual"}
              <ChevronDown size={11} />
            </button>
            {showFilterDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(false)} />
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-2">
                  {(["all", "system", "manual"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setFilterFiled(opt); setShowFilterDropdown(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-[12px] transition-colors flex items-center justify-between ${
                        filterFiled === opt ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {opt === "all" ? "All" : opt === "system" ? "Auto-filed" : "Manual Upload"}
                      {filterFiled === opt && <CheckCircle2 size={13} className="text-purple-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Export */}
          <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={13} />
            Export
          </button>
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="px-6 py-1.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 text-[11px] shrink-0">
          <span className="text-slate-500">
            {filtered.length} of {vaultDocuments.filter(d => d.module === activeTab).length} records
          </span>
          <span className="text-slate-300">|</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-600">
              "{searchQuery}"
              <button onClick={() => setSearchQuery("")}><X size={10} className="text-slate-400 hover:text-slate-600" /></button>
            </span>
          )}
          {filterFiled !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-600">
              {filterFiled === "system" ? "Auto-filed" : "Manual"}
              <button onClick={() => setFilterFiled("all")}><X size={10} className="text-slate-400 hover:text-slate-600" /></button>
            </span>
          )}
          {datePreset !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-600">
              {datePreset === "custom" ? `${customStart || "…"} → ${customEnd || "…"}` : presetLabels[datePreset]}
              <button onClick={() => { setDatePreset("all"); setCustomStart(""); setCustomEnd(""); }}><X size={10} className="text-slate-400 hover:text-slate-600" /></button>
            </span>
          )}
          <button
            onClick={() => { setSearchQuery(""); setFilterFiled("all"); setDatePreset("all"); setCustomStart(""); setCustomEnd(""); }}
            className="ml-auto text-purple-700 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Document Grid */}
      <div className="flex-1 overflow-auto p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileText size={40} className="text-slate-200 mb-3" />
            <p className="text-sm text-slate-400 mb-1">No documents found</p>
            <p className="text-[11px] text-slate-400 mb-3">Try adjusting your search or filters.</p>
            {hasActiveFilters && (
              <button
                onClick={() => { setSearchQuery(""); setFilterFiled("all"); setDatePreset("all"); setCustomStart(""); setCustomEnd(""); }}
                className="text-[12px] text-purple-700 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((doc) => {
              const mod = modules.find((m) => m.key === doc.module)!;
              const typeStyle = getDocTypeStyle(doc.docType);
              const ext = getFileExtension(doc.name);
              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all group cursor-pointer"
                  onClick={() => setPreviewDoc(doc)}
                >
                  {/* Thumbnail */}
                  <div className={`relative h-[120px] bg-gradient-to-br ${typeStyle.bgFrom} ${typeStyle.bgTo} flex items-center justify-center`}>
                    {/* Document type icon */}
                    <div className="opacity-90">
                      {typeStyle.icon}
                    </div>
                    {/* Simulated page lines */}
                    <div className="absolute inset-4 flex flex-col justify-end gap-1 opacity-10">
                      <div className="h-[2px] bg-white rounded w-3/4" />
                      <div className="h-[2px] bg-white rounded w-full" />
                      <div className="h-[2px] bg-white rounded w-5/6" />
                      <div className="h-[2px] bg-white rounded w-2/3" />
                    </div>
                    {/* File extension badge */}
                    <div className={`absolute top-2.5 right-2.5 ${ext.color} px-1.5 py-0.5 rounded text-[9px] text-white flex items-center gap-0.5`}>
                      {ext.icon}
                      {ext.ext}
                    </div>
                    {/* Auto-filed badge */}
                    {doc.filedBy === "System" && (
                      <div className="absolute top-2.5 left-2.5 bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] text-white flex items-center gap-0.5">
                        <Bot size={9} />
                        Auto
                      </div>
                    )}
                    {/* Hover overlay with actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => { e.stopPropagation(); setViewerDoc(doc); }}
                        className="p-2 bg-white rounded-lg shadow-md hover:bg-blue-50 transition-colors"
                        title="View"
                      >
                        <Eye size={15} className="text-blue-800" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownload(doc); }}
                        className="p-2 bg-white rounded-lg shadow-md hover:bg-slate-100 transition-colors"
                        title="Download"
                      >
                        <Download size={15} className="text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-[11px] text-slate-800 truncate mb-1.5 group-hover:text-purple-700 transition-colors" title={doc.name}>
                      {doc.name}
                    </p>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] border ${mod.badgeColor}`}>
                        {mod.shortLabel}
                      </span>
                      <span className="text-[10px] text-slate-400">{doc.size}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigateToSource(doc); }}
                      className="flex items-center gap-1 text-[10px] text-blue-700 hover:text-blue-900 hover:underline transition-colors truncate w-full"
                      title={`Go to ${doc.sourceModule}`}
                    >
                      <ArrowUpRight size={10} className="shrink-0" />
                      <span className="truncate">{doc.sourceRecord}</span>
                    </button>
                    <p className="text-[10px] text-slate-400 mt-1">{doc.dateFiled}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Document Viewer Modal ── */}
      {viewerDoc && (() => {
        const mod = modules.find((m) => m.key === viewerDoc.module)!;
        const typeStyle = getDocTypeStyle(viewerDoc.docType);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setViewerDoc(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[85vh] flex flex-col overflow-hidden">
              {/* Viewer Header */}
              <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${typeStyle.bgFrom} ${typeStyle.bgTo} flex items-center justify-center shrink-0`}>
                    {cloneElement(typeStyle.icon as ReactElement, { size: 16 })}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] text-slate-900 truncate">{viewerDoc.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] border ${mod.badgeColor}`}>{mod.label}</span>
                      <span className="text-[10px] text-slate-400">{viewerDoc.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleDownload(viewerDoc)} className="px-3 py-1.5 bg-purple-700 text-white rounded-lg text-[12px] hover:bg-purple-800 transition-colors flex items-center gap-1.5">
                    <Download size={12} />
                    Download
                  </button>
                  <button onClick={() => setViewerDoc(null)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                    <X size={16} className="text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Simulated Document Preview */}
              <div className="flex-1 overflow-auto bg-slate-100 p-6 flex justify-center">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 w-full max-w-[560px] p-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className={`w-24 h-6 bg-gradient-to-r ${typeStyle.bgFrom} ${typeStyle.bgTo} rounded mb-2`} />
                      <div className="w-16 h-2 bg-slate-200 rounded" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Document ID</p>
                      <p className="text-[11px] text-slate-700">{viewerDoc.id.toUpperCase()}-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-6 mb-6">
                    <h3 className="text-[13px] text-slate-900 mb-1">{viewerDoc.name}</h3>
                    <p className="text-[11px] text-slate-500 mb-4">Filed: {viewerDoc.dateFiled}</p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Module</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] border ${mod.badgeColor}`}>{mod.label}</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Access Level</p>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-700"><Lock size={10} className="text-slate-400" />{viewerDoc.accessLevel}</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Filed By</p>
                        {viewerDoc.filedBy === "System"
                          ? <span className="inline-flex items-center gap-1 text-[11px] text-green-700"><Bot size={10} />Auto-filed</span>
                          : <span className="text-[11px] text-slate-700">{viewerDoc.filedBy}</span>
                        }
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">File Size</p>
                        <span className="text-[11px] text-slate-700">{viewerDoc.size}</span>
                      </div>
                    </div>
                    <div className="mb-6">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Source Record</p>
                      <button onClick={() => { setViewerDoc(null); navigateToSource(viewerDoc); }} className="inline-flex items-center gap-1.5 text-[12px] text-blue-700 hover:text-blue-900 hover:underline transition-colors">
                        <ExternalLink size={12} />{viewerDoc.sourceRecord}
                      </button>
                      <p className="text-[10px] text-slate-400 mt-0.5">{viewerDoc.sourceModule}</p>
                    </div>
                  </div>
                  {/* Simulated body */}
                  <div className="space-y-2.5 mb-6">
                    {[...Array(8)].map((_, i) => (<div key={i}><div className="h-2 bg-slate-100 rounded" style={{ width: `${60 + Math.random() * 40}%` }} /></div>))}
                  </div>
                  <div className="space-y-2.5 mb-6">
                    {[...Array(5)].map((_, i) => (<div key={i}><div className="h-2 bg-slate-100 rounded" style={{ width: `${40 + Math.random() * 55}%` }} /></div>))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Detail Panel (slide-over) ── */}
      {previewDoc && (() => {
        const mod = modules.find((m) => m.key === previewDoc.module)!;
        const typeStyle = getDocTypeStyle(previewDoc.docType);
        return (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={() => setPreviewDoc(null)} />
            <div className="relative w-full max-w-md bg-white shadow-xl flex flex-col">
              {/* Drawer Header */}
              <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0">
                <h3 className="text-[13px] text-slate-900">Document Details</h3>
                <button onClick={() => setPreviewDoc(null)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                  <X size={16} className="text-slate-500" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-auto p-6">
                {/* Document thumbnail preview */}
                <div className={`relative h-[140px] rounded-xl bg-gradient-to-br ${typeStyle.bgFrom} ${typeStyle.bgTo} flex items-center justify-center mb-5`}>
                  <div className="opacity-80">{cloneElement(typeStyle.icon as ReactElement, { size: 40 })}</div>
                  <div className="absolute inset-5 flex flex-col justify-end gap-1 opacity-10">
                    <div className="h-[2px] bg-white rounded w-3/4" />
                    <div className="h-[2px] bg-white rounded w-full" />
                    <div className="h-[2px] bg-white rounded w-5/6" />
                  </div>
                  {(() => { const ext = getFileExtension(previewDoc.name); return (
                    <div className={`absolute top-3 right-3 ${ext.color} px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-0.5`}>
                      {ext.icon} {ext.ext}
                    </div>
                  ); })()}
                  {previewDoc.filedBy === "System" && (
                    <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-1">
                      <Bot size={10} /> Auto-filed
                    </div>
                  )}
                </div>

                {/* Document name */}
                <p className="text-[13px] text-slate-900 break-all mb-1">{previewDoc.name}</p>
                <p className="text-[11px] text-slate-400 mb-5">{previewDoc.size}</p>

                {/* Details Grid */}
                <div className="flex flex-col gap-3.5">
                  <DetailRow label="Module">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] border ${mod.badgeColor}`}>{mod.label}</span>
                  </DetailRow>
                  <DetailRow label="Access Level">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 border border-slate-200">
                      <Lock size={9} />{previewDoc.accessLevel}
                    </span>
                  </DetailRow>
                  <DetailRow label="Filed By">
                    {previewDoc.filedBy === "System"
                      ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-green-50 text-green-700 border border-green-200"><Bot size={10} />Auto-filed by System</span>
                      : <span className="text-[12px] text-slate-700">{previewDoc.filedBy}</span>
                    }
                  </DetailRow>
                  <DetailRow label="Date Filed">
                    <span className="text-[12px] text-slate-700">{previewDoc.dateFiled}</span>
                  </DetailRow>
                  <DetailRow label="Source Record">
                    <button
                      onClick={() => { setPreviewDoc(null); navigateToSource(previewDoc); }}
                      className="inline-flex items-center gap-1.5 text-[12px] text-blue-700 hover:text-blue-900 hover:underline transition-colors"
                    >
                      <ExternalLink size={12} />{previewDoc.sourceRecord}
                    </button>
                  </DetailRow>
                  <DetailRow label="Source Path">
                    <span className="text-[12px] text-slate-500">{previewDoc.sourceModule}</span>
                  </DetailRow>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-3.5 border-t border-slate-200 flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => handleDownload(previewDoc)}
                  className="flex-1 px-4 py-2.5 bg-purple-700 text-white rounded-lg text-[12px] hover:bg-purple-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={13} />
                  Download
                </button>
                <button
                  onClick={() => setViewerDoc(previewDoc)}
                  className="px-4 py-2.5 border border-slate-200 rounded-lg text-[12px] text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Eye size={13} />
                  View
                </button>
                <button
                  onClick={() => { setPreviewDoc(null); navigateToSource(previewDoc); }}
                  className="px-4 py-2.5 border border-slate-200 rounded-lg text-[12px] text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink size={13} />
                  Source
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Download Toast ── */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <CheckCircle2 size={16} className="text-green-400 shrink-0" />
          <div>
            <p className="text-[12px]">Download started</p>
            <p className="text-[10px] text-slate-400 truncate max-w-[240px]">{downloadToast}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
      {children}
    </div>
  );
}