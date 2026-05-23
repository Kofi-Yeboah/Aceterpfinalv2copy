import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown, ChevronRight, Calendar, ArrowLeft } from "lucide-react";

type Period = "Q1 2024" | "Q2 2024" | "Q3 2024" | "Q4 2024";
type Format = "Summary View" | "Detailed View";
type SubReport = "list" | "trial-balance" | "income-statement" | "balance-sheet" | "closing-balance";

// ── Data ──

interface BalanceSheetData {
  currentAssets: { cash: number; accountsReceivable: number; prepaidExpenses: number };
  fixedAssets: { propertyAndEquipment: number; accumulatedDepreciation: number };
  currentLiabilities: { accountsPayable: number; accruedExpenses: number; deferredRevenue: number };
  equity: { netAssets: number; retainedEarnings: number };
}

interface IncomeStatementData {
  revenue: { grants: number; donations: number; programFees: number; other?: number };
  expenses: { programServices: number; administration: number; fundraising: number; depreciation?: number; utilities?: number };
}

const balanceSheetData: Record<Period, BalanceSheetData> = {
  "Q1 2024": { currentAssets: { cash: 650000, accountsReceivable: 98000, prepaidExpenses: 32000 }, fixedAssets: { propertyAndEquipment: 425000, accumulatedDepreciation: 95000 }, currentLiabilities: { accountsPayable: 42000, accruedExpenses: 28000, deferredRevenue: 18000 }, equity: { netAssets: 850000, retainedEarnings: 172000 } },
  "Q2 2024": { currentAssets: { cash: 720000, accountsReceivable: 110000, prepaidExpenses: 38500 }, fixedAssets: { propertyAndEquipment: 425000, accumulatedDepreciation: 105000 }, currentLiabilities: { accountsPayable: 45000, accruedExpenses: 31000, deferredRevenue: 20000 }, equity: { netAssets: 900000, retainedEarnings: 192500 } },
  "Q3 2024": { currentAssets: { cash: 752000, accountsReceivable: 118000, prepaidExpenses: 42000 }, fixedAssets: { propertyAndEquipment: 425000, accumulatedDepreciation: 115000 }, currentLiabilities: { accountsPayable: 46500, accruedExpenses: 33000, deferredRevenue: 21000 }, equity: { netAssets: 925000, retainedEarnings: 196500 } },
  "Q4 2024": { currentAssets: { cash: 785000, accountsReceivable: 125000, prepaidExpenses: 45800 }, fixedAssets: { propertyAndEquipment: 425000, accumulatedDepreciation: 125000 }, currentLiabilities: { accountsPayable: 48250, accruedExpenses: 35600, deferredRevenue: 22150 }, equity: { netAssets: 950000, retainedEarnings: 199800 } },
};

const incomeStatementData: Record<Period, IncomeStatementData> = {
  "Q1 2024": { revenue: { grants: 450000, donations: 185000, programFees: 95000, other: 25000 }, expenses: { programServices: 380000, administration: 125000, fundraising: 85000, depreciation: 10000, utilities: 15000 } },
  "Q2 2024": { revenue: { grants: 485000, donations: 205000, programFees: 102000, other: 28000 }, expenses: { programServices: 410000, administration: 135000, fundraising: 92000, depreciation: 10000, utilities: 16000 } },
  "Q3 2024": { revenue: { grants: 510000, donations: 215000, programFees: 108000, other: 30000 }, expenses: { programServices: 435000, administration: 142000, fundraising: 98000, depreciation: 10000, utilities: 17000 } },
  "Q4 2024": { revenue: { grants: 525000, donations: 225000, programFees: 115000, other: 32000 }, expenses: { programServices: 455000, administration: 148000, fundraising: 102000, depreciation: 10000, utilities: 18000 } },
};

// Trial balance data derived from balance sheet + income statement
interface TrialBalanceRow { account: string; accountNo: string; debit: number; credit: number }

