import { useState } from "react";
import { Search, Download, ChevronDown, ArrowLeft, ChevronRight, Filter, Calendar, Printer } from "lucide-react";

// ── Donor list ──
const DONORS = ["HEW", "DUTCH", "GOG", "IGF", "GATE", "MCF", "TAP", "OSF", "Co-IMPACT", "IDRC", "CGD"] as const;

// ── Tab type ──
type ReportCategory = "project" | "audit" | "timesheet";

// ── PROJECT REPORTS DATA ──
const consolidatedProjectData = [
  { project: "Rural Health Access Program", donors: { HEW: 125000, DUTCH: 89000, GOG: 45000, IGF: 32000 }, budgeted: 310000 },
  { project: "Youth Empowerment Initiative", donors: { GATE: 95000, MCF: 72000, TAP: 55000 }, budgeted: 240000 },
  { project: "Agricultural Livelihoods Project", donors: { OSF: 180000, "Co-IMPACT": 65000, IDRC: 48000 }, budgeted: 320000 },
  { project: "Education Quality Improvement", donors: { CGD: 110000, HEW: 85000, DUTCH: 62000 }, budgeted: 275000 },
  { project: "Water & Sanitation Program", donors: { GOG: 78000, IGF: 55000, GATE: 43000, MCF: 38000 }, budgeted: 230000 },
  { project: "Gender Equality Advancement", donors: { TAP: 67000, OSF: 92000, "Co-IMPACT": 41000 }, budgeted: 215000 },
  { project: "Climate Resilience Project", donors: { IDRC: 135000, CGD: 88000, HEW: 52000 }, budgeted: 295000 },
  { project: "Community Health Workers Training", donors: { DUTCH: 73000, GOG: 58000, MCF: 44000 }, budgeted: 190000 },
];

const budgetLineCategories = [
  "Administrative Expenses", "Board Development", "Communication & Publications",
  "Consultancy", "Consultancy - Fixed Cost", "Fixed Asset", "Lecture & Workshop",
  "Monitoring & Evaluation", "Relocation Expenses", "Scoping/Project Development",
  "Staff Cost", "Travel/Hotel etc."
];

const budgetLineData: Record<string, Record<string, number>> = {
  "Administrative Expenses": { HEW: 18500, DUTCH: 12300, GOG: 9800, IGF: 7200, GATE: 11400, MCF: 8900, TAP: 6700, OSF: 14200, "Co-IMPACT": 5800, IDRC: 10300, CGD: 9100 },
  "Board Development": { HEW: 4200, DUTCH: 3100, GOG: 2800, IGF: 1900, GATE: 3500, MCF: 2200, TAP: 1800, OSF: 3800, "Co-IMPACT": 1500, IDRC: 2900, CGD: 2400 },
  "Communication & Publications": { HEW: 8900, DUTCH: 6700, GOG: 5200, IGF: 3800, GATE: 7100, MCF: 4500, TAP: 3600, OSF: 7800, "Co-IMPACT": 3200, IDRC: 5600, CGD: 4900 },
  "Consultancy": { HEW: 22000, DUTCH: 18500, GOG: 14200, IGF: 9800, GATE: 16300, MCF: 12100, TAP: 8900, OSF: 19500, "Co-IMPACT": 7600, IDRC: 14800, CGD: 12500 },
  "Consultancy - Fixed Cost": { HEW: 15000, DUTCH: 11200, GOG: 8900, IGF: 6500, GATE: 10800, MCF: 7900, TAP: 5800, OSF: 13200, "Co-IMPACT": 4900, IDRC: 9600, CGD: 8200 },
  "Fixed Asset": { HEW: 35000, DUTCH: 28000, GOG: 21500, IGF: 15200, GATE: 25800, MCF: 19500, TAP: 14200, OSF: 31000, "Co-IMPACT": 12100, IDRC: 23500, CGD: 20200 },
  "Lecture & Workshop": { HEW: 12500, DUTCH: 9800, GOG: 7600, IGF: 5400, GATE: 9200, MCF: 6800, TAP: 5100, OSF: 11200, "Co-IMPACT": 4300, IDRC: 8500, CGD: 7100 },
  "Monitoring & Evaluation": { HEW: 19800, DUTCH: 15200, GOG: 11800, IGF: 8500, GATE: 14500, MCF: 10900, TAP: 8100, OSF: 17500, "Co-IMPACT": 6800, IDRC: 13200, CGD: 11500 },
  "Relocation Expenses": { HEW: 5500, DUTCH: 4200, GOG: 3100, IGF: 2200, GATE: 3800, MCF: 2900, TAP: 2100, OSF: 4800, "Co-IMPACT": 1800, IDRC: 3500, CGD: 2800 },
  "Scoping/Project Development": { HEW: 9200, DUTCH: 7100, GOG: 5500, IGF: 3900, GATE: 6800, MCF: 5200, TAP: 3800, OSF: 8200, "Co-IMPACT": 3100, IDRC: 6200, CGD: 5400 },
  "Staff Cost": { HEW: 85000, DUTCH: 68000, GOG: 52000, IGF: 38000, GATE: 62000, MCF: 48000, TAP: 35000, OSF: 75000, "Co-IMPACT": 29500, IDRC: 58000, CGD: 49500 },
  "Travel/Hotel etc.": { HEW: 14500, DUTCH: 11200, GOG: 8600, IGF: 6200, GATE: 10500, MCF: 7900, TAP: 5900, OSF: 12800, "Co-IMPACT": 4900, IDRC: 9600, CGD: 8200 },
};

const incomeData: Record<string, Record<string, number>> = {
  "Balance B/F": { HEW: 45000, DUTCH: 38000, GOG: 28000, IGF: 19500, GATE: 33000, MCF: 25000, TAP: 18500, OSF: 41000, "Co-IMPACT": 15200, IDRC: 30500, CGD: 26000 },
  "Transfer Received": { HEW: 320000, DUTCH: 255000, GOG: 195000, IGF: 142000, GATE: 235000, MCF: 178000, TAP: 130000, OSF: 290000, "Co-IMPACT": 108000, IDRC: 215000, CGD: 185000 },
};

