import { useState } from "react";
import { Search, Download, Eye, MoreHorizontal, ChevronLeft, ChevronRight, Plus, FileText, Wand2 } from "lucide-react";
import { cn } from "../lib/utils";

interface Template {
  id: string;
  name: string;
  category: "Logo" | "Form Template" | "Standard Policy" | "Letter Template" | "Report Template";
  description: string;
  lastModified: string;
  modifiedBy: string;
  usageCount: number;
  version: string;
  fileFormat: string;
}

const mockTemplates: Template[] = [
  {
    id: "TPL-000",
    name: "Project Concept Note Template",
    category: "Form Template",
    description: "Standard concept note template for project inception and planning phase",
    lastModified: "Feb 2, 2026",
    modifiedBy: "PMO Office",
    usageCount: 328,
    version: "v3.5",
    fileFormat: "DOCX"
  },
  {
    id: "TPL-001",
    name: "Organization Letterhead",
    category: "Logo",
    description: "Official letterhead with organization logo and branding",
    lastModified: "Jan 20, 2026",
    modifiedBy: "Design Team",
    usageCount: 245,
    version: "v3.2",
    fileFormat: "PNG, SVG"
  },
  {
    id: "TPL-002",
    name: "Proposal Cover Page Template",
    category: "Form Template",
    description: "Standard cover page template for donor proposals",
    lastModified: "Jan 15, 2026",
    modifiedBy: "Sarah Johnson",
    usageCount: 187,
    version: "v2.0",
    fileFormat: "DOCX"
  },
  {
    id: "TPL-003",
    name: "Budget Breakdown Form",
    category: "Form Template",
    description: "Detailed budget breakdown template for project proposals",
    lastModified: "Jan 10, 2026",
    modifiedBy: "Michael Chen",
    usageCount: 156,
    version: "v1.8",
    fileFormat: "XLSX"
  },
  {
    id: "TPL-004",
    name: "Safeguarding Policy",
    category: "Standard Policy",
    description: "Organization-wide safeguarding and protection policy",
    lastModified: "Dec 28, 2025",
    modifiedBy: "Emily Davis",
    usageCount: 89,
    version: "v4.1",
    fileFormat: "PDF"
  },
  {
    id: "TPL-005",
    name: "Monitoring & Evaluation Framework",
    category: "Form Template",
    description: "Standard M&E framework template with indicators",
    lastModified: "Dec 20, 2025",
    modifiedBy: "David Wilson",
    usageCount: 134,
    version: "v2.5",
    fileFormat: "DOCX"
  },
  {
    id: "TPL-006",
    name: "Partner MoU Template",
    category: "Letter Template",
    description: "Memorandum of Understanding template for partnerships",
    lastModified: "Dec 15, 2025",
    modifiedBy: "Sarah Johnson",
    usageCount: 67,
    version: "v1.9",
    fileFormat: "DOCX"
  },
  {
    id: "TPL-007",
    name: "Quarterly Report Template",
    category: "Report Template",
    description: "Standard quarterly progress report for donors",
    lastModified: "Dec 10, 2025",
    modifiedBy: "Michael Chen",
    usageCount: 203,
    version: "v3.0",
    fileFormat: "DOCX"
  },
  {
    id: "TPL-008",
    name: "Anti-Corruption Policy",
    category: "Standard Policy",
    description: "Anti-corruption and fraud prevention policy",
    lastModified: "Nov 30, 2025",
    modifiedBy: "Emily Davis",
    usageCount: 78,
    version: "v2.3",
    fileFormat: "PDF"
  },
  {
    id: "TPL-009",
    name: "Concept Note Template",
    category: "Form Template",
    description: "Standard concept note template for initial proposals",
    lastModified: "Nov 25, 2025",
    modifiedBy: "David Wilson",
    usageCount: 142,
    version: "v1.7",
    fileFormat: "DOCX"
  },
  {
    id: "TPL-010",
    name: "Official Seal & Stamp",
    category: "Logo",
    description: "Digital version of official organizational seal",
    lastModified: "Nov 15, 2025",
    modifiedBy: "Design Team",
    usageCount: 312,
    version: "v1.5",
    fileFormat: "PNG, SVG"
  },
];

