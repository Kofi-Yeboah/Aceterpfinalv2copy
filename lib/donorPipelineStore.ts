/* ═══════════════════════════════════════════════════════════════════════════════
   Donor Pipeline Store — pub-sub pattern shared across CRM screens
   ═══════════════════════════════════════════════════════════════════════════════ */

export type PipelineStage =
  | "No Contact"
  | "Pipeline"
  | "Agreement Reached"
  | "Converted";

export interface PipelineConversation {
  id: number;
  date: string;
  type: "Email" | "Call" | "Meeting" | "Workshop" | "Site Visit" | "Presentation" | "Other";
  subject: string;
  acParticipants: string[];
  donorParticipants: string[];
  summary: string;
  outcome: string;
  nextStep?: string;
  stageAfter?: PipelineStage;
}

export interface DonorContact {
  id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  role: string;
  department: string;
}

export interface PotentialDonor {
  id: number;
  organizationName: string;
  type: "Foundation" | "Bilateral" | "Multilateral" | "Corporate" | "Government" | "Individual";
  sector: string;
  country: string;
  estimatedCapacity: number;
  currency: string;
  website: string;
  pipelineStage: PipelineStage;
  interestAreas: string[];
  source: string;
  dateAdded: string;
  lastContact: string | null;
  contacts: DonorContact[];
  conversations: PipelineConversation[];
  notes: string;
}

export interface ProposalAgreement {
  id: number;
  donorId: number;
  donorName: string;
  title: string;
  type: "Concept Note" | "Full Proposal" | "Grant Agreement" | "MOU" | "Contract";
  status: "Draft" | "Submitted" | "Under Review" | "Accepted" | "Rejected" | "Signed" | "Expired";
  amount: number;
  currency: string;
  programArea: string;
  submittedDate: string | null;
  responseDate: string | null;
  startDate: string | null;
  endDate: string | null;
  version: number;
  description: string;
  keyTerms?: string;
}

export interface PotentialProject {
  id: number;
  name: string;
  donorId: number | null;
  donorName: string;
  donorCodes: string[];
  proposalId: number | null;
  programArea: string;
  status: "Drafts" | "Submitted";
  estimatedBudget: number;
  currency: string;
  startDate: string;
  endDate: string;
  probability: number; // 0-100
  description: string;
  outcomeGoal: string;
  leadContact: string;
  lastUpdated: string;
  files: { name: string; size: string; type: string }[];
  versionHistory: { version: number; date: string; author: string; changes: string; snapshot?: string }[];
}

export interface Agreement {
  id: number;
  donorId: number;
  donorName: string;
  conceptId: number;
  conceptName: string;
  title: string;
  type: "Grant Agreement" | "MOU" | "Contract";
  status: "Draft" | "Under Review" | "Active" | "Completed" | "Terminated";
  amount: number;
  currency: string;
  programArea: string;
  contactPerson: string;
  terms: string;
  startDate: string;
  endDate: string;
  contractFileName: string | null;
  proposalFileName: string | null;
  createdDate: string;
  description: string;
}

/* ─── SEED DATA ───────────────────────────────────────────────────────────────── */

