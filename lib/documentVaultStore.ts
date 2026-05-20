// Shared Document Vault store — reactive singleton
// Documents uploaded to any department/project appear here.
// ProjectPlanning calls addProjectFolder() when a new project is created.

export type Department = "HR" | "Finance" | "Procurement" | "Payroll" | "Projects" | "Legal" | "MEL" | "CRM";

export type FileType = "PDF" | "DOCX" | "XLSX" | "PPTX" | "DOC" | "PNG" | "JPG";

export interface VaultDocument {
  id: string;
  name: string;
  fileType: FileType;
  size: string;
  uploadedBy: string;
  uploadedDate: string;
  projectId: string | null;   // null = stored in General folder
  projectName: string | null;
  department: Department;
  category: string;
  description?: string;
}

export interface ProjectFolder {
  id: string;
  name: string;
  createdDate: string;
  program?: string;
}

// Categories available per department
export const DEPT_CATEGORIES: Record<Department, string[]> = {
  HR: ["Employment Contract", "Job Description", "Performance Review", "Training Certificate", "Offer Letter", "Leave Policy", "HR Policy"],
  Finance: ["Budget Report", "Financial Statement", "Invoice", "Grant Agreement", "Audit Report", "Expense Report", "Bank Statement"],
  Procurement: ["RFQ Document", "Supplier Contract", "Purchase Order", "Evaluation Report", "Framework Agreement", "Tender Notice"],
  Payroll: ["Payroll Report", "Salary Schedule", "Deduction Summary", "Payroll Policy"],
  Projects: ["Project Charter", "Implementation Plan", "Progress Report", "M&E Framework", "Closure Report", "Inception Report", "Work Plan"],
  Legal: ["MOU", "Partnership Agreement", "Legal Opinion", "Compliance Certificate", "Retainer Agreement"],
  MEL: ["Baseline Survey", "Evaluation Report", "Learning Brief", "Data Collection Tool", "Impact Assessment"],
  CRM: ["Stakeholder Map", "Engagement Report", "Donor Brief", "Meeting Minutes", "Communication Plan"],
};

// Auto-generated from MOCK_PROJECTS in ProjectPlanning.tsx
const initialFolders: ProjectFolder[] = [
  { id: "p1", name: "West Africa Regional Integration Study",    createdDate: "Jan 15, 2025", program: "West Africa Economic Development Program" },
  { id: "p2", name: "Digital Economy Policy Brief Series",       createdDate: "Mar 01, 2024", program: "West Africa Economic Development Program" },
  { id: "p3", name: "Climate Finance Readiness Program",         createdDate: "Nov 01, 2025" },
  { id: "p4", name: "Sustainable Agriculture Development Initiative", createdDate: "Apr 10, 2025", program: "Sustainable Communities Initiative" },
  { id: "p5", name: "Renewable Energy Transition Framework",     createdDate: "Feb 05, 2025", program: "Sustainable Communities Initiative" },
  { id: "p6", name: "Healthcare System Strengthening Project",   createdDate: "Jun 01, 2025", program: "Youth & Social Development Program" },
  { id: "p7", name: "Youth Employment Skills Development",       createdDate: "May 15, 2025", program: "Youth & Social Development Program" },
  { id: "p8", name: "Urban Infrastructure Development Plan",     createdDate: "Feb 10, 2025" },
];