const fixedCostCategories = ["Staff Cost", "Fixed Asset", "Administrative Expenses", "Consultancy - Fixed Cost", "Board Development"];
const variableCostCategories = ["Consultancy", "Travel/Hotel etc.", "Lecture & Workshop", "Communication & Publications", "Monitoring & Evaluation", "Relocation Expenses", "Scoping/Project Development"];

// ── AUDIT TRAY DATA ──
const donorAuditData = [
  { donor: "HEW", date: "Mar 15, 2026", description: "Grant Disbursement Q1", debit: "", credit: "125,000.00", balance: "125,000.00" },
  { donor: "HEW", date: "Mar 18, 2026", description: "Staff Salaries - Rural Health Program", debit: "28,500.00", credit: "", balance: "96,500.00" },
  { donor: "HEW", date: "Mar 22, 2026", description: "Office Rent - Accra Regional", debit: "4,200.00", credit: "", balance: "92,300.00" },
  { donor: "HEW", date: "Mar 25, 2026", description: "M&E Field Visit - Northern Region", debit: "3,800.00", credit: "", balance: "88,500.00" },
  { donor: "DUTCH", date: "Mar 10, 2026", description: "Program Funding Transfer", debit: "", credit: "89,000.00", balance: "89,000.00" },
  { donor: "DUTCH", date: "Mar 14, 2026", description: "Workshop Facilitation Fees", debit: "6,500.00", credit: "", balance: "82,500.00" },
  { donor: "DUTCH", date: "Mar 20, 2026", description: "Consultant Payment - Impact Assessment", debit: "12,000.00", credit: "", balance: "70,500.00" },
  { donor: "GOG", date: "Mar 05, 2026", description: "Government Counterpart Funding", debit: "", credit: "45,000.00", balance: "45,000.00" },
  { donor: "GOG", date: "Mar 12, 2026", description: "Community Health Workers Stipend", debit: "8,200.00", credit: "", balance: "36,800.00" },
  { donor: "GOG", date: "Mar 28, 2026", description: "Equipment Purchase - Water Testing", debit: "5,600.00", credit: "", balance: "31,200.00" },
  { donor: "IGF", date: "Mar 08, 2026", description: "Internal Revenue Allocation", debit: "", credit: "32,000.00", balance: "32,000.00" },
  { donor: "IGF", date: "Mar 19, 2026", description: "Vehicle Maintenance", debit: "2,800.00", credit: "", balance: "29,200.00" },
  { donor: "GATE", date: "Mar 02, 2026", description: "Education Grant Tranche 2", debit: "", credit: "95,000.00", balance: "95,000.00" },
  { donor: "GATE", date: "Mar 16, 2026", description: "Teacher Training Program", debit: "15,200.00", credit: "", balance: "79,800.00" },
  { donor: "GATE", date: "Mar 24, 2026", description: "Textbook Procurement", debit: "8,900.00", credit: "", balance: "70,900.00" },
  { donor: "MCF", date: "Mar 06, 2026", description: "Youth Program Funding", debit: "", credit: "72,000.00", balance: "72,000.00" },
  { donor: "MCF", date: "Mar 21, 2026", description: "Skills Training Materials", debit: "4,500.00", credit: "", balance: "67,500.00" },
  { donor: "TAP", date: "Mar 11, 2026", description: "Agricultural Support Grant", debit: "", credit: "55,000.00", balance: "55,000.00" },
  { donor: "TAP", date: "Mar 26, 2026", description: "Seed Distribution Program", debit: "7,800.00", credit: "", balance: "47,200.00" },
  { donor: "OSF", date: "Mar 03, 2026", description: "Governance Program Funding", debit: "", credit: "180,000.00", balance: "180,000.00" },
  { donor: "OSF", date: "Mar 17, 2026", description: "Policy Research Consultancy", debit: "22,000.00", credit: "", balance: "158,000.00" },
  { donor: "Co-IMPACT", date: "Mar 09, 2026", description: "Systems Change Grant", debit: "", credit: "65,000.00", balance: "65,000.00" },
  { donor: "Co-IMPACT", date: "Mar 23, 2026", description: "Coalition Building Workshop", debit: "5,200.00", credit: "", balance: "59,800.00" },
  { donor: "IDRC", date: "Mar 04, 2026", description: "Research Funding Q1", debit: "", credit: "135,000.00", balance: "135,000.00" },
  { donor: "IDRC", date: "Mar 13, 2026", description: "Data Collection Fieldwork", debit: "18,500.00", credit: "", balance: "116,500.00" },
  { donor: "CGD", date: "Mar 07, 2026", description: "Climate Program Disbursement", debit: "", credit: "88,000.00", balance: "88,000.00" },
  { donor: "CGD", date: "Mar 27, 2026", description: "Reforestation Materials", debit: "11,200.00", credit: "", balance: "76,800.00" },
];

