import type {
  SRDAccount, SRDJournalEntry, FiscalYear, FiscalPeriod, FXRate, CurrencyConfig,
  Entity, IntercompanyTransaction, AuditLogEntry, UserRole, RecurringTemplate,
  SubLedgerEntry, RevaluationEntry
} from "./types";
import { CLOSING_STEPS_TEMPLATE } from "./constants";

// ── Entities ──
export const mockEntities: Entity[] = [
  { id: "e1", code: "01", name: "ACET Ghana", functionalCurrency: "USD", country: "Ghana", status: "Active" },
  { id: "e2", code: "02", name: "ACET Nigeria", functionalCurrency: "USD", country: "Nigeria", status: "Active" },
  { id: "e3", code: "03", name: "ACET Kenya", functionalCurrency: "USD", country: "Kenya", status: "Inactive" },
];

// ── Currency Configs ──
export const mockCurrencies: CurrencyConfig[] = [
  { code: "USD", name: "US Dollar", symbol: "$", isFunctional: true, decimalPlaces: 2 },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", isFunctional: false, decimalPlaces: 2 },
  { code: "EUR", name: "Euro", symbol: "€", isFunctional: false, decimalPlaces: 2 },
  { code: "GBP", name: "British Pound", symbol: "£", isFunctional: false, decimalPlaces: 2 },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", isFunctional: false, decimalPlaces: 2 },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", isFunctional: false, decimalPlaces: 2 },
];

// ── FX Rates ──
export const mockFXRates: FXRate[] = [
  { id: "fx1", fromCurrency: "GHS", toCurrency: "USD", rateType: "Spot", rate: 0.0769, effectiveDate: "2026-03-01", source: "Central Bank" },
  { id: "fx2", fromCurrency: "GHS", toCurrency: "USD", rateType: "Closing", rate: 0.0765, effectiveDate: "2026-02-28", source: "Central Bank" },
  { id: "fx3", fromCurrency: "GHS", toCurrency: "USD", rateType: "Average", rate: 0.0770, effectiveDate: "2026-02-01", source: "Central Bank" },
  { id: "fx4", fromCurrency: "EUR", toCurrency: "USD", rateType: "Spot", rate: 1.0850, effectiveDate: "2026-03-01", source: "ECB" },
  { id: "fx5", fromCurrency: "EUR", toCurrency: "USD", rateType: "Closing", rate: 1.0820, effectiveDate: "2026-02-28", source: "ECB" },
  { id: "fx6", fromCurrency: "GBP", toCurrency: "USD", rateType: "Spot", rate: 1.2650, effectiveDate: "2026-03-01", source: "Bank of England" },
  { id: "fx7", fromCurrency: "GBP", toCurrency: "USD", rateType: "Closing", rate: 1.2620, effectiveDate: "2026-02-28", source: "Bank of England" },
  { id: "fx8", fromCurrency: "NGN", toCurrency: "USD", rateType: "Spot", rate: 0.000625, effectiveDate: "2026-03-01", source: "CBN" },
  { id: "fx9", fromCurrency: "KES", toCurrency: "USD", rateType: "Spot", rate: 0.0078, effectiveDate: "2026-03-01", source: "CBK" },
  { id: "fx10", fromCurrency: "GHS", toCurrency: "USD", rateType: "Spot", rate: 0.0772, effectiveDate: "2026-01-15", source: "Central Bank" },
  { id: "fx11", fromCurrency: "EUR", toCurrency: "USD", rateType: "Spot", rate: 1.0890, effectiveDate: "2026-01-15", source: "ECB" },
  { id: "fx12", fromCurrency: "GBP", toCurrency: "USD", rateType: "Spot", rate: 1.2700, effectiveDate: "2026-01-15", source: "Bank of England" },
];

