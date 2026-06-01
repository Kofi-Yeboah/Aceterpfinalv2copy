import { useState } from "react";
import {
  Plus, Search, MoreHorizontal, X, Building2, MapPin, Globe,
  Mail, Phone, Users, Edit2, Trash2, Eye, ChevronDown,
  Calendar, DollarSign, Briefcase, FileText, MessageSquare,
  ArrowLeft, Download, Clock, Star, Target, TrendingUp, CheckCircle2,
} from "lucide-react";
import { cn } from "../lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════════ */

interface ContactPerson {
  id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  role: string; // e.g. "Primary Contact", "Program Officer"
  department: string;
  lastInteraction: string;
}

interface Engagement {
  id: number;
  type: "Meeting" | "Call" | "Email" | "Event" | "Workshop" | "Site Visit" | "Presentation";
  title: string;
  date: string;
  participants: string[];
  notes: string;
  outcome: string;
  followUp?: string;
}

interface FundRecord {
  id: number;
  grantName: string;
  amount: number;
  currency: string;
  status: "Active" | "Completed" | "Pipeline" | "Expired";
  startDate: string;
  endDate: string;
  disbursed: number;
  programArea: string;
}

interface ProjectLink {
  id: number;
  projectName: string;
  role: string; // "Funder", "Partner", "Implementer"
  status: "Active" | "Completed" | "Planning";
  startDate: string;
  endDate: string;
  value: number;
  programArea: string;
}

