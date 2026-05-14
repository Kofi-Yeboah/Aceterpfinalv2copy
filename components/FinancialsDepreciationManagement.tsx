import { useState } from "react";
import { Search, Download, Upload, ChevronDown, MoreHorizontal, Calculator } from "lucide-react";

interface DepreciationRecord {
  id: string;
  assetId: string;
  assetName: string;
  category: string;
  depreciationMethod: string;
  acquisitionCost: number;
  salvageValue: number;
  accumulatedDepreciation: number;
  currentBookValue: number;
  monthlyDepreciation: number;
  remainingLife: string;
  lastDepreciationDate: string;
}

const METHODS = ["All Methods", "Straight Line", "Declining Balance", "Units of Production", "Sum of Years Digits"];
const CATEGORIES = ["All Categories", "Real Estate", "IT Equipment", "Vehicles", "Machinery", "Furniture"];

export function FinancialsDepreciationManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("All Methods");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const depreciationRecords: DepreciationRecord[] = [
    {
      id: "1",
      assetId: "AST-2024-001",
      assetName: "Office Building - Main Campus",
      category: "Real Estate",
      depreciationMethod: "Straight Line",
      acquisitionCost: 2500000,
      salvageValue: 500000,
      accumulatedDepreciation: 250000,
      currentBookValue: 2250000,
      monthlyDepreciation: 4166.67,
      remainingLife: "35 years",
      lastDepreciationDate: "2024-11-30",
    },
    {
      id: "2",
      assetId: "AST-2024-002",
      assetName: "Dell Server Rack - Data Center",
      category: "IT Equipment",
      depreciationMethod: "Declining Balance",
      acquisitionCost: 85000,
      salvageValue: 5000,
      accumulatedDepreciation: 22100,
      currentBookValue: 62900,
      monthlyDepreciation: 2093.33,
      remainingLife: "3.2 years",
      lastDepreciationDate: "2024-11-30",
    },
    {
      id: "3",
      assetId: "AST-2024-003",
      assetName: "Ford Transit Van Fleet (5 units)",
      category: "Vehicles",
      depreciationMethod: "Straight Line",
      acquisitionCost: 175000,
      salvageValue: 35000,
      accumulatedDepreciation: 50000,
      currentBookValue: 125000,
      monthlyDepreciation: 1666.67,
      remainingLife: "4.5 years",
      lastDepreciationDate: "2024-11-30",
    },
    {
      id: "4",
      assetId: "AST-2024-004",
      assetName: "Manufacturing Equipment Line A",
      category: "Machinery",
      depreciationMethod: "Units of Production",
      acquisitionCost: 450000,
      salvageValue: 50000,
      accumulatedDepreciation: 120000,
      currentBookValue: 330000,
      monthlyDepreciation: 3333.33,
      remainingLife: "7 years",
      lastDepreciationDate: "2024-11-30",
    },
    {
      id: "5",
      assetId: "AST-2024-005",
      assetName: "Office Furniture - Floor 3",
      category: "Furniture",
      depreciationMethod: "Straight Line",
      acquisitionCost: 32000,
      salvageValue: 3200,
      accumulatedDepreciation: 4114.29,
      currentBookValue: 27885.71,
      monthlyDepreciation: 342.86,
      remainingLife: "5.9 years",
      lastDepreciationDate: "2024-11-30",
    },
    {
      id: "6",
      assetId: "AST-2024-006",
      assetName: "Warehouse Facility - Zone B",
      category: "Real Estate",
      depreciationMethod: "Straight Line",
      acquisitionCost: 1800000,
      salvageValue: 360000,
      accumulatedDepreciation: 198000,
      currentBookValue: 1602000,
      monthlyDepreciation: 3000,
      remainingLife: "34.5 years",
      lastDepreciationDate: "2024-11-30",
    },
    {
      id: "7",
      assetId: "AST-2023-087",
      assetName: "HP Laptop Fleet (50 units)",
      category: "IT Equipment",
      depreciationMethod: "Declining Balance",
      acquisitionCost: 62500,
      salvageValue: 6250,
      accumulatedDepreciation: 50625,
      currentBookValue: 11875,
      monthlyDepreciation: 395.83,
      remainingLife: "0.5 years",
      lastDepreciationDate: "2024-11-30",
    },
    {
      id: "8",
      assetId: "AST-2024-007",
      assetName: "Forklift - Electric Model",
      category: "Machinery",
      depreciationMethod: "Straight Line",
      acquisitionCost: 42000,
      salvageValue: 4200,
      accumulatedDepreciation: 11137.50,
      currentBookValue: 30862.50,
      monthlyDepreciation: 393.75,
      remainingLife: "5.6 years",
      lastDepreciationDate: "2024-11-30",
    },
    {
      id: "9",
      assetId: "AST-2023-045",
      assetName: "Conference Room Equipment",
      category: "IT Equipment",
      depreciationMethod: "Straight Line",
      acquisitionCost: 28000,
      salvageValue: 2800,
      accumulatedDepreciation: 10500,
      currentBookValue: 17500,
      monthlyDepreciation: 350,
      remainingLife: "3.5 years",
      lastDepreciationDate: "2024-11-30",
    },
    {
      id: "10",
      assetId: "AST-2022-078",
      assetName: "Delivery Truck - Heavy Duty",
      category: "Vehicles",
      depreciationMethod: "Declining Balance",
      acquisitionCost: 95000,
      salvageValue: 15000,
      accumulatedDepreciation: 38000,
      currentBookValue: 57000,
      monthlyDepreciation: 1266.67,
      remainingLife: "3 years",
      lastDepreciationDate: "2024-11-30",
    },
  ];

  const filteredRecords = depreciationRecords.filter((record) => {
    const matchesSearch =
      record.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.assetName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = selectedMethod === "All Methods" || record.depreciationMethod === selectedMethod;
    const matchesCategory = selectedCategory === "All Categories" || record.category === selectedCategory;
    return matchesSearch && matchesMethod && matchesCategory;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Depreciation Management</h1>
        <button className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2">
          <Calculator size={16} />
          Calculate Depreciation
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

            {/* Method Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowMethodDropdown(!showMethodDropdown);
                  setShowCategoryDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[140px]"
              >
                <span className="text-sm text-slate-900 truncate">{selectedMethod}</span>
                <ChevronDown size={16} className="text-purple-700 flex-shrink-0" />
              </button>
              {showMethodDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMethodDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
                    {METHODS.map((method) => (
                      <button
                        key={method}
                        onClick={() => {
                          setSelectedMethod(method);
                          setShowMethodDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowMethodDropdown(false);
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
                Method
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Acquisition Cost
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Accumulated Depr.
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Book Value
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Monthly Depr.
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Remaining Life
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Last Depr. Date
              </th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{record.assetId}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{record.assetName}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{record.category}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{record.depreciationMethod}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{formatCurrency(record.acquisitionCost)}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-red-600">{formatCurrency(record.accumulatedDepreciation)}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{formatCurrency(record.currentBookValue)}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-orange-600">{formatCurrency(record.monthlyDepreciation)}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{record.remainingLife}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{formatDate(record.lastDepreciationDate)}</p>
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
    </div>
  );
}