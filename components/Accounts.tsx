import { useState, useMemo } from "react";
import { Search, Download, Plus, Building2, Users, Landmark, CreditCard, TrendingUp, TrendingDown, ChevronDown, MoreHorizontal, ArrowLeft, ArrowUpRight, ArrowDownLeft } from "lucide-react";

type AccountType = "Asset" | "Liability" | "Revenue" | "Expense" | "Equity";
type AccountSubType = "Cash" | "Bank" | "Receivable" | "Payable" | "Staff Loan" | "Petty Cash" | "Grant" | "Operating" | "Capital" | "Retained Earnings" | "Fixed Asset" | "Donor Fund";

interface Account {
  id: string;
  accountCode: string;
  accountName: string;
  type: AccountType;
  subType: AccountSubType;
  balance: number;
  currency: string;
  status: "Active" | "Inactive" | "Frozen";
  department: string;
  linkedEmployee?: string;
  createdDate: string;
  lastTransaction: string;
  description: string;
  autoCreated?: boolean;
  sourceReference?: string;
}

interface Transaction {
  id: string;
  date: string;
  referenceNo: string;
  description: string;
  type: "Debit" | "Credit";
  amount: number;
  runningBalance: number;
  performedBy: string;
  category: string;
}

const mockAccounts: Account[] = [
  { id: "1", accountCode: "1001-001", accountName: "Main Operating Account", type: "Asset", subType: "Bank", balance: 785550, currency: "USD", status: "Active", department: "Finance", createdDate: "Jan 01, 2024", lastTransaction: "Feb 28, 2026", description: "Primary bank account for operational transactions" },
  { id: "2", accountCode: "1001-002", accountName: "Payroll Account", type: "Asset", subType: "Bank", balance: 342000, currency: "USD", status: "Active", department: "Finance", createdDate: "Jan 01, 2024", lastTransaction: "Feb 25, 2026", description: "Dedicated payroll disbursement account" },
  { id: "3", accountCode: "1002-001", accountName: "Office Petty Cash", type: "Asset", subType: "Petty Cash", balance: 2500, currency: "GHS", status: "Active", department: "Operations", createdDate: "Jan 15, 2024", lastTransaction: "Feb 20, 2026", description: "Petty cash float for daily office expenses" },
  { id: "4", accountCode: "1002-002", accountName: "Field Office Petty Cash", type: "Asset", subType: "Petty Cash", balance: 1800, currency: "GHS", status: "Active", department: "Programs", createdDate: "Mar 01, 2024", lastTransaction: "Feb 18, 2026", description: "Petty cash for field office operations" },
  { id: "5", accountCode: "1100-001", accountName: "Grants Receivable - USAID", type: "Asset", subType: "Receivable", balance: 450000, currency: "USD", status: "Active", department: "Finance", createdDate: "Apr 01, 2024", lastTransaction: "Feb 15, 2026", description: "Receivable from USAID grant disbursements" },
  { id: "6", accountCode: "1100-002", accountName: "Grants Receivable - EU", type: "Asset", subType: "Receivable", balance: 280000, currency: "USD", status: "Active", department: "Finance", createdDate: "Jun 01, 2024", lastTransaction: "Jan 30, 2026", description: "Receivable from EU co-financing agreement" },
  { id: "7", accountCode: "1200-001", accountName: "Staff Loan - Kofi Annan", type: "Asset", subType: "Staff Loan", balance: 1000, currency: "USD", status: "Active", department: "Programs", linkedEmployee: "Kofi Annan", createdDate: "Nov 15, 2025", lastTransaction: "Feb 25, 2026", description: "Salary advance loan - Home repairs", autoCreated: true, sourceReference: "ADV-2025-002" },
  { id: "8", accountCode: "1200-002", accountName: "Staff Loan - Abena Osei", type: "Asset", subType: "Staff Loan", balance: 2250, currency: "USD", status: "Active", department: "Operations", linkedEmployee: "Abena Osei", createdDate: "Oct 20, 2025", lastTransaction: "Feb 25, 2026", description: "Salary advance loan - Education fees", autoCreated: true, sourceReference: "ADV-2025-003" },
  { id: "9", accountCode: "1200-003", accountName: "Staff Loan - Kwame Nkunim", type: "Asset", subType: "Staff Loan", balance: 0, currency: "USD", status: "Inactive", department: "Engineering", linkedEmployee: "Kwame Nkunim", createdDate: "Oct 05, 2025", lastTransaction: "Jan 05, 2026", description: "Salary advance loan - Emergency travel (Fully repaid)", autoCreated: true, sourceReference: "ADV-2025-004" },
  { id: "10", accountCode: "1200-004", accountName: "Staff Loan - Nelly Manu", type: "Asset", subType: "Staff Loan", balance: 3500, currency: "USD", status: "Active", department: "Finance", linkedEmployee: "Nelly Manu", createdDate: "Sep 10, 2025", lastTransaction: "Feb 25, 2026", description: "Salary advance loan - Personal project", autoCreated: true, sourceReference: "ADV-2025-005" },
  { id: "11", accountCode: "1200-005", accountName: "Staff Loan - Wangari Maathai", type: "Asset", subType: "Staff Loan", balance: 1500, currency: "USD", status: "Active", department: "Programs", linkedEmployee: "Wangari Maathai", createdDate: "Aug 22, 2025", lastTransaction: "Feb 25, 2026", description: "Salary advance loan - Vehicle repair", autoCreated: true, sourceReference: "ADV-2025-006" },
  { id: "12", accountCode: "1200-006", accountName: "Staff Loan - Desmond Tutu", type: "Asset", subType: "Staff Loan", balance: 4000, currency: "USD", status: "Active", department: "Programs", linkedEmployee: "Desmond Tutu", createdDate: "Jan 10, 2026", lastTransaction: "Feb 25, 2026", description: "Staff loan - Housing deposit", autoCreated: false, sourceReference: "LN-2026-001" },
  { id: "13", accountCode: "1200-007", accountName: "Staff Loan - Chinua Achebe", type: "Asset", subType: "Staff Loan", balance: 2000, currency: "USD", status: "Active", department: "Finance", linkedEmployee: "Chinua Achebe", createdDate: "Feb 01, 2026", lastTransaction: "Feb 25, 2026", description: "Staff loan - Medical expenses", autoCreated: false, sourceReference: "LN-2026-002" },
  { id: "14", accountCode: "2001-001", accountName: "Accounts Payable - Vendors", type: "Liability", subType: "Payable", balance: 125000, currency: "USD", status: "Active", department: "Procurement", createdDate: "Jan 01, 2024", lastTransaction: "Feb 27, 2026", description: "Trade payables to suppliers and vendors" },
  { id: "15", accountCode: "2001-002", accountName: "Accrued Expenses", type: "Liability", subType: "Payable", balance: 45000, currency: "USD", status: "Active", department: "Finance", createdDate: "Jan 01, 2024", lastTransaction: "Feb 28, 2026", description: "Accrued operating expenses not yet paid" },
  { id: "16", accountCode: "4001-001", accountName: "Grant Revenue - USAID", type: "Revenue", subType: "Grant", balance: 1200000, currency: "USD", status: "Active", department: "Finance", createdDate: "Jan 01, 2024", lastTransaction: "Feb 15, 2026", description: "Revenue recognized from USAID grants" },
  { id: "17", accountCode: "4001-002", accountName: "Grant Revenue - EU", type: "Revenue", subType: "Donor Fund", balance: 850000, currency: "USD", status: "Active", department: "Finance", createdDate: "Jan 01, 2024", lastTransaction: "Jan 30, 2026", description: "Revenue recognized from EU funding" },
  { id: "18", accountCode: "5001-001", accountName: "Salaries & Wages", type: "Expense", subType: "Operating", balance: 680000, currency: "USD", status: "Active", department: "HR", createdDate: "Jan 01, 2024", lastTransaction: "Feb 25, 2026", description: "Employee salary and wage expenses" },
  { id: "19", accountCode: "5002-001", accountName: "Office Rent", type: "Expense", subType: "Operating", balance: 185000, currency: "USD", status: "Active", department: "Operations", createdDate: "Jan 01, 2024", lastTransaction: "Feb 01, 2026", description: "Office and facility rental expenses" },
  { id: "20", accountCode: "5003-001", accountName: "Travel & Transportation", type: "Expense", subType: "Operating", balance: 95000, currency: "USD", status: "Active", department: "Operations", createdDate: "Jan 01, 2024", lastTransaction: "Feb 20, 2026", description: "Business travel and transportation costs" },
  { id: "21", accountCode: "1500-001", accountName: "Office Equipment", type: "Asset", subType: "Fixed Asset", balance: 320000, currency: "USD", status: "Active", department: "Operations", createdDate: "Jan 01, 2024", lastTransaction: "Dec 15, 2025", description: "Computers, furniture, and office equipment" },
  { id: "22", accountCode: "1500-002", accountName: "Motor Vehicles", type: "Asset", subType: "Fixed Asset", balance: 450000, currency: "USD", status: "Active", department: "Operations", createdDate: "Jan 01, 2024", lastTransaction: "Nov 20, 2025", description: "Company-owned motor vehicles" },
  { id: "23", accountCode: "3001-001", accountName: "Retained Surplus", type: "Equity", subType: "Retained Earnings", balance: 1250000, currency: "USD", status: "Active", department: "Finance", createdDate: "Jan 01, 2024", lastTransaction: "Dec 31, 2025", description: "Accumulated surplus from prior periods" },
  { id: "24", accountCode: "3002-001", accountName: "Capital Fund", type: "Equity", subType: "Capital", balance: 500000, currency: "USD", status: "Active", department: "Finance", createdDate: "Jan 01, 2024", lastTransaction: "Jan 01, 2025", description: "Initial and additional capital contributions" },
];

