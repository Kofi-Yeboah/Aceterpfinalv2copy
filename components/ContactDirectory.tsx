import { useState } from "react";
import { ChevronDown, Plus, Search, MoreHorizontal, Mail, Phone, X, User, Building2 } from "lucide-react";
import { cn } from "../lib/utils";
import { AddNewContactForm } from "./AddNewContactForm";
import { ViewContactDetails } from "./ViewContactDetails";
import { Organizations } from "./Organizations";
import { AddNewOrganizationForm } from "./AddNewOrganizationForm";

// Contact people focused data — multiple contacts per donor organization
const CONTACTS = [
  {
    id: 1,
    contactPerson: "Kwame Asante",
    email: "k.asante@fordfoundation.org",
    phone: "+1 212 573 5000",
    department: "Finance & Grants",
    donor: "Ford Foundation",
    contactType: "Donor",
    engagementLevel: "High",
    lead: "J. Doe",
    lastInteraction: "2 Days Ago",
  },
  {
    id: 2,
    contactPerson: "Abena Mensah",
    email: "a.mensah@fordfoundation.org",
    phone: "+1 212 573 5100",
    department: "West Africa Programs",
    donor: "Ford Foundation",
    contactType: "Donor",
    engagementLevel: "High",
    lead: "J. Doe",
    lastInteraction: "1 Wk Ago",
  },
  {
    id: 3,
    contactPerson: "Linda Ofosu",
    email: "l.ofosu@fordfoundation.org",
    phone: "+1 212 573 5200",
    department: "Monitoring & Evaluation",
    donor: "Ford Foundation",
    contactType: "Donor",
    engagementLevel: "High",
    lead: "S. Amari",
    lastInteraction: "3 Days Ago",
  },
  {
    id: 4,
    contactPerson: "James Thornton",
    email: "j.thornton@usaid.gov",
    phone: "+233 302 741 200",
    department: "Ghana Mission",
    donor: "USAID",
    contactType: "Donor",
    engagementLevel: "High",
    lead: "J. Doe",
    lastInteraction: "1 Day Ago",
  },
  {
    id: 5,
    contactPerson: "Sarah Williams",
    email: "s.williams@usaid.gov",
    phone: "+233 302 741 210",
    department: "Financial Management",
    donor: "USAID",
    contactType: "Donor",
    engagementLevel: "High",
    lead: "S. Amari",
    lastInteraction: "5 Days Ago",
  },
  {
    id: 6,
    contactPerson: "Claire Dupont",
    email: "c.dupont@worldbank.org",
    phone: "+1 202 473 1000",
    department: "Africa Region",
    donor: "World Bank",
    contactType: "Donor",
    engagementLevel: "High",
    lead: "S. Amari",
    lastInteraction: "3 Days Ago",
  },
  {
    id: 7,
    contactPerson: "Peter Adjei",
    email: "p.adjei@worldbank.org",
    phone: "+1 202 473 1050",
    department: "Governance & Public Sector",
    donor: "World Bank",
    contactType: "Donor",
    engagementLevel: "Medium",
    lead: "J. Doe",
    lastInteraction: "2 Wks Ago",
  },
  {
    id: 8,
    contactPerson: "Hans Mueller",
    email: "h.mueller@gatesfoundation.org",
    phone: "+1 206 709 3100",
    department: "Agri-Tech Division",
    donor: "Bill & Melinda Gates Foundation",
    contactType: "Donor",
    engagementLevel: "High",
    lead: "J. Doe",
    lastInteraction: "Yesterday",
  },
  {
    id: 9,
    contactPerson: "Fatima Al-Hassan",
    email: "f.alhassan@gatesfoundation.org",
    phone: "+1 206 709 3150",
    department: "Global Development",
    donor: "Bill & Melinda Gates Foundation",
    contactType: "Donor",
    engagementLevel: "Medium",
    lead: "S. Amari",
    lastInteraction: "1 Wk Ago",
  },
  {
    id: 10,
    contactPerson: "Hon. Kwaku Mensah",
    email: "k.mensah@mof.gov.gh",
    phone: "+233 302 665 132",
    department: "Policy Unit",
    donor: "Ministry of Finance",
    contactType: "Government/Policymaker",
    engagementLevel: "Medium",
    lead: "S. Amari",
    lastInteraction: "1 Wk Ago",
  },
  {
    id: 11,
    contactPerson: "Dr. Ama Boateng",
    email: "a.boateng@moh.gov.gh",
    phone: "+233 302 665 421",
    department: "Public Health Unit",
    donor: "Ministry of Health",
    contactType: "Government/Policymaker",
    engagementLevel: "Medium",
    lead: "S. Amari",
    lastInteraction: "5 Days Ago",
  },
  {
    id: 12,
    contactPerson: "Kofi Osei",
    email: "k.osei@dailygraphic.com.gh",
    phone: "+233 302 228 911",
    department: "Editorial Board",
    donor: "Daily Graphic",
    contactType: "Media/Journalist",
    engagementLevel: "Low",
    lead: "K. Osei",
    lastInteraction: "3 Wks Ago",
  },
  {
    id: 13,
    contactPerson: "Nana Akua Serwaa",
    email: "n.serwaa@gbc.com.gh",
    phone: "+233 302 768 312",
    department: "News Division",
    donor: "Ghana Broadcasting Corporation",
    contactType: "Media/Journalist",
    engagementLevel: "Medium",
    lead: "K. Osei",
    lastInteraction: "2 Wks Ago",
  },
  {
    id: 14,
    contactPerson: "Michael Chen",
    email: "m.chen@eu-fund.org",
    phone: "+32 2 299 1111",
    department: "Africa Directorate",
    donor: "EU Development Fund",
    contactType: "Donor",
    engagementLevel: "High",
    lead: "J. Doe",
    lastInteraction: "4 Days Ago",
  },
  {
    id: 15,
    contactPerson: "Emmanuel Osei-Bonsu",
    email: "e.osei@techghana.com",
    phone: "+233 302 500 100",
    department: "Corporate Partnerships",
    donor: "TechGhana Ltd",
    contactType: "Private Sector",
    engagementLevel: "Medium",
    lead: "J. Doe",
    lastInteraction: "1 Wk Ago",
  },
  {
    id: 16,
    contactPerson: "Dr. Patience Agyemang",
    email: "p.agyemang@wacsi.org",
    phone: "+233 302 780 222",
    department: "Capacity Building",
    donor: "WACSI",
    contactType: "CSO/Partner",
    engagementLevel: "High",
    lead: "S. Amari",
    lastInteraction: "3 Days Ago",
  },
];

