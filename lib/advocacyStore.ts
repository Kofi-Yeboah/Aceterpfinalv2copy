/* ═══════════════════════════════════════════════════════════════════════════════
   Advocacy Store — pub-sub pattern shared across Advocacy & Impact Hub screens
   ═══════════════════════════════════════════════════════════════════════════════ */

export const ISSUE_AREAS = [
  "Digital Economy", "Youth Employment", "Trade Policy", "Climate Finance",
  "Gender Equality", "Agriculture", "Infrastructure", "Health Systems",
  "SME Development", "Governance", "Education", "Energy",
] as const;

export type StakeholderType =
  | "Policymaker" | "Advisor" | "Government Official"
  | "Journalist" | "CSO" | "Influencer" | "Development Partner";

export interface Stakeholder {
  id: number;
  name: string;
  title: string;
  organization: string;
  type: StakeholderType;
  email: string;
  phone: string;
  country: string;
  influenceLevel: "High" | "Medium" | "Low";
  issueAreas: string[];
  relationshipStrength: "Strong" | "Moderate" | "Weak" | "New";
  notes: string;
  dateAdded: string;
}

export interface StakeholderEngagement {
  id: number;
  stakeholderId: number;
  date: string;
  type: "Meeting" | "Correspondence" | "Policy Brief Delivery" | "Phone Call" | "Follow-up" | "Event";
  subject: string;
  participants: string[];
  summary: string;
  outcome: string;
  nextStep: string;
  linkedActivityId?: string;
}

export interface StakeholderRelationship {
  id: number;
  fromStakeholderId: number;
  toStakeholderId: number;
  relationshipType: "Influence" | "Collaboration" | "Reports To" | "Advisory";
  strength: number;
  description: string;
}

export interface AdvocacyEvent {
  id: number;
  title: string;
  type: "Lobbying Meeting" | "Consultation" | "Briefing" | "Public Event" | "Workshop" | "Conference";
  date: string;
  endDate?: string;
  time: string;
  location: string;
  description: string;
  assignedTo: string[];
  stakeholderIds: number[];
  issueArea: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "Postponed";
  linkedActivityId?: string;
}

export interface AdvocacyTask {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "To Do" | "In Progress" | "Done" | "Overdue";
  eventId?: number;
  issueArea: string;
}

export interface OutreachEntry {
  id: number;
  type: "Email" | "Phone Call" | "Op-Ed Submission" | "Event Participation" | "Letter" | "Social Media";
  date: string;
  recipientOrTarget: string;
  subject: string;
  status: "Sent" | "Delivered" | "Published" | "Pending" | "No Response";
  outcome: string;
  assignedTo: string;
}

export interface AdvocacyDocument {
  id: number;
  title: string;
  type: "Policy Brief" | "Fact Sheet" | "Talking Points" | "Media Kit" | "Memo" | "Report" | "Presentation";
  issueAreas: string[];
  campaign: string;
  audienceType: "Policymakers" | "Media" | "Public" | "Internal" | "Donors";
  currentVersion: number;
  status: "Draft" | "Under Review" | "Approved" | "Published" | "Archived";
  createdDate: string;
  lastModified: string;
  author: string;
  fileName: string;
  fileSize: string;
  tags: string[];
}

export interface DocumentVersion {
  id: number;
  documentId: number;
  version: number;
  date: string;
  author: string;
  changes: string;
  approvedBy?: string;
  status: "Draft" | "Pending Approval" | "Approved" | "Rejected";
}

export interface OutcomeMapping {
  id: number;
  advocacyActionId: string;
  advocacyActionName: string;
  outcomeType: "Policy Change" | "Stakeholder Alignment" | "Budget Allocation" | "Legislative Action" | "Public Awareness" | "Institutional Reform";
  outcomeDescription: string;
  dateIdentified: string;
  verificationSource: string;
  status: "Confirmed" | "Emerging" | "Claimed";
  contributionLevel: "Direct" | "Contributing" | "Indirect";
}

export interface InfluenceIndicator {
  id: number;
  stakeholderId: number;
  stakeholderName: string;
  metric: "Meeting Frequency" | "Citations" | "Recommendation Uptake" | "Media Mentions" | "Event Invitations" | "Policy References";
  value: number;
  period: string;
  trend: "Increasing" | "Stable" | "Decreasing";
  notes: string;
}

export interface QualitativeImpactLog {
  id: number;
  title: string;
  date: string;
  category: "Anecdotal Win" | "High-Level Recognition" | "Informal Policy Influence" | "Strategic Positioning" | "Partnership Breakthrough";
  description: string;
  relevantStakeholders: string[];
  issueArea: string;
  evidenceSource: string;
  significance: "High" | "Medium" | "Low";
}

