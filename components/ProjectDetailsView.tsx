import { ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Lock, FileText, ShoppingCart, AlertTriangle, BarChart3, Layers, DollarSign, CheckCircle2, TrendingUp, MoreHorizontal, MessageSquare, Shield, Link2, FileSignature, Calendar, ExternalLink, ClipboardList } from "lucide-react";
import { ProjectConceptForm } from "./ProjectConceptForm";
import { ProjectPhasesForm } from "./ProjectPhasesForm";
import { InceptionDocumentCards } from "./InceptionDocumentCards";
import { RiskManagementPlanBuilder } from "./RiskManagementPlanBuilder";
import { CommsPlanBuilder } from "./CommsPlanBuilder";
import { DocumentDetailsInput } from "./DocumentDetailsInput";
import { ResourcePlanView } from "./ResourcePlanView";
import { StaffAllocationView } from "./StaffAllocationView";
import { TravelPlanBuilder } from "./TravelPlanBuilder";
import { BudgetTreeTable } from "./BudgetTreeTable";
import { ProjectOverviewDashboard } from "./ProjectOverviewDashboard";
import { ProjectProcurementTab } from "./ProjectProcurementTab";
import { ChangeRequestList, ChangeRequestForm } from "./ChangeRequestModal";
import type { ChangeRequest } from "./ChangeRequestModal";
import { ProjectMELPlan } from "./ProjectMELPlan";

interface Task {
  id: string;
  name: string;
  assignedTo: string;
  startDate: string;
  endDate: string;
  hours: number;
  status: "Completed" | "In Progress" | "Not Started" | "On Hold";
}

interface Phase {
  number: number;
  name: string;
  tasks: Task[];
}

interface GanttTask {
  name: string;
  startMonth: number;
  duration: number;
  color: string;
}

interface GanttMarker {
  label: string;
  monthPosition: number;
  category: "reporting" | "milestone" | "deliverable";
  date: string;
}

interface LinkedProposal {
  id: string;
  title: string;
  donor: string;
  date: string;
  budget: string;
}

interface LinkedContract {
  id: string;
  title: string;
  donor: string;
  signedDate: string;
  value: string;
}

interface SetupDeliverable {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isPrimary: boolean;
}

interface SetupReportingRequirement {
  id: string;
  reportType: string;
  frequency: string;
  dueOffset: string;
  recipient: string;
}

interface SetupMilestone {
  id: string;
  title: string;
  targetDate: string;
  payment: string;
  description: string;
}

interface SupportingDocument {
  id: string;
  name: string;
  size: string;
  version: number;
  uploadedAt: string;
  uploadedBy: string;
}

interface DonorSetupCard {
  id: string;
  donor: string;
  contractStartDate: string;
  contractEndDate: string;
  totalBudget: string;
  linkedProposal: LinkedProposal | null;
  linkedContract: LinkedContract | null;
  deliverables: SetupDeliverable[];
  reportingRequirements: SetupReportingRequirement[];
  milestones: SetupMilestone[];
  supportingDocuments: SupportingDocument[];
}

interface ProjectDetailsViewProps {
  project: {
    id: string;
    name: string;
    projectManager: string;
    startDate: string;
    endDate: string;
    progress: number;
    milestoneStatus: string;
    riskLevel: string;
    budgetSpent?: string;
    status: string;
    stage?: string;
    program?: string;
  };
  onBack: () => void;
  onNavigateToWBS?: () => void;
  onNavigateToProcurementPlan?: () => void;
  onNavigateToBudget?: () => void;
  onNavigateToRiskManagement?: () => void;
  onNavigateToCommsPlan?: () => void;
}

// Mock data for project phases and tasks
const getProjectPhases = (projectId: string): Phase[] => {
  // Different data based on project ID
  if (projectId === "1") {
    return [
      {
        number: 1,
        name: "Procurement & Contracting",
        tasks: [
          {
            id: "T1-1",
            name: "Draft Request for Proposals (RFP)",
            assignedTo: "Ama Darko",
            startDate: "Jan 15, 2025",
            endDate: "Feb 15, 2025",
            hours: 120,
            status: "Completed"
          },
          {
            id: "T1-2",
            name: "Evaluate Vendor Submissions",
            assignedTo: "Yaw Osei",
            startDate: "Jan 20, 2025",
            endDate: "Feb 10, 2025",
            hours: 80,
            status: "Completed"
          },
          {
            id: "T1-3",
            name: "Finalize Service Agreements",
            assignedTo: "Kofi Mensah",
            startDate: "Feb 1, 2025",
            endDate: "Feb 28, 2025",
            hours: 100,
            status: "Completed"
          }
        ]
      },
      {
        number: 2,
        name: "Implementation",
        tasks: [
          {
            id: "T2-1",
            name: "Coordinate Field Data Collection",
            assignedTo: "Yaw Osei",
            startDate: "Mar 1, 2025",
            endDate: "Mar 20, 2025",
            hours: 90,
            status: "Completed"
          },
          {
            id: "T2-2",
            name: "Conduct Stakeholder Engagement Sessions",
            assignedTo: "Kwaku Anane",
            startDate: "Mar 25, 2025",
            endDate: "May 15, 2025",
            hours: 200,
            status: "In Progress"
          },
          {
            id: "T2-3",
            name: "Procure IT Equipment",
            assignedTo: "Ama Darko",
            startDate: "Apr 10, 2025",
            endDate: "May 20, 2025",
            hours: 75,
            status: "In Progress"
          }
        ]
      },
      {
        number: 3,
        name: "Quality Assurance",
        tasks: [
          {
            id: "T3-1",
            name: "Conduct Internal Peer Review of Draft",
            assignedTo: "Kofi Mensah",
            startDate: "May 25, 2025",
            endDate: "Jul 10, 2025",
            hours: 150,
            status: "Not Started"
          },
          {
            id: "T3-2",
            name: "Run Data Validation Checks",
            assignedTo: "Nana Yaw",
            startDate: "Jun 1, 2025",
            endDate: "Jun 30, 2025",
            hours: 60,
            status: "Not Started"
          }
        ]
      },
      {
        number: 4,
        name: "Production & Editorial",
        tasks: [
          {
            id: "T4-1",
            name: "Design and Layout Report",
            assignedTo: "Yaw Osei",
            startDate: "Jul 1, 2025",
            endDate: "Jul 30, 2025",
            hours: 80,
            status: "Not Started"
          },
          {
            id: "T4-2",
            name: "Complete Editorial Review",
            assignedTo: "Kofi Mensah",
            startDate: "Jul 15, 2025",
            endDate: "Aug 10, 2025",
            hours: 60,
            status: "Not Started"
          }
        ]
      },
      {
        number: 5,
        name: "Dissemination",
        tasks: [
          {
            id: "T5-1",
            name: "Plan Distribution Channels",
            assignedTo: "Yaw Osei",
            startDate: "Aug 10, 2025",
            endDate: "Aug 20, 2025",
            hours: 40,
            status: "Not Started"
          },
          {
            id: "T5-2",
            name: "Conduct Stakeholder Workshops",
            assignedTo: "Kofi Mensah",
            startDate: "Aug 15, 2025",
            endDate: "Aug 30, 2025",
            hours: 50,
            status: "Not Started"
          }
        ]
      },
      {
        number: 6,
        name: "Reporting",
        tasks: [
          {
            id: "T6-1",
            name: "Submit Final Technical Report",
            assignedTo: "Yaw Osei",
            startDate: "Sep 1, 2025",
            endDate: "Sep 20, 2025",
            hours: 60,
            status: "Not Started"
          },
          {
            id: "T6-2",
            name: "Compile Lessons Learned",
            assignedTo: "Nana Yaw",
            startDate: "Sep 10, 2025",
            endDate: "Sep 25, 2025",
            hours: 40,
            status: "Not Started"
          }
        ]
      },
      {
        number: 7,
        name: "Delivery Stage Complete",
        tasks: [
          {
            id: "T7-1",
            name: "Sign-off and Handover",
            assignedTo: "Yaw Osei",
            startDate: "Sep 25, 2025",
            endDate: "Sep 30, 2025",
            hours: 20,
            status: "Not Started"
          }
        ]
      }
    ];
  }
  
  // Default phases for other projects
  return [
    {
      number: 1,
      name: "Procurement & Contracting",
      tasks: [
        {
          id: "T1-1",
          name: "Draft Request for Proposals (RFP)",
          assignedTo: "Project Manager",
          startDate: "Jan 1, 2025",
          endDate: "Jan 31, 2025",
          hours: 80,
          status: "Completed"
        },
        {
          id: "T1-2",
          name: "Evaluate Vendor Submissions",
          assignedTo: "Research Team",
          startDate: "Jan 15, 2025",
          endDate: "Feb 15, 2025",
          hours: 60,
          status: "Completed"
        }
      ]
    },
    {
      number: 2,
      name: "Implementation",
      tasks: [
        {
          id: "T2-1",
          name: "Coordinate Field Data Collection",
          assignedTo: "Implementation Team",
          startDate: "Feb 20, 2025",
          endDate: "Apr 30, 2025",
          hours: 180,
          status: "In Progress"
        },
        {
          id: "T2-2",
          name: "Conduct Stakeholder Engagement",
          assignedTo: "QA Team",
          startDate: "Mar 1, 2025",
          endDate: "May 15, 2025",
          hours: 100,
          status: "In Progress"
        }
      ]
    },
    {
      number: 3,
      name: "Quality Assurance",
      tasks: [
        {
          id: "T3-1",
          name: "Conduct Internal Peer Review",
          assignedTo: "QA Team",
          startDate: "May 1, 2025",
          endDate: "May 31, 2025",
          hours: 60,
          status: "Not Started"
        }
      ]
    },
    {
      number: 4,
      name: "Production & Editorial",
      tasks: [
        {
          id: "T4-1",
          name: "Design and Layout Report",
          assignedTo: "Editorial Team",
          startDate: "Jun 1, 2025",
          endDate: "Jun 30, 2025",
          hours: 90,
          status: "Not Started"
        }
      ]
    },
    {
      number: 5,
      name: "Reporting",
      tasks: [
        {
          id: "T5-1",
          name: "Submit Final Technical Report",
          assignedTo: "M&E Team",
          startDate: "Jul 1, 2025",
          endDate: "Jul 31, 2025",
          hours: 60,
          status: "Not Started"
        }
      ]
    },
    {
      number: 6,
      name: "Delivery Stage Complete",
      tasks: [
        {
          id: "T6-1",
          name: "Sign-off and Handover",
          assignedTo: "Project Manager",
          startDate: "Aug 1, 2025",
          endDate: "Aug 15, 2025",
          hours: 20,
          status: "Not Started"
        }
      ]
    }
  ];
};

