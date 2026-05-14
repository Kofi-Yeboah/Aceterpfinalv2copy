import { useState } from "react";
import { ArrowLeft, X, AlertTriangle, Users, ShieldAlert, Pencil, Trash2 } from "lucide-react";
import { AddNewRole } from "./AddNewRole";

interface Role {
  id: number;
  name: string;
  description: string;
  module: string;
}

// ── Mock user-to-role assignment counts (derived from UserManagement data) ──
const usersPerRole: Record<string, string[]> = {
  "Super Admin": ["David Bannerman"],
  "Administrator": ["Joyce Blessing"],
  "HR Director": ["Ama Darko"],
  "HR Manager": ["Ama Serwaa"],
  "HR Officer": ["Priscilla Tetteh"],
  "Training Coordinator": ["Naomi Ansah"],
  "Finance Director": ["Abena Owusu"],
  "Finance Manager": ["Daniel Quaye"],
  "Finance Officer": ["Kwame Asante"],
  "Accountant": ["Kofi Boateng"],
  "Payroll Manager": ["Efua Mensah"],
  "Payroll Officer": ["Grace Amoah"],
  "Procurement Director": ["Isaac Gyamfi"],
  "Procurement Manager": ["Nana Yaw"],
  "Procurement Officer": ["Kwaku Frimpong"],
  "Program Director": ["Akua Donkor"],
  "Program Manager": ["Kofi Mensah"],
  "Project Manager": ["Yaw Osei"],
  "Project Officer": ["Yaw Agyemang"],
  "M&E Director": ["Patrick Owusu"],
  "M&E Manager": ["Kwesi Appiah"],
  "M&E Officer": ["Adwoa Poku"],
  "Donor Relations Manager": ["Samuel Nkrumah"],
  "Grants Officer": ["Felicia Badu"],
  "Legal Counsel": ["Mercy Adjei"],
  "Legal Officer": ["Richard Antwi"],
  "Knowledge Manager": ["Emmanuel Ofori"],
  "Employee": ["Beatrice Osei"],
};

