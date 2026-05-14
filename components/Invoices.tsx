import { useState } from "react";
import { Search, Download, Upload, ChevronDown, MoreHorizontal, Plus, X } from "lucide-react";
import { InvoiceDetailsView } from "./InvoiceDetailsView";

interface Invoice {
  id: string;
  invoiceNumber: string;
  poNumber: string;
  supplier: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  amountPaid: number;
  status: string;
}

const SUPPLIERS = ["All Suppliers", "Tech Solutions Inc.", "Office Depot Ltd.", "Global Services Co.", "Premier Supplies"];
const STATUSES = ["All Statuses", "Pending", "Approved", "Paid", "Overdue", "Cancelled"];

export function Invoices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("All Suppliers");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [newInvoiceForm, setNewInvoiceForm] = useState({
    poNumber: "",
    supplier: "",
    invoiceDate: "",
    dueDate: "",
    amount: ""
  });
  const [showFormSupplierDropdown, setShowFormSupplierDropdown] = useState(false);

  const invoices: Invoice[] = [
    { id: "1", invoiceNumber: "INV-2024-001", poNumber: "PO-2024-156", supplier: "Tech Solutions Inc.", invoiceDate: "2024-12-01", dueDate: "2024-12-31", amount: 45600, amountPaid: 0, status: "Pending" },
    { id: "2", invoiceNumber: "INV-2024-002", poNumber: "PO-2024-157", supplier: "Office Depot Ltd.", invoiceDate: "2024-11-28", dueDate: "2024-12-28", amount: 12300, amountPaid: 12300, status: "Paid" },
    { id: "3", invoiceNumber: "INV-2024-003", poNumber: "PO-2024-158", supplier: "Global Services Co.", invoiceDate: "2024-11-25", dueDate: "2024-12-25", amount: 78900, amountPaid: 0, status: "Approved" },
    { id: "4", invoiceNumber: "INV-2024-004", poNumber: "PO-2024-159", supplier: "Premier Supplies", invoiceDate: "2024-11-20", dueDate: "2024-12-20", amount: 23400, amountPaid: 23400, status: "Paid" },
    { id: "5", invoiceNumber: "INV-2024-005", poNumber: "PO-2024-160", supplier: "Tech Solutions Inc.", invoiceDate: "2024-11-22", dueDate: "2024-11-29", amount: 56700, amountPaid: 0, status: "Overdue" },
    { id: "6", invoiceNumber: "INV-2024-006", poNumber: "PO-2024-161", supplier: "Office Depot Ltd.", invoiceDate: "2024-11-15", dueDate: "2024-12-15", amount: 8900, amountPaid: 8900, status: "Paid" },
    { id: "7", invoiceNumber: "INV-2024-007", poNumber: "PO-2024-162", supplier: "Global Services Co.", invoiceDate: "2024-11-30", dueDate: "2024-12-30", amount: 34500, amountPaid: 0, status: "Pending" },
    { id: "8", invoiceNumber: "INV-2024-008", poNumber: "PO-2024-163", supplier: "Premier Supplies", invoiceDate: "2024-11-10", dueDate: "2024-12-10", amount: 19800, amountPaid: 0, status: "Cancelled" },
  ];

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) || inv.poNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSupplier = selectedSupplier === "All Suppliers" || inv.supplier === selectedSupplier;
    const matchesStatus = selectedStatus === "All Statuses" || inv.status === selectedStatus;
    return matchesSearch && matchesSupplier && matchesStatus;
  });

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-50 text-green-600";
      case "Pending": return "bg-orange-50 text-orange-600";
      case "Approved": return "bg-blue-50 text-blue-600";
      case "Overdue": return "bg-red-50 text-red-600";
      case "Cancelled": return "bg-slate-50 text-slate-600";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  const handleAddInvoice = () => {
    console.log("Adding invoice:", newInvoiceForm);
    setNewInvoiceForm({
      poNumber: "",
      supplier: "",
      invoiceDate: "",
      dueDate: "",
      amount: ""
    });
    setShowAddModal(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Show details view when an invoice is selected */}
      {showDetailView && selectedInvoice ? (
        <InvoiceDetailsView 
          invoice={selectedInvoice} 
          onBack={() => {
            setShowDetailView(false);
            setSelectedInvoice(null);
          }} 
        />
      ) : (
        <>
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-slate-900">Invoices</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus size={16} />
              Add new
            </button>
          </div>

          <div className="px-6 py-4 bg-white border-b border-slate-200">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
                <Search size={20} className="text-slate-400" />
                <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400" />
              </div>

              <div className="flex items-center gap-2.5">
                <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
                  <span className="text-sm text-slate-900">Export</span>
                  <Download size={16} className="text-purple-700" />
                </button>
                <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
                  <span className="text-sm text-slate-900">Upload CSV</span>
                  <Upload size={16} className="text-purple-700" />
                </button>

                <div className="relative">
                  <button onClick={() => { setShowSupplierDropdown(!showSupplierDropdown); setShowStatusDropdown(false); }} className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
                    <span className="text-sm text-slate-900">{selectedSupplier}</span>
                    <ChevronDown size={16} className="text-purple-700" />
                  </button>
                  {showSupplierDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowSupplierDropdown(false)} />
                      <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                        {SUPPLIERS.map((supplier) => (
                          <button key={supplier} onClick={() => { setSelectedSupplier(supplier); setShowSupplierDropdown(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors">{supplier}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="relative">
                  <button onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowSupplierDropdown(false); }} className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
                    <span className="text-sm text-slate-900">{selectedStatus}</span>
                    <ChevronDown size={16} className="text-purple-700" />
                  </button>
                  {showStatusDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                        {STATUSES.map((status) => (
                          <button key={status} onClick={() => { setSelectedStatus(status); setShowStatusDropdown(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors">{status}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-white">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Invoice #</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">PO Number</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Supplier</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Invoice Date</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Due Date</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Amount</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Amount Paid</th>
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900">{inv.invoiceNumber}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{inv.poNumber}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{inv.supplier}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{formatDate(inv.invoiceDate)}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{formatDate(inv.dueDate)}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{formatCurrency(inv.amount)}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{formatCurrency(inv.amountPaid)}</p></td>
                    <td className="px-4 py-4 text-center"><span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(inv.status)}`}>{inv.status}</span></td>
                    <td className="px-4 py-4 text-center">
                      <div className="relative">
                        <button
                          onClick={() => setOpenActionMenuId(openActionMenuId === inv.id ? null : inv.id)}
                          className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                        >
                          <MoreHorizontal size={20} className="text-blue-800" />
                        </button>
                        {openActionMenuId === inv.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenActionMenuId(null)} />
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                              <button
                                onClick={() => {
                                  setSelectedInvoice(inv);
                                  setShowDetailView(true);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Edit invoice:", inv);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Delete invoice:", inv);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                <ChevronDown size={16} className="rotate-90 text-pink-600" />
              </button>
              <button className="px-3 py-2 text-sm bg-pink-50 text-pink-600 rounded transition-colors">1</button>
              <button className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors">2</button>
              <button onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                <ChevronDown size={16} className="-rotate-90 text-pink-600" />
              </button>
            </div>
          </div>

          {/* Add Invoice Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-[540px] max-h-[90vh] overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900">Add New Invoice</h2>
                  <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                    <X size={20} className="text-slate-500" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      <label className="text-xs text-slate-700 tracking-[-0.24px]">PO Number</label>
                      <input
                        type="text"
                        value={newInvoiceForm.poNumber}
                        onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, poNumber: e.target.value })}
                        placeholder="Enter PO number"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[38px] px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-xs text-slate-700 tracking-[-0.24px]">Supplier</label>
                      <div className="relative">
                        <button
                          onClick={() => setShowFormSupplierDropdown(!showFormSupplierDropdown)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[38px] px-2 py-1.5 flex items-center justify-between"
                        >
                          <span className={`text-sm ${newInvoiceForm.supplier ? 'text-slate-900' : 'text-slate-400'}`}>
                            {newInvoiceForm.supplier || 'Select supplier'}
                          </span>
                          <ChevronDown size={16} className="text-purple-700" />
                        </button>
                        {showFormSupplierDropdown && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowFormSupplierDropdown(false)} />
                            <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-[200px] overflow-y-auto">
                              {SUPPLIERS.slice(1).map((supplier) => (
                                <button
                                  key={supplier}
                                  onClick={() => {
                                    setNewInvoiceForm({ ...newInvoiceForm, supplier });
                                    setShowFormSupplierDropdown(false);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                                >
                                  {supplier}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-xs text-slate-700 tracking-[-0.24px]">Invoice Date</label>
                      <input
                        type="date"
                        value={newInvoiceForm.invoiceDate}
                        onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, invoiceDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[38px] px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-xs text-slate-700 tracking-[-0.24px]">Due Date</label>
                      <input
                        type="date"
                        value={newInvoiceForm.dueDate}
                        onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, dueDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[38px] px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-xs text-slate-700 tracking-[-0.24px]">Amount</label>
                      <input
                        type="number"
                        value={newInvoiceForm.amount}
                        onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, amount: e.target.value })}
                        placeholder="Enter amount"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[38px] px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddInvoice}
                    disabled={!newInvoiceForm.poNumber || !newInvoiceForm.supplier}
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Invoice
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}