/* ─── SEED DATA ───────────────────────────────────────────────────────────── */

const INITIAL_STAKEHOLDERS: Stakeholder[] = [
  { id: 1, name: "Hon. Charles Mensah", title: "Deputy Minister", organization: "Ministry of Finance", type: "Policymaker", email: "c.mensah@mofep.gov.gh", phone: "+233 302 665 132", country: "Ghana", influenceLevel: "High", issueAreas: ["Digital Economy", "Trade Policy"], relationshipStrength: "Strong", notes: "Key champion for digital tax reform", dateAdded: "2024-03-15" },
  { id: 2, name: "Dr. Fatima Diallo", title: "Senior Advisor", organization: "African Union Commission", type: "Advisor", email: "f.diallo@au.int", phone: "+251 115 517 700", country: "Ethiopia", influenceLevel: "High", issueAreas: ["Trade Policy", "Youth Employment", "Governance"], relationshipStrength: "Strong", notes: "Former ACET board advisor", dateAdded: "2024-01-20" },
  { id: 3, name: "Peter Okonkwo", title: "Bureau Chief", organization: "Reuters Africa", type: "Journalist", email: "p.okonkwo@reuters.com", phone: "+234 803 555 9012", country: "Nigeria", influenceLevel: "Medium", issueAreas: ["Climate Finance", "Trade Policy"], relationshipStrength: "Moderate", notes: "Covers economic policy across West Africa", dateAdded: "2024-05-10" },
  { id: 4, name: "Sarah Kamau", title: "Executive Director", organization: "Kenya Civil Society Alliance", type: "CSO", email: "s.kamau@kcsa.or.ke", phone: "+254 720 123 456", country: "Kenya", influenceLevel: "Medium", issueAreas: ["Gender Equality", "Youth Employment"], relationshipStrength: "Moderate", notes: "Strong convening power across East Africa", dateAdded: "2024-04-08" },
  { id: 5, name: "Prof. Emmanuel Adjei", title: "Director of Research", organization: "University of Ghana", type: "Influencer", email: "e.adjei@ug.edu.gh", phone: "+233 244 123 789", country: "Ghana", influenceLevel: "Medium", issueAreas: ["Education", "Digital Economy", "SME Development"], relationshipStrength: "Strong", notes: "Frequent co-author on policy briefs", dateAdded: "2024-02-12" },
  { id: 6, name: "Amb. Nkosazana Dlamini", title: "Trade Commissioner", organization: "AfCFTA Secretariat", type: "Government Official", email: "n.dlamini@afcfta.au.int", phone: "+233 302 789 456", country: "Ghana", influenceLevel: "High", issueAreas: ["Trade Policy", "SME Development", "Infrastructure"], relationshipStrength: "Moderate", notes: "Key contact for AfCFTA policy dialogues", dateAdded: "2024-06-01" },
  { id: 7, name: "Jean-Claude Mbeki", title: "Country Director", organization: "World Bank Ghana", type: "Development Partner", email: "jc.mbeki@worldbank.org", phone: "+233 302 226 500", country: "Ghana", influenceLevel: "High", issueAreas: ["Climate Finance", "Infrastructure", "Governance"], relationshipStrength: "Strong", notes: "Major funding partner for governance programs", dateAdded: "2024-01-05" },
  { id: 8, name: "Aisha Bello", title: "Program Manager", organization: "UNDP West Africa", type: "Development Partner", email: "a.bello@undp.org", phone: "+221 338 591 200", country: "Senegal", influenceLevel: "Medium", issueAreas: ["Youth Employment", "Gender Equality", "Climate Finance"], relationshipStrength: "Weak", notes: "Exploring partnership on youth employment", dateAdded: "2024-07-20" },
];

