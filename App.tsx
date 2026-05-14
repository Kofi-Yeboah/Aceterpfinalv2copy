import { useState } from "react";
const imgImage35 = "/acet-logo-white.png";
import { NavigationSidebar } from "./components/NavigationSidebar";
import { Login } from "./components/Login";
import { EmployeeHome } from "./pages/EmployeeHome";
import { MyPersonalInformation } from "./pages/MyPersonalInformation";
import { CheckMyPayslip } from "./pages/CheckMyPayslip";
import { LeaveRequest } from "./pages/LeaveRequest";
import { TravelRequest } from "./components/TravelRequest";
import { ExpenseClaim } from "./components/ExpenseClaim";
import { PettyCash } from "./components/PettyCash";
import { ManpowerRequest } from "./components/ManpowerRequest";
import { LoanRequest } from "./pages/LoanRequest";
import { MyFeedback } from "./pages/MyFeedback";
import { EmployeeTimesheet } from "./pages/EmployeeTimesheet";
import { MyTasks } from "./pages/MyTasks";
import { ESSProcurementPlan } from "./pages/ESSProcurementPlan";
import { TimesheetApprovals } from "./pages/TimesheetApprovals";
import { LeaveRequestApprovals } from "./pages/LeaveRequestApprovals";
import { TravelRequestApprovals } from "./pages/TravelRequestApprovals";
import { TaskCompletionApproval } from "./pages/TaskCompletionApproval";
import { ProcurementRequestApproval } from "./pages/ProcurementRequestApproval";
import { ProjectDocumentsApproval } from "./pages/ProjectDocumentsApproval";
import { TrainingAttendanceApproval } from "./pages/TrainingAttendanceApproval";
import { PendingApprovalsLeave } from "./pages/PendingApprovalsLeave";
import { ApprovedRequests } from "./components/ApprovedRequests";
import { RejectedRequests } from "./components/RejectedRequests";
import { HRManagementDashboard } from "./pages/HRManagementDashboard";
import { Recruitment } from "./components/Recruitment";
import { Interviews } from "./components/Interviews";
import ApplicationPortal from "./pages/ApplicationPortal";
import { EmployeeProfiles } from "./components/EmployeeProfiles";
import { JobTitles } from "./components/JobTitles";
import { Contracts } from "./components/Contracts";
import { Departments } from "./components/Departments";
import { EmployeeTraining } from "./components/EmployeeTraining";
import { PerformanceManagementScreen } from "./components/PerformanceManagementScreen";
import { MainDashboard } from "./components/MainDashboard";
import { UserManagement } from "./components/UserManagement";
import { DocumentVault } from "./components/DocumentVault";
import { NotificationCenter } from "./components/NotificationCenter";
import { ContentManagement } from "./components/ContentManagement";
import { ProjectManagementDashboard } from "./components/ProjectManagementDashboard";
import { Programs } from "./components/Programs";
import { ProjectPlanning } from "./components/ProjectPlanning";
import { TaskManagement } from "./components/TaskManagement";
import { TimeTracking } from "./components/TimeTracking";
import { ProjectTimeline } from "./components/ProjectTimeline";
import { ResourceCapacityManagement } from "./components/ResourceCapacityManagement";
import { ResourcePlanPage } from "./components/ResourcePlanPage";
import { MELDashboard } from "./components/MELDashboard";
import { MELFrameworks } from "./components/MELFrameworks";
import { PerformanceIndicators } from "./components/PerformanceIndicators";
import { DataCollectionAssessment } from "./components/DataCollectionAssessment";
import { DonorReports } from "./components/DonorReports";
import { ManagementReports } from "./components/ManagementReports";
import { MELReports } from "./components/MELReports";
import { ImpactAssessmentReport } from "./components/ImpactAssessmentReport";
import { CRMAdvocacyDashboard } from "./components/CRMAdvocacyDashboard";
import { ContactDirectory } from "./components/ContactDirectory";
import { PotentialDonors } from "./components/PotentialDonors";
import { ProposalsAgreements } from "./components/ProposalsAgreements";
import { PotentialProjects } from "./components/PotentialProjects";
import { GrantCompliance } from "./components/GrantCompliance";
import { AdvocacyImpactHub } from "./components/AdvocacyImpactHub";
import { StakeholderManagement } from "./components/StakeholderManagement";
import { AdvocacyCalendar } from "./components/AdvocacyCalendar";
import { AdvocacyContentCollateral } from "./components/AdvocacyContentCollateral";
import { ImpactMonitoring } from "./components/ImpactMonitoring";
import { RequestManagementLeave } from "./components/RequestManagementLeave";
import { RequestManagementTravel } from "./components/RequestManagementTravel";
import { HRAdvanceApprovals } from "./pages/HRAdvanceApprovals";
import { PayrollDashboard } from "./components/PayrollDashboard";
import { GeneralLedger } from "./components/GeneralLedger";
import { PaymentVouchers } from "./components/PaymentVouchers";
import { ExpenditureManagement } from "./components/ExpenditureManagement";
import { Budgeting } from "./components/Budgeting";
import { OperationalBudgets } from "./components/OperationalBudgets";
import { ProjectBudgets } from "./components/ProjectBudgets";
import { FundsManagement } from "./components/FundsManagement";
import { CashManagement } from "./components/CashManagement";
import { Accounts } from "./components/Accounts";
import { BankingManagement } from "./components/BankingManagement";
import { PayrollSummary } from "./components/PayrollSummary";
import { PaymentApprovals } from "./components/PaymentApprovals";
import { BudgetApprovals } from "./components/BudgetApprovals";
import { FinancePRApproval } from "./pages/FinancePRApproval";
import { SeniorMgmtApproval } from "./pages/SeniorMgmtApproval";
import { FinancialStatements } from "./components/FinancialStatements";
import { FinanceReportingAnalytics } from "./components/FinanceReportingAnalytics";
import { FinancialsAssetManagement } from "./components/FinancialsAssetManagement";
import { FinancialsDepreciationManagement } from "./components/FinancialsDepreciationManagement";
import { ProcurementDashboard } from "./components/ProcurementDashboard";
import { Suppliers } from "./components/Suppliers";
import { PurchaseRequisitionManagement } from "./components/PurchaseRequisitionManagement";
import { Sourcing } from "./components/Sourcing";
import { PurchaseOrderManagement } from "./components/PurchaseOrderManagement";
import { Invoices } from "./components/Invoices";
import { ContractManagement } from "./components/ContractManagement";
import { ContractorsManagement } from "./components/ContractorsManagement";
import { ProcurementApprovals } from "./components/ProcurementApprovals";
import { PurchasePlan } from "./pages/PurchasePlan";
import { PurchasePlanApproval } from "./pages/PurchasePlanApproval";
import { ProcurementReportingAnalytics } from "./components/ProcurementReportingAnalytics";
import { PayrollManagementDashboard } from "./components/PayrollManagementDashboard";
import { PayrollManagementPayroll } from "./components/PayrollManagementPayroll";
import { PayrollManagementAllowances } from "./components/PayrollManagementAllowances";
import { PayrollManagementDeductions } from "./components/PayrollManagementDeductions";
import { TaxTable } from "./components/TaxTable";
import { SNITRate } from "./components/SNITRate";
import { PFRate } from "./components/PFRate";
import { LoanDeductions } from "./components/LoanDeductions";
import { OtherDeductionsManagement } from "./components/OtherDeductionsManagement";
import { PayrollManagementAdvance } from "./components/PayrollManagementAdvance";
import { PayrollApproval } from "./components/PayrollApproval";
import { PayrollManagementPayrollReport } from "./components/PayrollManagementPayrollReport";
import { PayrollSchedule } from "./components/PayrollSchedule";
import { PayrollScheduleConsolidated } from "./components/PayrollScheduleConsolidated";
import { PAYESchedule } from "./components/PAYESchedule";
import { SSFFirstTierReport } from "./components/SSFFirstTierReport";
import { SSFSecondTierReport } from "./components/SSFSecondTierReport";
import { ProvidentFundReport } from "./components/ProvidentFundReport";
import { LoanDeductionSchedule } from "./components/LoanDeductionSchedule";
import { OtherDeductionSchedule } from "./components/OtherDeductionSchedule";
import { BankPaymentScheduleLocalAccount } from "./components/BankPaymentScheduleLocalAccount";
import { BankTransferScheduleForeignAccount } from "./components/BankTransferScheduleForeignAccount";
import { HeadcountReport } from "./components/HeadcountReport";
import { TurnoverReport } from "./components/TurnoverReport";
import { ProjectStatusReport } from "./pages/ProjectStatusReport";
import { ResourceUtilizationReport } from "./pages/ResourceUtilizationReport";
import { TimelineReport } from "./pages/TimelineReport";
import { BudgetVsActualProjectReport } from "./pages/BudgetVsActualProjectReport";
import { TaskCompletionReport } from "./pages/TaskCompletionReport";
import { LegalContractsDashboard } from "./pages/LegalContractsDashboard";
import { ContractRepository } from "./pages/ContractRepository";
import { DraftingTemplates } from "./pages/DraftingTemplates";
import { RequestsQueue } from "./pages/RequestsQueue";
import { KnowledgeHubDashboard } from "./pages/KnowledgeHubDashboard";
import { ProposalLibrary } from "./components/ProposalLibrary";
import { ProjectArtifacts } from "./components/ProjectArtifacts";
import { TemplateEngine } from "./components/TemplateEngine";
import { DonorIntelligence } from "./components/DonorIntelligence";
import { WBSBuilder } from "./components/WBSBuilder";
import { ProcurementPlanView } from "./components/ProcurementPlanView";
import { BudgetBuilder } from "./components/BudgetBuilder";
import { RiskManagementPlanBuilder } from "./components/RiskManagementPlanBuilder";
import { CommsPlanBuilder } from "./components/CommsPlanBuilder";
import { Settings } from "./components/Settings";
import { NotificationTray } from "./components/NotificationTray";
import { HRPettyCashApprovals } from "./pages/HRPettyCashApprovals";
import { HRExpenseClaimApprovals } from "./pages/HRExpenseClaimApprovals";
import { HRManpowerApprovals } from "./pages/HRManpowerApprovals";
import { HRStaffUpdateApprovals } from "./pages/HRStaffUpdateApprovals";
import { StaffAllocationApproval } from "./pages/StaffAllocationApproval";