const getGanttData = (projectId: string): GanttTask[] => {
  if (projectId === "1") {
    return [
      { name: "Procurement & Contracting", startMonth: 0, duration: 1, color: "bg-amber-500" },
      { name: "Implementation", startMonth: 1, duration: 3, color: "bg-blue-500" },
      { name: "Quality Assurance", startMonth: 3, duration: 1, color: "bg-emerald-500" },
      { name: "Production & Editorial", startMonth: 4, duration: 2, color: "bg-violet-500" },
      { name: "Dissemination", startMonth: 5, duration: 1, color: "bg-cyan-500" },
      { name: "Reporting", startMonth: 6, duration: 1, color: "bg-indigo-500" },
      { name: "Delivery Complete", startMonth: 7, duration: 1, color: "bg-rose-500" },
    ];
  }
  
  return [
    { name: "Procurement & Contracting", startMonth: 0, duration: 1, color: "bg-amber-500" },
    { name: "Implementation", startMonth: 1, duration: 2, color: "bg-blue-500" },
    { name: "Quality Assurance", startMonth: 3, duration: 1, color: "bg-emerald-500" },
    { name: "Production & Editorial", startMonth: 4, duration: 1, color: "bg-violet-500" },
    { name: "Reporting", startMonth: 5, duration: 1, color: "bg-indigo-500" },
    { name: "Delivery Complete", startMonth: 6, duration: 1, color: "bg-rose-500" },
  ];
};

// Helper to parse "Mon DD, YYYY" to a month position (0-based relative to contract start month)
const parseDateToMonthPosition = (dateStr: string, contractStartMonth: number): number => {
  const date = new Date(dateStr);
  const month = date.getMonth(); // 0-based (0=Jan)
  const day = date.getDate();
  const daysInMonth = new Date(date.getFullYear(), month + 1, 0).getDate();
  // Position relative to the start month of the Gantt (which is the contract start month)
  return (month - contractStartMonth) + (day - 1) / daysInMonth;
};

