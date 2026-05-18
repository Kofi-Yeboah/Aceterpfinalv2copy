export type AccountType = "Asset" | "Liability" | "Revenue" | "Expense" | "Equity";

export type LedgerType = "Primary" | "Secondary" | "Statistical" | "Budget" | "Consolidation" | "Tax" | "Reporting" | "Memo";

export type JournalEntryType = "Standard" | "Adjusting" | "Reversing" | "Recurring" | "Accrual" | "Closing" | "Opening" | "Revaluation" | "Elimination" | "Reclassification";

export type JournalStatus = "Draft" | "Submitted" | "Approved" | "Posted" | "Reversed";

export type PeriodState = "NotOpened" | "Open" | "SoftClose" | "HardClose";

export type AccountStatus = "Draft" | "PendingApproval" | "Approved" | "Active" | "Inactive";

export type RoleName = "Finance Director" | "Finance Manager" | "Accountant" | "AP Clerk" | "AR Clerk" | "Budget Analyst" | "Financial Analyst" | "Auditor";

export type PermissionAction = "Create" | "Read" | "Update" | "Delete" | "Approve" | "Post" | "Reverse";

export type ControlAccountType = "AR" | "AP" | "FA" | "Inventory" | "Payroll";

export type FXRateType = "Spot" | "Average" | "Closing";

export type ClosingStepStatus = "Pending" | "InProgress" | "Completed" | "Skipped";

export interface SegmentedAccountCode {
  entity: string;
  businessUnit: string;
  department: string;
  account: string;
  costCenter: string;
  intercompany: string;
}

export interface AccountVersion {
  version: number;
  changedBy: string;
  changedDate: string;
  changes: string;
  effectiveDate: string;
}

export interface SRDAccount {
  id: string;
  code: SegmentedAccountCode;
  displayCode: string;
  name: string;
  type: AccountType;
  normalBalance: "Debit" | "Credit";
  isControlAccount: boolean;
  controlType?: ControlAccountType;
  taxApplicable: boolean;
  postingLevel: "Summary" | "Detail";
  parentAccountId?: string;
  accountGroup: string;
  status: AccountStatus;
  currency: string;
  balance: number;
  department: string;
  description: string;
  effectiveDate: string;
  createdDate: string;
  lastTransaction: string;
  versionHistory: AccountVersion[];
}

export interface JournalLine {
  id: string;
  accountId: string;
  accountCode?: string;
  accountName?: string;
  description: string;
  debit: number;
  credit: number;
  currency?: string;
  fxRate?: number;
  functionalAmount?: number;
  costCenter?: string;
  department?: string;
}

export interface SRDJournalEntry {
  id: string;
  entryNo: string;
  entryType: JournalEntryType;
  ledgerType: LedgerType;
  status: JournalStatus;
  date: string;
  description: string;
  reference?: string;
  currency?: string;
  fiscalPeriod?: string;
  lines: JournalLine[];
  createdBy: string;
  createdDate?: string;
  submittedBy?: string;
  submittedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  postedBy?: string;
  postedDate?: string;
  reversedBy?: string;
  reversedDate?: string;
  reversalOf?: string;
  reversalEntryId?: string;
  recurringTemplateId?: string;
  attachments?: string[];
  // Legacy fields kept for mock data compat
  totalDebit?: number;
  totalCredit?: number;
  isBalanced?: boolean;
  periodId?: string;
}

export interface RecurringTemplate {
  id: string;
  name: string;
  description: string;
  entryType: JournalEntryType;
  frequency: "Monthly" | "Quarterly" | "Annually";
  lines: JournalLine[];
  nextDue: string;
  lastGenerated?: string;
  nextGenerationDate?: string;
  lastGeneratedDate?: string;
  isActive: boolean;
  createdBy: string;
}

export interface FiscalYear {
  id: string;
  year: number;
  startDate: string;
  endDate: string;
  periods: FiscalPeriod[];
  isCurrent: boolean;
  isClosed?: boolean;
}

export interface FiscalPeriod {
  id: string;
  fiscalYearId: string;
  periodNumber: number;
  name: string;
  startDate: string;
  endDate: string;
  state: PeriodState;
  isAdjusting: boolean;
  closedBy?: string;
  closedDate?: string;
  closingSteps: ClosingStep[];
}

export interface ClosingStep {
  id: string;
  stepNumber: number;
  name: string;
  description: string;
  status: ClosingStepStatus;
  completedBy?: string;
  completedDate?: string;
  notes?: string;
}

export interface FXRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rateType: FXRateType;
  rate: number;
  effectiveDate: string;
  source: string;
}

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  isFunctional: boolean;
  decimalPlaces: number;
}

export interface RevaluationEntry {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  currency: string;
  originalAmount: number;
  originalRate: number;
  revaluedAmount: number;
  closingRate: number;
  unrealizedGainLoss: number;
  periodId: string;
  date: string;
}

export interface Entity {
  id: string;
  code: string;
  name: string;
  functionalCurrency: string;
  country: string;
  status: "Active" | "Inactive";
}

export interface IntercompanyTransaction {
  id: string;
  date: string;
  fromEntityId: string;
  toEntityId: string;
  amount: number;
  currency: string;
  description: string;
  fromAccountId: string;
  toAccountId: string;
  status: "Pending" | "Posted" | "Eliminated";
  eliminationEntryId?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: "Create" | "Update" | "Delete" | "Approve" | "Reject" | "Post" | "Reverse" | "Close" | "Open";
  module: string;
  entityType: string;
  entityId: string;
  entityDescription: string;
  beforeValue?: string;
  afterValue?: string;
  ipAddress: string;
}

export interface Role {
  id: string;
  name: RoleName;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  module: string;
  actions: PermissionAction[];
}

export interface UserRole {
  id?: string;
  userId: string;
  userName: string;
  email: string;
  role: RoleName;
  department: string;
  assignedDate: string;
  isActive?: boolean;
}

export interface SubLedgerEntry {
  id: string;
  date: string;
  controlAccountId: string;
  controlType: ControlAccountType;
  reference: string;
  description: string;
  amount: number;
  type: "Debit" | "Credit";
  sourceModule: string;
  sourceDocumentId: string;
  entityName?: string;
  isMatched?: boolean;
}

export interface BudgetVersion {
  version: number;
  changedBy: string;
  changedDate: string;
  status: "Draft" | "Submitted" | "Approved" | "Revised";
  changes: string;
  approvedBy?: string;
  approvedDate?: string;
}