interface Organization {
  id: number;
  name: string;
  type: string;
  sector: string;
  location: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  contactCount: number;
  status: "Prospect" | "Pipeline" | "Agreement";
  dateAdded: string;
  description?: string;
  address?: string;
  contacts: ContactPerson[];
  engagements: Engagement[];
  funds: FundRecord[];
  projects: ProjectLink[];
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SEED DATA
   ═══════════════════════════════════════════════════════════════════════════════ */

const ORGANIZATIONS: Organization[] = [
  {
    id: 1, name: "Ford Foundation", type: "Donor", sector: "Philanthropy",
    location: "New York, USA", website: "www.fordfoundation.org",
    contactEmail: "info@fordfoundation.org", contactPhone: "+1 212 573 5000",
    contactCount: 3, status: "Agreement", dateAdded: "Jan 15, 2024",
    description: "The Ford Foundation is an American private foundation with the mission of advancing human welfare. It provides funding for economic transformation programs across Africa.",
    address: "320 E 43rd Street, New York, NY 10017, USA",
    contacts: [
      { id: 1, name: "Sarah Thompson", title: "Senior Program Officer", email: "s.thompson@fordfoundation.org", phone: "+1 212 573 5100", role: "Primary Contact", department: "Africa Programs", lastInteraction: "Mar 5, 2026" },
      { id: 2, name: "Michael Okafor", title: "Regional Director", email: "m.okafor@fordfoundation.org", phone: "+1 212 573 5200", role: "Decision Maker", department: "International Programs", lastInteraction: "Feb 18, 2026" },
      { id: 3, name: "Emily Chen", title: "Grants Administrator", email: "e.chen@fordfoundation.org", phone: "+1 212 573 5300", role: "Grants Contact", department: "Finance", lastInteraction: "Jan 22, 2026" },
    ],
    engagements: [
      { id: 1, type: "Meeting", title: "Annual Partnership Review", date: "Mar 5, 2026", participants: ["Sarah Thompson", "Ama Darko", "James Owusu"], notes: "Reviewed progress on 3 active grants. Discussed pipeline for next fiscal year.", outcome: "Positive — new concept note requested", followUp: "Submit concept note by Apr 15, 2026" },
      { id: 2, type: "Presentation", title: "Impact Report Presentation", date: "Feb 10, 2026", participants: ["Michael Okafor", "Sarah Thompson", "Grace Tetteh"], notes: "Presented 2025 impact data for the economic transformation program.", outcome: "Well received, interest in scaling", followUp: "Share full report PDF" },
      { id: 3, type: "Call", title: "Budget Reconciliation Discussion", date: "Jan 22, 2026", participants: ["Emily Chen", "Finance Team"], notes: "Aligned on outstanding budget variances for Q4 2025.", outcome: "Resolved — no further issues" },
      { id: 4, type: "Event", title: "Africa Philanthropy Forum", date: "Nov 15, 2025", participants: ["Sarah Thompson", "James Owusu"], notes: "Attended jointly. Networking with other grantees.", outcome: "New partnership leads identified" },
    ],
    funds: [
      { id: 1, grantName: "Economic Transformation in West Africa", amount: 2500000, currency: "USD", status: "Active", startDate: "Jul 1, 2024", endDate: "Jun 30, 2027", disbursed: 1200000, programArea: "Economic Policy" },
      { id: 2, grantName: "Youth Employment Pathways", amount: 800000, currency: "USD", status: "Active", startDate: "Jan 1, 2025", endDate: "Dec 31, 2026", disbursed: 350000, programArea: "Youth Development" },
      { id: 3, grantName: "Governance & Accountability (Phase 1)", amount: 1500000, currency: "USD", status: "Completed", startDate: "Jan 1, 2022", endDate: "Dec 31, 2024", disbursed: 1500000, programArea: "Governance" },
    ],
    projects: [
      { id: 1, projectName: "West Africa Economic Transformation Program", role: "Funder", status: "Active", startDate: "Jul 2024", endDate: "Jun 2027", value: 2500000, programArea: "Economic Policy" },
      { id: 2, projectName: "Youth Employment Baseline Study", role: "Funder", status: "Active", startDate: "Jan 2025", endDate: "Dec 2026", value: 800000, programArea: "Youth Development" },
    ],
  },
  {
    id: 2, name: "USAID", type: "Donor", sector: "International Development",
    location: "Accra, Ghana", website: "www.usaid.gov",
    contactEmail: "ghana@usaid.gov", contactPhone: "+233 302 741 200",
    contactCount: 2, status: "Agreement", dateAdded: "Feb 8, 2024",
    description: "United States Agency for International Development supports Ghana's development across health, education, and economic growth sectors.",
    address: "No. 24 Fourth Circular Road, Cantonments, Accra",
    contacts: [
      { id: 4, name: "David Miller", title: "Agreement Officer's Representative", email: "d.miller@usaid.gov", phone: "+233 302 741 210", role: "Primary Contact", department: "Economic Growth Office", lastInteraction: "Mar 1, 2026" },
      { id: 5, name: "Abena Frimpong", title: "Program Specialist", email: "a.frimpong@usaid.gov", phone: "+233 302 741 220", role: "Technical Contact", department: "Economic Growth Office", lastInteraction: "Feb 20, 2026" },
    ],
    engagements: [
      { id: 5, type: "Meeting", title: "Quarterly Program Review", date: "Mar 1, 2026", participants: ["David Miller", "Abena Frimpong", "James Owusu"], notes: "Reviewed quarterly deliverables and workplan for Q2.", outcome: "Workplan approved with modifications" },
      { id: 6, type: "Workshop", title: "M&E Framework Alignment", date: "Feb 5, 2026", participants: ["Abena Frimpong", "Grace Tetteh"], notes: "Aligned indicator definitions with USAID reporting requirements.", outcome: "M&E framework updated" },
    ],
    funds: [
      { id: 4, grantName: "Ghana Economic Growth Partnership", amount: 3200000, currency: "USD", status: "Active", startDate: "Oct 1, 2024", endDate: "Sep 30, 2027", disbursed: 900000, programArea: "Economic Growth" },
    ],
    projects: [
      { id: 3, projectName: "Ghana Economic Growth Partnership", role: "Funder", status: "Active", startDate: "Oct 2024", endDate: "Sep 2027", value: 3200000, programArea: "Economic Growth" },
    ],
  },
  {
    id: 3, name: "World Bank", type: "Donor", sector: "Multilateral Finance",
    location: "Washington, USA", website: "www.worldbank.org",
    contactEmail: "contact@worldbank.org", contactPhone: "+1 202 473 1000",
    contactCount: 2, status: "Pipeline", dateAdded: "Mar 1, 2024",
    description: "The World Bank Group provides financial and technical assistance to developing countries around the world.",
    address: "1818 H Street NW, Washington, DC 20433, USA",
    contacts: [
      { id: 6, name: "Jean-Pierre Ndongo", title: "Task Team Leader", email: "jndongo@worldbank.org", phone: "+1 202 473 2000", role: "Primary Contact", department: "Africa Region", lastInteraction: "Feb 25, 2026" },
      { id: 7, name: "Fatima Diallo", title: "Senior Economist", email: "fdiallo@worldbank.org", phone: "+1 202 473 3000", role: "Technical Advisor", department: "Macro & Fiscal Management", lastInteraction: "Jan 30, 2026" },
    ],
    engagements: [
      { id: 7, type: "Call", title: "Technical Assistance Discussion", date: "Feb 25, 2026", participants: ["Jean-Pierre Ndongo", "James Owusu"], notes: "Discussed potential TA engagement on fiscal policy analysis.", outcome: "ToR to be drafted" },
    ],
    funds: [
      { id: 5, grantName: "Africa Fiscal Policy TA", amount: 500000, currency: "USD", status: "Pipeline", startDate: "Jul 1, 2026", endDate: "Jun 30, 2028", disbursed: 0, programArea: "Fiscal Policy" },
    ],
    projects: [],
  },
  {
    id: 4, name: "Bill & Melinda Gates Foundation", type: "Donor", sector: "Philanthropy",
    location: "Seattle, USA", website: "www.gatesfoundation.org",
    contactEmail: "info@gatesfoundation.org", contactPhone: "+1 206 709 3100",
    contactCount: 2, status: "Pipeline", dateAdded: "Jan 22, 2024",
    description: "The Gates Foundation works to help all people lead healthy, productive lives through grants in global health, education, and economic opportunity.",
    address: "500 5th Ave N, Seattle, WA 98109, USA",
    contacts: [
      { id: 8, name: "Rachel Kim", title: "Program Officer", email: "r.kim@gatesfoundation.org", phone: "+1 206 709 3200", role: "Primary Contact", department: "Global Policy & Advocacy", lastInteraction: "Mar 10, 2026" },
      { id: 9, name: "Samuel Agyei", title: "Africa Strategy Lead", email: "s.agyei@gatesfoundation.org", phone: "+1 206 709 3300", role: "Strategy Contact", department: "Africa Team", lastInteraction: "Feb 28, 2026" },
    ],
    engagements: [
      { id: 8, type: "Meeting", title: "Strategy Alignment Session", date: "Mar 10, 2026", participants: ["Rachel Kim", "Samuel Agyei", "James Owusu"], notes: "Explored alignment between ACET strategy and Gates Foundation Africa priorities.", outcome: "LOI to be submitted for agricultural transformation" },
    ],
    funds: [
      { id: 6, grantName: "Agricultural Transformation Study", amount: 400000, currency: "USD", status: "Pipeline", startDate: "Jan 1, 2027", endDate: "Dec 31, 2028", disbursed: 0, programArea: "Agriculture" },
    ],
    projects: [],
  },
  {
    id: 5, name: "EU Development Fund", type: "Donor", sector: "International Development",
    location: "Brussels, Belgium", website: "www.eu-fund.org",
    contactEmail: "contact@eu-fund.org", contactPhone: "+32 2 299 1111",
    contactCount: 1, status: "Prospect", dateAdded: "Apr 10, 2024",
    description: "The European Development Fund is the main instrument for providing EU development aid to Africa.",
    contacts: [
      { id: 10, name: "Hans Mueller", title: "Program Manager", email: "h.mueller@eu-fund.org", phone: "+32 2 299 2222", role: "Primary Contact", department: "ACP Programs", lastInteraction: "Jan 15, 2026" },
    ],
    engagements: [
      { id: 9, type: "Email", title: "Proposal Follow-up", date: "Jan 15, 2026", participants: ["Hans Mueller"], notes: "Follow-up on submitted proposal for trade facilitation study.", outcome: "Under review — decision expected by Apr 2026" },
    ],
    funds: [],
    projects: [],
  },
  {
    id: 6, name: "African Development Bank", type: "Donor", sector: "Multilateral Finance",
    location: "Abidjan, Côte d'Ivoire", website: "www.afdb.org",
    contactEmail: "info@afdb.org", contactPhone: "+225 20 26 10 20",
    contactCount: 0, status: "Prospect", dateAdded: "Jun 5, 2024",
    description: "The African Development Bank Group aims to spur sustainable economic development and social progress in its regional member countries.",
    contacts: [],
    engagements: [],
    funds: [],
    projects: [],
  },
  {
    id: 7, name: "Ministry of Finance", type: "Government/Policymaker", sector: "Government",
    location: "Accra, Ghana", website: "www.mofep.gov.gh",
    contactEmail: "info@mof.gov.gh", contactPhone: "+233 302 665 132",
    contactCount: 1, status: "Agreement", dateAdded: "Feb 18, 2024",
    description: "The Ministry of Finance of Ghana is responsible for economic planning, fiscal policy, and public financial management.",
    contacts: [
      { id: 11, name: "Dr. Kwame Asante", title: "Director of Policy", email: "k.asante@mof.gov.gh", phone: "+233 302 665 140", role: "Primary Contact", department: "Policy Planning", lastInteraction: "Mar 8, 2026" },
    ],
    engagements: [
      { id: 10, type: "Meeting", title: "Policy Dialogue on Industrialization", date: "Mar 8, 2026", participants: ["Dr. Kwame Asante", "James Owusu"], notes: "Discussed findings from manufacturing sector study. Ministry expressed interest in joint publication.", outcome: "Joint policy brief to be developed" },
      { id: 11, type: "Workshop", title: "Fiscal Policy Workshop", date: "Nov 20, 2025", participants: ["Dr. Kwame Asante", "Finance Team"], notes: "Co-hosted workshop on fiscal consolidation strategies.", outcome: "Workshop report published" },
    ],
    funds: [],
    projects: [
      { id: 4, projectName: "Ghana Industrialization Study", role: "Partner", status: "Active", startDate: "Jan 2025", endDate: "Dec 2026", value: 0, programArea: "Industrial Policy" },
    ],
  },
  {
    id: 8, name: "Ministry of Health", type: "Government/Policymaker", sector: "Government",
    location: "Accra, Ghana", website: "www.moh.gov.gh",
    contactEmail: "info@moh.gov.gh", contactPhone: "+233 302 665 421",
    contactCount: 1, status: "Pipeline", dateAdded: "Mar 12, 2024",
    contacts: [
      { id: 12, name: "Dr. Akosua Mensah", title: "Chief Director", email: "a.mensah@moh.gov.gh", phone: "+233 302 665 430", role: "Primary Contact", department: "Administration", lastInteraction: "Feb 5, 2026" },
    ],
    engagements: [
      { id: 12, type: "Call", title: "Health Sector Review Discussion", date: "Feb 5, 2026", participants: ["Dr. Akosua Mensah"], notes: "Discussed collaboration on health financing study.", outcome: "MoU to be drafted" },
    ],
    funds: [],
    projects: [],
  },
  {
    id: 9, name: "Daily Graphic", type: "Media/Journalist", sector: "Media & Publishing",
    location: "Accra, Ghana", website: "www.dailygraphic.com.gh",
    contactEmail: "editor@dailygraphic.com.gh", contactPhone: "+233 302 228 911",
    contactCount: 1, status: "Pipeline", dateAdded: "May 3, 2024",
    contacts: [
      { id: 13, name: "Kwesi Owusu-Ansah", title: "Business Editor", email: "k.owusu@dailygraphic.com.gh", phone: "+233 302 228 920", role: "Media Contact", department: "Business Desk", lastInteraction: "Mar 12, 2026" },
    ],
    engagements: [
      { id: 13, type: "Email", title: "Press Release Distribution", date: "Mar 12, 2026", participants: ["Kwesi Owusu-Ansah"], notes: "Shared press release on new economic report launch.", outcome: "Article published Mar 14" },
    ],
    funds: [],
    projects: [],
  },
  {
    id: 10, name: "Ghana Broadcasting Corporation", type: "Media/Journalist", sector: "Broadcasting",
    location: "Accra, Ghana", website: "www.gbc.com.gh",
    contactEmail: "news@gbc.com.gh", contactPhone: "+233 302 768 312",
    contactCount: 1, status: "Prospect", dateAdded: "May 15, 2024",
    contacts: [
      { id: 14, name: "Nana Akua", title: "Senior Producer", email: "n.akua@gbc.com.gh", phone: "+233 302 768 320", role: "Media Contact", department: "News & Current Affairs", lastInteraction: "Feb 22, 2026" },
    ],
    engagements: [
      { id: 14, type: "Event", title: "TV Interview on Economic Outlook", date: "Feb 22, 2026", participants: ["Nana Akua", "James Owusu"], notes: "Live TV interview on GBC Breakfast Show about Africa economic outlook.", outcome: "Good viewership, positive feedback" },
    ],
    funds: [],
    projects: [],
  },
  {
    id: 11, name: "TechGhana Ltd", type: "Private Sector", sector: "Technology",
    location: "Accra, Ghana", website: "www.techghana.com",
    contactEmail: "info@techghana.com", contactPhone: "+233 302 500 100",
    contactCount: 1, status: "Pipeline", dateAdded: "Jul 8, 2024",
    contacts: [
      { id: 15, name: "Kofi Mensah", title: "CEO", email: "k.mensah@techghana.com", phone: "+233 302 500 110", role: "Executive Contact", department: "Management", lastInteraction: "Mar 1, 2026" },
    ],
    engagements: [
      { id: 15, type: "Meeting", title: "Tech Partnership Discussion", date: "Mar 1, 2026", participants: ["Kofi Mensah", "Eric Boateng"], notes: "Discussed potential IT partnership for data management systems.", outcome: "Proposal to be submitted" },
    ],
    funds: [],
    projects: [
      { id: 5, projectName: "M&E Data Management System", role: "Implementer", status: "Active", startDate: "Feb 2025", endDate: "Dec 2025", value: 45000, programArea: "IT" },
    ],
  },
  {
    id: 12, name: "WACSI", type: "CSO/Partner", sector: "Capacity Building",
    location: "Accra, Ghana", website: "www.wacsi.org",
    contactEmail: "info@wacsi.org", contactPhone: "+233 302 780 222",
    contactCount: 1, status: "Agreement", dateAdded: "Aug 20, 2024",
    description: "West Africa Civil Society Institute strengthens civil society in the region through capacity development and research.",
    contacts: [
      { id: 16, name: "Nana Asantewaa", title: "Executive Director", email: "n.asantewaa@wacsi.org", phone: "+233 302 780 230", role: "Primary Contact", department: "Management", lastInteraction: "Feb 15, 2026" },
    ],
    engagements: [
      { id: 16, type: "Workshop", title: "Joint Capacity Building Workshop", date: "Feb 15, 2026", participants: ["Nana Asantewaa", "Grace Tetteh"], notes: "Co-facilitated M&E training for CSOs in the sub-region.", outcome: "40 participants trained" },
    ],
    funds: [],
    projects: [
      { id: 6, projectName: "West Africa CSO Capacity Building", role: "Partner", status: "Active", startDate: "Jan 2025", endDate: "Jun 2026", value: 120000, programArea: "Capacity Building" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════════ */

const ORG_TYPE_FILTERS = ["All", "Donor", "Government/Policymaker", "Media/Journalist", "Private Sector", "CSO/Partner"];
const STATUS_FILTERS = ["All", "Prospect", "Pipeline", "Agreement"];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const getTypeColor = (type: string) => {
  switch (type) {
    case "Donor": return "bg-blue-50 text-blue-700 border border-blue-200";
    case "Government/Policymaker": return "bg-slate-100 text-slate-700 border border-slate-200";
    case "Media/Journalist": return "bg-purple-50 text-purple-700 border border-purple-200";
    case "Private Sector": return "bg-green-50 text-green-700 border border-green-200";
    case "CSO/Partner": return "bg-amber-50 text-amber-700 border border-amber-200";
    default: return "bg-slate-100 text-slate-700 border border-slate-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Prospect": return "bg-amber-50 text-amber-700";
    case "Pipeline": return "bg-blue-50 text-blue-700";
    case "Agreement": return "bg-purple-50 text-purple-700";
    default: return "bg-slate-100 text-slate-600";
  }
};

const ENGAGEMENT_COLORS: Record<string, string> = {
  Meeting: "bg-blue-100 text-blue-700",
  Call: "bg-emerald-100 text-emerald-700",
  Email: "bg-slate-100 text-slate-600",
  Event: "bg-purple-100 text-purple-700",
  Workshop: "bg-amber-100 text-amber-700",
  "Site Visit": "bg-teal-100 text-teal-700",
  Presentation: "bg-indigo-100 text-indigo-700",
};

const FUND_STATUS_COLORS: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Completed: "bg-slate-200 text-slate-600",
  Pipeline: "bg-blue-100 text-blue-700",
  Expired: "bg-red-100 text-red-600",
};

const PROJECT_STATUS_COLORS: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Completed: "bg-slate-200 text-slate-600",
  Planning: "bg-amber-100 text-amber-700",
};

type DetailTab = "info" | "contacts" | "engagements" | "funds" | "projects";

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

interface OrganizationsProps {
  onAddOrganization?: () => void;
}

export function Organizations({ onAddOrganization }: OrganizationsProps) {
  const [organizations, setOrganizations] = useState<Organization[]>(ORGANIZATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("info");
  const rowsPerPage = 10;

  const closeDropdowns = () => {
    setShowTypeDropdown(false);
  };

  // Helper to update an organization's status
  const updateOrgStatus = (orgId: number, newStatus: Organization["status"]) => {
    setOrganizations(prev => prev.map(o => o.id === orgId ? { ...o, status: newStatus } : o));
    if (selectedOrg && selectedOrg.id === orgId) {
      setSelectedOrg(prev => prev ? { ...prev, status: newStatus } : prev);
    }
  };

  // Compute tab counts from all orgs (before type/search filter for accurate counts)
  const statusCounts = STATUS_FILTERS.reduce<Record<string, number>>((acc, s) => {
    acc[s] = s === "All" ? organizations.length : organizations.filter(o => o.status === s).length;
    return acc;
  }, {});

  const filtered = organizations.filter((org) => {
    const matchesType = selectedType === "All" || org.type === selectedType;
    const matchesStatus = selectedStatus === "All" || org.status === selectedStatus;
    const matchesSearch =
      searchQuery === "" ||
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + rowsPerPage);

  /* ═══ FULL-SCREEN DETAIL VIEW ═══════════════════════════════════════════════ */
  if (selectedOrg) {
    const org = selectedOrg;
    const totalFunding = org.funds.reduce((s, f) => s + f.amount, 0);
    const totalDisbursed = org.funds.reduce((s, f) => s + f.disbursed, 0);

    const detailTabs: { key: DetailTab; label: string; icon: React.ReactNode; badge?: number }[] = [
      { key: "info", label: "Organization Info", icon: <Building2 size={13} /> },
      { key: "contacts", label: "Contact People", icon: <Users size={13} />, badge: org.contacts.length },
      { key: "engagements", label: "Engagements", icon: <MessageSquare size={13} />, badge: org.engagements.length },
      { key: "funds", label: "Funds & Grants", icon: <DollarSign size={13} />, badge: org.funds.length },
      { key: "projects", label: "Projects", icon: <Briefcase size={13} />, badge: org.projects.length },
    ];

    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        {/* Detail Header */}
        <div className="bg-white border-b border-slate-200 shrink-0">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => { setSelectedOrg(null); setDetailTab("info"); }} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft size={18} />
                <span className="text-[13px] font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B01D0]/10 flex items-center justify-center">
                  <Building2 size={18} className="text-[#0B01D0]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-[18px] font-semibold text-slate-900">{org.name}</h1>
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", getTypeColor(org.type))}>{org.type}</span>
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", getStatusColor(org.status))}>{org.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{org.sector} — {org.location}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Edit2 size={13} /> Edit</button>
              <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Download size={13} /> Export</button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="px-6 pb-3 flex gap-3">
            {[
              { label: "Contacts", value: String(org.contacts.length), icon: <Users size={12} className="text-[#0B01D0]" />, bg: "bg-[#0B01D0]/10" },
              { label: "Engagements", value: String(org.engagements.length), icon: <MessageSquare size={12} className="text-purple-600" />, bg: "bg-purple-50" },
              { label: "Total Funding", value: totalFunding > 0 ? fmt(totalFunding) : "—", icon: <DollarSign size={12} className="text-emerald-600" />, bg: "bg-emerald-50" },
              { label: "Disbursed", value: totalDisbursed > 0 ? fmt(totalDisbursed) : "—", icon: <TrendingUp size={12} className="text-amber-600" />, bg: "bg-amber-50" },
              { label: "Projects", value: String(org.projects.length), icon: <Briefcase size={12} className="text-blue-600" />, bg: "bg-blue-50" },
            ].map((card, i) => (
              <div key={i} className="flex-1 bg-slate-50 rounded-lg border border-slate-100 px-3 py-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className={cn("w-5 h-5 rounded flex items-center justify-center", card.bg)}>{card.icon}</div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">{card.label}</span>
                </div>
                <p className="text-[15px] text-slate-800 font-semibold">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Pipeline → Agreement promotion banner */}
          {org.status === "Pipeline" && org.type === "Donor" && (
            <div className="mx-6 my-3 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <TrendingUp size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-blue-800">Ready for Agreement</p>
                  <p className="text-[11px] text-blue-600 mt-0.5">{org.name} is in the pipeline. When discussions conclude, create an agreement to formalize the partnership.</p>
                </div>
              </div>
              <button
                onClick={() => updateOrgStatus(org.id, "Agreement")}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] shadow-sm shrink-0"
              >
                <FileText size={13} /> Create Agreement
              </button>
            </div>
          )}

          {/* Agreement confirmed banner */}
          {org.status === "Agreement" && org.type === "Donor" && (
            <div className="mx-6 my-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-emerald-800">Agreement Stage</p>
                  <p className="text-[11px] text-emerald-600 mt-0.5">{org.name} has reached the agreement stage. Grant agreement is being formalized.</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-[12px] font-semibold hover:bg-emerald-700 shadow-sm shrink-0">
                <FileText size={13} /> View Agreement
              </button>
            </div>
          )}

          {/* Detail Tabs */}
          <div className="px-6 pb-0">
            <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
              {detailTabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setDetailTab(t.key)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[11px] transition-colors flex items-center gap-1.5 font-medium",
                    detailTab === t.key ? "bg-[#0B01D0] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {t.icon}
                  {t.label}
                  {t.badge !== undefined && t.badge > 0 && (
                    <span className={cn("px-1.5 py-0.5 rounded-full text-[9px]", detailTab === t.key ? "bg-white/20" : "bg-slate-200/80")}>{t.badge}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detail Body */}
        <div className="flex-1 overflow-auto">
          {/* ��─ ORGANIZATION INFO ── */}
          {detailTab === "info" && (
            <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-indigo-50 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center"><Building2 size={13} className="text-[#0B01D0]" /></div>
                    <h2 className="text-[13px] font-semibold text-slate-800">General Information</h2>
                  </div>
                  <div className="p-5 divide-y divide-slate-100">
                    {[
                      ["Organization Name", org.name],
                      ["Type", org.type],
                      ["Sector", org.sector],
                      ["Status", org.status],
                      ["Date Added", org.dateAdded],
                    ].map(([label, value], i) => (
                      <div key={i} className="flex items-center justify-between py-2.5">
                        <span className="text-[11px] text-slate-500">{label}</span>
                        <span className="text-[11px] text-slate-800 font-medium text-right max-w-[60%] truncate">{value}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-purple-50 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center"><Mail size={13} className="text-purple-600" /></div>
                    <h2 className="text-[13px] font-semibold text-slate-800">Contact Details</h2>
                  </div>
                  <div className="p-5 divide-y divide-slate-100">
                    {[
                      ["Email", org.contactEmail, <Mail size={12} className="text-slate-400" key="e" />],
                      ["Phone", org.contactPhone, <Phone size={12} className="text-slate-400" key="p" />],
                      ["Website", org.website, <Globe size={12} className="text-slate-400" key="w" />],
                      ["Location", org.location, <MapPin size={12} className="text-slate-400" key="l" />],
                    ].map(([label, value, icon], i) => (
                      <div key={i} className="flex items-center justify-between py-2.5">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1.5">{icon} {label as string}</span>
                        <span className="text-[11px] text-slate-800 font-medium text-right max-w-[60%] truncate">{value as string}</span>
                      </div>
                    ))}
                    {org.address && (
                      <div className="py-2.5">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1"><MapPin size={12} className="text-slate-400" /> Address</span>
                        <p className="text-[11px] text-slate-800 font-medium">{org.address}</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {org.description && (
                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center"><FileText size={13} className="text-emerald-600" /></div>
                    <h2 className="text-[13px] font-semibold text-slate-800">Description</h2>
                  </div>
                  <div className="p-5">
                    <p className="text-[12px] text-slate-600 leading-relaxed">{org.description}</p>
                  </div>
                </section>
              )}

              {/* Quick Stats */}
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-amber-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center"><Target size={13} className="text-amber-600" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Relationship Summary</h2>
                </div>
                <div className="p-5 grid grid-cols-4 gap-4">
                  {[
                    { label: "Total Contacts", value: org.contacts.length, color: "text-[#0B01D0]" },
                    { label: "Engagements (YTD)", value: org.engagements.filter(e => e.date.includes("2026")).length, color: "text-purple-600" },
                    { label: "Active Grants", value: org.funds.filter(f => f.status === "Active").length, color: "text-emerald-600" },
                    { label: "Active Projects", value: org.projects.filter(p => p.status === "Active").length, color: "text-blue-600" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg border border-slate-100 p-3 text-center">
                      <p className="text-[22px] font-semibold text-slate-800">{stat.value}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ── CONTACT PEOPLE ── */}
          {detailTab === "contacts" && (
            <div className="flex-1 overflow-auto">
              <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
                <p className="text-[12px] text-slate-500">{org.contacts.length} contact person(s)</p>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]"><Plus size={12} /> Add Contact</button>
              </div>
              {org.contacts.length > 0 ? (
                <table className="w-full">
                  <thead style={{ backgroundColor: "#0B01D0" }}>
                    <tr>
                      {["Name", "Title", "Department", "Role", "Email", "Phone", "Last Interaction"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {org.contacts.map((contact, i) => (
                      <tr key={contact.id} className={cn("hover:bg-slate-50 transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#0B01D0]/10 flex items-center justify-center shrink-0">
                              <span className="text-[9px] font-semibold text-[#0B01D0]">{contact.name.split(" ").map(n => n[0]).join("")}</span>
                            </div>
                            <span className="text-[11px] font-medium text-slate-800">{contact.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">{contact.title}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">{contact.department}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#0B01D0]/10 text-[#0B01D0]">{contact.role}</span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">{contact.email}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">{contact.phone}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-500">{contact.lastInteraction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <Users size={24} className="text-slate-300 mb-2" />
                  <p className="text-[13px] text-slate-400">No contacts linked to this organization</p>
                </div>
              )}
            </div>
          )}

          {/* ── ENGAGEMENTS ── */}
          {detailTab === "engagements" && (
            <div className="flex-1 overflow-auto">
              <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
                <p className="text-[12px] text-slate-500">{org.engagements.length} engagement(s) recorded</p>
                <button
                  onClick={() => {
                    // Auto-advance: Prospect → Pipeline on first engagement
                    if (org.status === "Prospect") updateOrgStatus(org.id, "Pipeline");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]"
                ><Plus size={12} /> Log Engagement</button>
              </div>
              {org.engagements.length > 0 ? (
                <div className="max-w-5xl mx-auto py-6 px-4 space-y-4">
                  {org.engagements.map(eng => (
                    <div key={eng.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow">
                      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", ENGAGEMENT_COLORS[eng.type] || "bg-slate-100 text-slate-600")}>{eng.type}</span>
                          <h3 className="text-[13px] font-semibold text-slate-800">{eng.title}</h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Calendar size={11} />
                          <span className="text-[11px]">{eng.date}</span>
                        </div>
                      </div>
                      <div className="p-5 space-y-3">
                        <div>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Participants</p>
                          <div className="flex flex-wrap gap-1.5">
                            {eng.participants.map((p, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600">{p}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Notes</p>
                          <p className="text-[11px] text-slate-700">{eng.notes}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Outcome</p>
                            <p className="text-[11px] text-slate-700">{eng.outcome}</p>
                          </div>
                          {eng.followUp && (
                            <div>
                              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Follow-Up</p>
                              <p className="text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded">{eng.followUp}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <MessageSquare size={24} className="text-slate-300 mb-2" />
                  <p className="text-[13px] text-slate-400">No engagements recorded</p>
                </div>
              )}
            </div>
          )}

          {/* ── FUNDS & GRANTS ── */}
          {detailTab === "funds" && (
            <div className="flex-1 overflow-auto">
              <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-[12px] text-slate-500">Total: <span className="font-semibold text-emerald-600">{totalFunding > 0 ? fmt(totalFunding) : "—"}</span></p>
                  <div className="h-4 w-px bg-slate-200" />
                  <p className="text-[12px] text-slate-500">Disbursed: <span className="font-semibold text-amber-600">{totalDisbursed > 0 ? fmt(totalDisbursed) : "—"}</span></p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]"><Plus size={12} /> Add Grant</button>
              </div>
              {org.funds.length > 0 ? (
                <table className="w-full">
                  <thead style={{ backgroundColor: "#0B01D0" }}>
                    <tr>
                      {["Grant Name", "Program Area", "Amount", "Disbursed", "Progress", "Status", "Start Date", "End Date"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {org.funds.map((fund, i) => {
                      const pct = fund.amount > 0 ? Math.round((fund.disbursed / fund.amount) * 100) : 0;
                      return (
                        <tr key={fund.id} className={cn("hover:bg-slate-50 transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
                          <td className="px-4 py-3 text-[11px] text-slate-800 font-medium max-w-[200px]">{fund.grantName}</td>
                          <td className="px-4 py-3 text-[11px] text-slate-600">{fund.programArea}</td>
                          <td className="px-4 py-3 text-[11px] text-slate-700 font-medium">{fmt(fund.amount)}</td>
                          <td className="px-4 py-3 text-[11px] text-slate-700">{fmt(fund.disbursed)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-slate-100 rounded-full h-1.5 min-w-[60px]">
                                <div className={cn("h-1.5 rounded-full", pct >= 80 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-blue-500")} style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-[10px] text-slate-500 w-8">{pct}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", FUND_STATUS_COLORS[fund.status])}>{fund.status}</span>
                          </td>
                          <td className="px-4 py-3 text-[11px] text-slate-600">{fund.startDate}</td>
                          <td className="px-4 py-3 text-[11px] text-slate-600">{fund.endDate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <DollarSign size={24} className="text-slate-300 mb-2" />
                  <p className="text-[13px] text-slate-400">No funds or grants linked</p>
                </div>
              )}
            </div>
          )}

          {/* ── PROJECTS ── */}
          {detailTab === "projects" && (
            <div className="flex-1 overflow-auto">
              <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
                <p className="text-[12px] text-slate-500">{org.projects.length} project(s) linked</p>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]"><Plus size={12} /> Link Project</button>
              </div>
              {org.projects.length > 0 ? (
                <table className="w-full">
                  <thead style={{ backgroundColor: "#0B01D0" }}>
                    <tr>
                      {["Project Name", "Program Area", "Role", "Status", "Value", "Start", "End"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {org.projects.map((proj, i) => (
                      <tr key={proj.id} className={cn("hover:bg-slate-50 transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
                        <td className="px-4 py-3 text-[11px] text-[#0B01D0] font-medium">{proj.projectName}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">{proj.programArea}</td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                            proj.role === "Funder" ? "bg-emerald-100 text-emerald-700" :
                            proj.role === "Partner" ? "bg-blue-100 text-blue-700" :
                            "bg-purple-100 text-purple-700"
                          )}>{proj.role}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", PROJECT_STATUS_COLORS[proj.status])}>{proj.status}</span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-700 font-medium">{proj.value > 0 ? fmt(proj.value) : "—"}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">{proj.startDate}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">{proj.endDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <Briefcase size={24} className="text-slate-300 mb-2" />
                  <p className="text-[13px] text-slate-400">No projects linked to this organization</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ═══ LIST VIEW ═════════════════════════════════════════════════════════════ */
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-slate-900">Organizations</h1>
            <p className="text-[12px] text-slate-400 mt-0.5">Manage partner organizations, donors, government stakeholders, and media contacts</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Download size={14} /> Export</button>
            <button onClick={onAddOrganization} className="flex items-center gap-1.5 px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-medium hover:bg-[#0a01b8] shadow-sm"><Plus size={14} /> Add Organization</button>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
            {STATUS_FILTERS.map(status => (
              <button
                key={status}
                onClick={() => { setSelectedStatus(status); setCurrentPage(1); }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1.5",
                  selectedStatus === status ? "bg-[#0B01D0] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {status}
                <span className={cn("px-1.5 py-0.5 rounded-full text-[9px]", selectedStatus === status ? "bg-white/20" : "bg-slate-200/80")}>
                  {statusCounts[status] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Type Filter */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white w-64">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="flex-1 outline-none text-[12px] text-slate-700 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setCurrentPage(1); }}>
                <X size={13} className="text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Type Filter */}
            <div className="relative">
              <button
                onClick={() => { closeDropdowns(); setShowTypeDropdown(!showTypeDropdown); }}
                className={cn("flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-slate-50 transition-colors text-[12px] min-w-[130px]",
                  selectedType !== "All" ? "border-[#0B01D0]/30 bg-[#0B01D0]/5" : "border-slate-200 bg-white"
                )}
              >
                <span className="text-slate-700 truncate">{selectedType === "All" ? "All Types" : selectedType}</span>
                <ChevronDown size={13} className="text-slate-400 shrink-0" />
              </button>
              {showTypeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowTypeDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                    {ORG_TYPE_FILTERS.map((type) => (
                      <button
                        key={type}
                        onClick={() => { setSelectedType(type); setShowTypeDropdown(false); setCurrentPage(1); }}
                        className={cn("w-full px-3 py-2 text-left text-[12px] hover:bg-slate-50 transition-colors",
                          selectedType === type ? "bg-[#0B01D0]/5 text-[#0B01D0] font-medium" : "text-slate-700"
                        )}
                      >
                        {type === "All" ? "All Types" : type}
                      </button>
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
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              {["Organization", "Type", "Sector", "Location", "Contacts", "Status", "Date Added", "Action"].map(h => (
                <th key={h} className={cn("px-4 py-3 text-[11px] font-semibold text-white", h === "Action" ? "text-center" : "text-left")}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <p className="text-[13px] text-slate-400">No organizations match your filters.</p>
                  <button
                    onClick={() => { setSearchQuery(""); setSelectedType("All"); setSelectedStatus("All"); setCurrentPage(1); }}
                    className="mt-2 text-[12px] text-[#0B01D0] hover:underline"
                  >
                    Clear all filters
                  </button>
                </td>
              </tr>
            ) : (
              paginated.map((org, idx) => (
                <tr
                  key={org.id}
                  onClick={() => { setSelectedOrg(org); setDetailTab("info"); }}
                  className={cn("hover:bg-slate-50 cursor-pointer transition-colors", idx % 2 === 1 && "bg-slate-50/50")}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0B01D0]/10 flex items-center justify-center shrink-0">
                        <Building2 size={14} className="text-[#0B01D0]" />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <p className="text-[11px] font-medium text-slate-800 truncate">{org.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{org.website}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", getTypeColor(org.type))}>
                      {org.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">{org.sector}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={11} className="text-slate-400 shrink-0" />
                      <p className="text-[11px] text-slate-600 truncate">{org.location}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Users size={11} className="text-slate-400" />
                      <span className="text-[11px] text-slate-800 font-medium">{org.contactCount}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", getStatusColor(org.status))}>
                      {org.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-500">{org.dateAdded}</td>
                  <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                    <div className="relative inline-block">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === org.id ? null : org.id)}
                        className="inline-flex items-center justify-center w-8 h-8 hover:bg-slate-100 rounded transition-colors"
                      >
                        <MoreHorizontal size={16} className="text-slate-400" />
                      </button>
                      {showActionMenu === org.id && (
                        <>
                          <div className="fixed inset-0 z-[100]" onClick={() => setShowActionMenu(null)} />
                          <div className="absolute right-0 top-full mt-1 z-[101] w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                            <button
                              onClick={() => { setShowActionMenu(null); setSelectedOrg(org); setDetailTab("info"); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50"
                            >
                              <Eye size={13} className="text-slate-400" /> View Details
                            </button>
                            <button
                              onClick={() => setShowActionMenu(null)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50"
                            >
                              <Edit2 size={13} className="text-slate-400" /> Edit
                            </button>
                            <div className="border-t border-slate-100 my-1" />
                            <button
                              onClick={() => setShowActionMenu(null)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={13} className="text-red-400" /> Remove
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
        <span className="text-[11px] text-slate-400">
          {filtered.length > 0 ? `${startIndex + 1}–${Math.min(startIndex + rowsPerPage, filtered.length)} of ` : ""}{filtered.length} organizations
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="px-2.5 py-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronDown size={14} className="rotate-90 text-slate-500" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn("px-2.5 py-1.5 text-[11px] rounded transition-colors",
                  page === currentPage ? "bg-[#0B01D0] text-white" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronDown size={14} className="-rotate-90 text-slate-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
