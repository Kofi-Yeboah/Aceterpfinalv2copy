import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Shield,
  Building2,
  Calendar,
  MapPin,
  Clock,
  UserCog,
  Trash2,
  ChevronDown,
  Check,
  X,
  UserX,
  UserCheck,
  BadgeCheck,
  Briefcase,
} from "lucide-react";

interface UserRole {
  id: string;
  name: string;
  module: string;
  assignedDate: string;
  assignedBy: string;
  isBaseRole: boolean; // "Staff" role cannot be removed
}

interface UserProfileData {
  id: number;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  department: string;
  location: string;
  status: "Active" | "Inactive";
  type: "internal" | "guest";
  dateJoined: string;
  lastLogin: string;
  roles: UserRole[];
  // Guest-specific
  guestType?: string;
  organization?: string;
  accessGranted?: string;
  accessExpires?: string;
}

// Map user IDs to enriched profile data
const profileDataMap: Record<number, Partial<UserProfileData>> = {
  1: { phone: "+233 24 555 0101", department: "IT & Administration", location: "Accra HQ", dateJoined: "Jan 15, 2020", lastLogin: "Feb 28, 2026", roles: [
    { id: "r-base", name: "Staff", module: "System", assignedDate: "Jan 15, 2020", assignedBy: "System", isBaseRole: true },
    { id: "r1", name: "Super Admin", module: "Administration", assignedDate: "Jan 15, 2020", assignedBy: "System", isBaseRole: false },
  ]},
  2: { phone: "+233 24 555 0102", department: "IT & Administration", location: "Accra HQ", dateJoined: "Mar 10, 2021", lastLogin: "Feb 27, 2026", roles: [
    { id: "r-base", name: "Staff", module: "System", assignedDate: "Mar 10, 2021", assignedBy: "System", isBaseRole: true },
    { id: "r2", name: "Administrator", module: "Administration", assignedDate: "Mar 10, 2021", assignedBy: "David Bannerman", isBaseRole: false },
  ]},
  3: { phone: "+233 24 555 0103", department: "Programs", location: "Accra HQ", dateJoined: "Jun 01, 2021", lastLogin: "Feb 28, 2026", roles: [
    { id: "r-base", name: "Staff", module: "System", assignedDate: "Jun 01, 2021", assignedBy: "System", isBaseRole: true },
    { id: "r3", name: "Project Manager", module: "Project Management", assignedDate: "Jun 15, 2021", assignedBy: "David Bannerman", isBaseRole: false },
  ]},
  4: { phone: "+233 24 555 0104", department: "Programs", location: "Accra HQ", dateJoined: "Jul 12, 2021", lastLogin: "Feb 26, 2026", roles: [
    { id: "r-base", name: "Staff", module: "System", assignedDate: "Jul 12, 2021", assignedBy: "System", isBaseRole: true },
    { id: "r4", name: "Program Manager", module: "Project Management", assignedDate: "Jul 12, 2021", assignedBy: "David Bannerman", isBaseRole: false },
  ]},
  5: { phone: "+233 24 555 0105", department: "Human Resources", location: "Accra HQ", dateJoined: "Feb 20, 2020", lastLogin: "Feb 28, 2026", roles: [
    { id: "r-base", name: "Staff", module: "System", assignedDate: "Feb 20, 2020", assignedBy: "System", isBaseRole: true },
    { id: "r5", name: "HR Director", module: "HR Management", assignedDate: "Feb 20, 2020", assignedBy: "David Bannerman", isBaseRole: false },
    { id: "r5b", name: "Training Coordinator", module: "HR Management", assignedDate: "Aug 10, 2023", assignedBy: "Joyce Blessing", isBaseRole: false },
  ]},
  6: { phone: "+233 24 555 0106", department: "M&E", location: "Accra HQ", dateJoined: "Sep 05, 2021", lastLogin: "Feb 27, 2026", roles: [
    { id: "r-base", name: "Staff", module: "System", assignedDate: "Sep 05, 2021", assignedBy: "System", isBaseRole: true },
    { id: "r6", name: "M&E Manager", module: "M&E / Knowledge", assignedDate: "Sep 05, 2021", assignedBy: "David Bannerman", isBaseRole: false },
  ]},
  7: { phone: "+233 24 555 0107", department: "Procurement", location: "Accra HQ", dateJoined: "Nov 18, 2021", lastLogin: "Feb 28, 2026", roles: [
    { id: "r-base", name: "Staff", module: "System", assignedDate: "Nov 18, 2021", assignedBy: "System", isBaseRole: true },
    { id: "r7", name: "Procurement Manager", module: "Procurement", assignedDate: "Nov 18, 2021", assignedBy: "David Bannerman", isBaseRole: false },
  ]},
  8: { phone: "+233 24 555 0108", department: "Finance", location: "Accra HQ", dateJoined: "Apr 01, 2020", lastLogin: "Feb 28, 2026", roles: [
    { id: "r-base", name: "Staff", module: "System", assignedDate: "Apr 01, 2020", assignedBy: "System", isBaseRole: true },
    { id: "r8", name: "Finance Director", module: "Finance", assignedDate: "Apr 01, 2020", assignedBy: "David Bannerman", isBaseRole: false },
    { id: "r8b", name: "Accountant", module: "Finance", assignedDate: "Jan 05, 2024", assignedBy: "Joyce Blessing", isBaseRole: false },
  ]},
  22: { phone: "+233 24 555 0122", department: "Finance", location: "Kumasi", dateJoined: "Oct 15, 2022", lastLogin: "Dec 10, 2025", roles: [
    { id: "r-base", name: "Staff", module: "System", assignedDate: "Oct 15, 2022", assignedBy: "System", isBaseRole: true },
    { id: "r22", name: "Payroll Officer", module: "Payroll", assignedDate: "Oct 15, 2022", assignedBy: "David Bannerman", isBaseRole: false },
  ]},
  28: { phone: "+233 24 555 0128", department: "General", location: "Accra HQ", dateJoined: "Jan 08, 2023", lastLogin: "Nov 20, 2025", roles: [
    { id: "r-base", name: "Staff", module: "System", assignedDate: "Jan 08, 2023", assignedBy: "System", isBaseRole: true },
    { id: "r28", name: "Employee", module: "General", assignedDate: "Jan 08, 2023", assignedBy: "Ama Darko", isBaseRole: false },
  ]},
};