const INITIAL_ENGAGEMENTS: StakeholderEngagement[] = [
  { id: 1, stakeholderId: 1, date: "2024-11-15", type: "Policy Brief Delivery", subject: "Digital Tax Reform Brief", participants: ["James Owusu", "Hon. Charles Mensah"], summary: "Delivered policy brief on digital economy taxation framework", outcome: "Minister committed to reviewing recommendations", nextStep: "Schedule follow-up in January", linkedActivityId: "ADV-001" },
  { id: 2, stakeholderId: 2, date: "2024-10-28", type: "Meeting", subject: "AfCFTA Implementation Review", participants: ["Grace Tetteh", "Dr. Fatima Diallo", "Amb. Nkosazana Dlamini"], summary: "Discussed progress on AfCFTA implementation and ACET's role in evidence generation", outcome: "Agreement to co-host policy dialogue in Q1 2025", nextStep: "Draft concept note for joint event" },
  { id: 3, stakeholderId: 3, date: "2024-11-20", type: "Correspondence", subject: "Op-Ed Collaboration on Trade Policy", participants: ["James Owusu", "Peter Okonkwo"], summary: "Coordinated publication of trade policy op-ed in Business Weekly", outcome: "Op-ed published, cited in 5 outlets", nextStep: "Pitch follow-up piece on AfCFTA progress", linkedActivityId: "ADV-003" },
  { id: 4, stakeholderId: 4, date: "2024-12-05", type: "Event", subject: "Climate Finance Public Forum", participants: ["Ama Darko", "Sarah Kamau"], summary: "CSO Alliance participated in climate finance forum, contributed gender lens perspective", outcome: "Joint statement issued on gender-responsive climate finance", nextStep: "Formalize partnership MOU", linkedActivityId: "ADV-004" },
  { id: 5, stakeholderId: 7, date: "2024-11-10", type: "Meeting", subject: "Governance Program Mid-Term Review", participants: ["James Owusu", "Ama Darko", "Jean-Claude Mbeki"], summary: "Discussed mid-term findings of governance evidence program", outcome: "Positive assessment, potential for phase 2 funding", nextStep: "Submit phase 2 concept note by March" },
  { id: 6, stakeholderId: 5, date: "2024-10-05", type: "Policy Brief Delivery", subject: "SME Growth Policy Brief", participants: ["James Owusu", "Prof. Emmanuel Adjei"], summary: "Co-authored policy brief delivered to Ministry of Trade & Industry", outcome: "SME support fund increased by 20%", nextStep: "Track policy implementation", linkedActivityId: "ADV-010" },
  { id: 7, stakeholderId: 6, date: "2024-09-18", type: "Meeting", subject: "AfCFTA Trade Facilitation Discussion", participants: ["Grace Tetteh", "Amb. Nkosazana Dlamini"], summary: "Discussed barriers to intra-African trade and ACET's research agenda", outcome: "Invitation to present at AfCFTA ministerial", nextStep: "Prepare presentation materials" },
  { id: 8, stakeholderId: 1, date: "2024-10-15", type: "Phone Call", subject: "Budget Allocation Follow-up", participants: ["James Owusu"], summary: "Quick follow-up on digital economy budget allocation for FY2025", outcome: "Confirmed increased allocation for digital infrastructure", nextStep: "Monitor budget execution" },
];

const INITIAL_RELATIONSHIPS: StakeholderRelationship[] = [
  { id: 1, fromStakeholderId: 1, toStakeholderId: 6, relationshipType: "Collaboration", strength: 7, description: "Both involved in AfCFTA trade policy discussions" },
  { id: 2, fromStakeholderId: 2, toStakeholderId: 6, relationshipType: "Advisory", strength: 8, description: "AU Commission advises AfCFTA Secretariat" },
  { id: 3, fromStakeholderId: 7, toStakeholderId: 1, relationshipType: "Influence", strength: 6, description: "World Bank funding influences MoF policy priorities" },
  { id: 4, fromStakeholderId: 4, toStakeholderId: 8, relationshipType: "Collaboration", strength: 5, description: "Joint programs on gender and youth" },
  { id: 5, fromStakeholderId: 5, toStakeholderId: 1, relationshipType: "Advisory", strength: 7, description: "Academic research informs ministry policy" },
  { id: 6, fromStakeholderId: 3, toStakeholderId: 6, relationshipType: "Influence", strength: 4, description: "Media coverage shapes public opinion on trade policy" },
];

