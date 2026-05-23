import { useState } from "react";
import { Shield, Users, Key, CheckCircle2, XCircle } from "lucide-react";
import type { RoleName, Permission } from "./types";
import { RBAC_ROLES, PERMISSION_MATRIX } from "./constants";
import { mockUserRoles } from "./mockData";

type SubTab = "roles" | "users" | "matrix";

export function AccessControl() {
  const [activeTab, setActiveTab] = useState<SubTab>("roles");

  const tabs: { key: SubTab; label: string; icon: React.ReactNode }[] = [
    { key: "roles", label: "Roles", icon: <Shield size={14} /> },
    { key: "users", label: "User Assignments", icon: <Users size={14} /> },
    { key: "matrix", label: "Permission Matrix", icon: <Key size={14} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Access Control</h1>
        <p className="text-[12px] text-slate-500 mt-0.5">Role-based access control with 8 predefined finance roles</p>
      </div>

      <div className="px-6 py-2 bg-white border-b border-slate-200">
        <div className="flex items-center gap-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-[12px] font-medium flex items-center gap-2 transition-colors ${
                activeTab === tab.key ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === "roles" && <RolesView />}
        {activeTab === "users" && <UsersView />}
        {activeTab === "matrix" && <PermissionMatrixView />}
      </div>
    </div>
  );
}

function RolesView() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-4">
        {RBAC_ROLES.map(role => {
          const userCount = mockUserRoles.filter(u => u.role === role.name).length;
          const permissions = PERMISSION_MATRIX[role.name as RoleName] || [];
          return (
            <div key={role.name} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Shield size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-medium text-slate-900">{role.name}</h3>
                    <p className="text-[11px] text-slate-500">{role.description}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
                  {userCount} user{userCount !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Permissions ({permissions.length})</p>
                <div className="flex flex-wrap gap-1">
                  {permissions.slice(0, 6).map((p, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">
                      {p.module}.{p.actions[0]}
                    </span>
                  ))}
                  {permissions.length > 6 && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded">
                      +{permissions.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UsersView() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">User</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Email</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Role</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Department</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Assigned Date</th>
              <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockUserRoles.map(user => (
              <tr key={user.userId} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 text-[12px] text-slate-800 font-medium">{user.userName}</td>
                <td className="px-4 py-3 text-[11px] text-slate-500">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium border border-blue-100">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{user.department}</td>
                <td className="px-4 py-3 text-[11px] text-slate-500">{user.assignedDate}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    user.isActive !== false ? "bg-green-50 text-green-700 border border-green-200" : "bg-slate-100 text-slate-500"
                  }`}>
                    {user.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PermissionMatrixView() {
  const modules = ["ChartOfAccounts", "JournalEntries", "GeneralLedger", "PeriodManagement", "Reporting", "BudgetManagement"];
  const actions = ["Create", "Read", "Update", "Delete", "Approve", "Post", "Reverse"];
  const roles = RBAC_ROLES.map(r => r.name as RoleName);

  const hasPermission = (role: RoleName, module: string, action: string): boolean => {
    const perms = PERMISSION_MATRIX[role] || [];
    return perms.some(p => p.module === module && p.actions.includes(action as any));
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl border border-slate-200 overflow-auto">
        <table className="w-full text-[10px]">
          <thead className="bg-slate-50 sticky top-0">
            <tr>
              <th className="text-left px-3 py-2 font-semibold text-slate-500 border-b border-r border-slate-200 min-w-[140px]">Module / Action</th>
              {roles.map(role => (
                <th key={role} className="text-center px-2 py-2 font-semibold text-slate-500 border-b border-slate-200 min-w-[80px]">
                  <span className="writing-mode-vertical">{role}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map(module => (
              <>
                <tr key={`${module}-header`} className="bg-slate-50">
                  <td colSpan={roles.length + 1} className="px-3 py-1.5 font-semibold text-slate-700 border-t border-slate-200">
                    {module}
                  </td>
                </tr>
                {actions.map(action => (
                  <tr key={`${module}-${action}`} className="border-t border-slate-100">
                    <td className="px-3 py-1.5 text-slate-600 border-r border-slate-100 pl-6">{action}</td>
                    {roles.map(role => (
                      <td key={role} className="text-center px-2 py-1.5">
                        {hasPermission(role, module, action) ? (
                          <CheckCircle2 size={12} className="text-green-500 mx-auto" />
                        ) : (
                          <XCircle size={12} className="text-slate-200 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