const INITIAL_POTENTIAL_DONORS: PotentialDonor[] = [
  {
    id: 1,
    organizationName: "Mastercard Foundation",
    type: "Foundation",
    sector: "Youth & Education",
    country: "Canada",
    estimatedCapacity: 5000000,
    currency: "USD",
    website: "www.mastercardfdn.org",
    pipelineStage: "Pipeline",
    interestAreas: ["Youth Employment", "Skills Development", "Financial Inclusion"],
    source: "Direct Outreach",
    dateAdded: "Sep 15, 2025",
    lastContact: "Mar 10, 2026",
    contacts: [
      { id: 1, name: "Daniel Ofosu", title: "Program Director, Africa", email: "d.ofosu@mastercardfdn.org", phone: "+1 416 926 5111", role: "Decision Maker", department: "Africa Programs" },
      { id: 2, name: "Amina Bello", title: "Program Officer", email: "a.bello@mastercardfdn.org", phone: "+1 416 926 5222", role: "Primary Contact", department: "Young Africa Works" },
    ],
    conversations: [
      { id: 1, date: "Oct 5, 2025", type: "Email", subject: "Initial Introduction & Expression of Interest", acParticipants: ["James Owusu"], donorParticipants: ["Amina Bello"], summary: "Sent introductory email about ACET's youth employment research capabilities.", outcome: "Response received — interest expressed", nextStep: "Schedule introductory call" },
      { id: 2, date: "Nov 12, 2025", type: "Call", subject: "Introductory Call", acParticipants: ["James Owusu", "Grace Tetteh"], donorParticipants: ["Amina Bello", "Daniel Ofosu"], summary: "Discussed ACET's track record in youth employment research. MCF shared their Young Africa Works strategy.", outcome: "Strong alignment identified in skills-to-jobs focus", nextStep: "Share concept note on youth employment pathways" },
      { id: 3, date: "Jan 15, 2026", type: "Meeting", subject: "Strategy Alignment Meeting — Accra", acParticipants: ["James Owusu", "Grace Tetteh", "Ama Darko"], donorParticipants: ["Daniel Ofosu", "Amina Bello"], summary: "In-person meeting in Accra. Discussed potential 3-year youth employment program across 5 West African countries.", outcome: "MCF requested full proposal", nextStep: "Prepare and submit full proposal by Mar 30" },
      { id: 4, date: "Mar 10, 2026", type: "Call", subject: "Proposal Preparation Check-in", acParticipants: ["Grace Tetteh"], donorParticipants: ["Amina Bello"], summary: "Discussed proposal format requirements and budget ceiling.", outcome: "Confirmed $5M ceiling, 3-year horizon", nextStep: "Submit proposal by Mar 30" },
    ],
    notes: "Strong prospect. Young Africa Works initiative aligns perfectly with ACET's youth employment research agenda.",
  },
  {
    id: 2,
    organizationName: "DFID / FCDO",
    type: "Bilateral",
    sector: "International Development",
    country: "United Kingdom",
    estimatedCapacity: 3000000,
    currency: "GBP",
    website: "www.gov.uk/fcdo",
    pipelineStage: "Pipeline",
    interestAreas: ["Economic Transformation", "Trade Facilitation", "Climate & Growth"],
    source: "Referral from World Bank",
    dateAdded: "Jul 20, 2025",
    lastContact: "Feb 28, 2026",
    contacts: [
      { id: 3, name: "Dr. Helen Fraser", title: "Senior Programme Manager", email: "h.fraser@fcdo.gov.uk", phone: "+44 20 7008 3100", role: "Primary Contact", department: "Africa Directorate" },
    ],
    conversations: [
      { id: 5, date: "Aug 10, 2025", type: "Email", subject: "Referral Introduction", acParticipants: ["James Owusu"], donorParticipants: ["Dr. Helen Fraser"], summary: "Introduction via World Bank colleague. Shared ACET overview and recent publications.", outcome: "Interest expressed in trade facilitation work" },
      { id: 6, date: "Oct 22, 2025", type: "Meeting", subject: "London Office Meeting", acParticipants: ["James Owusu"], donorParticipants: ["Dr. Helen Fraser"], summary: "Met at FCDO London office. Discussed AfCFTA implementation support.", outcome: "Concept note requested" },
      { id: 7, date: "Dec 15, 2025", type: "Email", subject: "Concept Note Submission", acParticipants: ["Grace Tetteh"], donorParticipants: ["Dr. Helen Fraser"], summary: "Submitted concept note on AfCFTA Trade Facilitation Study.", outcome: "Positive feedback — full proposal invited" },
      { id: 8, date: "Feb 28, 2026", type: "Email", subject: "Full Proposal Submission", acParticipants: ["James Owusu", "Grace Tetteh"], donorParticipants: ["Dr. Helen Fraser"], summary: "Submitted full proposal: £2.8M for AfCFTA trade facilitation support.", outcome: "Under internal FCDO review" },
    ],
    notes: "Proposal under review. Decision expected by April 2026.",
  },
  {
    id: 3,
    organizationName: "GIZ",
    type: "Bilateral",
    sector: "Technical Cooperation",
    country: "Germany",
    estimatedCapacity: 1500000,
    currency: "EUR",
    website: "www.giz.de",
    pipelineStage: "Pipeline",
    interestAreas: ["Industrialization", "Green Economy", "Vocational Training"],
    source: "Conference Networking",
    dateAdded: "Jan 8, 2026",
    lastContact: "Feb 15, 2026",
    contacts: [
      { id: 4, name: "Klaus Becker", title: "Country Director, Ghana", email: "k.becker@giz.de", phone: "+233 302 776 100", role: "Primary Contact", department: "Ghana Office" },
    ],
    conversations: [
      { id: 9, date: "Jan 8, 2026", type: "Other", subject: "Met at Africa Industrialization Forum", acParticipants: ["James Owusu"], donorParticipants: ["Klaus Becker"], summary: "Exchanged cards at conference. Discussed industrial policy research synergies.", outcome: "Agreed to follow up with formal meeting" },
      { id: 10, date: "Feb 15, 2026", type: "Email", subject: "Follow-up & Capability Statement", acParticipants: ["Grace Tetteh"], donorParticipants: ["Klaus Becker"], summary: "Shared ACET capability statement and recent industrial policy publications.", outcome: "Awaiting response" },
    ],
    notes: "Early stage. GIZ Ghana has budget for industrial policy TA.",
  },
  {
    id: 4,
    organizationName: "Rockefeller Foundation",
    type: "Foundation",
    sector: "Philanthropy",
    country: "USA",
    estimatedCapacity: 2000000,
    currency: "USD",
    website: "www.rockefellerfoundation.org",
    pipelineStage: "No Contact",
    interestAreas: ["Food Systems", "Energy Access", "Data & Digital"],
    source: "Desk Research",
    dateAdded: "Feb 25, 2026",
    lastContact: null,
    contacts: [
      { id: 5, name: "Maria Santos", title: "VP, Africa Initiatives", email: "m.santos@rockfound.org", phone: "+1 212 869 8500", role: "Decision Maker", department: "Africa Initiatives" },
    ],
    conversations: [],
    notes: "Identified through desk research. Strong alignment with food systems and energy access programs.",
  },
  {
    id: 5,
    organizationName: "JICA",
    type: "Bilateral",
    sector: "International Cooperation",
    country: "Japan",
    estimatedCapacity: 2500000,
    currency: "USD",
    website: "www.jica.go.jp",
    pipelineStage: "Pipeline",
    interestAreas: ["Infrastructure", "Quality Education", "Private Sector Development"],
    source: "Embassy Referral",
    dateAdded: "Jun 1, 2025",
    lastContact: "Mar 5, 2026",
    contacts: [
      { id: 6, name: "Takeshi Yamamoto", title: "Senior Representative", email: "t.yamamoto@jica.go.jp", phone: "+233 302 765 060", role: "Primary Contact", department: "Ghana Office" },
      { id: 7, name: "Akiko Tanaka", title: "Program Officer", email: "a.tanaka@jica.go.jp", phone: "+233 302 765 061", role: "Technical Contact", department: "Private Sector" },
    ],
    conversations: [
      { id: 11, date: "Jul 15, 2025", type: "Meeting", subject: "Courtesy Visit to JICA Ghana", acParticipants: ["James Owusu"], donorParticipants: ["Takeshi Yamamoto"], summary: "Courtesy visit to JICA Ghana office. Discussed areas of mutual interest.", outcome: "JICA interested in private sector development study" },
      { id: 12, date: "Sep 20, 2025", type: "Meeting", subject: "Technical Discussion — PSD Study", acParticipants: ["James Owusu", "Grace Tetteh"], donorParticipants: ["Takeshi Yamamoto", "Akiko Tanaka"], summary: "Deep-dive into potential private sector development study scope.", outcome: "Proposal parameters agreed" },
      { id: 13, date: "Nov 30, 2025", type: "Email", subject: "Proposal Submission", acParticipants: ["Grace Tetteh"], donorParticipants: ["Akiko Tanaka"], summary: "Submitted proposal for PSD Study — $2.2M over 2 years.", outcome: "Acknowledged, under JICA HQ review" },
      { id: 14, date: "Mar 5, 2026", type: "Call", subject: "Review Status Update", acParticipants: ["James Owusu"], donorParticipants: ["Takeshi Yamamoto"], summary: "JICA HQ has reviewed and sent clarification questions. Responses provided.", outcome: "Final decision expected by Apr 2026" },
    ],
    notes: "Advanced stage. JICA HQ conducting final review. High probability of success.",
  },
  {
    id: 6,
    organizationName: "Hewlett Foundation",
    type: "Foundation",
    sector: "Philanthropy",
    country: "USA",
    estimatedCapacity: 1800000,
    currency: "USD",
    website: "www.hewlett.org",
    pipelineStage: "Agreement Reached",
    interestAreas: ["Governance", "Transparency", "Evidence-Based Policy"],
    source: "Existing Relationship",
    dateAdded: "Mar 10, 2025",
    lastContact: "Mar 12, 2026",
    contacts: [
      { id: 8, name: "Patricia Williams", title: "Program Officer", email: "p.williams@hewlett.org", phone: "+1 650 234 4500", role: "Primary Contact", department: "Global Development" },
    ],
    conversations: [
      { id: 15, date: "Apr 5, 2025", type: "Call", subject: "Re-engagement Discussion", acParticipants: ["James Owusu"], donorParticipants: ["Patricia Williams"], summary: "Discussed renewing partnership on governance research.", outcome: "Interest confirmed" },
      { id: 16, date: "Jun 15, 2025", type: "Meeting", subject: "Program Design Workshop", acParticipants: ["James Owusu", "Ama Darko"], donorParticipants: ["Patricia Williams"], summary: "Co-designed governance evidence program. 2-year, 4-country scope.", outcome: "Proposal framework agreed" },
      { id: 17, date: "Sep 10, 2025", type: "Email", subject: "Proposal Submission", acParticipants: ["Grace Tetteh"], donorParticipants: ["Patricia Williams"], summary: "Submitted full proposal: $1.6M governance evidence program.", outcome: "Under review" },
      { id: 18, date: "Dec 20, 2025", type: "Call", subject: "Budget Clarification", acParticipants: ["Grace Tetteh"], donorParticipants: ["Patricia Williams"], summary: "Addressed budget questions from Hewlett review team.", outcome: "Budget revised to $1.5M" },
      { id: 19, date: "Mar 12, 2026", type: "Call", subject: "Award Notification", acParticipants: ["James Owusu"], donorParticipants: ["Patricia Williams"], summary: "Hewlett confirmed award of $1.5M grant for governance evidence program.", outcome: "Grant awarded — agreement to be finalized", stageAfter: "Agreement Reached" },
    ],
    notes: "Agreement reached! Grant agreement to be drafted and signed.",
  },
];