function getTrialBalanceData(period: Period): TrialBalanceRow[] {
  const bs = balanceSheetData[period];
  const is = incomeStatementData[period];
  return [
    { account: "Cash and Cash Equivalents", accountNo: "1000", debit: bs.currentAssets.cash, credit: 0 },
    { account: "Accounts Receivable", accountNo: "1100", debit: bs.currentAssets.accountsReceivable, credit: 0 },
    { account: "Prepaid Expenses", accountNo: "1200", debit: bs.currentAssets.prepaidExpenses, credit: 0 },
    { account: "Property and Equipment", accountNo: "1500", debit: bs.fixedAssets.propertyAndEquipment, credit: 0 },
    { account: "Accumulated Depreciation", accountNo: "1510", debit: 0, credit: bs.fixedAssets.accumulatedDepreciation },
    { account: "Accounts Payable", accountNo: "2000", debit: 0, credit: bs.currentLiabilities.accountsPayable },
    { account: "Accrued Expenses", accountNo: "2100", debit: 0, credit: bs.currentLiabilities.accruedExpenses },
    { account: "Deferred Revenue", accountNo: "2200", debit: 0, credit: bs.currentLiabilities.deferredRevenue },
    { account: "Net Assets", accountNo: "3000", debit: 0, credit: bs.equity.netAssets },
    { account: "Retained Earnings", accountNo: "3100", debit: 0, credit: bs.equity.retainedEarnings },
    { account: "Grant Revenue", accountNo: "4000", debit: 0, credit: is.revenue.grants },
    { account: "Donation Revenue", accountNo: "4100", debit: 0, credit: is.revenue.donations },
    { account: "Program Service Fees", accountNo: "4200", debit: 0, credit: is.revenue.programFees },
    { account: "Other Revenue", accountNo: "4300", debit: 0, credit: is.revenue.other || 0 },
    { account: "Program Services Expense", accountNo: "5000", debit: is.expenses.programServices, credit: 0 },
    { account: "Administration Expense", accountNo: "5100", debit: is.expenses.administration, credit: 0 },
    { account: "Fundraising Expense", accountNo: "5200", debit: is.expenses.fundraising, credit: 0 },
    { account: "Depreciation Expense", accountNo: "5300", debit: is.expenses.depreciation || 0, credit: 0 },
    { account: "Utilities Expense", accountNo: "5400", debit: is.expenses.utilities || 0, credit: 0 },
  ];
}

// Closing balance data
interface ClosingBalanceRow { account: string; accountNo: string; preClosingBalance: number; closingEntry: number; postClosingBalance: number }

function getClosingBalanceData(period: Period): ClosingBalanceRow[] {
  const tb = getTrialBalanceData(period);
  const is = incomeStatementData[period];
  const totalRevenue = is.revenue.grants + is.revenue.donations + is.revenue.programFees + (is.revenue.other || 0);
  const totalExpenses = is.expenses.programServices + is.expenses.administration + is.expenses.fundraising + (is.expenses.depreciation || 0) + (is.expenses.utilities || 0);
  const netIncome = totalRevenue - totalExpenses;

  return [
    // Permanent accounts carry forward
    ...tb.filter(r => parseInt(r.accountNo) < 4000).map(r => ({
      account: r.account,
      accountNo: r.accountNo,
      preClosingBalance: r.debit - r.credit,
      closingEntry: r.accountNo === "3100" ? -netIncome : 0, // Net income transferred to retained earnings
      postClosingBalance: r.accountNo === "3100" ? (r.debit - r.credit) - netIncome : r.debit - r.credit,
    })),
    // Revenue accounts close to zero
    ...tb.filter(r => r.accountNo.startsWith("4")).map(r => ({
      account: r.account,
      accountNo: r.accountNo,
      preClosingBalance: -(r.credit),
      closingEntry: r.credit,
      postClosingBalance: 0,
    })),
    // Expense accounts close to zero
    ...tb.filter(r => r.accountNo.startsWith("5")).map(r => ({
      account: r.account,
      accountNo: r.accountNo,
      preClosingBalance: r.debit,
      closingEntry: -r.debit,
      postClosingBalance: 0,
    })),
  ];
}

