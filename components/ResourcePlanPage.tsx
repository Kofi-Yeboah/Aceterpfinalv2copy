interface ResourceItem {
  id: string;
  description: string;
  procurementCategory: string;
  resourceName: string;
  unitType: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  expectedDate: string;
  fundSource?: string;
}

// Mock data - in real app, this would come from the budget builder
// Filtering only internal procurement items (staff labour, internal assets, operational overhead)
const MOCK_INTERNAL_RESOURCES: ResourceItem[] = [
  {
    id: "R001",
    description: "Project Manager - Full Time",
    procurementCategory: "Staff Labour",
    resourceName: "Senior Project Manager",
    unitType: "Month",
    quantity: 6,
    unitCost: 8000,
    totalCost: 48000,
    expectedDate: "2026-01-15",
    fundSource: "FUND-EDU-001"
  },
  {
    id: "R002",
    description: "Field Research Assistants",
    procurementCategory: "Staff Labour",
    resourceName: "Research Assistant (3 persons)",
    unitType: "Month",
    quantity: 4,
    unitCost: 4500,
    totalCost: 18000,
    expectedDate: "2026-02-01",
    fundSource: "FUND-HLT-002"
  },
  {
    id: "R003",
    description: "Project Vehicle - 4x4 SUV",
    procurementCategory: "Internal Asset",
    resourceName: "Toyota Land Cruiser",
    unitType: "Unit",
    quantity: 1,
    unitCost: 45000,
    totalCost: 45000,
    expectedDate: "2026-01-20",
    fundSource: "FUND-ENV-005"
  },
  {
    id: "R004",
    description: "Office Space Rental",
    procurementCategory: "Operational Overhead",
    resourceName: "Regional Office - Accra",
    unitType: "Month",
    quantity: 6,
    unitCost: 2500,
    totalCost: 15000,
    expectedDate: "2026-01-10",
    fundSource: "FUND-YOU-004"
  },
  {
    id: "R005",
    description: "IT Equipment - Laptops",
    procurementCategory: "Internal Asset",
    resourceName: "Dell Latitude 5520",
    unitType: "Unit",
    quantity: 5,
    unitCost: 1200,
    totalCost: 6000,
    expectedDate: "2026-01-25",
    fundSource: "FUND-TEC-006"
  },
  {
    id: "R006",
    description: "Data Analyst",
    procurementCategory: "Staff Labour",
    resourceName: "Senior Data Analyst",
    unitType: "Month",
    quantity: 3,
    unitCost: 6500,
    totalCost: 19500,
    expectedDate: "2026-03-01",
    fundSource: "FUND-EDU-001"
  },
  {
    id: "R007",
    description: "Utilities and Internet",
    procurementCategory: "Operational Overhead",
    resourceName: "Office Utilities Package",
    unitType: "Month",
    quantity: 6,
    unitCost: 800,
    totalCost: 4800,
    expectedDate: "2026-01-10",
    fundSource: "FUND-YOU-004"
  }
];

export function ResourcePlanPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const totalBudget = MOCK_INTERNAL_RESOURCES.reduce((sum, item) => sum + item.totalCost, 0);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-slate-900">Resource Plan</h1>
            <p className="text-sm text-slate-600 mt-1">
              Internal procurement items including staff, assets, and operational overhead
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Total Budget</p>
            <p className="text-2xl font-semibold text-slate-900">{formatCurrency(totalBudget)}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-[12px] text-slate-600 mb-1">Staff Labour</p>
            <p className="text-xl font-semibold text-slate-900">
              {formatCurrency(
                MOCK_INTERNAL_RESOURCES
                  .filter(r => r.procurementCategory === "Staff Labour")
                  .reduce((sum, r) => sum + r.totalCost, 0)
              )}
            </p>
            <p className="text-[12px] text-slate-500 mt-1">
              {MOCK_INTERNAL_RESOURCES.filter(r => r.procurementCategory === "Staff Labour").length} positions
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-[12px] text-slate-600 mb-1">Internal Assets</p>
            <p className="text-xl font-semibold text-slate-900">
              {formatCurrency(
                MOCK_INTERNAL_RESOURCES
                  .filter(r => r.procurementCategory === "Internal Asset")
                  .reduce((sum, r) => sum + r.totalCost, 0)
              )}
            </p>
            <p className="text-[12px] text-slate-500 mt-1">
              {MOCK_INTERNAL_RESOURCES.filter(r => r.procurementCategory === "Internal Asset").length} assets
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-[12px] text-slate-600 mb-1">Operational Overhead</p>
            <p className="text-xl font-semibold text-slate-900">
              {formatCurrency(
                MOCK_INTERNAL_RESOURCES
                  .filter(r => r.procurementCategory === "Operational Overhead")
                  .reduce((sum, r) => sum + r.totalCost, 0)
              )}
            </p>
            <p className="text-[12px] text-slate-500 mt-1">
              {MOCK_INTERNAL_RESOURCES.filter(r => r.procurementCategory === "Operational Overhead").length} items
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Description</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Category</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Resource Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Unit Type</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Quantity</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Unit Cost</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Total Cost</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Expected Date</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Fund Source</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_INTERNAL_RESOURCES.map((resource) => (
              <tr key={resource.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{resource.description}</p>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[12px] font-medium bg-blue-50 text-blue-700">
                    {resource.procurementCategory}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{resource.resourceName}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{resource.unitType}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] text-slate-900">{resource.quantity}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] text-slate-900">{formatCurrency(resource.unitCost)}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] font-semibold text-slate-900">{formatCurrency(resource.totalCost)}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{formatDate(resource.expectedDate)}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{resource.fundSource || "-"}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
