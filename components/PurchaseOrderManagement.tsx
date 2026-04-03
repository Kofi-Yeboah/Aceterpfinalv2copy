import { useState, useEffect } from "react";
import { Search, Download, Upload, ChevronDown, MoreHorizontal, CheckCircle2, Clock, PenLine, Truck } from "lucide-react";
import { PurchaseOrderDetailsView } from "./PurchaseOrderDetailsView";
import { getGeneratedPOs, subscribe, type POStatus } from "../lib/procurementStore";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  itemDescription: string;
  orderDate: string;
  deliveryDate: string;
  amount: number;
  sourcePR: string;
  projectName: string;
  status?: POStatus;
  signedBy?: string;
  signedAt?: string;
  signatureAuthority?: string;
}

const VENDORS = ["All Vendors", "Dr. Kwesi Appiah", "PrintWorks Ghana Ltd", "La Palm Royal Beach Hotel", "Dell Inc. (via Telefonika Ghana)", "CreativeEdge Designs", "MedSupply GH", "Acer Distributors", "Prof. Ama Benyiwa", "University of Ghana", "Ghana Research Associates"];
const PROJECTS = ["All Projects", "Youth Employment Skills Development", "Digital Literacy Initiative", "Community Health Project"];

export function PurchaseOrderManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("All Vendors");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Force re-render when store changes (new POs from approved sourcing)
  const [, setTick] = useState(0);
  useEffect(() => {
    return subscribe(() => setTick((t) => t + 1));
  }, []);

  // POs from the shared procurement store (auto-generated from approved sourcing)
  const storePOs = getGeneratedPOs();

  const purchaseOrders: PurchaseOrder[] = storePOs.map((po) => ({
    id: po.id,
    poNumber: po.poNumber,
    vendor: po.vendor,
    itemDescription: po.itemDescription,
    orderDate: po.orderDate,
    deliveryDate: po.deliveryDate,
    amount: po.amount,
    sourcePR: po.sourcePR,
    projectName: po.projectName,
    status: po.status,
    signedBy: po.signedBy,
    signedAt: po.signedAt,
    signatureAuthority: po.signatureAuthority,
  }));

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch = po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) || po.itemDescription.toLowerCase().includes(searchQuery.toLowerCase()) || po.sourcePR.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVendor = selectedVendor === "All Vendors" || po.vendor === selectedVendor;
    const matchesProject = selectedProject === "All Projects" || po.projectName === selectedProject;
    return matchesSearch && matchesVendor && matchesProject;
  });

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Show details view when a PO is selected */}
      {showDetailView && selectedPO ? (
        <PurchaseOrderDetailsView 
          purchaseOrder={selectedPO} 
          onBack={() => {
            setShowDetailView(false);
            setSelectedPO(null);
          }} 
        />
      ) : (
        <>
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-slate-900">Purchase Order Management</h1>
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

                {/* Vendor Filter */}
                <div className="relative">
                  <button onClick={() => { setShowVendorDropdown(!showVendorDropdown); setShowProjectDropdown(false); }} className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
                    <span className="text-sm text-slate-900">{selectedVendor}</span>
                    <ChevronDown size={16} className="text-purple-700" />
                  </button>
                  {showVendorDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowVendorDropdown(false)} />
                      <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden max-h-[300px] overflow-y-auto">
                        {VENDORS.map((vendor) => (
                          <button key={vendor} onClick={() => { setSelectedVendor(vendor); setShowVendorDropdown(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors">{vendor}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Project Filter */}
                <div className="relative">
                  <button onClick={() => { setShowProjectDropdown(!showProjectDropdown); setShowVendorDropdown(false); }} className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
                    <span className="text-sm text-slate-900">{selectedProject}</span>
                    <ChevronDown size={16} className="text-purple-700" />
                  </button>
                  {showProjectDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowProjectDropdown(false)} />
                      <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                        {PROJECTS.map((project) => (
                          <button key={project} onClick={() => { setSelectedProject(project); setShowProjectDropdown(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors">{project}</button>
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
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">PO Number</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Source PR</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Project</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Vendor</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Item Description</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Order Date</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Delivery Date</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Amount</th>
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Status</th>
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPOs.map((po, index) => (
                  <tr key={po.id} className={`border-b border-slate-100 hover:bg-slate-50 ${index % 2 === 1 ? "bg-slate-50/50" : "bg-white"}`}>
                    <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900">{po.poNumber}</p></td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-xl text-[12px] bg-indigo-50 text-indigo-700">
                        {po.sourcePR}
                      </span>
                    </td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-600">{po.projectName}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{po.vendor}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{po.itemDescription}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{formatDate(po.orderDate)}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{formatDate(po.deliveryDate)}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{formatCurrency(po.amount)}</p></td>
                    <td className="px-4 py-4 text-center">
                      {po.status === "Dispatched" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-green-50 text-green-700">
                          <Truck size={10} /> Dispatched
                        </span>
                      ) : po.status === "Signed" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">
                          <CheckCircle2 size={10} /> Signed
                        </span>
                      ) : po.status === "Pending Signature" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-amber-50 text-amber-700">
                          <Clock size={10} /> Pending Sig.
                        </span>
                      ) : po.status === "Draft" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-blue-50 text-blue-700">
                          <PenLine size={10} /> Draft
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="relative">
                        <button
                          onClick={() => setOpenActionMenuId(openActionMenuId === po.id ? null : po.id)}
                          className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                        >
                          <MoreHorizontal size={20} className="text-blue-800" />
                        </button>
                        {openActionMenuId === po.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenActionMenuId(null)} />
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                              <button
                                onClick={() => {
                                  setSelectedPO(po);
                                  setShowDetailView(true);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Edit PO:", po);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Delete PO:", po);
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

        </>
      )}
    </div>
  );
}
