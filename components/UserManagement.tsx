import { useState, useRef } from "react";
import { Search, ChevronDown, MoreHorizontal, UserPlus, X, Mail, Clock, Info, User as UserIcon, Phone, Shield, ArrowRight, ArrowLeft, Check, Building2, FolderKanban, Eye, UserCog, UserX, UserCheck, ShieldOff, CalendarPlus, Trash2 } from "lucide-react";
import { createPortal } from "react-dom";
const imgAvatar = "https://picsum.photos/seed/2217/800/600";
const imgAvatar1 = "https://picsum.photos/seed/1389/800/600";
import { ViewRoles } from "./ViewRoles";
import { ViewProfile } from "./ViewProfile";

interface UserRecord {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: "Active" | "Inactive";
  type: "internal" | "guest";
  guestType?: string;
  organization?: string;
  accessGranted?: string;
}

const userData: UserRecord[] = [
  { id: 1, name: "David Bannerman", email: "d.bannerman@acme.com", avatar: imgAvatar, role: "Super Admin", status: "Active", type: "internal" },
  { id: 2, name: "Joyce Blessing", email: "j.blessing@acme.com", avatar: imgAvatar1, role: "Administrator", status: "Active", type: "internal" },
  { id: 3, name: "Yaw Osei", email: "y.osei@acme.com", avatar: imgAvatar, role: "Project Manager", status: "Active", type: "internal" },
  { id: 4, name: "Kofi Mensah", email: "k.mensah@acme.com", avatar: imgAvatar1, role: "Program Manager", status: "Active", type: "internal" },
  { id: 5, name: "Ama Darko", email: "a.darko@acme.com", avatar: imgAvatar1, role: "HR Director", status: "Active", type: "internal" },
  { id: 6, name: "Kwesi Appiah", email: "k.appiah@acme.com", avatar: imgAvatar, role: "M&E Manager", status: "Active", type: "internal" },
  { id: 7, name: "Nana Yaw", email: "n.yaw@acme.com", avatar: imgAvatar, role: "Procurement Manager", status: "Active", type: "internal" },
  { id: 8, name: "Abena Owusu", email: "a.owusu@acme.com", avatar: imgAvatar1, role: "Finance Director", status: "Active", type: "internal" },
  { id: 9, name: "Kwame Asante", email: "k.asante@acme.com", avatar: imgAvatar, role: "Finance Officer", status: "Active", type: "internal" },
  { id: 10, name: "Ama Serwaa", email: "a.serwaa@acme.com", avatar: imgAvatar1, role: "HR Manager", status: "Active", type: "internal" },
  { id: 11, name: "Kofi Boateng", email: "k.boateng@acme.com", avatar: imgAvatar, role: "Accountant", status: "Active", type: "internal" },
  { id: 12, name: "Efua Mensah", email: "e.mensah@acme.com", avatar: imgAvatar1, role: "Payroll Manager", status: "Active", type: "internal" },
  { id: 13, name: "Kwaku Frimpong", email: "k.frimpong@acme.com", avatar: imgAvatar, role: "Procurement Officer", status: "Active", type: "internal" },
  { id: 14, name: "Akua Donkor", email: "a.donkor@acme.com", avatar: imgAvatar1, role: "Program Director", status: "Active", type: "internal" },
  { id: 15, name: "Yaw Agyemang", email: "y.agyemang@acme.com", avatar: imgAvatar, role: "Project Officer", status: "Active", type: "internal" },
  { id: 16, name: "Adwoa Poku", email: "a.poku@acme.com", avatar: imgAvatar1, role: "M&E Officer", status: "Active", type: "internal" },
  { id: 17, name: "Samuel Nkrumah", email: "s.nkrumah@acme.com", avatar: imgAvatar, role: "Donor Relations Manager", status: "Active", type: "internal" },
  { id: 18, name: "Mercy Adjei", email: "m.adjei@acme.com", avatar: imgAvatar1, role: "Legal Counsel", status: "Active", type: "internal" },
  { id: 19, name: "Emmanuel Ofori", email: "e.ofori@acme.com", avatar: imgAvatar, role: "Knowledge Manager", status: "Active", type: "internal" },
  { id: 20, name: "Priscilla Tetteh", email: "p.tetteh@acme.com", avatar: imgAvatar1, role: "HR Officer", status: "Active", type: "internal" },
  { id: 21, name: "Daniel Quaye", email: "d.quaye@acme.com", avatar: imgAvatar, role: "Finance Manager", status: "Active", type: "internal" },
  { id: 22, name: "Grace Amoah", email: "g.amoah@acme.com", avatar: imgAvatar1, role: "Payroll Officer", status: "Inactive", type: "internal" },
  { id: 23, name: "Isaac Gyamfi", email: "i.gyamfi@acme.com", avatar: imgAvatar, role: "Procurement Director", status: "Active", type: "internal" },
  { id: 24, name: "Naomi Ansah", email: "n.ansah@acme.com", avatar: imgAvatar1, role: "Training Coordinator", status: "Active", type: "internal" },
  { id: 25, name: "Patrick Owusu", email: "p.owusu@acme.com", avatar: imgAvatar, role: "M&E Director", status: "Active", type: "internal" },
  { id: 26, name: "Felicia Badu", email: "f.badu@acme.com", avatar: imgAvatar1, role: "Grants Officer", status: "Active", type: "internal" },
  { id: 27, name: "Richard Antwi", email: "r.antwi@acme.com", avatar: imgAvatar, role: "Legal Officer", status: "Active", type: "internal" },
  { id: 28, name: "Beatrice Osei", email: "b.osei@acme.com", avatar: imgAvatar1, role: "Employee", status: "Inactive", type: "internal" },
  // Guest users
  { id: 29, name: "James Thornton", email: "j.thornton@usaid.gov", avatar: imgAvatar, role: "Partner", status: "Active", type: "guest", guestType: "donor", organization: "USAID", accessGranted: "Jan 10, 2025" },
  { id: 30, name: "Claire Dupont", email: "c.dupont@worldbank.org", avatar: imgAvatar1, role: "Partner", status: "Active", type: "guest", guestType: "donor", organization: "World Bank", accessGranted: "Mar 05, 2025" },
  { id: 31, name: "Hans Mueller", email: "h.mueller@eu-fund.org", avatar: imgAvatar, role: "Partner", status: "Active", type: "guest", guestType: "donor", organization: "EU Development Fund", accessGranted: "Feb 18, 2025" },
  { id: 32, name: "Rebecca Okafor", email: "r.okafor@kpmg.com", avatar: imgAvatar1, role: "Auditor", status: "Active", type: "guest", guestType: "auditor", organization: "KPMG Ghana", accessGranted: "Apr 22, 2025" },
  { id: 33, name: "Michael Chen", email: "m.chen@deloitte.com", avatar: imgAvatar, role: "Auditor", status: "Inactive", type: "guest", guestType: "auditor", organization: "Deloitte", accessGranted: "Nov 03, 2024" },
  { id: 34, name: "Fatima Al-Hassan", email: "f.alhassan@techplus.io", avatar: imgAvatar1, role: "Contractor / Consultant", status: "Active", type: "guest", guestType: "contractor", organization: "TechPlus Solutions", accessGranted: "May 15, 2025" },
  { id: 35, name: "Kwaku Anane", email: "k.anane@greendev.org", avatar: imgAvatar, role: "Contractor / Consultant", status: "Active", type: "guest", guestType: "contractor", organization: "GreenDev Consulting", accessGranted: "Jun 01, 2025" },
  { id: 36, name: "Linda Owusu-Mensah", email: "l.owusu@globaltech.com", avatar: imgAvatar1, role: "Vendor / Supplier", status: "Active", type: "guest", guestType: "vendor", organization: "GlobalTech Ltd", accessGranted: "Jul 12, 2025" },
  { id: 37, name: "Peter Adjei", email: "p.adjei@officemax.gh", avatar: imgAvatar, role: "Vendor / Supplier", status: "Active", type: "guest", guestType: "vendor", organization: "OfficeMax Ghana", accessGranted: "Aug 20, 2025" },
  { id: 38, name: "Sandra Kim", email: "s.kim@cloudops.io", avatar: imgAvatar1, role: "External IT", status: "Active", type: "guest", guestType: "external_it", organization: "CloudOps International", accessGranted: "Sep 08, 2025" },
];

