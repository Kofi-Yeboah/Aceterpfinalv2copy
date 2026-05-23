import type { SegmentedAccountCode, JournalLine, FXRate, SRDJournalEntry } from "./types";

export function formatSegmentedCode(code: SegmentedAccountCode): string {
  return `${code.entity}-${code.businessUnit}-${code.department}-${code.account}-${code.costCenter}-${code.intercompany}`;
}

export function parseSegmentedCode(displayCode: string): SegmentedAccountCode | null {
  const parts = displayCode.split("-");
  if (parts.length !== 6) return null;
  return {
    entity: parts[0],
    businessUnit: parts[1],
    department: parts[2],
    account: parts[3],
    costCenter: parts[4],
    intercompany: parts[5],
  };
}

export function validateDoubleEntry(lines: JournalLine[]): { isBalanced: boolean; totalDebit: number; totalCredit: number; difference: number } {
  const totalDebit = lines.reduce((sum, line) => sum + line.debit, 0);
  const totalCredit = lines.reduce((sum, line) => sum + line.credit, 0);
  const difference = Math.abs(totalDebit - totalCredit);
  return {
    isBalanced: difference < 0.01,
    totalDebit,
    totalCredit,
    difference,
  };
}

export function calculateFXConversion(amount: number, rate: number): number {
  return Math.round(amount * rate * 100) / 100;
}

export function findFXRate(rates: FXRate[], from: string, to: string, type: "Spot" | "Average" | "Closing", date?: string): FXRate | undefined {
  return rates.find(r =>
    r.fromCurrency === from &&
    r.toCurrency === to &&
    r.rateType === type &&
    (!date || r.effectiveDate <= date)
  );
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  const symbols: Record<string, string> = { USD: "$", GHS: "₵", EUR: "€", GBP: "£", NGN: "₦", KES: "KSh" };
  const symbol = symbols[currency] || currency + " ";
  if (amount < 0) return `(${symbol}${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function filterByPeriod<T extends { date?: string }>(items: T[], startDate: string, endDate: string): T[] {
  return items.filter(item => {
    if (!item.date) return true;
    return item.date >= startDate && item.date <= endDate;
  });
}

export function generateEntryNo(_prefix: string, accountCode?: string, sequence?: number): string {
  const year = new Date().getFullYear();
  const acctCode = accountCode ?? String(Math.floor(Math.random() * 9000) + 1000);
  const seq = sequence ?? Math.floor(Math.random() * 90) + 10;
  return `${year}-${acctCode}-${String(seq).padStart(2, "0")}`;
}

export function getStatusTransitions(currentStatus: string): string[] {
  const transitions: Record<string, string[]> = {
    Draft: ["Submitted"],
    Submitted: ["Approved", "Draft"],
    Approved: ["Posted", "Draft"],
    Posted: ["Reversed"],
    Reversed: [],
    NotOpened: ["Open"],
    Open: ["SoftClose"],
    SoftClose: ["HardClose", "Open"],
    HardClose: [],
    PendingApproval: ["Approved", "Draft"],
  };
  return transitions[currentStatus] || [];
}

export function getJournalTotals(entry: SRDJournalEntry): { totalDebit: number; totalCredit: number; isBalanced: boolean } {
  const totalDebit = entry.lines.reduce((sum, l) => sum + l.debit, 0);
  const totalCredit = entry.lines.reduce((sum, l) => sum + l.credit, 0);
  return { totalDebit, totalCredit, isBalanced: Math.abs(totalDebit - totalCredit) < 0.01 };
}

export function getAgingBucket(daysOutstanding: number): string {
  if (daysOutstanding <= 30) return "Current";
  if (daysOutstanding <= 60) return "31-60 Days";
  if (daysOutstanding <= 90) return "61-90 Days";
  if (daysOutstanding <= 120) return "91-120 Days";
  return "120+ Days";
}

export function calculateVariance(budgeted: number, actual: number): { amount: number; percentage: number; status: "Favorable" | "Unfavorable" | "On Target" } {
  const amount = budgeted - actual;
  const percentage = budgeted !== 0 ? Math.round((amount / budgeted) * 10000) / 100 : 0;
  const status = Math.abs(percentage) <= 5 ? "On Target" : amount > 0 ? "Favorable" : "Unfavorable";
  return { amount, percentage, status };
}

export function calculateUnrealizedGainLoss(originalAmount: number, originalRate: number, closingRate: number): number {
  const originalFunctional = originalAmount * originalRate;
  const revaluedFunctional = originalAmount * closingRate;
  return Math.round((revaluedFunctional - originalFunctional) * 100) / 100;
}