// ── Chart of Accounts (SRD-compliant) ──
export const mockSRDAccounts: SRDAccount[] = [
  {
    id: "a1", code: { entity: "01", businessUnit: "03", department: "01", account: "1001", costCenter: "001", intercompany: "00" },
    displayCode: "01-03-01-1001-001-00", name: "Main Operating Account", type: "Asset", normalBalance: "Debit",
    isControlAccount: false, taxApplicable: false, postingLevel: "Detail", accountGroup: "Cash & Bank",
    status: "Active", currency: "USD", balance: 785550, department: "Finance", description: "Primary bank account for operational transactions",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2026-02-28", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a2", code: { entity: "01", businessUnit: "03", department: "01", account: "1002", costCenter: "001", intercompany: "00" },
    displayCode: "01-03-01-1002-001-00", name: "Payroll Account", type: "Asset", normalBalance: "Debit",
    isControlAccount: false, taxApplicable: false, postingLevel: "Detail", accountGroup: "Cash & Bank",
    status: "Active", currency: "USD", balance: 342000, department: "Finance", description: "Dedicated payroll disbursement account",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2026-02-25", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a3", code: { entity: "01", businessUnit: "02", department: "01", account: "1003", costCenter: "001", intercompany: "00" },
    displayCode: "01-02-01-1003-001-00", name: "Office Petty Cash", type: "Asset", normalBalance: "Debit",
    isControlAccount: false, taxApplicable: false, postingLevel: "Detail", accountGroup: "Cash & Bank",
    status: "Active", currency: "GHS", balance: 2500, department: "Operations", description: "Petty cash float for daily office expenses",
    effectiveDate: "2024-01-15", createdDate: "2024-01-15", lastTransaction: "2026-02-20", versionHistory: [
      { version: 1, changedBy: "Ama Darko", changedDate: "2024-01-15", changes: "Account created", effectiveDate: "2024-01-15" }
    ]
  },
  {
    id: "a4", code: { entity: "01", businessUnit: "03", department: "01", account: "1100", costCenter: "001", intercompany: "00" },
    displayCode: "01-03-01-1100-001-00", name: "Accounts Receivable Control", type: "Asset", normalBalance: "Debit",
    isControlAccount: true, controlType: "AR", taxApplicable: false, postingLevel: "Summary", accountGroup: "Receivables",
    status: "Active", currency: "USD", balance: 730000, department: "Finance", description: "Control account for all receivables - restricted posting",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2026-02-15", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" },
      { version: 2, changedBy: "Finance Director", changedDate: "2024-03-15", changes: "Marked as control account", effectiveDate: "2024-03-15" }
    ]
  },
  {
    id: "a5", code: { entity: "01", businessUnit: "03", department: "01", account: "1101", costCenter: "002", intercompany: "00" },
    displayCode: "01-03-01-1101-002-00", name: "Grants Receivable - USAID", type: "Asset", normalBalance: "Debit",
    isControlAccount: false, taxApplicable: false, postingLevel: "Detail", parentAccountId: "a4", accountGroup: "Receivables",
    status: "Active", currency: "USD", balance: 450000, department: "Finance", description: "Receivable from USAID grant disbursements",
    effectiveDate: "2024-04-01", createdDate: "2024-04-01", lastTransaction: "2026-02-15", versionHistory: [
      { version: 1, changedBy: "Sarah Johnson", changedDate: "2024-04-01", changes: "Account created", effectiveDate: "2024-04-01" }
    ]
  },
  {
    id: "a6", code: { entity: "01", businessUnit: "03", department: "01", account: "1102", costCenter: "002", intercompany: "00" },
    displayCode: "01-03-01-1102-002-00", name: "Grants Receivable - EU", type: "Asset", normalBalance: "Debit",
    isControlAccount: false, taxApplicable: false, postingLevel: "Detail", parentAccountId: "a4", accountGroup: "Receivables",
    status: "Active", currency: "EUR", balance: 280000, department: "Finance", description: "Receivable from EU co-financing agreement",
    effectiveDate: "2024-06-01", createdDate: "2024-06-01", lastTransaction: "2026-01-30", versionHistory: [
      { version: 1, changedBy: "Sarah Johnson", changedDate: "2024-06-01", changes: "Account created", effectiveDate: "2024-06-01" }
    ]
  },
  {
    id: "a7", code: { entity: "01", businessUnit: "02", department: "01", account: "1500", costCenter: "001", intercompany: "00" },
    displayCode: "01-02-01-1500-001-00", name: "Fixed Assets Control", type: "Asset", normalBalance: "Debit",
    isControlAccount: true, controlType: "FA", taxApplicable: false, postingLevel: "Summary", accountGroup: "Fixed Assets",
    status: "Active", currency: "USD", balance: 770000, department: "Operations", description: "Control account for all fixed assets",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2025-12-15", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a8", code: { entity: "01", businessUnit: "03", department: "01", account: "2001", costCenter: "001", intercompany: "00" },
    displayCode: "01-03-01-2001-001-00", name: "Accounts Payable Control", type: "Liability", normalBalance: "Credit",
    isControlAccount: true, controlType: "AP", taxApplicable: false, postingLevel: "Summary", accountGroup: "Payables",
    status: "Active", currency: "USD", balance: 170000, department: "Finance", description: "Control account for all payables - restricted posting",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2026-02-28", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a9", code: { entity: "01", businessUnit: "03", department: "01", account: "2100", costCenter: "001", intercompany: "00" },
    displayCode: "01-03-01-2100-001-00", name: "Accrued Expenses", type: "Liability", normalBalance: "Credit",
    isControlAccount: false, taxApplicable: false, postingLevel: "Detail", accountGroup: "Payables",
    status: "Active", currency: "USD", balance: 45000, department: "Finance", description: "Accrued operating expenses not yet paid",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2026-02-28", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a10", code: { entity: "01", businessUnit: "03", department: "01", account: "2200", costCenter: "001", intercompany: "00" },
    displayCode: "01-03-01-2200-001-00", name: "Deferred Revenue", type: "Liability", normalBalance: "Credit",
    isControlAccount: false, taxApplicable: false, postingLevel: "Detail", accountGroup: "Deferred Items",
    status: "Active", currency: "USD", balance: 125000, department: "Finance", description: "Grant funds received but not yet earned",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2026-01-31", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a11", code: { entity: "01", businessUnit: "03", department: "01", account: "3001", costCenter: "001", intercompany: "00" },
    displayCode: "01-03-01-3001-001-00", name: "Retained Surplus", type: "Equity", normalBalance: "Credit",
    isControlAccount: false, taxApplicable: false, postingLevel: "Detail", accountGroup: "Equity",
    status: "Active", currency: "USD", balance: 1250000, department: "Finance", description: "Accumulated surplus from prior periods",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2025-12-31", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a12", code: { entity: "01", businessUnit: "03", department: "01", account: "3002", costCenter: "001", intercompany: "00" },
    displayCode: "01-03-01-3002-001-00", name: "Capital Fund", type: "Equity", normalBalance: "Credit",
    isControlAccount: false, taxApplicable: false, postingLevel: "Detail", accountGroup: "Equity",
    status: "Active", currency: "USD", balance: 500000, department: "Finance", description: "Initial and additional capital contributions",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2025-01-01", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a13", code: { entity: "01", businessUnit: "03", department: "01", account: "4001", costCenter: "002", intercompany: "00" },
    displayCode: "01-03-01-4001-002-00", name: "Grant Revenue - USAID", type: "Revenue", normalBalance: "Credit",
    isControlAccount: false, taxApplicable: false, postingLevel: "Detail", accountGroup: "Grant Revenue",
    status: "Active", currency: "USD", balance: 1200000, department: "Finance", description: "Revenue recognized from USAID grants",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2026-02-15", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a14", code: { entity: "01", businessUnit: "03", department: "01", account: "4002", costCenter: "002", intercompany: "00" },
    displayCode: "01-03-01-4002-002-00", name: "Grant Revenue - EU", type: "Revenue", normalBalance: "Credit",
    isControlAccount: false, taxApplicable: false, postingLevel: "Detail", accountGroup: "Grant Revenue",
    status: "Active", currency: "USD", balance: 850000, department: "Finance", description: "Revenue recognized from EU funding",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2026-01-30", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a15", code: { entity: "01", businessUnit: "04", department: "01", account: "5001", costCenter: "001", intercompany: "00" },
    displayCode: "01-04-01-5001-001-00", name: "Salaries & Wages", type: "Expense", normalBalance: "Debit",
    isControlAccount: false, taxApplicable: true, postingLevel: "Detail", accountGroup: "Personnel Costs",
    status: "Active", currency: "USD", balance: 680000, department: "HR", description: "Employee salary and wage expenses",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2026-02-25", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a16", code: { entity: "01", businessUnit: "02", department: "01", account: "5002", costCenter: "001", intercompany: "00" },
    displayCode: "01-02-01-5002-001-00", name: "Office Rent", type: "Expense", normalBalance: "Debit",
    isControlAccount: false, taxApplicable: true, postingLevel: "Detail", accountGroup: "Operating Expenses",
    status: "Active", currency: "USD", balance: 185000, department: "Operations", description: "Office and facility rental expenses",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2026-02-01", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a17", code: { entity: "01", businessUnit: "02", department: "01", account: "5003", costCenter: "001", intercompany: "00" },
    displayCode: "01-02-01-5003-001-00", name: "Travel & Transportation", type: "Expense", normalBalance: "Debit",
    isControlAccount: false, taxApplicable: true, postingLevel: "Detail", accountGroup: "Operating Expenses",
    status: "Active", currency: "USD", balance: 95000, department: "Operations", description: "Business travel and transportation costs",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2026-02-20", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a18", code: { entity: "01", businessUnit: "03", department: "01", account: "5010", costCenter: "001", intercompany: "00" },
    displayCode: "01-03-01-5010-001-00", name: "Depreciation Expense", type: "Expense", normalBalance: "Debit",
    isControlAccount: false, taxApplicable: false, postingLevel: "Detail", accountGroup: "Non-Cash Expenses",
    status: "Active", currency: "USD", balance: 125000, department: "Finance", description: "Depreciation expense for all fixed assets",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2026-02-28", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a19", code: { entity: "01", businessUnit: "03", department: "01", account: "5020", costCenter: "001", intercompany: "00" },
    displayCode: "01-03-01-5020-001-00", name: "Foreign Exchange Gain/Loss", type: "Expense", normalBalance: "Debit",
    isControlAccount: false, taxApplicable: false, postingLevel: "Detail", accountGroup: "Non-Cash Expenses",
    status: "Active", currency: "USD", balance: -12500, department: "Finance", description: "Realized and unrealized FX gains and losses",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2026-02-28", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a20", code: { entity: "01", businessUnit: "04", department: "01", account: "5030", costCenter: "001", intercompany: "00" },
    displayCode: "01-04-01-5030-001-00", name: "Payroll Control", type: "Liability", normalBalance: "Credit",
    isControlAccount: true, controlType: "Payroll", taxApplicable: false, postingLevel: "Summary", accountGroup: "Payroll",
    status: "Active", currency: "USD", balance: 342000, department: "HR", description: "Control account for payroll liabilities",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2026-02-25", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a21", code: { entity: "01", businessUnit: "03", department: "01", account: "1001", costCenter: "001", intercompany: "02" },
    displayCode: "01-03-01-1001-001-02", name: "IC Receivable - ACET Nigeria", type: "Asset", normalBalance: "Debit",
    isControlAccount: false, taxApplicable: false, postingLevel: "Detail", accountGroup: "Intercompany",
    status: "Active", currency: "USD", balance: 85000, department: "Finance", description: "Intercompany receivable from ACET Nigeria",
    effectiveDate: "2024-06-01", createdDate: "2024-06-01", lastTransaction: "2026-01-15", versionHistory: [
      { version: 1, changedBy: "Finance Director", changedDate: "2024-06-01", changes: "Account created for IC tracking", effectiveDate: "2024-06-01" }
    ]
  },
  {
    id: "a22", code: { entity: "01", businessUnit: "03", department: "01", account: "4003", costCenter: "001", intercompany: "00" },
    displayCode: "01-03-01-4003-001-00", name: "Donation Revenue", type: "Revenue", normalBalance: "Credit",
    isControlAccount: false, taxApplicable: false, postingLevel: "Detail", accountGroup: "Other Revenue",
    status: "Active", currency: "USD", balance: 225000, department: "Finance", description: "Unrestricted donation income",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2026-02-10", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a23", code: { entity: "01", businessUnit: "03", department: "01", account: "1510", costCenter: "001", intercompany: "00" },
    displayCode: "01-03-01-1510-001-00", name: "Accumulated Depreciation", type: "Asset", normalBalance: "Credit",
    isControlAccount: false, taxApplicable: false, postingLevel: "Detail", parentAccountId: "a7", accountGroup: "Fixed Assets",
    status: "Active", currency: "USD", balance: -125000, department: "Finance", description: "Accumulated depreciation contra-asset",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2026-02-28", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
  {
    id: "a24", code: { entity: "01", businessUnit: "03", department: "01", account: "1200", costCenter: "001", intercompany: "00" },
    displayCode: "01-03-01-1200-001-00", name: "Prepaid Expenses", type: "Asset", normalBalance: "Debit",
    isControlAccount: false, taxApplicable: false, postingLevel: "Detail", accountGroup: "Prepaid & Advances",
    status: "Active", currency: "USD", balance: 45800, department: "Finance", description: "Prepaid insurance, rent, and other expenses",
    effectiveDate: "2024-01-01", createdDate: "2024-01-01", lastTransaction: "2026-02-01", versionHistory: [
      { version: 1, changedBy: "System", changedDate: "2024-01-01", changes: "Account created", effectiveDate: "2024-01-01" }
    ]
  },
];

