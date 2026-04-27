import { useState } from "react";
import { Search, Plus, Edit, Copy, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { cn } from "../lib/utils";

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  lastModified: string;
  modifiedBy: string;
  usageCount: number;
  version: string;
}

const mockTemplates: Template[] = [
  {
    id: "TPL-001",
    name: "Standard NDA",
    category: "Non-Disclosure",
    description: "Standard non-disclosure agreement for vendors and partners",
    lastModified: "Jan 15, 2026",
    modifiedBy: "David Wilson",
    usageCount: 45,
    version: "v2.1"
  },
  {
    id: "TPL-002",
    name: "Senior Developer Offer Letter",
    category: "Employment",
    description: "Employment offer letter for senior-level developer positions",
    lastModified: "Jan 10, 2026",
    modifiedBy: "Emily Davis",
    usageCount: 12,
    version: "v1.5"
  },
  {
    id: "TPL-003",
    name: "Junior Staff Offer Letter",
    category: "Employment",
    description: "Employment offer letter for entry-level positions",
    lastModified: "Dec 20, 2025",
    modifiedBy: "Emily Davis",
    usageCount: 28,
    version: "v1.4"
  },
  {
    id: "TPL-004",
    name: "Consultant Agreement",
    category: "Service Agreement",
    description: "Standard agreement for external consultants and contractors",
    lastModified: "Jan 20, 2026",
    modifiedBy: "David Wilson",
    usageCount: 18,
    version: "v3.0"
  },
  {
    id: "TPL-005",
    name: "Vendor Service Agreement",
    category: "Service Agreement",
    description: "General service agreement for recurring vendor services",
    lastModified: "Nov 30, 2025",
    modifiedBy: "David Wilson",
    usageCount: 34,
    version: "v2.3"
  },
  {
    id: "TPL-006",
    name: "Office Lease Agreement",
    category: "Lease",
    description: "Commercial office space lease agreement template",
    lastModified: "Oct 15, 2025",
    modifiedBy: "John Smith",
    usageCount: 3,
    version: "v1.0"
  },
  {
    id: "TPL-007",
    name: "Equipment Lease Agreement",
    category: "Lease",
    description: "Equipment and machinery lease agreement",
    lastModified: "Dec 5, 2025",
    modifiedBy: "John Smith",
    usageCount: 7,
    version: "v1.2"
  },
  {
    id: "TPL-008",
    name: "Software License Agreement",
    category: "Vendor",
    description: "Standard software licensing agreement for vendors",
    lastModified: "Jan 25, 2026",
    modifiedBy: "Michael Chen",
    usageCount: 22,
    version: "v2.0"
  },
  {
    id: "TPL-009",
    name: "Partnership Agreement",
    category: "Partnership",
    description: "Strategic partnership and collaboration agreement",
    lastModified: "Jan 5, 2026",
    modifiedBy: "David Wilson",
    usageCount: 8,
    version: "v1.3"
  },
  {
    id: "TPL-010",
    name: "Independent Contractor Agreement",
    category: "Employment",
    description: "Agreement for independent contractors and freelancers",
    lastModified: "Dec 15, 2025",
    modifiedBy: "Emily Davis",
    usageCount: 15,
    version: "v1.8"
  },
];

export function DraftingTemplates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "",
    description: ""
  });

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All Categories" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalResults = filteredTemplates.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalResults);
  const currentTemplates = filteredTemplates.slice(startIndex, endIndex);

  const handleAction = (action: string, templateId: string) => {
    console.log(`${action} template ${templateId}`);
    setActiveDropdown(null);
  };

  const handleCreateTemplate = () => {
    console.log("Creating template:", newTemplate);
    setShowCreateModal(false);
    setNewTemplate({ name: "", category: "", description: "" });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Drafting & Templates</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0900a5] transition-colors"
          >
            <Plus size={18} />
            <span>Create Template</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
          >
            <option>All Categories</option>
            <option>Employment</option>
            <option>Non-Disclosure</option>
            <option>Service Agreement</option>
            <option>Lease</option>
            <option>Vendor</option>
            <option>Partnership</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#0B01D0]">
              <th className="px-6 py-4 text-left text-xs text-white">Template ID</th>
              <th className="px-6 py-4 text-left text-xs text-white">Template Name</th>
              <th className="px-6 py-4 text-left text-xs text-white">Category</th>
              <th className="px-6 py-4 text-left text-xs text-white">Description</th>
              <th className="px-6 py-4 text-left text-xs text-white">Last Modified</th>
              <th className="px-6 py-4 text-left text-xs text-white">Modified By</th>
              <th className="px-6 py-4 text-left text-xs text-white">Usage Count</th>
              <th className="px-6 py-4 text-left text-xs text-white">Version</th>
              <th className="px-6 py-4 text-left text-xs text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTemplates.map((template, index) => (
              <tr
                key={template.id}
                className={cn(
                  "border-b border-slate-100 hover:bg-slate-50 transition-colors",
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                )}
              >
                <td className="px-6 py-4 text-[12px] font-semibold text-[#0B01D0]">{template.id}</td>
                <td className="px-6 py-4 text-[12px] font-semibold text-slate-900">{template.name}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{template.category}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600 max-w-xs">{template.description}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{template.lastModified}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{template.modifiedBy}</td>
                <td className="px-6 py-4 text-[12px] text-slate-900">{template.usageCount}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{template.version}</td>
                <td className="px-6 py-4">
                  <div className="relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === template.id ? null : template.id)}
                      className="p-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      <MoreHorizontal size={16} className="text-slate-600" />
                    </button>
                    {activeDropdown === template.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                          <button
                            onClick={() => handleAction("Use", template.id)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <FileText size={14} />
                            Use Template
                          </button>
                          <button
                            onClick={() => handleAction("Edit", template.id)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Edit size={14} />
                            Edit Template
                          </button>
                          <button
                            onClick={() => handleAction("Duplicate", template.id)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Copy size={14} />
                            Duplicate
                          </button>
                          <button
                            onClick={() => handleAction("Delete", template.id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 size={14} />
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

      {/* Pagination */}
      <div className="px-8 py-4 border-t border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm text-slate-700"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm text-slate-600">
            {startIndex + 1}-{endIndex} of {totalResults} results
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} className="text-slate-600" />
            </button>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              if (pageNum < 1 || pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    "w-8 h-8 rounded-lg transition-colors text-sm",
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="text-slate-400">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-8 h-8 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors text-sm"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-8 py-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Create New Template</h2>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="e.g., Standard Employment Contract"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="Employment">Employment</option>
                  <option value="Non-Disclosure">Non-Disclosure</option>
                  <option value="Service Agreement">Service Agreement</option>
                  <option value="Lease">Lease</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Brief description of the template..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="px-8 py-6 border-t border-slate-200 flex items-center justify-end gap-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewTemplate({ name: "", category: "", description: "" });
                }}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                className="px-6 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0900a5] transition-colors"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DraftingTemplates;