const INITIAL_PROPOSALS: ProposalAgreement[] = [
  { id: 1, donorId: 2, donorName: "DFID / FCDO", title: "AfCFTA Trade Facilitation Support Program", type: "Full Proposal", status: "Under Review", amount: 2800000, currency: "GBP", programArea: "Trade & Economic Integration", submittedDate: "Feb 28, 2026", responseDate: null, startDate: "Jul 1, 2026", endDate: "Jun 30, 2029", version: 1, description: "Comprehensive support program for AfCFTA trade facilitation across 8 West African countries." },
  { id: 2, donorId: 2, donorName: "DFID / FCDO", title: "AfCFTA Trade Facilitation — Concept Note", type: "Concept Note", status: "Accepted", amount: 2800000, currency: "GBP", programArea: "Trade & Economic Integration", submittedDate: "Dec 15, 2025", responseDate: "Jan 20, 2026", startDate: null, endDate: null, version: 1, description: "Concept note outlining the proposed AfCFTA support program." },
  { id: 3, donorId: 5, donorName: "JICA", title: "Private Sector Development Study — West Africa", type: "Full Proposal", status: "Under Review", amount: 2200000, currency: "USD", programArea: "Private Sector Development", submittedDate: "Nov 30, 2025", responseDate: null, startDate: "Jul 1, 2026", endDate: "Jun 30, 2028", version: 1, description: "Comprehensive study on private sector development barriers and opportunities in 5 West African countries." },
  { id: 4, donorId: 6, donorName: "Hewlett Foundation", title: "Governance Evidence & Policy Influence Program", type: "Full Proposal", status: "Accepted", amount: 1500000, currency: "USD", programArea: "Governance & Accountability", submittedDate: "Sep 10, 2025", responseDate: "Mar 12, 2026", startDate: "May 1, 2026", endDate: "Apr 30, 2028", version: 2, description: "Two-year program generating governance evidence and supporting policy influence in 4 African countries." },
  { id: 5, donorId: 6, donorName: "Hewlett Foundation", title: "Hewlett Foundation Grant Agreement — Governance Evidence Program", type: "Grant Agreement", status: "Draft", amount: 1500000, currency: "USD", programArea: "Governance & Accountability", submittedDate: null, responseDate: null, startDate: "May 1, 2026", endDate: "Apr 30, 2028", version: 1, description: "Grant agreement for the Governance Evidence & Policy Influence Program.", keyTerms: "24-month grant period. Quarterly narrative and financial reporting. Annual audit required." },
];