const getGanttMarkers = (config: ProjectConfig, contractStartMonth: number): GanttMarker[] => {
  const markers: GanttMarker[] = [];

  // Helper to convert a month offset back to a readable date label
  const monthOffsetToDateLabel = (monthPos: number, contractStartDate: string): string => {
    const start = new Date(contractStartDate);
    const targetDate = new Date(start.getFullYear(), start.getMonth() + Math.floor(monthPos), 1);
    return targetDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  // Contractual Deliverables
  config.deliverables.forEach((d) => {
    const pos = parseDateToMonthPosition(d.dueDate, contractStartMonth);
    if (pos >= 0 && pos <= 8) {
      markers.push({ label: d.title, monthPosition: pos, category: "deliverable", date: d.dueDate });
    }
  });

  // Contract Milestones
  config.milestones.forEach((m) => {
    const pos = parseDateToMonthPosition(m.targetDate, contractStartMonth);
    if (pos >= 0 && pos <= 8) {
      markers.push({ label: m.title, monthPosition: pos, category: "milestone", date: m.targetDate });
    }
  });

  // Reporting Requirements - place recurring markers across the timeline
  config.reportingRequirements.forEach((r) => {
    const months8 = 8;
    if (r.frequency === "Quarterly") {
      for (let m = 3; m < months8; m += 3) {
        markers.push({ label: `${r.reportType} (Q)`, monthPosition: m, category: "reporting", date: monthOffsetToDateLabel(m, config.contractStartDate) });
      }
    } else if (r.frequency === "Monthly") {
      for (let m = 1; m < months8; m += 1) {
        markers.push({ label: `${r.reportType}`, monthPosition: m, category: "reporting", date: monthOffsetToDateLabel(m, config.contractStartDate) });
      }
    } else if (r.frequency === "Semi-Annually") {
      for (let m = 6; m < months8; m += 6) {
        markers.push({ label: `${r.reportType} (Semi)`, monthPosition: m, category: "reporting", date: monthOffsetToDateLabel(m, config.contractStartDate) });
      }
    } else if (r.frequency === "Annually") {
      markers.push({ label: `${r.reportType} (Annual)`, monthPosition: 6, category: "reporting", date: monthOffsetToDateLabel(6, config.contractStartDate) });
    }
  });

  // Deduplicate reporting markers at same position
  const seen = new Set<string>();
  return markers.filter((m) => {
    const key = `${m.category}-${m.monthPosition.toFixed(2)}`;
    if (m.category === "reporting" && seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// Document data for each folder
const folderDocuments: Record<string, Array<{
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
}>> = {
  "Inception Docs": [
    { name: "Project Charter.pdf", type: "PDF", size: "2.4 MB", uploadedBy: "Yaw Osei", uploadDate: "Jan 10, 2025" },
    { name: "Stakeholder Analysis.docx", type: "DOCX", size: "1.2 MB", uploadedBy: "Ama Darko", uploadDate: "Jan 12, 2025" },
    { name: "Initial Risk Assessment.xlsx", type: "XLSX", size: "856 KB", uploadedBy: "Kofi Mensah", uploadDate: "Jan 15, 2025" },
    { name: "Project Brief.pdf", type: "PDF", size: "3.1 MB", uploadedBy: "Yaw Osei", uploadDate: "Jan 8, 2025" },
    { name: "Budget Proposal.xlsx", type: "XLSX", size: "1.8 MB", uploadedBy: "Nana Yaw", uploadDate: "Jan 18, 2025" },
    { name: "Work Plan Draft.docx", type: "DOCX", size: "2.2 MB", uploadedBy: "Kwaku Anane", uploadDate: "Jan 20, 2025" },
    { name: "Team Structure.pdf", type: "PDF", size: "945 KB", uploadedBy: "Ama Darko", uploadDate: "Jan 22, 2025" },
    { name: "Communication Plan.pdf", type: "PDF", size: "1.5 MB", uploadedBy: "Yaw Osei", uploadDate: "Jan 25, 2025" },
    { name: "Inception Workshop Slides.pptx", type: "PPTX", size: "8.3 MB", uploadedBy: "Kofi Mensah", uploadDate: "Jan 28, 2025" },
    { name: "Theory of Change.pdf", type: "PDF", size: "2.7 MB", uploadedBy: "Ama Darko", uploadDate: "Jan 30, 2025" },
    { name: "Partnership Agreements.pdf", type: "PDF", size: "4.2 MB", uploadedBy: "Yaw Osei", uploadDate: "Feb 1, 2025" },
    { name: "Baseline Study TOR.docx", type: "DOCX", size: "1.1 MB", uploadedBy: "Kwaku Anane", uploadDate: "Feb 3, 2025" }
  ],
  "Contracts": [
    { name: "CTR-2025-001 DataTech Contract.pdf", type: "PDF", size: "3.5 MB", uploadedBy: "Nana Yaw", uploadDate: "Jan 14, 2025" },
    { name: "CTR-2025-002 Research Associates.pdf", type: "PDF", size: "4.1 MB", uploadedBy: "Yaw Osei", uploadDate: "Feb 28, 2025" },
    { name: "CTR-2025-003 Equipment Supplies.pdf", type: "PDF", size: "2.8 MB", uploadedBy: "Kofi Mensah", uploadDate: "Feb 9, 2025" },
    { name: "Vendor Agreement Template.docx", type: "DOCX", size: "756 KB", uploadedBy: "Ama Darko", uploadDate: "Jan 5, 2025" },
    { name: "Consultant Contract - KPMG.pdf", type: "PDF", size: "5.2 MB", uploadedBy: "Yaw Osei", uploadDate: "Mar 10, 2025" },
    { name: "Service Level Agreement.pdf", type: "PDF", size: "1.9 MB", uploadedBy: "Nana Yaw", uploadDate: "Jan 20, 2025" },
    { name: "NDA - All Vendors.pdf", type: "PDF", size: "1.2 MB", uploadedBy: "Ama Darko", uploadDate: "Jan 8, 2025" },
    { name: "Amendment CTR-2025-001.pdf", type: "PDF", size: "892 KB", uploadedBy: "Kofi Mensah", uploadDate: "Apr 15, 2025" }
  ],
  "Reports": [
    { name: "Monthly Progress Report - January.pdf", type: "PDF", size: "3.2 MB", uploadedBy: "Yaw Osei", uploadDate: "Feb 5, 2025" },
    { name: "Monthly Progress Report - February.pdf", type: "PDF", size: "3.4 MB", uploadedBy: "Yaw Osei", uploadDate: "Mar 5, 2025" },
    { name: "Monthly Progress Report - March.pdf", type: "PDF", size: "3.6 MB", uploadedBy: "Yaw Osei", uploadDate: "Apr 5, 2025" },
    { name: "Quarterly Report Q1 2025.pdf", type: "PDF", size: "8.7 MB", uploadedBy: "Ama Darko", uploadDate: "Apr 10, 2025" },
    { name: "Baseline Study Report.pdf", type: "PDF", size: "12.4 MB", uploadedBy: "Kwaku Anane", uploadDate: "Mar 20, 2025" },
    { name: "Field Data Collection Report.pdf", type: "PDF", size: "6.8 MB", uploadedBy: "Kofi Mensah", uploadDate: "May 1, 2025" },
    { name: "Risk Assessment Update.pdf", type: "PDF", size: "2.1 MB", uploadedBy: "Nana Yaw", uploadDate: "Mar 15, 2025" },
    { name: "Budget Utilization Report Q1.xlsx", type: "XLSX", size: "1.5 MB", uploadedBy: "Yaw Osei", uploadDate: "Apr 8, 2025" },
    { name: "Stakeholder Feedback Summary.pdf", type: "PDF", size: "2.9 MB", uploadedBy: "Ama Darko", uploadDate: "Apr 20, 2025" },
    { name: "Data Quality Report.pdf", type: "PDF", size: "4.2 MB", uploadedBy: "Kwaku Anane", uploadDate: "May 10, 2025" },
    { name: "Training Workshop Report.pdf", type: "PDF", size: "5.5 MB", uploadedBy: "Kofi Mensah", uploadDate: "Mar 25, 2025" },
    { name: "MEL Framework Report.pdf", type: "PDF", size: "7.3 MB", uploadedBy: "Ama Darko", uploadDate: "Feb 28, 2025" },
    { name: "Inception Phase Report.pdf", type: "PDF", size: "9.1 MB", uploadedBy: "Yaw Osei", uploadDate: "Feb 15, 2025" },
    { name: "Partner Collaboration Report.pdf", type: "PDF", size: "3.8 MB", uploadedBy: "Nana Yaw", uploadDate: "Apr 5, 2025" },
    { name: "Technical Review Report.pdf", type: "PDF", size: "4.6 MB", uploadedBy: "Kofi Mensah", uploadDate: "Mar 30, 2025" },
    { name: "Site Visit Report - Northern Region.pdf", type: "PDF", size: "5.2 MB", uploadedBy: "Kwaku Anane", uploadDate: "Apr 12, 2025" },
    { name: "Site Visit Report - Eastern Region.pdf", type: "PDF", size: "4.9 MB", uploadedBy: "Kwaku Anane", uploadDate: "Apr 18, 2025" },
    { name: "Procurement Status Report.xlsx", type: "XLSX", size: "987 KB", uploadedBy: "Nana Yaw", uploadDate: "May 5, 2025" },
    { name: "Staff Performance Review Q1.pdf", type: "PDF", size: "3.1 MB", uploadedBy: "Yaw Osei", uploadDate: "Apr 25, 2025" },
    { name: "Communication Activities Report.pdf", type: "PDF", size: "6.4 MB", uploadedBy: "Ama Darko", uploadDate: "Apr 30, 2025" },
    { name: "Lessons Learned - Phase 1.pdf", type: "PDF", size: "2.7 MB", uploadedBy: "Kofi Mensah", uploadDate: "Mar 1, 2025" },
    { name: "Gender Analysis Report.pdf", type: "PDF", size: "5.8 MB", uploadedBy: "Ama Darko", uploadDate: "Mar 10, 2025" },
    { name: "Environmental Compliance Report.pdf", type: "PDF", size: "4.3 MB", uploadedBy: "Nana Yaw", uploadDate: "Feb 20, 2025" },
    { name: "Mid-term Review Prep Document.pdf", type: "PDF", size: "7.2 MB", uploadedBy: "Yaw Osei", uploadDate: "May 8, 2025" }
  ],
  "Closure Docs": [
    { name: "Project Completion Checklist.pdf", type: "PDF", size: "1.1 MB", uploadedBy: "Yaw Osei", uploadDate: "Not uploaded yet" },
    { name: "Final Evaluation Framework.docx", type: "DOCX", size: "2.3 MB", uploadedBy: "Ama Darko", uploadDate: "Not uploaded yet" },
    { name: "Asset Transfer Template.xlsx", type: "XLSX", size: "645 KB", uploadedBy: "Nana Yaw", uploadDate: "Not uploaded yet" }
  ]
};

// ── Mock PMO Project Configuration Data (from Add New Project form) ──
interface ProjectConfig {
  donor: string;
  contractStartDate: string;
  contractEndDate: string;
  totalBudget: string;
  linkedProposal: LinkedProposal | null;
  linkedContract: LinkedContract | null;
  deliverables: SetupDeliverable[];
  reportingRequirements: SetupReportingRequirement[];
  milestones: SetupMilestone[];
  supportingDocuments: SupportingDocument[];
  donorCards: DonorSetupCard[];
}

const getProjectConfig = (projectId: string): ProjectConfig => {
  const configs: Record<string, ProjectConfig> = {
    "1": {
      donor: "World Bank",
      contractStartDate: "Jan 15, 2025",
      contractEndDate: "Aug 30, 2025",
      totalBudget: "$450,000",
      linkedProposal: { id: "PROP-2025-088", title: "Youth Employment Skills Training", donor: "World Bank", date: "Aug 15, 2025", budget: "$420,000" },
      linkedContract: { id: "CTR-2025-038", title: "World Bank – Youth Employment Contract", donor: "World Bank", signedDate: "Nov 10, 2025", value: "$420,000" },
      deliverables: [
        { id: "d1", title: "Baseline Study Report", description: "Comprehensive baseline assessment of regional integration status", dueDate: "Mar 15, 2025", isPrimary: true },
        { id: "d2", title: "Stakeholder Consultation Summary", description: "Summary report of all stakeholder consultations conducted", dueDate: "Apr 30, 2025", isPrimary: false },
        { id: "d3", title: "Final Policy Recommendations", description: "Detailed policy recommendations based on research findings", dueDate: "Aug 15, 2025", isPrimary: true },
      ],
      reportingRequirements: [
        { id: "r1", reportType: "Narrative Report", frequency: "Quarterly", dueOffset: "15 days after quarter end", recipient: "World Bank Country Office" },
        { id: "r2", reportType: "Financial Report", frequency: "Quarterly", dueOffset: "30 days after quarter end", recipient: "World Bank Finance Division" },
        { id: "r3", reportType: "Audit Report", frequency: "Annually", dueOffset: "60 days after fiscal year end", recipient: "World Bank Audit Team" },
      ],
      milestones: [
        { id: "m1", title: "Inception Phase Complete", targetDate: "Feb 28, 2025", payment: "$90,000", description: "Completion of inception phase including stakeholder mapping" },
        { id: "m2", title: "Mid-term Review", targetDate: "May 15, 2025", payment: "$135,000", description: "Successful mid-term review with satisfactory progress" },
        { id: "m3", title: "Final Delivery & Close-out", targetDate: "Aug 30, 2025", payment: "$225,000", description: "Submission and acceptance of all final deliverables" },
      ],
      supportingDocuments: [
        { id: "uf1", name: "Signed-Contract-WB-v1.pdf", size: "3.2 MB", version: 1, uploadedAt: "Jan 10, 2025", uploadedBy: "PMO Admin" },
        { id: "uf2", name: "Budget-Breakdown-Final.xlsx", size: "1.8 MB", version: 2, uploadedAt: "Jan 12, 2025", uploadedBy: "PMO Admin" },
      ],
      donorCards: [
        {
          id: "dc1",
          donor: "World Bank",
          contractStartDate: "Jan 15, 2025",
          contractEndDate: "Aug 30, 2025",
          totalBudget: "$450,000",
          linkedProposal: { id: "PROP-2025-088", title: "Youth Employment Skills Training", donor: "World Bank", date: "Aug 15, 2025", budget: "$420,000" },
          linkedContract: { id: "CTR-2025-038", title: "World Bank – Youth Employment Contract", donor: "World Bank", signedDate: "Nov 10, 2025", value: "$420,000" },
          deliverables: [
            { id: "d1", title: "Baseline Study Report", description: "Comprehensive baseline assessment of regional integration status", dueDate: "Mar 15, 2025", isPrimary: true },
            { id: "d2", title: "Stakeholder Consultation Summary", description: "Summary report of all stakeholder consultations conducted", dueDate: "Apr 30, 2025", isPrimary: false },
            { id: "d3", title: "Final Policy Recommendations", description: "Detailed policy recommendations based on research findings", dueDate: "Aug 15, 2025", isPrimary: true },
          ],
          reportingRequirements: [
            { id: "r1", reportType: "Narrative Report", frequency: "Quarterly", dueOffset: "15 days after quarter end", recipient: "World Bank Country Office" },
            { id: "r2", reportType: "Financial Report", frequency: "Quarterly", dueOffset: "30 days after quarter end", recipient: "World Bank Finance Division" },
            { id: "r3", reportType: "Audit Report", frequency: "Annually", dueOffset: "60 days after fiscal year end", recipient: "World Bank Audit Team" },
          ],
          milestones: [
            { id: "m1", title: "Inception Phase Complete", targetDate: "Feb 28, 2025", payment: "$90,000", description: "Completion of inception phase including stakeholder mapping" },
            { id: "m2", title: "Mid-term Review", targetDate: "May 15, 2025", payment: "$135,000", description: "Successful mid-term review with satisfactory progress" },
            { id: "m3", title: "Final Delivery & Close-out", targetDate: "Aug 30, 2025", payment: "$225,000", description: "Submission and acceptance of all final deliverables" },
          ],
          supportingDocuments: [
            { id: "uf1", name: "Signed-Contract-WB-v1.pdf", size: "3.2 MB", version: 1, uploadedAt: "Jan 10, 2025", uploadedBy: "PMO Admin" },
            { id: "uf2", name: "Budget-Breakdown-Final.xlsx", size: "1.8 MB", version: 2, uploadedAt: "Jan 12, 2025", uploadedBy: "PMO Admin" },
          ],
        },
        {
          id: "dc2",
          donor: "AfDB",
          contractStartDate: "Feb 01, 2025",
          contractEndDate: "Sep 15, 2025",
          totalBudget: "$175,000",
          linkedProposal: { id: "PROP-2025-102", title: "Youth Employment Skills Training - Digital Labs Addendum", donor: "AfDB", date: "Sep 02, 2025", budget: "$175,000" },
          linkedContract: { id: "CTR-2025-051", title: "AfDB – Digital Labs Co-Funding Addendum", donor: "AfDB", signedDate: "Dec 03, 2025", value: "$175,000" },
          deliverables: [
            { id: "d4", title: "Digital Lab Equipment Deployment", description: "Deployment of learning lab equipment across all pilot hubs", dueDate: "Jun 20, 2025", isPrimary: true },
            { id: "d5", title: "Trainer Certification Pack", description: "Certification package for facilitators assigned to the digital labs", dueDate: "Jul 12, 2025", isPrimary: false },
          ],
          reportingRequirements: [
            { id: "r4", reportType: "Progress Report", frequency: "Monthly", dueOffset: "7 days after month end", recipient: "AfDB Portfolio Officer" },
            { id: "r5", reportType: "Financial Report", frequency: "Quarterly", dueOffset: "21 days after quarter end", recipient: "AfDB Finance Desk" },
          ],
          milestones: [
            { id: "m4", title: "Co-Funding Activation", targetDate: "Mar 10, 2025", payment: "$50,000", description: "Execution of addendum and activation of co-funding stream" },
            { id: "m5", title: "Lab Commissioning", targetDate: "Jul 31, 2025", payment: "$125,000", description: "All pilot labs commissioned and accepted by donor team" },
          ],
          supportingDocuments: [
            { id: "uf3", name: "AfDB-CoFunding-Addendum.pdf", size: "2.1 MB", version: 1, uploadedAt: "Jan 18, 2025", uploadedBy: "PMO Admin" },
            { id: "uf4", name: "Digital-Lab-Budget.xlsx", size: "986 KB", version: 3, uploadedAt: "Jan 25, 2025", uploadedBy: "Finance PMO" },
          ],
        },
      ],
    },
    "2": {
      donor: "UNESCO",
      contractStartDate: "Mar 1, 2024",
      contractEndDate: "Nov 15, 2024",
      totalBudget: "$320,000",
      linkedProposal: { id: "PROP-2025-098", title: "Girls Education Empowerment Program", donor: "UNESCO", date: "Nov 20, 2025", budget: "$180,000" },
      linkedContract: { id: "CTR-2025-042", title: "UNESCO – Girls Education Program Agreement", donor: "UNESCO", signedDate: "Dec 22, 2025", value: "$180,000" },
      deliverables: [
        { id: "d1", title: "Digital Economy Landscape Analysis", description: "Analysis of digital economy status across 5 target countries", dueDate: "May 30, 2024", isPrimary: true },
        { id: "d2", title: "Policy Brief Series (5 papers)", description: "Policy briefs for each target country", dueDate: "Sep 30, 2024", isPrimary: true },
      ],
      reportingRequirements: [
        { id: "r1", reportType: "Progress Report", frequency: "Monthly", dueOffset: "10 days after month end", recipient: "UNESCO Programme Specialist" },
        { id: "r2", reportType: "Financial Report", frequency: "Quarterly", dueOffset: "30 days after quarter end", recipient: "UNESCO Finance Office" },
      ],
      milestones: [
        { id: "m1", title: "Research Phase Complete", targetDate: "Jun 30, 2024", payment: "$128,000", description: "Completion of all country-level research activities" },
        { id: "m2", title: "Final Publication & Dissemination", targetDate: "Nov 15, 2024", payment: "$192,000", description: "Publication and dissemination of all policy briefs" },
      ],
      supportingDocuments: [
        { id: "uf1", name: "UNESCO-Agreement-Signed.pdf", size: "2.9 MB", version: 1, uploadedAt: "Feb 20, 2024", uploadedBy: "PMO Admin" },
      ],
      donorCards: [
        {
          id: "dc1",
          donor: "UNESCO",
          contractStartDate: "Mar 1, 2024",
          contractEndDate: "Nov 15, 2024",
          totalBudget: "$320,000",
          linkedProposal: { id: "PROP-2025-098", title: "Girls Education Empowerment Program", donor: "UNESCO", date: "Nov 20, 2025", budget: "$180,000" },
          linkedContract: { id: "CTR-2025-042", title: "UNESCO – Girls Education Program Agreement", donor: "UNESCO", signedDate: "Dec 22, 2025", value: "$180,000" },
          deliverables: [
            { id: "d1", title: "Digital Economy Landscape Analysis", description: "Analysis of digital economy status across 5 target countries", dueDate: "May 30, 2024", isPrimary: true },
            { id: "d2", title: "Policy Brief Series (5 papers)", description: "Policy briefs for each target country", dueDate: "Sep 30, 2024", isPrimary: true },
          ],
          reportingRequirements: [
            { id: "r1", reportType: "Progress Report", frequency: "Monthly", dueOffset: "10 days after month end", recipient: "UNESCO Programme Specialist" },
            { id: "r2", reportType: "Financial Report", frequency: "Quarterly", dueOffset: "30 days after quarter end", recipient: "UNESCO Finance Office" },
          ],
          milestones: [
            { id: "m1", title: "Research Phase Complete", targetDate: "Jun 30, 2024", payment: "$128,000", description: "Completion of all country-level research activities" },
            { id: "m2", title: "Final Publication & Dissemination", targetDate: "Nov 15, 2024", payment: "$192,000", description: "Publication and dissemination of all policy briefs" },
          ],
          supportingDocuments: [
            { id: "uf1", name: "UNESCO-Agreement-Signed.pdf", size: "2.9 MB", version: 1, uploadedAt: "Feb 20, 2024", uploadedBy: "PMO Admin" },
          ],
        },
      ],
    },
  };

  // Default config for projects without specific data
  return configs[projectId] || {
    donor: "USAID",
    contractStartDate: "Jun 1, 2025",
    contractEndDate: "Dec 31, 2026",
    totalBudget: "$500,000",
    linkedProposal: { id: "PROP-2025-075", title: "Rural Education Access Enhancement", donor: "USAID", date: "Apr 25, 2025", budget: "$220,000" },
    linkedContract: { id: "CTR-2025-028", title: "USAID – Rural Education Contract", donor: "USAID", signedDate: "Jul 05, 2025", value: "$220,000" },
    deliverables: [
      { id: "d1", title: "Project Inception Report", description: "Detailed inception report with work plan and methodology", dueDate: "Jul 15, 2025", isPrimary: true },
      { id: "d2", title: "Mid-term Progress Report", description: "Comprehensive progress report at project midpoint", dueDate: "Mar 31, 2026", isPrimary: false },
      { id: "d3", title: "Final Completion Report", description: "Final report documenting all achievements and lessons learned", dueDate: "Dec 15, 2026", isPrimary: true },
    ],
    reportingRequirements: [
      { id: "r1", reportType: "Narrative Report", frequency: "Quarterly", dueOffset: "15 days after quarter end", recipient: "USAID Mission Office" },
      { id: "r2", reportType: "Financial Report", frequency: "Quarterly", dueOffset: "30 days after quarter end", recipient: "USAID Finance Team" },
      { id: "r3", reportType: "M&E Report", frequency: "Semi-Annually", dueOffset: "30 days after period end", recipient: "USAID M&E Specialist" },
    ],
    milestones: [
      { id: "m1", title: "Inception Complete", targetDate: "Jul 31, 2025", payment: "$100,000", description: "Approved inception report and work plan" },
      { id: "m2", title: "Mid-term Milestone", targetDate: "Jun 30, 2026", payment: "$200,000", description: "Satisfactory mid-term progress review" },
      { id: "m3", title: "Project Completion", targetDate: "Dec 31, 2026", payment: "$200,000", description: "Final deliverables accepted and project closed" },
    ],
    supportingDocuments: [
      { id: "uf1", name: "Contract-Draft-v1.pdf", size: "2.4 MB", version: 1, uploadedAt: "May 20, 2025", uploadedBy: "PMO Admin" },
    ],
    donorCards: [
      {
        id: "dc1",
        donor: "USAID",
        contractStartDate: "Jun 1, 2025",
        contractEndDate: "Dec 31, 2026",
        totalBudget: "$500,000",
        linkedProposal: { id: "PROP-2025-075", title: "Rural Education Access Enhancement", donor: "USAID", date: "Apr 25, 2025", budget: "$220,000" },
        linkedContract: { id: "CTR-2025-028", title: "USAID – Rural Education Contract", donor: "USAID", signedDate: "Jul 05, 2025", value: "$220,000" },
        deliverables: [
          { id: "d1", title: "Project Inception Report", description: "Detailed inception report with work plan and methodology", dueDate: "Jul 15, 2025", isPrimary: true },
          { id: "d2", title: "Mid-term Progress Report", description: "Comprehensive progress report at project midpoint", dueDate: "Mar 31, 2026", isPrimary: false },
          { id: "d3", title: "Final Completion Report", description: "Final report documenting all achievements and lessons learned", dueDate: "Dec 15, 2026", isPrimary: true },
        ],
        reportingRequirements: [
          { id: "r1", reportType: "Narrative Report", frequency: "Quarterly", dueOffset: "15 days after quarter end", recipient: "USAID Mission Office" },
          { id: "r2", reportType: "Financial Report", frequency: "Quarterly", dueOffset: "30 days after quarter end", recipient: "USAID Finance Team" },
          { id: "r3", reportType: "M&E Report", frequency: "Semi-Annually", dueOffset: "30 days after period end", recipient: "USAID M&E Specialist" },
        ],
        milestones: [
          { id: "m1", title: "Inception Complete", targetDate: "Jul 31, 2025", payment: "$100,000", description: "Approved inception report and work plan" },
          { id: "m2", title: "Mid-term Milestone", targetDate: "Jun 30, 2026", payment: "$200,000", description: "Satisfactory mid-term progress review" },
          { id: "m3", title: "Project Completion", targetDate: "Dec 31, 2026", payment: "$200,000", description: "Final deliverables accepted and project closed" },
        ],
        supportingDocuments: [
          { id: "uf1", name: "Contract-Draft-v1.pdf", size: "2.4 MB", version: 1, uploadedAt: "May 20, 2025", uploadedBy: "PMO Admin" },
        ],
      },
    ],
  };
};

export function ProjectDetailsView({ project, onBack, onNavigateToWBS, onNavigateToProcurementPlan, onNavigateToBudget, onNavigateToRiskManagement, onNavigateToCommsPlan }: ProjectDetailsViewProps) {
  const rawPhases = getProjectPhases(project.id);
  const ganttData = getGanttData(project.id);
  const projectConfig = getProjectConfig(project.id);
  const donorSetupCards = projectConfig.donorCards?.length
    ? projectConfig.donorCards
    : [{
        id: "fallback",
        donor: projectConfig.donor,
        contractStartDate: projectConfig.contractStartDate,
        contractEndDate: projectConfig.contractEndDate,
        totalBudget: projectConfig.totalBudget,
        linkedProposal: projectConfig.linkedProposal,
        linkedContract: projectConfig.linkedContract,
        deliverables: projectConfig.deliverables,
        reportingRequirements: projectConfig.reportingRequirements,
        milestones: projectConfig.milestones,
        supportingDocuments: projectConfig.supportingDocuments,
      }];
  const contractStartMonth = new Date(projectConfig.contractStartDate).getMonth();
  const ganttMarkers = getGanttMarkers(projectConfig, contractStartMonth);
  
  const projectStage = project.stage || "Inception & Planning";
  const isClosure = projectStage === "Closure";

  // In Closure stage, override all task statuses to "Completed"
  const phases = isClosure
    ? rawPhases.map(phase => ({
        ...phase,
        tasks: phase.tasks.map(task => ({ ...task, status: "Completed" as const }))
      }))
    : rawPhases;
  const [activeTab, setActiveTab] = useState("setup");
  const [showConceptForm, setShowConceptForm] = useState(false);
  const [showPhasesForm, setShowPhasesForm] = useState(false);
  const [projectStatus, setProjectStatus] = useState("Draft");
  const [showRiskBuilder, setShowRiskBuilder] = useState(false);
  const [showCommsBuilder, setShowCommsBuilder] = useState(false);
  const [showDocumentInput, setShowDocumentInput] = useState<{ show: boolean; docId: string; title: string }>({ show: false, docId: "", title: "" });
  const [showResourcePlan, setShowResourcePlan] = useState(false);
  const [showStaffAllocation, setShowStaffAllocation] = useState(false);
  const [showTravelPlan, setShowTravelPlan] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [showWBSChangeRequest, setShowWBSChangeRequest] = useState(false);
  const [showBudgetChangeRequest, setShowBudgetChangeRequest] = useState(false);
  const [submittedCRs, setSubmittedCRs] = useState<ChangeRequest[]>([]);

  const handleCRSubmit = (cr: ChangeRequest) => {
    setSubmittedCRs(prev => [...prev, cr]);
    setShowWBSChangeRequest(false);
    setShowBudgetChangeRequest(false);
  };
  
  // Set initial tab based on stage - switch to first unlocked tab if current is locked
  useEffect(() => {
    const visibleTabs = getVisibleTabs(projectStage);
    const currentTabState = getTabState(activeTab, projectStage);
    
    // If current tab is locked, switch to first unlocked tab
    if (currentTabState === "locked") {
      const firstUnlockedTab = visibleTabs.find(t => getTabState(t.id, projectStage) === "active");
      if (firstUnlockedTab) {
        setActiveTab(firstUnlockedTab.id);
      }
    }
  }, [projectStage]);
  
  // (Procurement tab state managed by ProjectProcurementTab component)
  
  // Document folder navigation
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // Dynamic Visibility Matrix - Now shows all tabs, but some are locked
  const getVisibleTabs = (stage: string) => {
    const allTabs = [
      { id: "setup", label: "Project Setup" },
      { id: "overview", label: "Overview" },
      { id: "wbs", label: "Plan / WBS" },
      { id: "budget", label: "Budget" },
      { id: "procurement", label: "Procurement" },
      { id: "risk", label: "Risk Mgmt" },
      { id: "comms", label: "Comms Plan" },
      { id: "mel", label: "MEL" },
      { id: "documents", label: "Documents" }
    ];

    // Always return all tabs - they will be locked based on stage
    return allTabs;
  };

  const getTabState = (tabId: string, stage: string) => {
    // Returns: "active" | "locked"
    switch (stage) {
      case "Inception & Planning":
        if (tabId === "setup" || tabId === "overview") return "active";
        return "locked"; // All other tabs are locked
      
      case "Delivery":
        return "active"; // All tabs accessible
      
      case "Closure":
        return "active"; // All tabs accessible in read-only closure view
      
      default:
        return "active";
    }
  };

  const getPrimaryAction = (stage: string) => {
    switch (stage) {
      case "Inception & Planning": return "Submit Project Plan";
      case "Delivery": return "Create Requisition";
      case "Closure": return "Submit Closure Report";
      default: return "Submit";
    }
  };

  const handlePrimaryActionClick = () => {
    if (projectStage === "Inception & Planning") {
      setShowPhasesForm(true);
    }
    // Add handlers for other stages as needed
  };

  const handleSubmitForApproval = () => {
    setProjectStatus("Pending Approval");
    setShowConceptForm(false);
  };

  const tabs = getVisibleTabs(projectStage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "In Progress":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      case "Not Started":
        return "bg-slate-100 text-slate-700 hover:bg-slate-100";
      case "On Hold":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-emerald-100 text-emerald-700";
      case "Medium": return "bg-amber-100 text-amber-700";
      case "High": return "bg-orange-100 text-orange-700";
      case "Critical": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-blue-100 text-blue-700";
      case "In Progress": return "bg-emerald-100 text-emerald-700";
      case "Planning": return "bg-purple-100 text-purple-700";
      case "On Hold": return "bg-amber-100 text-amber-700";
      case "Delayed": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Project stages stepper
  const stages = ["Inception & Planning", "Delivery", "Closure"];
  const currentStageIndex = stages.indexOf(projectStage);

  // If showing concept form, render it instead of the main view
  if (showConceptForm) {
    return (
      <ProjectConceptForm 
        project={{ ...project, status: projectStatus }} 
        onBack={() => { setShowConceptForm(false); setActiveTab("overview"); }} 
        onSubmitForApproval={handleSubmitForApproval}
      />
    );
  }

  // If showing phases form, render it instead of the main view
  if (showPhasesForm) {
    return (
      <ProjectPhasesForm
        project={project}
        onBack={() => { setShowPhasesForm(false); setActiveTab("overview"); }}
        onSubmit={(phases) => {
          console.log("Project phases submitted:", phases);
          // Add logic to save phases
        }}
      />
    );
  }

  // If showing risk builder, render it instead of the main view
  if (showRiskBuilder) {
    return (
      <RiskManagementPlanBuilder
        onBack={() => { setShowRiskBuilder(false); setActiveTab("overview"); }}
        hideStatus={projectStage === "Inception & Planning"}
      />
    );
  }

  // If showing comms builder, render it instead of the main view
  if (showCommsBuilder) {
    return (
      <CommsPlanBuilder
        onBack={() => { setShowCommsBuilder(false); setActiveTab("overview"); }}
        hideStatus={projectStage === "Inception & Planning"}
      />
    );
  }

  // If showing document input, render it instead of the main view
  if (showDocumentInput.show) {
    return (
      <DocumentDetailsInput
        onBack={() => { setShowDocumentInput({ show: false, docId: "", title: "" }); setActiveTab("overview"); }}
        documentTitle={showDocumentInput.title}
        projectName={project.name}
        phases={phases}
        deliverables={projectConfig.deliverables}
      />
    );
  }

  // If showing resource plan, render it as full page (no stepper, no project info cards)
  if (showResourcePlan) {
    return (
      <ResourcePlanView onBack={() => { setShowResourcePlan(false); setActiveTab("overview"); }} />
    );
  }

  // If showing staff allocation, render it as full page
  if (showStaffAllocation) {
    return (
      <StaffAllocationView onBack={() => { setShowStaffAllocation(false); setActiveTab("overview"); }} hideStatus={projectStage === "Inception & Planning"} />
    );
  }

  // If showing travel plan, render it as full page (no stepper, no project info cards)
  if (showTravelPlan) {
    return (
      <TravelPlanBuilder
        onBack={() => { setShowTravelPlan(false); setActiveTab("overview"); }}
        hideStatus={projectStage === "Inception & Planning"}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Click-outside overlay to close action menus */}
      {openActionMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenActionMenu(null)} />
      )}
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-2xl font-semibold text-slate-900">{project.name}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Project Stage Stepper */}
        <div className="bg-white border border-slate-200 rounded-lg p-8 mb-6">
          <div className="flex items-center justify-between relative">
            {stages.map((stage, index) => (
              <div key={stage} className="flex flex-col items-center flex-1 relative">
                {/* Connector Line */}
                {index < stages.length - 1 && (
                  <div 
                    className={cn(
                      "absolute top-6 left-1/2 w-full h-0.5",
                      index < currentStageIndex ? "bg-blue-600" : "bg-slate-200"
                    )}
                    style={{ transform: "translateY(-50%)" }}
                  />
                )}
                
                {/* Stage Circle */}
                <div className="relative z-10 mb-3">
                  <div 
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-colors",
                      index < currentStageIndex 
                        ? "bg-blue-600 text-white" 
                        : index === currentStageIndex
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : "bg-slate-200 text-slate-500"
                    )}
                  >
                    {index < currentStageIndex ? (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                </div>
                
                {/* Stage Label */}
                <p 
                  className={cn(
                    "text-sm font-medium text-center",
                    index <= currentStageIndex ? "text-slate-900" : "text-slate-500"
                  )}
                >
                  {stage}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Project Information Section */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Project Information</h2>
          
          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Project Manager</p>
              <p className="text-sm font-medium text-slate-900">{project.projectManager}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Start Date</p>
              <p className="text-sm font-medium text-slate-900">{project.startDate}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">End Date</p>
              <p className="text-sm font-medium text-slate-900">{project.endDate}</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Program</p>
              <p className={`text-sm font-medium ${project.program ? "text-slate-900" : "text-slate-400"}`}>{project.program || "–"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <Badge className={cn("text-xs font-medium shadow-none border-0", getProjectStatusColor(project.status))}>
                {project.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Risk Level</p>
              <Badge className={cn("text-xs font-medium shadow-none border-0", getRiskColor(project.riskLevel))}>
                {project.riskLevel}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
            {tabs.map((tab) => {
              const tabState = getTabState(tab.id, projectStage);
              const isLocked = tabState === "locked";
              const isDisabled = isLocked;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => !isDisabled && setActiveTab(tab.id)}
                  disabled={isDisabled}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[120px] flex items-center justify-center gap-1.5",
                    activeTab === tab.id && !isDisabled
                      ? "bg-purple-700 text-white shadow-sm"
                      : isDisabled
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {tab.label}
                  {isLocked && (
                    <Lock size={12} className="opacity-70" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "setup" && (
          <div className="space-y-6">
            {/* PMO Configuration Badge */}
            <div className="px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-purple-800 font-medium">PMO Configuration — Initial project setup from signed contract</span>
            </div>

            {/* Basic Project Info */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-[14px] font-semibold text-slate-900">Project Information</h2>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-3 gap-6 mb-5">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-1">Project Name</p>
                    <p className="text-sm text-slate-900 font-medium">{project.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-1">Program</p>
                    <p className="text-sm text-slate-900 font-medium">{project.program || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-1">Donor</p>
                    <p className="text-sm text-slate-900 font-medium">{projectConfig.donor}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-1">Contract Start Date</p>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-sm text-slate-900 font-medium">{projectConfig.contractStartDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-1">Contract End Date</p>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-sm text-slate-900 font-medium">{projectConfig.contractEndDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-1">Total Budget</p>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-sm text-slate-900 font-semibold">{projectConfig.totalBudget}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-900">Donor Setup Cards</h2>
                  <p className="text-[12px] text-slate-500 mt-1">Each donor keeps its own contract documents, budget, deliverables, reporting obligations, and milestone schedule.</p>
                </div>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 shadow-none">
                  {donorSetupCards.length} {donorSetupCards.length === 1 ? "Donor" : "Donors"}
                </Badge>
              </div>

              {donorSetupCards.map((donorCard, donorIndex) => (
                <div key={donorCard.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0B01D0] text-white text-[11px] font-semibold">
                            {donorIndex + 1}
                          </span>
                          <h3 className="text-[16px] font-semibold text-slate-900">{donorCard.donor}</h3>
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0 shadow-none">
                            Donor Requirement Set
                          </Badge>
                        </div>
                        <p className="text-[12px] text-slate-500">Configuration segmented for this donor&apos;s contractual commitments and reporting obligations.</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3 min-w-[420px]">
                        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-1">Budget</p>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[13px] font-semibold text-slate-900">{donorCard.totalBudget}</span>
                          </div>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-1">Contract Start</p>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[13px] font-medium text-slate-900">{donorCard.contractStartDate}</span>
                          </div>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-1">Contract End</p>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[13px] font-medium text-slate-900">{donorCard.contractEndDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/30">
                        <div className="flex items-center gap-2 mb-3">
                          <Link2 className="w-4 h-4 text-[#0B01D0]" />
                          <p className="text-[12px] font-semibold text-slate-900">Linked Won Proposal</p>
                        </div>
                        {donorCard.linkedProposal ? (
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{donorCard.linkedProposal.title}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{donorCard.linkedProposal.id} &middot; {donorCard.linkedProposal.donor}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">Won: {donorCard.linkedProposal.date} &middot; {donorCard.linkedProposal.budget}</p>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1" />
                          </div>
                        ) : (
                          <p className="text-sm text-slate-400">No linked proposal</p>
                        )}
                      </div>

                      <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/30">
                        <div className="flex items-center gap-2 mb-3">
                          <FileSignature className="w-4 h-4 text-[#0B01D0]" />
                          <p className="text-[12px] font-semibold text-slate-900">Linked Signed Contract</p>
                        </div>
                        {donorCard.linkedContract ? (
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                              <FileSignature className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{donorCard.linkedContract.title}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{donorCard.linkedContract.id} &middot; {donorCard.linkedContract.donor}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">Signed: {donorCard.linkedContract.signedDate} &middot; {donorCard.linkedContract.value}</p>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1" />
                          </div>
                        ) : (
                          <p className="text-sm text-slate-400">No linked contract</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ClipboardList className="w-4 h-4 text-[#0B01D0]" />
                            <h4 className="text-[13px] font-semibold text-slate-900">Contractual Deliverables</h4>
                          </div>
                          <span className="text-[11px] text-slate-500">{donorCard.deliverables.filter((item) => item.isPrimary).length} Primary</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-blue-600">
                                <th className="text-left px-4 py-2.5 text-[11px] text-white font-semibold">Deliverable</th>
                                <th className="text-left px-4 py-2.5 text-[11px] text-white font-semibold">Due</th>
                                <th className="text-center px-4 py-2.5 text-[11px] text-white font-semibold">Type</th>
                              </tr>
                            </thead>
                            <tbody>
                              {donorCard.deliverables.map((item, idx) => (
                                <tr key={item.id} className={idx % 2 === 0 ? "bg-white border-b border-slate-100" : "bg-slate-50/50 border-b border-slate-100"}>
                                  <td className="px-4 py-3">
                                    <p className="text-[12px] font-medium text-slate-900">{item.title}</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{item.description}</p>
                                  </td>
                                  <td className="px-4 py-3 text-[12px] text-slate-700">{item.dueDate}</td>
                                  <td className="px-4 py-3 text-center">
                                    {item.isPrimary ? (
                                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-[10px] shadow-none border-0">
                                        <Lock className="w-3 h-3 mr-1" />
                                        Primary
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-[10px] shadow-none border-0">
                                        Secondary
                                      </Badge>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#0B01D0]" />
                            <h4 className="text-[13px] font-semibold text-slate-900">Reporting Requirements</h4>
                          </div>
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 shadow-none text-[10px]">
                            {donorCard.reportingRequirements.length} Items
                          </Badge>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-blue-600">
                                <th className="text-left px-4 py-2.5 text-[11px] text-white font-semibold">Report Type</th>
                                <th className="text-left px-4 py-2.5 text-[11px] text-white font-semibold">Frequency</th>
                                <th className="text-left px-4 py-2.5 text-[11px] text-white font-semibold">Recipient</th>
                              </tr>
                            </thead>
                            <tbody>
                              {donorCard.reportingRequirements.map((item, idx) => (
                                <tr key={item.id} className={idx % 2 === 0 ? "bg-white border-b border-slate-100" : "bg-slate-50/50 border-b border-slate-100"}>
                                  <td className="px-4 py-3">
                                    <p className="text-[12px] font-medium text-slate-900">{item.reportType}</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">{item.dueOffset}</p>
                                  </td>
                                  <td className="px-4 py-3">
                                    <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 text-[10px] shadow-none border-0">{item.frequency}</Badge>
                                  </td>
                                  <td className="px-4 py-3 text-[12px] text-slate-700">{item.recipient}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-[1.2fr_0.8fr] gap-6">
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#0B01D0]" />
                            <h4 className="text-[13px] font-semibold text-slate-900">Contract Milestones</h4>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 shadow-none text-[10px]">
                            {donorCard.milestones.length} Milestones
                          </Badge>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-blue-600">
                                <th className="text-left px-4 py-2.5 text-[11px] text-white font-semibold">Milestone</th>
                                <th className="text-left px-4 py-2.5 text-[11px] text-white font-semibold">Target Date</th>
                                <th className="text-left px-4 py-2.5 text-[11px] text-white font-semibold">Payment</th>
                              </tr>
                            </thead>
                            <tbody>
                              {donorCard.milestones.map((item, idx) => (
                                <tr key={item.id} className={idx % 2 === 0 ? "bg-white border-b border-slate-100" : "bg-slate-50/50 border-b border-slate-100"}>
                                  <td className="px-4 py-3">
                                    <p className="text-[12px] font-medium text-slate-900">{item.title}</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{item.description}</p>
                                  </td>
                                  <td className="px-4 py-3 text-[12px] text-slate-700">{item.targetDate}</td>
                                  <td className="px-4 py-3 text-[12px] font-medium text-slate-900">{item.payment}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileSignature className="w-4 h-4 text-[#0B01D0]" />
                            <h4 className="text-[13px] font-semibold text-slate-900">Supporting Documents</h4>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 shadow-none text-[10px]">
                            {donorCard.supportingDocuments.length} Files
                          </Badge>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {donorCard.supportingDocuments.map((doc) => (
                            <div key={doc.id} className="px-4 py-3">
                              <div className="flex items-start gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4 text-slate-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[12px] font-medium text-slate-900 truncate">{doc.name}</p>
                                  <p className="text-[11px] text-slate-500 mt-0.5">{doc.size} &middot; v{doc.version}</p>
                                  <p className="text-[11px] text-slate-400 mt-0.5">{doc.uploadedAt} &middot; {doc.uploadedBy}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "overview" && (
          <>
            {projectStage === "Inception & Planning" ? (
              <InceptionDocumentCards 
                onNavigateToWBS={onNavigateToWBS} 
                onNavigateToProcurementPlan={onNavigateToProcurementPlan}
                onNavigateToBudget={onNavigateToBudget}
                onNavigateToRiskManagement={onNavigateToRiskManagement}
                onNavigateToCommsPlan={onNavigateToCommsPlan}
                onOpenDocumentInput={(docId: string, title: string) => setShowDocumentInput({ show: true, docId, title })}
                onNavigateToResourcePlan={() => setShowResourcePlan(true)}
                onNavigateToStaffAllocation={() => setShowStaffAllocation(true)}
                onNavigateToTravelPlan={() => setShowTravelPlan(true)}
                projectName={project.name}
              />
            ) : (
              <ProjectOverviewDashboard
                project={project}
                onNavigateToTab={(tabId) => setActiveTab(tabId)}
                onNavigateToResourcePlan={() => setShowResourcePlan(true)}
                onNavigateToTravelPlan={() => setShowTravelPlan(true)}
              />
            )}
          </>
        )}

        {activeTab === "wbs" && (
          <>
            {projectStage === "Delivery" && (
              <div className="mb-6">
                <ChangeRequestList context="wbs" onCreateNew={() => setShowWBSChangeRequest(true)} />
              </div>
            )}
            {showWBSChangeRequest && (
              <ChangeRequestForm context="wbs" onClose={() => setShowWBSChangeRequest(false)} onSubmit={handleCRSubmit} />
            )}
            {getTabState("wbs", projectStage) === "locked" && (
              <div className="mb-4 px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-slate-700 font-medium">This section is locked - Baseline has been set</span>
              </div>
            )}
            {/* Gantt Chart Section */}
            <div className={cn("bg-white border border-slate-200 rounded-lg p-6 mb-6", getTabState("wbs", projectStage) === "locked" && "opacity-60")}>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Project Timeline</h2>
              <div className="space-y-4">
                {/* Month Labels */}
                <div className="flex gap-2 pl-64">
                  {months.slice(0, 8).map((month, idx) => (
                    <div key={idx} className="flex-1 text-center text-xs text-slate-600">
                      {month}
                    </div>
                  ))}
                </div>
                
                {/* Gantt Bars */}
                <div className="space-y-3">
                  {ganttData.map((task, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-60 text-sm text-slate-700">{task.name}</div>
                      <div className="flex-1 relative h-8 bg-slate-100 rounded">
                        <div
                          className={cn("absolute h-full rounded flex items-center px-2 text-xs text-white", task.color)}
                          style={{
                            left: `${(task.startMonth / 8) * 100}%`,
                            width: `${(task.duration / 8) * 100}%`
                          }}
                        >
                          {task.duration} {task.duration === 1 ? "month" : "months"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Marker Rows */}
                {/* Reporting Requirements */}
                {ganttMarkers.filter(m => m.category === "reporting").length > 0 && (
                  <div className="flex items-center gap-4 pt-2 border-t border-slate-200 mt-2">
                    <div className="w-60 text-sm text-slate-700 flex items-center gap-2">
                      <div className="w-3 h-3 rotate-45 bg-amber-500 rounded-[1px]" />
                      <span>Reporting Requirements</span>
                    </div>
                    <div className="flex-1 relative h-8">
                      {ganttMarkers.filter(m => m.category === "reporting").map((marker, idx) => (
                        <div
                          key={`rpt-${idx}`}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group cursor-pointer z-10"
                          style={{ left: `${(marker.monthPosition / 8) * 100}%` }}
                        >
                          <div className="w-3.5 h-3.5 rotate-45 bg-amber-500 border-2 border-amber-600 shadow-sm" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                            <div>{marker.label}</div>
                            <div className="text-slate-400">{marker.date}</div>
                          </div>
                        </div>
                      ))}
                      {/* Connecting line */}
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-amber-300" />
                    </div>
                  </div>
                )}

                {/* Contract Milestones */}
                {ganttMarkers.filter(m => m.category === "milestone").length > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="w-60 text-sm text-slate-700 flex items-center gap-2">
                      <div className="w-3 h-3 rotate-45 bg-[#0B01D0] rounded-[1px]" />
                      <span>Contract Milestones</span>
                    </div>
                    <div className="flex-1 relative h-8">
                      {ganttMarkers.filter(m => m.category === "milestone").map((marker, idx) => (
                        <div
                          key={`ms-${idx}`}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group cursor-pointer z-10"
                          style={{ left: `${(marker.monthPosition / 8) * 100}%` }}
                        >
                          <div className="w-3.5 h-3.5 rotate-45 bg-[#0B01D0] border-2 border-indigo-800 shadow-sm" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                            <div>{marker.label}</div>
                            <div className="text-slate-400">{marker.date}</div>
                          </div>
                        </div>
                      ))}
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-indigo-300" />
                    </div>
                  </div>
                )}

                {/* Contractual Deliverables */}
                {ganttMarkers.filter(m => m.category === "deliverable").length > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="w-60 text-sm text-slate-700 flex items-center gap-2">
                      <div className="w-3 h-3 rotate-45 bg-emerald-500 rounded-[1px]" />
                      <span>Contractual Deliverables</span>
                    </div>
                    <div className="flex-1 relative h-8">
                      {ganttMarkers.filter(m => m.category === "deliverable").map((marker, idx) => (
                        <div
                          key={`dlv-${idx}`}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group cursor-pointer z-10"
                          style={{ left: `${(marker.monthPosition / 8) * 100}%` }}
                        >
                          <div className="w-3.5 h-3.5 rotate-45 bg-emerald-500 border-2 border-emerald-600 shadow-sm" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                            <div>{marker.label}</div>
                            <div className="text-slate-400">{marker.date}</div>
                          </div>
                        </div>
                      ))}
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-300" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contract Milestones Card */}
            <div className={cn("bg-white border border-slate-200 rounded-lg mb-6 overflow-hidden", getTabState("wbs", projectStage) === "locked" && "opacity-60")}>
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#0B01D0]" />
                  <h2 className="text-lg font-semibold text-slate-900">Contract Milestones</h2>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-medium">{projectConfig.milestones.length}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-[12px] font-semibold text-white">#</th>
                      <th className="px-6 py-3 text-left text-[12px] font-semibold text-white">Milestone</th>
                      <th className="px-6 py-3 text-left text-[12px] font-semibold text-white">Description</th>
                      <th className="px-6 py-3 text-left text-[12px] font-semibold text-white">Target Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectConfig.milestones.map((m, idx) => (
                      <tr key={m.id} className={`border-b border-slate-100 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-medium">{idx + 1}</span>
                        </td>
                        <td className="px-6 py-3 text-[12px] text-slate-900 font-medium">{m.title}</td>
                        <td className="px-6 py-3 text-[12px] text-slate-600 max-w-[300px]">
                          <span className="line-clamp-2">{m.description}</span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[12px] text-slate-700">{m.targetDate}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Phase Tables */}
            {phases.map((phase) => {
              const totalHours = phase.tasks.reduce((sum, task) => sum + task.hours, 0);
              
              return (
                <div key={phase.number} className={cn("bg-white border border-slate-200 rounded-lg mb-6 overflow-hidden", getTabState("wbs", projectStage) === "locked" && "opacity-60")}>
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Stage {phase.number}: {phase.name}
                    </h2>
                    <span className="text-sm text-slate-600">
                      Total Hours: <span className="font-semibold">{totalHours}</span>
                    </span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-blue-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Task ID</th>
                          <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Task Name</th>
                          <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Assigned To</th>
                          <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Start Date</th>
                          <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">End Date</th>
                          <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Hours</th>
                          <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {phase.tasks.map((task) => (
                          <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-4 py-4 text-[12px] text-slate-600">{task.id}</td>
                            <td className="px-4 py-4 text-[12px] font-medium text-slate-700">{task.name}</td>
                            <td className="px-4 py-4 text-[12px] text-slate-600">{task.assignedTo}</td>
                            <td className="px-4 py-4 text-[12px] text-slate-600">{task.startDate}</td>
                            <td className="px-4 py-4 text-[12px] text-slate-600">{task.endDate}</td>
                            <td className="px-4 py-4 text-[12px] text-slate-600">{task.hours}</td>
                            <td className="px-4 py-4">
                              <Badge className={cn("text-[12px] font-medium shadow-none border-0", getStatusColor(task.status))}>
                                {task.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {activeTab === "budget" && (
          <div className="space-y-6">
            {projectStage === "Delivery" && (
              <>
                <ChangeRequestList context="budget" onCreateNew={() => setShowBudgetChangeRequest(true)} />
                {showBudgetChangeRequest && (
                  <ChangeRequestForm context="budget" onClose={() => setShowBudgetChangeRequest(false)} onSubmit={handleCRSubmit} />
                )}
                <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-amber-800 font-medium">Approved budget is locked — tracking expenditure against baseline</span>
                </div>
              </>
            )}
            {isClosure && (
              <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-emerald-800 font-medium">Project Closed — All budget lines fully utilized and reconciled</span>
              </div>
            )}
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <p className="text-[12px] text-blue-600 font-medium">Total Budget</p>
                </div>
                <p className="text-2xl font-semibold text-blue-900">$150,000</p>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <p className="text-[12px] text-orange-600 font-medium">Actual Spent</p>
                </div>
                <p className="text-2xl font-semibold text-orange-900">{isClosure ? "$150,000" : "$67,350"}</p>
                <p className="text-[11px] text-orange-600 mt-1">{isClosure ? "100% of budget" : "44.9% of budget"}</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <p className="text-[12px] text-emerald-600 font-medium">Remaining</p>
                </div>
                <p className="text-2xl font-semibold text-emerald-900">{isClosure ? "$0" : "$82,650"}</p>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <p className="text-[12px] text-purple-600 font-medium">Committed (POs)</p>
                </div>
                <p className="text-2xl font-semibold text-purple-900">{isClosure ? "$0" : "$38,200"}</p>
                <p className="text-[11px] text-purple-600 mt-1">{isClosure ? "All POs settled" : "Issued, not yet paid"}</p>
              </div>
            </div>

            {/* Cost Category Summary */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Cost Summary by Category</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 divide-x divide-slate-100">
                {[
                  { label: "Consultant Fees", planned: 25000, actual: isClosure ? 25000 : 20600, icon: "\u{1F464}" },
                  { label: "Staff Costs", planned: 22000, actual: isClosure ? 22000 : 14400, icon: "\u{1F465}" },
                  { label: "Travel Costs", planned: 9500, actual: isClosure ? 9500 : 7400, icon: "\u2708\uFE0F" },
                  { label: "Equipment & IT", planned: 59000, actual: isClosure ? 59000 : 49450, icon: "\u{1F4BB}" },
                  { label: "Comms & Outreach", planned: 7700, actual: isClosure ? 7700 : 4150, icon: "\u{1F4E2}" },
                  { label: "Workshops & Events", planned: 26800, actual: isClosure ? 26800 : 17300, icon: "\u{1F3DB}\uFE0F" },
                ].map((cat) => {
                  const pct = cat.planned > 0 ? Math.round((cat.actual / cat.planned) * 100) : 0;
                  const barColor = pct >= 100 ? "bg-blue-500" : pct >= 80 ? "bg-amber-500" : pct >= 50 ? "bg-emerald-500" : pct > 0 ? "bg-emerald-400" : "bg-slate-300";
                  return (
                    <div key={cat.label} className="px-5 py-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">{cat.icon}</span>
                        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wide">{cat.label}</p>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">${cat.planned.toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className="text-[11px] text-slate-500 min-w-[30px]">{pct}%</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Spent: ${cat.actual.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tree-style Budget Breakdown */}
            <BudgetTreeTable projectStage={projectStage} />
          </div>
        )}

        {activeTab === "procurement" && (
          <ProjectProcurementTab projectStage={projectStage} />
        )}

        {activeTab === "mel" && (
          <ProjectMELPlan
            projectName={project.name}
            projectStage={projectStage}
            isClosure={isClosure}
            phases={phases}
            deliverables={projectConfig.deliverables}
          />
        )}

        {activeTab === "risk" && (
          <div className="space-y-6">

            {isClosure && (
              <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-emerald-800 font-medium">Project Closed — All risks have been addressed and closed</span>
              </div>
            )}
            {/* Risk Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                <p className="text-[12px] text-red-600 font-medium mb-1">Critical / High</p>
                <p className="text-2xl font-semibold text-red-900">{isClosure ? "0" : "3"}</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                <p className="text-[12px] text-amber-600 font-medium mb-1">Medium</p>
                <p className="text-2xl font-semibold text-amber-900">{isClosure ? "0" : "4"}</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                <p className="text-[12px] text-emerald-600 font-medium mb-1">Low</p>
                <p className="text-2xl font-semibold text-emerald-900">{isClosure ? "0" : "2"}</p>
              </div>
              {isClosure ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                  <p className="text-[12px] text-emerald-600 font-medium mb-1">All Closed</p>
                  <p className="text-2xl font-semibold text-emerald-900">9</p>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-[12px] text-blue-600 font-medium mb-1">Mitigated</p>
                  <p className="text-2xl font-semibold text-blue-900">3</p>
                </div>
              )}
            </div>

            {/* Risk Register Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Risk Register</h2>
                <button
                  onClick={() => setShowRiskBuilder(true)}
                  className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors text-sm font-medium"
                >
                  Open Risk Builder
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: "#0B01D0" }}>
                    <tr>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Risk ID</th>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Risk Description</th>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Associated Task</th>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Likelihood</th>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Impact</th>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Rating</th>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Mitigation Strategy</th>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Owner</th>
                      {projectStage !== "Procurement" && (
                        <>
                          <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Status</th>
                          <th className="text-left px-4 py-3 text-white text-[12px] font-semibold w-10"></th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "RSK-001", desc: "Vendor delivery delays for IT equipment", task: "T009 — Procure IT Equipment", likelihood: "High", impact: "High", rating: "Critical", mitigation: "Pre-qualify multiple vendors; include penalty clauses in contracts", owner: "Kwame Asante", status: "Active" },
                      { id: "RSK-002", desc: "Budget overrun on consultant fees", task: "T005 — Draft Stakeholder Engagement", likelihood: "Medium", impact: "High", rating: "High", mitigation: "Cap consultant days; require monthly spend reports", owner: "Abena Serwaa", status: "Active" },
                      { id: "RSK-003", desc: "Key staff turnover during procurement", task: "T004 — Project Kick-off Meeting", likelihood: "Low", impact: "High", rating: "High", mitigation: "Cross-train team members; maintain succession plan", owner: "Kwame Asante", status: "Monitoring" },
                      { id: "RSK-004", desc: "Exchange rate fluctuations on intl purchases", task: "T009 — Procure IT Equipment", likelihood: "Medium", impact: "Medium", rating: "Medium", mitigation: "Lock exchange rates via forward contracts", owner: "Abena Serwaa", status: "Active" },
                      { id: "RSK-005", desc: "Stakeholder disengagement from planning", task: "T005 — Draft Stakeholder Engagement", likelihood: "Medium", impact: "Medium", rating: "Medium", mitigation: "Regular engagement updates; feedback loops", owner: "Nana Yaw", status: "Active" },
                      { id: "RSK-006", desc: "Regulatory changes affecting procurement", task: "T009 — Procure IT Equipment", likelihood: "Low", impact: "Medium", rating: "Medium", mitigation: "Monitor policy changes; maintain regulatory contacts", owner: "Kwame Asante", status: "Monitoring" },
                      { id: "RSK-007", desc: "Data quality issues from field instruments", task: "T001 — Finalize Survey Instrument", likelihood: "Medium", impact: "Medium", rating: "Medium", mitigation: "Pilot test instruments; QA review process", owner: "Ama Darko", status: "Mitigated" },
                      { id: "RSK-008", desc: "Delays in literature review completion", task: "T003 — Complete Literature Review", likelihood: "Low", impact: "Low", rating: "Low", mitigation: "Set intermediate deadlines; weekly check-ins", owner: "Kofi Mensah", status: "Mitigated" },
                      { id: "RSK-009", desc: "Insufficient community participation in outreach", task: "T006 — Coordinate Field Data Collection", likelihood: "Medium", impact: "Low", rating: "Low", mitigation: "Community leaders briefing; incentive packages", owner: "Kwaku Anane", status: "Monitoring" },
                    ].map(r => isClosure ? { ...r, status: "Closed" } : r).map((risk, idx) => (
                      <tr key={risk.id} className={`border-b border-slate-100 hover:bg-slate-50 ${idx % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                        <td className="px-4 py-3 text-[12px] font-medium text-slate-900">{risk.id}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700 max-w-[200px]">{risk.desc}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-600">{risk.task}</td>
                        <td className="px-4 py-3">
                          <Badge className={cn("text-[12px] font-medium shadow-none border-0", risk.likelihood === "High" ? "bg-red-100 text-red-700" : risk.likelihood === "Medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>{risk.likelihood}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={cn("text-[12px] font-medium shadow-none border-0", risk.impact === "High" ? "bg-red-100 text-red-700" : risk.impact === "Medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>{risk.impact}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={cn("text-[12px] font-medium shadow-none border-0", risk.rating === "Critical" ? "bg-red-100 text-red-700" : risk.rating === "High" ? "bg-orange-100 text-orange-700" : risk.rating === "Medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>{risk.rating}</Badge>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-600 max-w-[200px]">{risk.mitigation}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{risk.owner}</td>
                        {projectStage !== "Procurement" && (
                          <>
                            <td className="px-4 py-3">
                              <Badge className={cn("text-[12px] font-medium shadow-none border-0", risk.status === "Active" ? "bg-blue-100 text-blue-700" : risk.status === "Monitoring" ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700")}>{risk.status}</Badge>
                            </td>
                            <td className="px-4 py-3 relative">
                              <button className="text-slate-400 hover:text-slate-600" onClick={() => setOpenActionMenu(openActionMenu === `risk-${risk.id}` ? null : `risk-${risk.id}`)}><MoreHorizontal className="w-4 h-4" /></button>
                              {openActionMenu === `risk-${risk.id}` && (
                                <div className="absolute right-4 top-10 z-50 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                                  <button className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50" onClick={() => setOpenActionMenu(null)}>Update Risk Status</button>
                                  <button className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50" onClick={() => setOpenActionMenu(null)}>Edit Mitigation Plan</button>
                                  <button className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50" onClick={() => setOpenActionMenu(null)}>Reassign Owner</button>
                                  <button className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50" onClick={() => setOpenActionMenu(null)}>Add Risk Note</button>
                                  <div className="border-t border-slate-100 my-1" />
                                  <button className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50" onClick={() => setOpenActionMenu(null)}>Escalate Risk</button>
                                  <button className="w-full text-left px-4 py-2 text-[12px] text-red-600 hover:bg-red-50" onClick={() => setOpenActionMenu(null)}>Close Risk</button>
                                </div>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "comms" && (
          <div className="space-y-6">

            {isClosure && (
              <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-emerald-800 font-medium">Project Closed — All communications activities completed and documented</span>
              </div>
            )}
            {/* Comms Summary */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-[12px] text-blue-600 font-medium mb-1">Total Activities</p>
                <p className="text-2xl font-semibold text-blue-900">8</p>
              </div>
              {isClosure ? (
                <>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                    <p className="text-[12px] text-emerald-600 font-medium mb-1">Completed</p>
                    <p className="text-2xl font-semibold text-emerald-900">8</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                    <p className="text-[12px] text-amber-600 font-medium mb-1">In Progress</p>
                    <p className="text-2xl font-semibold text-amber-900">0</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-[12px] text-slate-600 font-medium mb-1">Not Started</p>
                    <p className="text-2xl font-semibold text-slate-900">0</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                    <p className="text-[12px] text-emerald-600 font-medium mb-1">Completed</p>
                    <p className="text-2xl font-semibold text-emerald-900">3</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                    <p className="text-[12px] text-amber-600 font-medium mb-1">In Progress</p>
                    <p className="text-2xl font-semibold text-amber-900">3</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-[12px] text-slate-600 font-medium mb-1">Not Started</p>
                    <p className="text-2xl font-semibold text-slate-900">2</p>
                  </div>
                </>
              )}
            </div>

            {/* Comms Plan Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Communications Plan Activities</h2>
                <button
                  onClick={() => setShowCommsBuilder(true)}
                  className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors text-sm font-medium"
                >
                  Open Comms Builder
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: "#0B01D0" }}>
                    <tr>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Activity</th>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Target Audience</th>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Channel</th>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Frequency</th>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Responsible</th>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Budget Line</th>
                      {projectStage !== "Procurement" && (
                        <>
                          <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Status</th>
                          <th className="text-left px-4 py-3 text-white text-[12px] font-semibold w-10"></th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { activity: "Project Launch Press Release", audience: "General Public, Media", channel: "Press / Online", freq: "Once", responsible: "Kwame Boateng", budget: "3.1.1", status: "Completed" },
                      { activity: "Monthly Stakeholder Newsletter", audience: "Donors, Partners, Govt", channel: "Email", freq: "Monthly", responsible: "Kwame Boateng", budget: "3.1.2", status: "In Progress" },
                      { activity: "Social Media Campaign — Youth Skills", audience: "Youth (18-35), Public", channel: "Facebook, Twitter, Instagram", freq: "Weekly", responsible: "Kwame Boateng", budget: "3.1.2", status: "In Progress" },
                      { activity: "Community Town Hall Meetings", audience: "Local Communities", channel: "In-Person Event", freq: "Quarterly", responsible: "Kwaku Anane", budget: "4.1.1", status: "Completed" },
                      { activity: "Donor Progress Briefing", audience: "Ford Foundation, USAID", channel: "Virtual Meeting", freq: "Quarterly", responsible: "Kwame Asante", budget: "—", status: "In Progress" },
                      { activity: "Partner Coordination Workshop", audience: "Implementing Partners", channel: "Hybrid Workshop", freq: "Bi-annual", responsible: "Nana Yaw", budget: "4.1.1", status: "Completed" },
                      { activity: "Policy Brief — Employment Pathways", audience: "Govt Officials, Policy", channel: "Print & Digital", freq: "Once", responsible: "Ama Darko", budget: "3.2.1", status: "Not Started" },
                      { activity: "End-of-Procurement Phase Report", audience: "Internal Team, Donors", channel: "Email / Portal", freq: "Once", responsible: "Kwame Asante", budget: "—", status: "Not Started" },
                    ].map(c => isClosure ? { ...c, status: "Completed" } : c).map((item, idx) => (
                      <tr key={idx} className={`border-b border-slate-100 hover:bg-slate-50 ${idx % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                        <td className="px-4 py-3 text-[12px] font-medium text-slate-900">{item.activity}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-600">{item.audience}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-600">{item.channel}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-600">{item.freq}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{item.responsible}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-600">{item.budget}</td>
                        {projectStage !== "Procurement" && (
                          <>
                            <td className="px-4 py-3">
                              <Badge className={cn("text-[12px] font-medium shadow-none border-0", item.status === "Completed" ? "bg-emerald-100 text-emerald-700" : item.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700")}>{item.status}</Badge>
                            </td>
                            <td className="px-4 py-3 relative">
                              <button className="text-slate-400 hover:text-slate-600" onClick={() => setOpenActionMenu(openActionMenu === `comms-${idx}` ? null : `comms-${idx}`)}><MoreHorizontal className="w-4 h-4" /></button>
                              {openActionMenu === `comms-${idx}` && (
                                <div className="absolute right-4 top-10 z-50 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                                  <button className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50" onClick={() => setOpenActionMenu(null)}>Update Activity Status</button>
                                  <button className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50" onClick={() => setOpenActionMenu(null)}>Edit Activity Details</button>
                                  <button className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50" onClick={() => setOpenActionMenu(null)}>Change Responsible</button>
                                  <button className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50" onClick={() => setOpenActionMenu(null)}>Log Engagement</button>
                                  <div className="border-t border-slate-100 my-1" />
                                  <button className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50" onClick={() => setOpenActionMenu(null)}>Attach Deliverable</button>
                                  <button className="w-full text-left px-4 py-2 text-[12px] text-red-600 hover:bg-red-50" onClick={() => setOpenActionMenu(null)}>Cancel Activity</button>
                                </div>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            {projectStage === "Inception & Planning" && (
              <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-blue-800 font-medium">Concept Note Template available for input</span>
              </div>
            )}
            {projectStage === "Closure" && (
              <div className="mb-4 px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-purple-800 font-medium">Closure Report Template available</span>
              </div>
            )}
            {!selectedFolder ? (
              <>
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Artifacts Library</h2>
                
                <div className="grid grid-cols-4 gap-6">
                  {/* Inception Docs Folder */}
                  <div 
                    onClick={() => setSelectedFolder("Inception Docs")}
                    className="border border-slate-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4">
                        <svg className="w-16 h-16 text-blue-500 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Inception Docs</h3>
                      <p className="text-sm text-slate-500">12 files</p>
                    </div>
                  </div>

                  {/* Contracts Folder */}
                  <div 
                    onClick={() => setSelectedFolder("Contracts")}
                    className="border border-slate-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4">
                        <svg className="w-16 h-16 text-emerald-500 group-hover:text-emerald-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Contracts</h3>
                      <p className="text-sm text-slate-500">8 files</p>
                    </div>
                  </div>

                  {/* Reports Folder */}
                  <div 
                    onClick={() => setSelectedFolder("Reports")}
                    className="border border-slate-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4">
                        <svg className="w-16 h-16 text-purple-500 group-hover:text-purple-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Reports</h3>
                      <p className="text-sm text-slate-500">24 files</p>
                    </div>
                  </div>

                  {/* Closure Docs Folder */}
                  <div 
                    onClick={() => setSelectedFolder("Closure Docs")}
                    className="border border-slate-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4">
                        <svg className="w-16 h-16 text-orange-500 group-hover:text-orange-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Closure Docs</h3>
                      <p className="text-sm text-slate-500">3 files</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Back to folders */}
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setSelectedFolder(null)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={20} className="text-slate-600" />
                  </button>
                  <h2 className="text-lg font-semibold text-slate-900">{selectedFolder}</h2>
                  <span className="text-sm text-slate-500">({folderDocuments[selectedFolder].length} files)</span>
                </div>

                {/* Documents Table */}
                <div className="overflow-x-auto -mx-6">
                  <table className="w-full">
                    <thead className="bg-blue-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">DOCUMENT NAME</th>
                        <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">FILE TYPE</th>
                        <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">SIZE</th>
                        <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">UPLOADED BY</th>
                        <th className="px-4 py-3 text-left text-[12px] font-semibold text-white">UPLOAD DATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {folderDocuments[selectedFolder].map((doc, index) => (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-4 text-[12px] font-medium text-slate-900">{doc.name}</td>
                          <td className="px-4 py-4 text-[12px] text-slate-600">{doc.type}</td>
                          <td className="px-4 py-4 text-[12px] text-slate-600">{doc.size}</td>
                          <td className="px-4 py-4 text-[12px] text-slate-600">{doc.uploadedBy}</td>
                          <td className="px-4 py-4 text-[12px] text-slate-600">{doc.uploadDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