export default function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("EMPLOYEE SELF-SERVICE-Home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationTray, setShowNotificationTray] = useState(false);
  const [previousMenuItem, setPreviousMenuItem] = useState<string>("");

  const handleLogin = () => {
    setIsAuthenticated(true);
    setSelectedMenuItem("FAVORITES-Dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedMenuItem("EMPLOYEE SELF-SERVICE-Home");
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "EMPLOYEE SELF-SERVICE-Home":
        return <EmployeeHome />;
      case "EMPLOYEE SELF-SERVICE-My Personal Information":
        return <MyPersonalInformation />;
      case "EMPLOYEE SELF-SERVICE-Check My Payslip":
        return <CheckMyPayslip />;
      case "EMPLOYEE SELF-SERVICE-My Requests-Leave Request":
        return <LeaveRequest />;
      case "EMPLOYEE SELF-SERVICE-My Requests-Travel Request":
        return <TravelRequest />;
      case "EMPLOYEE SELF-SERVICE-My Requests-Expense Claim":
        return <ExpenseClaim />;
      case "EMPLOYEE SELF-SERVICE-My Requests-Petty Cash":
        return <PettyCash />;
      case "EMPLOYEE SELF-SERVICE-My Requests-Manpower Request":
        return <ManpowerRequest />;
      case "EMPLOYEE SELF-SERVICE-My Requests-Loan Request":
        return <LoanRequest />;
      case "EMPLOYEE SELF-SERVICE-My Feedback":
        return <MyFeedback />;
      case "EMPLOYEE SELF-SERVICE-Employee Timesheet":
        return <EmployeeTimesheet />;
      case "EMPLOYEE SELF-SERVICE-My Tasks":
        return <MyTasks />;
      case "EMPLOYEE SELF-SERVICE-Procurement Plan":
        return <ESSProcurementPlan />;
      case "EMPLOYEE SELF-SERVICE-Approvals-Timesheet Approvals":
        return <TimesheetApprovals />;
      case "EMPLOYEE SELF-SERVICE-Approvals-Leave Request Approvals":
        return <LeaveRequestApprovals />;
      case "EMPLOYEE SELF-SERVICE-Approvals-Travel Request Approvals":
        return <TravelRequestApprovals />;
      case "EMPLOYEE SELF-SERVICE-Approvals-Task Completion Approval":
        return <TaskCompletionApproval />;
      case "EMPLOYEE SELF-SERVICE-Approvals-Procurement Request Approval":
        return <ProcurementRequestApproval />;
      case "EMPLOYEE SELF-SERVICE-Approvals-Project Documents Approval":
        return <ProjectDocumentsApproval />;
      case "EMPLOYEE SELF-SERVICE-Approvals-Training Attendance Approval":
        return <TrainingAttendanceApproval />;
      case "EMPLOYEE SELF-SERVICE-Approvals-Pending Approvals":
        return <PendingApprovalsLeave />;
      case "EMPLOYEE SELF-SERVICE-Approvals-Approved":
        return <ApprovedRequests />;
      case "EMPLOYEE SELF-SERVICE-Approvals-Rejected":
        return <RejectedRequests />;

      case "HR MANAGEMENT-Dashboard":
        return <HRManagementDashboard />;
      case "HR MANAGEMENT-Recruitment & Hiring-Applicants":
        return <Recruitment onNavigateToApplicationPortal={() => setSelectedMenuItem("HR MANAGEMENT-Recruitment & Hiring-Application Portal")} />;
      case "HR MANAGEMENT-Recruitment & Hiring-Interviews":
        return <Interviews />;
      case "HR MANAGEMENT-Recruitment & Hiring-Manpower Request":
        return <ManpowerRequest />;
      case "HR MANAGEMENT-Recruitment & Hiring-Application Portal":
        return <ApplicationPortal />;
      case "HR MANAGEMENT-Employees-Employee Profiles":
        return <EmployeeProfiles />;
      case "HR MANAGEMENT-Employees-Job Titles":
        return <JobTitles />;
      case "HR MANAGEMENT-Employees-Contracts":
        return <Contracts />;
      case "HR MANAGEMENT-Employees-Departments":
        return <Departments />;
      case "HR MANAGEMENT-Training & Development":
        return <EmployeeTraining />;
      case "HR MANAGEMENT-Performance Mgmt":
        return <PerformanceManagementScreen />;
      case "FAVORITES-Dashboard":
        return <MainDashboard />;
      case "FAVORITES-User management":
        return <UserManagement />;
      case "FAVORITES-Document Vault":
        return <DocumentVault onNavigate={(navKey: string) => setSelectedMenuItem(navKey)} />;
      case "FAVORITES-Notification Center":
        return <NotificationCenter />;
      case "FAVORITES-Content Manager":
        return <ContentManagement />;
      case "PROJECT MANAGEMENT-Dashboard":
        return <ProjectManagementDashboard />;
      case "PROJECT MANAGEMENT-Programs":
        return <Programs />;
      case "PROJECT MANAGEMENT-Projects":
        return <ProjectPlanning 
          onNavigateToWBS={() => {
            setPreviousMenuItem(selectedMenuItem);
            setSelectedMenuItem("WBS-Builder");
          }} 
          onNavigateToProcurementPlan={() => {
            setPreviousMenuItem(selectedMenuItem);
            setSelectedMenuItem("PROCUREMENT-Plan Builder");
          }}
          onNavigateToBudget={() => {
            setPreviousMenuItem(selectedMenuItem);
            setSelectedMenuItem("BUDGET-Builder");
          }}
          onNavigateToRiskManagement={() => {
            setPreviousMenuItem(selectedMenuItem);
            setSelectedMenuItem("RISK MANAGEMENT-Plan Builder");
          }}
          onNavigateToCommsPlan={() => {
            setPreviousMenuItem(selectedMenuItem);
            setSelectedMenuItem("COMMUNICATIONS-Plan Builder");
          }}
        />;
      case "PROJECT MANAGEMENT-Tasks":
        return <TaskManagement />;
      case "PROJECT MANAGEMENT-Time Tracking":
        return <TimeTracking />;
      case "PROJECT MANAGEMENT-Project Timelines":
        return <ProjectTimeline />;
      case "PROJECT MANAGEMENT-Staff Allocation":
        return <ResourceCapacityManagement />;
      case "PROJECT MANAGEMENT-Resource Plan":
        return <ResourcePlanPage />;
      case "PROJECT MANAGEMENT-Approvals-Task Completion Approval":
        return <TaskCompletionApproval />;
      case "PROJECT MANAGEMENT-Approvals-Project Documents Approval":
        return <ProjectDocumentsApproval />;
      case "MONITORING & EVALUATION-Dashboard":
        return <MELDashboard />;
      case "MONITORING & EVALUATION-MEL Frameworks":
        return <MELFrameworks />;
      case "MONITORING & EVALUATION-Performance Indicators":
        return <PerformanceIndicators />;
      case "MONITORING & EVALUATION-Data Collection":
        return <DataCollectionAssessment />;
      case "MONITORING & EVALUATION-Reporting & Analytics-Donor Reports":
        return <DonorReports />;
      case "MONITORING & EVALUATION-Reporting & Analytics-Management Reports":
        return <ManagementReports />;
      case "MONITORING & EVALUATION-Reporting & Analytics-M&E Reports":
        return <MELReports />;
      case "MONITORING & EVALUATION-Reporting & Analytics-Impact Assessment":
        return <ImpactAssessmentReport />;
      case "CRM-Dashboard":
        return <CRMAdvocacyDashboard />;
      case "CRM-Contact Management":
        return <ContactDirectory />;
      case "CRM-Grant Management-Prospects":
        return <PotentialDonors />;
      case "CRM-Grant Management-Agreements":
        return <ProposalsAgreements />;
      case "CRM-Grant Management-Concepts":
        return <PotentialProjects />;
      case "CRM-Grant Management-Compliance":
        return <GrantCompliance />;
      case "CRM-Advocacy & Impact Hub-Activity Tracker":
        return <AdvocacyImpactHub />;
      case "CRM-Advocacy & Impact Hub-Stakeholder Management":
        return <StakeholderManagement />;
      case "CRM-Advocacy & Impact Hub-Advocacy Calendar":
        return <AdvocacyCalendar />;
      case "CRM-Advocacy & Impact Hub-Content & Collateral":
        return <AdvocacyContentCollateral />;
      case "CRM-Advocacy & Impact Hub-Impact Monitoring":
        return <ImpactMonitoring />;
      case "HR MANAGEMENT-Approvals-Leave":
        return <RequestManagementLeave />;
      case "HR MANAGEMENT-Approvals-Travel":
        return <RequestManagementTravel />;
      case "HR MANAGEMENT-Approvals-Advance Requests":
        return <HRAdvanceApprovals />;
      case "FINANCE-Dashboard":
        return <PayrollDashboard />;
      case "FINANCE-General Ledger":
        return <GeneralLedger />;
      case "FINANCE-Payment Vouchers":
        return <PaymentVouchers />;
      case "FINANCE-Expenditure Management":
        return <ExpenditureManagement />;
      case "FINANCE-Budgeting":
        return <Budgeting />;
      case "FINANCE-Budgeting & Planning-Operational Budgets":
        return <OperationalBudgets />;
      case "FINANCE-Budgeting & Planning-Project Budgets":
        return <ProjectBudgets />;
      case "FINANCE-Funds Management":
        return <FundsManagement />;
      case "FINANCE-Cash Management":
        return <CashManagement />;
      case "FINANCE-Accounts":
        return <Accounts />;
      case "FINANCE-Banking Management":
        return <BankingManagement />;
      case "FINANCE-Summary":
        return <PayrollSummary />;
      case "FINANCE-Approvals-Payment Approvals":
        return <PaymentApprovals />;
      case "FINANCE-Approvals-Budget Approvals":
        return <BudgetApprovals />;
      case "FINANCE-Approvals-Procurement Requests":
        return <FinancePRApproval />;
      case "FINANCE-Approvals-Senior Management":
        return <SeniorMgmtApproval />;
      case "FINANCE-Approvals-Expense Claims":
        return <HRExpenseClaimApprovals />;
      case "FINANCE-Approvals-Advance Requests":
        return <HRAdvanceApprovals />;
      case "FINANCE-Approvals-Petty Cash":
        return <HRPettyCashApprovals />;
      case "FINANCE-Approvals-Payroll":
        return <PayrollApproval />;
      case "FINANCE-Reporting & Analytics-Financial Statements":
        return <FinancialStatements />;
      case "FINANCE-Reporting & Analytics-Project Reports":
        return <FinanceReportingAnalytics initialTab="project" />;
      case "FINANCE-Reporting & Analytics-Audit Tray":
        return <FinanceReportingAnalytics initialTab="audit" />;
      case "FINANCE-Reporting & Analytics-Timesheet Reports":
        return <FinanceReportingAnalytics initialTab="timesheet" />;
      case "FINANCE-Asset Management":
        return <FinancialsAssetManagement />;
      case "FINANCE-Depreciation Mgmt":
        return <FinancialsDepreciationManagement />;
      case "PROCUREMENT-Dashboard":
        return <ProcurementDashboard />;
      case "PROCUREMENT-Supplier Management":
        return <Suppliers />;
      case "PROCUREMENT-Purchase Requisitions":
        return <PurchaseRequisitionManagement />;
      case "PROCUREMENT-Sourcing":
        return <Sourcing onNavigate={(navKey: string) => setSelectedMenuItem(navKey)} />;
      case "PROCUREMENT-Purchase Order Mgnt":
        return <PurchaseOrderManagement />;
      case "PROCUREMENT-Invoices":
        return <Invoices />;
      case "PROCUREMENT-Contract Management":
        return <ContractManagement />;
      case "PROCUREMENT-Contractors":
        return <ContractorsManagement />;
      case "PROCUREMENT-Approvals-Purchase Requisitions":
        return <ProcurementApprovals />;
      case "PROCUREMENT-Purchase Plan":
        return <PurchasePlan />;
      case "PROCUREMENT-Approvals-Purchase Plan Approvals":
        return <PurchasePlanApproval />;
      case "PROCUREMENT-Approvals-Senior Management Approval":
        return <SeniorMgmtApproval />;
      case "PROCUREMENT-Reporting & Analytics-Planning & Orders":
      case "PROCUREMENT-Reporting & Analytics-Planning & Requisitions":
      case "PROCUREMENT-Reporting & Analytics-Purchase Order Reports":
        return <ProcurementReportingAnalytics initialTab="planning" />;
      case "PROCUREMENT-Reporting & Analytics-Sourcing & Contracts":
      case "PROCUREMENT-Reporting & Analytics-RFQ Reports":
        return <ProcurementReportingAnalytics initialTab="sourcing" />;
      case "PROCUREMENT-Reporting & Analytics-Vendors & KPIs":
      case "PROCUREMENT-Reporting & Analytics-Vendor Reports":
      case "PROCUREMENT-Reporting & Analytics-Vendor & Donor Analytics":
      case "PROCUREMENT-Reporting & Analytics-KPI Dashboard":
        return <ProcurementReportingAnalytics initialTab="vendors" />;
      case "PROCUREMENT-Reporting & Analytics-Contract Reports":
        return <ProcurementReportingAnalytics initialTab="contracts" />;
      case "PROCUREMENT-Reporting & Analytics-Donor Reports":
        return <ProcurementReportingAnalytics initialTab="donors" />;
      case "PROCUREMENT-Reporting & Analytics-Combined Analysis":
        return <ProcurementReportingAnalytics initialTab="combined" />;
      case "PAYROLL MANAGEMENT-Dashboard":
        return <PayrollManagementDashboard />;
      case "PAYROLL MANAGEMENT-Payroll":
        return <PayrollManagementPayroll />;
      case "PAYROLL MANAGEMENT-Allowances":
        return <PayrollManagementAllowances />;
      case "PAYROLL MANAGEMENT-Deductions":
        return <PayrollManagementDeductions />;
      case "PAYROLL MANAGEMENT-Deductions-Tax Table":
        return <TaxTable />;
      case "PAYROLL MANAGEMENT-Deductions-SNIT Rate":
        return <SNITRate />;
      case "PAYROLL MANAGEMENT-Deductions-PF Rate":
        return <PFRate />;
      case "PAYROLL MANAGEMENT-Deductions-Loan":
        return <LoanDeductions />;
      case "PAYROLL MANAGEMENT-Deductions-Other Deductions":
        return <OtherDeductionsManagement />;
      case "PAYROLL MANAGEMENT-Advance":
        return <PayrollManagementAdvance />;
      case "PAYROLL MANAGEMENT-Approvals-Payroll":
        return <PayrollApproval />;
      case "PAYROLL MANAGEMENT-Reporting & Analytics-Payroll Report":
        return <PayrollManagementPayrollReport />;
      case "PAYROLL MANAGEMENT-Reporting & Analytics-Payroll Schedule":
        return <PayrollSchedule />;
      case "PAYROLL MANAGEMENT-Reporting & Analytics-Payroll Schedule - Consolidated":
        return <PayrollScheduleConsolidated />;
      case "PAYROLL MANAGEMENT-Reporting & Analytics-PAYE Schedule":
        return <PAYESchedule />;
      case "PAYROLL MANAGEMENT-Reporting & Analytics-SSF - First Tier Report":
        return <SSFFirstTierReport />;
      case "PAYROLL MANAGEMENT-Reporting & Analytics-SSF - Second Tier Report":
        return <SSFSecondTierReport />;
      case "PAYROLL MANAGEMENT-Reporting & Analytics-Provident Fund Report":
        return <ProvidentFundReport />;
      case "PAYROLL MANAGEMENT-Reporting & Analytics-Loan Deduction Schedule":
        return <LoanDeductionSchedule />;
      case "PAYROLL MANAGEMENT-Reporting & Analytics-Other Deduction Schedule":
        return <OtherDeductionSchedule />;
      case "PAYROLL MANAGEMENT-Reporting & Analytics-Bank Payment Schedule - Local Account":
        return <BankPaymentScheduleLocalAccount />;
      case "PAYROLL MANAGEMENT-Reporting & Analytics-Bank Transfer Schedule - Foreign Account":
        return <BankTransferScheduleForeignAccount />;
      case "HR MANAGEMENT-Reporting & Analytics-Headcount Report":
        return <HeadcountReport />;
      case "HR MANAGEMENT-Reporting & Analytics-Turnover Report":
        return <TurnoverReport />;
      case "PROJECT MANAGEMENT-Reports-Project Status Report":
        return <ProjectStatusReport />;
      case "PROJECT MANAGEMENT-Reports-Staff Utilization Report":
        return <ResourceUtilizationReport />;
      case "PROJECT MANAGEMENT-Reports-Timeline Report":
        return <TimelineReport />;
      case "PROJECT MANAGEMENT-Reports-Budget vs Actual Report":
        return <BudgetVsActualProjectReport />;
      case "PROJECT MANAGEMENT-Reports-Task Completion Report":
        return <TaskCompletionReport />;
      case "LEGAL & CONTRACTS-Dashboard":
        return <LegalContractsDashboard />;
      case "LEGAL & CONTRACTS-Contract Repository":
        return <ContractRepository />;
      case "LEGAL & CONTRACTS-Drafting & Templates":
        return <DraftingTemplates />;
      case "LEGAL & CONTRACTS-Requests Queue":
        return <RequestsQueue />;
      case "KNOWLEDGE HUB-Dashboard":
        return <KnowledgeHubDashboard />;
      case "KNOWLEDGE HUB-Proposal Library":
        return <ProposalLibrary />;
      case "KNOWLEDGE HUB-Project Artifacts":
        return <ProjectArtifacts />;
      case "KNOWLEDGE HUB-Template Engine":
        return <TemplateEngine />;
      case "KNOWLEDGE HUB-Donor Intelligence":
        return <DonorIntelligence />;
      case "WBS-Builder":
        return <WBSBuilder onBack={() => setSelectedMenuItem(previousMenuItem || "PROJECT MANAGEMENT-Projects")} />;
      case "PROCUREMENT-Plan Builder":
        return <ProcurementPlanView onBack={() => setSelectedMenuItem(previousMenuItem || "PROJECT MANAGEMENT-Projects")} />;
      case "BUDGET-Builder":
        return <BudgetBuilder onBack={() => setSelectedMenuItem(previousMenuItem || "PROJECT MANAGEMENT-Projects")} />;
      case "RISK MANAGEMENT-Plan Builder":
        return <RiskManagementPlanBuilder onBack={() => setSelectedMenuItem(previousMenuItem || "PROJECT MANAGEMENT-Projects")} />;
      case "COMMUNICATIONS-Plan Builder":
        return <CommsPlanBuilder onBack={() => setSelectedMenuItem(previousMenuItem || "PROJECT MANAGEMENT-Projects")} />;
      case "SETTINGS":
        return <Settings />;
      case "HR MANAGEMENT-Approvals-Petty Cash":
        return <HRPettyCashApprovals />;
      case "HR MANAGEMENT-Approvals-Expense Claims":
        return <HRExpenseClaimApprovals />;
      case "HR MANAGEMENT-Approvals-Manpower Requests":
        return <HRManpowerApprovals />;
      case "HR MANAGEMENT-Approvals-Staff Profile Updates":
        return <HRStaffUpdateApprovals />;
      case "HR MANAGEMENT-Approvals-Timesheet Approvals":
        return <TimesheetApprovals />;
      case "HR MANAGEMENT-Project Approvals-Staff Allocation Approvals":
        return <StaffAllocationApproval />;
      default:
        return (
          <div className="p-8 bg-white h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                {selectedMenuItem.split("-").pop()}
              </h2>
              <p className="text-slate-600">Content for this page is coming soon.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-white">
      {/* Top Navbar */}
      <div className="absolute bg-gradient-to-l from-[#03003f] to-[#0900a5] h-[57px] items-center justify-between pl-7 pr-4 py-3 right-0 top-0 left-0 flex z-10">
        <div className="h-10 w-[88px] relative">
          <img alt="Logo" className="h-full w-auto object-contain" src={imgImage35} />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setShowProfileDropdown(false);
              setShowNotificationTray((previous) => !previous);
            }}
            className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Open notifications"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute right-2 top-2 flex h-2.5 w-2.5 rounded-full bg-amber-300 ring-2 ring-[#0900a5]" />
          </button>
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotificationTray(false);
                setShowProfileDropdown(!showProfileDropdown);
              }}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:ring-2 hover:ring-white/30 transition-all cursor-pointer"
            >
              <span className="text-white text-sm font-semibold">AC</span>
            </button>
            {showProfileDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfileDropdown(false)} />
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                  <button 
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setSelectedMenuItem("SETTINGS");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 first:rounded-t-lg"
                  >
                    Settings
                  </button>
                  <button 
                    onClick={() => {
                      setShowProfileDropdown(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 last:rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sidebar */}
      <NavigationSidebar 
        selectedItem={selectedMenuItem}
        onSelectItem={setSelectedMenuItem}
      />

      <NotificationTray
        isOpen={showNotificationTray}
        onClose={() => setShowNotificationTray(false)}
        onViewAll={() => {
          setShowNotificationTray(false);
          setSelectedMenuItem("FAVORITES-Notification Center");
        }}
      />

      {/* Main Content */}
      <div className="absolute top-[57px] left-[288px] right-0 bottom-0 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}