const projectAuditData = [
  { project: "Rural Health Access Program", date: "Mar 15, 2026", description: "Staff Salaries", budgetLine: "Staff Cost", debit: "28,500.00", credit: "", balance: "28,500.00" },
  { project: "Rural Health Access Program", date: "Mar 18, 2026", description: "Medical Supplies Procurement", budgetLine: "Fixed Asset", debit: "12,800.00", credit: "", balance: "41,300.00" },
  { project: "Rural Health Access Program", date: "Mar 22, 2026", description: "Community Health Training", budgetLine: "Lecture & Workshop", debit: "5,200.00", credit: "", balance: "46,500.00" },
  { project: "Youth Empowerment Initiative", date: "Mar 10, 2026", description: "Program Coordinator Salary", budgetLine: "Staff Cost", debit: "8,500.00", credit: "", balance: "8,500.00" },
  { project: "Youth Empowerment Initiative", date: "Mar 14, 2026", description: "Skills Workshop Venue Hire", budgetLine: "Lecture & Workshop", debit: "3,200.00", credit: "", balance: "11,700.00" },
  { project: "Youth Empowerment Initiative", date: "Mar 20, 2026", description: "Mentorship Program Materials", budgetLine: "Communication & Publications", debit: "2,100.00", credit: "", balance: "13,800.00" },
  { project: "Agricultural Livelihoods Project", date: "Mar 05, 2026", description: "Extension Officers Salaries", budgetLine: "Staff Cost", debit: "15,200.00", credit: "", balance: "15,200.00" },
  { project: "Agricultural Livelihoods Project", date: "Mar 12, 2026", description: "Seed & Fertilizer Purchase", budgetLine: "Fixed Asset", debit: "22,500.00", credit: "", balance: "37,700.00" },
  { project: "Agricultural Livelihoods Project", date: "Mar 28, 2026", description: "Farmer Field School", budgetLine: "Lecture & Workshop", debit: "4,800.00", credit: "", balance: "42,500.00" },
  { project: "Education Quality Improvement", date: "Mar 08, 2026", description: "Teacher Training Facilitators", budgetLine: "Consultancy", debit: "9,800.00", credit: "", balance: "9,800.00" },
  { project: "Education Quality Improvement", date: "Mar 19, 2026", description: "Textbook Distribution", budgetLine: "Communication & Publications", debit: "6,500.00", credit: "", balance: "16,300.00" },
  { project: "Water & Sanitation Program", date: "Mar 02, 2026", description: "Borehole Drilling Contract", budgetLine: "Consultancy - Fixed Cost", debit: "35,000.00", credit: "", balance: "35,000.00" },
  { project: "Water & Sanitation Program", date: "Mar 16, 2026", description: "Water Quality Testing Equipment", budgetLine: "Fixed Asset", debit: "8,900.00", credit: "", balance: "43,900.00" },
  { project: "Gender Equality Advancement", date: "Mar 06, 2026", description: "Gender Audit Consultant", budgetLine: "Consultancy", debit: "12,000.00", credit: "", balance: "12,000.00" },
  { project: "Gender Equality Advancement", date: "Mar 21, 2026", description: "Advocacy Campaign Materials", budgetLine: "Communication & Publications", debit: "4,500.00", credit: "", balance: "16,500.00" },
  { project: "Climate Resilience Project", date: "Mar 03, 2026", description: "Research Team Salaries", budgetLine: "Staff Cost", debit: "18,500.00", credit: "", balance: "18,500.00" },
  { project: "Climate Resilience Project", date: "Mar 17, 2026", description: "Climate Data Collection", budgetLine: "Monitoring & Evaluation", debit: "7,200.00", credit: "", balance: "25,700.00" },
  { project: "Community Health Workers Training", date: "Mar 09, 2026", description: "Training Venue & Logistics", budgetLine: "Lecture & Workshop", debit: "6,800.00", credit: "", balance: "6,800.00" },
  { project: "Community Health Workers Training", date: "Mar 23, 2026", description: "Training Materials Printing", budgetLine: "Communication & Publications", debit: "2,900.00", credit: "", balance: "9,700.00" },
];

// ── TIMESHEET REPORTS ──
const timesheetReportNames = [
  "Unsubmitted Users",
  "Timesheet - Project Summary",
  "Timesheet - All Staff and Project",
  "Timesheet - Staff",
  "Timesheet - Staff Allocation",
  "Timesheet - Project",
  "Timesheet - Project Cost",
  "Print Time Sheet - Cost",
  "Timesheet - Unsubmitted Staff",
  "Timesheet - Extra Hours",
];

// Mock timesheet data
const timesheetStaffData = [
  { name: "Kwame Amoah", project: "Rural Health Access Program", mon: 8, tue: 8, wed: 7.5, thu: 8, fri: 8, total: 39.5, status: "Submitted" },
  { name: "Ama Serwaa", project: "Youth Empowerment Initiative", mon: 8, tue: 8, wed: 8, thu: 8, fri: 7, total: 39, status: "Submitted" },
  { name: "Kofi Mensah", project: "Agricultural Livelihoods Project", mon: 8, tue: 7.5, wed: 8, thu: 8, fri: 8, total: 39.5, status: "Submitted" },
  { name: "Akua Boateng", project: "Education Quality Improvement", mon: 8, tue: 8, wed: 8, thu: 7, fri: 8, total: 39, status: "Unsubmitted" },
  { name: "Yaw Asante", project: "Water & Sanitation Program", mon: 7, tue: 8, wed: 8, thu: 8, fri: 8, total: 39, status: "Submitted" },
  { name: "Efua Darkwah", project: "Gender Equality Advancement", mon: 8, tue: 8, wed: 7, thu: 8, fri: 8, total: 39, status: "Submitted" },
  { name: "Nana Osei", project: "Climate Resilience Project", mon: 8, tue: 8, wed: 8, thu: 8, fri: 6, total: 38, status: "Unsubmitted" },
  { name: "Abena Owusu", project: "Community Health Workers Training", mon: 8, tue: 8, wed: 8, thu: 8, fri: 8, total: 40, status: "Submitted" },
  { name: "Kwesi Appiah", project: "Rural Health Access Program", mon: 9, tue: 9, wed: 8, thu: 9, fri: 8, total: 43, status: "Submitted" },
  { name: "Adwoa Antwi", project: "Youth Empowerment Initiative", mon: 8, tue: 8, wed: 8, thu: 8, fri: 8, total: 40, status: "Submitted" },
];

const projectCostRates: Record<string, number> = {
  "Rural Health Access Program": 45,
  "Youth Empowerment Initiative": 38,
  "Agricultural Livelihoods Project": 42,
  "Education Quality Improvement": 40,
  "Water & Sanitation Program": 50,
  "Gender Equality Advancement": 35,
  "Climate Resilience Project": 48,
  "Community Health Workers Training": 36,
};