// Generate default profile data for users not in the map
function getProfileData(user: { id: number; name: string; email: string; avatar: string; role: string; status: "Active" | "Inactive"; type: "internal" | "guest"; guestType?: string; organization?: string; accessGranted?: string }): UserProfileData {
  const mapped = profileDataMap[user.id];
  const defaultRoles: UserRole[] = user.type === "internal"
    ? [
        { id: "r-base", name: "Staff", module: "System", assignedDate: "Jan 01, 2022", assignedBy: "System", isBaseRole: true },
        { id: `r-${user.id}`, name: user.role, module: getModuleForRole(user.role), assignedDate: "Jan 01, 2022", assignedBy: "David Bannerman", isBaseRole: false },
      ]
    : [
        { id: `r-${user.id}`, name: user.role, module: "Guest Access", assignedDate: user.accessGranted || "Jan 01, 2025", assignedBy: "Joyce Blessing", isBaseRole: false },
      ];

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    phone: mapped?.phone || "+233 24 555 0100",
    department: mapped?.department || getDepartmentForRole(user.role),
    location: mapped?.location || "Accra HQ",
    status: user.status,
    type: user.type,
    dateJoined: mapped?.dateJoined || "Jan 01, 2022",
    lastLogin: mapped?.lastLogin || "Feb 25, 2026",
    roles: mapped?.roles || defaultRoles,
    guestType: user.guestType,
    organization: user.organization,
    accessGranted: user.accessGranted,
    accessExpires: user.accessGranted ? "Dec 31, 2026" : undefined,
  };
}