const INITIAL_POTENTIAL_PROJECTS: PotentialProject[] = [
  { id: 1, name: "Youth Employment Pathways — West Africa", donorId: 1, donorName: "Mastercard Foundation", donorCodes: [], proposalId: null, programArea: "Youth Employment", status: "Drafts", estimatedBudget: 5000000, currency: "USD", startDate: "Oct 2026", endDate: "Sep 2029", probability: 55, description: "Multi-country youth employment research and policy influence program.", outcomeGoal: "Improve employment outcomes for 50,000 youth across 5 West African countries through evidence-based policy interventions.", leadContact: "Grace Tetteh", lastUpdated: "Mar 10, 2026", files: [{ name: "Youth_Employment_Concept.pdf", size: "2.4 MB", type: "pdf" }, { name: "Budget_Framework.xlsx", size: "856 KB", type: "xlsx" }], versionHistory: [] },
  { id: 2, name: "AfCFTA Trade Facilitation Support", donorId: 2, donorName: "DFID / FCDO", donorCodes: ["FCDO", "DFID"], proposalId: 1, programArea: "Trade & Economic Integration", status: "Submitted", estimatedBudget: 2800000, currency: "GBP", startDate: "Jul 2026", endDate: "Jun 2029", probability: 60, description: "Support program for AfCFTA trade facilitation across West Africa.", outcomeGoal: "Reduce trade barriers and facilitate cross-border commerce in 8 West African countries.", leadContact: "James Owusu", lastUpdated: "Feb 28, 2026", files: [{ name: "AfCFTA_Proposal_v2.pdf", size: "4.1 MB", type: "pdf" }, { name: "Trade_Analysis.pdf", size: "1.8 MB", type: "pdf" }, { name: "Budget_Detail.xlsx", size: "1.2 MB", type: "xlsx" }], versionHistory: [{ version: 1, date: "Oct 15, 2025", author: "James Owusu", changes: "Initial concept draft created" }, { version: 2, date: "Dec 10, 2025", author: "Grace Tetteh", changes: "Refined scope to 8 countries, updated budget framework" }, { version: 3, date: "Feb 28, 2026", author: "James Owusu", changes: "Submitted to donors: FCDO, DFID" }] },
  { id: 3, name: "Private Sector Development Study", donorId: 5, donorName: "JICA", donorCodes: ["JICA"], proposalId: 3, programArea: "Private Sector Development", status: "Submitted", estimatedBudget: 2200000, currency: "USD", startDate: "Jul 2026", endDate: "Jun 2028", probability: 70, description: "Study on PSD barriers and opportunities in West Africa.", outcomeGoal: "Identify and address key private sector development barriers in 5 West African countries.", leadContact: "James Owusu", lastUpdated: "Mar 5, 2026", files: [{ name: "PSD_Study_Proposal.pdf", size: "3.6 MB", type: "pdf" }], versionHistory: [] },
  { id: 4, name: "Governance Evidence & Policy Influence", donorId: 6, donorName: "Hewlett Foundation", donorCodes: ["HEWLETT"], proposalId: 4, programArea: "Governance & Accountability", status: "Submitted", estimatedBudget: 1500000, currency: "USD", startDate: "May 2026", endDate: "Apr 2028", probability: 95, description: "Governance evidence generation and policy influence in 4 African countries.", outcomeGoal: "Generate actionable governance evidence and influence policy reform in 4 countries.", leadContact: "Ama Darko", lastUpdated: "Mar 12, 2026", files: [{ name: "Governance_Evidence_Proposal.pdf", size: "3.2 MB", type: "pdf" }, { name: "M&E_Framework.pdf", size: "890 KB", type: "pdf" }], versionHistory: [{ version: 1, date: "Jun 1, 2025", author: "Ama Darko", changes: "Initial concept created from program design workshop" }, { version: 2, date: "Aug 20, 2025", author: "Ama Darko", changes: "Added M&E framework, expanded to 4 countries" }, { version: 3, date: "Sep 10, 2025", author: "Grace Tetteh", changes: "Submitted to donors: HEWLETT" }, { version: 4, date: "Dec 20, 2025", author: "Grace Tetteh", changes: "Budget revised from $1.6M to $1.5M per donor feedback" }] },
  { id: 5, name: "Industrial Policy TA — Ghana", donorId: 3, donorName: "GIZ", donorCodes: [], proposalId: null, programArea: "Industrial Policy", status: "Drafts", estimatedBudget: 1500000, currency: "EUR", startDate: "Jan 2027", endDate: "Dec 2028", probability: 20, description: "Technical assistance on industrial policy for Ghana's industrialization agenda.", outcomeGoal: "Support Ghana's industrial transformation through evidence-based policy advisory.", leadContact: "Grace Tetteh", lastUpdated: "Feb 15, 2026", files: [{ name: "Industrial_Policy_Draft.docx", size: "1.1 MB", type: "docx" }], versionHistory: [] },
  { id: 6, name: "Food Systems Transformation Study", donorId: 4, donorName: "Rockefeller Foundation", donorCodes: [], proposalId: null, programArea: "Agriculture & Food Systems", status: "Drafts", estimatedBudget: 2000000, currency: "USD", startDate: "Jul 2027", endDate: "Jun 2029", probability: 10, description: "Study on food systems transformation pathways in Sub-Saharan Africa.", outcomeGoal: "Map food systems transformation pathways and identify scalable interventions.", leadContact: "James Owusu", lastUpdated: "Feb 25, 2026", files: [], versionHistory: [] },
  { id: 7, name: "Digital Skills for Youth — East Africa", donorId: null, donorName: "", donorCodes: ["GATES", "USAID"], proposalId: null, programArea: "Digital Transformation", status: "Submitted", estimatedBudget: 3500000, currency: "USD", startDate: "Jan 2027", endDate: "Dec 2029", probability: 40, description: "Digital skills training and employment program targeting youth in East Africa.", outcomeGoal: "Train 25,000 youth in digital skills and connect 10,000 to employment opportunities.", leadContact: "Grace Tetteh", lastUpdated: "Mar 1, 2026", files: [{ name: "Digital_Skills_Concept.pdf", size: "2.8 MB", type: "pdf" }, { name: "Stakeholder_Map.pdf", size: "450 KB", type: "pdf" }], versionHistory: [{ version: 1, date: "Jan 15, 2026", author: "Grace Tetteh", changes: "Initial concept draft" }, { version: 2, date: "Mar 1, 2026", author: "Grace Tetteh", changes: "Submitted to donors: GATES, USAID" }] },
  { id: 8, name: "Climate Resilient Agriculture — Sahel", donorId: null, donorName: "", donorCodes: ["WHO", "FAO"], proposalId: null, programArea: "Climate & Agriculture", status: "Submitted", estimatedBudget: 4200000, currency: "USD", startDate: "Apr 2027", endDate: "Mar 2030", probability: 35, description: "Climate resilient agriculture research and capacity building in Sahel region.", outcomeGoal: "Build climate resilient agricultural practices benefiting 100,000 smallholder farmers.", leadContact: "Ama Darko", lastUpdated: "Mar 8, 2026", files: [{ name: "Climate_Ag_Proposal.pdf", size: "5.1 MB", type: "pdf" }, { name: "Field_Assessment.pdf", size: "3.4 MB", type: "pdf" }, { name: "Budget_v3.xlsx", size: "780 KB", type: "xlsx" }, { name: "Logframe.xlsx", size: "340 KB", type: "xlsx" }], versionHistory: [{ version: 1, date: "Feb 1, 2026", author: "Ama Darko", changes: "Initial concept draft with field assessment" }, { version: 2, date: "Feb 20, 2026", author: "Ama Darko", changes: "Updated budget to v3, added logframe" }, { version: 3, date: "Mar 8, 2026", author: "Ama Darko", changes: "Submitted to donors: WHO, FAO" }] },
];

