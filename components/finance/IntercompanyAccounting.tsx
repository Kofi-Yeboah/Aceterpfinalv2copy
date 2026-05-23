import { useState } from "react";
import { Building2, ArrowLeftRight, Scissors, CheckCircle2 } from "lucide-react";
import type { Entity, IntercompanyTransaction } from "./types";
import { mockEntities, mockICTransactions } from "./mockData";
import { formatCurrency } from "./helpers";

type SubTab = "entities" | "transactions" | "eliminations" | "reconciliation";

export function IntercompanyAccounting() {
  const [activeTab, setActiveTab] = useState<SubTab>("entities");

  const tabs: { key: SubTab; label: string; icon: React.ReactNode }[] = [
    { key: "entities", label: "Entities", icon: <Building2 size={14} /> },
    { key: "transactions", label: "IC Transactions", icon: <ArrowLeftRight size={14} /> },
    { key: "eliminations", label: "Eliminations", icon: <Scissors size={14} /> },
    { key: "reconciliation", label: "Reconciliation", icon: <CheckCircle2 size={14} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Intercompany Accounting</h1>
        <p className="text-[12px] text-slate-500 mt-0.5">{mockEntities.length} legal entities | Cross-entity transaction management</p>
      </div>

      <div className="px-6 py-2 bg-white border-b border-slate-200">
        <div className="flex items-center gap-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-[12px] font-medium flex items-center gap-2 transition-colors ${
                activeTab === tab.key ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === "entities" && <EntitiesView />}
        {activeTab === "transactions" && <ICTransactionsView />}
        {activeTab === "eliminations" && <EliminationsView />}
        {activeTab === "reconciliation" && <ICReconciliationView />}
      </div>
    </div>
  );
}

function EntitiesView() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4">
        {mockEntities.map(entity => (
          <div key={entity.id} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Building2 size={20} className="text-blue-600" />
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded font-medium ${entity.status === "Active" ? "bg-green-50 text-green-700 border border-green-200" : "bg-slate-100 text-slate-500"}`}>
                {entity.status}
              </span>
            </div>
            <h3 className="text-[14px] font-medium text-slate-900">{entity.name}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">{entity.code}</p>
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <p className="text-slate-400">Country</p>
                <p className="text-slate-700 font-medium">{entity.country}</p>
              </div>
              <div>
                <p className="text-slate-400">Currency</p>
                <p className="text-slate-700 font-medium">{entity.functionalCurrency}</p>
              </div>
              <div>
                <p className="text-slate-400">Entity Code</p>
                <p className="text-slate-700 font-mono">{entity.code}</p>
              </div>
              <div>
                <p className="text-slate-400">Fiscal Year</p>
                <p className="text-slate-700">Jan - Dec</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ICTransactionsView() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Transaction ID</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Date</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">From Entity</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">To Entity</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Description</th>
              <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">Amount</th>
              <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockICTransactions.map(txn => {
              const fromEntity = mockEntities.find(e => e.id === txn.fromEntityId);
              const toEntity = mockEntities.find(e => e.id === txn.toEntityId);
              return (
                <tr key={txn.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-[11px] font-mono text-blue-700">{`IC-${txn.id.toUpperCase()}`}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">{txn.date}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-800">{fromEntity?.name || txn.fromEntityId}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-800">{toEntity?.name || txn.toEntityId}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">{txn.description}</td>
                  <td className="px-4 py-3 text-right text-[11px] font-mono font-medium text-slate-900">
                    {formatCurrency(txn.amount, txn.currency)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      txn.status === "Posted" ? "bg-green-50 text-green-700" :
                      txn.status === "Pending" ? "bg-amber-50 text-amber-700" :
                      "bg-blue-50 text-blue-700"
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EliminationsView() {
  // Auto-generated elimination entries from IC transactions
  const postedICTxns = mockICTransactions.filter(t => t.status === "Posted");

  return (
    <div className="p-6 space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-[11px] text-blue-700">
          Elimination entries are auto-generated from posted intercompany transactions for consolidation purposes.
          <span className="font-medium ml-1">{postedICTxns.length} transactions</span> require elimination.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Source Txn</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Elimination Entry</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Description</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Debit</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Credit</th>
              <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Generated</th>
            </tr>
          </thead>
          <tbody>
            {postedICTxns.map((txn, i) => (
              <tr key={txn.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-[11px] font-mono text-slate-700">{`IC-${txn.id.toUpperCase()}`}</td>
                <td className="px-4 py-3 text-[11px] font-mono text-blue-700">ELIM-{String(i + 1).padStart(3, "0")}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">Eliminate: {txn.description}</td>
                <td className="px-4 py-3 text-right text-[11px] font-mono">{formatCurrency(txn.amount, txn.currency)}</td>
                <td className="px-4 py-3 text-right text-[11px] font-mono">{formatCurrency(txn.amount, txn.currency)}</td>
                <td className="px-4 py-3 text-center">
                  <CheckCircle2 size={14} className="text-green-500 mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ICReconciliationView() {
  // Entity-pair balance matching
  const entityPairs: { from: Entity; to: Entity; fromBalance: number; toBalance: number }[] = [];

  for (let i = 0; i < mockEntities.length; i++) {
    for (let j = i + 1; j < mockEntities.length; j++) {
      const fromTxns = mockICTransactions.filter(t => t.fromEntityId === mockEntities[i].id && t.toEntityId === mockEntities[j].id);
      const toTxns = mockICTransactions.filter(t => t.fromEntityId === mockEntities[j].id && t.toEntityId === mockEntities[i].id);
      const fromBal = fromTxns.reduce((s, t) => s + t.amount, 0);
      const toBal = toTxns.reduce((s, t) => s + t.amount, 0);
      if (fromBal > 0 || toBal > 0) {
        entityPairs.push({ from: mockEntities[i], to: mockEntities[j], fromBalance: fromBal, toBalance: toBal });
      }
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200">
          <h3 className="text-[13px] font-semibold text-slate-900">Entity-Pair Reconciliation</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Entity A</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Entity B</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">A → B</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">B → A</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Net</th>
              <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {entityPairs.map((pair, i) => {
              const net = pair.fromBalance - pair.toBalance;
              const isBalanced = Math.abs(net) < 0.01;
              return (
                <tr key={i} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-[11px] text-slate-800">{pair.from.name}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-800">{pair.to.name}</td>
                  <td className="px-4 py-3 text-right text-[11px] font-mono">{formatCurrency(pair.fromBalance, "GHS")}</td>
                  <td className="px-4 py-3 text-right text-[11px] font-mono">{formatCurrency(pair.toBalance, "GHS")}</td>
                  <td className="px-4 py-3 text-right text-[11px] font-mono font-medium">{formatCurrency(Math.abs(net), "GHS")}</td>
                  <td className="px-4 py-3 text-center">
                    {isBalanced ? (
                      <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 rounded border border-green-200">Matched</span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">Unmatched</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