const INITIAL_EVENTS: AdvocacyEvent[] = [
  { id: 1, title: "Digital Economy Policy Dialogue", type: "Briefing", date: "2025-01-20", time: "10:00", location: "Accra, Ghana", description: "High-level briefing on digital tax reform recommendations", assignedTo: ["James Owusu"], stakeholderIds: [1, 5], issueArea: "Digital Economy", status: "Scheduled" },
  { id: 2, title: "AfCFTA Ministerial Presentation", type: "Conference", date: "2025-02-15", time: "09:00", location: "Addis Ababa, Ethiopia", description: "Present research findings on intra-African trade barriers", assignedTo: ["Grace Tetteh"], stakeholderIds: [2, 6], issueArea: "Trade Policy", status: "Scheduled" },
  { id: 3, title: "Youth Employment Roundtable", type: "Consultation", date: "2025-01-28", time: "14:00", location: "Nairobi, Kenya", description: "Multi-stakeholder consultation on youth employment strategies", assignedTo: ["Ama Darko", "Grace Tetteh"], stakeholderIds: [4, 8], issueArea: "Youth Employment", status: "Scheduled" },
  { id: 4, title: "Parliamentary Committee Briefing on Climate Finance", type: "Lobbying Meeting", date: "2025-03-05", time: "11:00", location: "Accra, Ghana", description: "Brief parliamentary committee on climate finance gaps and recommendations", assignedTo: ["Ama Darko"], stakeholderIds: [7], issueArea: "Climate Finance", status: "Scheduled" },
  { id: 5, title: "Gender Equality Media Roundtable", type: "Public Event", date: "2024-12-10", time: "15:00", location: "Accra, Ghana", description: "Media engagement on gender equality policy achievements and gaps", assignedTo: ["Ama Darko"], stakeholderIds: [3, 4], issueArea: "Gender Equality", status: "Completed" },
  { id: 6, title: "SME Policy Review Workshop", type: "Workshop", date: "2024-11-18", time: "09:30", location: "Lagos, Nigeria", description: "Workshop to review SME support policies with industry stakeholders", assignedTo: ["James Owusu"], stakeholderIds: [5], issueArea: "SME Development", status: "Completed" },
];

const INITIAL_TASKS: AdvocacyTask[] = [
  { id: 1, title: "Prepare digital economy briefing materials", description: "Compile latest data and policy recommendations for the digital economy dialogue", assignedTo: "James Owusu", dueDate: "2025-01-15", priority: "High", status: "In Progress", eventId: 1, issueArea: "Digital Economy" },
  { id: 2, title: "Draft AfCFTA presentation slides", description: "Create presentation for the ministerial meeting in Addis Ababa", assignedTo: "Grace Tetteh", dueDate: "2025-02-10", priority: "High", status: "To Do", eventId: 2, issueArea: "Trade Policy" },
  { id: 3, title: "Coordinate youth employment stakeholder invitations", description: "Send invitations and confirm attendance for roundtable participants", assignedTo: "Ama Darko", dueDate: "2025-01-20", priority: "Medium", status: "In Progress", eventId: 3, issueArea: "Youth Employment" },
  { id: 4, title: "Compile climate finance data for parliamentary brief", description: "Gather latest climate finance flow data for Ghana and the region", assignedTo: "Ama Darko", dueDate: "2025-02-28", priority: "Medium", status: "To Do", eventId: 4, issueArea: "Climate Finance" },
  { id: 5, title: "Follow up on SME policy recommendations", description: "Track implementation of recommendations from SME workshop", assignedTo: "James Owusu", dueDate: "2025-01-30", priority: "Low", status: "To Do", issueArea: "SME Development" },
  { id: 6, title: "Submit governance phase 2 concept note", description: "Draft and submit concept note for World Bank governance program phase 2", assignedTo: "James Owusu", dueDate: "2025-03-15", priority: "High", status: "To Do", issueArea: "Governance" },
];

const INITIAL_OUTREACH: OutreachEntry[] = [
  { id: 1, type: "Email", date: "2024-12-01", recipientOrTarget: "Ministry of Finance - Digital Economy Unit", subject: "Digital Tax Reform Brief & Key Recommendations", status: "Delivered", outcome: "Acknowledgment received, meeting requested", assignedTo: "James Owusu" },
  { id: 2, type: "Op-Ed Submission", date: "2024-11-18", recipientOrTarget: "Business Weekly Africa", subject: "AfCFTA: Bridging the Implementation Gap", status: "Published", outcome: "Published Nov 20, cited in 5 outlets", assignedTo: "James Owusu" },
  { id: 3, type: "Phone Call", date: "2024-12-03", recipientOrTarget: "UNDP West Africa - Program Office", subject: "Youth Employment Partnership Discussion", status: "Delivered", outcome: "Interest expressed, follow-up meeting planned for January", assignedTo: "Ama Darko" },
  { id: 4, type: "Letter", date: "2024-11-25", recipientOrTarget: "Parliamentary Committee on Finance", subject: "Request for Hearing on Climate Finance Policy", status: "Sent", outcome: "Pending response", assignedTo: "Ama Darko" },
  { id: 5, type: "Event Participation", date: "2024-12-05", recipientOrTarget: "Africa Climate Summit - Side Event", subject: "Presentation on Climate Finance Gaps in Africa", status: "Delivered", outcome: "200+ attendees, 3 partnership leads generated", assignedTo: "Ama Darko" },
  { id: 6, type: "Social Media", date: "2024-12-02", recipientOrTarget: "Twitter/X - Policy Community", subject: "Thread on Digital Economy Tax Reform Findings", status: "Published", outcome: "15K impressions, 200+ engagements", assignedTo: "Grace Tetteh" },
  { id: 7, type: "Email", date: "2024-11-28", recipientOrTarget: "AfCFTA Secretariat - Trade Division", subject: "Research Summary: Intra-African Trade Barriers", status: "Delivered", outcome: "Invitation to present at ministerial meeting", assignedTo: "Grace Tetteh" },
];