function getModuleForRole(role: string): string {
  if (["Super Admin", "Administrator"].includes(role)) return "Administration";
  if (["HR Director", "HR Manager", "HR Officer", "Training Coordinator"].includes(role)) return "HR Management";
  if (["Finance Director", "Finance Manager", "Finance Officer", "Accountant"].includes(role)) return "Finance";
  if (["Payroll Manager", "Payroll Officer"].includes(role)) return "Payroll";
  if (["Procurement Director", "Procurement Manager", "Procurement Officer"].includes(role)) return "Procurement";
  if (["Program Director", "Program Manager", "Project Manager", "Project Officer"].includes(role)) return "Project Management";
  if (["M&E Director", "M&E Manager", "M&E Officer"].includes(role)) return "M&E / Knowledge";
  if (["Donor Relations Manager", "Grants Officer"].includes(role)) return "Grants & Donor";
  if (["Legal Counsel", "Legal Officer"].includes(role)) return "Legal";
  if (["Knowledge Manager"].includes(role)) return "Knowledge Hub";
  return "General";
}

function getDepartmentForRole(role: string): string {
  if (["Super Admin", "Administrator"].includes(role)) return "IT & Administration";
  if (["HR Director", "HR Manager", "HR Officer", "Training Coordinator"].includes(role)) return "Human Resources";
  if (["Finance Director", "Finance Manager", "Finance Officer", "Accountant", "Payroll Manager", "Payroll Officer"].includes(role)) return "Finance";
  if (["Procurement Director", "Procurement Manager", "Procurement Officer"].includes(role)) return "Procurement";
  if (["Program Director", "Program Manager", "Project Manager", "Project Officer"].includes(role)) return "Programs";
  if (["M&E Director", "M&E Manager", "M&E Officer"].includes(role)) return "M&E";
  if (["Donor Relations Manager", "Grants Officer"].includes(role)) return "Grants & Partnerships";
  if (["Legal Counsel", "Legal Officer"].includes(role)) return "Legal";
  if (["Knowledge Manager"].includes(role)) return "Knowledge & Research";
  return "General";
}

const moduleColors: Record<string, string> = {
  "System": "bg-slate-100 text-slate-700",
  "Administration": "bg-purple-50 text-purple-700",
  "HR Management": "bg-teal-50 text-teal-700",
  "Finance": "bg-blue-50 text-blue-700",
  "Payroll": "bg-indigo-50 text-indigo-700",
  "Procurement": "bg-amber-50 text-amber-700",
  "Project Management": "bg-emerald-50 text-emerald-700",
  "M&E / Knowledge": "bg-cyan-50 text-cyan-700",
  "Grants & Donor": "bg-green-50 text-green-700",
  "Legal": "bg-rose-50 text-rose-700",
  "Knowledge Hub": "bg-sky-50 text-sky-700",
  "General": "bg-slate-50 text-slate-600",
  "Guest Access": "bg-orange-50 text-orange-700",
};

const allRoles = [
  "Super Admin", "Administrator", "HR Director", "HR Manager", "HR Officer",
  "Training Coordinator", "Finance Director", "Finance Manager", "Finance Officer",
  "Accountant", "Payroll Manager", "Payroll Officer", "Procurement Director",
  "Procurement Manager", "Procurement Officer", "Program Director", "Program Manager",
  "Project Manager", "Project Officer", "M&E Director", "M&E Manager", "M&E Officer",
  "Donor Relations Manager", "Grants Officer", "Legal Counsel", "Legal Officer",
  "Knowledge Manager", "Employee",
];

interface ViewProfileProps {
  user: {
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
  };
  onBack: () => void;
}