const rolesData: Role[] = [
  // ── System-Wide ──
  {
    id: 1,
    name: "Super Admin",
    description: "Highest authority with full platform access. Manages system configuration, user management, and all module settings across the organization.",
    module: "System"
  },
  {
    id: 2,
    name: "Administrator",
    description: "Organization-wide admin responsible for user management, notification center, document vault, and day-to-day platform administration.",
    module: "System"
  },
  // ── HR Management ──
  {
    id: 3,
    name: "HR Director",
    description: "Strategic HR oversight across all HR modules including recruitment, employee management, performance, training, and HR reporting & analytics.",
    module: "HR Management"
  },
  {
    id: 4,
    name: "HR Manager",
    description: "Manages day-to-day HR operations: recruitment & hiring, employee profiles, contracts, performance management, and request management (leave, travel, advance).",
    module: "HR Management"
  },
  {
    id: 5,
    name: "HR Officer",
    description: "Supports HR processes including employee record maintenance, leave/travel request processing, manpower requests, and recruitment coordination.",
    module: "HR Management"
  },
  {
    id: 6,
    name: "Training Coordinator",
    description: "Manages the Training & Development module, coordinates employee learning programs, tracks certifications, and reports on training completion.",
    module: "HR Management"
  },
  // ── Finance ──
  {
    id: 7,
    name: "Finance Director",
    description: "Strategic financial oversight with access to all Finance modules: General Ledger, budgeting, funds management, cash management, approvals, and financial reporting.",
    module: "Finance"
  },
  {
    id: 8,
    name: "Finance Manager",
    description: "Manages budgeting & planning (operational and project budgets), funds management, cash management, banking management, and budget/payment approvals.",
    module: "Finance"
  },
  {
    id: 9,
    name: "Finance Officer",
    description: "Handles day-to-day financial transactions, expenditure management, journal entries, and assists with budget tracking and financial statements.",
    module: "Finance"
  },
  {
    id: 10,
    name: "Accountant",
    description: "Responsible for General Ledger maintenance, journal entries, financial statements preparation, asset management, depreciation management, and reconciliation.",
    module: "Finance"
  },
  // ── Payroll Management ──
  {
    id: 11,
    name: "Payroll Manager",
    description: "Full access to the Payroll Management module: payroll runs, allowances, deductions, advance management, and payroll reporting & analytics.",
    module: "Payroll Management"
  },
  {
    id: 12,
    name: "Payroll Officer",
    description: "Processes payroll transactions, manages employee allowances and deductions, handles advance requests, and generates payroll reports.",
    module: "Payroll Management"
  },
  // ── Procurement ──
  {
    id: 13,
    name: "Procurement Director",
    description: "Strategic procurement oversight across supplier management, requisitions, sourcing, purchase orders, invoices, and procurement reporting (supplier, RFQ, PO reports).",
    module: "Procurement"
  },
  {
    id: 14,
    name: "Procurement Manager",
    description: "Manages the procurement lifecycle: supplier relationships, purchase requisition approvals, sourcing events, purchase order management, and invoice processing.",
    module: "Procurement"
  },
  {
    id: 15,
    name: "Procurement Officer",
    description: "Handles purchase requisitions, sourcing activities, RFQ management, purchase order creation, supplier coordination, and invoice tracking.",
    module: "Procurement"
  },
  // ── Project Management ──
  {
    id: 16,
    name: "Program Director",
    description: "Executive-level oversight of all programs and projects. Access to dashboards, program management, project timelines, resource planning, and all project reports.",
    module: "Project Management"
  },
  {
    id: 17,
    name: "Program Manager",
    description: "Manages programs containing multiple projects. Oversees project planning, WBS, budgets, procurement plans, staff allocation, resource plans, and program-level reporting.",
    module: "Project Management"
  },
  {
    id: 18,
    name: "Project Manager",
    description: "Full project lifecycle management: WBS Builder, Budget Builder, procurement plans, resource plans, staff allocation, risk management, comms plans, travel plans, and task management.",
    module: "Project Management"
  },
  {
    id: 19,
    name: "Project Officer",
    description: "Supports project execution with access to task management, time tracking, project timelines, staff allocation views, and project status reporting.",
    module: "Project Management"
  },
  // ── Monitoring & Evaluation ──
  {
    id: 20,
    name: "M&E Director",
    description: "Strategic oversight of all monitoring & evaluation activities: MEL frameworks, performance indicators, data collection, impact assessments, and M&E reporting.",
    module: "Monitoring & Evaluation"
  },
  {
    id: 21,
    name: "M&E Manager",
    description: "Manages MEL frameworks, defines and tracks performance indicators, oversees data collection activities, and produces M&E reports and impact assessments.",
    module: "Monitoring & Evaluation"
  },
  {
    id: 22,
    name: "M&E Officer",
    description: "Conducts data collection and assessment, monitors performance indicators, enters field data, and assists with M&E reporting and analysis.",
    module: "Monitoring & Evaluation"
  },
  // ── CRM ──
  {
    id: 23,
    name: "Donor Relations Manager",
    description: "Manages the CRM module: contact management, grant pipeline tracking, donor intelligence, advocacy & impact hub, and donor reporting.",
    module: "CRM"
  },
  {
    id: 24,
    name: "Grants Officer",
    description: "Handles grant pipeline compliance, donor contact management, grant proposal tracking, and supports campaign analytics and donor reporting.",
    module: "CRM"
  },
  // ── Legal & Contracts ──
  {
    id: 25,
    name: "Legal Counsel",
    description: "Full access to Legal & Contracts module: contract repository, drafting & templates, requests queue approvals, and legal compliance oversight.",
    module: "Legal & Contracts"
  },
  {
    id: 26,
    name: "Legal Officer",
    description: "Manages the contract repository, prepares drafts using templates, processes legal requests from the queue, and maintains contract records.",
    module: "Legal & Contracts"
  },
  // ── Knowledge Hub ──
  {
    id: 27,
    name: "Knowledge Manager",
    description: "Manages the Knowledge Hub: proposal library, project artifacts, template engine, and donor intelligence resources for organizational learning.",
    module: "Knowledge Hub"
  },
  // ── Employee Self-Service ──
  {
    id: 28,
    name: "Employee",
    description: "Basic employee role with access to Employee Self-Service: personal information, payslips, leave/travel/expense requests, feedback, timesheets, tasks, and refunds.",
    module: "Employee Self-Service"
  },
];

interface ViewRolesProps {
  onBack: () => void;
}

