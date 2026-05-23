import type { LedgerType, JournalEntryType, JournalStatus, PeriodState, RoleName, PermissionAction, ClosingStep } from "./types";

export const LEDGER_TYPES: { value: LedgerType; label: string; description: string }[] = [
  { value: "Primary", label: "Primary Ledger", description: "Main operational ledger for day-to-day transactions" },
  { value: "Secondary", label: "Secondary Ledger", description: "Alternative accounting treatments (e.g., different GAAP)" },
  { value: "Statistical", label: "Statistical Ledger", description: "Non-monetary quantities and statistical data" },
  { value: "Budget", label: "Budget Ledger", description: "Budget allocations and forecasts" },
  { value: "Consolidation", label: "Consolidation Ledger", description: "Combined entity financial data" },
  { value: "Tax", label: "Tax Ledger", description: "Tax-specific adjustments and calculations" },
  { value: "Reporting", label: "Reporting Ledger", description: "Management and regulatory reporting adjustments" },
  { value: "Memo", label: "Memo Ledger", description: "Informational entries without financial impact" },
];

export const JOURNAL_ENTRY_TYPES: { value: JournalEntryType; label: string; description: string }[] = [
  { value: "Standard", label: "Standard", description: "Regular business transactions" },
  { value: "Adjusting", label: "Adjusting", description: "Period-end adjustments for accruals and deferrals" },
  { value: "Reversing", label: "Reversing", description: "Auto-reversal of prior period accruals" },
  { value: "Recurring", label: "Recurring", description: "Template-based periodic entries" },
  { value: "Accrual", label: "Accrual", description: "Recognition of earned revenue or incurred expenses" },
  { value: "Closing", label: "Closing", description: "Period-end closing of temporary accounts" },
  { value: "Opening", label: "Opening", description: "New period opening balances" },
  { value: "Revaluation", label: "Revaluation", description: "Foreign currency revaluation adjustments" },
  { value: "Elimination", label: "Elimination", description: "Intercompany elimination entries" },
  { value: "Reclassification", label: "Reclassification", description: "Account reclassification adjustments" },
];

export const JOURNAL_STATUSES: { value: JournalStatus; label: string; color: string }[] = [
  { value: "Draft", label: "Draft", color: "bg-slate-100 text-slate-700" },
  { value: "Submitted", label: "Submitted", color: "bg-blue-50 text-blue-700" },
  { value: "Approved", label: "Approved", color: "bg-amber-50 text-amber-700" },
  { value: "Posted", label: "Posted", color: "bg-green-50 text-green-700" },
  { value: "Reversed", label: "Reversed", color: "bg-red-50 text-red-700" },
];

export const PERIOD_STATES: { value: PeriodState; label: string; color: string }[] = [
  { value: "NotOpened", label: "Not Opened", color: "bg-slate-100 text-slate-600" },
  { value: "Open", label: "Open", color: "bg-green-50 text-green-700" },
  { value: "SoftClose", label: "Soft Close", color: "bg-amber-50 text-amber-700" },
  { value: "HardClose", label: "Hard Close", color: "bg-red-50 text-red-700" },
];

export const CLOSING_STEPS_TEMPLATE: Omit<ClosingStep, "id" | "status" | "completedBy" | "completedDate" | "notes">[] = [
  { stepNumber: 1, name: "Run Depreciation", description: "Calculate and post depreciation for all fixed assets" },
  { stepNumber: 2, name: "Accrue Expenses", description: "Record all accrued expenses not yet invoiced" },
  { stepNumber: 3, name: "Revalue Foreign Currency", description: "Revalue monetary items at closing exchange rates" },
  { stepNumber: 4, name: "Reconcile Sub-Ledgers", description: "Verify sub-ledger balances match GL control accounts" },
  { stepNumber: 5, name: "Generate Closing Entries", description: "Create closing journal entries for temporary accounts" },
  { stepNumber: 6, name: "Post to General Ledger", description: "Post all pending approved entries to the GL" },
  { stepNumber: 7, name: "Generate Trial Balance", description: "Produce trial balance and verify debits equal credits" },
  { stepNumber: 8, name: "Review Adjustments", description: "Review and approve any final adjusting entries" },
  { stepNumber: 9, name: "Close Revenue & Expense", description: "Transfer revenue and expense balances to income summary" },
  { stepNumber: 10, name: "Transfer to Retained Earnings", description: "Move net income/loss to retained earnings" },
  { stepNumber: 11, name: "Lock Period", description: "Prevent further postings to this period" },
  { stepNumber: 12, name: "Generate Reports", description: "Produce financial statements for the closed period" },
];

