// Shared Document Vault store — reactive singleton
// Documents uploaded to any department/project appear here.
// ProjectPlanning calls addProjectFolder() when a new project is created.

export type Department = "HR" | "Finance" | "Procurement" | "Payroll" | "Projects" | "Legal" | "MEL" | "CRM" | "Admin";

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
  version?: string;           // e.g. "v1.0", "v2.0"
}

export interface ProjectFolder {
  id: string;
  name: string;
  createdDate: string;
  program?: string;
  origin?: "auto" | "manual";   // auto = created when project was created, manual = user-created
}

// Custom department folders (user-created)
export interface DeptFolder {
  id: string;
  name: string;
  department: Department;
  createdDate: string;
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
  Admin: ["Policy Document", "Meeting Minutes", "Internal Memo", "Report", "Presentation", "Template", "Other"],
};

// Auto-generated from MOCK_PROJECTS in ProjectPlanning.tsx
const initialFolders: ProjectFolder[] = [
  { id: "p1", name: "West Africa Regional Integration Study",    createdDate: "Jan 15, 2025", program: "West Africa Economic Development Program", origin: "auto" },
  { id: "p2", name: "Digital Economy Policy Brief Series",       createdDate: "Mar 01, 2024", program: "West Africa Economic Development Program", origin: "auto" },
  { id: "p3", name: "Climate Finance Readiness Program",         createdDate: "Nov 01, 2025", origin: "auto" },
  { id: "p4", name: "Sustainable Agriculture Development Initiative", createdDate: "Apr 10, 2025", program: "Sustainable Communities Initiative", origin: "auto" },
  { id: "p5", name: "Renewable Energy Transition Framework",     createdDate: "Feb 05, 2025", program: "Sustainable Communities Initiative", origin: "auto" },
  { id: "p6", name: "Healthcare System Strengthening Project",   createdDate: "Jun 01, 2025", program: "Youth & Social Development Program", origin: "auto" },
  { id: "p7", name: "Youth Employment Skills Development",       createdDate: "May 15, 2025", program: "Youth & Social Development Program", origin: "auto" },
  { id: "p8", name: "Urban Infrastructure Development Plan",     createdDate: "Feb 10, 2025", origin: "auto" },
];

const initialDeptFolders: DeptFolder[] = [
  // ── HR ──
  { id: "hf1", name: "Employee Contracts",      department: "HR", createdDate: "Jan 02, 2026" },
  { id: "hf2", name: "Training Certificates",   department: "HR", createdDate: "Jan 02, 2026" },
  { id: "hf3", name: "Offer Letters",           department: "HR", createdDate: "Jan 02, 2026" },
  { id: "hf4", name: "Performance Reviews",     department: "HR", createdDate: "Jan 05, 2026" },
  { id: "hf5", name: "HR Policies",             department: "HR", createdDate: "Jan 05, 2026" },
  { id: "hf6", name: "Leave Records",           department: "HR", createdDate: "Jan 08, 2026" },
  { id: "hf7", name: "Job Descriptions",        department: "HR", createdDate: "Jan 10, 2026" },
  { id: "hf8", name: "Onboarding Documents",    department: "HR", createdDate: "Feb 01, 2026" },
  // ── CRM ──
  { id: "cf1", name: "Content & Collateral", department: "CRM", createdDate: "Jan 05, 2026" },
  { id: "cf2", name: "Proposal Library",     department: "CRM", createdDate: "Jan 05, 2026" },
  { id: "cf3", name: "Contract Repository", department: "CRM", createdDate: "Jan 05, 2026" },
  { id: "cf4", name: "Report Archive",      department: "CRM", createdDate: "Jan 05, 2026" },
  { id: "cf5", name: "Templates & Tools",   department: "CRM", createdDate: "Jan 05, 2026" },
  // ── Admin ──
  { id: "df1", name: "Board Documents",     department: "Admin", createdDate: "Jan 05, 2026" },
  { id: "df2", name: "Internal Policies",   department: "Admin", createdDate: "Jan 05, 2026" },
  { id: "df3", name: "Office Management",   department: "Admin", createdDate: "Jan 10, 2026" },
  { id: "df4", name: "Staff Communications", department: "Admin", createdDate: "Feb 01, 2026" },
  { id: "df5", name: "IT & Systems",        department: "Admin", createdDate: "Feb 15, 2026" },
];