export function ViewRoles({ onBack }: ViewRolesProps) {
  const [showAddNewRole, setShowAddNewRole] = useState(false);
  const [editModal, setEditModal] = useState<Role | null>(null);
  const [deleteModal, setDeleteModal] = useState<Role | null>(null);

  // If adding new role, show the AddNewRole component
  if (showAddNewRole) {
    return <AddNewRole onBack={() => setShowAddNewRole(false)} />;
  }

  const getAssignedUsers = (roleName: string) => usersPerRole[roleName] || [];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Roles & Permissions</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <ArrowLeft size={16} className="text-purple-700" />
            Back
          </button>
          <button 
            onClick={() => setShowAddNewRole(true)}
            className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2"
          >
            Add new role
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold border-b border-slate-100 w-[200px]">
                Name of role
              </th>
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold border-b border-slate-100 w-[180px]">
                Module
              </th>
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Role description
              </th>
              <th className="text-center px-6 py-3 text-white text-[12px] font-semibold border-b border-slate-100 w-[120px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rolesData.map((role) => (
              <tr key={role.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4">
                  <p className="text-[12px] text-slate-700">{role.name}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] ${getModuleBadgeStyle(role.module)}`}>
                    {role.module}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[12px] text-slate-800 leading-5">{role.description}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setEditModal(role)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit role"
                    >
                      <Pencil size={16} className="text-blue-800" />
                    </button>
                    <button
                      onClick={() => setDeleteModal(role)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete role"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Edit Role Confirmation Modal ── */}
      {editModal && (() => {
        const assignedUsers = getAssignedUsers(editModal.name);
        const userCount = assignedUsers.length;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setEditModal(null)} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-[480px] w-full mx-4 overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                    <ShieldAlert size={20} className="text-amber-600" />
                  </div>
                  <h3 className="text-lg text-slate-900">Edit Role Permissions</h3>
                </div>
                <button
                  onClick={() => setEditModal(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={18} className="text-slate-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-5 flex flex-col gap-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  You are about to edit the <strong className="text-slate-900">"{editModal.name}"</strong> role.
                  Any changes to permissions will immediately affect all users currently assigned to this role.
                </p>

                {/* Affected Users Box */}
                {userCount > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-amber-800">
                        <strong>{userCount} user{userCount !== 1 ? "s" : ""}</strong> currently assigned to this role:
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {assignedUsers.map((name) => (
                          <span
                            key={name}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full text-xs text-slate-700 border border-amber-200"
                          >
                            <Users size={12} className="text-slate-400" />
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-500 leading-relaxed">
                  All affected users will receive updated permissions the next time they access the system.
                  Please review the changes carefully before saving.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setEditModal(null)}
                  className="px-5 py-2.5 border border-slate-300 rounded-full text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log("Proceeding to edit role:", editModal.name);
                    setEditModal(null);
                  }}
                  className="px-5 py-2.5 bg-purple-700 text-white rounded-full text-sm font-semibold hover:bg-purple-800 transition-colors"
                >
                  Continue to Edit
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Delete Role Confirmation Modal ── */}
      {deleteModal && (() => {
        const assignedUsers = getAssignedUsers(deleteModal.name);
        const userCount = assignedUsers.length;
        const canDelete = userCount === 0;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteModal(null)} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-[480px] w-full mx-4 overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <Trash2 size={20} className="text-red-600" />
                  </div>
                  <h3 className="text-lg text-slate-900">Delete Role</h3>
                </div>
                <button
                  onClick={() => setDeleteModal(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={18} className="text-slate-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-5 flex flex-col gap-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  You are about to delete the <strong className="text-slate-900">"{deleteModal.name}"</strong> role.
                  This action cannot be undone.
                </p>

                {/* Blocked - Users Still Assigned */}
                {!canDelete && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3.5 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-red-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-red-800">
                        This role cannot be deleted yet. <strong>{userCount} user{userCount !== 1 ? "s" : ""}</strong>{" "}
                        {userCount !== 1 ? "are" : "is"} still assigned to it:
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {assignedUsers.map((name) => (
                          <span
                            key={name}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full text-xs text-slate-700 border border-red-200"
                          >
                            <Users size={12} className="text-slate-400" />
                            {name}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-red-700 mt-2.5 leading-relaxed">
                        Please reassign all users to a different role before deleting this one.
                        You can do this from the <strong>User Management</strong> screen.
                      </p>
                    </div>
                  </div>
                )}

                {/* Can Delete - No Users */}
                {canDelete && (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3.5 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5 shrink-0">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <p className="text-sm text-green-800">
                      No users are currently assigned to this role. It is safe to delete.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="px-5 py-2.5 border border-slate-300 rounded-full text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (canDelete) {
                      console.log("Deleting role:", deleteModal.name);
                      setDeleteModal(null);
                    }
                  }}
                  disabled={!canDelete}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                    canDelete
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {canDelete ? "Delete Role" : "Cannot Delete"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function getModuleBadgeStyle(module: string): string {
  const styles: Record<string, string> = {
    "System": "bg-slate-700 text-white",
    "HR Management": "bg-green-50 text-green-700",
    "Finance": "bg-amber-50 text-amber-700",
    "Payroll Management": "bg-orange-50 text-orange-700",
    "Procurement": "bg-purple-50 text-purple-700",
    "Project Management": "bg-blue-50 text-blue-700",
    "Monitoring & Evaluation": "bg-indigo-50 text-indigo-700",
    "CRM": "bg-pink-50 text-pink-700",
    "Legal & Contracts": "bg-cyan-50 text-cyan-700",
    "Knowledge Hub": "bg-teal-50 text-teal-700",
    "Employee Self-Service": "bg-violet-50 text-violet-700",
  };
  return styles[module] || "bg-slate-100 text-slate-600";
}