export function ViewProfile({ user, onBack }: ViewProfileProps) {
  const [profile, setProfile] = useState<UserProfileData>(() => getProfileData(user));
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignRoleId, setReassignRoleId] = useState<string | null>(null);
  const [newRoleSelection, setNewRoleSelection] = useState("");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);

  const handleReassign = (roleId: string) => {
    setReassignRoleId(roleId);
    const currentRole = profile.roles.find((r) => r.id === roleId);
    setNewRoleSelection(currentRole?.name || "");
    setShowReassignModal(true);
  };

  const confirmReassign = () => {
    if (!reassignRoleId || !newRoleSelection) return;
    setProfile((prev) => ({
      ...prev,
      roles: prev.roles.map((r) =>
        r.id === reassignRoleId
          ? { ...r, name: newRoleSelection, module: getModuleForRole(newRoleSelection), assignedDate: "Feb 28, 2026", assignedBy: "Admin" }
          : r
      ),
    }));
    setShowReassignModal(false);
    setReassignRoleId(null);
    setNewRoleSelection("");
  };

  const handleRemoveRole = (roleId: string) => {
    setProfile((prev) => ({
      ...prev,
      roles: prev.roles.filter((r) => r.id !== roleId),
    }));
    setShowRemoveConfirm(null);
  };

  const guestTypeLabels: Record<string, string> = {
    donor: "Partner",
    auditor: "Auditor",
    contractor: "Contractor / Consultant",
    vendor: "Vendor / Supplier",
    external_it: "External IT",
  };

  const guestTypeBadgeColors: Record<string, string> = {
    donor: "bg-green-50 text-green-700 border-green-200",
    auditor: "bg-purple-50 text-purple-700 border-purple-200",
    contractor: "bg-amber-50 text-amber-700 border-amber-200",
    vendor: "bg-pink-50 text-pink-700 border-pink-200",
    external_it: "bg-cyan-50 text-cyan-700 border-cyan-200",
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">User Profile</h1>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Viewing details for {profile.name}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Blue accent strip */}
            <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
            <div className="p-6">
              <div className="flex items-start gap-5">
                {/* Avatar */}
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-[18px] font-semibold text-slate-900">{profile.name}</h2>
                      {profile.type === "internal" ? (
                        <p className="text-[13px] text-slate-500 mt-0.5">{profile.department}</p>
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          {profile.guestType && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${guestTypeBadgeColors[profile.guestType] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                              {guestTypeLabels[profile.guestType] || profile.guestType}
                            </span>
                          )}
                          {profile.organization && (
                            <span className="flex items-center gap-1 text-[12px] text-slate-500">
                              <Building2 size={12} className="text-slate-400" />
                              {profile.organization}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] ${
                      profile.status === "Active"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${profile.status === "Active" ? "bg-green-500" : "bg-red-500"}`} />
                      {profile.status}
                    </span>
                  </div>

                  {/* Contact Details Grid */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <Mail size={14} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Email</p>
                        <p className="text-[12px] text-slate-700 mt-0.5">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <Phone size={14} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Phone</p>
                        <p className="text-[12px] text-slate-700 mt-0.5">{profile.phone}</p>
                      </div>
                    </div>
                    {profile.type === "internal" && (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                          <MapPin size={14} className="text-amber-600" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Location</p>
                          <p className="text-[12px] text-slate-700 mt-0.5">{profile.location}</p>
                        </div>
                      </div>
                    )}
                    {profile.type === "internal" ? (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                          <Briefcase size={14} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Department</p>
                          <p className="text-[12px] text-slate-700 mt-0.5">{profile.department}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                          <Building2 size={14} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Organization</p>
                          <p className="text-[12px] text-slate-700 mt-0.5">{profile.organization || "—"}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                        <Calendar size={14} className="text-teal-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {profile.type === "internal" ? "Date Joined" : "Access Granted"}
                        </p>
                        <p className="text-[12px] text-slate-700 mt-0.5">
                          {profile.type === "internal" ? profile.dateJoined : profile.accessGranted || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <Clock size={14} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {profile.type === "internal" ? "Last Login" : "Access Expires"}
                        </p>
                        <p className="text-[12px] text-slate-700 mt-0.5">
                          {profile.type === "internal" ? profile.lastLogin : profile.accessExpires || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Roles & Permissions Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-purple-600" />
                <h3 className="text-[15px] font-semibold text-slate-900">Assigned Roles</h3>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700">
                  {profile.roles.length}
                </span>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="bg-blue-800">
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Role</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Module</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Assigned Date</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Assigned By</th>
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {profile.roles.map((role) => (
                  <tr key={role.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {role.isBaseRole ? (
                          <BadgeCheck size={14} className="text-blue-500 shrink-0" />
                        ) : (
                          <Shield size={14} className="text-purple-500 shrink-0" />
                        )}
                        <span className="text-[13px] text-slate-900">{role.name}</span>
                        {role.isBaseRole && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-50 text-blue-600 border border-blue-200 uppercase tracking-wider">
                            Base
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] ${moduleColors[role.module] || "bg-slate-100 text-slate-600"}`}>
                        {role.module}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-[12px] text-slate-600">
                        <Calendar size={12} className="text-slate-400 shrink-0" />
                        {role.assignedDate}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">
                      {role.assignedBy}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {role.isBaseRole ? (
                          <span className="text-[10px] text-slate-400 italic">Protected</span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleReassign(role.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-colors border border-slate-200"
                              title="Reassign role"
                            >
                              <UserCog size={12} />
                              Reassign
                            </button>
                            <button
                              onClick={() => setShowRemoveConfirm(role.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors border border-slate-200"
                              title="Remove role"
                            >
                              <Trash2 size={12} />
                              Remove
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {profile.roles.length === 0 && (
              <div className="py-8 text-center text-sm text-slate-400">
                No roles assigned.
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-[15px] font-semibold text-slate-900 mb-4">Account Actions</h3>
            <div className="flex items-center gap-3">
              {profile.status === "Active" ? (
                <button
                  onClick={() => setProfile((p) => ({ ...p, status: "Inactive" }))}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-[13px] hover:bg-red-50 transition-colors"
                >
                  <UserX size={15} />
                  {profile.type === "internal" ? "Deactivate Account" : "Revoke Access"}
                </button>
              ) : (
                <button
                  onClick={() => setProfile((p) => ({ ...p, status: "Active" }))}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-green-200 text-green-600 text-[13px] hover:bg-green-50 transition-colors"
                >
                  <UserCheck size={15} />
                  {profile.type === "internal" ? "Activate Account" : "Restore Access"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reassign Role Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowReassignModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-semibold text-slate-900">Reassign Role</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Changing role for {profile.name}
                </p>
              </div>
              <button onClick={() => setShowReassignModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Current Role</label>
                <div className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-500">
                  {profile.roles.find((r) => r.id === reassignRoleId)?.name || "—"}
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1.5">New Role</label>
                <div className="relative">
                  <button
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="w-full flex items-center justify-between px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 hover:border-purple-300 transition-colors"
                  >
                    <span className={newRoleSelection ? "text-slate-900" : "text-slate-400"}>
                      {newRoleSelection || "Select a role"}
                    </span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${showRoleDropdown ? "rotate-180" : ""}`} />
                  </button>
                  {showRoleDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowRoleDropdown(false)} />
                      <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
                        {allRoles
                          .filter((r) => r !== "Staff")
                          .map((r) => (
                            <button
                              key={r}
                              onClick={() => { setNewRoleSelection(r); setShowRoleDropdown(false); }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-[12px] hover:bg-slate-50 transition-colors ${
                                newRoleSelection === r ? "text-purple-700 bg-purple-50" : "text-slate-700"
                              }`}
                            >
                              {r}
                              {newRoleSelection === r && <Check size={13} className="text-purple-700" />}
                            </button>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowReassignModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-600 hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReassign}
                disabled={!newRoleSelection || newRoleSelection === profile.roles.find((r) => r.id === reassignRoleId)?.name}
                className="px-4 py-2 rounded-lg bg-purple-700 text-white text-[13px] hover:bg-purple-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Reassign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Role Confirmation */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowRemoveConfirm(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[380px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <h3 className="text-[16px] font-semibold text-slate-900 text-center">Remove Role</h3>
              <p className="text-[13px] text-slate-500 text-center mt-2">
                Are you sure you want to remove the <span className="font-medium text-slate-700">{profile.roles.find((r) => r.id === showRemoveConfirm)?.name}</span> role from {profile.name}?
              </p>
              <p className="text-[11px] text-slate-400 text-center mt-1">This action can be reversed by reassigning the role.</p>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRemoveConfirm(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-600 hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveRole(showRemoveConfirm)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-[13px] hover:bg-red-700 transition-colors"
              >
                Remove Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}