const INITIAL_AGREEMENTS: Agreement[] = [
  {
    id: 1,
    donorId: 6,
    donorName: "Hewlett Foundation",
    conceptId: 4,
    conceptName: "Governance Evidence & Policy Influence",
    title: "Hewlett Foundation — Governance Evidence Grant Agreement",
    type: "Grant Agreement",
    status: "Draft",
    amount: 1500000,
    currency: "USD",
    programArea: "Governance & Accountability",
    contactPerson: "Patricia Williams",
    terms: "24-month grant period. Quarterly narrative and financial reporting. Annual audit required. Mid-term review at 12 months.",
    startDate: "2026-05-01",
    endDate: "2028-04-30",
    contractFileName: "Hewlett_Grant_Agreement_Draft.pdf",
    proposalFileName: "Governance_Evidence_Proposal.pdf",
    createdDate: "Mar 15, 2026",
    description: "Grant agreement for the Governance Evidence & Policy Influence Program across 4 African countries.",
  },
];

/* ─── STORE ────────────────────────────────────────────────────────────────── */

type Listener = () => void;
const listeners: Listener[] = [];

let potentialDonors = [...INITIAL_POTENTIAL_DONORS];
let proposals = [...INITIAL_PROPOSALS];
let potentialProjects = [...INITIAL_POTENTIAL_PROJECTS];
let agreements = [...INITIAL_AGREEMENTS];