// Mock employee data from HR system
const employeesFromHR = [
  { id: 1, name: "Yaw Osei" },
  { id: 2, name: "Kofi Mensah" },
  { id: 3, name: "Ama Darko" },
  { id: 4, name: "Kwesi Appiah" },
  { id: 5, name: "Nana Yaw" },
  { id: 6, name: "Abena Owusu" },
  { id: 7, name: "Kwame Asante" },
];

const availableRoles = [
  "Super Admin",
  "Administrator",
  "HR Director",
  "HR Manager",
  "HR Officer",
  "Training Coordinator",
  "Finance Director",
  "Finance Manager",
  "Finance Officer",
  "Accountant",
  "Payroll Manager",
  "Payroll Officer",
  "Procurement Director",
  "Procurement Manager",
  "Procurement Officer",
  "Program Director",
  "Program Manager",
  "Project Manager",
  "Project Officer",
  "M&E Director",
  "M&E Manager",
  "M&E Officer",
  "Donor Relations Manager",
  "Grants Officer",
  "Legal Counsel",
  "Legal Officer",
  "Knowledge Manager",
  "Employee",
];

// ── User type definitions ──
type UserCategory = "internal" | "guest" | "";

interface GuestTypeOption {
  key: string;
  label: string;
  description: string;
  accessNote: string;
  badgeColor: string;
  needsProjectAccess: boolean;
}

