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
    <Organizations onAddOrganization={() => setShowOrgForm(true)} />
  );
}