export const RBAC_ROLES: { name: RoleName; description: string }[] = [
  { name: "Finance Director", description: "Full access to all finance modules, approval authority for all transactions" },
  { name: "Finance Manager", description: "Manage day-to-day operations, approve transactions up to defined limits" },
  { name: "Accountant", description: "Create and post journal entries, manage accounts, run reports" },
  { name: "AP Clerk", description: "Process vendor invoices, manage payables, initiate payments" },
  { name: "AR Clerk", description: "Process customer invoices, manage receivables, apply receipts" },
  { name: "Budget Analyst", description: "Create and manage budgets, run variance reports" },
  { name: "Financial Analyst", description: "Read-only access to all data, create custom reports" },
  { name: "Auditor", description: "Read-only access to all modules and audit trail" },
];

export const PERMISSION_MATRIX: Record<RoleName, { module: string; actions: PermissionAction[] }[]> = {
  "Finance Director": [
    { module: "Chart of Accounts", actions: ["Create", "Read", "Update", "Delete", "Approve"] },
    { module: "General Ledger", actions: ["Create", "Read", "Update", "Delete", "Approve", "Post", "Reverse"] },
    { module: "Journal Entries", actions: ["Create", "Read", "Update", "Delete", "Approve", "Post", "Reverse"] },
    { module: "Period Management", actions: ["Create", "Read", "Update", "Approve"] },
    { module: "Multi-Currency", actions: ["Create", "Read", "Update", "Delete", "Approve"] },
    { module: "Budgeting", actions: ["Create", "Read", "Update", "Delete", "Approve"] },
    { module: "Financial Reports", actions: ["Read"] },
    { module: "Audit Trail", actions: ["Read"] },
    { module: "Access Control", actions: ["Create", "Read", "Update", "Delete"] },
    { module: "Intercompany", actions: ["Create", "Read", "Update", "Delete", "Approve", "Post"] },
  ],
  "Finance Manager": [
    { module: "Chart of Accounts", actions: ["Create", "Read", "Update", "Approve"] },
    { module: "General Ledger", actions: ["Create", "Read", "Update", "Approve", "Post"] },
    { module: "Journal Entries", actions: ["Create", "Read", "Update", "Approve", "Post"] },
    { module: "Period Management", actions: ["Create", "Read", "Update"] },
    { module: "Multi-Currency", actions: ["Create", "Read", "Update"] },
    { module: "Budgeting", actions: ["Create", "Read", "Update", "Approve"] },
    { module: "Financial Reports", actions: ["Read"] },
    { module: "Audit Trail", actions: ["Read"] },
    { module: "Intercompany", actions: ["Create", "Read", "Update", "Post"] },
  ],
  "Accountant": [
    { module: "Chart of Accounts", actions: ["Create", "Read", "Update"] },
    { module: "General Ledger", actions: ["Create", "Read", "Update", "Post"] },
    { module: "Journal Entries", actions: ["Create", "Read", "Update", "Post"] },
    { module: "Period Management", actions: ["Read"] },
    { module: "Multi-Currency", actions: ["Read", "Update"] },
    { module: "Budgeting", actions: ["Read"] },
    { module: "Financial Reports", actions: ["Read"] },
    { module: "Audit Trail", actions: ["Read"] },
    { module: "Intercompany", actions: ["Create", "Read", "Update"] },
  ],
  "AP Clerk": [
    { module: "Chart of Accounts", actions: ["Read"] },
    { module: "General Ledger", actions: ["Read"] },
    { module: "Journal Entries", actions: ["Create", "Read"] },
    { module: "Period Management", actions: ["Read"] },
    { module: "Multi-Currency", actions: ["Read"] },
    { module: "Budgeting", actions: ["Read"] },
    { module: "Financial Reports", actions: ["Read"] },
    { module: "Audit Trail", actions: ["Read"] },
  ],
  "AR Clerk": [
    { module: "Chart of Accounts", actions: ["Read"] },
    { module: "General Ledger", actions: ["Read"] },
    { module: "Journal Entries", actions: ["Create", "Read"] },
    { module: "Period Management", actions: ["Read"] },
    { module: "Multi-Currency", actions: ["Read"] },
    { module: "Budgeting", actions: ["Read"] },
    { module: "Financial Reports", actions: ["Read"] },
    { module: "Audit Trail", actions: ["Read"] },
  ],
  "Budget Analyst": [
    { module: "Chart of Accounts", actions: ["Read"] },
    { module: "General Ledger", actions: ["Read"] },
    { module: "Journal Entries", actions: ["Read"] },
    { module: "Period Management", actions: ["Read"] },
    { module: "Multi-Currency", actions: ["Read"] },
    { module: "Budgeting", actions: ["Create", "Read", "Update"] },
    { module: "Financial Reports", actions: ["Read"] },
    { module: "Audit Trail", actions: ["Read"] },
  ],
  "Financial Analyst": [
    { module: "Chart of Accounts", actions: ["Read"] },
    { module: "General Ledger", actions: ["Read"] },
    { module: "Journal Entries", actions: ["Read"] },
    { module: "Period Management", actions: ["Read"] },
    { module: "Multi-Currency", actions: ["Read"] },
    { module: "Budgeting", actions: ["Read"] },
    { module: "Financial Reports", actions: ["Read"] },
    { module: "Audit Trail", actions: ["Read"] },
  ],
  "Auditor": [
    { module: "Chart of Accounts", actions: ["Read"] },
    { module: "General Ledger", actions: ["Read"] },
    { module: "Journal Entries", actions: ["Read"] },
    { module: "Period Management", actions: ["Read"] },
    { module: "Multi-Currency", actions: ["Read"] },
    { module: "Budgeting", actions: ["Read"] },
    { module: "Financial Reports", actions: ["Read"] },
    { module: "Audit Trail", actions: ["Read"] },
    { module: "Access Control", actions: ["Read"] },
  ],
};