function emit() { listeners.forEach((l) => l()); }
export function subscribe(fn: Listener) { listeners.push(fn); return () => { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); }; }

export function getPotentialDonors() { return potentialDonors; }
export function getProposals() { return proposals; }
export function getPotentialProjects() { return potentialProjects; }
export function getAgreements() { return agreements; }
export function getAgreementsByDonor(donorId: number) { return agreements.filter(a => a.donorId === donorId); }

export function addConversation(donorId: number, conv: Omit<PipelineConversation, "id">) {
  potentialDonors = potentialDonors.map((d) => {
    if (d.id !== donorId) return d;
    const newConv = { ...conv, id: Date.now() };
    const updated = { ...d, conversations: [...d.conversations, newConv], lastContact: conv.date };
    if (conv.stageAfter) updated.pipelineStage = conv.stageAfter;
    return updated;
  });
  emit();
}

export function updateDonorStage(donorId: number, stage: PipelineStage) {
  potentialDonors = potentialDonors.map((d) => d.id === donorId ? { ...d, pipelineStage: stage } : d);
  emit();
}

export function addProposal(p: Omit<ProposalAgreement, "id">) {
  proposals = [...proposals, { ...p, id: Date.now() }];
  emit();
}

export function updateProposalStatus(id: number, status: ProposalAgreement["status"]) {
  proposals = proposals.map((p) => p.id === id ? { ...p, status } : p);
  emit();
}

