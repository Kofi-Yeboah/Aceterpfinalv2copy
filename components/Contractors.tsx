import { useState } from "react";
import {
  Search,
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";

// ── Mock Data ──
interface Contractor {
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
}

const MOCK_CONTRACTORS: Contractor[] = [
  {
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
  },
  {
    id: "CTR-002",
    name: "Ama Asante",
    company: "Construction Masters",
    contractNumber: "CON-2026-008",
    category: "Construction",
    totalContract: 150000,
    totalPaid: 120000,
    balance: 30000,
    activeTasks: 2,
    completedTasks: 12,
    status: "active",
    startDate: "Nov 20, 2025",
    endDate: "May 15, 2026",
    email: "a.asante@constructionmasters.com",
    phone: "+233 20 987 6543",
  },
  {
    id: "CTR-003",
    name: "Kofi Owusu",
    company: "Marketing Pro Agency",
    contractNumber: "CON-2025-092",
    category: "Marketing",
    totalContract: 42000,
    totalPaid: 42000,
    balance: 0,
    activeTasks: 0,
    completedTasks: 15,
    status: "completed",
    startDate: "Aug 10, 2025",
    endDate: "Feb 10, 2026",
    email: "k.owusu@marketingpro.com",
    phone: "+233 55 234 5678",
  },
  {
    id: "CTR-004",
    name: "Akosua Boateng",
    company: "Legal Advisory Services",
    contractNumber: "CON-2026-021",
    category: "Legal",
    totalContract: 65000,
    totalPaid: 35000,
    balance: 30000,
    activeTasks: 4,
    completedTasks: 5,
    status: "active",
    startDate: "Feb 01, 2026",
    endDate: "Aug 31, 2026",
    email: "a.boateng@legaladvisory.com",
    phone: "+233 24 876 5432",
  },
  {
    id: "CTR-005",
    name: "Yaw Appiah",
    company: "Data Analytics Co",
    contractNumber: "CON-2025-088",
    category: "Consulting",
    totalContract: 95000,
    totalPaid: 60000,
    balance: 35000,
    activeTasks: 1,
    completedTasks: 9,
    status: "on-hold",
    startDate: "Oct 15, 2025",
    endDate: "Apr 30, 2026",
    email: "y.appiah@dataanalytics.com",
    phone: "+233 50 345 6789",
  },
  {
    id: "CTR-006",
    name: "Efua Darko",
    company: "Training & Development Ltd",
    contractNumber: "CON-2026-019",
    category: "Training",
    totalContract: 38000,
    totalPaid: 18000,
    balance: 20000,
    activeTasks: 5,
    completedTasks: 3,
    status: "active",
    startDate: "Jan 20, 2026",
    endDate: "Jul 20, 2026",
    email: "e.darko@trainingdev.com",
    phone: "+233 24 555 1234",
  },
  {
    id: "CTR-007",
    name: "Kwabena Adjei",
    company: "Security Solutions Ghana",
    contractNumber: "CON-2025-074",
    category: "Security",
    totalContract: 72000,
    totalPaid: 72000,
    balance: 0,
    activeTasks: 0,
    completedTasks: 18,
    status: "completed",
    startDate: "Jul 01, 2025",
    endDate: "Dec 31, 2025",
    email: "k.adjei@securitygh.com",
    phone: "+233 27 654 3210",
  },
  {
    id: "CTR-008",
    name: "Abena Osei",
    company: "Environmental Consultants",
    contractNumber: "CON-2026-012",
    category: "Consulting",
    totalContract: 58000,
    totalPaid: 29000,
    balance: 29000,
    activeTasks: 3,
    completedTasks: 4,
    status: "active",
    startDate: "Jan 05, 2026",
    endDate: "Jun 05, 2026",
    email: "a.osei@enviro-consult.com",
    phone: "+233 20 111 2222",
  },
];

const CATEGORIES = ["All", "IT Services", "Construction", "Marketing", "Legal", "Consulting", "Training", "Security"];
const STATUSES = ["All", "Active", "Completed", "On-Hold"];

interface ContractorsProps {
  onViewDetails: (contractorId: string) => void;
}

export function Contractors({ onViewDetails }: ContractorsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filtering
  const filtered = MOCK_CONTRACTORS.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.contractNumber.toLowerCase().includes(q);
    const matchCategory = categoryFilter === "All" || c.category === categoryFilter;
    const matchStatus = statusFilter === "All" || c.status.toLowerCase() === statusFilter.toLowerCase().replace("-", " ");
    return matchSearch && matchCategory && matchStatus;
  });

  // Stats
  const totalContractValue = MOCK_CONTRACTORS.reduce((sum, c) => sum + c.totalContract, 0);
  const totalPaid = MOCK_CONTRACTORS.reduce((sum, c) => sum + c.totalPaid, 0);
  const totalBalance = MOCK_CONTRACTORS.reduce((sum, c) => sum + c.balance, 0);
  const activeContractors = MOCK_CONTRACTORS.filter((c) => c.status === "active").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] border border-green-200"><CheckCircle2 size={10} /> Active</span>;
      case "completed":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] border border-blue-200"><CheckCircle2 size={10} /> Completed</span>;
      case "on-hold":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] border border-amber-200"><Clock size={10} /> On-Hold</span>;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const hasActiveFilters = categoryFilter !== "All" || statusFilter !== "All" || searchQuery;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">Contractors</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-[11px] border border-purple-200">
              <Users size={12} />
              {MOCK_CONTRACTORS.length} Total
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-blue-700">Total Contract Value</span>
              <DollarSign size={14} className="text-blue-600" />
            </div>
            <p className="text-xl font-semibold text-blue-900">{formatCurrency(totalContractValue)}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-green-700">Total Paid</span>
              <CheckCircle2 size={14} className="text-green-600" />
            </div>
            <p className="text-xl font-semibold text-green-900">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-amber-700">Outstanding Balance</span>
              <AlertCircle size={14} className="text-amber-600" />
            </div>
            <p className="text-xl font-semibold text-amber-900">{formatCurrency(totalBalance)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-purple-700">Active Contractors</span>
              <Users size={14} className="text-purple-600" />
            </div>
            <p className="text-xl font-semibold text-purple-900">{activeContractors}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 px-3.5 py-2 border border-slate-200 rounded-lg bg-white">
            <Search size={15} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, company, or contract number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="p-0.5 hover:bg-slate-100 rounded">
                <X size={14} className="text-slate-400" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <span className="text-[11px] text-slate-500">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUSES.map((stat) => (
                <option key={stat} value={stat}>
                  {stat}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("All");
                setStatusFilter("All");
              }}
              className="px-3 py-2 text-[11px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Table (General Ledger pattern) */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-[11px] font-medium text-white uppercase tracking-wider">Contractor</th>
              <th className="px-6 py-3 text-left text-[11px] font-medium text-white uppercase tracking-wider">Contract #</th>
              <th className="px-6 py-3 text-left text-[11px] font-medium text-white uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-right text-[11px] font-medium text-white uppercase tracking-wider">Total Contract</th>
              <th className="px-6 py-3 text-right text-[11px] font-medium text-white uppercase tracking-wider">Total Paid</th>
              <th className="px-6 py-3 text-right text-[11px] font-medium text-white uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-center text-[11px] font-medium text-white uppercase tracking-wider">Tasks</th>
              <th className="px-6 py-3 text-center text-[11px] font-medium text-white uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-[11px] font-medium text-white uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Users size={32} className="text-slate-300" />
                    <p className="text-sm text-slate-500">No contractors found</p>
                    {hasActiveFilters && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setCategoryFilter("All");
                          setStatusFilter("All");
                        }}
                        className="text-[11px] text-blue-600 hover:underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((contractor, idx) => (
                <tr
                  key={contractor.id}
                  onClick={() => onViewDetails(contractor.id)}
                  className={`border-b border-slate-100 hover:bg-blue-50 cursor-pointer transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                  }`}
                >
                  <td className="px-6 py-3">
                    <div>
                      <p className="text-sm text-slate-900 font-medium">{contractor.name}</p>
                      <p className="text-[11px] text-slate-500">{contractor.company}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-[11px] text-blue-600 font-mono">{contractor.contractNumber}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-[11px] text-slate-700">{contractor.category}</span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span className="text-sm text-slate-900 font-medium">{formatCurrency(contractor.totalContract)}</span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span className="text-sm text-green-700 font-medium">{formatCurrency(contractor.totalPaid)}</span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span className={`text-sm font-medium ${contractor.balance > 0 ? "text-amber-700" : "text-slate-400"}`}>
                      {formatCurrency(contractor.balance)}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[11px] text-green-600 font-medium">{contractor.activeTasks} active</span>
                      <span className="text-[11px] text-slate-400">/ {contractor.completedTasks} done</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">{getStatusBadge(contractor.status)}</td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(contractor.id);
                      }}
                      className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <ChevronRight size={16} className="text-slate-600" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