// ── Journal Entries (SRD-compliant) ──
export const mockJournalEntries: SRDJournalEntry[] = [
  {
    id: "je1", entryNo: "JE-2026-0001", entryType: "Standard", ledgerType: "Primary", status: "Posted",
    date: "2026-02-25", description: "February 2026 payroll expense", reference: "PAY-FEB-2026",
    lines: [
      { id: "jl1", accountId: "a15", accountCode: "01-04-01-5001-001-00", accountName: "Salaries & Wages", description: "Gross salaries", debit: 285000, credit: 0, currency: "USD" },
      { id: "jl2", accountId: "a2", accountCode: "01-03-01-1002-001-00", accountName: "Payroll Account", description: "Payroll disbursement", debit: 0, credit: 285000, currency: "USD" },
    ],
    totalDebit: 285000, totalCredit: 285000, isBalanced: true,
    createdBy: "Payroll System", createdDate: "2026-02-25", postedBy: "Finance Manager", postedDate: "2026-02-25",
    attachments: [], periodId: "p2026-02"
  },
  {
    id: "je2", entryNo: "JE-2026-0002", entryType: "Standard", ledgerType: "Primary", status: "Posted",
    date: "2026-02-15", description: "USAID Q1 grant revenue recognition", reference: "GRV-2026-0012",
    lines: [
      { id: "jl3", accountId: "a5", accountCode: "01-03-01-1101-002-00", accountName: "Grants Receivable - USAID", description: "Q1 tranche receivable", debit: 150000, credit: 0, currency: "USD" },
      { id: "jl4", accountId: "a13", accountCode: "01-03-01-4001-002-00", accountName: "Grant Revenue - USAID", description: "Revenue recognition", debit: 0, credit: 150000, currency: "USD" },
    ],
    totalDebit: 150000, totalCredit: 150000, isBalanced: true,
    createdBy: "Sarah Johnson", createdDate: "2026-02-15", submittedBy: "Sarah Johnson", submittedDate: "2026-02-15",
    approvedBy: "Finance Manager", approvedDate: "2026-02-15", postedBy: "Finance Manager", postedDate: "2026-02-15",
    attachments: ["grant_agreement_q1.pdf"], periodId: "p2026-02"
  },
  {
    id: "je3", entryNo: "JE-2026-0003", entryType: "Adjusting", ledgerType: "Primary", status: "Posted",
    date: "2026-02-28", description: "February depreciation expense", reference: "DEP-FEB-2026",
    lines: [
      { id: "jl5", accountId: "a18", accountCode: "01-03-01-5010-001-00", accountName: "Depreciation Expense", description: "Monthly depreciation", debit: 10417, credit: 0, currency: "USD" },
      { id: "jl6", accountId: "a23", accountCode: "01-03-01-1510-001-00", accountName: "Accumulated Depreciation", description: "Accumulated depreciation", debit: 0, credit: 10417, currency: "USD" },
    ],
    totalDebit: 10417, totalCredit: 10417, isBalanced: true,
    createdBy: "System", createdDate: "2026-02-28", postedBy: "System", postedDate: "2026-02-28",
    attachments: [], periodId: "p2026-02"
  },
  {
    id: "je4", entryNo: "JE-2026-0004", entryType: "Revaluation", ledgerType: "Primary", status: "Posted",
    date: "2026-02-28", description: "Month-end FX revaluation - EUR receivables", reference: "REVAL-FEB-2026",
    lines: [
      { id: "jl7", accountId: "a6", accountCode: "01-03-01-1102-002-00", accountName: "Grants Receivable - EU", description: "Revaluation adjustment", debit: 3500, credit: 0, currency: "USD", fxRate: 1.0820, functionalAmount: 3500 },
      { id: "jl8", accountId: "a19", accountCode: "01-03-01-5020-001-00", accountName: "Foreign Exchange Gain/Loss", description: "Unrealized FX gain", debit: 0, credit: 3500, currency: "USD" },
    ],
    totalDebit: 3500, totalCredit: 3500, isBalanced: true,
    createdBy: "System", createdDate: "2026-02-28", postedBy: "Finance Manager", postedDate: "2026-02-28",
    attachments: [], periodId: "p2026-02"
  },
  {
    id: "je5", entryNo: "JE-2026-0005", entryType: "Standard", ledgerType: "Primary", status: "Approved",
    date: "2026-03-01", description: "March office rent payment", reference: "RENT-MAR-2026",
    lines: [
      { id: "jl9", accountId: "a16", accountCode: "01-02-01-5002-001-00", accountName: "Office Rent", description: "March 2026 rent", debit: 18500, credit: 0, currency: "USD" },
      { id: "jl10", accountId: "a1", accountCode: "01-03-01-1001-001-00", accountName: "Main Operating Account", description: "Rent payment", debit: 0, credit: 18500, currency: "USD" },
    ],
    totalDebit: 18500, totalCredit: 18500, isBalanced: true,
    createdBy: "Kofi Mensah", createdDate: "2026-03-01", submittedBy: "Kofi Mensah", submittedDate: "2026-03-01",
    approvedBy: "Finance Manager", approvedDate: "2026-03-01",
    attachments: ["lease_agreement.pdf"], periodId: "p2026-03"
  },
  {
    id: "je6", entryNo: "JE-2026-0006", entryType: "Standard", ledgerType: "Primary", status: "Submitted",
    date: "2026-03-02", description: "IT equipment purchase", reference: "PO-2026-0045",
    lines: [
      { id: "jl11", accountId: "a7", accountCode: "01-02-01-1500-001-00", accountName: "Fixed Assets Control", description: "Dell servers x3", debit: 45000, credit: 0, currency: "USD" },
      { id: "jl12", accountId: "a8", accountCode: "01-03-01-2001-001-00", accountName: "Accounts Payable Control", description: "Vendor: TechPro Solutions", debit: 0, credit: 45000, currency: "USD" },
    ],
    totalDebit: 45000, totalCredit: 45000, isBalanced: true,
    createdBy: "Mike Brown", createdDate: "2026-03-02", submittedBy: "Mike Brown", submittedDate: "2026-03-02",
    attachments: ["purchase_order_0045.pdf", "vendor_quote.pdf"], periodId: "p2026-03"
  },
  {
    id: "je7", entryNo: "JE-2026-0007", entryType: "Accrual", ledgerType: "Primary", status: "Draft",
    date: "2026-03-05", description: "Accrued consulting fees - Q1", reference: "ACR-2026-001",
    lines: [
      { id: "jl13", accountId: "a17", accountCode: "01-02-01-5003-001-00", accountName: "Travel & Transportation", description: "Consulting travel expenses", debit: 12000, credit: 0, currency: "USD" },
      { id: "jl14", accountId: "a9", accountCode: "01-03-01-2100-001-00", accountName: "Accrued Expenses", description: "Accrued liability", debit: 0, credit: 12000, currency: "USD" },
    ],
    totalDebit: 12000, totalCredit: 12000, isBalanced: true,
    createdBy: "Sarah Johnson", createdDate: "2026-03-05",
    attachments: [], periodId: "p2026-03"
  },
  {
    id: "je8", entryNo: "JE-2026-0008", entryType: "Elimination", ledgerType: "Consolidation", status: "Posted",
    date: "2026-02-28", description: "IC elimination - ACET Ghana / Nigeria", reference: "ELIM-FEB-2026-001",
    lines: [
      { id: "jl15", accountId: "a21", accountCode: "01-03-01-1001-001-02", accountName: "IC Receivable - ACET Nigeria", description: "Eliminate IC receivable", debit: 0, credit: 25000, currency: "USD" },
      { id: "jl16", accountId: "a8", accountCode: "01-03-01-2001-001-00", accountName: "Accounts Payable Control", description: "Eliminate IC payable", debit: 25000, credit: 0, currency: "USD" },
    ],
    totalDebit: 25000, totalCredit: 25000, isBalanced: true,
    createdBy: "System", createdDate: "2026-02-28", postedBy: "Finance Director", postedDate: "2026-02-28",
    attachments: [], periodId: "p2026-02"
  },
];