const CONTACT_TYPES = [
  "All",
  "Donor",
  "Government/Policymaker",
  "Media/Journalist",
  "Private Sector",
  "CSO/Partner",
];
const ENGAGEMENT_LEVELS = ["All", "High", "Medium", "Low"];
const DONORS = ["All", ...Array.from(new Set(CONTACTS.map((c) => c.donor)))];

export function ContactDirectory() {
  const [activeTab, setActiveTab] = useState<"contacts" | "organizations">("contacts");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedEngagement, setSelectedEngagement] = useState("All");
  const [selectedDonor, setSelectedDonor] = useState("All");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showEngagementDropdown, setShowEngagementDropdown] = useState(false);
  const [showDonorDropdown, setShowDonorDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  const [viewContactId, setViewContactId] = useState<number | null>(null);

  // Get contact type badge color
  const getContactTypeColor = (contactType: string) => {
    switch (contactType) {
      case "Donor":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Government/Policymaker":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      case "Media/Journalist":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "Private Sector":
        return "bg-green-50 text-green-700 border border-green-200";
      case "CSO/Partner":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  // Get engagement level badge color
  const getEngagementColor = (level: string) => {
    if (level === "High") return "bg-green-50 text-green-700";
    if (level === "Medium") return "bg-amber-50 text-amber-700";
    return "bg-red-50 text-red-700";
  };

  // Filter contacts
  const filteredContacts = CONTACTS.filter((contact) => {
    const matchesType = selectedType === "All" || contact.contactType === selectedType;
    const matchesEngagement = selectedEngagement === "All" || contact.engagementLevel === selectedEngagement;
    const matchesDonor = selectedDonor === "All" || contact.donor === selectedDonor;
    const matchesSearch =
      searchQuery === "" ||
      contact.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesEngagement && matchesDonor && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + rowsPerPage);

  const handleSave = (data: any) => {
    console.log("Saving contact data:", data);
    setShowForm(false);
  };

  // If form is shown, render the form instead of the directory
  if (showForm) {
    return <AddNewContactForm onBack={() => setShowForm(false)} onSave={handleSave} />;
  }

  // If org form is shown, render the add new organization form
  if (showOrgForm) {
    return (
      <AddNewOrganizationForm
        onBack={() => setShowOrgForm(false)}
        onSave={(data: any) => {
          console.log("Saving organization:", data);
          setShowOrgForm(false);
        }}
      />
    );
  }

  // If view contact is shown, render the view contact details instead of the directory
  if (viewContactId !== null) {
    const contact = CONTACTS.find((c) => c.id === viewContactId);
    if (contact) {
      return (
        <ViewContactDetails
          contact={{
            id: contact.id,
            name: contact.contactPerson,
            organization: contact.donor,
            type: contact.contactType,
            engagementScore: contact.engagementLevel === "High" ? 90 : contact.engagementLevel === "Medium" ? 60 : 30,
            engagementLevel: contact.engagementLevel,
            lead: contact.lead,
            lastInteraction: contact.lastInteraction,
          }}
          onBack={() => setViewContactId(null)}
        />
      );
    }
  }

  const closeAllDropdowns = () => {
    setShowTypeDropdown(false);
    setShowEngagementDropdown(false);
    setShowDonorDropdown(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-semibold text-slate-900">Contact Management</h1>
        <button
          onClick={() => activeTab === "contacts" ? setShowForm(true) : setShowOrgForm(true)}
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={16} />
          {activeTab === "contacts" ? "Add New Contact" : "Add New Organization"}
        </button>
      </div>

      {/* Pill Tabs */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          <button
            onClick={() => setActiveTab("contacts")}
            className={`px-5 py-1.5 rounded-lg text-sm transition-colors min-w-[120px] flex items-center justify-center gap-1.5 ${
              activeTab === "contacts"
                ? "bg-purple-700 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <User size={14} />
            Contacts
          </button>
          <button
            onClick={() => setActiveTab("organizations")}
            className={`px-5 py-1.5 rounded-lg text-sm transition-colors min-w-[120px] flex items-center justify-center gap-1.5 ${
              activeTab === "organizations"
                ? "bg-purple-700 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Building2 size={14} />
            Organizations
          </button>
        </div>
      </div>

      {activeTab === "organizations" ? (
        <Organizations onAddOrganization={() => setShowOrgForm(true)} />
      ) : (
      <>
      {/* Filters Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between gap-3">
          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-64">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search contacts, donors..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setCurrentPage(1); }}>
                <X size={14} className="text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Donor Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setShowDonorDropdown(!showDonorDropdown);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 border rounded-lg hover:bg-slate-50 transition-colors shadow-sm min-w-[160px] ${
                  selectedDonor !== "All" ? "border-purple-300 bg-purple-50" : "border-slate-200 bg-white"
                }`}
              >
                <span className="text-sm text-slate-900 truncate max-w-[140px]">{selectedDonor === "All" ? "All Donors" : selectedDonor}</span>
                <ChevronDown size={16} className="text-purple-700 flex-shrink-0" />
              </button>
              {showDonorDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDonorDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
                    {DONORS.map((donor) => (
                      <button
                        key={donor}
                        onClick={() => {
                          setSelectedDonor(donor);
                          setShowDonorDropdown(false);
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                          selectedDonor === donor ? "bg-purple-50 text-purple-700 font-medium" : "text-slate-700"
                        )}
                      >
                        {donor === "All" ? "All Donors" : donor}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Contact Type Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setShowTypeDropdown(!showTypeDropdown);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 border rounded-lg hover:bg-slate-50 transition-colors shadow-sm min-w-[140px] ${
                  selectedType !== "All" ? "border-purple-300 bg-purple-50" : "border-slate-200 bg-white"
                }`}
              >
                <span className="text-sm text-slate-900 truncate max-w-[140px]">{selectedType === "All" ? "All Contact Types" : selectedType}</span>
                <ChevronDown size={16} className="text-purple-700 flex-shrink-0" />
              </button>
              {showTypeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowTypeDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
                    {CONTACT_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedType(type);
                          setShowTypeDropdown(false);
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                          selectedType === type ? "bg-purple-50 text-purple-700 font-medium" : "text-slate-700"
                        )}
                      >
                        {type === "All" ? "All Contact Types" : type}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Engagement Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setShowEngagementDropdown(!showEngagementDropdown);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 border rounded-lg hover:bg-slate-50 transition-colors shadow-sm min-w-[140px] ${
                  selectedEngagement !== "All" ? "border-purple-300 bg-purple-50" : "border-slate-200 bg-white"
                }`}
              >
                <span className="text-sm text-slate-900 truncate">{selectedEngagement === "All" ? "All Engagement" : selectedEngagement}</span>
                <ChevronDown size={16} className="text-purple-700 flex-shrink-0" />
              </button>
              {showEngagementDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowEngagementDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
                    {ENGAGEMENT_LEVELS.map((level) => (
                      <button
                        key={level}
                        onClick={() => {
                          setSelectedEngagement(level);
                          setShowEngagementDropdown(false);
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                          selectedEngagement === level ? "bg-purple-50 text-purple-700 font-medium" : "text-slate-700"
                        )}
                      >
                        {level === "All" ? "All Engagement" : level}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: "200px" }} />
            <col style={{ width: "160px" }} />
            <col style={{ width: "210px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "80px" }} />
          </colgroup>
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100 whitespace-nowrap">Contact Person</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100 whitespace-nowrap">Department</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100 whitespace-nowrap">Donor / Organization</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100 whitespace-nowrap">Contact Type</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100 whitespace-nowrap">Engagement Level</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100 whitespace-nowrap">Last Interaction</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedContacts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="text-sm text-slate-400">No contacts match your filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedType("All");
                      setSelectedEngagement("All");
                      setSelectedDonor("All");
                      setCurrentPage(1);
                    }}
                    className="mt-2 text-sm text-purple-700 hover:underline"
                  >
                    Clear all filters
                  </button>
                </td>
              </tr>
            ) : (
              paginatedContacts.map((contact) => (
                <tr key={contact.id} className="border-b border-slate-100 hover:bg-slate-50">
                  {/* Contact Person — name + email */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                        <User size={14} className="text-purple-600" />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <p className="text-[12px] font-medium text-black whitespace-nowrap truncate">{contact.contactPerson}</p>
                        <p className="text-[12px] text-slate-500 whitespace-nowrap truncate">{contact.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-600 whitespace-nowrap truncate">{contact.department}</p>
                  </td>

                  {/* Donor / Organization */}
                  <td className="px-4 py-4">
                    <p className="text-[12px] font-medium text-slate-900 whitespace-nowrap truncate">{contact.donor}</p>
                  </td>

                  {/* Contact Type */}
                  <td className="px-4 py-4">
                    <span className={cn("inline-flex items-center px-2 py-1 rounded-xl text-[10px] font-medium whitespace-nowrap", getContactTypeColor(contact.contactType))}>
                      {contact.contactType}
                    </span>
                  </td>

                  {/* Engagement Level */}
                  <td className="px-4 py-4">
                    <span className={cn("inline-flex items-center px-2 py-1 rounded-xl text-[12px] whitespace-nowrap", getEngagementColor(contact.engagementLevel))}>
                      {contact.engagementLevel}
                    </span>
                  </td>

                  {/* Last Interaction */}
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-500 whitespace-nowrap">{contact.lastInteraction}</p>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 text-center">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === contact.id ? null : contact.id)}
                        className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                      >
                        <MoreHorizontal size={20} className="text-blue-800" />
                      </button>
                      {showActionMenu === contact.id && (
                        <>
                          <div className="fixed inset-0 z-[100]" onClick={() => setShowActionMenu(null)} />
                          <div className="absolute right-0 top-full mt-1 z-[101] w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                            <button
                              onClick={() => {
                                setShowActionMenu(null);
                                setViewContactId(contact.id);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <User size={14} className="text-slate-400" /> View Details
                            </button>
                            <button
                              onClick={() => setShowActionMenu(null)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Mail size={14} className="text-slate-400" /> Send Email
                            </button>
                            <button
                              onClick={() => setShowActionMenu(null)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Phone size={14} className="text-slate-400" /> Call
                            </button>
                            <div className="border-t border-slate-100 my-1" />
                            <button
                              onClick={() => setShowActionMenu(null)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <X size={14} className="text-red-400" /> Remove
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

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
        <span className="text-xs text-slate-400">
          {startIndex + 1}–{Math.min(startIndex + rowsPerPage, filteredContacts.length)} of {filteredContacts.length} contacts
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronDown size={16} className="rotate-90 text-purple-700" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm rounded transition-colors ${
                  page === currentPage ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronDown size={16} className="-rotate-90 text-purple-700" />
            </button>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}