// ── Helpers ──
const fmt = (n: number) => n < 0 ? `($${Math.abs(n).toLocaleString()})` : `$${n.toLocaleString()}`;

const periods: Period[] = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"];
const formats: Format[] = ["Summary View", "Detailed View"];

const getPeriodEndDate = (period: Period) => ({
  "Q1 2024": "March 31, 2024", "Q2 2024": "June 30, 2024", "Q3 2024": "September 30, 2024", "Q4 2024": "December 31, 2024",
}[period]);

const subReportMeta = [
  { id: "trial-balance" as const, name: "Trial Balance", description: "Summary of all account balances showing debit and credit totals for the period" },
  { id: "income-statement" as const, name: "Income Statement", description: "Revenue and expense summary showing net income for the period" },
  { id: "balance-sheet" as const, name: "Balance Sheet", description: "Statement of assets, liabilities and equity as at period end" },
  { id: "closing-balance" as const, name: "Get and Post Closing Balance", description: "Transfers revenue and expense balances to retained earnings for the next accounting year" },
];

export function FinancialStatements() {
  const [activeReport, setActiveReport] = useState<SubReport>("list");
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("Q4 2024");
  const [selectedFormat, setSelectedFormat] = useState<Format>("Summary View");

  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const [formatDropdownOpen, setFormatDropdownOpen] = useState(false);
  const periodRef = useRef<HTMLDivElement>(null);
  const formatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (periodRef.current && !periodRef.current.contains(e.target as Node)) setPeriodDropdownOpen(false);
      if (formatRef.current && !formatRef.current.contains(e.target as Node)) setFormatDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isInSubReport = activeReport !== "list";
  const getTitle = () => subReportMeta.find(r => r.id === activeReport)?.name || "Financial Statements";

  // ── List view ──
  function renderList() {
    return (
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#0B01D0" }}>
              <th className="text-left text-white text-sm px-6 py-3">Report Name</th>
              <th className="text-left text-white text-sm px-6 py-3">Description</th>
              <th className="text-left text-white text-sm px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {subReportMeta.map((r, i) => (
              <tr key={r.id} className={`border-b border-slate-100 cursor-pointer hover:bg-blue-50 transition-colors ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
                onClick={() => setActiveReport(r.id)}>
                <td className="px-6 py-4 text-sm text-blue-600 font-medium">{r.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{r.description}</td>
                <td className="px-6 py-4"><ChevronRight className="w-4 h-4 text-slate-400" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ── Filters bar for sub-reports ──
  function renderFilters() {
    return (
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center gap-3">
        <div className="relative" ref={periodRef}>
          <button onClick={() => { setPeriodDropdownOpen(!periodDropdownOpen); setFormatDropdownOpen(false); }}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
            <Calendar className="w-4 h-4" /><span>{selectedPeriod}</span><ChevronDown className="w-4 h-4" />
          </button>
          {periodDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-10">
              {periods.map(p => (
                <button key={p} onClick={() => { setSelectedPeriod(p); setPeriodDropdownOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors first:rounded-t-lg last:rounded-b-lg">{p}</button>
              ))}
            </div>
          )}
        </div>
        <div className="relative" ref={formatRef}>
          <button onClick={() => { setFormatDropdownOpen(!formatDropdownOpen); setPeriodDropdownOpen(false); }}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
            <span>{selectedFormat}</span><ChevronDown className="w-4 h-4" />
          </button>
          {formatDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-10">
              {formats.map(f => (
                <button key={f} onClick={() => { setSelectedFormat(f); setFormatDropdownOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors first:rounded-t-lg last:rounded-b-lg">{f}</button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white">
            <Download className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>
    );
  }

  // ── Trial Balance ──
  function renderTrialBalance() {
    const data = getTrialBalanceData(selectedPeriod);
    const totalDebit = data.reduce((s, r) => s + r.debit, 0);
    const totalCredit = data.reduce((s, r) => s + r.credit, 0);
    return (
      <>
        {renderFilters()}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#0B01D0" }}>
                <th className="text-left text-white text-sm px-6 py-3">Account No.</th>
                <th className="text-left text-white text-sm px-6 py-3">Account Name</th>
                <th className="text-right text-white text-sm px-6 py-3">Debit ($)</th>
                <th className="text-right text-white text-sm px-6 py-3">Credit ($)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => (
                <tr key={r.accountNo} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}>
                  <td className="px-6 py-3 text-sm text-slate-600">{r.accountNo}</td>
                  <td className="px-6 py-3 text-sm text-slate-900 font-medium">{r.account}</td>
                  <td className="px-6 py-3 text-sm text-right text-slate-900">{r.debit ? fmt(r.debit) : "-"}</td>
                  <td className="px-6 py-3 text-sm text-right text-slate-900">{r.credit ? fmt(r.credit) : "-"}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-400 bg-slate-100 font-semibold">
                <td className="px-6 py-3 text-sm" colSpan={2}>Total</td>
                <td className="px-6 py-3 text-sm text-right">{fmt(totalDebit)}</td>
                <td className="px-6 py-3 text-sm text-right">{fmt(totalCredit)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }

  // ── Income Statement ──
  function renderIncomeStatement() {
    const data = incomeStatementData[selectedPeriod];
    const isDetailed = selectedFormat === "Detailed View";
    const totalRevenue = data.revenue.grants + data.revenue.donations + data.revenue.programFees + (data.revenue.other || 0);
    const totalExpenses = data.expenses.programServices + data.expenses.administration + data.expenses.fundraising +
      (isDetailed ? ((data.expenses.depreciation || 0) + (data.expenses.utilities || 0)) : 0);
    const netIncome = totalRevenue - totalExpenses;

    return (
      <>
        {renderFilters()}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <div className="text-center mb-8 pb-6 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900 mb-2" style={{ fontSize: "20px" }}>Income Statement</h2>
              <p className="text-sm text-slate-600">For the Quarter Ended {getPeriodEndDate(selectedPeriod)}</p>
              <p className="text-xs text-slate-500 mt-1">All amounts in USD</p>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#0B01D0" }}>REVENUE</h3>
                <div className="space-y-3 ml-4">
                  {[["Grant Revenue", data.revenue.grants], ["Donation Revenue", data.revenue.donations], ["Program Service Fees", data.revenue.programFees]].map(([label, val]) => (
                    <div key={label as string} className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-700">{label}</span>
                      <span className="text-sm text-slate-900 font-medium">{fmt(val as number)}</span>
                    </div>
                  ))}
                  {isDetailed && data.revenue.other && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-700">Other Revenue</span>
                      <span className="text-sm text-slate-900 font-medium">{fmt(data.revenue.other)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center font-semibold border-t-2 pt-3 mt-2" style={{ borderColor: "#0B01D0" }}>
                    <span className="text-slate-900">TOTAL REVENUE</span>
                    <span className="text-slate-900">{fmt(totalRevenue)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#0B01D0" }}>EXPENSES</h3>
                <div className="space-y-3 ml-4">
                  {[["Program Services", data.expenses.programServices], ["Administration", data.expenses.administration], ["Fundraising", data.expenses.fundraising]].map(([label, val]) => (
                    <div key={label as string} className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-700">{label}</span>
                      <span className="text-sm text-slate-900 font-medium">{fmt(val as number)}</span>
                    </div>
                  ))}
                  {isDetailed && data.expenses.depreciation && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-700">Depreciation</span>
                      <span className="text-sm text-slate-900 font-medium">{fmt(data.expenses.depreciation)}</span>
                    </div>
                  )}
                  {isDetailed && data.expenses.utilities && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-700">Utilities</span>
                      <span className="text-sm text-slate-900 font-medium">{fmt(data.expenses.utilities)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center font-semibold border-t-2 pt-3 mt-2" style={{ borderColor: "#0B01D0" }}>
                    <span className="text-slate-900">TOTAL EXPENSES</span>
                    <span className="text-slate-900">{fmt(totalExpenses)}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center font-semibold border-t-4 pt-4" style={{ borderColor: "#0B01D0" }}>
                <span className="text-slate-900" style={{ fontSize: "16px" }}>NET INCOME</span>
                <span className="text-slate-900" style={{ fontSize: "16px" }}>{fmt(netIncome)}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Balance Sheet ──
  function renderBalanceSheet() {
    const data = balanceSheetData[selectedPeriod];
    const totalCurrentAssets = data.currentAssets.cash + data.currentAssets.accountsReceivable + data.currentAssets.prepaidExpenses;
    const netFixedAssets = data.fixedAssets.propertyAndEquipment - data.fixedAssets.accumulatedDepreciation;
    const totalAssets = totalCurrentAssets + netFixedAssets;
    const totalCurrentLiabilities = data.currentLiabilities.accountsPayable + data.currentLiabilities.accruedExpenses + data.currentLiabilities.deferredRevenue;
    const totalLiabilities = totalCurrentLiabilities;
    const totalEquity = data.equity.netAssets + data.equity.retainedEarnings;

    return (
      <>
        {renderFilters()}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <div className="text-center mb-8 pb-6 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900 mb-2" style={{ fontSize: "20px" }}>Balance Sheet</h2>
              <p className="text-sm text-slate-600">As of {getPeriodEndDate(selectedPeriod)}</p>
              <p className="text-xs text-slate-500 mt-1">All amounts in USD</p>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#0B01D0" }}>ASSETS</h3>
                <div className="space-y-3 ml-4">
                  <div className="font-medium text-slate-900 mb-2">Current Assets</div>
                  {[["Cash and Cash Equivalents", data.currentAssets.cash], ["Accounts Receivable", data.currentAssets.accountsReceivable], ["Prepaid Expenses", data.currentAssets.prepaidExpenses]].map(([l, v]) => (
                    <div key={l as string} className="flex justify-between items-center ml-4 py-1">
                      <span className="text-sm text-slate-700">{l}</span>
                      <span className="text-sm text-slate-900 font-medium">{fmt(v as number)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center font-medium border-t border-slate-200 pt-2 mt-2">
                    <span className="text-sm text-slate-900">Total Current Assets</span>
                    <span className="text-sm text-slate-900">{fmt(totalCurrentAssets)}</span>
                  </div>
                </div>
                <div className="space-y-3 ml-4 mt-6">
                  <div className="font-medium text-slate-900 mb-2">Fixed Assets</div>
                  <div className="flex justify-between items-center ml-4 py-1">
                    <span className="text-sm text-slate-700">Property and Equipment</span>
                    <span className="text-sm text-slate-900 font-medium">{fmt(data.fixedAssets.propertyAndEquipment)}</span>
                  </div>
                  <div className="flex justify-between items-center ml-4 py-1">
                    <span className="text-sm text-slate-700">Less: Accumulated Depreciation</span>
                    <span className="text-sm text-slate-900 font-medium">{fmt(-data.fixedAssets.accumulatedDepreciation)}</span>
                  </div>
                  <div className="flex justify-between items-center font-medium border-t border-slate-200 pt-2 mt-2">
                    <span className="text-sm text-slate-900">Net Fixed Assets</span>
                    <span className="text-sm text-slate-900">{fmt(netFixedAssets)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center font-semibold border-t-2 pt-3 mt-4" style={{ borderColor: "#0B01D0" }}>
                  <span className="text-slate-900">TOTAL ASSETS</span>
                  <span className="text-slate-900">{fmt(totalAssets)}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#0B01D0" }}>LIABILITIES</h3>
                <div className="space-y-3 ml-4">
                  <div className="font-medium text-slate-900 mb-2">Current Liabilities</div>
                  {[["Accounts Payable", data.currentLiabilities.accountsPayable], ["Accrued Expenses", data.currentLiabilities.accruedExpenses], ["Deferred Revenue", data.currentLiabilities.deferredRevenue]].map(([l, v]) => (
                    <div key={l as string} className="flex justify-between items-center ml-4 py-1">
                      <span className="text-sm text-slate-700">{l}</span>
                      <span className="text-sm text-slate-900 font-medium">{fmt(v as number)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center font-medium border-t border-slate-200 pt-2 mt-2">
                    <span className="text-sm text-slate-900">Total Current Liabilities</span>
                    <span className="text-sm text-slate-900">{fmt(totalCurrentLiabilities)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center font-semibold border-t-2 pt-3 mt-4" style={{ borderColor: "#0B01D0" }}>
                  <span className="text-slate-900">TOTAL LIABILITIES</span>
                  <span className="text-slate-900">{fmt(totalLiabilities)}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#0B01D0" }}>EQUITY</h3>
                <div className="space-y-3 ml-4">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-slate-700">Net Assets</span>
                    <span className="text-sm text-slate-900 font-medium">{fmt(data.equity.netAssets)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-slate-700">Retained Earnings</span>
                    <span className="text-sm text-slate-900 font-medium">{fmt(data.equity.retainedEarnings)}</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold border-t-2 pt-3 mt-2" style={{ borderColor: "#0B01D0" }}>
                    <span className="text-slate-900">TOTAL EQUITY</span>
                    <span className="text-slate-900">{fmt(totalEquity)}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center font-semibold border-t-4 pt-4" style={{ borderColor: "#0B01D0" }}>
                <span className="text-slate-900" style={{ fontSize: "16px" }}>TOTAL LIABILITIES & EQUITY</span>
                <span className="text-slate-900" style={{ fontSize: "16px" }}>{fmt(totalLiabilities + totalEquity)}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Get and Post Closing Balance ──
  function renderClosingBalance() {
    const data = getClosingBalanceData(selectedPeriod);
    const is = incomeStatementData[selectedPeriod];
    const totalRevenue = is.revenue.grants + is.revenue.donations + is.revenue.programFees + (is.revenue.other || 0);
    const totalExpenses = is.expenses.programServices + is.expenses.administration + is.expenses.fundraising + (is.expenses.depreciation || 0) + (is.expenses.utilities || 0);
    const netIncome = totalRevenue - totalExpenses;

    const permanentAccounts = data.filter(r => parseInt(r.accountNo) < 4000);
    const revenueAccounts = data.filter(r => r.accountNo.startsWith("4"));
    const expenseAccounts = data.filter(r => r.accountNo.startsWith("5"));

    return (
      <>
        {renderFilters()}
        <div className="flex-1 overflow-auto">
          {/* Summary card */}
          <div className="px-6 py-4 bg-white border-b border-slate-200">
            <div className="flex items-center gap-6">
              <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-600 mb-1">Net Income to Transfer</p>
                <p className="text-lg font-semibold text-green-700">{fmt(netIncome)}</p>
              </div>
              <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Period</p>
                <p className="text-lg font-semibold text-blue-700">{selectedPeriod}</p>
              </div>
              <div className="px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-xs text-purple-600 mb-1">Transfers To</p>
                <p className="text-lg font-semibold text-purple-700">Retained Earnings (3100)</p>
              </div>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#0B01D0" }}>
                <th className="text-left text-white text-sm px-6 py-3">Account No.</th>
                <th className="text-left text-white text-sm px-6 py-3">Account Name</th>
                <th className="text-right text-white text-sm px-6 py-3">Pre-Closing Balance ($)</th>
                <th className="text-right text-white text-sm px-6 py-3">Closing Entry ($)</th>
                <th className="text-right text-white text-sm px-6 py-3">Post-Closing Balance ($)</th>
              </tr>
            </thead>
            <tbody>
              {/* Permanent Accounts */}
              <tr className="bg-indigo-50">
                <td colSpan={5} className="px-6 py-2 text-sm font-semibold text-indigo-800">Permanent Accounts (Carry Forward)</td>
              </tr>
              {permanentAccounts.map((r, i) => (
                <tr key={r.accountNo} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}>
                  <td className="px-6 py-3 text-sm text-slate-600">{r.accountNo}</td>
                  <td className="px-6 py-3 text-sm text-slate-900 font-medium">{r.account}</td>
                  <td className="px-6 py-3 text-sm text-right text-slate-900">{fmt(r.preClosingBalance)}</td>
                  <td className={`px-6 py-3 text-sm text-right ${r.closingEntry !== 0 ? "text-amber-600 font-medium" : "text-slate-400"}`}>{r.closingEntry !== 0 ? fmt(r.closingEntry) : "-"}</td>
                  <td className="px-6 py-3 text-sm text-right font-medium text-slate-900">{fmt(r.postClosingBalance)}</td>
                </tr>
              ))}
              {/* Revenue Accounts */}
              <tr className="bg-green-50">
                <td colSpan={5} className="px-6 py-2 text-sm font-semibold text-green-800">Revenue Accounts (Close to Zero)</td>
              </tr>
              {revenueAccounts.map((r, i) => (
                <tr key={r.accountNo} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}>
                  <td className="px-6 py-3 text-sm text-slate-600">{r.accountNo}</td>
                  <td className="px-6 py-3 text-sm text-slate-900 font-medium">{r.account}</td>
                  <td className="px-6 py-3 text-sm text-right text-green-600">{fmt(r.preClosingBalance)}</td>
                  <td className="px-6 py-3 text-sm text-right text-red-600 font-medium">{fmt(r.closingEntry)}</td>
                  <td className="px-6 py-3 text-sm text-right text-slate-400">{fmt(r.postClosingBalance)}</td>
                </tr>
              ))}
              {/* Expense Accounts */}
              <tr className="bg-orange-50">
                <td colSpan={5} className="px-6 py-2 text-sm font-semibold text-orange-800">Expense Accounts (Close to Zero)</td>
              </tr>
              {expenseAccounts.map((r, i) => (
                <tr key={r.accountNo} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}>
                  <td className="px-6 py-3 text-sm text-slate-600">{r.accountNo}</td>
                  <td className="px-6 py-3 text-sm text-slate-900 font-medium">{r.account}</td>
                  <td className="px-6 py-3 text-sm text-right text-red-600">{fmt(r.preClosingBalance)}</td>
                  <td className="px-6 py-3 text-sm text-right text-green-600 font-medium">{fmt(r.closingEntry)}</td>
                  <td className="px-6 py-3 text-sm text-right text-slate-400">{fmt(r.postClosingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  // ── Content router ──
  function renderContent() {
    switch (activeReport) {
      case "list": return renderList();
      case "trial-balance": return renderTrialBalance();
      case "income-statement": return renderIncomeStatement();
      case "balance-sheet": return renderBalanceSheet();
      case "closing-balance": return renderClosingBalance();
      default: return null;
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          {isInSubReport && (
            <button onClick={() => setActiveReport("list")} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {isInSubReport ? getTitle() : "Financial Statements"}
            </h1>
            {isInSubReport && (
              <p className="text-sm text-slate-500 mt-0.5">Financial Statements / {getTitle()}</p>
            )}
          </div>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}