const INITIAL_DOCUMENTS: AdvocacyDocument[] = [
  { id: 1, title: "Digital Economy Tax Reform Policy Brief", type: "Policy Brief", issueAreas: ["Digital Economy"], campaign: "Digital Tax Reform", audienceType: "Policymakers", currentVersion: 3, status: "Published", createdDate: "2024-09-01", lastModified: "2024-11-10", author: "James Owusu", fileName: "digital-tax-reform-brief-v3.pdf", fileSize: "2.4 MB", tags: ["digital economy", "tax reform", "Ghana", "policy brief"] },
  { id: 2, title: "AfCFTA Implementation Fact Sheet", type: "Fact Sheet", issueAreas: ["Trade Policy"], campaign: "AfCFTA Advocacy", audienceType: "Policymakers", currentVersion: 2, status: "Published", createdDate: "2024-07-15", lastModified: "2024-10-20", author: "Grace Tetteh", fileName: "afcfta-fact-sheet-v2.pdf", fileSize: "1.1 MB", tags: ["AfCFTA", "trade", "fact sheet"] },
  { id: 3, title: "Youth Employment Talking Points", type: "Talking Points", issueAreas: ["Youth Employment"], campaign: "Youth Employment Initiative", audienceType: "Policymakers", currentVersion: 1, status: "Approved", createdDate: "2024-10-01", lastModified: "2024-10-15", author: "Ama Darko", fileName: "youth-employment-talking-points.pdf", fileSize: "850 KB", tags: ["youth", "employment", "talking points"] },
  { id: 4, title: "Climate Finance Media Kit", type: "Media Kit", issueAreas: ["Climate Finance"], campaign: "Climate Finance Advocacy", audienceType: "Media", currentVersion: 1, status: "Published", createdDate: "2024-11-01", lastModified: "2024-11-30", author: "Ama Darko", fileName: "climate-finance-media-kit.zip", fileSize: "8.5 MB", tags: ["climate", "finance", "media", "press"] },
  { id: 5, title: "Gender Equality Policy Memo", type: "Memo", issueAreas: ["Gender Equality"], campaign: "Gender Mainstreaming", audienceType: "Internal", currentVersion: 2, status: "Under Review", createdDate: "2024-08-20", lastModified: "2024-12-01", author: "Ama Darko", fileName: "gender-equality-memo-v2.pdf", fileSize: "1.3 MB", tags: ["gender", "equality", "memo", "internal"] },
  { id: 6, title: "SME Growth Strategy Presentation", type: "Presentation", issueAreas: ["SME Development"], campaign: "SME Policy Reform", audienceType: "Policymakers", currentVersion: 1, status: "Draft", createdDate: "2024-11-20", lastModified: "2024-12-02", author: "James Owusu", fileName: "sme-growth-strategy-deck.pptx", fileSize: "4.2 MB", tags: ["SME", "growth", "strategy", "presentation"] },
  { id: 7, title: "Governance & Accountability Report", type: "Report", issueAreas: ["Governance"], campaign: "Governance Evidence Program", audienceType: "Donors", currentVersion: 1, status: "Under Review", createdDate: "2024-10-10", lastModified: "2024-11-28", author: "James Owusu", fileName: "governance-accountability-report.pdf", fileSize: "3.8 MB", tags: ["governance", "accountability", "report", "donors"] },
];