const projectAllocationData = [
  { staff: "Kwame Amoah", project: "Rural Health Access Program", allocated: 100, actual: 98.75 },
  { staff: "Ama Serwaa", project: "Youth Empowerment Initiative", allocated: 80, actual: 75 },
  { staff: "Ama Serwaa", project: "Gender Equality Advancement", allocated: 20, actual: 22.5 },
  { staff: "Kofi Mensah", project: "Agricultural Livelihoods Project", allocated: 100, actual: 98.75 },
  { staff: "Akua Boateng", project: "Education Quality Improvement", allocated: 60, actual: 55 },
  { staff: "Akua Boateng", project: "Rural Health Access Program", allocated: 40, actual: 42.5 },
  { staff: "Yaw Asante", project: "Water & Sanitation Program", allocated: 100, actual: 97.5 },
  { staff: "Efua Darkwah", project: "Gender Equality Advancement", allocated: 70, actual: 68 },
  { staff: "Efua Darkwah", project: "Youth Empowerment Initiative", allocated: 30, actual: 29.5 },
  { staff: "Nana Osei", project: "Climate Resilience Project", allocated: 100, actual: 95 },
  { staff: "Abena Owusu", project: "Community Health Workers Training", allocated: 100, actual: 100 },
  { staff: "Kwesi Appiah", project: "Rural Health Access Program", allocated: 100, actual: 107.5 },
  { staff: "Adwoa Antwi", project: "Youth Empowerment Initiative", allocated: 100, actual: 100 },
];

// ── Helpers ──
function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getDonorsForProject(donors: Record<string, number>): string[] {
  return Object.keys(donors);
}

function getAllDonorsUsed(): string[] {
  const s = new Set<string>();
  consolidatedProjectData.forEach(p => Object.keys(p.donors).forEach(d => s.add(d)));
  return [...DONORS].filter(d => s.has(d));
}

// ── Sub-report types ──
type ProjectReport = "list" | "consolidated-expenditure" | "consolidated-budget-lines" | "fixed-variable-cost";
type AuditReport = "list" | "donor-audit" | "project-audit";
type TimesheetReport = "list" | string;

interface Props {
  initialTab?: ReportCategory;
}

