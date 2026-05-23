import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  PenSquare,
  Bell,
  Home,
  CircleUser,
  Receipt,
  ClipboardList,
  MessageSquarePlus,
  Clock,
  ListChecks,
  ShoppingCart,
  CheckCircle,
  UserPlus,
  Award,
  GraduationCap,
  CheckCircle2,
  BarChart3,
  BookOpen,
  Wallet,
  Banknote,
  CircleDollarSign,
  Package,
  Gift,
  MinusCircle,
  ArrowUpCircle,
  Truck,
  Search,
  FileText,
  CalendarCheck,
  ScrollText,
  HardHat,
  FolderKanban,
  Briefcase,
  Timer,
  CalendarRange,
  UserCog,
  Layers,
  Target,
  Activity,
  Database,
  Contact2,
  Handshake,
  Megaphone,
  FolderOpen,
} from "lucide-react";

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
  collapsed?: boolean;
}

export function NavigationSidebar({ selectedItem, onSelectItem, collapsed }: NavigationSidebarProps) {
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

  const iconSize = 18;

  // Favorites items without section header
  const favoriteItems: MenuItem[] = [
    { icon: <LayoutDashboard size={iconSize} />, label: "Dashboard" },
    { icon: <Users size={iconSize} />, label: "User management" },
    { icon: <PenSquare size={iconSize} />, label: "Content Manager" },
    { icon: <Bell size={iconSize} />, label: "Notification Center" },
  ];

  const navSections: NavSection[] = [
    {
      title: "EMPLOYEE SELF-SERVICE",
      items: [
        { icon: <Home size={iconSize} />, label: "Home" },
        { icon: <CircleUser size={iconSize} />, label: "My Personal Information" },
        { icon: <Receipt size={iconSize} />, label: "Check My Payslip" },
        {
          icon: <ClipboardList size={iconSize} />,
          label: "My Requests",
          submenu: ["Leave Request", "Travel Request", "Expense Claim", "Petty Cash", "Manpower Request", "Loan Request", "Comms Request"],
        },
        { icon: <Clock size={iconSize} />, label: "Employee Timesheet" },
        { icon: <Award size={iconSize} />, label: "Employee Scorecard" },
        { icon: <ListChecks size={iconSize} />, label: "My Tasks" },
        { icon: <ShoppingCart size={iconSize} />, label: "Procurement Plan" },
        {
          icon: <CheckCircle size={iconSize} />,
          label: "Approvals",
          submenu: ["Timesheet Approvals", "Leave Request Approvals", "Travel Request Approvals", "Task Completion Approval", "Procurement Request Approval", "Training Attendance Approval"],
        },
      ],
    },
    {
      title: "HR MANAGEMENT",
      items: [
        { icon: <LayoutDashboard size={iconSize} />, label: "Dashboard" },
        {
          icon: <UserPlus size={iconSize} />,
          label: "Recruitment & Hiring",
          submenu: ["Manpower Request", "Application Portal", "Applicants", "Interviews"],
        },
        {
          icon: <Users size={iconSize} />,
          label: "Employees",
          submenu: ["Employee Profiles", "Job Titles", "Contracts", "Departments"],
        },
        { icon: <Award size={iconSize} />, label: "ACET Scorecard" },
        { icon: <GraduationCap size={iconSize} />, label: "Training & Development" },
        { icon: <FolderOpen size={iconSize} />, label: "Document Vault" },
        {
          icon: <CheckCircle size={iconSize} />,
          label: "Approvals",
          submenu: ["Leave", "Travel", "Petty Cash", "Expense Claims", "Manpower Requests", "Advance Requests", "Staff Profile Updates", "Timesheet Approvals"],
        },
        {
          icon: <CheckCircle2 size={iconSize} />,
          label: "Project Approvals",
          submenu: ["Staff Allocation Approvals"],
        },
        {
          icon: <BarChart3 size={iconSize} />,
          label: "Reporting & Analytics",
          submenu: ["Headcount Report", "Turnover Report"],
        },
      ],
    },
    {
      title: "FINANCE",
      items: [
        { icon: <LayoutDashboard size={iconSize} />, label: "Dashboard" },
        { icon: <FileText size={iconSize} />, label: "Create Entries" },
        { icon: <BookOpen size={iconSize} />, label: "General Ledger" },
        { icon: <CalendarRange size={iconSize} />, label: "Period Management" },
        { icon: <CircleDollarSign size={iconSize} />, label: "Multi-Currency" },
        { icon: <Layers size={iconSize} />, label: "Control Accounts" },
        {
          icon: <Wallet size={iconSize} />,
          label: "Budgeting & Planning",
          submenu: ["Operational Budgets", "Project Budgets"],
        },
        { icon: <Banknote size={iconSize} />, label: "Funds Management" },
        { icon: <CircleDollarSign size={iconSize} />, label: "Chart of Accounts" },
        {
          icon: <Package size={iconSize} />,
          label: "Asset Management",
          submenu: ["Assets", "Depreciation Mgmt"],
        },
        {
          icon: <CheckCircle size={iconSize} />,
          label: "Approvals",
          submenu: ["Payment Approvals", "Budget Approvals", "Procurement Requests", "Expense Claims", "Advance Requests", "Petty Cash", "Payroll"],
        },
        {
          icon: <BarChart3 size={iconSize} />,
          label: "Reporting & Analytics",
          submenu: ["Financial Statements", "Project Reports", "Audit Tray", "Audit Trail", "Timesheet Reports"],
        },
      ],
    },
    {
      title: "PAYROLL MANAGEMENT",
      items: [
        { icon: <LayoutDashboard size={iconSize} />, label: "Dashboard" },
        { icon: <Receipt size={iconSize} />, label: "Payroll" },
        { icon: <Gift size={iconSize} />, label: "Allowances" },
        {
          icon: <MinusCircle size={iconSize} />,
          label: "Deductions",
          submenu: ["Tax Table", "SNIT Rate", "PF Rate", "Loan", "Other Deductions"]
        },
        { icon: <ArrowUpCircle size={iconSize} />, label: "Advance" },
        {
          icon: <CheckCircle size={iconSize} />,
          label: "Approvals",
          submenu: ["Payroll"],
        },
        {
          icon: <BarChart3 size={iconSize} />,
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
        { icon: <LayoutDashboard size={iconSize} />, label: "Dashboard" },
        { icon: <Truck size={iconSize} />, label: "Supplier Management" },
        { icon: <ClipboardList size={iconSize} />, label: "Purchase Requisitions" },
        { icon: <Search size={iconSize} />, label: "Sourcing" },
        { icon: <ShoppingCart size={iconSize} />, label: "Purchase Order Mgnt" },
        { icon: <FileText size={iconSize} />, label: "Invoices" },
        { icon: <CalendarCheck size={iconSize} />, label: "Purchase Plan" },
        { icon: <ScrollText size={iconSize} />, label: "Contract Management" },
        { icon: <HardHat size={iconSize} />, label: "Contractors" },
        {
          icon: <CheckCircle size={iconSize} />,
          label: "Approvals",
          submenu: ["Purchase Requisitions", "Procurement Plan Approvals", "Senior Management Approval"],
        },
        {
          icon: <BarChart3 size={iconSize} />,
          label: "Reporting & Analytics",
          submenu: ["Planning & Orders Report", "Sourcing & Contracts Report", "Vendors & KPIs Report", "Contract Reports", "Donor Reports", "Combined Analysis Report"],
        },
      ],
    },
    {
      title: "PROJECT MANAGEMENT",
      items: [
        { icon: <LayoutDashboard size={iconSize} />, label: "Dashboard" },
        { icon: <FolderKanban size={iconSize} />, label: "Programs" },
        { icon: <Briefcase size={iconSize} />, label: "Projects" },
        { icon: <ListChecks size={iconSize} />, label: "Tasks" },
        { icon: <Timer size={iconSize} />, label: "Time Tracking" },
        { icon: <CalendarRange size={iconSize} />, label: "Project Timelines" },
        { icon: <UserCog size={iconSize} />, label: "Staff Allocation" },
        { icon: <Layers size={iconSize} />, label: "Resource Plan" },
        { icon: <FolderOpen size={iconSize} />, label: "Document Vault" },
        {
          icon: <CheckCircle size={iconSize} />,
          label: "Approvals",
          submenu: ["Task Completion Approval", "Project Documents Approval"],
        },
        {
          icon: <BarChart3 size={iconSize} />,
          label: "Reports",
          submenu: ["Project Status Report", "Staff Utilization Report", "Timeline Report", "Budget vs Actual Report", "Task Completion Report"],
        },
      ],
    },
    {
      title: "MONITORING & EVALUATION",
      items: [
        { icon: <LayoutDashboard size={iconSize} />, label: "Dashboard" },
        { icon: <Target size={iconSize} />, label: "MEL Frameworks" },
        { icon: <Activity size={iconSize} />, label: "Performance Indicators" },
        { icon: <Database size={iconSize} />, label: "Data Collection" },
        {
          icon: <BarChart3 size={iconSize} />,
          label: "Reporting & Analytics",
          submenu: ["Donor Reports", "Management Reports", "M&E Reports", "Impact Assessment"],
        },
      ],
    },
    {
      title: "CRM",
      items: [
        { icon: <LayoutDashboard size={iconSize} />, label: "Dashboard" },
        {
          icon: <Contact2 size={iconSize} />,
          label: "Contact Management",
          submenu: ["Relationship Map", "Stakeholder Management", "Organizations"],
        },
        {
          icon: <Handshake size={iconSize} />,
          label: "Grant Management",
          submenu: ["Concepts", "Agreements", "Compliance"],
        },
        {
          icon: <Megaphone size={iconSize} />,
          label: "Advocacy & Impact Hub",
          submenu: ["Activity Tracker", "Advocacy Calendar", "Impact Monitoring"],
        },
        { icon: <FolderOpen size={iconSize} />, label: "Document Vault" },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem, sectionTitle?: string) => {
    const itemId = sectionTitle ? `${sectionTitle}-${item.label}` : item.label;
    const menuKey = sectionTitle ? `${sectionTitle}::${item.label}` : item.label;
    const isSelected = selectedItem === itemId;
    
    if (collapsed) {
      return (
        <div key={item.label} className="relative group">
          <button
            onClick={() => { if (!item.submenu) onSelectItem(itemId); }}
            className={`flex items-center justify-center w-full p-2 rounded transition-colors ${isSelected ? "bg-blue-50" : "hover:bg-slate-100"}`}
            title={item.label}
          >
            <span className={isSelected ? "text-blue-600" : "text-slate-700"}>{item.icon}</span>
          </button>
          <div className="absolute left-full top-0 ml-1 hidden group-hover:block z-50">
            <div className="bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded shadow-lg whitespace-nowrap">{item.label}</div>
          </div>
        </div>
      );
    }

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
    <div className={`absolute bg-gray-50 bottom-0 left-0 top-[57px] ${collapsed ? "w-[64px]" : "w-[288px]"} border-r border-slate-200 overflow-y-auto transition-all duration-200`}>
      <div className={`${collapsed ? "p-2" : "p-4"} flex flex-col gap-4`}>
        {/* Favorites - No Header */}
        <div className="flex flex-col gap-0.5">
          {favoriteItems.map((item) => renderMenuItem(item, "FAVORITES"))}
        </div>

        <div className="h-px bg-slate-200 my-2" />

        {/* Other Sections with Headers */}
        {navSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-1">
            {/* Section Header - Collapsible */}
            {collapsed ? (
              <div className="h-px bg-slate-200 my-1" />
            ) : (
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
            )}

            {/* Section Items */}
            {(collapsed || expandedSections.has(section.title)) && (
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