const INITIAL_DOC_VERSIONS: DocumentVersion[] = [
  { id: 1, documentId: 1, version: 1, date: "2024-09-01", author: "James Owusu", changes: "Initial draft of digital economy tax reform brief", status: "Approved" },
  { id: 2, documentId: 1, version: 2, date: "2024-10-05", author: "James Owusu", changes: "Incorporated feedback from Ministry of Finance consultation", status: "Approved" },
  { id: 3, documentId: 1, version: 3, date: "2024-11-10", author: "James Owusu", changes: "Updated with latest revenue data and policy recommendations", status: "Approved", approvedBy: "Grace Tetteh" },
  { id: 4, documentId: 2, version: 1, date: "2024-07-15", author: "Grace Tetteh", changes: "Initial fact sheet on AfCFTA implementation progress", status: "Approved" },
  { id: 5, documentId: 2, version: 2, date: "2024-10-20", author: "Grace Tetteh", changes: "Updated with Q3 2024 trade statistics", status: "Approved", approvedBy: "James Owusu" },
  { id: 6, documentId: 5, version: 1, date: "2024-08-20", author: "Ama Darko", changes: "Initial draft of gender equality policy memo", status: "Approved" },
  { id: 7, documentId: 5, version: 2, date: "2024-12-01", author: "Ama Darko", changes: "Revised with stakeholder feedback and updated indicators", status: "Pending Approval" },
];

const INITIAL_OUTCOMES: OutcomeMapping[] = [
  { id: 1, advocacyActionId: "ADV-001", advocacyActionName: "Parliamentary Brief on Digital Economy", outcomeType: "Policy Change", outcomeDescription: "Digital tax framework adopted by Ministry of Finance, incorporating 3 of 5 key recommendations from ACET brief", dateIdentified: "2024-12-01", verificationSource: "Ministry of Finance press release, December 2024", status: "Confirmed", contributionLevel: "Direct" },
  { id: 2, advocacyActionId: "ADV-002", advocacyActionName: "Youth Employment Stakeholder Meeting", outcomeType: "Budget Allocation", outcomeDescription: "Ministry of Youth committed to pilot program in 3 regions with $2M budget allocation", dateIdentified: "2024-11-15", verificationSource: "Ministry budget announcement, November 2024", status: "Confirmed", contributionLevel: "Contributing" },
  { id: 3, advocacyActionId: "ADV-005", advocacyActionName: "Gender Equality Policy Brief", outcomeType: "Stakeholder Alignment", outcomeDescription: "Ministry of Gender incorporated ACET recommendations into national gender strategy draft", dateIdentified: "2024-10-20", verificationSource: "Draft national strategy document, shared by ministry", status: "Confirmed", contributionLevel: "Direct" },
  { id: 4, advocacyActionId: "ADV-010", advocacyActionName: "SME Growth Policy Dialogue", outcomeType: "Budget Allocation", outcomeDescription: "SME support fund increased by 20% in FY2025 budget", dateIdentified: "2024-11-01", verificationSource: "National budget statement, FY2025", status: "Confirmed", contributionLevel: "Contributing" },
  { id: 5, advocacyActionId: "ADV-003", advocacyActionName: "AfCFTA Op-Ed in Business Weekly", outcomeType: "Public Awareness", outcomeDescription: "Op-ed cited in 5 media outlets reaching estimated 50K+ readers, sparking public debate on AfCFTA implementation timeline", dateIdentified: "2024-12-05", verificationSource: "Media monitoring report", status: "Confirmed", contributionLevel: "Direct" },
  { id: 6, advocacyActionId: "ADV-004", advocacyActionName: "Climate Finance Public Forum", outcomeType: "Stakeholder Alignment", outcomeDescription: "3 development partners expressed interest in joint climate finance program", dateIdentified: "2024-12-10", verificationSource: "Post-event follow-up communications", status: "Emerging", contributionLevel: "Contributing" },
  { id: 7, advocacyActionId: "ADV-006", advocacyActionName: "Agricultural Policy Roundtable", outcomeType: "Legislative Action", outcomeDescription: "Parliamentary committee agreed to schedule hearing on agricultural subsidy reform", dateIdentified: "2024-12-15", verificationSource: "Committee chair verbal commitment", status: "Claimed", contributionLevel: "Indirect" },
];

