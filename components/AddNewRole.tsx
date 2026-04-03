import { useState } from "react";
import { Save, Check, ChevronDown, ChevronRight, Minus } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────────

type AccessLevel = "view" | "edit";

interface Permission {
  id: string;
  name: string;
  description: string;
  checked: boolean;
  accessLevel: AccessLevel;
  /** If false, this permission is inherently read-only (e.g. dashboards/reports) */
  supportsEdit: boolean;
}

interface PermissionModule {
  id: string;
  name: string;
  color: string; // Tailwind bg color for the module badge
  textColor: string;
  permissions: Permission[];
}

// ─── Permission Data ────────────────────────────────────────────────────────────

function createPermissionModules(): PermissionModule[] {
  return [
    // ── SYSTEM ADMINISTRATION ──
    {
      id: "system",
      name: "System Administration",
      color: "bg-slate-700",
      textColor: "text-white",
      permissions: [
        { id: "sys_user_mgmt", name: "User Management", description: "View, create, edit, and deactivate user accounts across the platform.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "sys_role_mgmt", name: "Role & Permission Management", description: "View, create, edit, and delete roles. Assign and revoke permissions for each role.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "sys_doc_vault", name: "Document Vault", description: "Access the centralized document vault to view, upload, organize, and delete organizational documents.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "sys_notif_center", name: "Notification Center", description: "View system notifications, manage notification preferences, and send organization-wide announcements.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "sys_audit_log", name: "Audit Log", description: "View system audit trails including user login history, data changes, and administrative actions.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "sys_org_settings", name: "Organization Settings", description: "View and configure organization-wide settings including branding, fiscal year, currency, and localization.", checked: false, accessLevel: "view", supportsEdit: true },
      ],
    },

    // ── EMPLOYEE SELF-SERVICE ──
    {
      id: "ess",
      name: "Employee Self-Service",
      color: "bg-violet-100",
      textColor: "text-violet-700",
      permissions: [
        { id: "ess_home", name: "Home Dashboard", description: "View the employee home dashboard with quick links, announcements, and personal summary widgets.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "ess_personal_info", name: "My Personal Information", description: "View and update personal details such as contact information, emergency contacts, and bank details.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "ess_payslip", name: "Check My Payslip", description: "View and download monthly payslips, tax certificates, and salary history.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "ess_leave_req", name: "Leave Requests", description: "Submit, view, and cancel personal leave requests. View leave balances and leave history.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "ess_travel_req", name: "Travel Requests", description: "Submit, view, and cancel personal travel requests including itinerary, per diem, and accommodation details.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "ess_expense_claim", name: "Expense Claims", description: "Submit expense claims with receipt attachments, track reimbursement status, and view claim history.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "ess_feedback", name: "My Feedback", description: "View received feedback and submit feedback to peers, supervisors, or the organization.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "ess_timesheet", name: "Employee Timesheet", description: "View, log, and submit daily/weekly timesheets. Track hours against projects and tasks.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "ess_tasks", name: "My Tasks", description: "View assigned tasks, update task status and progress, and add task comments and attachments.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "ess_refunds", name: "My Refunds", description: "Submit refund requests, track refund processing status, and view refund history.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "ess_approvals", name: "Approvals (Pending / Approved / Rejected)", description: "View the approval queue for pending, approved, and rejected requests. Approve or reject items assigned to this role.", checked: false, accessLevel: "view", supportsEdit: true },
      ],
    },

    // ── HR MANAGEMENT ──
    {
      id: "hr",
      name: "HR Management",
      color: "bg-green-100",
      textColor: "text-green-700",
      permissions: [
        { id: "hr_dashboard", name: "HR Dashboard", description: "View the HR management dashboard with headcount, recruitment pipeline, leave statistics, and workforce analytics.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "hr_manpower_req", name: "Manpower Requests", description: "View, create, and process manpower/staffing requests from departments. Manage headcount planning.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "hr_recruitment", name: "Recruitment", description: "View and manage job postings, candidate pipelines, applicant tracking, screening, and hiring workflows.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "hr_interviews", name: "Interviews", description: "View and schedule interviews, assign interview panels, record interview feedback, scores, and hiring decisions.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "hr_app_portal", name: "Application Portal", description: "View and configure the external application portal, manage application forms, and process incoming applications.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "hr_emp_profiles", name: "Employee Profiles", description: "View, create, and edit employee records including personal data, employment history, qualifications, and documents.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "hr_job_titles", name: "Job Titles", description: "View, create, edit, and delete organizational job titles, grades, salary bands, and reporting structures.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "hr_contracts", name: "Employee Contracts", description: "View, create, edit, and terminate employee contracts. Manage contract types, renewal dates, and terms.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "hr_performance", name: "Performance Management", description: "View and manage performance review cycles, KPIs, goal-setting, appraisals, and performance improvement plans.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "hr_training", name: "Training & Development", description: "View and manage training programs, assign employees to courses, track completions, and manage certifications.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "hr_req_leave", name: "Request Management – Leave", description: "View and process employee leave requests. Approve, reject, or escalate leave applications.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "hr_req_travel", name: "Request Management – Travel", description: "View and process employee travel requests. Approve itineraries, per diem, and accommodation arrangements.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "hr_req_advance", name: "Request Management – Advance Requests", description: "View and process salary advance requests. Approve, reject, and set repayment schedules.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "hr_req_info", name: "Request Management – Info Changes", description: "View and process employee information change requests (name, bank details, address, emergency contacts).", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "hr_req_manpower", name: "Request Management – Manpower Requests", description: "View and approve department manpower/staffing requests submitted through the HR request workflow.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "hr_rpt_headcount", name: "Headcount Report", description: "View and generate headcount reports by department, location, contract type, and gender breakdown.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "hr_rpt_turnover", name: "Turnover Report", description: "View and generate employee turnover reports by period, department, reason for leaving, and attrition trends.", checked: false, accessLevel: "view", supportsEdit: false },
      ],
    },

    // ── FINANCIALS ──
    {
      id: "fin",
      name: "Finance",
      color: "bg-amber-100",
      textColor: "text-amber-700",
      permissions: [
        { id: "fin_dashboard", name: "Finance Dashboard", description: "View the finance dashboard with cash position, revenue/expense summaries, budget utilization, and financial KPIs.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "fin_general_ledger", name: "General Ledger", description: "View, create, and manage chart of accounts, GL entries, account balances, and period closings.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "fin_expenditure", name: "Expenditure Management", description: "View, create, and manage organizational expenditures, payment vouchers, and expense categorization.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "fin_op_budgets", name: "Operational Budgets", description: "View, create, and manage operational budgets by department. Set budget ceilings, track utilization, and submit for approval.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "fin_proj_budgets", name: "Project Budgets", description: "View, create, and manage project-level budgets. Track budget allocation, utilization, and variances per project.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "fin_funds_mgmt", name: "Funds Management", description: "View, create, and manage funding sources, fund allocations, donor fund tracking, and fund transfers between accounts.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "fin_cash_mgmt", name: "Cash Management", description: "View cash positions, record cash transactions, perform bank reconciliation, and manage petty cash.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "fin_banking", name: "Banking Management", description: "View and manage bank accounts, bank details, signatories, bank reconciliation, and banking relationships.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "fin_summary", name: "Financial Summary", description: "View consolidated financial summary including income, expenditure, fund balances, and key financial metrics.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "fin_journal", name: "Journal Entries", description: "View, create, edit, and post manual journal entries for adjustments, accruals, and reclassifications.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "fin_assets", name: "Asset Management", description: "View, register, transfer, and dispose of organizational fixed assets. Track asset location and condition.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "fin_depreciation", name: "Depreciation Management", description: "View depreciation schedules, run depreciation calculations, adjust asset values, and manage depreciation methods.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "fin_pay_approvals", name: "Payment Approvals", description: "View payment approval queue. Approve, reject, or escalate payment requests and disbursements.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "fin_bud_approvals", name: "Budget Approvals", description: "View budget approval queue. Approve, reject, or request revisions to budget submissions.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "fin_rpt_statements", name: "Financial Statements", description: "View and generate financial statements including balance sheet, income statement, and cash flow statement.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "fin_rpt_bva", name: "Budget vs Actual Report", description: "View and generate budget vs actual comparison reports by project, department, or funding source.", checked: false, accessLevel: "view", supportsEdit: false },
      ],
    },

    // ── PAYROLL MANAGEMENT ──
    {
      id: "pay",
      name: "Payroll Management",
      color: "bg-orange-100",
      textColor: "text-orange-700",
      permissions: [
        { id: "pay_dashboard", name: "Payroll Dashboard", description: "View the payroll dashboard with payroll summary, processing status, upcoming payroll dates, and payroll KPIs.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "pay_payroll", name: "Payroll Processing", description: "View, run, and finalize monthly payroll. Manage pay elements, calculate net pay, and generate pay records.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pay_allowances", name: "Allowances", description: "View, create, edit, and assign employee allowances (housing, transport, medical, etc.) to payroll records.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pay_deductions", name: "Deductions", description: "View, create, edit, and assign employee deductions (tax, pension, loan repayment, etc.) to payroll records.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pay_advance", name: "Advance Management", description: "View and process salary advances. Approve advance requests, set repayment terms, and track outstanding balances.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pay_rpt_payroll", name: "Payroll Report", description: "View and generate payroll reports including pay register, statutory deductions, bank schedules, and payroll summaries.", checked: false, accessLevel: "view", supportsEdit: false },
      ],
    },

    // ── PROCUREMENT ──
    {
      id: "proc",
      name: "Procurement",
      color: "bg-purple-100",
      textColor: "text-purple-700",
      permissions: [
        { id: "proc_dashboard", name: "Procurement Dashboard", description: "View the procurement dashboard with purchase order status, spending analytics, supplier performance, and pipeline.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "proc_suppliers", name: "Supplier Management", description: "View, add, edit, and deactivate suppliers. Manage supplier profiles, ratings, certifications, and contact details.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "proc_requisitions", name: "Purchase Requisitions", description: "View, create, edit, and submit purchase requisitions. Track requisition status and approval workflow.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "proc_sourcing", name: "Sourcing (RFQ / RFP)", description: "View and manage sourcing events. Create RFQs/RFPs, invite suppliers, evaluate bids, and award contracts.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "proc_po_mgmt", name: "Purchase Order Management", description: "View, create, edit, and approve purchase orders. Manage PO lifecycle from creation through goods receipt.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "proc_invoices", name: "Invoice Processing", description: "View, create, and process supplier invoices. Perform three-way matching (PO, receipt, invoice) and route for payment.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "proc_goods_receipt", name: "Goods Receipt & Inspection", description: "Record goods/services received against purchase orders. Perform quality inspection and manage discrepancies.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "proc_rpt_supplier", name: "Supplier Reports", description: "View and generate supplier performance reports, spend analysis by supplier, and supplier compliance metrics.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "proc_rpt_rfq", name: "RFQ Reports", description: "View and generate RFQ/RFP analysis reports, bid comparison reports, and sourcing activity summaries.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "proc_rpt_po", name: "Purchase Order Reports", description: "View and generate PO tracking reports, delivery performance, and procurement spend analysis.", checked: false, accessLevel: "view", supportsEdit: false },
      ],
    },

    // ── PROJECT MANAGEMENT ──
    {
      id: "pm",
      name: "Project Management",
      color: "bg-blue-100",
      textColor: "text-blue-700",
      permissions: [
        { id: "pm_dashboard", name: "Project Dashboard", description: "View the project management dashboard with project portfolio summary, status overview, and key project metrics.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "pm_programs", name: "Programs", description: "View, create, edit, and close programs. Manage program-level settings, link projects, and monitor program health.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pm_projects", name: "Projects", description: "View, create, edit, and close projects. Change project phases (Inception, Planning, Procurement, Execution).", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pm_concept", name: "Project Concept", description: "View, create, and edit project concept documents including problem statement, objectives, scope, and stakeholders.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pm_wbs", name: "WBS Builder", description: "View, create, edit, and delete Work Breakdown Structure items. Manage deliverables, work packages, and activities.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pm_budget", name: "Budget Builder", description: "View, create, edit, and submit project budget line items. Assign procurement types and cost categories.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pm_procurement_plan", name: "Procurement Plan", description: "View and manage project procurement plans. Map budget items to procurement activities, timelines, and methods.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pm_resource_plan", name: "Resource Plan", description: "View and manage project resource plans. Allocate human and material resources to project activities.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pm_staff_alloc", name: "Staff Allocation", description: "View team member assignments, utilization, and availability. Assign and reassign staff to project tasks and phases.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pm_risk_plan", name: "Risk Management Plan", description: "View, create, and manage project risk registers. Identify risks, assess impact/likelihood, and define mitigations.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pm_comms_plan", name: "Communications Plan", description: "View, create, and manage project communication plans. Define stakeholder communications, frequency, and channels.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pm_travel_plan", name: "Travel Plan", description: "View, create, and manage project travel plans including field visits, trip logistics, budgets, and approvals.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pm_tasks", name: "Task Management", description: "View, create, assign, and manage project tasks. Update task status, priorities, dependencies, and due dates.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pm_time_tracking", name: "Time Tracking", description: "View and log time entries against project tasks. Approve submitted timesheets and manage time-tracking settings.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pm_timelines", name: "Project Timelines", description: "View and manage project timelines, milestones, and Gantt charts. Adjust schedules and track critical path.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "pm_rpt_status", name: "Project Status Report", description: "View and generate project status reports with progress, milestones, risks, issues, and budget summaries.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "pm_rpt_util", name: "Staff Utilization Report", description: "View and generate staff utilization reports showing allocation percentages, workload, and availability.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "pm_rpt_timeline", name: "Timeline Report", description: "View and generate timeline variance reports comparing planned vs actual schedules and milestone completion.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "pm_rpt_bva", name: "Budget vs Actual Report", description: "View and generate project-level budget vs actual reports showing spending, variances, and burn rate.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "pm_rpt_task", name: "Task Completion Report", description: "View and generate task completion reports showing progress, overdue tasks, and completion rate trends.", checked: false, accessLevel: "view", supportsEdit: false },
      ],
    },

    // ── MONITORING & EVALUATION ──
    {
      id: "mel",
      name: "Monitoring & Evaluation",
      color: "bg-indigo-100",
      textColor: "text-indigo-700",
      permissions: [
        { id: "mel_dashboard", name: "M&E Dashboard", description: "View the M&E dashboard with indicator performance, data collection status, and evaluation summaries.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "mel_frameworks", name: "MEL Frameworks", description: "View, create, edit, and publish MEL frameworks. Define theory of change, log frames, and results chains.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "mel_indicators", name: "Performance Indicators", description: "View, create, edit, and track performance indicators. Set baselines, targets, and data collection methods.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "mel_data_collection", name: "Data Collection & Assessment", description: "View, create, and manage data collection forms, field surveys, and data entry. Submit and approve collected data.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "mel_data_quality", name: "Data Quality Assurance", description: "Run data quality checks, validate submitted data, flag anomalies, and approve verified data records.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "mel_rpt_reports", name: "M&E Reports", description: "View and generate M&E reports including indicator tracking, progress against targets, and donor reports.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "mel_rpt_impact", name: "Impact Assessment", description: "View and generate impact assessment reports, evaluation findings, lessons learned, and outcome analysis.", checked: false, accessLevel: "view", supportsEdit: false },
      ],
    },

    // ── CRM ──
    {
      id: "crm",
      name: "CRM",
      color: "bg-pink-100",
      textColor: "text-pink-700",
      permissions: [
        { id: "crm_dashboard", name: "CRM Dashboard", description: "View the stakeholder & donor dashboard with donor pipeline, engagement metrics, and campaign performance.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "crm_contacts", name: "Contact Management", description: "View, add, edit, and delete stakeholder/donor contacts. Manage contact segments, tags, and communication history.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "crm_grant_pipeline", name: "Grant Pipeline & Compliance", description: "View and manage the grant pipeline. Track proposals, awards, compliance requirements, reporting deadlines, and milestones.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "crm_advocacy", name: "Advocacy & Impact Hub", description: "View, create, and manage advocacy campaigns, impact stories, policy briefs, and stakeholder engagement activities.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "crm_donor_comms", name: "Donor Communications", description: "View and manage donor correspondence, thank-you letters, funding acknowledgments, and relationship notes.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "crm_rpt_donor", name: "Donor Reports", description: "View and generate donor reports including funding summaries, donor retention analysis, and contribution tracking.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "crm_rpt_campaign", name: "Campaign Analytics", description: "View and generate campaign performance reports, outreach metrics, engagement rates, and advocacy impact.", checked: false, accessLevel: "view", supportsEdit: false },
      ],
    },

    // ── LEGAL & CONTRACTS ──
    {
      id: "legal",
      name: "Legal & Contracts",
      color: "bg-cyan-100",
      textColor: "text-cyan-700",
      permissions: [
        { id: "legal_dashboard", name: "Legal Dashboard", description: "View the legal dashboard with contract status, upcoming renewals, pending requests, and compliance overview.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "legal_contracts", name: "Contract Repository", description: "View, upload, edit metadata, and archive organizational contracts. Search and filter by type, status, and party.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "legal_drafting", name: "Drafting & Templates", description: "View, create, edit, and publish contract templates. Draft contracts from templates and manage clause libraries.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "legal_requests", name: "Requests Queue", description: "View, assign, process, and close legal review requests from across the organization.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "legal_compliance", name: "Compliance Tracking", description: "View and track regulatory compliance requirements, deadlines, and organizational compliance status.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "legal_renewals", name: "Contract Renewals & Alerts", description: "View upcoming contract renewals and expiration alerts. Initiate renewal workflows and manage renewal terms.", checked: false, accessLevel: "view", supportsEdit: true },
      ],
    },

    // ── KNOWLEDGE HUB ──
    {
      id: "kh",
      name: "Knowledge Hub",
      color: "bg-teal-100",
      textColor: "text-teal-700",
      permissions: [
        { id: "kh_dashboard", name: "Knowledge Dashboard", description: "View the knowledge hub dashboard with recent uploads, popular resources, and content analytics.", checked: false, accessLevel: "view", supportsEdit: false },
        { id: "kh_proposals", name: "Proposal Library", description: "View, upload, edit metadata, and archive past proposals. Search and filter by donor, sector, and outcome.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "kh_artifacts", name: "Project Artifacts", description: "View, upload, organize, and delete project deliverables, reports, and reference documents.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "kh_templates", name: "Template Engine", description: "View, create, edit, and publish reusable document templates for proposals, reports, and project documents.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "kh_donor_intel", name: "Donor Intelligence", description: "View and manage donor intelligence profiles, funding trends, strategic priorities, and partnership opportunities.", checked: false, accessLevel: "view", supportsEdit: true },
        { id: "kh_lessons", name: "Lessons Learned Repository", description: "View, submit, and curate lessons learned from completed projects. Tag and categorize for organizational learning.", checked: false, accessLevel: "view", supportsEdit: true },
      ],
    },
  ];
}

// ─── Component ──────────────────────────────────────────────────────────────────

interface AddNewRoleProps {
  onBack: () => void;
}

export function AddNewRole({ onBack }: AddNewRoleProps) {
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [modules, setModules] = useState<PermissionModule[]>(createPermissionModules);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // ── Toggle a single module's expanded/collapsed state ──
  const toggleModuleExpanded = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  // ── Toggle a single permission checkbox ──
  const togglePermission = (moduleId: string, permId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              permissions: m.permissions.map((p) =>
                p.id === permId
                  ? { ...p, checked: !p.checked, accessLevel: !p.checked ? "view" : p.accessLevel }
                  : p
              ),
            }
          : m
      )
    );
  };

  // ── Change access level for a single permission ──
  const setAccessLevel = (moduleId: string, permId: string, level: AccessLevel) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              permissions: m.permissions.map((p) =>
                p.id === permId ? { ...p, accessLevel: level } : p
              ),
            }
          : m
      )
    );
  };

  // ── Select / deselect all permissions in a module ──
  const toggleModuleAll = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        const allChecked = m.permissions.every((p) => p.checked);
        return {
          ...m,
          permissions: m.permissions.map((p) => ({
            ...p,
            checked: !allChecked,
            accessLevel: !allChecked ? "view" : p.accessLevel,
          })),
        };
      })
    );
  };

  // ── Module-level check state ──
  const getModuleCheckState = (mod: PermissionModule): "none" | "some" | "all" => {
    const checked = mod.permissions.filter((p) => p.checked).length;
    if (checked === 0) return "none";
    if (checked === mod.permissions.length) return "all";
    return "some";
  };

  // ── Total selected count ──
  const totalSelected = modules.reduce(
    (sum, m) => sum + m.permissions.filter((p) => p.checked).length,
    0
  );
  const totalPermissions = modules.reduce((sum, m) => sum + m.permissions.length, 0);

  const handleSave = () => {
    const selectedPermissions = modules.flatMap((m) =>
      m.permissions
        .filter((p) => p.checked)
        .map((p) => ({ id: p.id, name: p.name, module: m.name, accessLevel: p.accessLevel }))
    );
    console.log("Saving role:", { roleName, roleDescription, permissions: selectedPermissions });
    onBack();
  };

  // ── Expand/Collapse All Modules ──
  const expandAll = () => {
    setExpandedModules(new Set(modules.map((m) => m.id)));
  };

  const collapseAll = () => {
    setExpandedModules(new Set());
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-8 py-5 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Create New Role</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-6 py-2.5 border border-slate-300 rounded-full text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-purple-700 text-white rounded-full text-sm font-semibold hover:bg-purple-800 transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-[900px] mx-auto py-8 px-8">
          <div className="flex flex-col gap-8">
            {/* Role Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-600">Name of role</label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl h-[46px] px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter role name"
              />
            </div>

            {/* Role Description */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-600">Role description</label>
              <textarea
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[120px] resize-none"
                placeholder="Enter role description"
              />
            </div>

            {/* ── Permissions Section ── */}
            <div className="flex flex-col gap-4">
              {/* Permissions Header Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-xl text-slate-800">Permissions</h2>
                  <p className="text-sm text-slate-500 leading-5 max-w-[480px]">
                    Grant access to specific modules and features. For applicable permissions,
                    choose between View Only or View & Edit access.
                  </p>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap pt-1">
                  <span className="text-sm text-slate-500">
                    {totalSelected}/{totalPermissions} selected
                  </span>
                  <button
                    onClick={expandAll}
                    className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    Expand all
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={collapseAll}
                    className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    Collapse all
                  </button>
                </div>
              </div>

              {/* Module Accordion */}
              <div className="flex flex-col gap-3">
                {modules.map((mod) => {
                  const isExpanded = expandedModules.has(mod.id);
                  const checkState = getModuleCheckState(mod);
                  const checkedCount = mod.permissions.filter((p) => p.checked).length;

                  return (
                    <div key={mod.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                      {/* Module Header */}
                      <div
                        onClick={() => toggleModuleExpanded(mod.id)}
                        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
                      >
                        {/* Module-level checkbox */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleModuleAll(mod.id);
                          }}
                          className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            checkState === "all"
                              ? "bg-purple-700 border-purple-700"
                              : checkState === "some"
                              ? "bg-purple-400 border-purple-400"
                              : "bg-white border-slate-300"
                          }`}
                        >
                          {checkState === "all" && <Check size={13} className="text-white" strokeWidth={2.5} />}
                          {checkState === "some" && <Minus size={13} className="text-white" strokeWidth={2.5} />}
                        </button>

                        {/* Expand/Collapse chevron */}
                        <span className="text-slate-400">
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </span>

                        {/* Module name */}
                        <span className="text-sm text-slate-900">
                          {mod.name}
                        </span>

                        {/* Count */}
                        <span className="ml-auto text-sm text-slate-400">
                          {checkedCount}/{mod.permissions.length} permissions
                        </span>
                      </div>

                      {/* Expanded Permission List */}
                      {isExpanded && (
                        <div className="border-t border-slate-100">
                          {mod.permissions.map((perm, idx) => (
                            <div
                              key={perm.id}
                              className={`pl-14 pr-5 py-4 flex items-start gap-3 ${
                                idx < mod.permissions.length - 1 ? "border-b border-slate-100" : ""
                              } transition-colors`}
                            >
                              {/* Checkbox */}
                              <button
                                onClick={() => togglePermission(mod.id, perm.id)}
                                className={`mt-0.5 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                  perm.checked
                                    ? "bg-purple-700 border-purple-700"
                                    : "bg-white border-slate-300 hover:border-slate-400"
                                }`}
                              >
                                {perm.checked && <Check size={13} className="text-white" strokeWidth={2.5} />}
                              </button>

                              {/* Permission Info */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-purple-700">{perm.name}</p>
                                <p className="text-xs text-slate-500 leading-[18px] mt-0.5">{perm.description}</p>
                              </div>

                              {/* Access Level Toggle (only when checked) */}
                              {perm.checked && (
                                <div className="shrink-0 flex items-center bg-slate-100 rounded-full p-0.5 mt-0.5">
                                  <button
                                    onClick={() => setAccessLevel(mod.id, perm.id, "view")}
                                    className={`px-3.5 py-1.5 rounded-full text-xs transition-colors ${
                                      perm.accessLevel === "view"
                                        ? "bg-white text-slate-700 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                    }`}
                                  >
                                    View Only
                                  </button>
                                  {perm.supportsEdit && (
                                    <button
                                      onClick={() => setAccessLevel(mod.id, perm.id, "edit")}
                                      className={`px-3.5 py-1.5 rounded-full text-xs transition-colors ${
                                        perm.accessLevel === "edit"
                                          ? "bg-purple-700 text-white shadow-sm"
                                          : "text-slate-500 hover:text-slate-700"
                                      }`}
                                    >
                                      View & Edit
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}