import { useState } from "react";
import {
  ArrowLeft, Printer, Mail, Phone, MapPin, Globe, Calendar, User, Building2,
  Plus, X, Clock, FileText, Video, Users, MessageSquare, ChevronDown, Shield,
  Briefcase, ExternalLink, Edit2, Star
} from "lucide-react";
import { cn } from "../lib/utils";

interface Contact {
  id: number;
  name: string;
  organization: string;
  type: string;
  engagementScore: number;
  engagementLevel: string;
  lead: string;
  lastInteraction: string;
}

interface ViewContactDetailsProps {
  contact: Contact;
  onBack: () => void;
}

type DepartmentTab = "Programs" | "Finance & Grants" | "Comms & Advocacy";

interface EngagementRecord {
  id: string;
  date: string;
  type: "Meeting" | "Call" | "Email" | "Event" | "Site Visit";
  subject: string;
  participants: string;
  outcome: string;
  nextSteps: string;
  department: DepartmentTab;
  confidential: boolean;
}

const DEPARTMENT_TABS: DepartmentTab[] = ["Programs", "Finance & Grants", "Comms & Advocacy"];

export function ViewContactDetails({ contact, onBack }: ViewContactDetailsProps) {
  const [activeTab, setActiveTab] = useState<DepartmentTab>("Programs");
  const [showRecordModal, setShowRecordModal] = useState(false);

  // Form state for the record engagement modal
  const [formDate, setFormDate] = useState("");
  const [formType, setFormType] = useState<EngagementRecord["type"]>("Meeting");
  const [formSubject, setFormSubject] = useState("");
  const [formParticipants, setFormParticipants] = useState("");
  const [formOutcome, setFormOutcome] = useState("");
  const [formNextSteps, setFormNextSteps] = useState("");
  const [formDepartment, setFormDepartment] = useState<DepartmentTab>("Programs");
  const [formConfidential, setFormConfidential] = useState(false);

  const emailDomain = contact.organization.toLowerCase().replace(/[^a-z0-9]/g, "");

  const extendedDetails = {
    email: `contact@${emailDomain}.org`,
    phone: "+233 30 123 4567",
    location: "Accra, Ghana",
    website: `www.${emailDomain}.org`,
    position: "Director of Programs",
    department: contact.organization,
    primaryFocus:
      contact.type === "Donor"
        ? ["Development Finance", "Capacity Building", "Grant Management"]
        : contact.type === "Government/Policymaker"
        ? ["Policy Development", "Public Services", "Stakeholder Relations"]
        : contact.type === "Media/Journalist"
        ? ["Communications", "Public Outreach", "Media Relations"]
        : contact.type === "CSO/Partner"
        ? ["Advocacy", "Community Development", "Research"]
        : ["Corporate Social Responsibility", "Technology", "Innovation"],
    relationshipStatus:
      contact.engagementLevel === "High"
        ? "Strategic Partner"
        : contact.engagementLevel === "Medium"
        ? "Active Engagement"
        : "Periodic Contact",
    notes: `${contact.name} has been a valued partner in our development initiatives. Regular communication maintained through quarterly meetings and project updates. Strong alignment with our organizational goals and mission.`,
  };

  // Mock engagement history — split by department
  const engagementHistory: EngagementRecord[] = [
    // Programs
    {
      id: "1", date: "Feb 25, 2026", type: "Meeting",
      subject: "Q1 2026 Partnership Review & Strategy Alignment",
      participants: `${contact.lead}, Program Team`,
      outcome: "Reviewed progress on current initiatives, discussed expansion opportunities",
      nextSteps: "Submit revised workplan by Mar 10, 2026",
      department: "Programs", confidential: false,
    },
    {
      id: "2", date: "Feb 10, 2026", type: "Site Visit",
      subject: "Community Health Project — Volta Region Field Visit",
      participants: `${contact.lead}, M&E Officer`,
      outcome: "Positive field observations, beneficiaries interviewed, data validated",
      nextSteps: "Compile field report and share with stakeholders",
      department: "Programs", confidential: false,
    },
    {
      id: "3", date: "Jan 18, 2026", type: "Call",
      subject: "Project Status Update — Climate Resilience",
      participants: contact.lead,
      outcome: "Updated on milestone achievements and budget utilization",
      nextSteps: "Prepare quarterly report for submission",
      department: "Programs", confidential: false,
    },
    {
      id: "4", date: "Dec 15, 2025", type: "Event",
      subject: "Annual Development Forum 2025",
      participants: `${contact.lead}, External Partners`,
      outcome: "Networking and knowledge exchange, identified collaboration areas",
      nextSteps: "Follow up on potential joint initiatives",
      department: "Programs", confidential: false,
    },
    {
      id: "5", date: "Nov 20, 2025", type: "Email",
      subject: "Concept Note Submission — Youth Employment",
      participants: contact.lead,
      outcome: "Concept note submitted for review and feedback",
      nextSteps: "Await feedback by Dec 5, 2025",
      department: "Programs", confidential: false,
    },
    // Finance & Grants
    {
      id: "6", date: "Feb 20, 2026", type: "Meeting",
      subject: "Grant Budget Reconciliation — FY2025 Close-out",
      participants: `Finance Director, ${contact.lead}`,
      outcome: "Reconciled expenditures against approved budget lines",
      nextSteps: "Submit final financial report by Mar 1, 2026",
      department: "Finance & Grants", confidential: true,
    },
    {
      id: "7", date: "Feb 5, 2026", type: "Email",
      subject: "Contract Amendment — Extended Disbursement Schedule",
      participants: "Finance Director",
      outcome: "Amendment terms shared for review, pending donor sign-off",
      nextSteps: "Circulate for internal legal review",
      department: "Finance & Grants", confidential: true,
    },
    {
      id: "8", date: "Jan 25, 2026", type: "Call",
      subject: "Compliance Audit Preparation Discussion",
      participants: `Finance Director, Audit Lead`,
      outcome: "Aligned on documentation requirements and timeline",
      nextSteps: "Organize supporting documents by Feb 1, 2026",
      department: "Finance & Grants", confidential: true,
    },
    {
      id: "9", date: "Dec 1, 2025", type: "Meeting",
      subject: "New Grant Negotiation — Phase II Funding",
      participants: `Finance Director, ${contact.lead}, Legal`,
      outcome: "Discussed budget ceiling, indirect cost rates, and payment milestones",
      nextSteps: "Draft grant agreement for legal review",
      department: "Finance & Grants", confidential: true,
    },
    // Comms & Advocacy
    {
      id: "10", date: "Feb 18, 2026", type: "Meeting",
      subject: "Joint Press Release — Partnership Announcement",
      participants: `Comms Lead, ${contact.lead}`,
      outcome: "Agreed on messaging, quotes, and release date",
      nextSteps: "Finalize press release copy by Feb 22",
      department: "Comms & Advocacy", confidential: false,
    },
    {
      id: "11", date: "Jan 30, 2026", type: "Call",
      subject: "Social Media Campaign Co-branding Discussion",
      participants: "Comms Lead",
      outcome: "Outlined content calendar and visual identity guidelines",
      nextSteps: "Share first draft of social media assets",
      department: "Comms & Advocacy", confidential: false,
    },
    {
      id: "12", date: "Jan 10, 2026", type: "Event",
      subject: "Advocacy Roundtable — Policy Brief Launch",
      participants: `Comms Lead, Advocacy Officer, ${contact.lead}`,
      outcome: "Successfully launched policy brief, media coverage secured",
      nextSteps: "Monitor media mentions, plan follow-up op-ed",
      department: "Comms & Advocacy", confidential: false,
    },
    {
      id: "13", date: "Dec 8, 2025", type: "Email",
      subject: "Impact Story Feature — Annual Report Contribution",
      participants: "Comms Lead",
      outcome: "Requested impact data and quotes for annual report feature",
      nextSteps: "Collect beneficiary testimonials and photos",
      department: "Comms & Advocacy", confidential: false,
    },
  ];

  const filteredEngagements = engagementHistory.filter((e) => e.department === activeTab);

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case "Donor": return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Government/Policymaker": return "bg-slate-100 text-slate-700 border border-slate-200";
      case "Media/Journalist": return "bg-purple-50 text-purple-700 border border-purple-200";
      case "Private Sector": return "bg-green-50 text-green-700 border border-green-200";
      case "CSO/Partner": return "bg-amber-50 text-amber-700 border border-amber-200";
      default: return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  const getEngagementLevelColor = (level: string) => {
    if (level === "High") return "bg-green-50 text-green-700";
    if (level === "Medium") return "bg-amber-50 text-amber-700";
    return "bg-red-50 text-red-700";
  };

  const getEngagementTypeIcon = (type: string) => {
    switch (type) {
      case "Meeting": return <Users size={13} />;
      case "Call": return <Phone size={13} />;
      case "Email": return <Mail size={13} />;
      case "Event": return <Calendar size={13} />;
      case "Site Visit": return <MapPin size={13} />;
      default: return <FileText size={13} />;
    }
  };

  const getEngagementTypeColor = (type: string) => {
    switch (type) {
      case "Meeting": return "bg-blue-50 text-blue-700";
      case "Call": return "bg-purple-50 text-purple-700";
      case "Email": return "bg-slate-100 text-slate-700";
      case "Event": return "bg-green-50 text-green-700";
      case "Site Visit": return "bg-amber-50 text-amber-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const engagementTypes: EngagementRecord["type"][] = ["Meeting", "Call", "Email", "Event", "Site Visit"];

  const departmentCounts = DEPARTMENT_TABS.reduce((acc, dept) => {
    acc[dept] = engagementHistory.filter((e) => e.department === dept).length;
    return acc;
  }, {} as Record<DepartmentTab, number>);

  const handleSubmitEngagement = () => {
    console.log("Recording engagement:", {
      date: formDate, type: formType, subject: formSubject,
      participants: formParticipants, outcome: formOutcome,
      nextSteps: formNextSteps, department: formDepartment,
      confidential: formConfidential,
    });
    setShowRecordModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormDate("");
    setFormType("Meeting");
    setFormSubject("");
    setFormParticipants("");
    setFormOutcome("");
    setFormNextSteps("");
    setFormDepartment("Programs");
    setFormConfidential(false);
  };

  const isFormValid = formDate && formSubject && formParticipants && formOutcome;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      {/* Sticky Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            <span>Back to Directory</span>
          </button>
          <span className="text-slate-300">|</span>
          <h1 className="text-2xl font-semibold text-slate-900">{contact.name}</h1>
          <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-xl text-[11px] font-medium", getContactTypeColor(contact.type))}>
            {contact.type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRecordModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Record Engagement
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600">
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-5 max-w-[1200px]">
          {/* Top Section: Profile Card + Quick Stats */}
          <div className="grid grid-cols-12 gap-5">
            {/* Profile Card */}
            <div className="col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
              {/* Blue banner */}
              <div className="h-20 bg-gradient-to-r from-blue-800 to-blue-600 relative">
                <div className="absolute -bottom-8 left-6">
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
                    <User size={28} className="text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="pt-12 px-6 pb-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{contact.name}</h2>
                    <p className="text-sm text-slate-500">{extendedDetails.position}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Building2 size={13} className="text-slate-400" />
                      <span className="text-sm text-slate-600">{contact.organization}</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600">
                    <Edit2 size={13} />
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Mail size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase">Email</p>
                      <p className="text-sm text-slate-900">{extendedDetails.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                      <Phone size={14} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase">Phone</p>
                      <p className="text-sm text-slate-900">{extendedDetails.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                      <MapPin size={14} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase">Location</p>
                      <p className="text-sm text-slate-900">{extendedDetails.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                      <Globe size={14} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase">Website</p>
                      <a href={`https://${extendedDetails.website}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        {extendedDetails.website}
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="col-span-4 space-y-5">
              {/* Engagement Level */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-[11px] text-slate-400 uppercase mb-2">Engagement Level</p>
                <div className="flex items-center gap-3 mb-3">
                  <span className={cn("inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold", getEngagementLevelColor(contact.engagementLevel))}>
                    {contact.engagementLevel}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        contact.engagementLevel === "High" ? "bg-green-500" :
                        contact.engagementLevel === "Medium" ? "bg-amber-500" : "bg-red-500"
                      )}
                      style={{ width: `${contact.engagementScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{contact.engagementScore}%</span>
                </div>
              </div>

              {/* Relationship Info */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase">Relationship Status</p>
                    <p className="text-sm font-medium text-slate-900 mt-0.5">{extendedDetails.relationshipStatus}</p>
                  </div>
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-[11px] text-slate-400 uppercase">Relationship Manager</p>
                    <p className="text-sm font-medium text-slate-900 mt-0.5">{contact.lead}</p>
                  </div>
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-[11px] text-slate-400 uppercase">Last Interaction</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock size={13} className="text-slate-400" />
                      <p className="text-sm text-slate-900">{contact.lastInteraction}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Focus Areas & Notes Row */}
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-5 bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-[11px] text-slate-400 uppercase mb-3">Primary Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {extendedDetails.primaryFocus.map((focus, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[12px] font-medium"
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </div>
            <div className="col-span-7 bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-[11px] text-slate-400 uppercase mb-3">Relationship Notes</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{extendedDetails.notes}</p>
            </div>
          </div>

          {/* Engagement History — Department Tabs */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Section header with tabs */}
            <div className="px-5 pt-5 pb-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] text-slate-400 uppercase">Engagement History</h3>
                <div className="flex items-center gap-2">
                  {activeTab === "Finance & Grants" && (
                    <div className="flex items-center gap-1.5 text-amber-600 text-[11px] font-medium bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                      <Shield size={12} />
                      Confidential — Visible to Finance & Grants only
                    </div>
                  )}
                </div>
              </div>
              {/* Document Vault pill tabs */}
              <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
                {DEPARTMENT_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-1.5 rounded-lg text-sm transition-colors min-w-[120px] flex items-center justify-center gap-1.5 ${
                      activeTab === tab
                        ? "bg-purple-700 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab}
                    <span className={cn(
                      "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-semibold",
                      activeTab === tab ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"
                    )}>
                      {departmentCounts[tab]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="mt-4">
              <table className="w-full">
                <thead style={{ backgroundColor: "#0B01D0" }}>
                  <tr>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold whitespace-nowrap w-28">Date</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold whitespace-nowrap w-24">Type</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold whitespace-nowrap">Subject</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold whitespace-nowrap w-40">Participants</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold whitespace-nowrap">Outcome</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold whitespace-nowrap">Next Steps</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEngagements.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center">
                        <p className="text-sm text-slate-400">No interactions recorded for {activeTab}.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredEngagements.map((engagement, idx) => (
                      <tr key={engagement.id} className={cn("border-b border-slate-100 hover:bg-slate-50", idx % 2 === 1 && "bg-slate-50/50")}>
                        <td className="px-4 py-3 text-[12px] text-slate-600 whitespace-nowrap">{engagement.date}</td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-medium whitespace-nowrap", getEngagementTypeColor(engagement.type))}>
                            {getEngagementTypeIcon(engagement.type)}
                            {engagement.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] text-slate-900 font-medium">{engagement.subject}</span>
                            {engagement.confidential && (
                              <Shield size={12} className="text-amber-500 shrink-0" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-600 whitespace-nowrap">{engagement.participants}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-600">{engagement.outcome}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-600">{engagement.nextSteps}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Record Engagement Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Record Engagement</h2>
                <p className="text-sm text-slate-500 mt-0.5">Log a new interaction with {contact.name}</p>
              </div>
              <button
                onClick={() => { setShowRecordModal(false); resetForm(); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto px-6 py-5 space-y-5">
              {/* Row 1: Date + Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase text-slate-500 font-medium mb-1.5 block">Date *</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase text-slate-500 font-medium mb-1.5 block">Engagement Type *</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as EngagementRecord["type"])}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 bg-white"
                  >
                    {engagementTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-[11px] uppercase text-slate-500 font-medium mb-1.5 block">Subject *</label>
                <input
                  type="text"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g., Quarterly project review meeting"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                />
              </div>

              {/* Participants */}
              <div>
                <label className="text-[11px] uppercase text-slate-500 font-medium mb-1.5 block">Participants *</label>
                <input
                  type="text"
                  value={formParticipants}
                  onChange={(e) => setFormParticipants(e.target.value)}
                  placeholder="e.g., J. Doe, Program Team"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                />
              </div>

              {/* Outcome */}
              <div>
                <label className="text-[11px] uppercase text-slate-500 font-medium mb-1.5 block">Outcome / Summary *</label>
                <textarea
                  value={formOutcome}
                  onChange={(e) => setFormOutcome(e.target.value)}
                  placeholder="Describe the key outcomes or decisions from this interaction..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 resize-none"
                />
              </div>

              {/* Next Steps */}
              <div>
                <label className="text-[11px] uppercase text-slate-500 font-medium mb-1.5 block">Next Steps</label>
                <textarea
                  value={formNextSteps}
                  onChange={(e) => setFormNextSteps(e.target.value)}
                  placeholder="What are the follow-up actions?"
                  rows={2}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 resize-none"
                />
              </div>

              {/* Row: Department + Confidential */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase text-slate-500 font-medium mb-1.5 block">Department *</label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value as DepartmentTab)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 bg-white"
                  >
                    {DEPARTMENT_TABS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formConfidential}
                      onChange={(e) => setFormConfidential(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500/20"
                    />
                    <div className="flex items-center gap-1.5">
                      <Shield size={14} className="text-amber-500" />
                      <span className="text-sm text-slate-700">Mark as Confidential</span>
                    </div>
                  </label>
                </div>
              </div>

              {formConfidential && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-2.5">
                  <Shield size={16} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-[12px] text-amber-700">
                    This interaction will only be visible to users with access to the <strong>{formDepartment}</strong> tab. Other departments will not see this record.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => { setShowRecordModal(false); resetForm(); }}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEngagement}
                disabled={!isFormValid}
                className="px-5 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                Record Engagement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