export function TemplateEngine() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [generateFormData, setGenerateFormData] = useState({
    projectName: "",
    donor: "",
    proposalDate: "",
    budgetAmount: ""
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Logo":
        return "bg-purple-100 text-purple-700";
      case "Form Template":
        return "bg-blue-100 text-blue-700";
      case "Standard Policy":
        return "bg-emerald-100 text-emerald-700";
      case "Letter Template":
        return "bg-amber-100 text-amber-700";
      case "Report Template":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

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
    if (action === "Generate") {
      const template = mockTemplates.find(t => t.id === templateId);
      setSelectedTemplate(template || null);
      setShowGenerateModal(true);
    } else {
      console.log(`${action} template ${templateId}`);
    }
    setActiveDropdown(null);
  };

  const handleGenerateDocument = () => {
    console.log("Generating document with data:", generateFormData);
    setShowGenerateModal(false);
    setGenerateFormData({
      projectName: "",
      donor: "",
      proposalDate: "",
      budgetAmount: ""
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Template Engine</h1>
            <p className="text-sm text-slate-600 mt-1">Logos, form templates, and standard policies with document generation</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0900a5] transition-colors">
            <Plus size={18} />
            <span>Upload Template</span>
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
            <option>Logo</option>
            <option>Form Template</option>
            <option>Standard Policy</option>
            <option>Letter Template</option>
            <option>Report Template</option>
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
              <th className="px-6 py-4 text-left text-xs text-white">Format</th>
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
                <td className="px-6 py-4">
                  <span className={cn("inline-block px-3 py-1 rounded text-xs font-medium", getCategoryColor(template.category))}>
                    {template.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-[12px] text-slate-600 max-w-xs">{template.description}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{template.lastModified}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{template.modifiedBy}</td>
                <td className="px-6 py-4 text-[12px] text-slate-900">{template.usageCount}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{template.version}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{template.fileFormat}</td>
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
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                          <button
                            onClick={() => handleAction("Generate", template.id)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Wand2 size={14} />
                            Generate Document
                          </button>
                          <button
                            onClick={() => handleAction("View", template.id)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Eye size={14} />
                            View Template
                          </button>
                          <button
                            onClick={() => handleAction("Download", template.id)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Download size={14} />
                            Download
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

      {/* Generate Document Modal */}
      {showGenerateModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-8 py-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Generate Document from Template</h2>
              <p className="text-sm text-slate-600 mt-1">Template: {selectedTemplate.name}</p>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={generateFormData.projectName}
                  onChange={(e) => setGenerateFormData({ ...generateFormData, projectName: e.target.value })}
                  placeholder="Enter project name"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Donor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={generateFormData.donor}
                  onChange={(e) => setGenerateFormData({ ...generateFormData, donor: e.target.value })}
                  placeholder="Enter donor name"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Proposal Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={generateFormData.proposalDate}
                    onChange={(e) => setGenerateFormData({ ...generateFormData, proposalDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Budget Amount
                  </label>
                  <input
                    type="text"
                    value={generateFormData.budgetAmount}
                    onChange={(e) => setGenerateFormData({ ...generateFormData, budgetAmount: e.target.value })}
                    placeholder="$0.00"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This will generate a pre-filled document based on the template. You can edit the document after generation.
                </p>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-slate-200 flex items-center justify-end gap-4">
              <button
                onClick={() => {
                  setShowGenerateModal(false);
                  setGenerateFormData({
                    projectName: "",
                    donor: "",
                    proposalDate: "",
                    budgetAmount: ""
                  });
                }}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateDocument}
                className="px-6 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0900a5] transition-colors flex items-center gap-2"
              >
                <Wand2 size={16} />
                Generate Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TemplateEngine;