export const ACCOUNT_SEGMENTS = {
  entity: { label: "Entity", length: 2, description: "Legal entity code" },
  businessUnit: { label: "Business Unit", length: 2, description: "Business unit/division" },
  department: { label: "Department", length: 2, description: "Department code" },
  account: { label: "Account", length: 4, description: "Natural account number" },
  costCenter: { label: "Cost Center", length: 3, description: "Cost center/project" },
  intercompany: { label: "Intercompany", length: 2, description: "Intercompany partner code" },
};

export const ENTITY_CODES = [
  { code: "01", name: "ACET Ghana" },
  { code: "02", name: "ACET Nigeria" },
  { code: "03", name: "ACET Kenya" },
];

export const BUSINESS_UNIT_CODES = [
  { code: "01", name: "Programs" },
  { code: "02", name: "Operations" },
  { code: "03", name: "Finance" },
  { code: "04", name: "HR" },
];

export const DEPARTMENT_CODES = [
  { code: "01", name: "Executive Office" },
  { code: "02", name: "Research" },
  { code: "03", name: "Policy" },
  { code: "04", name: "Communications" },
  { code: "05", name: "IT" },
  { code: "06", name: "Procurement" },
  { code: "07", name: "Field Operations" },
];

export const COST_CENTER_CODES = [
  { code: "001", name: "General Administration" },
  { code: "002", name: "Rural Health Program" },
  { code: "003", name: "Youth Empowerment" },
  { code: "004", name: "Agricultural Livelihoods" },
  { code: "005", name: "Education Quality" },
  { code: "006", name: "Water & Sanitation" },
  { code: "007", name: "Climate Resilience" },
];

export const CURRENCIES: { code: string; name: string; symbol: string }[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
];
