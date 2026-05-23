import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  MapPin,
  Briefcase,
  TrendingUp,
  List,
} from "lucide-react";

// ── Mock Data ──
interface ContractorDetail {
  id: string;
  name: string;
  company: string;
  contractNumber: string;
  category: string;
  totalContract: number;
  totalPaid: number;
  balance: number;
  activeTasks: number;
  completedTasks: number;
  status: "active" | "completed" | "on-hold";
  startDate: string;
  endDate: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  registrationNumber: string;
  bankAccount: string;
  bankName: string;
  contactPerson: string;
  contactPersonPhone: string;
  contractDescription: string;
  paymentTerms: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "overdue";
  assignedDate: string;
  dueDate: string;
  completedDate?: string;
  paymentAmount: number;
  isPaid: boolean;
  deliverables: string;
  notes: string;
}

const MOCK_CONTRACTOR_DETAILS: Record<string, ContractorDetail> = {
  "CTR-001": {
    id: "CTR-001",
    name: "Kwame Mensah",
    company: "TechBuild Solutions Ltd",
    contractNumber: "CON-2026-014",
    category: "IT Services",
    totalContract: 85000,
    totalPaid: 52000,
    balance: 33000,
    activeTasks: 3,
    completedTasks: 8,
    status: "active",
    startDate: "Jan 15, 2026",
    endDate: "Jun 30, 2026",
    email: "k.mensah@techbuild.com",
    phone: "+233 24 123 4567",
    address: "45 Independence Avenue, Accra, Ghana",
    taxId: "TIN-C0012345",
    registrationNumber: "REG-2023-8765",
    bankAccount: "0012-3456-7890-1234",
    bankName: "GCB Bank",
    contactPerson: "Abena Mensah",
    contactPersonPhone: "+233 24 123 4568",
    contractDescription: "Development and maintenance of organization's web platform and mobile applications",
    paymentTerms: "Payment upon milestone completion, Net 30 days",
  },
};

const MOCK_TASKS: Record<string, Task[]> = {
  "CTR-001": [
    {
      id: "TSK-001",
      title: "Website Homepage Redesign",
      description: "Complete redesign of organization homepage with new branding guidelines",
      status: "completed",
      assignedDate: "Jan 20, 2026",
      dueDate: "Feb 15, 2026",
      completedDate: "Feb 12, 2026",
      paymentAmount: 8500,
      isPaid: true,
      deliverables: "Responsive homepage design, mobile optimization, accessibility compliance",
      notes: "Completed ahead of schedule. Client satisfied with results.",
    },
    {
      id: "TSK-002",
      title: "Database Migration & Optimization",
      description: "Migrate legacy database to new cloud infrastructure and optimize queries",
      status: "completed",
      assignedDate: "Feb 01, 2026",
      dueDate: "Feb 28, 2026",
      completedDate: "Feb 27, 2026",
      paymentAmount: 12000,
      isPaid: true,
      deliverables: "Migrated database, performance report, backup procedures documentation",
      notes: "Migration completed successfully with zero downtime.",
    },
    {
      id: "TSK-003",
      title: "Mobile App Development - Phase 1",
      description: "Develop iOS and Android mobile applications for staff portal",
      status: "in-progress",
      assignedDate: "Feb 10, 2026",
      dueDate: "Mar 30, 2026",
      paymentAmount: 18000,
      isPaid: false,
      deliverables: "Beta versions for iOS and Android, user testing documentation",
      notes: "Currently at 60% completion. On track for delivery.",
    },
    {
      id: "TSK-004",
      title: "API Integration - Finance Module",
      description: "Integrate third-party accounting software API with internal systems",
      status: "in-progress",
      assignedDate: "Feb 20, 2026",
      dueDate: "Mar 20, 2026",
      paymentAmount: 9500,
      isPaid: false,
      deliverables: "Working API integration, documentation, error handling",
      notes: "API testing in progress. Some authentication challenges resolved.",
    },
    {
      id: "TSK-005",
      title: "Security Audit & Penetration Testing",
      description: "Comprehensive security assessment of all web applications",
      status: "pending",
      assignedDate: "Mar 01, 2026",
      dueDate: "Mar 25, 2026",
      paymentAmount: 7500,
      isPaid: false,
      deliverables: "Security audit report, vulnerability assessment, recommendations",
      notes: "Scheduled to begin after mobile app phase 1 completion.",
    },
    {
      id: "TSK-006",
      title: "Staff Training - Platform Usage",
      description: "Conduct training sessions for staff on new platform features",
      status: "completed",
      assignedDate: "Feb 05, 2026",
      dueDate: "Feb 18, 2026",
      completedDate: "Feb 17, 2026",
      paymentAmount: 4500,
      isPaid: true,
      deliverables: "Training materials, recorded sessions, attendance records",
      notes: "3 sessions conducted. 95% staff attendance achieved.",
    },
    {
      id: "TSK-007",
      title: "Cloud Infrastructure Setup",
      description: "Configure and deploy cloud infrastructure for scalability",
      status: "completed",
      assignedDate: "Jan 25, 2026",
      dueDate: "Feb 08, 2026",
      completedDate: "Feb 07, 2026",
      paymentAmount: 11000,
      isPaid: true,
      deliverables: "Configured AWS environment, load balancers, auto-scaling",
      notes: "Infrastructure setup complete. Monitoring tools deployed.",
    },
    {
      id: "TSK-008",
      title: "Backup & Disaster Recovery Plan",
      description: "Implement automated backup solution and disaster recovery procedures",
      status: "completed",
      assignedDate: "Feb 12, 2026",
      dueDate: "Feb 26, 2026",
      completedDate: "Feb 25, 2026",
      paymentAmount: 6500,
      isPaid: true,
      deliverables: "Automated backup system, recovery documentation, testing report",
      notes: "Backup system tested successfully. RTO under 2 hours.",
    },
    {
      id: "TSK-009",
      title: "Performance Monitoring Dashboard",
      description: "Build real-time monitoring dashboard for system performance",
      status: "completed",
      assignedDate: "Jan 30, 2026",
      dueDate: "Feb 20, 2026",
      completedDate: "Feb 19, 2026",
      paymentAmount: 8000,
      isPaid: true,
      deliverables: "Monitoring dashboard, alert configuration, documentation",
      notes: "Dashboard provides comprehensive system health metrics.",
    },
    {
      id: "TSK-010",
      title: "Email System Migration",
      description: "Migrate email system to Office 365 with enhanced security",
      status: "completed",
      assignedDate: "Feb 08, 2026",
      dueDate: "Feb 22, 2026",
      completedDate: "Feb 21, 2026",
      paymentAmount: 7000,
      isPaid: true,
      deliverables: "Migrated mailboxes, security policies, user guides",
      notes: "All 150 mailboxes migrated successfully. No data loss.",
    },
    {
      id: "TSK-011",
      title: "Mobile App Development - Phase 2",
      description: "Additional features and integration for mobile applications",
      status: "pending",
      assignedDate: "Apr 01, 2026",
      dueDate: "May 15, 2026",
      paymentAmount: 15000,
      isPaid: false,
      deliverables: "Enhanced mobile apps, push notifications, offline functionality",
      notes: "Awaiting completion of Phase 1 before starting.",
    },
  ],
};