const INITIAL_INFLUENCE: InfluenceIndicator[] = [
  { id: 1, stakeholderId: 1, stakeholderName: "Hon. Charles Mensah", metric: "Meeting Frequency", value: 6, period: "Q4 2024", trend: "Increasing", notes: "Regular engagement on digital economy issues" },
  { id: 2, stakeholderId: 1, stakeholderName: "Hon. Charles Mensah", metric: "Recommendation Uptake", value: 3, period: "Q4 2024", trend: "Increasing", notes: "3 of 5 policy recommendations adopted" },
  { id: 3, stakeholderId: 2, stakeholderName: "Dr. Fatima Diallo", metric: "Meeting Frequency", value: 4, period: "Q4 2024", trend: "Stable", notes: "Quarterly engagement maintained" },
  { id: 4, stakeholderId: 2, stakeholderName: "Dr. Fatima Diallo", metric: "Event Invitations", value: 2, period: "Q4 2024", trend: "Increasing", notes: "Invited to 2 AU-level events" },
  { id: 5, stakeholderId: 3, stakeholderName: "Peter Okonkwo", metric: "Citations", value: 5, period: "Q4 2024", trend: "Increasing", notes: "ACET cited in 5 Reuters Africa articles" },
  { id: 6, stakeholderId: 3, stakeholderName: "Peter Okonkwo", metric: "Media Mentions", value: 8, period: "Q4 2024", trend: "Increasing", notes: "Coverage across multiple outlets" },
  { id: 7, stakeholderId: 7, stakeholderName: "Jean-Claude Mbeki", metric: "Meeting Frequency", value: 3, period: "Q4 2024", trend: "Stable", notes: "Regular program review meetings" },
  { id: 8, stakeholderId: 7, stakeholderName: "Jean-Claude Mbeki", metric: "Policy References", value: 2, period: "Q4 2024", trend: "Increasing", notes: "World Bank country report referenced 2 ACET publications" },
  { id: 9, stakeholderId: 5, stakeholderName: "Prof. Emmanuel Adjei", metric: "Citations", value: 12, period: "Q4 2024", trend: "Increasing", notes: "Joint publications widely cited in academic and policy circles" },
  { id: 10, stakeholderId: 6, stakeholderName: "Amb. Nkosazana Dlamini", metric: "Event Invitations", value: 3, period: "Q4 2024", trend: "Increasing", notes: "3 invitations to AfCFTA-related events" },
];

const INITIAL_IMPACT_LOGS: QualitativeImpactLog[] = [
  { id: 1, title: "Digital Tax Framework Adopted", date: "2024-12-01", category: "Anecdotal Win", description: "Ghana's Ministry of Finance adopted the digital tax framework that directly incorporated ACET's policy recommendations. The Deputy Minister publicly acknowledged ACET's contribution during the press briefing.", relevantStakeholders: ["Hon. Charles Mensah", "Prof. Emmanuel Adjei"], issueArea: "Digital Economy", evidenceSource: "Ministry of Finance press briefing, December 1, 2024", significance: "High" },
  { id: 2, title: "AfCFTA Secretariat Presentation Invitation", date: "2024-11-28", category: "High-Level Recognition", description: "ACET received a formal invitation from the AfCFTA Secretariat to present at the upcoming ministerial meeting on trade facilitation. This represents growing recognition of ACET's trade policy expertise at the continental level.", relevantStakeholders: ["Amb. Nkosazana Dlamini", "Dr. Fatima Diallo"], issueArea: "Trade Policy", evidenceSource: "Official invitation letter from AfCFTA Secretariat", significance: "High" },
  { id: 3, title: "World Bank Cites ACET in Governance Report", date: "2024-11-15", category: "Informal Policy Influence", description: "The World Bank's latest Ghana Country Economic Memorandum cited two ACET publications on governance and accountability, signaling uptake of research findings in international policy discourse.", relevantStakeholders: ["Jean-Claude Mbeki"], issueArea: "Governance", evidenceSource: "World Bank Ghana Country Economic Memorandum, November 2024", significance: "Medium" },
  { id: 4, title: "CSO Alliance Partnership Solidified", date: "2024-12-10", category: "Partnership Breakthrough", description: "Kenya Civil Society Alliance formally agreed to co-implement youth employment monitoring across East Africa, extending ACET's reach into civil society networks in Kenya, Uganda, and Tanzania.", relevantStakeholders: ["Sarah Kamau", "Aisha Bello"], issueArea: "Youth Employment", evidenceSource: "Signed partnership letter of intent", significance: "High" },
  { id: 5, title: "Media Coverage Spike on Trade Policy", date: "2024-11-25", category: "Strategic Positioning", description: "Following the Business Weekly op-ed, ACET was referenced in 5 additional media outlets across Africa as a leading voice on AfCFTA implementation, positioning the organization as a go-to source on trade policy.", relevantStakeholders: ["Peter Okonkwo"], issueArea: "Trade Policy", evidenceSource: "Media monitoring report, November 2024", significance: "Medium" },
];

/* ─── STORE ────────────────────────────────────────────────────────────────── */

type Listener = () => void;
const listeners: Listener[] = [];