const initialDocuments: VaultDocument[] = [
  // ── HR ──────────────────────────────────────────────────────────
  { id: "d01", name: "Staff Deployment Plan.pdf",         fileType: "PDF",  size: "340 KB", uploadedBy: "Ama Darko",    uploadedDate: "Feb 10, 2026", projectId: "p1", projectName: "West Africa Regional Integration Study",        department: "HR",          category: "HR Policy" },
  { id: "d02", name: "Field Staff Contracts.pdf",         fileType: "PDF",  size: "510 KB", uploadedBy: "Ama Darko",    uploadedDate: "Apr 22, 2025", projectId: "p4", projectName: "Sustainable Agriculture Development Initiative",   department: "HR",          category: "Employment Contract" },
  { id: "d03", name: "Youth Programme Staff Roster.docx", fileType: "DOCX", size: "180 KB", uploadedBy: "Abena Owusu",  uploadedDate: "Jun 05, 2025", projectId: "p7", projectName: "Youth Employment Skills Development",             department: "HR",          category: "HR Policy" },
  { id: "d04", name: "Employee Handbook 2026.pdf",        fileType: "PDF",  size: "2.1 MB", uploadedBy: "Abena Owusu",  uploadedDate: "Jan 06, 2026", projectId: null, projectName: null,                                            department: "HR",          category: "HR Policy" },
  { id: "d05", name: "Leave Policy v3.pdf",               fileType: "PDF",  size: "410 KB", uploadedBy: "Abena Owusu",  uploadedDate: "Jan 08, 2026", projectId: null, projectName: null,                                            department: "HR",          category: "Leave Policy" },
  { id: "d06", name: "Performance Review Template.docx",  fileType: "DOCX", size: "220 KB", uploadedBy: "Ama Darko",    uploadedDate: "Mar 14, 2025", projectId: null, projectName: null,                                            department: "HR",          category: "Performance Review" },
  // ── Finance ─────────────────────────────────────────────────────
  { id: "d07", name: "Q1 Budget Report.xlsx",             fileType: "XLSX", size: "620 KB", uploadedBy: "Kofi Boateng", uploadedDate: "Apr 05, 2025", projectId: "p1", projectName: "West Africa Regional Integration Study",        department: "Finance",     category: "Budget Report" },
  { id: "d08", name: "Grant Agreement – AfDB.pdf",        fileType: "PDF",  size: "1.4 MB", uploadedBy: "Kofi Boateng", uploadedDate: "Apr 15, 2025", projectId: "p4", projectName: "Sustainable Agriculture Development Initiative",   department: "Finance",     category: "Grant Agreement" },
  { id: "d09", name: "Financial Projections FY2026.xlsx", fileType: "XLSX", size: "490 KB", uploadedBy: "Mercy Adjei",  uploadedDate: "Feb 18, 2026", projectId: "p5", projectName: "Renewable Energy Transition Framework",          department: "Finance",     category: "Budget Report" },
  { id: "d10", name: "Audit Report 2025.pdf",             fileType: "PDF",  size: "3.2 MB", uploadedBy: "Kofi Boateng", uploadedDate: "Jan 20, 2026", projectId: null, projectName: null,                                            department: "Finance",     category: "Audit Report" },
  { id: "d11", name: "Annual Financial Statements.pdf",   fileType: "PDF",  size: "2.7 MB", uploadedBy: "Mercy Adjei",  uploadedDate: "Feb 01, 2026", projectId: null, projectName: null,                                            department: "Finance",     category: "Financial Statement" },
  // ── Procurement ─────────────────────────────────────────────────
  { id: "d12", name: "RFQ – Research Services.pdf",       fileType: "PDF",  size: "560 KB", uploadedBy: "Richard Antwi", uploadedDate: "May 10, 2025", projectId: "p1", projectName: "West Africa Regional Integration Study",        department: "Procurement", category: "RFQ Document" },
  { id: "d13", name: "Supplier Framework Agreement.pdf",  fileType: "PDF",  size: "870 KB", uploadedBy: "Richard Antwi", uploadedDate: "May 20, 2025", projectId: "p4", projectName: "Sustainable Agriculture Development Initiative",   department: "Procurement", category: "Framework Agreement" },
  { id: "d14", name: "Skills Training Vendor Contracts.pdf", fileType: "PDF", size: "410 KB", uploadedBy: "Nana Yaw",   uploadedDate: "Jun 12, 2025", projectId: "p7", projectName: "Youth Employment Skills Development",             department: "Procurement", category: "Supplier Contract" },
  { id: "d15", name: "Procurement Policy 2026.pdf",       fileType: "PDF",  size: "690 KB", uploadedBy: "Richard Antwi", uploadedDate: "Jan 14, 2026", projectId: null, projectName: null,                                            department: "Procurement", category: "Framework Agreement" },
  // ── Projects ────────────────────────────────────────────────────
  { id: "d16", name: "Project Charter – WARIS.pdf",       fileType: "PDF",  size: "780 KB", uploadedBy: "Yaw Osei",     uploadedDate: "Jan 20, 2025", projectId: "p1", projectName: "West Africa Regional Integration Study",        department: "Projects",    category: "Project Charter" },
  { id: "d17", name: "SADI Implementation Plan.docx",     fileType: "DOCX", size: "430 KB", uploadedBy: "Nana Yaw",     uploadedDate: "Apr 20, 2025", projectId: "p4", projectName: "Sustainable Agriculture Development Initiative",   department: "Projects",    category: "Implementation Plan" },
  { id: "d18", name: "RETF Progress Report Q2.pdf",       fileType: "PDF",  size: "540 KB", uploadedBy: "Kwaku Anane",  uploadedDate: "Jul 05, 2025", projectId: "p5", projectName: "Renewable Energy Transition Framework",          department: "Projects",    category: "Progress Report" },
  { id: "d19", name: "Urban Infrastructure Concept Note.pdf", fileType: "PDF", size: "920 KB", uploadedBy: "Yaw Osei", uploadedDate: "Mar 01, 2025", projectId: "p8", projectName: "Urban Infrastructure Development Plan",           department: "Projects",    category: "Inception Report" },
  // ── Legal ───────────────────────────────────────────────────────
  { id: "d20", name: "MOU – ECOWAS Partnership.pdf",      fileType: "PDF",  size: "650 KB", uploadedBy: "Kwame Asante", uploadedDate: "Feb 25, 2025", projectId: "p1", projectName: "West Africa Regional Integration Study",        department: "Legal",       category: "MOU" },
  { id: "d21", name: "Partnership Agreement – GIZ.pdf",   fileType: "PDF",  size: "1.1 MB", uploadedBy: "Kwame Asante", uploadedDate: "Mar 10, 2025", projectId: "p5", projectName: "Renewable Energy Transition Framework",          department: "Legal",       category: "Partnership Agreement" },
  { id: "d22", name: "ACET Legal Framework 2026.pdf",     fileType: "PDF",  size: "890 KB", uploadedBy: "Kwame Asante", uploadedDate: "Jan 30, 2026", projectId: null, projectName: null,                                            department: "Legal",       category: "Compliance Certificate" },
  // ── MEL ─────────────────────────────────────────────────────────
  { id: "d23", name: "Baseline Survey Report – WARIS.pdf", fileType: "PDF", size: "2.4 MB", uploadedBy: "Ama Serwaa",  uploadedDate: "Mar 05, 2025", projectId: "p1", projectName: "West Africa Regional Integration Study",        department: "MEL",         category: "Baseline Survey" },
  { id: "d24", name: "SADI M&E Framework.pdf",            fileType: "PDF",  size: "720 KB", uploadedBy: "Ama Serwaa",  uploadedDate: "May 01, 2025", projectId: "p4", projectName: "Sustainable Agriculture Development Initiative",   department: "MEL",         category: "M&E Framework" },
  { id: "d25", name: "MEL Handbook 2026.pdf",             fileType: "PDF",  size: "1.8 MB", uploadedBy: "Ama Serwaa",  uploadedDate: "Jan 22, 2026", projectId: null, projectName: null,                                            department: "MEL",         category: "Data Collection Tool" },
  // ── Payroll ─────────────────────────────────────────────────────
  { id: "d26", name: "Payroll Report January 2026.xlsx",  fileType: "XLSX", size: "380 KB", uploadedBy: "Mercy Adjei",  uploadedDate: "Feb 05, 2026", projectId: null, projectName: null,                                            department: "Payroll",     category: "Payroll Report" },
  // ── CRM ─────────────────────────────────────────────────────────
  { id: "d27", name: "Stakeholder Map – West Africa.pdf", fileType: "PDF",  size: "1.3 MB", uploadedBy: "Kofi Mensah",  uploadedDate: "Feb 28, 2025", projectId: "p1", projectName: "West Africa Regional Integration Study",        department: "CRM",         category: "Stakeholder Map" },
  { id: "d28", name: "Donor Engagement Strategy 2026.pdf", fileType: "PDF", size: "670 KB", uploadedBy: "Kofi Mensah",  uploadedDate: "Jan 25, 2026", projectId: null, projectName: null,                                            department: "CRM",         category: "Communication Plan" },
];

// ── Store singleton ──────────────────────────────────────────────

type Listener = () => void;
let _folders: ProjectFolder[] = [...initialFolders];
let _documents: VaultDocument[] = [...initialDocuments];
let _listeners: Listener[] = [];

function _notify() { _listeners.forEach((l) => l()); }

export function subscribe(cb: Listener): () => void {
  _listeners.push(cb);
  return () => { _listeners = _listeners.filter((l) => l !== cb); };
}

export function getProjectFolders(): ProjectFolder[] {
  return [..._folders];
}

export function getVaultDocuments(): VaultDocument[] {
  return [..._documents];
}

export function addProjectFolder(folder: ProjectFolder): void {
  if (_folders.find((f) => f.id === folder.id)) return; // already exists
  _folders = [..._folders, folder];
  _notify();
}

export function addVaultDocument(doc: VaultDocument): void {
  _documents = [doc, ..._documents];
  _notify();
}