// ── Fiscal Years & Periods ──
function generateClosingSteps(periodId: string, completed: number = 0): import("./types").ClosingStep[] {
  return CLOSING_STEPS_TEMPLATE.map((step, i) => ({
    id: `${periodId}-step-${i + 1}`,
    stepNumber: step.stepNumber,
    name: step.name,
    description: step.description,
    status: i < completed ? "Completed" as const : "Pending" as const,
    completedBy: i < completed ? "Finance Manager" : undefined,
    completedDate: i < completed ? "2026-01-05" : undefined,
  }));
}

export const mockFiscalYears: FiscalYear[] = [
  {
    id: "fy2025", year: 2025, startDate: "2025-01-01", endDate: "2025-12-31", isCurrent: false,
    periods: [
      { id: "p2025-01", fiscalYearId: "fy2025", periodNumber: 1, name: "January 2025", startDate: "2025-01-01", endDate: "2025-01-31", state: "HardClose", isAdjusting: false, closedBy: "Finance Manager", closedDate: "2025-02-05", closingSteps: generateClosingSteps("p2025-01", 12) },
      { id: "p2025-02", fiscalYearId: "fy2025", periodNumber: 2, name: "February 2025", startDate: "2025-02-01", endDate: "2025-02-28", state: "HardClose", isAdjusting: false, closedBy: "Finance Manager", closedDate: "2025-03-05", closingSteps: generateClosingSteps("p2025-02", 12) },
      { id: "p2025-03", fiscalYearId: "fy2025", periodNumber: 3, name: "March 2025", startDate: "2025-03-01", endDate: "2025-03-31", state: "HardClose", isAdjusting: false, closedBy: "Finance Manager", closedDate: "2025-04-05", closingSteps: generateClosingSteps("p2025-03", 12) },
      { id: "p2025-04", fiscalYearId: "fy2025", periodNumber: 4, name: "April 2025", startDate: "2025-04-01", endDate: "2025-04-30", state: "HardClose", isAdjusting: false, closedBy: "Finance Manager", closedDate: "2025-05-05", closingSteps: generateClosingSteps("p2025-04", 12) },
      { id: "p2025-05", fiscalYearId: "fy2025", periodNumber: 5, name: "May 2025", startDate: "2025-05-01", endDate: "2025-05-31", state: "HardClose", isAdjusting: false, closedBy: "Finance Manager", closedDate: "2025-06-05", closingSteps: generateClosingSteps("p2025-05", 12) },
      { id: "p2025-06", fiscalYearId: "fy2025", periodNumber: 6, name: "June 2025", startDate: "2025-06-01", endDate: "2025-06-30", state: "HardClose", isAdjusting: false, closedBy: "Finance Manager", closedDate: "2025-07-05", closingSteps: generateClosingSteps("p2025-06", 12) },
      { id: "p2025-07", fiscalYearId: "fy2025", periodNumber: 7, name: "July 2025", startDate: "2025-07-01", endDate: "2025-07-31", state: "HardClose", isAdjusting: false, closedBy: "Finance Manager", closedDate: "2025-08-05", closingSteps: generateClosingSteps("p2025-07", 12) },
      { id: "p2025-08", fiscalYearId: "fy2025", periodNumber: 8, name: "August 2025", startDate: "2025-08-01", endDate: "2025-08-31", state: "HardClose", isAdjusting: false, closedBy: "Finance Manager", closedDate: "2025-09-05", closingSteps: generateClosingSteps("p2025-08", 12) },
      { id: "p2025-09", fiscalYearId: "fy2025", periodNumber: 9, name: "September 2025", startDate: "2025-09-01", endDate: "2025-09-30", state: "HardClose", isAdjusting: false, closedBy: "Finance Manager", closedDate: "2025-10-05", closingSteps: generateClosingSteps("p2025-09", 12) },
      { id: "p2025-10", fiscalYearId: "fy2025", periodNumber: 10, name: "October 2025", startDate: "2025-10-01", endDate: "2025-10-31", state: "HardClose", isAdjusting: false, closedBy: "Finance Manager", closedDate: "2025-11-05", closingSteps: generateClosingSteps("p2025-10", 12) },
      { id: "p2025-11", fiscalYearId: "fy2025", periodNumber: 11, name: "November 2025", startDate: "2025-11-01", endDate: "2025-11-30", state: "HardClose", isAdjusting: false, closedBy: "Finance Manager", closedDate: "2025-12-05", closingSteps: generateClosingSteps("p2025-11", 12) },
      { id: "p2025-12", fiscalYearId: "fy2025", periodNumber: 12, name: "December 2025", startDate: "2025-12-01", endDate: "2025-12-31", state: "HardClose", isAdjusting: false, closedBy: "Finance Director", closedDate: "2026-01-10", closingSteps: generateClosingSteps("p2025-12", 12) },
      { id: "p2025-13", fiscalYearId: "fy2025", periodNumber: 13, name: "Adjusting Period 2025", startDate: "2025-12-31", endDate: "2025-12-31", state: "HardClose", isAdjusting: true, closedBy: "Finance Director", closedDate: "2026-01-15", closingSteps: generateClosingSteps("p2025-13", 12) },
    ]
  },
  {
    id: "fy2026", year: 2026, startDate: "2026-01-01", endDate: "2026-12-31", isCurrent: true,
    periods: [
      { id: "p2026-01", fiscalYearId: "fy2026", periodNumber: 1, name: "January 2026", startDate: "2026-01-01", endDate: "2026-01-31", state: "HardClose", isAdjusting: false, closedBy: "Finance Manager", closedDate: "2026-02-05", closingSteps: generateClosingSteps("p2026-01", 12) },
      { id: "p2026-02", fiscalYearId: "fy2026", periodNumber: 2, name: "February 2026", startDate: "2026-02-01", endDate: "2026-02-28", state: "SoftClose", isAdjusting: false, closingSteps: generateClosingSteps("p2026-02", 8) },
      { id: "p2026-03", fiscalYearId: "fy2026", periodNumber: 3, name: "March 2026", startDate: "2026-03-01", endDate: "2026-03-31", state: "Open", isAdjusting: false, closingSteps: generateClosingSteps("p2026-03", 0) },
      { id: "p2026-04", fiscalYearId: "fy2026", periodNumber: 4, name: "April 2026", startDate: "2026-04-01", endDate: "2026-04-30", state: "NotOpened", isAdjusting: false, closingSteps: generateClosingSteps("p2026-04", 0) },
      { id: "p2026-05", fiscalYearId: "fy2026", periodNumber: 5, name: "May 2026", startDate: "2026-05-01", endDate: "2026-05-31", state: "NotOpened", isAdjusting: false, closingSteps: generateClosingSteps("p2026-05", 0) },
      { id: "p2026-06", fiscalYearId: "fy2026", periodNumber: 6, name: "June 2026", startDate: "2026-06-01", endDate: "2026-06-30", state: "NotOpened", isAdjusting: false, closingSteps: generateClosingSteps("p2026-06", 0) },
      { id: "p2026-07", fiscalYearId: "fy2026", periodNumber: 7, name: "July 2026", startDate: "2026-07-01", endDate: "2026-07-31", state: "NotOpened", isAdjusting: false, closingSteps: generateClosingSteps("p2026-07", 0) },
      { id: "p2026-08", fiscalYearId: "fy2026", periodNumber: 8, name: "August 2026", startDate: "2026-08-01", endDate: "2026-08-31", state: "NotOpened", isAdjusting: false, closingSteps: generateClosingSteps("p2026-08", 0) },
      { id: "p2026-09", fiscalYearId: "fy2026", periodNumber: 9, name: "September 2026", startDate: "2026-09-01", endDate: "2026-09-30", state: "NotOpened", isAdjusting: false, closingSteps: generateClosingSteps("p2026-09", 0) },
      { id: "p2026-10", fiscalYearId: "fy2026", periodNumber: 10, name: "October 2026", startDate: "2026-10-01", endDate: "2026-10-31", state: "NotOpened", isAdjusting: false, closingSteps: generateClosingSteps("p2026-10", 0) },
      { id: "p2026-11", fiscalYearId: "fy2026", periodNumber: 11, name: "November 2026", startDate: "2026-11-01", endDate: "2026-11-30", state: "NotOpened", isAdjusting: false, closingSteps: generateClosingSteps("p2026-11", 0) },
      { id: "p2026-12", fiscalYearId: "fy2026", periodNumber: 12, name: "December 2026", startDate: "2026-12-01", endDate: "2026-12-31", state: "NotOpened", isAdjusting: false, closingSteps: generateClosingSteps("p2026-12", 0) },
      { id: "p2026-13", fiscalYearId: "fy2026", periodNumber: 13, name: "Adjusting Period 2026", startDate: "2026-12-31", endDate: "2026-12-31", state: "NotOpened", isAdjusting: true, closingSteps: generateClosingSteps("p2026-13", 0) },
    ]
  },
];

