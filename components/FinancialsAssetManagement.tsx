import { useState } from "react";
import { Search, Download, Upload, ChevronDown, MoreHorizontal, Plus, X } from "lucide-react";

interface Asset {
  id: string;
  assetId: string;
  assetName: string;
  category: string;
  acquisitionDate: string;
  acquisitionCost: number;
  currentValue: number;
  depreciationMethod: string;
  usefulLife: string;
  status: string;
}

const CATEGORIES = ["All Categories", "Real Estate", "IT Equipment", "Vehicles", "Machinery", "Furniture"];
const STATUSES = ["All Statuses", "Active", "Fully Depreciated", "Disposed"];
const DEPRECIATION_METHODS = ["Straight Line", "Declining Balance", "Units of Production", "Sum of Years Digits"];

export function FinancialsAssetManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state for new asset
  const [newAssetForm, setNewAssetForm] = useState({
    assetName: "",
    category: "",
    acquisitionDate: "",
    acquisitionCost: "",
    depreciationMethod: "",
    usefulLife: "",
    status: "Active"
  });
  const [showFormCategoryDropdown, setShowFormCategoryDropdown] = useState(false);
  const [showFormMethodDropdown, setShowFormMethodDropdown] = useState(false);
  const [showFormStatusDropdown, setShowFormStatusDropdown] = useState(false);

  const assets: Asset[] = [
    {
      id: "1",
      assetId: "AST-2024-001",
      assetName: "Office Building - Main Campus",
      category: "Real Estate",
      acquisitionDate: "2020-01-15",
      acquisitionCost: 2500000,
      currentValue: 2350000,
      depreciationMethod: "Straight Line",
      usefulLife: "40 years",
      status: "Active",
    },
    {
      id: "2",
      assetId: "AST-2024-002",
      assetName: "Dell Server Rack - Data Center",
      category: "IT Equipment",
      acquisitionDate: "2023-03-22",
      acquisitionCost: 85000,
      currentValue: 68000,
      depreciationMethod: "Declining Balance",
      usefulLife: "5 years",
      status: "Active",
    },
    {
      id: "3",
      assetId: "AST-2024-003",
      assetName: "Ford Transit Van Fleet (5 units)",
      category: "Vehicles",
      acquisitionDate: "2022-06-10",
      acquisitionCost: 175000,
      currentValue: 122500,
      depreciationMethod: "Straight Line",
      usefulLife: "7 years",
      status: "Active",
    },
    {
      id: "4",
      assetId: "AST-2024-004",
      assetName: "Manufacturing Equipment Line A",
      category: "Machinery",
      acquisitionDate: "2021-09-05",
      acquisitionCost: 450000,
      currentValue: 315000,
      depreciationMethod: "Units of Production",
      usefulLife: "10 years",
      status: "Active",
    },
    {
      id: "5",
      assetId: "AST-2024-005",
      assetName: "Office Furniture - Floor 3",
      category: "Furniture",
      acquisitionDate: "2023-11-18",
      acquisitionCost: 32000,
      currentValue: 28800,
      depreciationMethod: "Straight Line",
      usefulLife: "7 years",
      status: "Active",
    },
    {
      id: "6",
      assetId: "AST-2024-006",
      assetName: "Warehouse Facility - Zone B",
      category: "Real Estate",
      acquisitionDate: "2019-04-20",
      acquisitionCost: 1800000,
      currentValue: 1620000,
      depreciationMethod: "Straight Line",
      usefulLife: "40 years",
      status: "Active",
    },
    {
      id: "7",
      assetId: "AST-2023-087",
      assetName: "HP Laptop Fleet (50 units)",
      category: "IT Equipment",
      acquisitionDate: "2021-02-14",
      acquisitionCost: 62500,
      currentValue: 18750,
      depreciationMethod: "Declining Balance",
      usefulLife: "3 years",
      status: "Fully Depreciated",
    },
    {
      id: "8",
      assetId: "AST-2024-007",
      assetName: "Forklift - Electric Model",
      category: "Machinery",
      acquisitionDate: "2022-08-30",
      acquisitionCost: 42000,
      currentValue: 31500,
      depreciationMethod: "Straight Line",
      usefulLife: "8 years",
      status: "Active",
    },
  ];

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assetName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || asset.category === selectedCategory;
    const matchesStatus = selectedStatus === "All Statuses" || asset.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-600";
      case "Fully Depreciated":
        return "bg-orange-50 text-orange-600";
      case "Disposed":
        return "bg-red-50 text-red-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const handleAddAsset = () => {
    console.log("Adding asset:", newAssetForm);
    setNewAssetForm({
      assetName: "",
      category: "",
      acquisitionDate: "",
      acquisitionCost: "",
      depreciationMethod: "",
      usefulLife: "",
      status: "Active"
    });
    setShowAddAssetModal(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Asset Management</h1>
        <button
          onClick={() => setShowAddAssetModal(true)}
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={16} />
          Add new
        </button>
      </div>

      {/* Filters Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between gap-3">
          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">Export</span>
              <Download size={16} className="text-purple-700" />
            </button>

            <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">Upload CSV</span>
              <Upload size={16} className="text-purple-700" />
            </button>

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowStatusDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedCategory}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showCategoryDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowCategoryDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown);
                  setShowCategoryDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedStatus}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {STATUSES.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setShowStatusDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Asset ID
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Asset Name
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Category
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Acquisition Date
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Acquisition Cost
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Current Value
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Depreciation
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Useful Life
              </th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Status
              </th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => (
              <tr key={asset.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{asset.assetId}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{asset.assetName}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{asset.category}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{formatDate(asset.acquisitionDate)}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{formatCurrency(asset.acquisitionCost)}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{formatCurrency(asset.currentValue)}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{asset.depreciationMethod}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{asset.usefulLife}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(asset.status)}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <button className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors">
                    <MoreHorizontal size={20} className="text-blue-800" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
          >
            <ChevronDown size={16} className="rotate-90 text-pink-600" />
          </button>
          
          <button className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors">
            1
          </button>
          
          <button className="px-3 py-2 text-sm bg-pink-50 text-pink-600 rounded transition-colors">
            2
          </button>
          
          <button className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors">
            ...
          </button>
          
          <button className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors">
            5
          </button>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
          >
            <ChevronDown size={16} className="-rotate-90 text-pink-600" />
          </button>
        </div>
      </div>

      {/* Add Asset Modal */}
      {showAddAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[540px] max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Add New Asset</h2>
              <button
                onClick={() => setShowAddAssetModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex flex-col gap-6">
                {/* Asset Name */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs text-slate-700 tracking-[-0.24px]">
                    Asset Name
                  </label>
                  <input
                    type="text"
                    value={newAssetForm.assetName}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, assetName: e.target.value })}
                    placeholder="Enter asset name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[38px] px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs text-slate-700 tracking-[-0.24px]">
                    Category
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowFormCategoryDropdown(!showFormCategoryDropdown);
                        setShowFormMethodDropdown(false);
                        setShowFormStatusDropdown(false);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[38px] px-2 py-1.5 flex items-center justify-between"
                    >
                      <span className={`text-sm ${newAssetForm.category ? 'text-slate-900' : 'text-slate-400'}`}>
                        {newAssetForm.category || 'Select category'}
                      </span>
                      <ChevronDown size={16} className="text-purple-700" />
                    </button>
                    {showFormCategoryDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowFormCategoryDropdown(false)} />
                        <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-[200px] overflow-y-auto">
                          {CATEGORIES.slice(1).map((category) => (
                            <button
                              key={category}
                              onClick={() => {
                                setNewAssetForm({ ...newAssetForm, category });
                                setShowFormCategoryDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Acquisition Date */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs text-slate-700 tracking-[-0.24px]">
                    Acquisition Date
                  </label>
                  <input
                    type="date"
                    value={newAssetForm.acquisitionDate}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, acquisitionDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[38px] px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Acquisition Cost */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs text-slate-700 tracking-[-0.24px]">
                    Acquisition Cost
                  </label>
                  <input
                    type="number"
                    value={newAssetForm.acquisitionCost}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, acquisitionCost: e.target.value })}
                    placeholder="Enter cost"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[38px] px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Depreciation Method */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs text-slate-700 tracking-[-0.24px]">
                    Depreciation Method
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowFormMethodDropdown(!showFormMethodDropdown);
                        setShowFormCategoryDropdown(false);
                        setShowFormStatusDropdown(false);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[38px] px-2 py-1.5 flex items-center justify-between"
                    >
                      <span className={`text-sm ${newAssetForm.depreciationMethod ? 'text-slate-900' : 'text-slate-400'}`}>
                        {newAssetForm.depreciationMethod || 'Select method'}
                      </span>
                      <ChevronDown size={16} className="text-purple-700" />
                    </button>
                    {showFormMethodDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowFormMethodDropdown(false)} />
                        <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-[200px] overflow-y-auto">
                          {DEPRECIATION_METHODS.map((method) => (
                            <button
                              key={method}
                              onClick={() => {
                                setNewAssetForm({ ...newAssetForm, depreciationMethod: method });
                                setShowFormMethodDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Useful Life */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs text-slate-700 tracking-[-0.24px]">
                    Useful Life
                  </label>
                  <input
                    type="text"
                    value={newAssetForm.usefulLife}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, usefulLife: e.target.value })}
                    placeholder="e.g., 5 years"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[38px] px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs text-slate-700 tracking-[-0.24px]">
                    Status
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowFormStatusDropdown(!showFormStatusDropdown);
                        setShowFormCategoryDropdown(false);
                        setShowFormMethodDropdown(false);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[38px] px-2 py-1.5 flex items-center justify-between"
                    >
                      <span className="text-sm text-slate-900">
                        {newAssetForm.status}
                      </span>
                      <ChevronDown size={16} className="text-purple-700" />
                    </button>
                    {showFormStatusDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowFormStatusDropdown(false)} />
                        <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                          {STATUSES.slice(1).map((status) => (
                            <button
                              key={status}
                              onClick={() => {
                                setNewAssetForm({ ...newAssetForm, status });
                                setShowFormStatusDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddAssetModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAsset}
                disabled={!newAssetForm.assetName || !newAssetForm.category}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}