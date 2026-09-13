import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  CheckCircle2,
  Calendar,
  Layers,
  Download
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { TransactionType } from '../services/walletService';

export const TransactionHistory = ({ onBackToDashboard, onOpenAddCredits }) => {
  const { transactions, balance } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Filtered transactions
  const filteredList = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesSearch =
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (txn.description && txn.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType =
        filterType === 'ALL' ||
        (filterType === 'CREDITS' && txn.type === TransactionType.CREDIT_ADDED) ||
        (filterType === 'FEES' && txn.type === TransactionType.ENTRY_FEE) ||
        (filterType === 'REWARDS' && txn.type === TransactionType.GAME_REWARD);

      return matchesSearch && matchesType;
    });
  }, [transactions, searchQuery, filterType]);

  // Aggregate stats
  const stats = useMemo(() => {
    let totalAdded = 0;
    let totalSpent = 0;
    let totalRewards = 0;

    transactions.forEach((t) => {
      if (t.type === TransactionType.CREDIT_ADDED) {
        totalAdded += Math.abs(t.amount);
      } else if (t.type === TransactionType.ENTRY_FEE) {
        totalSpent += Math.abs(t.amount);
      } else if (t.type === TransactionType.GAME_REWARD) {
        totalRewards += Math.abs(t.amount);
      }
    });

    return { totalAdded, totalSpent, totalRewards };
  }, [transactions]);

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return isoString || 'N/A';
    }
  };

  const exportCSV = () => {
    if (!transactions.length) return;
    const headers = ['Transaction ID', 'Date', 'Type', 'Amount', 'Balance After', 'Status', 'Description'];
    const rows = transactions.map((t) => [
      t.id,
      t.date,
      t.type,
      t.amount,
      t.newBalance,
      t.status,
      `"${(t.description || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `game08_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Transaction History
              </h1>
              <p className="text-xs text-slate-400">
                Audit trail of all virtual demo credits, game entry fees, and win bonuses
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            disabled={!transactions.length}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-40"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenAddCredits}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Coins className="w-4 h-4" />
            <span>Add Demo Credits</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Current Demo Balance
          </p>
          <p className="text-2xl font-black text-amber-400 flex items-baseline gap-1">
            {balance.toLocaleString()}{' '}
            <span className="text-xs font-medium text-slate-400">Credits</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Total Credits Added
          </p>
          <p className="text-2xl font-black text-emerald-400 flex items-baseline gap-1">
            +{stats.totalAdded.toLocaleString()}{' '}
            <span className="text-xs font-medium text-slate-400">Credits</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Total Entry Fees Paid
          </p>
          <p className="text-2xl font-black text-rose-400 flex items-baseline gap-1">
            -{stats.totalSpent.toLocaleString()}{' '}
            <span className="text-xs font-medium text-slate-400">Credits</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Victory Rewards Won
          </p>
          <p className="text-2xl font-black text-indigo-400 flex items-baseline gap-1">
            +{stats.totalRewards.toLocaleString()}{' '}
            <span className="text-xs font-medium text-slate-400">Credits</span>
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 mb-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by ID or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'CREDITS', label: 'Credits Added' },
            { id: 'FEES', label: 'Entry Fees' },
            { id: 'REWARDS', label: 'Rewards' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4 sm:px-6">Transaction ID</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-right">Balance After</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-slate-400">No transactions found</p>
                    <p className="text-[11px]">Any wallet changes will appear here.</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((txn) => {
                  const isPositive = txn.amount > 0;
                  return (
                    <tr key={txn.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-medium text-slate-300">
                        {txn.id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {formatDate(txn.date)}
                      </td>
                      <td className="py-3.5 px-4">
                        {txn.type === TransactionType.CREDIT_ADDED && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ArrowDownLeft className="w-3 h-3" />
                            Credit Added
                          </span>
                        )}
                        {(txn.type === 'GAME_ENTRY' || txn.type === TransactionType.ENTRY_FEE) && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <ArrowUpRight className="w-3 h-3" />
                            GAME_ENTRY
                          </span>
                        )}
                        {txn.type === TransactionType.GAME_REWARD && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <Coins className="w-3 h-3" />
                            Reward
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-200 font-medium">
                        <div>{txn.description}</div>
                        {txn.sessionId && (
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            Session: <span className="text-amber-400">{txn.sessionId}</span>
                          </div>
                        )}
                      </td>
                      <td className={`py-3.5 px-4 text-right font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? `+${txn.amount}` : txn.amount}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-300">
                        {txn.newBalance?.toLocaleString() || 0}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {txn.status || 'Completed'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