// ── Recurring Templates ──
export const mockRecurringTemplates: RecurringTemplate[] = [
  {
    id: "rt1", name: "Monthly Depreciation", description: "Record monthly depreciation on all fixed assets", entryType: "Adjusting", frequency: "Monthly", nextDue: "2026-03-31", lastGenerated: "2026-02-28",
    lines: [
      { id: "rtl1", accountId: "a18", accountCode: "01-03-01-5010-001-00", accountName: "Depreciation Expense", description: "Monthly depreciation", debit: 10417, credit: 0, currency: "USD" },
      { id: "rtl2", accountId: "a23", accountCode: "01-03-01-1510-001-00", accountName: "Accumulated Depreciation", description: "Accumulated depreciation", debit: 0, credit: 10417, currency: "USD" },
    ],
    nextGenerationDate: "2026-03-31", lastGeneratedDate: "2026-02-28", isActive: true, createdBy: "Finance Manager"
  },
  {
    id: "rt2", name: "Monthly Office Rent", description: "Record monthly office rent expense and payment", entryType: "Recurring", frequency: "Monthly", nextDue: "2026-04-01", lastGenerated: "2026-03-01",
    lines: [
      { id: "rtl3", accountId: "a16", accountCode: "01-02-01-5002-001-00", accountName: "Office Rent", description: "Monthly rent", debit: 18500, credit: 0, currency: "USD" },
      { id: "rtl4", accountId: "a1", accountCode: "01-03-01-1001-001-00", accountName: "Main Operating Account", description: "Rent payment", debit: 0, credit: 18500, currency: "USD" },
    ],
    nextGenerationDate: "2026-04-01", lastGeneratedDate: "2026-03-01", isActive: true, createdBy: "Accountant"
  },
  {
    id: "rt3", name: "Quarterly Insurance Prepaid Amortization", description: "Amortize prepaid insurance on quarterly basis", entryType: "Adjusting", frequency: "Quarterly", nextDue: "2026-06-30", lastGenerated: "2026-03-31",
    lines: [
      { id: "rtl5", accountId: "a17", accountCode: "01-02-01-5003-001-00", accountName: "Travel & Transportation", description: "Insurance amortization", debit: 7500, credit: 0, currency: "USD" },
      { id: "rtl6", accountId: "a24", accountCode: "01-03-01-1200-001-00", accountName: "Prepaid Expenses", description: "Reduce prepaid", debit: 0, credit: 7500, currency: "USD" },
    ],
    nextGenerationDate: "2026-06-30", lastGeneratedDate: "2026-03-31", isActive: true, createdBy: "Finance Manager"
  },
];