let stakeholders = [...INITIAL_STAKEHOLDERS];
let engagements = [...INITIAL_ENGAGEMENTS];
let relationships = [...INITIAL_RELATIONSHIPS];
let events = [...INITIAL_EVENTS];
let tasks = [...INITIAL_TASKS];
let outreach = [...INITIAL_OUTREACH];
let documents = [...INITIAL_DOCUMENTS];
let docVersions = [...INITIAL_DOC_VERSIONS];
let outcomes = [...INITIAL_OUTCOMES];
let influence = [...INITIAL_INFLUENCE];
let impactLogs = [...INITIAL_IMPACT_LOGS];

function emit() { listeners.forEach((l) => l()); }
export function subscribe(fn: Listener) { listeners.push(fn); return () => { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); }; }

export function getStakeholders() { return stakeholders; }
export function getEngagements() { return engagements; }
export function getEngagementsByStakeholder(sid: number) { return engagements.filter(e => e.stakeholderId === sid); }
export function getRelationships() { return relationships; }
export function getAdvocacyEvents() { return events; }
export function getAdvocacyTasks() { return tasks; }
export function getOutreachEntries() { return outreach; }
export function getAdvocacyDocuments() { return documents; }
export function getDocumentVersions(docId: number) { return docVersions.filter(v => v.documentId === docId); }
export function getAllDocumentVersions() { return docVersions; }
export function getOutcomeMappings() { return outcomes; }
export function getInfluenceIndicators() { return influence; }
export function getQualitativeImpactLogs() { return impactLogs; }

export function addStakeholder(s: Omit<Stakeholder, "id">) {
  stakeholders = [...stakeholders, { ...s, id: Date.now() }];
  emit();
}
export function updateStakeholder(id: number, updates: Partial<Stakeholder>) {
  stakeholders = stakeholders.map(s => s.id === id ? { ...s, ...updates } : s);
  emit();
}
export function deleteStakeholder(id: number) {
  stakeholders = stakeholders.filter(s => s.id !== id);
  engagements = engagements.filter(e => e.stakeholderId !== id);
  relationships = relationships.filter(r => r.fromStakeholderId !== id && r.toStakeholderId !== id);
  emit();
}

export function addEngagement(e: Omit<StakeholderEngagement, "id">) {
  engagements = [...engagements, { ...e, id: Date.now() }];
  emit();
}

export function addRelationship(r: Omit<StakeholderRelationship, "id">) {
  relationships = [...relationships, { ...r, id: Date.now() }];
  emit();
}

export function addAdvocacyEvent(e: Omit<AdvocacyEvent, "id">) {
  events = [...events, { ...e, id: Date.now() }];
  emit();
}
export function updateEventStatus(id: number, status: AdvocacyEvent["status"]) {
  events = events.map(e => e.id === id ? { ...e, status } : e);
  emit();
}

export function addAdvocacyTask(t: Omit<AdvocacyTask, "id">) {
  tasks = [...tasks, { ...t, id: Date.now() }];
  emit();
}
export function updateTaskStatus(id: number, status: AdvocacyTask["status"]) {
  tasks = tasks.map(t => t.id === id ? { ...t, status } : t);
  emit();
}

export function addOutreachEntry(o: Omit<OutreachEntry, "id">) {
  outreach = [...outreach, { ...o, id: Date.now() }];
  emit();
}

export function addAdvocacyDocument(d: Omit<AdvocacyDocument, "id">) {
  documents = [...documents, { ...d, id: Date.now() }];
  emit();
}
export function updateDocumentStatus(id: number, status: AdvocacyDocument["status"]) {
  documents = documents.map(d => d.id === id ? { ...d, status } : d);
  emit();
}

export function addDocumentVersion(v: Omit<DocumentVersion, "id">) {
  docVersions = [...docVersions, { ...v, id: Date.now() }];
  const doc = documents.find(d => d.id === v.documentId);
  if (doc) {
    documents = documents.map(d => d.id === v.documentId ? { ...d, currentVersion: v.version, lastModified: v.date } : d);
  }
  emit();
}
export function updateDocVersionStatus(id: number, status: DocumentVersion["status"], approvedBy?: string) {
  docVersions = docVersions.map(v => v.id === id ? { ...v, status, approvedBy: approvedBy || v.approvedBy } : v);
  emit();
}

export function addOutcomeMapping(o: Omit<OutcomeMapping, "id">) {
  outcomes = [...outcomes, { ...o, id: Date.now() }];
  emit();
}

export function addInfluenceIndicator(i: Omit<InfluenceIndicator, "id">) {
  influence = [...influence, { ...i, id: Date.now() }];
  emit();
}

export function addQualitativeImpactLog(log: Omit<QualitativeImpactLog, "id">) {
  impactLogs = [...impactLogs, { ...log, id: Date.now() }];
  emit();
}