const guestTypes: GuestTypeOption[] = [
  {
    key: "contractor",
    label: "Contractor / Consultant",
    description: "Temporary external staff engaged for project work.",
    accessNote: "Access to Project Tasks, Time Tracking, and Invoicing.",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    needsProjectAccess: true,
  },
  {
    key: "donor",
    label: "Partner",
    description: "Funding partner or institutional partner requiring visibility.",
    accessNote: "Read-only access to MEL Dashboards, Project Reports, and Knowledge Hub.",
    badgeColor: "bg-green-50 text-green-700 border-green-200",
    needsProjectAccess: true,
  },
  {
    key: "auditor",
    label: "Auditor",
    description: "External auditor requiring limited financial visibility.",
    accessNote: "Read-only access to specific Finance and Document Vault.",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    needsProjectAccess: true,
  },
  {
    key: "vendor",
    label: "Vendor / Supplier",
    description: "Supplier or service provider participating in procurement.",
    accessNote: "Access to the Sourcing / Supplier portal to submit bids or invoices.",
    badgeColor: "bg-pink-50 text-pink-700 border-pink-200",
    needsProjectAccess: false,
  },
  {
    key: "external_it",
    label: "External IT",
    description: "External IT support or systems integration personnel.",
    accessNote: "Limited access to system configuration and support modules.",
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    needsProjectAccess: false,
  },
];

// Available projects for assignment
const availableProjects = [
  { id: "PRJ-001", name: "West Africa Regional Integration Study", pm: "Yaw Osei", status: "Active" },
  { id: "PRJ-002", name: "Digital Economy Policy Brief Series", pm: "Kofi Mensah", status: "Closed" },
  { id: "PRJ-003", name: "Climate Finance Readiness Program", pm: "Kwesi Appiah", status: "Active" },
  { id: "PRJ-004", name: "Sustainable Agriculture Development Initiative", pm: "Nana Yaw", status: "Active" },
  { id: "PRJ-005", name: "Renewable Energy Transition Framework", pm: "Kwaku Anane", status: "Active" },
  { id: "PRJ-006", name: "Healthcare System Strengthening Project", pm: "Ama Serwaa", status: "Active" },
  { id: "PRJ-007", name: "Youth Employment Skills Development", pm: "Kwame Asante", status: "Active" },
  { id: "PRJ-008", name: "Urban Infrastructure Development Plan", pm: "Yaw Osei", status: "Draft" },
];