// ── Intercompany Transactions ──
export const mockICTransactions: IntercompanyTransaction[] = [
  { id: "ic1", date: "2026-01-15", fromEntityId: "e1", toEntityId: "e2", amount: 25000, currency: "USD", description: "Shared services allocation Q4 2025", fromAccountId: "a21", toAccountId: "a8", status: "Eliminated", eliminationEntryId: "je8" },
  { id: "ic2", date: "2026-02-01", fromEntityId: "e1", toEntityId: "e2", amount: 15000, currency: "USD", description: "IT infrastructure cost sharing", fromAccountId: "a21", toAccountId: "a8", status: "Posted" },
  { id: "ic3", date: "2026-02-15", fromEntityId: "e2", toEntityId: "e1", amount: 8000, currency: "USD", description: "Regional program staff secondment", fromAccountId: "a21", toAccountId: "a8", status: "Posted" },
  { id: "ic4", date: "2026-03-01", fromEntityId: "e1", toEntityId: "e2", amount: 30000, currency: "USD", description: "Training program co-funding", fromAccountId: "a21", toAccountId: "a8", status: "Pending" },
];

// ── Audit Trail ──
export const mockAuditLog: AuditLogEntry[] = [
  { id: "al1", timestamp: "2026-03-05T14:32:00Z", userId: "u3", userName: "Sarah Johnson", action: "Create", module: "Journal Entries", entityType: "Journal Entry", entityId: "je7", entityDescription: "JE-2026-0007: Accrued consulting fees", ipAddress: "192.168.1.45" },
  { id: "al2", timestamp: "2026-03-02T10:15:00Z", userId: "u4", userName: "Mike Brown", action: "Create", module: "Journal Entries", entityType: "Journal Entry", entityId: "je6", entityDescription: "JE-2026-0006: IT equipment purchase", ipAddress: "192.168.1.52" },
  { id: "al3", timestamp: "2026-03-01T09:30:00Z", userId: "u2", userName: "Finance Manager", action: "Approve", module: "Journal Entries", entityType: "Journal Entry", entityId: "je5", entityDescription: "JE-2026-0005: March office rent", beforeValue: "Submitted", afterValue: "Approved", ipAddress: "192.168.1.10" },
  { id: "al4", timestamp: "2026-02-28T17:45:00Z", userId: "u1", userName: "Finance Director", action: "Post", module: "Journal Entries", entityType: "Journal Entry", entityId: "je4", entityDescription: "JE-2026-0004: FX revaluation", beforeValue: "Approved", afterValue: "Posted", ipAddress: "192.168.1.5" },
  { id: "al5", timestamp: "2026-02-28T17:00:00Z", userId: "u2", userName: "Finance Manager", action: "Close", module: "Period Management", entityType: "Fiscal Period", entityId: "p2026-02", entityDescription: "February 2026 - Soft Close initiated", beforeValue: "Open", afterValue: "SoftClose", ipAddress: "192.168.1.10" },
  { id: "al6", timestamp: "2026-02-25T08:00:00Z", userId: "u5", userName: "Payroll System", action: "Post", module: "Journal Entries", entityType: "Journal Entry", entityId: "je1", entityDescription: "JE-2026-0001: February payroll", beforeValue: "Approved", afterValue: "Posted", ipAddress: "10.0.0.1" },
  { id: "al7", timestamp: "2026-02-15T11:20:00Z", userId: "u3", userName: "Sarah Johnson", action: "Create", module: "Chart of Accounts", entityType: "Account", entityId: "a22", entityDescription: "01-03-01-4003-001-00: Donation Revenue", ipAddress: "192.168.1.45" },
  { id: "al8", timestamp: "2026-02-15T11:22:00Z", userId: "u2", userName: "Finance Manager", action: "Approve", module: "Chart of Accounts", entityType: "Account", entityId: "a22", entityDescription: "01-03-01-4003-001-00: Donation Revenue approved", beforeValue: "PendingApproval", afterValue: "Active", ipAddress: "192.168.1.10" },
  { id: "al9", timestamp: "2026-02-10T09:15:00Z", userId: "u2", userName: "Finance Manager", action: "Update", module: "Multi-Currency", entityType: "FX Rate", entityId: "fx1", entityDescription: "GHS/USD spot rate updated", beforeValue: "0.0772", afterValue: "0.0769", ipAddress: "192.168.1.10" },
  { id: "al10", timestamp: "2026-02-05T16:30:00Z", userId: "u2", userName: "Finance Manager", action: "Close", module: "Period Management", entityType: "Fiscal Period", entityId: "p2026-01", entityDescription: "January 2026 - Hard Close completed", beforeValue: "SoftClose", afterValue: "HardClose", ipAddress: "192.168.1.10" },
  { id: "al11", timestamp: "2026-01-15T10:00:00Z", userId: "u1", userName: "Finance Director", action: "Open", module: "Period Management", entityType: "Fiscal Period", entityId: "p2026-01", entityDescription: "January 2026 period opened", beforeValue: "NotOpened", afterValue: "Open", ipAddress: "192.168.1.5" },
  { id: "al12", timestamp: "2026-01-10T14:00:00Z", userId: "u1", userName: "Finance Director", action: "Create", module: "Period Management", entityType: "Fiscal Year", entityId: "fy2026", entityDescription: "FY2026 created with 13 periods", ipAddress: "192.168.1.5" },
];