// Generate realistic transactions per account
function generateTransactions(account: Account): Transaction[] {
  const txMap: Record<string, Transaction[]> = {
    "1": [
      { id: "t1-1", date: "Feb 28, 2026", referenceNo: "JV-2026-0192", description: "February utilities payment", type: "Debit", amount: 4200, runningBalance: 785550, performedBy: "System", category: "Utilities" },
      { id: "t1-2", date: "Feb 27, 2026", referenceNo: "REC-2026-0078", description: "USAID Q1 grant disbursement received", type: "Credit", amount: 150000, runningBalance: 789750, performedBy: "Finance Dept", category: "Grant Receipt" },
      { id: "t1-3", date: "Feb 25, 2026", referenceNo: "PAY-2026-0145", description: "February payroll transfer to payroll account", type: "Debit", amount: 342000, runningBalance: 639750, performedBy: "Payroll System", category: "Payroll" },
      { id: "t1-4", date: "Feb 20, 2026", referenceNo: "PAY-2026-0138", description: "Vendor payment - IT Solutions Ltd", type: "Debit", amount: 18500, runningBalance: 981750, performedBy: "Ama Darko", category: "Vendor Payment" },
      { id: "t1-5", date: "Feb 18, 2026", referenceNo: "PAY-2026-0135", description: "Office supplies - Stationery World", type: "Debit", amount: 3250, runningBalance: 1000250, performedBy: "Kofi Mensah", category: "Office Supplies" },
      { id: "t1-6", date: "Feb 15, 2026", referenceNo: "REC-2026-0065", description: "EU co-financing tranche 2 received", type: "Credit", amount: 85000, runningBalance: 1003500, performedBy: "Finance Dept", category: "Grant Receipt" },
      { id: "t1-7", date: "Feb 10, 2026", referenceNo: "PAY-2026-0128", description: "Insurance premium - Q1 2026", type: "Debit", amount: 22400, runningBalance: 918500, performedBy: "System", category: "Insurance" },
      { id: "t1-8", date: "Feb 05, 2026", referenceNo: "PAY-2026-0120", description: "Office rent - February 2026", type: "Debit", amount: 18500, runningBalance: 940900, performedBy: "System", category: "Rent" },
      { id: "t1-9", date: "Feb 01, 2026", referenceNo: "REC-2026-0058", description: "Interest income - January", type: "Credit", amount: 2400, runningBalance: 959400, performedBy: "Bank", category: "Interest" },
      { id: "t1-10", date: "Jan 28, 2026", referenceNo: "PAY-2026-0112", description: "Travel advance - Field visit Kumasi", type: "Debit", amount: 5000, runningBalance: 957000, performedBy: "Richard Antwi", category: "Travel" },
    ],
    "2": [
      { id: "t2-1", date: "Feb 25, 2026", referenceNo: "PAY-2026-0146", description: "February 2026 salary disbursement", type: "Debit", amount: 285000, runningBalance: 342000, performedBy: "Payroll System", category: "Salary Payment" },
      { id: "t2-2", date: "Feb 25, 2026", referenceNo: "TRF-2026-0089", description: "Payroll funding from main operating account", type: "Credit", amount: 342000, runningBalance: 627000, performedBy: "Finance Dept", category: "Internal Transfer" },
      { id: "t2-3", date: "Feb 25, 2026", referenceNo: "PAY-2026-0147", description: "February statutory deductions remittance", type: "Debit", amount: 57000, runningBalance: 285000, performedBy: "Payroll System", category: "Statutory" },
      { id: "t2-4", date: "Jan 25, 2026", referenceNo: "PAY-2026-0098", description: "January 2026 salary disbursement", type: "Debit", amount: 280000, runningBalance: 0, performedBy: "Payroll System", category: "Salary Payment" },
      { id: "t2-5", date: "Jan 25, 2026", referenceNo: "TRF-2026-0045", description: "Payroll funding from main operating account", type: "Credit", amount: 335000, runningBalance: 280000, performedBy: "Finance Dept", category: "Internal Transfer" },
      { id: "t2-6", date: "Jan 25, 2026", referenceNo: "PAY-2026-0099", description: "January statutory deductions remittance", type: "Debit", amount: 55000, runningBalance: -55000, performedBy: "Payroll System", category: "Statutory" },
    ],
    "7": [
      { id: "t7-1", date: "Feb 25, 2026", referenceNo: "DED-2026-0025", description: "Monthly salary deduction - Feb 2026", type: "Credit", amount: 166.67, runningBalance: 1000, performedBy: "Payroll System", category: "Loan Repayment" },
      { id: "t7-2", date: "Jan 25, 2026", referenceNo: "DED-2026-0012", description: "Monthly salary deduction - Jan 2026", type: "Credit", amount: 166.67, runningBalance: 1166.67, performedBy: "Payroll System", category: "Loan Repayment" },
      { id: "t7-3", date: "Dec 25, 2025", referenceNo: "DED-2025-0198", description: "Monthly salary deduction - Dec 2025", type: "Credit", amount: 166.67, runningBalance: 1333.34, performedBy: "Payroll System", category: "Loan Repayment" },
      { id: "t7-4", date: "Nov 15, 2025", referenceNo: "ADV-2025-002", description: "Advance disbursement - Home repairs", type: "Debit", amount: 1000, runningBalance: 1500.01, performedBy: "Sarah Johnson", category: "Loan Disbursement" },
      { id: "t7-5", date: "Nov 15, 2025", referenceNo: "SYS-2025-0401", description: "Loan account auto-created from approved advance request", type: "Debit", amount: 0, runningBalance: 0, performedBy: "System", category: "Account Opening" },
    ],
    "8": [
      { id: "t8-1", date: "Feb 25, 2026", referenceNo: "DED-2026-0026", description: "Monthly salary deduction - Feb 2026", type: "Credit", amount: 250, runningBalance: 2250, performedBy: "Payroll System", category: "Loan Repayment" },
      { id: "t8-2", date: "Jan 25, 2026", referenceNo: "DED-2026-0013", description: "Monthly salary deduction - Jan 2026", type: "Credit", amount: 250, runningBalance: 2500, performedBy: "Payroll System", category: "Loan Repayment" },
      { id: "t8-3", date: "Dec 25, 2025", referenceNo: "DED-2025-0199", description: "Monthly salary deduction - Dec 2025", type: "Credit", amount: 250, runningBalance: 2750, performedBy: "Payroll System", category: "Loan Repayment" },
      { id: "t8-4", date: "Nov 25, 2025", referenceNo: "DED-2025-0185", description: "Monthly salary deduction - Nov 2025", type: "Credit", amount: 250, runningBalance: 3000, performedBy: "Payroll System", category: "Loan Repayment" },
      { id: "t8-5", date: "Oct 20, 2025", referenceNo: "ADV-2025-003", description: "Advance disbursement - Education fees", type: "Debit", amount: 3000, runningBalance: 3000, performedBy: "Michael Chen", category: "Loan Disbursement" },
      { id: "t8-6", date: "Oct 20, 2025", referenceNo: "SYS-2025-0388", description: "Loan account auto-created from approved advance request", type: "Debit", amount: 0, runningBalance: 0, performedBy: "System", category: "Account Opening" },
    ],
    "9": [
      { id: "t9-1", date: "Jan 05, 2026", referenceNo: "DED-2026-0003", description: "Final salary deduction - Loan fully repaid", type: "Credit", amount: 250, runningBalance: 0, performedBy: "Payroll System", category: "Loan Repayment" },
      { id: "t9-2", date: "Dec 25, 2025", referenceNo: "DED-2025-0200", description: "Monthly salary deduction - Dec 2025", type: "Credit", amount: 250, runningBalance: 250, performedBy: "Payroll System", category: "Loan Repayment" },
      { id: "t9-3", date: "Oct 05, 2025", referenceNo: "ADV-2025-004", description: "Advance disbursement - Emergency travel", type: "Debit", amount: 500, runningBalance: 500, performedBy: "Sarah Johnson", category: "Loan Disbursement" },
      { id: "t9-4", date: "Oct 05, 2025", referenceNo: "SYS-2025-0372", description: "Loan account auto-created from approved advance request", type: "Debit", amount: 0, runningBalance: 0, performedBy: "System", category: "Account Opening" },
    ],
    "12": [
      { id: "t12-1", date: "Feb 25, 2026", referenceNo: "DED-2026-0028", description: "Monthly salary deduction - Feb 2026", type: "Credit", amount: 500, runningBalance: 4000, performedBy: "Payroll System", category: "Loan Repayment" },
      { id: "t12-2", date: "Jan 25, 2026", referenceNo: "DED-2026-0015", description: "Monthly salary deduction - Jan 2026", type: "Credit", amount: 500, runningBalance: 4500, performedBy: "Payroll System", category: "Loan Repayment" },
      { id: "t12-3", date: "Jan 10, 2026", referenceNo: "LN-2026-001", description: "Loan disbursement - Housing deposit", type: "Debit", amount: 5000, runningBalance: 5000, performedBy: "Finance Dept", category: "Loan Disbursement" },
      { id: "t12-4", date: "Jan 10, 2026", referenceNo: "SYS-2026-0015", description: "Loan account created from approved loan request", type: "Debit", amount: 0, runningBalance: 0, performedBy: "System", category: "Account Opening" },
    ],
    "14": [
      { id: "t14-1", date: "Feb 27, 2026", referenceNo: "INV-2026-0089", description: "Invoice received - TechPro Solutions", type: "Credit", amount: 32000, runningBalance: 125000, performedBy: "Procurement", category: "Vendor Invoice" },
      { id: "t14-2", date: "Feb 25, 2026", referenceNo: "PAY-2026-0142", description: "Payment to GreenField Supplies", type: "Debit", amount: 15000, runningBalance: 93000, performedBy: "Ama Darko", category: "Vendor Payment" },
      { id: "t14-3", date: "Feb 20, 2026", referenceNo: "INV-2026-0082", description: "Invoice received - CleanCo Services", type: "Credit", amount: 8500, runningBalance: 108000, performedBy: "Procurement", category: "Vendor Invoice" },
      { id: "t14-4", date: "Feb 15, 2026", referenceNo: "PAY-2026-0130", description: "Payment to DataLink Corp", type: "Debit", amount: 25000, runningBalance: 99500, performedBy: "Finance Dept", category: "Vendor Payment" },
      { id: "t14-5", date: "Feb 10, 2026", referenceNo: "INV-2026-0075", description: "Invoice received - PrintMasters Ltd", type: "Credit", amount: 5200, runningBalance: 124500, performedBy: "Procurement", category: "Vendor Invoice" },
      { id: "t14-6", date: "Feb 05, 2026", referenceNo: "PAY-2026-0118", description: "Payment to Office Depot Ghana", type: "Debit", amount: 12800, runningBalance: 119300, performedBy: "Finance Dept", category: "Vendor Payment" },
      { id: "t14-7", date: "Jan 30, 2026", referenceNo: "INV-2026-0068", description: "Invoice received - CaterPro Events", type: "Credit", amount: 4600, runningBalance: 132100, performedBy: "Procurement", category: "Vendor Invoice" },
    ],
    "16": [
      { id: "t16-1", date: "Feb 15, 2026", referenceNo: "GRV-2026-0012", description: "USAID Grant revenue recognition - Q1 tranche", type: "Credit", amount: 150000, runningBalance: 1200000, performedBy: "Finance Dept", category: "Revenue Recognition" },
      { id: "t16-2", date: "Jan 15, 2026", referenceNo: "GRV-2026-0005", description: "USAID Year-end adjustment", type: "Debit", amount: 25000, runningBalance: 1050000, performedBy: "Finance Dept", category: "Adjustment" },
      { id: "t16-3", date: "Dec 15, 2025", referenceNo: "GRV-2025-0089", description: "USAID Grant revenue recognition - Q4 tranche", type: "Credit", amount: 200000, runningBalance: 1075000, performedBy: "Finance Dept", category: "Revenue Recognition" },
      { id: "t16-4", date: "Sep 15, 2025", referenceNo: "GRV-2025-0067", description: "USAID Grant revenue recognition - Q3 tranche", type: "Credit", amount: 175000, runningBalance: 875000, performedBy: "Finance Dept", category: "Revenue Recognition" },
    ],
    "18": [
      { id: "t18-1", date: "Feb 25, 2026", referenceNo: "PAY-2026-0146", description: "February 2026 gross salaries", type: "Debit", amount: 285000, runningBalance: 680000, performedBy: "Payroll System", category: "Salary Expense" },
      { id: "t18-2", date: "Feb 25, 2026", referenceNo: "PAY-2026-0147", description: "February 2026 employer contributions", type: "Debit", amount: 42000, runningBalance: 395000, performedBy: "Payroll System", category: "Benefits" },
      { id: "t18-3", date: "Feb 15, 2026", referenceNo: "BON-2026-0008", description: "Performance bonus - Q4 2025", type: "Debit", amount: 15000, runningBalance: 353000, performedBy: "HR Dept", category: "Bonus" },
      { id: "t18-4", date: "Jan 25, 2026", referenceNo: "PAY-2026-0098", description: "January 2026 gross salaries", type: "Debit", amount: 280000, runningBalance: 338000, performedBy: "Payroll System", category: "Salary Expense" },
      { id: "t18-5", date: "Jan 25, 2026", referenceNo: "PAY-2026-0099", description: "January 2026 employer contributions", type: "Debit", amount: 40000, runningBalance: 58000, performedBy: "Payroll System", category: "Benefits" },
      { id: "t18-6", date: "Jan 05, 2026", referenceNo: "ADJ-2026-0002", description: "December overtime accrual reversal", type: "Credit", amount: 18000, runningBalance: 18000, performedBy: "Finance Dept", category: "Adjustment" },
    ],
  };

  if (txMap[account.id]) return txMap[account.id];

  // Generate generic transactions for accounts without specific data
  const txCount = Math.floor(Math.random() * 4) + 3;
  const txs: Transaction[] = [];
  let bal = account.balance;
  const months = ["Feb", "Jan", "Dec", "Nov", "Oct", "Sep"];
  const years = ["2026", "2026", "2025", "2025", "2025", "2025"];
  for (let i = 0; i < txCount; i++) {
    const isDebit = Math.random() > 0.5;
    const amt = Math.round((Math.random() * account.balance * 0.15 + 1000));
    txs.push({
      id: `tg-${account.id}-${i}`,
      date: `${months[i % months.length]} ${String(Math.floor(Math.random() * 25) + 1).padStart(2, "0")}, ${years[i % years.length]}`,
      referenceNo: `TXN-${years[i % years.length]}-${String(Math.floor(Math.random() * 900) + 100).padStart(4, "0")}`,
      description: isDebit ? "General ledger posting" : "Receipt / transfer received",
      type: isDebit ? "Debit" : "Credit",
      amount: amt,
      runningBalance: bal,
      performedBy: ["System", "Finance Dept", "Ama Darko", "Kofi Mensah"][Math.floor(Math.random() * 4)],
      category: ["General", "Transfer", "Adjustment", "Posting"][Math.floor(Math.random() * 4)],
    });
    bal = isDebit ? bal + amt : bal - amt;
  }
  return txs;
}