// ── Portal Dropdown: renders the menu at document.body so it escapes overflow ──
function PortalDropdown({
  isOpen,
  onClose,
  triggerRef,
  children,
  maxHeight = 200,
  openUpward = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  children: React.ReactNode;
  maxHeight?: number;
  openUpward?: boolean;
}) {
  if (!isOpen || !triggerRef.current) return null;
  const rect = triggerRef.current.getBoundingClientRect();
  const style: React.CSSProperties = {
    position: "fixed",
    left: rect.left,
    width: rect.width,
    zIndex: 9999,
    maxHeight,
    overflowY: "auto",
  };
  if (openUpward) {
    style.bottom = window.innerHeight - rect.top + 4;
  } else {
    style.top = rect.bottom + 4;
  }

  return createPortal(
    <>
      <div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={onClose} />
      <div
        className="bg-white border border-slate-200 rounded-lg shadow-lg"
        style={style}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeUserTab, setActiveUserTab] = useState<"internal" | "guest">("internal");
  
  // View state
  const [showViewRoles, setShowViewRoles] = useState(false);
  const [viewProfileUser, setViewProfileUser] = useState<typeof userData[0] | null>(null);

  // Action menu state
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);

  // Filter bar dropdown states
  const [showFilterRoleDropdown, setShowFilterRoleDropdown] = useState(false);
  const [showFilterStatusDropdown, setShowFilterStatusDropdown] = useState(false);
  const filterRoleRef = useRef<HTMLButtonElement>(null);
  const filterStatusRef = useRef<HTMLButtonElement>(null);
  
  // Add User Modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserStep, setAddUserStep] = useState(1); // 1 = type, 2 = guest subtype, 3 = details
  const [userType, setUserType] = useState<UserCategory>("");
  const [guestType, setGuestType] = useState("");
  const [showGuestTypeDropdown, setShowGuestTypeDropdown] = useState(false);
  // Internal fields
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [newUserRole, setNewUserRole] = useState("");
  const [newUserStatus, setNewUserStatus] = useState("Active");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  // External fields
  const [extFullName, setExtFullName] = useState("");
  const [extEmail, setExtEmail] = useState("");
  const [extPhone, setExtPhone] = useState("");
  const [extOrganization, setExtOrganization] = useState("");

  // Project assignment fields (multi-select)
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const closeAllDropdowns = () => {
    setShowGuestTypeDropdown(false);
    setShowEmployeeDropdown(false);
    setShowRoleDropdown(false);
    setShowStatusDropdown(false);
    setShowProjectDropdown(false);
    setShowFilterRoleDropdown(false);
    setShowFilterStatusDropdown(false);
  };

  const resetForm = () => {
    setAddUserStep(1);
    setUserType("");
    setGuestType("");
    setSelectedEmployee("");
    setNewUserRole("");
    setNewUserStatus("Active");
    setExtFullName("");
    setExtEmail("");
    setExtPhone("");
    setExtOrganization("");
    setSelectedProjects([]);
    closeAllDropdowns();
  };

  const handleAddUser = () => {
    if (userType === "internal") {
      console.log("Adding internal user:", { selectedEmployee, newUserRole, newUserStatus });
    } else {
      console.log("Adding guest user:", { guestType, extFullName, extEmail, extPhone, extOrganization, selectedProjects });
    }
    resetForm();
    setShowAddUserModal(false);
  };

  const isFormValid = () => {
    if (userType === "internal") return !!selectedEmployee && !!newUserRole;
    if (userType === "guest") return !!guestType && !!extFullName && !!extEmail && !!extPhone;
    return false;
  };

  const selectedGuestInfo = guestTypes.find((t) => t.key === guestType);

  // Refs for dropdown trigger buttons (used by PortalDropdown)
  const guestTypeRef = useRef<HTMLButtonElement>(null);
  const employeeRef = useRef<HTMLButtonElement>(null);
  const roleRef = useRef<HTMLButtonElement>(null);
  const statusRef = useRef<HTMLButtonElement>(null);
  const projectRef = useRef<HTMLButtonElement>(null);

  // If viewing a profile, show the ViewProfile component
  if (viewProfileUser) {
    return <ViewProfile user={viewProfileUser} onBack={() => setViewProfileUser(null)} />;
  }

  // If viewing roles, show the ViewRoles component
  if (showViewRoles) {
    return <ViewRoles onBack={() => setShowViewRoles(false)} />;
  }

  // Tab counts
  const internalCount = userData.filter((u) => u.type === "internal").length;
  const guestCount = userData.filter((u) => u.type === "guest").length;

  // ── Filtering logic ──
  const filteredUsers = userData.filter((user) => {
    if (user.type !== activeUserTab) return false;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.role.toLowerCase().includes(q) ||
      (user.organization && user.organization.toLowerCase().includes(q));
    const matchesRole = selectedRole === "All Roles" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "All Statuses" || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // ── Pagination logic ──
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIdx, startIdx + itemsPerPage);

  // Build page number array for pagination UI
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("ellipsis");
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  // Unique roles in data for the filter dropdown (scoped to active tab)
  const uniqueRoles = Array.from(new Set(userData.filter((u) => u.type === activeUserTab).map((u) => u.role))).sort();

  // Guest type badge colors
  const guestTypeBadgeColors: Record<string, string> = {
    donor: "bg-green-50 text-green-700 border-green-200",
    auditor: "bg-purple-50 text-purple-700 border-purple-200",
    contractor: "bg-amber-50 text-amber-700 border-amber-200",
    vendor: "bg-pink-50 text-pink-700 border-pink-200",
    external_it: "bg-cyan-50 text-cyan-700 border-cyan-200",
  };

  const guestTypeLabels: Record<string, string> = {
    donor: "Partner",
    auditor: "Auditor",
    contractor: "Contractor",
    vendor: "Vendor",
    external_it: "External IT",
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">User Management</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowViewRoles(true)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            View roles
          </button>
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <UserPlus size={16} />
            Add new
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between gap-3">
          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email or role"
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

          {/* Filter Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Role Filter */}
            <button
              ref={filterRoleRef}
              onClick={() => {
                const next = !showFilterRoleDropdown;
                setShowFilterRoleDropdown(next);
                setShowFilterStatusDropdown(false);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 border rounded-lg hover:bg-slate-50 transition-colors shadow-sm ${
                selectedRole !== "All Roles"
                  ? "border-purple-300 bg-purple-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <span className="text-sm text-slate-900">{selectedRole}</span>
              <ChevronDown size={16} className="text-purple-700" />
            </button>
            <PortalDropdown
              isOpen={showFilterRoleDropdown}
              onClose={() => setShowFilterRoleDropdown(false)}
              triggerRef={filterRoleRef}
              maxHeight={260}
            >
              <button
                onClick={() => { setSelectedRole("All Roles"); setShowFilterRoleDropdown(false); setCurrentPage(1); }}
                className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                  selectedRole === "All Roles" ? "bg-purple-50 text-purple-700" : "text-slate-900 hover:bg-slate-50"
                }`}
              >
                All Roles
              </button>
              {uniqueRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => { setSelectedRole(role); setShowFilterRoleDropdown(false); setCurrentPage(1); }}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                    selectedRole === role ? "bg-purple-50 text-purple-700" : "text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {role}
                </button>
              ))}
            </PortalDropdown>

            {/* Status Filter */}
            <button
              ref={filterStatusRef}
              onClick={() => {
                const next = !showFilterStatusDropdown;
                setShowFilterStatusDropdown(next);
                setShowFilterRoleDropdown(false);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 border rounded-lg hover:bg-slate-50 transition-colors shadow-sm ${
                selectedStatus !== "All Statuses"
                  ? "border-purple-300 bg-purple-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <span className="text-sm text-slate-900">{selectedStatus}</span>
              <ChevronDown size={16} className="text-purple-700" />
            </button>
            <PortalDropdown
              isOpen={showFilterStatusDropdown}
              onClose={() => setShowFilterStatusDropdown(false)}
              triggerRef={filterStatusRef}
            >
              {["All Statuses", "Active", "Inactive"].map((s) => (
                <button
                  key={s}
                  onClick={() => { setSelectedStatus(s); setShowFilterStatusDropdown(false); setCurrentPage(1); }}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                    selectedStatus === s ? "bg-purple-50 text-purple-700" : "text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </PortalDropdown>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex justify-center">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          <button
            onClick={() => { setActiveUserTab("internal"); setCurrentPage(1); setSelectedRole("All Roles"); setSelectedStatus("All Statuses"); }}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-1.5 ${
              activeUserTab === "internal"
                ? "bg-purple-700 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Internal Staff
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeUserTab === "internal" ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"
            }`}>
              {internalCount}
            </span>
          </button>
          <button
            onClick={() => { setActiveUserTab("guest"); setCurrentPage(1); setSelectedRole("All Roles"); setSelectedStatus("All Statuses"); }}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-1.5 ${
              activeUserTab === "guest"
                ? "bg-purple-700 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Guests
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeUserTab === "guest" ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"
            }`}>
              {guestCount}
            </span>
          </button>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedRole !== "All Roles" || selectedStatus !== "All Statuses" || searchQuery) && (
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 text-xs text-slate-500">
          <span>Showing {filteredUsers.length} of {activeUserTab === "internal" ? internalCount : guestCount} {activeUserTab === "internal" ? "staff" : "guests"}</span>
          {(selectedRole !== "All Roles" || selectedStatus !== "All Statuses") && (
            <>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5">
                {selectedRole !== "All Roles" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                    {selectedRole}
                    <button onClick={() => { setSelectedRole("All Roles"); setCurrentPage(1); }}>
                      <X size={11} />
                    </button>
                  </span>
                )}
                {selectedStatus !== "All Statuses" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                    {selectedStatus}
                    <button onClick={() => { setSelectedStatus("All Statuses"); setCurrentPage(1); }}>
                      <X size={11} />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={() => { setSelectedRole("All Roles"); setSelectedStatus("All Statuses"); setSearchQuery(""); setCurrentPage(1); }}
                className="text-purple-700 hover:underline ml-1"
              >
                Clear all
              </button>
            </>
          )}
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full">
          <thead>
            {activeUserTab === "internal" ? (
              <tr className="bg-blue-800">
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                  Role
                </th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                  Status
                </th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                  Action
                </th>
              </tr>
            ) : (
              <tr className="bg-blue-800">
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                  Guest Type
                </th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                  Organization
                </th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                  Access Granted
                </th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                  Status
                </th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                  Action
                </th>
              </tr>
            )}
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={activeUserTab === "internal" ? 4 : 6} className="px-4 py-12 text-center">
                  <p className="text-sm text-slate-400">No {activeUserTab === "internal" ? "staff" : "guests"} match your filters.</p>
                  <button
                    onClick={() => { setSelectedRole("All Roles"); setSelectedStatus("All Statuses"); setSearchQuery(""); setCurrentPage(1); }}
                    className="mt-2 text-sm text-purple-700 hover:underline"
                  >
                    Clear all filters
                  </button>
                </td>
              </tr>
            ) : activeUserTab === "internal" ? (
              paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="text-[12px] font-medium text-black">{user.name}</p>
                        <p className="text-slate-600 text-[12px]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                        <Shield size={9} />
                        Staff
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-purple-50 text-purple-700 border border-purple-200">
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${
                      user.status === "Active" 
                        ? "bg-green-50 text-green-600" 
                        : "bg-red-50 text-red-600"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setOpenActionMenuId(openActionMenuId === user.id ? null : user.id)}
                        className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                      >
                        <MoreHorizontal size={20} className="text-blue-800" />
                      </button>
                      {openActionMenuId === user.id && (
                        <>
                          <div className="fixed inset-0 z-[100]" onClick={() => setOpenActionMenuId(null)} />
                          <div className="absolute right-0 top-full mt-1 z-[101] w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                            <button onClick={() => { setOpenActionMenuId(null); setViewProfileUser(user); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                              <Eye size={14} className="text-slate-400" /> View Profile
                            </button>
                            <button onClick={() => setOpenActionMenuId(null)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                              <UserCog size={14} className="text-slate-400" /> Reassign Role
                            </button>
                            <div className="border-t border-slate-100 my-1" />
                            {user.status === "Active" ? (
                              <button onClick={() => setOpenActionMenuId(null)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                <UserX size={14} className="text-red-400" /> Deactivate
                              </button>
                            ) : (
                              <button onClick={() => setOpenActionMenuId(null)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors">
                                <UserCheck size={14} className="text-green-500" /> Activate
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="text-[12px] font-medium text-black">{user.name}</p>
                        <p className="text-slate-600 text-[12px]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {user.guestType && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${guestTypeBadgeColors[user.guestType] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                        {guestTypeLabels[user.guestType] || user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={12} className="text-slate-400 shrink-0" />
                      <p className="text-[12px] text-slate-700">{user.organization || "—"}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 whitespace-nowrap">
                      <CalendarPlus size={11} className="text-slate-400 shrink-0" />
                      {user.accessGranted || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${
                      user.status === "Active" 
                        ? "bg-green-50 text-green-600" 
                        : "bg-red-50 text-red-600"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setOpenActionMenuId(openActionMenuId === user.id ? null : user.id)}
                        className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                      >
                        <MoreHorizontal size={20} className="text-blue-800" />
                      </button>
                      {openActionMenuId === user.id && (
                        <>
                          <div className="fixed inset-0 z-[100]" onClick={() => setOpenActionMenuId(null)} />
                          <div className="absolute right-0 top-full mt-1 z-[101] w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                            <button onClick={() => { setOpenActionMenuId(null); setViewProfileUser(user); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                              <Eye size={14} className="text-slate-400" /> View Details
                            </button>
                            <button onClick={() => setOpenActionMenuId(null)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                              <CalendarPlus size={14} className="text-slate-400" /> Extend Access
                            </button>
                            <button onClick={() => setOpenActionMenuId(null)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
                              <UserCog size={14} className="text-slate-400 shrink-0" /> Change Permissions
                            </button>
                            <div className="border-t border-slate-100 my-1" />
                            {user.status === "Active" ? (
                              <button onClick={() => setOpenActionMenuId(null)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                <ShieldOff size={14} className="text-red-400" /> Revoke Access
                              </button>
                            ) : (
                              <button onClick={() => setOpenActionMenuId(null)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors">
                                <UserCheck size={14} className="text-green-500" /> Restore Access
                              </button>
                            )}
                            <button onClick={() => setOpenActionMenuId(null)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                              <Trash2 size={14} className="text-red-400" /> Remove Guest
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
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
          <span className="text-xs text-slate-400 ml-2">
            {startIdx + 1}–{Math.min(startIdx + itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
          </span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
              disabled={safePage <= 1}
              className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronDown size={16} className="rotate-90 text-pink-600" />
            </button>
            
            {getPageNumbers().map((page, idx) =>
              page === "ellipsis" ? (
                <span key={`e-${idx}`} className="px-2 py-2 text-sm text-slate-400">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm rounded transition-colors ${
                    page === safePage
                      ? "bg-pink-50 text-pink-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
              disabled={safePage >= totalPages}
              className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronDown size={16} className="-rotate-90 text-pink-600" />
            </button>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[540px] max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {addUserStep > 1 && (
                  <button
                    onClick={() => {
                      if (addUserStep === 3 && userType === "guest") { setAddUserStep(2); }
                      else { setAddUserStep(1); setUserType(""); setGuestType(""); }
                    }}
                    className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={18} className="text-slate-500" />
                  </button>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Add New User</h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {addUserStep === 1 && "Step 1 — Select user type"}
                    {addUserStep === 2 && "Step 2 — Select guest type"}
                    {addUserStep === 3 && userType === "internal" && "Step 2 — Employee details"}
                    {addUserStep === 3 && userType === "guest" && "Step 3 — Guest details"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { resetForm(); setShowAddUserModal(false); }}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Step Progress */}
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2 shrink-0">
              {(userType === "guest" ? [1,2,3] : [1,2]).map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-colors ${
                    (userType === "internal" && addUserStep === 3 && step === 2) || addUserStep > step
                      ? "bg-purple-700 text-white"
                      : (userType === "internal" && addUserStep === 3 && step === 2) || addUserStep === step
                      ? "bg-purple-700 text-white ring-2 ring-purple-200"
                      : "bg-slate-200 text-slate-500"
                  }`}>
                    {((userType === "internal" && step <= 1 && addUserStep >= 3) || addUserStep > step) ? <Check size={12} /> : step}
                  </div>
                  <span className={`text-[10px] ${addUserStep >= step ? "text-purple-700" : "text-slate-400"}`}>
                    {step === 1 && "Type"}
                    {step === 2 && (userType === "guest" ? "Guest Type" : "Details")}
                    {step === 3 && "Details"}
                  </span>
                  {step < (userType === "guest" ? 3 : 2) && (
                    <div className={`w-8 h-px ${addUserStep > step ? "bg-purple-300" : "bg-slate-200"}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex flex-col gap-6">

                {/* ═══ STEP 1: Choose Internal Employee or Guest ═══ */}
                {addUserStep === 1 && (
                  <>
                    <label className="text-xs text-slate-700 tracking-[-0.24px]">
                      Select the type of user you want to add
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => { setUserType("internal"); setGuestType(""); setAddUserStep(3); }}
                        className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                          userType === "internal" ? "border-purple-600 bg-purple-50" : "border-slate-200 hover:border-purple-300"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                          <UserIcon size={20} className="text-blue-600" />
                        </div>
                        <p className="text-sm text-slate-900">Internal Employee</p>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Full-time or part-time staff registered in the HR system.</p>
                        <div className="mt-3 flex items-center gap-1 text-[10px] text-blue-600">
                          <Shield size={10} /> Access determined by assigned role
                        </div>
                      </button>
                      <button
                        onClick={() => { setUserType("guest"); setAddUserStep(2); }}
                        className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                          userType === "guest" ? "border-purple-600 bg-purple-50" : "border-slate-200 hover:border-purple-300"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                          <Building2 size={20} className="text-amber-600" />
                        </div>
                        <p className="text-sm text-slate-900">Guest</p>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">External person — donor, consultant, auditor, vendor, or IT.</p>
                        <div className="mt-3 flex items-center gap-1 text-[10px] text-amber-600">
                          <Clock size={10} /> Time-limited access with role assignment
                        </div>
                      </button>
                    </div>
                  </>
                )}

                {/* ═══ STEP 2: Guest Type Selection ═══ */}
                {addUserStep === 2 && userType === "guest" && (
                  <>
                    <div className="flex flex-col gap-3">
                      <label className="text-xs text-slate-700 tracking-[-0.24px]">Guest Type</label>
                      <button
                        ref={guestTypeRef}
                        onClick={() => { const next = !showGuestTypeDropdown; closeAllDropdowns(); setShowGuestTypeDropdown(next); }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[38px] px-2 py-1.5 flex items-center justify-between"
                      >
                        <span className={`text-sm ${guestType ? 'text-slate-900' : 'text-slate-400'}`}>
                          {guestType ? guestTypes.find((t) => t.key === guestType)?.label : 'Select a guest type'}
                        </span>
                        <ChevronDown size={16} className="text-purple-700" />
                      </button>
                      <PortalDropdown isOpen={showGuestTypeDropdown} onClose={() => setShowGuestTypeDropdown(false)} triggerRef={guestTypeRef} maxHeight={280}>
                        {guestTypes.map((type) => (
                          <button
                            key={type.key}
                            onClick={() => { setGuestType(type.key); setShowGuestTypeDropdown(false); }}
                            className={`w-full px-3 py-2.5 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0 ${
                              guestType === type.key ? "bg-purple-50" : ""
                            }`}
                          >
                            <p className="text-sm text-slate-900">{type.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{type.description}</p>
                          </button>
                        ))}
                      </PortalDropdown>
                    </div>
                    {guestType && selectedGuestInfo && (
                      <div className={`rounded-xl border px-4 py-3.5 flex items-start gap-3 ${selectedGuestInfo.badgeColor}`}>
                        <Shield size={16} className="mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs"><span className="font-medium">{selectedGuestInfo.label}</span></p>
                          <p className="text-xs mt-1 opacity-80">{selectedGuestInfo.accessNote}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ═══ STEP 3: Details Form ═══ */}
                {addUserStep === 3 && (
                  <>
                    {/* ── Internal Employee Fields ── */}
                    {userType === "internal" && (
                      <>
                        <div className="rounded-xl border px-4 py-3.5 flex items-start gap-3 bg-blue-50 text-blue-700 border-blue-200">
                          <Shield size={16} className="mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs"><span className="font-medium">Internal Employee</span></p>
                            <p className="text-xs mt-1 opacity-80">Access determined by assigned role. No expiry.</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <label className="text-xs text-slate-700 tracking-[-0.24px]">Select Employee</label>
                          <button ref={employeeRef} onClick={() => { const next = !showEmployeeDropdown; closeAllDropdowns(); setShowEmployeeDropdown(next); }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[38px] px-2 py-1.5 flex items-center justify-between">
                            <span className={`text-sm ${selectedEmployee ? 'text-slate-900' : 'text-slate-400'}`}>{selectedEmployee || 'Select an employee from HR'}</span>
                            <ChevronDown size={16} className="text-purple-700" />
                          </button>
                          <PortalDropdown isOpen={showEmployeeDropdown} onClose={() => setShowEmployeeDropdown(false)} triggerRef={employeeRef}>
                            {employeesFromHR.map((employee) => (
                              <button key={employee.id} onClick={() => { setSelectedEmployee(employee.name); setShowEmployeeDropdown(false); }}
                                className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2">
                                <UserIcon size={14} className="text-slate-400" />{employee.name}
                              </button>
                            ))}
                          </PortalDropdown>
                        </div>
                        <div className="flex flex-col gap-3">
                          <label className="text-xs text-slate-700 tracking-[-0.24px]">Role</label>
                          <button ref={roleRef} onClick={() => { const next = !showRoleDropdown; closeAllDropdowns(); setShowRoleDropdown(next); }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[38px] px-2 py-1.5 flex items-center justify-between">
                            <span className={`text-sm ${newUserRole ? 'text-slate-900' : 'text-slate-400'}`}>{newUserRole || 'Select a role'}</span>
                            <ChevronDown size={16} className="text-purple-700" />
                          </button>
                          <PortalDropdown isOpen={showRoleDropdown} onClose={() => setShowRoleDropdown(false)} triggerRef={roleRef}>
                            {availableRoles.map((role) => (
                              <button key={role} onClick={() => { setNewUserRole(role); setShowRoleDropdown(false); }}
                                className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors">{role}</button>
                            ))}
                          </PortalDropdown>
                        </div>
                        <div className="flex flex-col gap-3">
                          <label className="text-xs text-slate-700 tracking-[-0.24px]">Status</label>
                          <button ref={statusRef} onClick={() => { const next = !showStatusDropdown; closeAllDropdowns(); setShowStatusDropdown(next); }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[38px] px-2 py-1.5 flex items-center justify-between">
                            <span className="text-sm text-slate-900">{newUserStatus}</span>
                            <ChevronDown size={16} className="text-purple-700" />
                          </button>
                          <PortalDropdown isOpen={showStatusDropdown} onClose={() => setShowStatusDropdown(false)} triggerRef={statusRef}>
                            {['Active', 'Inactive'].map((status) => (
                              <button key={status} onClick={() => { setNewUserStatus(status as "Active" | "Inactive"); setShowStatusDropdown(false); }}
                                className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors">{status}</button>
                            ))}
                          </PortalDropdown>
                        </div>
                      </>
                    )}

                    {/* ── Guest Fields ── */}
                    {userType === "guest" && (
                      <>
                        {selectedGuestInfo && (
                          <div className={`rounded-xl border px-4 py-3.5 flex items-start gap-3 ${selectedGuestInfo.badgeColor}`}>
                            <Shield size={16} className="mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs"><span className="font-medium">{selectedGuestInfo.label}</span></p>
                              <p className="text-xs mt-1 opacity-80">{selectedGuestInfo.accessNote}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-slate-700 tracking-[-0.24px]">Full Name</label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2"><UserIcon size={15} className="text-slate-400" /></div>
                            <input type="text" placeholder="Enter full name" value={extFullName} onChange={(e) => setExtFullName(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-slate-700 tracking-[-0.24px]">Email Address</label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2"><Mail size={15} className="text-slate-400" /></div>
                            <input type="email" placeholder="Enter email address" value={extEmail} onChange={(e) => setExtEmail(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-slate-700 tracking-[-0.24px]">Phone Number</label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2"><Phone size={15} className="text-slate-400" /></div>
                            <input type="tel" placeholder="e.g. +233 24 123 4567" value={extPhone} onChange={(e) => setExtPhone(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-slate-700 tracking-[-0.24px]">Organization</label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2"><Building2 size={15} className="text-slate-400" /></div>
                            <input type="text" placeholder="Enter organization name" value={extOrganization} onChange={(e) => setExtOrganization(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                          </div>
                        </div>


                        {/* Project Access (multi-select for applicable guest types) */}
                        {selectedGuestInfo && selectedGuestInfo.needsProjectAccess && (
                          <div className="flex flex-col gap-2">
                            <label className="text-xs text-slate-700 tracking-[-0.24px]">
                              Project Access <span className="text-slate-400">(select projects this user can view)</span>
                            </label>
                            <button ref={projectRef} onClick={() => { const next = !showProjectDropdown; closeAllDropdowns(); setShowProjectDropdown(next); }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg min-h-[38px] px-2 py-1.5 flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <FolderKanban size={15} className="text-slate-400 shrink-0" />
                                <span className={`text-sm ${selectedProjects.length ? 'text-slate-900' : 'text-slate-400'}`}>
                                  {selectedProjects.length ? `${selectedProjects.length} project(s) selected` : 'Select projects to grant access'}
                                </span>
                              </span>
                              <ChevronDown size={16} className="text-purple-700 shrink-0" />
                            </button>
                            <PortalDropdown isOpen={showProjectDropdown} onClose={() => setShowProjectDropdown(false)} triggerRef={projectRef} maxHeight={240} openUpward>
                              {availableProjects.filter(p => p.status !== "Closed").map((project) => {
                                const isSelected = selectedProjects.includes(project.id);
                                return (
                                  <button key={project.id}
                                    onClick={(e) => { e.stopPropagation(); setSelectedProjects((prev) => isSelected ? prev.filter((p) => p !== project.id) : [...prev, project.id]); }}
                                    className={`w-full px-3 py-2.5 text-left hover:bg-slate-50 transition-colors flex items-center gap-2.5 ${isSelected ? "bg-purple-50" : ""}`}>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? "bg-purple-700 border-purple-700" : "border-slate-300"}`}>
                                      {isSelected && <Check size={10} className="text-white" />}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm text-slate-900 truncate">{project.name}</p>
                                      <p className="text-[10px] text-slate-400">{project.id} · PM: {project.pm}</p>
                                    </div>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 ${project.status === "Active" ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"}`}>{project.status}</span>
                                  </button>
                                );
                              })}
                            </PortalDropdown>
                            {selectedProjects.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {selectedProjects.map((projId) => {
                                  const proj = availableProjects.find(p => p.id === projId);
                                  return (
                                    <span key={projId} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-[10px] border border-purple-200">
                                      <FolderKanban size={9} />
                                      {proj?.name || projId}
                                      <button onClick={() => setSelectedProjects(prev => prev.filter(p => p !== projId))}><X size={10} className="text-purple-400 hover:text-purple-700" /></button>
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3">
                          <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
                          <p className="text-xs text-blue-800 leading-relaxed">
                            Login credentials will be automatically generated and sent to <strong>{extEmail || "the provided email address"}</strong>. The user will receive instructions to set up their password and access the system.
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                onClick={() => { resetForm(); setShowAddUserModal(false); }}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <div className="flex items-center gap-2">
                {addUserStep === 2 && userType === "guest" && (
                  <button
                    onClick={() => { if (guestType) setAddUserStep(3); }}
                    disabled={!guestType}
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    Continue
                    <ArrowRight size={14} />
                  </button>
                )}
                {addUserStep === 3 && (
                  <button
                    onClick={handleAddUser}
                    disabled={!isFormValid()}
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}