// Fallback data
const getContractorDetails = (id: string): ContractorDetail => {
  return (
    MOCK_CONTRACTOR_DETAILS[id] || {
      id,
      name: "Unknown Contractor",
      company: "N/A",
      contractNumber: "N/A",
      category: "N/A",
      totalContract: 0,
      totalPaid: 0,
      balance: 0,
      activeTasks: 0,
      completedTasks: 0,
      status: "active",
      startDate: "N/A",
      endDate: "N/A",
      email: "N/A",
      phone: "N/A",
      address: "N/A",
      taxId: "N/A",
      registrationNumber: "N/A",
      bankAccount: "N/A",
      bankName: "N/A",
      contactPerson: "N/A",
      contactPersonPhone: "N/A",
      contractDescription: "N/A",
      paymentTerms: "N/A",
    }
  );
};

const getTasks = (contractorId: string): Task[] => {
  return MOCK_TASKS[contractorId] || [];
};

interface ContractorDetailViewProps {
  contractorId: string;
  onBack: () => void;
}

export function ContractorDetailView({ contractorId, onBack }: ContractorDetailViewProps) {
  const [activeTab, setActiveTab] = useState<"info" | "tasks">("info");

  const contractor = getContractorDetails(contractorId);
  const tasks = getTasks(contractorId);

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-[11px] border border-green-200">
            <CheckCircle2 size={11} /> Active Contract
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] border border-blue-200">
            <CheckCircle2 size={11} /> Completed
          </span>
        );
      case "on-hold":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] border border-amber-200">
            <Clock size={11} /> On-Hold
          </span>
        );
      default:
        return null;
    }
  };

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] border border-green-200">
            <CheckCircle2 size={9} /> Completed
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] border border-blue-200">
            <Clock size={9} /> In Progress
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-700 rounded-full text-[10px] border border-slate-200">
            <Clock size={9} /> Pending
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-[10px] border border-red-200">
            <AlertCircle size={9} /> Overdue
          </span>
        );
      default:
        return null;
    }
  };

  const completionRate = contractor.totalContract > 0 
    ? Math.round((contractor.totalPaid / contractor.totalContract) * 100) 
    : 0;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-semibold text-slate-900">{contractor.name}</h1>
              {getStatusBadge(contractor.status)}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Building2 size={11} /> {contractor.company}
              </span>
              <span>•</span>
              <span className="font-mono text-blue-600">{contractor.contractNumber}</span>
              <span>•</span>
              <span>{contractor.category}</span>
            </div>
          </div>
        </div>

        {/* Payment Summary Cards */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-blue-700">Total Contract</span>
              <FileText size={13} className="text-blue-600" />
            </div>
            <p className="text-lg font-semibold text-blue-900">{formatCurrency(contractor.totalContract)}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-green-700">Total Paid</span>
              <CheckCircle2 size={13} className="text-green-600" />
            </div>
            <p className="text-lg font-semibold text-green-900">{formatCurrency(contractor.totalPaid)}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-amber-700">Balance Due</span>
              <DollarSign size={13} className="text-amber-600" />
            </div>
            <p className="text-lg font-semibold text-amber-900">{formatCurrency(contractor.balance)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-purple-700">Completion</span>
              <TrendingUp size={13} className="text-purple-600" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold text-purple-900">{completionRate}%</p>
              <div className="flex-1 bg-purple-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: `${completionRate}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs (Document Vault style) */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[140px] flex items-center justify-center gap-1.5 ${
              activeTab === "info" ? "bg-purple-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <User size={14} />
            Contractor Info
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[140px] flex items-center justify-center gap-1.5 ${
              activeTab === "tasks" ? "bg-purple-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <List size={14} />
            Tasks
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === "tasks" ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"
              }`}
            >
              {tasks.length}
            </span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "info" ? (
          <div className="max-w-5xl space-y-4">
            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 border-b border-slate-200 bg-slate-50">
                <h3 className="text-[13px] font-medium text-slate-900">Contact Information</h3>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 mb-0.5">Email</p>
                    <p className="text-sm text-slate-900">{contractor.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone size={14} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 mb-0.5">Phone</p>
                    <p className="text-sm text-slate-900">{contractor.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 col-span-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={14} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 mb-0.5">Address</p>
                    <p className="text-sm text-slate-900">{contractor.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 mb-0.5">Contact Person</p>
                    <p className="text-sm text-slate-900">{contractor.contactPerson}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{contractor.contactPersonPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company & Registration Details */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 border-b border-slate-200 bg-slate-50">
                <h3 className="text-[13px] font-medium text-slate-900">Company & Registration</h3>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-slate-500 mb-1">Company Name</p>
                  <p className="text-sm text-slate-900">{contractor.company}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-1">Registration Number</p>
                  <p className="text-sm text-slate-900 font-mono">{contractor.registrationNumber}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-1">Tax ID</p>
                  <p className="text-sm text-slate-900 font-mono">{contractor.taxId}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-1">Category</p>
                  <p className="text-sm text-slate-900">{contractor.category}</p>
                </div>
              </div>
            </div>

            {/* Banking Information */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 border-b border-slate-200 bg-slate-50">
                <h3 className="text-[13px] font-medium text-slate-900">Banking Information</h3>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-slate-500 mb-1">Bank Name</p>
                  <p className="text-sm text-slate-900">{contractor.bankName}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-1">Account Number</p>
                  <p className="text-sm text-slate-900 font-mono">{contractor.bankAccount}</p>
                </div>
              </div>
            </div>

            {/* Contract Details */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 border-b border-slate-200 bg-slate-50">
                <h3 className="text-[13px] font-medium text-slate-900">Contract Details</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar size={14} className="text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 mb-0.5">Start Date</p>
                      <p className="text-sm text-slate-900">{contractor.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar size={14} className="text-rose-600" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 mb-0.5">End Date</p>
                      <p className="text-sm text-slate-900">{contractor.endDate}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-1">Contract Description</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{contractor.contractDescription}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-1">Payment Terms</p>
                  <p className="text-sm text-slate-700">{contractor.paymentTerms}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-[11px] text-slate-500 mb-1">Active Tasks</p>
                    <p className="text-lg font-semibold text-green-600">{contractor.activeTasks}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 mb-1">Completed Tasks</p>
                    <p className="text-lg font-semibold text-blue-600">{contractor.completedTasks}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 mb-1">Total Tasks</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {contractor.activeTasks + contractor.completedTasks}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Tasks Tab */
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <Briefcase size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No tasks found for this contractor</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-300 transition-colors">
                  <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-500 font-mono">{task.id}</span>
                      <h3 className="text-sm font-medium text-slate-900">{task.title}</h3>
                      {getTaskStatusBadge(task.status)}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[11px] text-slate-500">Payment</p>
                        <p className="text-sm font-semibold text-slate-900">{formatCurrency(task.paymentAmount)}</p>
                      </div>
                      {task.isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] border border-green-200">
                          <CheckCircle2 size={9} /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] border border-amber-200">
                          <Clock size={9} /> Unpaid
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-[11px] text-slate-500 mb-1">Assigned Date</p>
                        <p className="text-sm text-slate-900">{task.assignedDate}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500 mb-1">Due Date</p>
                        <p className="text-sm text-slate-900">{task.dueDate}</p>
                      </div>
                      {task.completedDate && (
                        <div>
                          <p className="text-[11px] text-slate-500 mb-1">Completed Date</p>
                          <p className="text-sm text-green-700">{task.completedDate}</p>
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <p className="text-[11px] text-slate-500 mb-1">Description</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{task.description}</p>
                    </div>
                    <div className="mb-3">
                      <p className="text-[11px] text-slate-500 mb-1">Deliverables</p>
                      <p className="text-sm text-slate-700">{task.deliverables}</p>
                    </div>
                    {task.notes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-[11px] text-blue-700 mb-1 font-medium">Notes</p>
                        <p className="text-[11px] text-blue-900">{task.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