export function convertDonorToOrganization(donorId: number) {
  potentialDonors = potentialDonors.map((d) => d.id === donorId ? { ...d, pipelineStage: "Converted" as PipelineStage } : d);
  emit();
}

export function addPotentialProject(p: Omit<PotentialProject, "id">) {
  potentialProjects = [...potentialProjects, { ...p, id: Date.now() }];
  emit();
}

export function updateProjectStatus(id: number, status: PotentialProject["status"]) {
  potentialProjects = potentialProjects.map((p) => p.id === id ? { ...p, status } : p);
  emit();
}

export function submitConceptToDonors(id: number, donorCodes: string[]) {
  const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  potentialProjects = potentialProjects.map((p) => {
    if (p.id !== id) return p;
    const newVersion: PotentialProject["versionHistory"][0] = {
      version: p.versionHistory.length + 1,
      date: now,
      author: p.leadContact,
      changes: `Submitted to donors: ${donorCodes.join(", ")}`,
    };
    return { ...p, status: "Submitted" as const, donorCodes, lastUpdated: now, versionHistory: [...p.versionHistory, newVersion] };
  });
  emit();
}

export function addConceptVersion(id: number, entry: { author: string; changes: string }) {
  const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  potentialProjects = potentialProjects.map((p) => {
    if (p.id !== id) return p;
    const newVersion = { version: p.versionHistory.length + 1, date: now, ...entry };
    return { ...p, lastUpdated: now, versionHistory: [...p.versionHistory, newVersion] };
  });
  emit();
}

export function addAgreement(a: Omit<Agreement, "id">) {
  agreements = [...agreements, { ...a, id: Date.now() }];
  emit();
}

export function updateAgreementStatus(id: number, status: Agreement["status"]) {
  agreements = agreements.map(a => a.id === id ? { ...a, status } : a);
  emit();
}