import { useState } from "react";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  submenu?: string[];
}

interface NavSection {
  title: string;
  items: MenuItem[];
}

interface NavigationSidebarProps {
  selectedItem: string;
  onSelectItem: (item: string) => void;
}

export function NavigationSidebar({ selectedItem, onSelectItem }: NavigationSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["PROJECT MANAGEMENT"]));
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  const toggleMenu = (menuKey: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuKey)) {
      newExpanded.delete(menuKey);
    } else {
      newExpanded.add(menuKey);
    }
    setExpandedMenus(newExpanded);
  };

  // Favorites items without section header
  const favoriteItems: MenuItem[] = [
    { icon: <DashboardIcon />, label: "Dashboard" },
    { icon: <UserIcon />, label: "User management" },
    { icon: <SafeIcon />, label: "Document Vault" },
    { icon: <MegaphoneIcon />, label: "Content Manager" },
    { icon: <MessageIcon />, label: "Notification Center" },
  ];

  const navSections: NavSection[] = [
    {
      title: "EMPLOYEE SELF-SERVICE",
      items: [
        { icon: <HomeIcon />, label: "Home" },
        { icon: <UserCircleIcon />, label: "My Personal Information" },
        { icon: <BillIcon />, label: "Check My Payslip" },
        {
          icon: <UserCheckIcon />,
          label: "My Requests",
          submenu: ["Leave Request", "Travel Request", "Expense Claim", "Petty Cash", "Manpower Request", "Loan Request"],
        },
        { icon: <DocumentAddIcon />, label: "My Feedback" },
        { icon: <UserCheckIcon />, label: "Employee Timesheet" },
        { icon: <TaskIcon />, label: "My Tasks" },
        { icon: <DocumentIcon />, label: "Procurement Plan" },
        {
          icon: <ApprovalIcon />,
          label: "Approvals",
          submenu: ["Timesheet Approvals", "Leave Request Approvals", "Travel Request Approvals", "Task Completion Approval", "Procurement Request Approval", "Training Attendance Approval"],
        },
      ],
    },
    {
      title: "HR MANAGEMENT",
      items: [
        { icon: <DashboardIcon />, label: "Dashboard" },
        {
          icon: <UserCircleIcon />,
          label: "Recruitment & Hiring",
          submenu: ["Manpower Request", "Application Portal", "Applicants", "Interviews"],
        },
        {
          icon: <UserIcon />,
          label: "Employees",
          submenu: ["Employee Profiles", "Job Titles", "Contracts", "Departments"],
        },
        { icon: <UserCheckIcon />, label: "Performance Mgmt" },
        { icon: <DocumentAddIcon />, label: "Training & Development" },
        {
          icon: <ApprovalIcon />,
          label: "Approvals",
          submenu: ["Leave", "Travel", "Petty Cash", "Expense Claims", "Manpower Requests", "Advance Requests", "Staff Profile Updates", "Timesheet Approvals"],
        },
        {
          icon: <ApprovalIcon />,
          label: "Project Approvals",
          submenu: ["Staff Allocation Approvals"],
        },
        {
          icon: <ChartIcon />,
          label: "Reporting & Analytics",
          submenu: ["Headcount Report", "Turnover Report"],
        },
      ],
    },
    {
      title: "FINANCE",
      items: [
        { icon: <DashboardIcon />, label: "Dashboard" },
        { icon: <DocumentIcon />, label: "General Ledger" },
        { icon: <BillIcon />, label: "Payment Vouchers" },
        { icon: <BillIcon />, label: "Expenditure Management" },
        { 
          icon: <WalletIcon />, 
          label: "Budgeting & Planning",
          submenu: ["Operational Budgets", "Project Budgets"],
        },
        { icon: <BanknoteIcon />, label: "Funds Management" },
        { icon: <MoneyIcon />, label: "Accounts" },
        { icon: <MoneyBagIcon />, label: "Banking Management" },
        { icon: <DocumentsIcon />, label: "Summary" },
        { icon: <PenIcon />, label: "Journal Entries" },
        { icon: <AssetManagementIcon />, label: "Asset Management" },
        { icon: <DepreciationIcon />, label: "Depreciation Mgmt" },
        {
          icon: <ApprovalIcon />,
          label: "Approvals",
          submenu: ["Payment Approvals", "Budget Approvals", "Procurement Requests"],
        },
        {
          icon: <ChartIcon />,
          label: "Reporting & Analytics",
          submenu: ["Financial Statements", "Project Reports", "Audit Tray", "Timesheet Reports"],
        },
      ],
    },
    {
      title: "PAYROLL MANAGEMENT",
      items: [
        { icon: <DashboardIcon />, label: "Dashboard" },
        { icon: <BillIcon />, label: "Payroll" },
        { icon: <DocumentIcon />, label: "Allowances" },
        { 
          icon: <DocumentsIcon />, 
          label: "Deductions",
          submenu: ["Tax Table", "SNIT Rate", "PF Rate", "Loan", "Other Deductions"]
        },
        { icon: <ResourceIcon />, label: "Advance" },
        {
          icon: <ApprovalIcon />,
          label: "Approvals",
          submenu: ["Payroll"],
        },
        {
          icon: <ChartIcon />,
          label: "Reporting & Analytics",
          submenu: [
            "Payroll Report",
            "Payroll Schedule",
            "Payroll Schedule - Consolidated",
            "PAYE Schedule",
            "SSF - First Tier Report",
            "SSF - Second Tier Report",
            "Provident Fund Report",
            "Loan Deduction Schedule",
            "Other Deduction Schedule",
            "Bank Payment Schedule - Local Account",
            "Bank Transfer Schedule - Foreign Account",
          ],
        },
      ],
    },
    {
      title: "PROCUREMENT",
      items: [
        { icon: <DashboardIcon />, label: "Dashboard" },
        { icon: <AssetManagementIcon />, label: "Supplier Management" },
        { icon: <DocumentIcon />, label: "Purchase Requisitions" },
        { icon: <ResourceIcon />, label: "Sourcing" },
        { icon: <BillIcon />, label: "Purchase Order Mgnt" },
        { icon: <DocumentsIcon />, label: "Invoices" },
        { icon: <DocumentsIcon />, label: "Purchase Plan" },
        { icon: <ClipboardIcon />, label: "Contract Management" },
        { icon: <UsersIcon />, label: "Contractors" },
        {
          icon: <ApprovalIcon />,
          label: "Approvals",
          submenu: ["Purchase Requisitions", "Purchase Plan Approvals", "Senior Management Approval"],
        },
        {
          icon: <ChartIcon />,
          label: "Reporting & Analytics",
          submenu: ["Planning & Orders", "Sourcing & Contracts", "Vendors & KPIs"],
        },
      ],
    },
    {
      title: "PROJECT MANAGEMENT",
      items: [
        { icon: <DashboardIcon />, label: "Dashboard" },
        { icon: <FolderIcon />, label: "Programs" },
        { icon: <ProjectIcon />, label: "Projects" },
        { icon: <TaskIcon />, label: "Tasks" },
        { icon: <ClockIcon />, label: "Time Tracking" },
        { icon: <CalendarTimelineIcon />, label: "Project Timelines" },
        { icon: <ResourceIcon />, label: "Staff Allocation" },
        { icon: <ResourceIcon />, label: "Resource Plan" },
        {
          icon: <ApprovalIcon />,
          label: "Approvals",
          submenu: ["Task Completion Approval", "Project Documents Approval"],
        },
        {
          icon: <ChartIcon />,
          label: "Reports",
          submenu: ["Project Status Report", "Staff Utilization Report", "Timeline Report", "Budget vs Actual Report", "Task Completion Report"],
        },
      ],
    },
    {
      title: "MONITORING & EVALUATION",
      items: [
        { icon: <DashboardIcon />, label: "Dashboard" },
        { icon: <IndicatorIcon />, label: "MEL Frameworks" },
        { icon: <MonitorIcon />, label: "Performance Indicators" },
        { icon: <DatabaseIcon />, label: "Data Collection" },
        {
          icon: <ChartIcon />,
          label: "Reporting & Analytics",
          submenu: ["Donor Reports", "Management Reports", "M&E Reports", "Impact Assessment"],
        },
      ],
    },
    {
      title: "CRM",
      items: [
        { icon: <DashboardIcon />, label: "Dashboard" },
        { icon: <ContactIcon />, label: "Contact Management" },
        {
          icon: <DocumentIcon />,
          label: "Grant Management",
          submenu: ["Concepts", "Agreements", "Compliance"],
        },
        {
          icon: <MegaphoneIcon />,
          label: "Advocacy & Impact Hub",
          submenu: ["Activity Tracker", "Stakeholder Management", "Advocacy Calendar", "Content & Collateral", "Impact Monitoring"],
        },
      ],
    },
    {
      title: "LEGAL & CONTRACTS",
      items: [
        { icon: <DashboardIcon />, label: "Dashboard" },
        { icon: <DocumentIcon />, label: "Contract Repository" },
        { icon: <DocumentAddIcon />, label: "Drafting & Templates" },
        { icon: <ApprovalIcon />, label: "Requests Queue" },
      ],
    },
    {
      title: "KNOWLEDGE HUB",
      items: [
        { icon: <DashboardIcon />, label: "Dashboard" },
        { icon: <DocumentIcon />, label: "Proposal Library" },
        { icon: <FolderIcon />, label: "Project Artifacts" },
        { icon: <DocumentAddIcon />, label: "Template Engine" },
        { icon: <UsersIcon />, label: "Donor Intelligence" },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem, sectionTitle?: string) => {
    const itemId = sectionTitle ? `${sectionTitle}-${item.label}` : item.label;
    const menuKey = sectionTitle ? `${sectionTitle}::${item.label}` : item.label;
    const isSelected = selectedItem === itemId;
    
    return (
      <div key={item.label}>
        <button
          onClick={() => {
            if (item.submenu) {
              toggleMenu(menuKey);
            } else {
              onSelectItem(itemId);
            }
          }}
          className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded transition-colors group ${
            isSelected ? "bg-blue-50" : "hover:bg-slate-100"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className={isSelected ? "text-blue-600" : "text-slate-700 group-hover:text-slate-900"}>
              {item.icon}
            </span>
            <span className={`font-medium whitespace-nowrap ${isSelected ? "text-blue-600" : "text-slate-900"}`}>{item.label}</span>
          </div>
          {item.submenu && (
            expandedMenus.has(menuKey) ? (
              <svg className="w-3 h-3 text-blue-500" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 8L2 4h8L6 8z" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-blue-500" viewBox="0 0 12 12" fill="currentColor">
                <path d="M4 2L8 6L4 10V2z" />
              </svg>
            )
          )}
        </button>

      {/* Submenu Items */}
      {item.submenu && expandedMenus.has(menuKey) && (
        <div className="ml-9 flex flex-col gap-0.5 mt-0.5">
          {item.submenu.map((subitem) => {
            const subitemId = sectionTitle ? `${sectionTitle}-${item.label}-${subitem}` : `${item.label}-${subitem}`;
            const isSubitemSelected = selectedItem === subitemId;
            return (
              <button
                key={subitem}
                onClick={() => onSelectItem(subitemId)}
                className={`flex items-center w-full px-3 py-1.5 text-sm rounded transition-colors text-left ${
                  isSubitemSelected ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {subitem}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
  };

  return (
    <div className="absolute bg-gray-50 bottom-0 left-0 top-[57px] w-[288px] border-r border-slate-200 overflow-y-auto">
      <div className="p-4 flex flex-col gap-4">
        {/* Favorites - No Header */}
        <div className="flex flex-col gap-0.5">
          {favoriteItems.map((item) => renderMenuItem(item, "FAVORITES"))}
        </div>
        
        <div className="h-px bg-slate-200 my-2" />

        {/* Other Sections with Headers */}
        {navSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-1">
            {/* Section Header - Collapsible */}
            <button
              onClick={() => toggleSection(section.title)}
              className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 rounded transition-colors"
            >
              <span className="text-xs font-semibold text-violet-600 tracking-wider">
                {section.title}
              </span>
              {expandedSections.has(section.title) ? (
                <svg className="w-3 h-3 text-blue-500" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 8L2 4h8L6 8z" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-blue-500" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M4 2L8 6L4 10V2z" />
                </svg>
              )}
            </button>
            
            {/* Section Items */}
            {expandedSections.has(section.title) && (
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => renderMenuItem(item, section.title))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Icon components
function DashboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 17C4 14.2386 6.23858 12 9 12H11C13.7614 12 16 14.2386 16 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SafeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="14" height="13" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13" cy="10.5" r="1.5" fill="currentColor" />
      <path d="M3 4V3.5C3 2.67157 3.67157 2 4.5 2H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 5.5C3 4.67157 3.67157 4 4.5 4H15.5C16.3284 4 17 4.67157 17 5.5V13.5C17 14.3284 16.3284 15 15.5 15H6L3 17.5V5.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 10L10 3L17 10V16.5C17 17.0523 16.5523 17.5 16 17.5H12.5V13C12.5 12.4477 12.0523 12 11.5 12H8.5C7.94772 12 7.5 12.4477 7.5 13V17.5H4C3.44772 17.5 3 17.0523 3 16.5V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function UserCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 15.2361C6.60879 14.4721 7.7551 13.5 10 13.5C12.2449 13.5 13.3912 14.4721 14 15.2361" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BillIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 3H15C15.5523 3 16 3.44772 16 4V17L13.5 15.5L11 17L8.5 15.5L6 17V4C6 3.44772 5.55228 3 5 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="8" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="10" x2="12" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UserCheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 17C2 14.2386 4.23858 12 7 12H9C10.0609 12 11.0369 12.3173 11.8482 12.8568" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13 15L14.5 16.5L18 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocumentAddIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 3H11L15 7V17H5V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M11 3V7H15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="10" y1="10" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="12" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TaskIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ApprovalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 10L8 13L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 17V9M10 17V3M17 17V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 3H11L15 7V17H5V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M11 3V7H15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="7" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="13" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="14" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13.5" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function BanknoteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="16" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 6V14M15 6V14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6V7M10 13V14M12 9C12 8.44772 11.5523 8 11 8H9.5C8.94772 8 8.5 8.44772 8.5 9C8.5 9.55228 8.94772 10 9.5 10H10.5C11.0523 10 11.5 10.4477 11.5 11C11.5 11.5523 11.0523 12 10.5 12H9C8.44772 12 8 11.5523 8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MoneyBagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 8C6 8 6 7 8 7H12C14 7 14 8 14 8C14 8 16 9 16 12C16 15 14 17 10 17C6 17 4 15 4 12C4 9 6 8 6 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 7V5C8 3.89543 8.89543 3 10 3C11.1046 3 12 3.89543 12 5V7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function DocumentsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 3H12L16 7V17H6V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 3V7H16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4 6H6V14H4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 17L6 16L16 6L14 4L4 14L3 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 6L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AssetManagementIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="7" width="5" height="10" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="3" width="5" height="14" stroke="currentColor" strokeWidth="1.5" />
      <rect x="15" y="10" width="2" height="7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function DepreciationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6L10 3L17 6V11C17 14.5 14 17 10 17C6 17 3 14.5 3 11V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 8V12M8 10H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ProjectIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="5" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="13" width="6" height="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="13" width="6" height="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CalendarTimelineIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="14" height="13" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 4V2M13 4V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ResourceIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 17C2 14.7909 3.79086 13 6 13H8C10.2091 13 12 14.7909 12 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 17C8 14.7909 9.79086 13 12 13H14C16.2091 13 18 14.7909 18 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IndicatorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6V10L13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="16" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 17H13M10 14V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="10" cy="5" rx="6" ry="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 5V15C4 16.1046 6.68629 17 10 17C13.3137 17 16 16.1046 16 15V5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 10C4 11.1046 6.68629 12 10 12C13.3137 12 16 11.1046 16 10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 15C7 13.3431 8.34315 12 10 12C11.6569 12 13 13.3431 13 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7L15 3V17L4 13V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4 10H2V11C2 11.5523 2.44772 12 3 12H4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 13L7 17L9 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6C3 5.44772 3.44772 5 4 5H7L9 7H16C16.5523 7 17 7.44772 17 8V15C17 15.5523 16.5523 16 16 16H4C3.44772 16 3 15.5523 3 15V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 17C2 14.7909 3.79086 13 6 13H8C10.2091 13 12 14.7909 12 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 17C8 14.7909 9.79086 13 12 13H14C16.2091 13 18 14.7909 18 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="14" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 4V2M13 4V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}