// ── User Roles ──
export const mockUserRoles: UserRole[] = [
  { userId: "u1", userName: "Dr. Edward Brown", email: "ebrown@acet.org", role: "Finance Director", department: "Finance", assignedDate: "2023-01-01" },
  { userId: "u2", userName: "Ama Darko", email: "adarko@acet.org", role: "Finance Manager", department: "Finance", assignedDate: "2023-01-01" },
  { userId: "u3", userName: "Sarah Johnson", email: "sjohnson@acet.org", role: "Accountant", department: "Finance", assignedDate: "2023-06-01" },
  { userId: "u4", userName: "Mike Brown", email: "mbrown@acet.org", role: "Accountant", department: "Finance", assignedDate: "2024-01-15" },
  { userId: "u5", userName: "Kofi Mensah", email: "kmensah@acet.org", role: "AP Clerk", department: "Finance", assignedDate: "2024-03-01" },
  { userId: "u6", userName: "Abena Osei", email: "aosei@acet.org", role: "AR Clerk", department: "Finance", assignedDate: "2024-03-01" },
  { userId: "u7", userName: "Richard Antwi", email: "rantwi@acet.org", role: "Budget Analyst", department: "Finance", assignedDate: "2024-06-01" },
  { userId: "u8", userName: "Nelly Manu", email: "nmanu@acet.org", role: "Financial Analyst", department: "Finance", assignedDate: "2024-06-01" },
  { userId: "u9", userName: "External Auditor", email: "audit@kpmg.com", role: "Auditor", department: "External", assignedDate: "2025-01-01" },
];

