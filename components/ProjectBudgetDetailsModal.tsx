import { useState } from "react";
import { X, TrendingUp, TrendingDown, DollarSign, Calendar, User, Briefcase, ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils";

interface ProjectBudget {
  id: number;
  projectName: string;
  projectType: "New Construction" | "Software Implementation" | "R&D" | "Infrastructure";
  projectManager: string;
  startDate: string;
  endDate: string;
  totalBudget: string;
  spent: string;
  remaining: string;
  percentage: number;
  status: "On Track" | "Over Budget" | "Under Budget" | "At Risk";
}

interface ProjectBudgetDetailsModalProps {
  project: ProjectBudget;
  onClose: () => void;
}

interface BudgetTreeItem {
  id: string;
  name: string;
  type: "project" | "phase" | "task" | "cost";
  allocated: string;
  spent: string;
  remaining: string;
  percentage: number;
  level: number;
  children?: BudgetTreeItem[];
  isExpanded?: boolean;
}

// Mock data for tree structure
const budgetTreeData: { [key: number]: BudgetTreeItem } = {
  1: {
    id: "proj-1",
    name: "City Center Redevelopment",
    type: "project",
    allocated: "$5,200,000",
    spent: "$2,850,000",
    remaining: "$2,350,000",
    percentage: 55,
    level: 0,
    isExpanded: true,
    children: [
      {
        id: "phase-1",
        name: "Planning & Design",
        type: "phase",
        allocated: "$2,100,000",
        spent: "$1,150,000",
        remaining: "$950,000",
        percentage: 55,
        level: 1,
        isExpanded: true,
        children: [
          {
            id: "task-1-1",
            name: "Architectural Design",
            type: "task",
            allocated: "$850,000",
            spent: "$465,000",
            remaining: "$385,000",
            percentage: 55,
            level: 2,
            isExpanded: true,
            children: [
              {
                id: "cost-1-1-1",
                name: "Design Software Licenses",
                type: "cost",
                allocated: "$25,000",
                spent: "$25,000",
                remaining: "$0",
                percentage: 100,
                level: 3,
              },
              {
                id: "cost-1-1-2",
                name: "Architect Fees",
                type: "cost",
                allocated: "$450,000",
                spent: "$250,000",
                remaining: "$200,000",
                percentage: 56,
                level: 3,
              },
              {
                id: "cost-1-1-3",
                name: "3D Modeling & Renderings",
                type: "cost",
                allocated: "$180,000",
                spent: "$95,000",
                remaining: "$85,000",
                percentage: 53,
                level: 3,
              },
              {
                id: "cost-1-1-4",
                name: "Site Surveys",
                type: "cost",
                allocated: "$195,000",
                spent: "$95,000",
                remaining: "$100,000",
                percentage: 49,
                level: 3,
              },
            ]
          },
          {
            id: "task-1-2",
            name: "Engineering Studies",
            type: "task",
            allocated: "$620,000",
            spent: "$340,000",
            remaining: "$280,000",
            percentage: 55,
            level: 2,
            children: [
              {
                id: "cost-1-2-1",
                name: "Structural Engineering",
                type: "cost",
                allocated: "$280,000",
                spent: "$155,000",
                remaining: "$125,000",
                percentage: 55,
                level: 3,
              },
              {
                id: "cost-1-2-2",
                name: "Geotechnical Analysis",
                type: "cost",
                allocated: "$180,000",
                spent: "$98,000",
                remaining: "$82,000",
                percentage: 54,
                level: 3,
              },
              {
                id: "cost-1-2-3",
                name: "Environmental Impact Assessment",
                type: "cost",
                allocated: "$160,000",
                spent: "$87,000",
                remaining: "$73,000",
                percentage: 54,
                level: 3,
              },
            ]
          },
          {
            id: "task-1-3",
            name: "Permits & Approvals",
            type: "task",
            allocated: "$630,000",
            spent: "$345,000",
            remaining: "$285,000",
            percentage: 55,
            level: 2,
            children: [
              {
                id: "cost-1-3-1",
                name: "Building Permits",
                type: "cost",
                allocated: "$320,000",
                spent: "$175,000",
                remaining: "$145,000",
                percentage: 55,
                level: 3,
              },
              {
                id: "cost-1-3-2",
                name: "Environmental Permits",
                type: "cost",
                allocated: "$180,000",
                spent: "$100,000",
                remaining: "$80,000",
                percentage: 56,
                level: 3,
              },
              {
                id: "cost-1-3-3",
                name: "Legal Fees",
                type: "cost",
                allocated: "$130,000",
                spent: "$70,000",
                remaining: "$60,000",
                percentage: 54,
                level: 3,
              },
            ]
          },
        ]
      },
      {
        id: "phase-2",
        name: "Site Preparation",
        type: "phase",
        allocated: "$1,800,000",
        spent: "$1,020,000",
        remaining: "$780,000",
        percentage: 57,
        level: 1,
        children: [
          {
            id: "task-2-1",
            name: "Demolition",
            type: "task",
            allocated: "$720,000",
            spent: "$410,000",
            remaining: "$310,000",
            percentage: 57,
            level: 2,
            children: [
              {
                id: "cost-2-1-1",
                name: "Equipment Rental",
                type: "cost",
                allocated: "$280,000",
                spent: "$160,000",
                remaining: "$120,000",
                percentage: 57,
                level: 3,
              },
              {
                id: "cost-2-1-2",
                name: "Labor Costs",
                type: "cost",
                allocated: "$320,000",
                spent: "$180,000",
                remaining: "$140,000",
                percentage: 56,
                level: 3,
              },
              {
                id: "cost-2-1-3",
                name: "Waste Disposal",
                type: "cost",
                allocated: "$120,000",
                spent: "$70,000",
                remaining: "$50,000",
                percentage: 58,
                level: 3,
              },
            ]
          },
          {
            id: "task-2-2",
            name: "Site Grading",
            type: "task",
            allocated: "$540,000",
            spent: "$305,000",
            remaining: "$235,000",
            percentage: 56,
            level: 2,
            children: [
              {
                id: "cost-2-2-1",
                name: "Heavy Machinery",
                type: "cost",
                allocated: "$280,000",
                spent: "$158,000",
                remaining: "$122,000",
                percentage: 56,
                level: 3,
              },
              {
                id: "cost-2-2-2",
                name: "Materials",
                type: "cost",
                allocated: "$160,000",
                spent: "$90,000",
                remaining: "$70,000",
                percentage: 56,
                level: 3,
              },
              {
                id: "cost-2-2-3",
                name: "Labor",
                type: "cost",
                allocated: "$100,000",
                spent: "$57,000",
                remaining: "$43,000",
                percentage: 57,
                level: 3,
              },
            ]
          },
          {
            id: "task-2-3",
            name: "Utility Connections",
            type: "task",
            allocated: "$540,000",
            spent: "$305,000",
            remaining: "$235,000",
            percentage: 56,
            level: 2,
            children: [
              {
                id: "cost-2-3-1",
                name: "Water & Sewer",
                type: "cost",
                allocated: "$220,000",
                spent: "$125,000",
                remaining: "$95,000",
                percentage: 57,
                level: 3,
              },
              {
                id: "cost-2-3-2",
                name: "Electrical",
                type: "cost",
                allocated: "$220,000",
                spent: "$125,000",
                remaining: "$95,000",
                percentage: 57,
                level: 3,
              },
              {
                id: "cost-2-3-3",
                name: "Gas Lines",
                type: "cost",
                allocated: "$100,000",
                spent: "$55,000",
                remaining: "$45,000",
                percentage: 55,
                level: 3,
              },
            ]
          },
        ]
      },
      {
        id: "phase-3",
        name: "Foundation & Structure",
        type: "phase",
        allocated: "$850,000",
        spent: "$465,000",
        remaining: "$385,000",
        percentage: 55,
        level: 1,
        children: [
          {
            id: "task-3-1",
            name: "Foundation Work",
            type: "task",
            allocated: "$450,000",
            spent: "$245,000",
            remaining: "$205,000",
            percentage: 54,
            level: 2,
          },
          {
            id: "task-3-2",
            name: "Structural Framing",
            type: "task",
            allocated: "$400,000",
            spent: "$220,000",
            remaining: "$180,000",
            percentage: 55,
            level: 2,
          },
        ]
      },
    ]
  },
  2: {
    id: "proj-2",
    name: "ERP System Implementation",
    type: "project",
    allocated: "$850,000",
    spent: "$720,000",
    remaining: "$130,000",
    percentage: 85,
    level: 0,
    isExpanded: true,
    children: [
      {
        id: "phase-1",
        name: "Requirements Analysis",
        type: "phase",
        allocated: "$320,000",
        spent: "$280,000",
        remaining: "$40,000",
        percentage: 88,
        level: 1,
        children: [
          {
            id: "task-1-1",
            name: "Business Process Review",
            type: "task",
            allocated: "$150,000",
            spent: "$132,000",
            remaining: "$18,000",
            percentage: 88,
            level: 2,
          },
          {
            id: "task-1-2",
            name: "System Requirements Documentation",
            type: "task",
            allocated: "$170,000",
            spent: "$148,000",
            remaining: "$22,000",
            percentage: 87,
            level: 2,
          },
        ]
      },
    ]
  }
};

export function ProjectBudgetDetailsModal({ project, onClose }: ProjectBudgetDetailsModalProps) {
  const [treeData, setTreeData] = useState<BudgetTreeItem>(budgetTreeData[project.id] || budgetTreeData[1]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track": return "bg-green-50 text-green-700 border-green-200";
      case "Over Budget": return "bg-red-50 text-red-700 border-red-200";
      case "Under Budget": return "bg-blue-50 text-blue-700 border-blue-200";
      case "At Risk": return "bg-orange-50 text-orange-700 border-orange-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const toggleExpand = (id: string) => {
    const updateTree = (item: BudgetTreeItem): BudgetTreeItem => {
      if (item.id === id) {
        return { ...item, isExpanded: !item.isExpanded };
      }
      if (item.children) {
        return {
          ...item,
          children: item.children.map(updateTree)
        };
      }
      return item;
    };
    setTreeData(updateTree(treeData));
  };

  const flattenTree = (item: BudgetTreeItem, result: BudgetTreeItem[] = []): BudgetTreeItem[] => {
    result.push(item);
    if (item.isExpanded && item.children) {
      item.children.forEach(child => flattenTree(child, result));
    }
    return result;
  };

  const visibleItems = flattenTree(treeData);

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="size-6" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{project.projectName}</h1>
              <p className="text-sm text-slate-600 mt-0.5">{project.projectType} - Budget Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {/* Project Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-600 mb-2">
              <User className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Project Manager</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{project.projectManager}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-600 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Timeline</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{project.startDate} - {project.endDate}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-600 mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Total Budget</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{project.totalBudget}</p>
          </div>
          
          <div className={`rounded-lg p-4 border shadow-sm ${getStatusColor(project.status)}`}>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Status</span>
            </div>
            <p className="text-sm font-semibold">{project.status}</p>
          </div>
        </div>

        {/* Budget Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">Total Allocated</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{project.totalBudget}</p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-5 border border-orange-200 shadow-sm">
            <div className="flex items-center gap-2 text-orange-700 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Total Spent</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">{project.spent}</p>
            <p className="text-xs text-orange-600 mt-1">{project.percentage}% of budget</p>
          </div>
          
          <div className={`rounded-lg p-5 border shadow-sm ${
            project.remaining.startsWith('-') 
              ? 'bg-red-50 border-red-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className={`flex items-center gap-2 mb-2 ${
              project.remaining.startsWith('-') ? 'text-red-700' : 'text-green-700'
            }`}>
              {project.remaining.startsWith('-') ? (
                <TrendingDown className="w-5 h-5" />
              ) : (
                <TrendingUp className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">Remaining</span>
            </div>
            <p className={`text-2xl font-bold ${
              project.remaining.startsWith('-') ? 'text-red-900' : 'text-green-900'
            }`}>
              {project.remaining}
            </p>
          </div>
        </div>

        {/* Budget Tree View */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Budget Breakdown - Tree View</h3>
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Item Name</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Type</th>
                  <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Allocated</th>
                  <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Spent</th>
                  <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Remaining</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Usage %</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={cn(
                      "border-b border-slate-100 hover:bg-slate-50",
                      item.type === "project" ? "bg-blue-50/30" : "",
                      item.type === "phase" ? "bg-purple-50/20" : "",
                    )}
                  >
                    {/* Name Column with Indentation */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2" style={{ paddingLeft: `${item.level * 24}px` }}>
                        {item.children && item.children.length > 0 ? (
                          <button 
                            onClick={() => toggleExpand(item.id)}
                            className="p-0.5 hover:bg-slate-200 rounded text-slate-500 transition-colors"
                          >
                            {item.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                        ) : (
                          <div className="w-[18px]" /> 
                        )}
                        
                        <span className={cn(
                          "text-[12px]",
                          item.type === "project" ? "font-bold text-slate-900" : 
                          item.type === "phase" ? "font-semibold text-slate-900" : 
                          item.type === "task" ? "font-medium text-slate-900" :
                          "font-normal text-slate-700"
                        )}>
                          {item.name}
                        </span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase",
                        item.type === "project" ? "bg-blue-100 text-blue-700" :
                        item.type === "phase" ? "bg-purple-100 text-purple-700" :
                        item.type === "task" ? "bg-slate-100 text-slate-700" :
                        "bg-amber-100 text-amber-700"
                      )}>
                        {item.type}
                      </span>
                    </td>

                    {/* Allocated */}
                    <td className="px-4 py-3 text-right">
                      <p className={cn(
                        "text-[12px]",
                        item.type === "project" || item.type === "phase" ? "font-semibold text-slate-900" : "text-slate-700"
                      )}>
                        {item.allocated}
                      </p>
                    </td>

                    {/* Spent */}
                    <td className="px-4 py-3 text-right">
                      <p className={cn(
                        "text-[12px]",
                        item.type === "project" || item.type === "phase" ? "font-semibold text-slate-900" : "text-slate-700"
                      )}>
                        {item.spent}
                      </p>
                    </td>

                    {/* Remaining */}
                    <td className="px-4 py-3 text-right">
                      <p className={cn(
                        "text-[12px] font-medium",
                        item.remaining.startsWith('-') ? 'text-red-600' : 'text-green-600'
                      )}>
                        {item.remaining}
                      </p>
                    </td>

                    {/* Usage % */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[100px]">
                          <div 
                            className={cn(
                              "h-2 rounded-full",
                              item.percentage > 100 ? 'bg-red-500' : 
                              item.percentage > 85 ? 'bg-yellow-500' : 
                              'bg-green-500'
                            )}
                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                          />
                        </div>
                        <span className={cn(
                          "text-[12px] font-medium min-w-[45px]",
                          item.percentage > 100 ? 'text-red-600' : 
                          item.percentage > 85 ? 'text-yellow-600' : 
                          'text-slate-700'
                        )}>
                          {item.percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
