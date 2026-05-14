import { useState } from "react";
import { Search, Download, ChevronDown, Plus, Calendar, MoreHorizontal, X } from "lucide-react";

interface Expenditure {
  id: number;
  referenceNo: string;
  date: string;
  vendor: string;
  category: string;
  description: string;
  amount: string;
  budget: string;
  status: "Approved" | "Pending" | "Rejected";
  paymentStatus: "Paid" | "Unpaid" | "Partial";
}

const initialExpenditureData: Expenditure[] = [
  { id: 1, referenceNo: "EXP-2024-001", date: "Dec 01, 2024", vendor: "Office Supplies Co.", category: "Office Expenses", description: "Monthly office supplies", amount: "$12,450", budget: "Operations", status: "Approved", paymentStatus: "Paid" },
  { id: 2, referenceNo: "EXP-2024-002", date: "Nov 28, 2024", vendor: "Tech Solutions Ltd", category: "IT & Software", description: "Software licenses renewal", amount: "$25,000", budget: "IT", status: "Approved", paymentStatus: "Paid" },
  { id: 3, referenceNo: "EXP-2024-003", date: "Nov 25, 2024", vendor: "Healthcare Plus", category: "Employee Benefits", description: "Health insurance premiums", amount: "$45,800", budget: "HR", status: "Approved", paymentStatus: "Paid" },
  { id: 4, referenceNo: "EXP-2024-004", date: "Nov 22, 2024", vendor: "City Properties", category: "Rent & Utilities", description: "Office rent - November", amount: "$18,500", budget: "Operations", status: "Approved", paymentStatus: "Paid" },
  { id: 5, referenceNo: "EXP-2024-005", date: "Nov 20, 2024", vendor: "Marketing Agency", category: "Marketing", description: "Campaign development", amount: "$32,000", budget: "Marketing", status: "Pending", paymentStatus: "Unpaid" },
  { id: 6, referenceNo: "EXP-2024-006", date: "Nov 18, 2024", vendor: "Training Institute", category: "Training", description: "Staff training program", amount: "$15,600", budget: "HR", status: "Approved", paymentStatus: "Partial" },
  { id: 7, referenceNo: "EXP-2024-007", date: "Nov 15, 2024", vendor: "Transport Services", category: "Travel", description: "Team travel expenses", amount: "$8,750", budget: "Operations", status: "Approved", paymentStatus: "Paid" },
  { id: 8, referenceNo: "EXP-2024-008", date: "Nov 12, 2024", vendor: "Equipment Rentals", category: "Equipment", description: "Conference equipment rental", amount: "$5,200", budget: "Events", status: "Rejected", paymentStatus: "Unpaid" },
];

export function ExpenditureManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All Payment Statuses");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [expenditureData, setExpenditureData] = useState<Expenditure[]>(initialExpenditureData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    referenceNo: "",
    date: "",
    vendor: "",
    category: "",
    description: "",
    amount: "",
    budget: "",
  });

  const generateReferenceNo = () => {
    const nextId = expenditureData.length + 1;
    return `EXP-2024-${String(nextId).padStart(3, "0")}`;
  };

  const handleOpenModal = () => {
    setFormData({
      referenceNo: generateReferenceNo(),
      date: "",
      vendor: "",
      category: "",
      description: "",
      amount: "",
      budget: "",
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleSubmit = () => {
    const newExpenditure: Expenditure = {
      id: expenditureData.length + 1,
      referenceNo: formData.referenceNo,
      date: new Date(formData.date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      vendor: formData.vendor,
      category: formData.category,
      description: formData.description,
      amount: `$${Number(formData.amount).toLocaleString()}`,
      budget: formData.budget,
      status: "Pending",
      paymentStatus: "Unpaid",
    };
    setExpenditureData([newExpenditure, ...expenditureData]);
    setShowAddModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-50 text-green-700";
      case "Pending": return "bg-yellow-50 text-yellow-700";
      case "Rejected": return "bg-red-50 text-red-700";
      default: return "bg-slate-50 text-slate-700";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-50 text-green-700";
      case "Unpaid": return "bg-red-50 text-red-700";
      case "Partial": return "bg-orange-50 text-orange-700";
      default: return "bg-slate-50 text-slate-700";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Expenditure Management</h1>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by reference, vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedCategory}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedStatus}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Payment Status Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[180px] justify-between">
              <span>{selectedPaymentStatus}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <Calendar className="w-4 h-4" />
              <span>{dateRange}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm text-white hover:opacity-90 transition-opacity flex items-center gap-2"
              style={{ backgroundColor: "#0B01D0" }}
              onClick={handleOpenModal}
            >
              <Plus className="w-4 h-4" />
              New Expenditure
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Reference No.</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Date</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Vendor</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Category</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Description</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Amount</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Payment</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenditureData.map((expenditure) => (
              <tr key={expenditure.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{expenditure.referenceNo}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{expenditure.date}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{expenditure.vendor}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{expenditure.category}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{expenditure.description}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] font-medium text-slate-900">{expenditure.amount}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(expenditure.status)}`}>
                    {expenditure.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getPaymentStatusColor(expenditure.paymentStatus)}`}>
                    {expenditure.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Expenditure Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
              <div>
                <h3 className="text-[16px] text-slate-900">New Expenditure</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{formData.referenceNo}</p>
              </div>
              <button onClick={handleCloseModal} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Vendor */}
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Vendor</label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  placeholder="Enter vendor name"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Category + Budget */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select category</option>
                    <option value="Office Expenses">Office Expenses</option>
                    <option value="IT & Software">IT & Software</option>
                    <option value="Employee Benefits">Employee Benefits</option>
                    <option value="Rent & Utilities">Rent & Utilities</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Training">Training</option>
                    <option value="Travel">Travel</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Budget</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select budget</option>
                    <option value="Operations">Operations</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Description */}
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="border-t border-slate-100" />

              {/* Amount + Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Info box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-[11px] text-blue-700">Expenditures will be submitted for approval. Once approved, they will be processed for payment against the selected budget.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg text-[13px] text-white hover:bg-purple-800 transition-colors bg-purple-700"
              >
                Add Expenditure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}