export function FinanceReportingAnalytics({ initialTab = "project" }: Props) {
  const activeTab = initialTab;
  const [projectReport, setProjectReport] = useState<ProjectReport>("list");
  const [auditReport, setAuditReport] = useState<AuditReport>("list");
  const [timesheetReport, setTimesheetReport] = useState<TimesheetReport>("list");

  // Audit filters
  const [auditDonorFilter, setAuditDonorFilter] = useState("All");
  const [auditProjectFilter, setAuditProjectFilter] = useState("All");
  const [auditDateFrom, setAuditDateFrom] = useState("");
  const [auditDateTo, setAuditDateTo] = useState("");

  // Timesheet filters
  const [tsCategory, setTsCategory] = useState("Staff");
  const [tsMonth, setTsMonth] = useState("March 2026");

  const [searchQuery, setSearchQuery] = useState("");

  const handleBack = () => {
    if (activeTab === "project") setProjectReport("list");
    else if (activeTab === "audit") setAuditReport("list");
    else setTimesheetReport("list");
    setSearchQuery("");
  };

  const isInSubReport = (activeTab === "project" && projectReport !== "list") ||
    (activeTab === "audit" && auditReport !== "list") ||
    (activeTab === "timesheet" && timesheetReport !== "list");

  // ── Render sub-report content ──
  function renderContent() {
    if (activeTab === "project") {
      if (projectReport === "list") return renderProjectReportList();
      if (projectReport === "consolidated-expenditure") return renderConsolidatedExpenditure();
      if (projectReport === "consolidated-budget-lines") return renderConsolidatedBudgetLines();
      if (projectReport === "fixed-variable-cost") return renderFixedVariableCost();
    }
    if (activeTab === "audit") {
      if (auditReport === "list") return renderAuditReportList();
      if (auditReport === "donor-audit") return renderDonorAudit();
      if (auditReport === "project-audit") return renderProjectAudit();
    }
    if (activeTab === "timesheet") {
      if (timesheetReport === "list") return renderTimesheetReportList();
      return renderTimesheetSubReport();
    }
    return null;
  }

  // ══════════════════════════════════════════════
  // PROJECT REPORTS
  // ══════════════════════════════════════════════

  function renderProjectReportList() {
    const reports = [
      { id: "consolidated-expenditure" as const, name: "Consolidated Project Expenditure", description: "Expenditure by project across donors with budget variance analysis" },
      { id: "consolidated-budget-lines" as const, name: "Consolidated Project Per Budget Lines", description: "Income and expenditure breakdown by budget line category across donors" },
      { id: "fixed-variable-cost" as const, name: "Fixed Cost and Variable Cost", description: "Expenditure split into fixed vs variable cost categories" },
    ];
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
            {reports.map((r, i) => (
              <tr key={r.id} className={`border-b border-slate-100 cursor-pointer hover:bg-blue-50 transition-colors ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
                onClick={() => setProjectReport(r.id)}>
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

  function renderConsolidatedExpenditure() {
    const allDonors = getAllDonorsUsed();
    return (
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#0B01D0" }}>
              <th className="text-left text-white text-sm px-4 py-3 sticky left-0 z-10" style={{ backgroundColor: "#0B01D0" }}>Project</th>
              {allDonors.map(d => <th key={d} className="text-right text-white text-sm px-4 py-3 whitespace-nowrap">{d}</th>)}
              <th className="text-right text-white text-sm px-4 py-3">Total</th>
              <th className="text-right text-white text-sm px-4 py-3">Budgeted</th>
              <th className="text-right text-white text-sm px-4 py-3">Variance</th>
            </tr>
          </thead>
          <tbody>
            {consolidatedProjectData.map((p, i) => {
              const total = Object.values(p.donors).reduce((a, b) => a + b, 0);
              const variance = p.budgeted - total;
              return (
                <tr key={p.project} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}>
                  <td className="px-4 py-3 text-sm text-slate-900 font-medium sticky left-0 z-10" style={{ backgroundColor: i % 2 === 1 ? "#f8fafc" : "#ffffff" }}>{p.project}</td>
                  {allDonors.map(d => (
                    <td key={d} className="px-4 py-3 text-sm text-right text-slate-700">
                      {p.donors[d as keyof typeof p.donors] ? fmt(p.donors[d as keyof typeof p.donors] ?? 0) : "-"}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-sm text-right font-medium text-slate-900">{fmt(total)}</td>
                  <td className="px-4 py-3 text-sm text-right text-slate-700">{fmt(p.budgeted)}</td>
                  <td className={`px-4 py-3 text-sm text-right font-medium ${variance >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {variance >= 0 ? "" : "("}{fmt(Math.abs(variance))}{variance < 0 ? ")" : ""}
                  </td>
                </tr>
              );
            })}
            {/* Grand Total */}
            <tr className="border-t-2 border-slate-300 bg-slate-100 font-semibold">
              <td className="px-4 py-3 text-sm text-slate-900 sticky left-0 z-10 bg-slate-100">Grand Total</td>
              {allDonors.map(d => {
                const sum = consolidatedProjectData.reduce((acc, p) => acc + (p.donors[d as keyof typeof p.donors] || 0), 0);
                return <td key={d} className="px-4 py-3 text-sm text-right text-slate-900">{sum > 0 ? fmt(sum) : "-"}</td>;
              })}
              <td className="px-4 py-3 text-sm text-right text-slate-900">{fmt(consolidatedProjectData.reduce((a, p) => a + Object.values(p.donors).reduce((x, y) => x + y, 0), 0))}</td>
              <td className="px-4 py-3 text-sm text-right text-slate-900">{fmt(consolidatedProjectData.reduce((a, p) => a + p.budgeted, 0))}</td>
              {(() => {
                const totalSpent = consolidatedProjectData.reduce((a, p) => a + Object.values(p.donors).reduce((x, y) => x + y, 0), 0);
                const totalBudget = consolidatedProjectData.reduce((a, p) => a + p.budgeted, 0);
                const v = totalBudget - totalSpent;
                return <td className={`px-4 py-3 text-sm text-right ${v >= 0 ? "text-green-600" : "text-red-600"}`}>{v >= 0 ? "" : "("}{fmt(Math.abs(v))}{v < 0 ? ")" : ""}</td>;
              })()}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  function renderConsolidatedBudgetLines() {
    const donors = [...DONORS];
    const getRow = (data: Record<string, Record<string, number>>, cat: string) => {
      const row = data[cat] || {};
      return donors.map(d => row[d] || 0);
    };
    const getTotal = (vals: number[]) => vals.reduce((a, b) => a + b, 0);

    // Income
    const incomeRows = Object.keys(incomeData);
    const incomeSubTotals = donors.map(d => incomeRows.reduce((acc, r) => acc + (incomeData[r][d] || 0), 0));

    // Expenditure
    const expTotals = donors.map(d => budgetLineCategories.reduce((acc, cat) => acc + (budgetLineData[cat]?.[d] || 0), 0));
    const balanceOnHand = donors.map((_, i) => incomeSubTotals[i] - expTotals[i]);

    return (
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#0B01D0" }}>
              <th className="text-left text-white text-sm px-4 py-3 sticky left-0 z-10" style={{ backgroundColor: "#0B01D0" }}>Budget Line</th>
              {donors.map(d => <th key={d} className="text-right text-white text-sm px-3 py-3 whitespace-nowrap">{d}</th>)}
              <th className="text-right text-white text-sm px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {/* INCOME SECTION */}
            <tr className="bg-emerald-50">
              <td colSpan={donors.length + 2} className="px-4 py-2 text-sm font-semibold text-emerald-800 sticky left-0 z-10 bg-emerald-50">INCOME</td>
            </tr>
            {incomeRows.map((label, i) => {
              const vals = donors.map(d => incomeData[label]?.[d] || 0);
              return (
                <tr key={label} className={i % 2 === 1 ? "bg-slate-50" : "bg-white"}>
                  <td className="px-4 py-2.5 text-sm text-slate-700 pl-8 sticky left-0 z-10" style={{ backgroundColor: i % 2 === 1 ? "#f8fafc" : "#fff" }}>{label}</td>
                  {vals.map((v, j) => <td key={j} className="px-3 py-2.5 text-sm text-right text-slate-700">{fmt(v)}</td>)}
                  <td className="px-4 py-2.5 text-sm text-right font-medium text-slate-900">{fmt(getTotal(vals))}</td>
                </tr>
              );
            })}
            <tr className="border-t border-emerald-200 bg-emerald-50 font-semibold">
              <td className="px-4 py-2.5 text-sm text-emerald-800 pl-8 sticky left-0 z-10 bg-emerald-50">Sub Total</td>
              {incomeSubTotals.map((v, i) => <td key={i} className="px-3 py-2.5 text-sm text-right text-emerald-800">{fmt(v)}</td>)}
              <td className="px-4 py-2.5 text-sm text-right text-emerald-800">{fmt(getTotal(incomeSubTotals))}</td>
            </tr>

            {/* EXPENDITURE SECTION */}
            <tr className="bg-amber-50">
              <td colSpan={donors.length + 2} className="px-4 py-2 text-sm font-semibold text-amber-800 sticky left-0 z-10 bg-amber-50">EXPENDITURE</td>
            </tr>
            {budgetLineCategories.map((cat, i) => {
              const vals = getRow(budgetLineData, cat);
              return (
                <tr key={cat} className={i % 2 === 1 ? "bg-slate-50" : "bg-white"}>
                  <td className="px-4 py-2.5 text-sm text-slate-700 pl-8 sticky left-0 z-10" style={{ backgroundColor: i % 2 === 1 ? "#f8fafc" : "#fff" }}>{cat}</td>
                  {vals.map((v, j) => <td key={j} className="px-3 py-2.5 text-sm text-right text-slate-700">{fmt(v)}</td>)}
                  <td className="px-4 py-2.5 text-sm text-right font-medium text-slate-900">{fmt(getTotal(vals))}</td>
                </tr>
              );
            })}

            {/* Total Expenditure */}
            <tr className="border-t-2 border-slate-300 bg-amber-50 font-semibold">
              <td className="px-4 py-2.5 text-sm text-amber-800 sticky left-0 z-10 bg-amber-50">Total Expenditure</td>
              {expTotals.map((v, i) => <td key={i} className="px-3 py-2.5 text-sm text-right text-amber-800">{fmt(v)}</td>)}
              <td className="px-4 py-2.5 text-sm text-right text-amber-800">{fmt(getTotal(expTotals))}</td>
            </tr>

            {/* Balance on Hand */}
            <tr className="border-t-2 border-slate-400 bg-blue-50 font-semibold">
              <td className="px-4 py-3 text-sm text-blue-800 sticky left-0 z-10 bg-blue-50">Balance on Hand</td>
              {balanceOnHand.map((v, i) => (
                <td key={i} className={`px-3 py-3 text-sm text-right font-semibold ${v >= 0 ? "text-green-700" : "text-red-600"}`}>{v >= 0 ? fmt(v) : `(${fmt(Math.abs(v))})`}</td>
              ))}
              <td className={`px-4 py-3 text-sm text-right font-semibold ${getTotal(balanceOnHand) >= 0 ? "text-green-700" : "text-red-600"}`}>
                {getTotal(balanceOnHand) >= 0 ? fmt(getTotal(balanceOnHand)) : `(${fmt(Math.abs(getTotal(balanceOnHand)))})`}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  function renderFixedVariableCost() {
    const donors = [...DONORS];
    const renderSection = (title: string, categories: string[], bgClass: string, textClass: string) => {
      const sectionTotals = donors.map(d => categories.reduce((acc, cat) => acc + (budgetLineData[cat]?.[d] || 0), 0));
      return (
        <>
          <tr className={bgClass}>
            <td colSpan={donors.length + 2} className={`px-4 py-2 text-sm font-semibold ${textClass} sticky left-0 z-10 ${bgClass}`}>{title}</td>
          </tr>
          {categories.map((cat, i) => {
            const vals = donors.map(d => budgetLineData[cat]?.[d] || 0);
            return (
              <tr key={cat} className={i % 2 === 1 ? "bg-slate-50" : "bg-white"}>
                <td className="px-4 py-2.5 text-sm text-slate-700 pl-8 sticky left-0 z-10" style={{ backgroundColor: i % 2 === 1 ? "#f8fafc" : "#fff" }}>{cat}</td>
                {vals.map((v, j) => <td key={j} className="px-3 py-2.5 text-sm text-right text-slate-700">{fmt(v)}</td>)}
                <td className="px-4 py-2.5 text-sm text-right font-medium text-slate-900">{fmt(vals.reduce((a, b) => a + b, 0))}</td>
              </tr>
            );
          })}
          <tr className={`border-t border-slate-300 ${bgClass} font-semibold`}>
            <td className={`px-4 py-2.5 text-sm ${textClass} sticky left-0 z-10 ${bgClass}`}>Sub Total - {title}</td>
            {sectionTotals.map((v, i) => <td key={i} className={`px-3 py-2.5 text-sm text-right ${textClass}`}>{fmt(v)}</td>)}
            <td className={`px-4 py-2.5 text-sm text-right ${textClass}`}>{fmt(sectionTotals.reduce((a, b) => a + b, 0))}</td>
          </tr>
        </>
      );
    };

    const fixedTotals = donors.map(d => fixedCostCategories.reduce((acc, cat) => acc + (budgetLineData[cat]?.[d] || 0), 0));
    const varTotals = donors.map(d => variableCostCategories.reduce((acc, cat) => acc + (budgetLineData[cat]?.[d] || 0), 0));
    const grandTotals = donors.map((_, i) => fixedTotals[i] + varTotals[i]);

    return (
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#0B01D0" }}>
              <th className="text-left text-white text-sm px-4 py-3 sticky left-0 z-10" style={{ backgroundColor: "#0B01D0" }}>Cost Category</th>
              {donors.map(d => <th key={d} className="text-right text-white text-sm px-3 py-3 whitespace-nowrap">{d}</th>)}
              <th className="text-right text-white text-sm px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {renderSection("FIXED COSTS", fixedCostCategories, "bg-indigo-50", "text-indigo-800")}
            <tr className="h-2" />
            {renderSection("VARIABLE COSTS", variableCostCategories, "bg-orange-50", "text-orange-800")}
            <tr className="border-t-2 border-slate-400 bg-slate-100 font-semibold">
              <td className="px-4 py-3 text-sm text-slate-900 sticky left-0 z-10 bg-slate-100">Grand Total</td>
              {grandTotals.map((v, i) => <td key={i} className="px-3 py-3 text-sm text-right text-slate-900">{fmt(v)}</td>)}
              <td className="px-4 py-3 text-sm text-right text-slate-900">{fmt(grandTotals.reduce((a, b) => a + b, 0))}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // AUDIT TRAY
  // ══════════════════════════════════════════════

  function renderAuditReportList() {
    const reports = [
      { id: "donor-audit" as const, name: "Donor Audit Tray", description: "Transaction audit trail by donor with debit/credit balances" },
      { id: "project-audit" as const, name: "Project Audit Tray", description: "Transaction audit trail by project with budget line tracking" },
    ];
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
            {reports.map((r, i) => (
              <tr key={r.id} className={`border-b border-slate-100 cursor-pointer hover:bg-blue-50 transition-colors ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
                onClick={() => setAuditReport(r.id)}>
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

  function renderDonorAudit() {
    const filtered = donorAuditData.filter(r => {
      if (auditDonorFilter !== "All" && r.donor !== auditDonorFilter) return false;
      if (searchQuery && !r.description.toLowerCase().includes(searchQuery.toLowerCase()) && !r.donor.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search transactions..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={auditDonorFilter} onChange={e => setAuditDonorFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[140px]">
            <option value="All">All Donors</option>
            {[...DONORS].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <input type="date" value={auditDateFrom} onChange={e => setAuditDateFrom(e.target.value)} className="px-2 py-1.5 border border-slate-200 rounded-lg text-sm" />
            <span>to</span>
            <input type="date" value={auditDateTo} onChange={e => setAuditDateTo(e.target.value)} className="px-2 py-1.5 border border-slate-200 rounded-lg text-sm" />
          </div>
          <button className="px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-700 hover:bg-slate-200 flex items-center gap-1.5">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#0B01D0" }}>
                <th className="text-left text-white text-sm px-6 py-3">Donor</th>
                <th className="text-left text-white text-sm px-6 py-3">Transaction Date</th>
                <th className="text-left text-white text-sm px-6 py-3">Description</th>
                <th className="text-right text-white text-sm px-6 py-3">Debit</th>
                <th className="text-right text-white text-sm px-6 py-3">Credit</th>
                <th className="text-right text-white text-sm px-6 py-3">Balance</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}>
                  <td className="px-6 py-3 text-sm font-medium text-slate-900">{r.donor}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{r.date}</td>
                  <td className="px-6 py-3 text-sm text-slate-700">{r.description}</td>
                  <td className="px-6 py-3 text-sm text-right text-red-600">{r.debit ? r.debit : "-"}</td>
                  <td className="px-6 py-3 text-sm text-right text-green-600">{r.credit ? r.credit : "-"}</td>
                  <td className="px-6 py-3 text-sm text-right font-medium text-slate-900">{r.balance}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderProjectAudit() {
    const projects = [...new Set(projectAuditData.map(r => r.project))];
    const filtered = projectAuditData.filter(r => {
      if (auditProjectFilter !== "All" && r.project !== auditProjectFilter) return false;
      if (searchQuery && !r.description.toLowerCase().includes(searchQuery.toLowerCase()) && !r.project.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search transactions..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={auditProjectFilter} onChange={e => setAuditProjectFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[200px]">
            <option value="All">All Projects</option>
            {projects.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <input type="date" value={auditDateFrom} onChange={e => setAuditDateFrom(e.target.value)} className="px-2 py-1.5 border border-slate-200 rounded-lg text-sm" />
            <span>to</span>
            <input type="date" value={auditDateTo} onChange={e => setAuditDateTo(e.target.value)} className="px-2 py-1.5 border border-slate-200 rounded-lg text-sm" />
          </div>
          <button className="px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-700 hover:bg-slate-200 flex items-center gap-1.5">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#0B01D0" }}>
                <th className="text-left text-white text-sm px-6 py-3">Project</th>
                <th className="text-left text-white text-sm px-6 py-3">Transaction Date</th>
                <th className="text-left text-white text-sm px-6 py-3">Description</th>
                <th className="text-left text-white text-sm px-6 py-3">Budget Line</th>
                <th className="text-right text-white text-sm px-6 py-3">Debit</th>
                <th className="text-right text-white text-sm px-6 py-3">Credit</th>
                <th className="text-right text-white text-sm px-6 py-3">Balance</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}>
                  <td className="px-6 py-3 text-sm font-medium text-slate-900">{r.project}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{r.date}</td>
                  <td className="px-6 py-3 text-sm text-slate-700">{r.description}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{r.budgetLine}</td>
                  <td className="px-6 py-3 text-sm text-right text-red-600">{r.debit ? r.debit : "-"}</td>
                  <td className="px-6 py-3 text-sm text-right text-green-600">{r.credit ? r.credit : "-"}</td>
                  <td className="px-6 py-3 text-sm text-right font-medium text-slate-900">{r.balance}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400">No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // TIMESHEET REPORTS
  // ══════════════════════════════════════════════

  function renderTimesheetReportList() {
    const reports = timesheetReportNames.map((name, i) => ({
      id: name,
      name,
      description: {
        "Unsubmitted Users": "Staff who have not submitted their timesheets for the period",
        "Timesheet - Project Summary": "Aggregated hours by project with staff count",
        "Timesheet - All Staff and Project": "Complete timesheet view for all staff across projects",
        "Timesheet - Staff": "Individual staff timesheet hours breakdown",
        "Timesheet - Staff Allocation": "Staff allocation vs actual hours by project",
        "Timesheet - Project": "Timesheet entries grouped by project",
        "Timesheet - Project Cost": "Project cost analysis based on staff hours and rates",
        "Print Time Sheet - Cost": "Printable timesheet with cost calculations",
        "Timesheet - Unsubmitted Staff": "Staff with pending timesheet submissions",
        "Timesheet - Extra Hours": "Staff who logged hours exceeding standard 40-hour week",
      }[name] || "",
    }));
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
            {reports.map((r, i) => (
              <tr key={r.id} className={`border-b border-slate-100 cursor-pointer hover:bg-blue-50 transition-colors ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
                onClick={() => setTimesheetReport(r.id)}>
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

  function renderTimesheetSubReport() {
    const reportName = timesheetReport as string;

    // Filter data based on search
    const filterBySearch = <T extends Record<string, any>>(data: T[], keys: string[]) =>
      data.filter(r => !searchQuery || keys.some(k => String(r[k]).toLowerCase().includes(searchQuery.toLowerCase())));

    switch (reportName) {
      case "Unsubmitted Users":
      case "Timesheet - Unsubmitted Staff": {
        const data = filterBySearch(timesheetStaffData.filter(s => s.status === "Unsubmitted"), ["name", "project"]);
        return renderTimesheetTable(
          ["Staff Name", "Project", "Mon", "Tue", "Wed", "Thu", "Fri", "Total", "Status"],
          data.map(s => [s.name, s.project, s.mon, s.tue, s.wed, s.thu, s.fri, s.total, s.status]),
          true
        );
      }
      case "Timesheet - Project Summary": {
        const projectSummary = Object.entries(
          timesheetStaffData.reduce((acc, s) => {
            acc[s.project] = (acc[s.project] || 0) + s.total;
            return acc;
          }, {} as Record<string, number>)
        ).map(([project, hours]) => ({ project, hours, staff: timesheetStaffData.filter(s => s.project === project).length }));
        return renderTimesheetTable(
          ["Project", "Staff Count", "Total Hours"],
          filterBySearch(projectSummary, ["project"]).map(p => [p.project, p.staff, p.hours])
        );
      }
      case "Timesheet - All Staff and Project": {
        const data = filterBySearch(timesheetStaffData, ["name", "project"]);
        return renderTimesheetTable(
          ["Staff Name", "Project", "Mon", "Tue", "Wed", "Thu", "Fri", "Total", "Status"],
          data.map(s => [s.name, s.project, s.mon, s.tue, s.wed, s.thu, s.fri, s.total, s.status])
        );
      }
      case "Timesheet - Staff": {
        const data = filterBySearch(timesheetStaffData, ["name"]);
        return renderTimesheetTable(
          ["Staff Name", "Mon", "Tue", "Wed", "Thu", "Fri", "Total Hours"],
          data.map(s => [s.name, s.mon, s.tue, s.wed, s.thu, s.fri, s.total])
        );
      }
      case "Timesheet - Staff Allocation": {
        const data = filterBySearch(projectAllocationData, ["staff", "project"]);
        return renderTimesheetTable(
          ["Staff Name", "Project", "Allocated %", "Actual %", "Variance %"],
          data.map(a => [a.staff, a.project, `${a.allocated}%`, `${a.actual}%`, `${(a.actual - a.allocated).toFixed(1)}%`])
        );
      }
      case "Timesheet - Project": {
        const data = filterBySearch(timesheetStaffData, ["project"]);
        return renderTimesheetTable(
          ["Project", "Staff Name", "Mon", "Tue", "Wed", "Thu", "Fri", "Total"],
          data.map(s => [s.project, s.name, s.mon, s.tue, s.wed, s.thu, s.fri, s.total])
        );
      }
      case "Timesheet - Project Cost": {
        const data = filterBySearch(timesheetStaffData, ["name", "project"]);
        return renderTimesheetTable(
          ["Project", "Staff Name", "Hours", "Rate ($/hr)", "Cost ($)"],
          data.map(s => [s.project, s.name, s.total, fmt(projectCostRates[s.project] || 40), fmt(s.total * (projectCostRates[s.project] || 40))])
        );
      }
      case "Print Time Sheet - Cost": {
        const data = filterBySearch(timesheetStaffData, ["name", "project"]);
        return renderTimesheetTable(
          ["Staff Name", "Project", "Mon", "Tue", "Wed", "Thu", "Fri", "Total Hrs", "Rate", "Total Cost"],
          data.map(s => {
            const rate = projectCostRates[s.project] || 40;
            return [s.name, s.project, s.mon, s.tue, s.wed, s.thu, s.fri, s.total, fmt(rate), fmt(s.total * rate)];
          })
        );
      }
      case "Timesheet - Extra Hours": {
        const extra = timesheetStaffData.filter(s => s.total > 40);
        const data = filterBySearch(extra, ["name", "project"]);
        return renderTimesheetTable(
          ["Staff Name", "Project", "Total Hours", "Standard (40)", "Extra Hours"],
          data.map(s => [s.name, s.project, s.total, 40, s.total - 40])
        );
      }
      default:
        return <div className="p-8 text-center text-slate-400">Report not found</div>;
    }
  }

  function renderTimesheetTable(headers: string[], rows: any[], highlightUnsubmitted = false) {
    const monthName = tsMonth.split(" ")[0];
    const year = tsMonth.split(" ")[1];
    const lastDay = ["January", "March", "May", "July", "August", "October", "December"].includes(monthName) ? "31" : ["April", "June", "September", "November"].includes(monthName) ? "30" : "28";
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Category:</label>
            <select value={tsCategory} onChange={e => setTsCategory(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white">
              <option>Staff</option>
              <option>Project</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Month:</label>
            <select value={tsMonth} onChange={e => setTsMonth(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white">
              <option>January 2026</option>
              <option>February 2026</option>
              <option>March 2026</option>
              <option>April 2026</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            <span>Period: 1 {monthName.slice(0, 3)} – {lastDay} {monthName.slice(0, 3)} {year}</span>
          </div>
          <button className="px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-700 hover:bg-slate-200 flex items-center gap-1.5">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-700 hover:bg-slate-200 flex items-center gap-1.5">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#0B01D0" }}>
                {headers.map(h => (
                  <th key={h} className={`text-white text-sm px-6 py-3 whitespace-nowrap ${h.includes("$") || h.includes("Cost") || h.includes("Rate") || h.includes("Hours") || h.includes("Total") || h.includes("%") || ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}>
                  {row.map((cell: any, j: number) => {
                    const h = headers[j];
                    const isRight = h.includes("$") || h.includes("Cost") || h.includes("Rate") || h.includes("Hours") || h.includes("Total") || h.includes("%") || ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(h) || h === "Staff Count";
                    const isStatus = h === "Status";
                    const isVariance = h.includes("Variance");
                    return (
                      <td key={j} className={`px-6 py-3 text-sm ${isRight ? "text-right" : "text-left"} ${j === 0 ? "font-medium text-slate-900" : "text-slate-700"} ${isStatus && cell === "Unsubmitted" ? "text-red-600 font-medium" : ""} ${isVariance ? (parseFloat(String(cell)) > 0 ? "text-amber-600" : parseFloat(String(cell)) < 0 ? "text-red-600" : "text-green-600") : ""}`}>
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={headers.length} className="px-6 py-12 text-center text-sm text-slate-400">No data found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // MAIN RENDER
  // ══════════════════════════════════════════════

  const getSubReportTitle = (): string => {
    if (activeTab === "project") {
      const titles: Record<string, string> = {
        "consolidated-expenditure": "Consolidated Project Expenditure",
        "consolidated-budget-lines": "Consolidated Project Per Budget Lines",
        "fixed-variable-cost": "Fixed Cost and Variable Cost",
      };
      return titles[projectReport] || "";
    }
    if (activeTab === "audit") {
      return auditReport === "donor-audit" ? "Donor Audit Tray" : "Project Audit Tray";
    }
    return timesheetReport as string;
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          {isInSubReport && (
            <button onClick={handleBack} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {isInSubReport ? getSubReportTitle() : (activeTab === "project" ? "Project Reports" : activeTab === "audit" ? "Audit Tray" : "Timesheet Reports")}
            </h1>
            {isInSubReport && (
              <p className="text-sm text-slate-500 mt-0.5">
                {activeTab === "project" ? "Project Reports" : activeTab === "audit" ? "Audit Tray" : "Timesheet Reports"} / {getSubReportTitle()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
