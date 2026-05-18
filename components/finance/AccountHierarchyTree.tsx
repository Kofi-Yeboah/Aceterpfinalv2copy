import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FileText } from "lucide-react";
import type { SRDAccount } from "./types";
import { formatCurrency } from "./helpers";

interface AccountHierarchyTreeProps {
  accounts: SRDAccount[];
  onSelect: (account: SRDAccount) => void;
}

interface TreeNode {
  account: SRDAccount;
  children: TreeNode[];
}

function buildTree(accounts: SRDAccount[]): TreeNode[] {
  const rootAccounts = accounts.filter(a => !a.parentAccountId);
  const childMap = new Map<string, SRDAccount[]>();

  accounts.forEach(a => {
    if (a.parentAccountId) {
      const existing = childMap.get(a.parentAccountId) || [];
      existing.push(a);
      childMap.set(a.parentAccountId, existing);
    }
  });

  function buildNode(account: SRDAccount): TreeNode {
    const children = (childMap.get(account.id) || []).map(buildNode);
    return { account, children };
  }

  return rootAccounts.map(buildNode);
}

function TreeNodeItem({ node, depth, onSelect }: { node: TreeNode; depth: number; onSelect: (a: SRDAccount) => void }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = node.children.length > 0;

  const typeColors: Record<string, string> = {
    Asset: "text-blue-600",
    Liability: "text-orange-600",
    Revenue: "text-emerald-600",
    Expense: "text-red-600",
    Equity: "text-purple-600",
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group"
        style={{ paddingLeft: `${12 + depth * 20}px` }}
        onClick={() => onSelect(node.account)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-600"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-4" />
        )}
        {hasChildren ? (
          <Folder size={14} className="text-amber-500" />
        ) : (
          <FileText size={14} className="text-slate-400" />
        )}
        <span className="font-mono text-[11px] text-slate-500 w-[170px] truncate">{node.account.displayCode}</span>
        <span className="text-[12px] text-slate-800 flex-1 truncate">{node.account.name}</span>
        <span className={`text-[10px] font-medium ${typeColors[node.account.type] || "text-slate-500"}`}>
          {node.account.type}
        </span>
        <span className="text-[11px] text-slate-600 w-24 text-right font-mono">
          {formatCurrency(node.account.balance, node.account.currency)}
        </span>
        {node.account.isControlAccount && (
          <span className="text-[9px] bg-purple-50 text-purple-600 border border-purple-200 px-1.5 py-0.5 rounded">CTRL</span>
        )}
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children.map(child => (
            <TreeNodeItem key={child.account.id} node={child} depth={depth + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

export function AccountHierarchyTree({ accounts, onSelect }: AccountHierarchyTreeProps) {
  const tree = buildTree(accounts);

  // Group by account type for display
  const typeGroups: Record<string, TreeNode[]> = {};
  tree.forEach(node => {
    const type = node.account.type;
    if (!typeGroups[type]) typeGroups[type] = [];
    typeGroups[type].push(node);
  });

  const typeOrder = ["Asset", "Liability", "Equity", "Revenue", "Expense"];
  const typeColors: Record<string, string> = {
    Asset: "bg-blue-50 text-blue-700 border-blue-200",
    Liability: "bg-orange-50 text-orange-700 border-orange-200",
    Revenue: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Expense: "bg-red-50 text-red-700 border-red-200",
    Equity: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className="space-y-4">
      {typeOrder.map(type => {
        const nodes = typeGroups[type];
        if (!nodes || nodes.length === 0) return null;
        return (
          <div key={type}>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border mb-2 ${typeColors[type]}`}>
              {type} Accounts ({nodes.length})
            </div>
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              {nodes.map(node => (
                <TreeNodeItem key={node.account.id} node={node} depth={0} onSelect={onSelect} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