const initialDocuments: VaultDocument[] = [
  // ── HR ──────────────────────────────────────────────────────────
  { id: "d01", name: "Staff Deployment Plan.pdf",         fileType: "PDF",  size: "340 KB", uploadedBy: "Ama Darko",    uploadedDate: "Feb 10, 2026", projectId: "p1",  projectName: "West Africa Regional Integration Study",        department: "HR",          category: "HR Policy" },
  { id: "d02", name: "Field Staff Contracts.pdf",         fileType: "PDF",  size: "510 KB", uploadedBy: "Ama Darko",    uploadedDate: "Apr 22, 2025", projectId: "hf1", projectName: "Employee Contracts",                             department: "HR",          category: "Employment Contract" },
  { id: "d03", name: "Youth Programme Staff Roster.docx", fileType: "DOCX", size: "180 KB", uploadedBy: "Abena Owusu",  uploadedDate: "Jun 05, 2025", projectId: "p7",  projectName: "Youth Employment Skills Development",             department: "HR",          category: "HR Policy" },
  { id: "d04", name: "Employee Handbook 2026.pdf",        fileType: "PDF",  size: "2.1 MB", uploadedBy: "Abena Owusu",  uploadedDate: "Jan 06, 2026", projectId: "hf5", projectName: "HR Policies",                                    department: "HR",          category: "HR Policy" },
  { id: "d05", name: "Leave Policy v3.pdf",               fileType: "PDF",  size: "410 KB", uploadedBy: "Abena Owusu",  uploadedDate: "Jan 08, 2026", projectId: "hf6", projectName: "Leave Records",                                   department: "HR",          category: "Leave Policy" },
  { id: "d06", name: "Performance Review Template.docx",  fileType: "DOCX", size: "220 KB", uploadedBy: "Ama Darko",    uploadedDate: "Mar 14, 2025", projectId: "hf4", projectName: "Performance Reviews",                            department: "HR",          category: "Performance Review" },
  { id: "d35", name: "Senior Analyst Contract.pdf",       fileType: "PDF",  size: "480 KB", uploadedBy: "Ama Darko",    uploadedDate: "Jan 15, 2026", projectId: "hf1", projectName: "Employee Contracts",                             department: "HR",          category: "Employment Contract" },
  { id: "d36", name: "Intern Contract Template.docx",     fileType: "DOCX", size: "150 KB", uploadedBy: "Abena Owusu",  uploadedDate: "Feb 05, 2026", projectId: "hf1", projectName: "Employee Contracts",                             department: "HR",          category: "Employment Contract" },
  { id: "d37", name: "PMP Certificate – Yaw Osei.pdf",    fileType: "PDF",  size: "1.2 MB", uploadedBy: "Ama Darko",    uploadedDate: "Mar 10, 2025", projectId: "hf2", projectName: "Training Certificates",                         department: "HR",          category: "Training Certificate" },
  { id: "d38", name: "Excel Advanced – Mercy Adjei.pdf",  fileType: "PDF",  size: "890 KB", uploadedBy: "Ama Darko",    uploadedDate: "Apr 18, 2025", projectId: "hf2", projectName: "Training Certificates",                         department: "HR",          category: "Training Certificate" },
  { id: "d39", name: "Leadership Training Cert.pdf",      fileType: "PDF",  size: "1.1 MB", uploadedBy: "Abena Owusu",  uploadedDate: "May 22, 2025", projectId: "hf2", projectName: "Training Certificates",                         department: "HR",          category: "Training Certificate" },
  { id: "d40", name: "Offer Letter – Kofi Mensah.pdf",    fileType: "PDF",  size: "290 KB", uploadedBy: "Ama Darko",    uploadedDate: "Feb 12, 2026", projectId: "hf3", projectName: "Offer Letters",                                  department: "HR",          category: "Offer Letter" },
  { id: "d41", name: "Offer Letter – Esi Appiah.pdf",     fileType: "PDF",  size: "310 KB", uploadedBy: "Ama Darko",    uploadedDate: "Mar 01, 2026", projectId: "hf3", projectName: "Offer Letters",                                  department: "HR",          category: "Offer Letter" },
  { id: "d42", name: "Q4 2025 Appraisals Summary.xlsx",   fileType: "XLSX", size: "540 KB", uploadedBy: "Abena Owusu",  uploadedDate: "Jan 20, 2026", projectId: "hf4", projectName: "Performance Reviews",                            department: "HR",          category: "Performance Review" },
  { id: "d43", name: "Annual Leave Tracker 2026.xlsx",     fileType: "XLSX", size: "320 KB", uploadedBy: "Abena Owusu",  uploadedDate: "Jan 12, 2026", projectId: "hf6", projectName: "Leave Records",                                   department: "HR",          category: "Leave Policy" },
  { id: "d44", name: "Disciplinary Policy.pdf",           fileType: "PDF",  size: "380 KB", uploadedBy: "Ama Darko",    uploadedDate: "Feb 08, 2026", projectId: "hf5", projectName: "HR Policies",                                    department: "HR",          category: "HR Policy" },
  { id: "d45", name: "Remote Work Policy.pdf",            fileType: "PDF",  size: "270 KB", uploadedBy: "Abena Owusu",  uploadedDate: "Feb 15, 2026", projectId: "hf5", projectName: "HR Policies",                                    department: "HR",          category: "HR Policy" },
  { id: "d46", name: "Research Analyst JD.docx",          fileType: "DOCX", size: "160 KB", uploadedBy: "Ama Darko",    uploadedDate: "Mar 05, 2026", projectId: "hf7", projectName: "Job Descriptions",                               department: "HR",          category: "Job Description" },
  { id: "d47", name: "Programme Officer JD.docx",         fileType: "DOCX", size: "170 KB", uploadedBy: "Ama Darko",    uploadedDate: "Mar 08, 2026", projectId: "hf7", projectName: "Job Descriptions",                               department: "HR",          category: "Job Description" },
  { id: "d48", name: "New Employee Checklist.pdf",         fileType: "PDF",  size: "210 KB", uploadedBy: "Abena Owusu",  uploadedDate: "Feb 20, 2026", projectId: "hf8", projectName: "Onboarding Documents",                           department: "HR",          category: "HR Policy" },
  { id: "d49", name: "IT Setup Request Form.docx",        fileType: "DOCX", size: "130 KB", uploadedBy: "Abena Owusu",  uploadedDate: "Feb 22, 2026", projectId: "hf8", projectName: "Onboarding Documents",                           department: "HR",          category: "HR Policy" },
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
  { id: "d16", name: "Project Charter – WARIS.pdf",       fileType: "PDF",  size: "780 KB", uploadedBy: "Yaw Osei",     uploadedDate: "Jan 20, 2025", projectId: "p1", projectName: "West Africa Regional Integration Study",        department: "Projects",    category: "Project Charter",       version: "v3.0" },
  { id: "d16b", name: "Project Charter – WARIS.pdf",      fileType: "PDF",  size: "720 KB", uploadedBy: "Yaw Osei",     uploadedDate: "Jan 12, 2025", projectId: "p1", projectName: "West Africa Regional Integration Study",        department: "Projects",    category: "Project Charter",       version: "v2.0" },
  { id: "d16c", name: "Project Charter – WARIS.pdf",      fileType: "PDF",  size: "680 KB", uploadedBy: "Kofi Mensah",  uploadedDate: "Jan 05, 2025", projectId: "p1", projectName: "West Africa Regional Integration Study",        department: "Projects",    category: "Project Charter",       version: "v1.0" },
  { id: "d17", name: "SADI Implementation Plan.docx",     fileType: "DOCX", size: "430 KB", uploadedBy: "Nana Yaw",     uploadedDate: "Apr 20, 2025", projectId: "p4", projectName: "Sustainable Agriculture Development Initiative",   department: "Projects",    category: "Implementation Plan",   version: "v2.0" },
  { id: "d17b", name: "SADI Implementation Plan.docx",    fileType: "DOCX", size: "390 KB", uploadedBy: "Nana Yaw",     uploadedDate: "Apr 08, 2025", projectId: "p4", projectName: "Sustainable Agriculture Development Initiative",   department: "Projects",    category: "Implementation Plan",   version: "v1.0" },
  { id: "d18", name: "RETF Progress Report Q2.pdf",       fileType: "PDF",  size: "540 KB", uploadedBy: "Kwaku Anane",  uploadedDate: "Jul 05, 2025", projectId: "p5", projectName: "Renewable Energy Transition Framework",          department: "Projects",    category: "Progress Report",       version: "v1.0" },
  { id: "d19", name: "Urban Infrastructure Concept Note.pdf", fileType: "PDF", size: "920 KB", uploadedBy: "Yaw Osei", uploadedDate: "Mar 01, 2025", projectId: "p8", projectName: "Urban Infrastructure Development Plan",           department: "Projects",    category: "Inception Report",      version: "v1.0" },
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
  // Content & Collateral
  { id: "d27", name: "Stakeholder Map – West Africa.pdf",  fileType: "PDF",  size: "1.3 MB", uploadedBy: "Kofi Mensah",  uploadedDate: "Feb 28, 2025", projectId: "cf1", projectName: "Content & Collateral",  department: "CRM", category: "Stakeholder Map",     version: "v2.0" },
  { id: "d27b", name: "Stakeholder Map – West Africa.pdf", fileType: "PDF",  size: "1.1 MB", uploadedBy: "Kofi Mensah",  uploadedDate: "Nov 15, 2024", projectId: "cf1", projectName: "Content & Collateral",  department: "CRM", category: "Stakeholder Map",     version: "v1.0" },
  { id: "d28", name: "Donor Engagement Strategy 2026.pdf", fileType: "PDF",  size: "670 KB", uploadedBy: "Kofi Mensah",  uploadedDate: "Jan 25, 2026", projectId: "cf1", projectName: "Content & Collateral",  department: "CRM", category: "Communication Plan",  version: "v1.0" },
  { id: "d50", name: "ACET Brochure 2026.pdf",             fileType: "PDF",  size: "4.2 MB", uploadedBy: "Nana Yaw",     uploadedDate: "Feb 10, 2026", projectId: "cf1", projectName: "Content & Collateral",  department: "CRM", category: "Marketing Material",  version: "v3.0" },
  { id: "d50b", name: "ACET Brochure 2026.pdf",            fileType: "PDF",  size: "3.8 MB", uploadedBy: "Nana Yaw",     uploadedDate: "Jan 20, 2026", projectId: "cf1", projectName: "Content & Collateral",  department: "CRM", category: "Marketing Material",  version: "v2.0" },
  { id: "d50c", name: "ACET Brochure 2026.pdf",            fileType: "PDF",  size: "3.2 MB", uploadedBy: "Nana Yaw",     uploadedDate: "Dec 15, 2025", projectId: "cf1", projectName: "Content & Collateral",  department: "CRM", category: "Marketing Material",  version: "v1.0" },
  { id: "d51", name: "Annual Report 2025 Draft.pdf",       fileType: "PDF",  size: "5.8 MB", uploadedBy: "Kofi Mensah",  uploadedDate: "Mar 05, 2026", projectId: "cf1", projectName: "Content & Collateral",  department: "CRM", category: "Annual Report",       version: "v2.0" },
  { id: "d51b", name: "Annual Report 2025 Draft.pdf",      fileType: "PDF",  size: "5.1 MB", uploadedBy: "Kofi Mensah",  uploadedDate: "Feb 18, 2026", projectId: "cf1", projectName: "Content & Collateral",  department: "CRM", category: "Annual Report",       version: "v1.0" },
  { id: "d52", name: "Media Kit – Press Release.docx",     fileType: "DOCX", size: "320 KB", uploadedBy: "Nana Yaw",     uploadedDate: "Mar 12, 2026", projectId: "cf1", projectName: "Content & Collateral",  department: "CRM", category: "Press Release",       version: "v1.0" },
  // Proposal Library
  { id: "d53", name: "Climate Finance Concept Note.pdf",   fileType: "PDF",  size: "890 KB", uploadedBy: "Yaw Osei",     uploadedDate: "Jan 18, 2026", projectId: "cf2", projectName: "Proposal Library",     department: "CRM", category: "Concept Note",        version: "v2.0" },
  { id: "d53b", name: "Climate Finance Concept Note.pdf",  fileType: "PDF",  size: "780 KB", uploadedBy: "Yaw Osei",     uploadedDate: "Dec 20, 2025", projectId: "cf2", projectName: "Proposal Library",     department: "CRM", category: "Concept Note",        version: "v1.0" },
  { id: "d54", name: "AfDB Grant Proposal Draft.pdf",      fileType: "PDF",  size: "1.5 MB", uploadedBy: "Kofi Mensah",  uploadedDate: "Feb 22, 2026", projectId: "cf2", projectName: "Proposal Library",     department: "CRM", category: "Grant Proposal",      version: "v3.0" },
  { id: "d54b", name: "AfDB Grant Proposal Draft.pdf",     fileType: "PDF",  size: "1.3 MB", uploadedBy: "Kofi Mensah",  uploadedDate: "Feb 05, 2026", projectId: "cf2", projectName: "Proposal Library",     department: "CRM", category: "Grant Proposal",      version: "v2.0" },
  { id: "d54c", name: "AfDB Grant Proposal Draft.pdf",     fileType: "PDF",  size: "1.1 MB", uploadedBy: "Kofi Mensah",  uploadedDate: "Jan 15, 2026", projectId: "cf2", projectName: "Proposal Library",     department: "CRM", category: "Grant Proposal",      version: "v1.0" },
  { id: "d55", name: "EU Partnership Proposal.pdf",        fileType: "PDF",  size: "2.1 MB", uploadedBy: "Yaw Osei",     uploadedDate: "Mar 01, 2026", projectId: "cf2", projectName: "Proposal Library",     department: "CRM", category: "Partnership Proposal", version: "v1.0" },
  { id: "d56", name: "USAID Expression of Interest.docx",  fileType: "DOCX", size: "440 KB", uploadedBy: "Kofi Mensah",  uploadedDate: "Mar 15, 2026", projectId: "cf2", projectName: "Proposal Library",     department: "CRM", category: "Expression of Interest", version: "v1.0" },
  // Contract Repository
  { id: "d57", name: "DFID Grant Agreement 2025.pdf",      fileType: "PDF",  size: "1.8 MB", uploadedBy: "Kwame Asante", uploadedDate: "Jan 10, 2026", projectId: "cf3", projectName: "Contract Repository",  department: "CRM", category: "Grant Agreement",     version: "v2.0" },
  { id: "d57b", name: "DFID Grant Agreement 2025.pdf",     fileType: "PDF",  size: "1.6 MB", uploadedBy: "Kwame Asante", uploadedDate: "Nov 20, 2025", projectId: "cf3", projectName: "Contract Repository",  department: "CRM", category: "Grant Agreement",     version: "v1.0" },
  { id: "d58", name: "MOU – African Union Partnership.pdf", fileType: "PDF", size: "920 KB", uploadedBy: "Kwame Asante", uploadedDate: "Feb 05, 2026", projectId: "cf3", projectName: "Contract Repository",  department: "CRM", category: "MOU",                 version: "v1.0" },
  { id: "d59", name: "AfDB Reporting Obligations.pdf",     fileType: "PDF",  size: "640 KB", uploadedBy: "Kofi Mensah",  uploadedDate: "Feb 18, 2026", projectId: "cf3", projectName: "Contract Repository",  department: "CRM", category: "Reporting Obligation", version: "v1.0" },
  { id: "d60", name: "EU Grant Agreement – RETF.pdf",      fileType: "PDF",  size: "2.3 MB", uploadedBy: "Yaw Osei",     uploadedDate: "Mar 02, 2026", projectId: "cf3", projectName: "Contract Repository",  department: "CRM", category: "Grant Agreement",     version: "v1.0" },
  { id: "d61", name: "USAID MOU – Youth Programme.pdf",    fileType: "PDF",  size: "780 KB", uploadedBy: "Kwame Asante", uploadedDate: "Mar 10, 2026", projectId: "cf3", projectName: "Contract Repository",  department: "CRM", category: "MOU",                 version: "v1.0" },
  // Report Archive
  { id: "d62", name: "Q4 2025 Donor Report – Gates.pdf",   fileType: "PDF",  size: "1.9 MB", uploadedBy: "Ama Darko",    uploadedDate: "Jan 15, 2026", projectId: "cf4", projectName: "Report Archive",      department: "CRM", category: "Donor Report",        version: "v2.0" },
  { id: "d62b", name: "Q4 2025 Donor Report – Gates.pdf",  fileType: "PDF",  size: "1.7 MB", uploadedBy: "Ama Darko",    uploadedDate: "Jan 05, 2026", projectId: "cf4", projectName: "Report Archive",      department: "CRM", category: "Donor Report",        version: "v1.0" },
  { id: "d63", name: "Annual Impact Report 2025.pdf",      fileType: "PDF",  size: "3.4 MB", uploadedBy: "Kofi Mensah",  uploadedDate: "Feb 20, 2026", projectId: "cf4", projectName: "Report Archive",      department: "CRM", category: "Impact Report",       version: "v3.0" },
  { id: "d63b", name: "Annual Impact Report 2025.pdf",     fileType: "PDF",  size: "3.0 MB", uploadedBy: "Kofi Mensah",  uploadedDate: "Feb 10, 2026", projectId: "cf4", projectName: "Report Archive",      department: "CRM", category: "Impact Report",       version: "v2.0" },
  { id: "d63c", name: "Annual Impact Report 2025.pdf",     fileType: "PDF",  size: "2.6 MB", uploadedBy: "Kofi Mensah",  uploadedDate: "Jan 28, 2026", projectId: "cf4", projectName: "Report Archive",      department: "CRM", category: "Impact Report",       version: "v1.0" },
  { id: "d64", name: "USAID Semi-Annual Report H2.pdf",    fileType: "PDF",  size: "1.2 MB", uploadedBy: "Kwame Asante", uploadedDate: "Mar 08, 2026", projectId: "cf4", projectName: "Report Archive",      department: "CRM", category: "Donor Report",        version: "v1.0" },
  { id: "d65", name: "World Bank Progress Update Q1.pdf",  fileType: "PDF",  size: "980 KB", uploadedBy: "James Owusu",  uploadedDate: "Mar 18, 2026", projectId: "cf4", projectName: "Report Archive",      department: "CRM", category: "Progress Report",     version: "v1.0" },
  { id: "d66", name: "Global Fund PUDR Q4.xlsx",           fileType: "XLSX", size: "720 KB", uploadedBy: "Kwame Asante", uploadedDate: "Jan 22, 2026", projectId: "cf4", projectName: "Report Archive",      department: "CRM", category: "PUDR",                version: "v1.0" },
  // Templates & Tools
  { id: "d67", name: "Donor Report Template.docx",         fileType: "DOCX", size: "280 KB", uploadedBy: "Kofi Mensah",  uploadedDate: "Jan 08, 2026", projectId: "cf5", projectName: "Templates & Tools",   department: "CRM", category: "Report Template",     version: "v3.0" },
  { id: "d67b", name: "Donor Report Template.docx",        fileType: "DOCX", size: "250 KB", uploadedBy: "Kofi Mensah",  uploadedDate: "Oct 15, 2025", projectId: "cf5", projectName: "Templates & Tools",   department: "CRM", category: "Report Template",     version: "v2.0" },
  { id: "d67c", name: "Donor Report Template.docx",        fileType: "DOCX", size: "210 KB", uploadedBy: "Kofi Mensah",  uploadedDate: "Jun 20, 2025", projectId: "cf5", projectName: "Templates & Tools",   department: "CRM", category: "Report Template",     version: "v1.0" },
  { id: "d68", name: "Concept Note Template.docx",         fileType: "DOCX", size: "190 KB", uploadedBy: "Yaw Osei",     uploadedDate: "Feb 01, 2026", projectId: "cf5", projectName: "Templates & Tools",   department: "CRM", category: "Concept Note Template", version: "v2.0" },
  { id: "d68b", name: "Concept Note Template.docx",        fileType: "DOCX", size: "160 KB", uploadedBy: "Yaw Osei",     uploadedDate: "Sep 10, 2025", projectId: "cf5", projectName: "Templates & Tools",   department: "CRM", category: "Concept Note Template", version: "v1.0" },
  { id: "d69", name: "Proposal Scoring Matrix.xlsx",       fileType: "XLSX", size: "340 KB", uploadedBy: "Nana Yaw",     uploadedDate: "Feb 15, 2026", projectId: "cf5", projectName: "Templates & Tools",   department: "CRM", category: "Evaluation Tool",     version: "v1.0" },
  { id: "d70", name: "Stakeholder Mapping Tool.xlsx",      fileType: "XLSX", size: "450 KB", uploadedBy: "Kofi Mensah",  uploadedDate: "Mar 01, 2026", projectId: "cf5", projectName: "Templates & Tools",   department: "CRM", category: "Mapping Tool",        version: "v2.0" },
  { id: "d70b", name: "Stakeholder Mapping Tool.xlsx",     fileType: "XLSX", size: "390 KB", uploadedBy: "Kofi Mensah",  uploadedDate: "Nov 10, 2025", projectId: "cf5", projectName: "Templates & Tools",   department: "CRM", category: "Mapping Tool",        version: "v1.0" },
  { id: "d71", name: "Grant Compliance Checklist.pdf",     fileType: "PDF",  size: "310 KB", uploadedBy: "Kwame Asante", uploadedDate: "Mar 12, 2026", projectId: "cf5", projectName: "Templates & Tools",   department: "CRM", category: "Compliance Checklist", version: "v1.0" },
  { id: "d72", name: "MOU Drafting Guide.pdf",             fileType: "PDF",  size: "520 KB", uploadedBy: "Kwame Asante", uploadedDate: "Feb 28, 2026", projectId: "cf5", projectName: "Templates & Tools",   department: "CRM", category: "Drafting Guide",      version: "v1.0" },
  // ── Admin ───────────────────────────────────────────────────────
  { id: "d29", name: "Board Meeting Minutes Q1.pdf",       fileType: "PDF",  size: "450 KB", uploadedBy: "Admin",       uploadedDate: "Mar 15, 2026", projectId: "df1", projectName: "Board Documents",                               department: "Admin",       category: "Meeting Minutes" },
  { id: "d30", name: "Board Resolution 2026-001.pdf",     fileType: "PDF",  size: "320 KB", uploadedBy: "Admin",       uploadedDate: "Mar 20, 2026", projectId: "df1", projectName: "Board Documents",                               department: "Admin",       category: "Policy Document" },
  { id: "d31", name: "Travel Policy v2.pdf",              fileType: "PDF",  size: "280 KB", uploadedBy: "Admin",       uploadedDate: "Feb 10, 2026", projectId: "df2", projectName: "Internal Policies",                              department: "Admin",       category: "Policy Document" },
  { id: "d32", name: "Code of Conduct.pdf",               fileType: "PDF",  size: "190 KB", uploadedBy: "Admin",       uploadedDate: "Jan 15, 2026", projectId: "df2", projectName: "Internal Policies",                              department: "Admin",       category: "Policy Document" },
  { id: "d33", name: "Office Maintenance Schedule.xlsx",   fileType: "XLSX", size: "120 KB", uploadedBy: "Admin",       uploadedDate: "Feb 20, 2026", projectId: "df3", projectName: "Office Management",                              department: "Admin",       category: "Report" },
  { id: "d34", name: "IT Equipment Inventory.xlsx",        fileType: "XLSX", size: "250 KB", uploadedBy: "Admin",       uploadedDate: "Mar 01, 2026", projectId: "df5", projectName: "IT & Systems",                                   department: "Admin",       category: "Report" },
];

// ── Store singleton ──────────────────────────────────────────────

type Listener = () => void;
let _folders: ProjectFolder[] = [...initialFolders];
let _documents: VaultDocument[] = [...initialDocuments];
let _deptFolders: DeptFolder[] = [...initialDeptFolders];
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

export function getDeptFolders(): DeptFolder[] {
  return [..._deptFolders];
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

export function addDeptFolder(folder: DeptFolder): void {
  _deptFolders = [..._deptFolders, folder];
  _notify();
}