// ── Sub-Ledger Entries (for Control Account Reconciliation) ──
export const mockSubLedgerEntries: SubLedgerEntry[] = [
  { id: "sl1", date: "2026-02-27", controlAccountId: "a8", controlType: "AP", reference: "INV-2026-0089", description: "TechPro Solutions - Server equipment", amount: 32000, type: "Credit", sourceModule: "Procurement", sourceDocumentId: "PO-2026-0042" },
  { id: "sl2", date: "2026-02-25", controlAccountId: "a8", controlType: "AP", reference: "PAY-2026-0142", description: "Payment to GreenField Supplies", amount: 15000, type: "Debit", sourceModule: "Payments", sourceDocumentId: "PV-2026-0088" },
  { id: "sl3", date: "2026-02-20", controlAccountId: "a8", controlType: "AP", reference: "INV-2026-0082", description: "CleanCo Services - Cleaning contract", amount: 8500, type: "Credit", sourceModule: "Procurement", sourceDocumentId: "PO-2026-0039" },
  { id: "sl4", date: "2026-02-15", controlAccountId: "a4", controlType: "AR", reference: "GRV-2026-0012", description: "USAID Q1 grant tranche", amount: 150000, type: "Debit", sourceModule: "Grants", sourceDocumentId: "GA-2024-001" },
  { id: "sl5", date: "2026-02-10", controlAccountId: "a4", controlType: "AR", reference: "REC-2026-0065", description: "EU co-financing receipt", amount: 85000, type: "Credit", sourceModule: "Banking", sourceDocumentId: "BR-2026-0034" },
  { id: "sl6", date: "2026-02-28", controlAccountId: "a7", controlType: "FA", reference: "FA-2026-0003", description: "Dell Server Rack capitalized", amount: 45000, type: "Debit", sourceModule: "Asset Management", sourceDocumentId: "AST-2026-003" },
  { id: "sl7", date: "2026-02-25", controlAccountId: "a20", controlType: "Payroll", reference: "PAY-FEB-2026", description: "February gross payroll", amount: 285000, type: "Debit", sourceModule: "Payroll", sourceDocumentId: "PR-2026-02" },
  { id: "sl8", date: "2026-02-25", controlAccountId: "a20", controlType: "Payroll", reference: "DED-FEB-2026", description: "February statutory deductions", amount: 57000, type: "Credit", sourceModule: "Payroll", sourceDocumentId: "PR-2026-02" },
];

// ── Revaluation Entries ──
export const mockRevaluationEntries: RevaluationEntry[] = [
  { id: "rv1", accountId: "a6", accountCode: "01-03-01-1102-002-00", accountName: "Grants Receivable - EU", currency: "EUR", originalAmount: 280000, originalRate: 1.0890, revaluedAmount: 303040, closingRate: 1.0820, unrealizedGainLoss: -1960, periodId: "p2026-02", date: "2026-02-28" },
  { id: "rv2", accountId: "a3", accountCode: "01-02-01-1003-001-00", accountName: "Office Petty Cash", currency: "GHS", originalAmount: 2500, originalRate: 0.0772, revaluedAmount: 192.25, closingRate: 0.0769, unrealizedGainLoss: -0.75, periodId: "p2026-02", date: "2026-02-28" },
];