function getTypeBadge(type: AccountType) {
  switch (type) {
    case "Asset": return "bg-blue-50 text-blue-600";
    case "Liability": return "bg-orange-50 text-orange-600";
    case "Revenue": return "bg-emerald-50 text-emerald-600";
    case "Expense": return "bg-red-50 text-red-600";
    case "Equity": return "bg-purple-50 text-purple-600";
    default: return "bg-slate-50 text-slate-600";
  }
}

function getTypeBadgeBorder(type: AccountType) {
  switch (type) {
    case "Asset": return "bg-blue-50 text-blue-600 border-blue-200";
    case "Liability": return "bg-orange-50 text-orange-600 border-orange-200";
    case "Revenue": return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "Expense": return "bg-red-50 text-red-600 border-red-200";
    case "Equity": return "bg-purple-50 text-purple-600 border-purple-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function getTypeIcon(type: AccountType) {
  switch (type) {
    case "Asset": return <TrendingUp size={14} />;
    case "Liability": return <TrendingDown size={14} />;
    case "Revenue": return <Landmark size={14} />;
    case "Expense": return <CreditCard size={14} />;
    case "Equity": return <Building2 size={14} />;
  }
}

function formatCurrency(amount: number, currency: string) {
  if (currency === "GHS") return `GHS ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatCurrencyShort(amount: number, currency: string) {
  if (currency === "GHS") return `GHS ${amount.toLocaleString()}`;
  return `$${amount.toLocaleString()}`;
}

export function Accounts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [subTypeFilter, setSubTypeFilter] = useState("All Sub-Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [viewItem, setViewItem] = useState<Account | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [txSearchQuery, setTxSearchQuery] = useState("");

  const filtered = mockAccounts.filter((item) => {
    const matchesSearch =
      item.accountCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.linkedEmployee || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "All Types" || item.type === typeFilter;
    const matchesSubType = subTypeFilter === "All Sub-Types" || item.subType === subTypeFilter;
    const matchesStatus = statusFilter === "All Statuses" || item.status === statusFilter;
    return matchesSearch && matchesType && matchesSubType && matchesStatus;
  });

  const totalAccounts = mockAccounts.length;
  const activeCount = mockAccounts.filter(a => a.status === "Active").length;
  const loanAccounts = mockAccounts.filter(a => a.subType === "Staff Loan").length;
  const totalAssets = mockAccounts.filter(a => a.type === "Asset").reduce((sum, a) => sum + (a.currency === "USD" ? a.balance : 0), 0);
  const totalLiabilities = mockAccounts.filter(a => a.type === "Liability").reduce((sum, a) => sum + a.balance, 0);
  const outstandingLoans = mockAccounts.filter(a => a.subType === "Staff Loan" && a.status === "Active").reduce((sum, a) => sum + a.balance, 0);

  const subTypes = ["All Sub-Types", "Cash", "Bank", "Receivable", "Payable", "Staff Loan", "Petty Cash", "Grant", "Operating", "Capital", "Retained Earnings", "Fixed Asset", "Donor Fund"];

  // Memoize transactions for the viewed item
  const viewTransactions = useMemo(() => {
    if (!viewItem) return [];
    return generateTransactions(viewItem);
  }, [viewItem]);

  const filteredTx = viewTransactions.filter(tx =>
    tx.referenceNo.toLowerCase().includes(txSearchQuery.toLowerCase()) ||
    tx.description.toLowerCase().includes(txSearchQuery.toLowerCase()) ||
    tx.performedBy.toLowerCase().includes(txSearchQuery.toLowerCase()) ||
    tx.category.toLowerCase().includes(txSearchQuery.toLowerCase())
  );

  // ========== VIEW ACCOUNT DETAILS SCREEN ==========
  if (viewItem) {
    const totalDebits = viewTransactions.filter(t => t.type === "Debit" && t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const totalCredits = viewTransactions.filter(t => t.type === "Credit").reduce((s, t) => s + t.amount, 0);

    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <button
            onClick={() => { setViewItem(null); setTxSearchQuery(""); }}
            className="flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-700 mb-3 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Accounts
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTypeBadge(viewItem.type)}`}>
                {getTypeIcon(viewItem.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold text-slate-900">{viewItem.accountName}</h1>
                  {viewItem.autoCreated && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] bg-amber-50 text-amber-600 border border-amber-200">Auto-Created</span>
                  )}
                </div>
                <p className="text-[12px] text-slate-500 font-mono">{viewItem.accountCode}</p>
              </div>
            </div>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[12px] ${
              viewItem.status === "Active" ? "bg-green-50 text-green-700" :
              viewItem.status === "Inactive" ? "bg-slate-50 text-slate-700" :
              "bg-red-50 text-red-700"
            }`}>
              {viewItem.status}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Account Info Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Current Balance</p>
                <p className="text-[18px] text-slate-900">{formatCurrencyShort(viewItem.balance, viewItem.currency)}</p>
                <p className="text-[10px] text-slate-400 mt-1">{viewItem.currency}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Debits</p>
                <p className="text-[18px] text-red-600">{formatCurrencyShort(totalDebits, viewItem.currency)}</p>
                <p className="text-[10px] text-slate-400 mt-1">{viewTransactions.filter(t => t.type === "Debit" && t.amount > 0).length} transactions</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Credits</p>
                <p className="text-[18px] text-emerald-600">{formatCurrencyShort(totalCredits, viewItem.currency)}</p>
                <p className="text-[10px] text-slate-400 mt-1">{viewTransactions.filter(t => t.type === "Credit").length} transactions</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Last Activity</p>
                <p className="text-[18px] text-slate-900">{viewItem.lastTransaction}</p>
                <p className="text-[10px] text-slate-400 mt-1">{viewTransactions.length} total transactions</p>
              </div>
            </div>

            {/* Account Details Section */}
            <div className="bg-white border border-slate-200 rounded-xl">
              <div className="px-5 py-3 border-b border-slate-100">
                <h3 className="text-[13px] text-slate-900">Account Information</h3>
              </div>
              <div className="px-5 py-4 grid grid-cols-4 gap-x-6 gap-y-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Type</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${getTypeBadgeBorder(viewItem.type)}`}>
                    {getTypeIcon(viewItem.type)} {viewItem.type}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Sub-Type</p>
                  <p className="text-[13px] text-slate-900">{viewItem.subType}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Department</p>
                  <p className="text-[13px] text-slate-900">{viewItem.department}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Created Date</p>
                  <p className="text-[13px] text-slate-900">{viewItem.createdDate}</p>
                </div>
                {viewItem.linkedEmployee && (
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Linked Employee</p>
                    <p className="text-[13px] text-purple-700 inline-flex items-center gap-1">
                      <Users size={13} /> {viewItem.linkedEmployee}
                    </p>
                  </div>
                )}
                {viewItem.sourceReference && (
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Source Reference</p>
                    <p className="text-[13px] text-blue-600 font-mono">{viewItem.sourceReference}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Description</p>
                  <p className="text-[13px] text-slate-700">{viewItem.description}</p>
                </div>
              </div>

              {viewItem.autoCreated && (
                <div className="mx-5 mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-[11px] text-amber-700">
                    This account was automatically created when advance request <span className="font-mono font-medium">{viewItem.sourceReference}</span> was approved. Repayments are deducted monthly from the employee's salary.
                  </p>
                </div>
              )}
              {viewItem.subType === "Staff Loan" && !viewItem.autoCreated && (
                <div className="mx-5 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-[11px] text-blue-700">
                    This staff loan account was created from loan request <span className="font-mono font-medium">{viewItem.sourceReference}</span>. Repayments are deducted monthly from the employee's salary.
                  </p>
                </div>
              )}
            </div>

            {/* Transaction History */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-[13px] text-slate-900">Transaction History</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={txSearchQuery}
                      onChange={(e) => setTxSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 w-60"
                    />
                  </div>
                  <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 bg-white">
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </button>
                </div>
              </div>
              <table className="w-full">
                <thead style={{ backgroundColor: "#0B01D0" }}>
                  <tr>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Date</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Reference No</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Description</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Category</th>
                    <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Type</th>
                    <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Amount</th>
                    <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Balance</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Performed By</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTx.map((tx) => (
                    <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="text-[12px] text-slate-600">{tx.date}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[12px] text-slate-900 font-mono">{tx.referenceNo}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[12px] text-slate-600">{tx.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[12px] text-slate-500">{tx.category}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xl text-[11px] ${
                          tx.type === "Debit" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                        }`}>
                          {tx.type === "Debit" ? <ArrowUpRight size={11} /> : <ArrowDownLeft size={11} />}
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className={`text-[12px] font-mono ${tx.type === "Debit" ? "text-red-600" : "text-emerald-600"}`}>
                          {tx.amount === 0 ? "--" : `${tx.type === "Debit" ? "" : ""}${formatCurrency(tx.amount, viewItem.currency)}`}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-[12px] font-mono text-slate-900">{formatCurrency(tx.runningBalance, viewItem.currency)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[12px] text-slate-500">{tx.performedBy}</p>
                      </td>
                    </tr>
                  ))}
                  {filteredTx.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <p className="text-[13px] text-slate-400">No transactions found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== MAIN ACCOUNTS LIST SCREEN ==========
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Accounts</h1>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-blue-50 text-blue-600 border-blue-200">{totalAccounts} Total</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-emerald-50 text-emerald-600 border-emerald-200">{activeCount} Active</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-purple-50 text-purple-600 border-purple-200">{loanAccounts} Loan Accounts</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 pt-4 pb-0 bg-white border-b border-slate-200">
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-[10px] text-blue-500 uppercase tracking-wider mb-1">Total Assets</p>
            <p className="text-[16px] text-blue-700">${totalAssets.toLocaleString()}</p>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
            <p className="text-[10px] text-orange-500 uppercase tracking-wider mb-1">Total Liabilities</p>
            <p className="text-[16px] text-orange-700">${totalLiabilities.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3">
            <p className="text-[10px] text-purple-500 uppercase tracking-wider mb-1">Outstanding Staff Loans</p>
            <p className="text-[16px] text-purple-700">${outstandingLoans.toLocaleString()}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            <p className="text-[10px] text-emerald-500 uppercase tracking-wider mb-1">Net Position</p>
            <p className="text-[16px] text-emerald-700">${(totalAssets - totalLiabilities).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by code, name, employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors bg-white min-w-[160px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Types</option>
              <option>Asset</option>
              <option>Liability</option>
              <option>Revenue</option>
              <option>Expense</option>
              <option>Equity</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={subTypeFilter}
              onChange={(e) => setSubTypeFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors bg-white min-w-[180px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subTypes.map(st => <option key={st}>{st}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors bg-white min-w-[160px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Frozen</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm text-white hover:opacity-90 transition-opacity flex items-center gap-2"
              style={{ backgroundColor: "#0B01D0" }}
            >
              <Plus className="w-4 h-4" />
              Add Account
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Account Code</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Account Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Type</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Sub-Type</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Linked Employee</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Balance</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Last Transaction</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900 font-mono">{item.accountCode}</p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] font-medium text-slate-900">{item.accountName}</p>
                    {item.autoCreated && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] bg-amber-50 text-amber-600 border border-amber-200">Auto</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xl text-[12px] ${getTypeBadge(item.type)}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{item.subType}</p>
                </td>
                <td className="px-4 py-4">
                  {item.linkedEmployee ? (
                    <p className="text-[12px] text-slate-600">{item.linkedEmployee}</p>
                  ) : (
                    <p className="text-[12px] text-slate-300">--</p>
                  )}
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] font-medium text-slate-900">{formatCurrencyShort(item.balance, item.currency)}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{item.lastTransaction}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${
                    item.status === "Active" ? "bg-green-50 text-green-700" :
                    item.status === "Inactive" ? "bg-slate-50 text-slate-700" :
                    "bg-red-50 text-red-700"
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-center relative">
                  <button
                    className="p-1 hover:bg-slate-100 rounded"
                    onClick={() => setShowActionMenu(showActionMenu === item.id ? null : item.id)}
                  >
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </button>
                  {showActionMenu === item.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                      <div className="absolute right-4 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                        <button
                          onClick={() => { setViewItem(item); setShowActionMenu(null); }}
                          className="w-full text-left px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50"
                        >
                          View Details
                        </button>
                        <button className="w-full text-left px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50">
                          Edit Account
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center">
                  <p className="text-[13px] text-slate-400">No accounts found matching your criteria</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
