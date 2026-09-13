import React, { useState } from 'react';
import {
  Gamepad2,
  Coins,
  Plus,
  ArrowRight,
  TrendingUp,
  History,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Play,
  Clock,
  Layers,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { GAME_REGISTRY } from '../games/registry';
import { TransactionType } from '../services/walletService';
import {
  LudoThumbnail,
  TicTacToeThumbnail,
  SnakesLaddersThumbnail
} from './GameThumbnails';

export const Dashboard = ({
  onSelectGame,
  onOpenAddCredits,
  onViewAllTransactions
}) => {
  const { user } = useAuth();
  const { balance, transactions, checkBalance } = useWallet();
  const [launchingId, setLaunchingId] = useState(null);

  const recentTransactions = transactions.slice(0, 5);
  const activeGames = GAME_REGISTRY.filter((g) => g.status === 'active');

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  const handlePlayClick = (game) => {
    if (launchingId) return; // Prevent duplicate clicks
    setLaunchingId(game.id);

    // Call launcher
    onSelectGame(game);

    // Reset launching flag after short transition
    setTimeout(() => {
      setLaunchingId(null);
    }, 1000);
  };

  const renderThumbnail = (gameId) => {
    switch (gameId) {
      case 'ludo':
        return <LudoThumbnail />;
      case 'tic-tac-toe':
        return <TicTacToeThumbnail />;
      case 'snakes-ladders':
        return <SnakesLaddersThumbnail />;
      default:
        return <LudoThumbnail />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome & Wallet Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* User Welcome Card */}
        <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-900/30 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sandbox Demo Active</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                {user?.fullName || user?.username || 'Player'}
              </span>
              ! 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg leading-relaxed">
              Explore our modular gaming prototype. Play interactive Ludo against our AI bot, monitor your virtual demo credits, and test seamless transaction auditing.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                Games Available
              </p>
              <p className="text-xl font-bold text-white mt-0.5">
                {GAME_REGISTRY.length}{' '}
                <span className="text-xs font-normal text-slate-400">
                  ({activeGames.length} playable)
                </span>
              </p>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block" />

            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                Total Transactions
              </p>
              <p className="text-xl font-bold text-white mt-0.5">
                {transactions.length}
              </p>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block" />

            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                Platform Status
              </p>
              <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Operational (Demo)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Demo Wallet Balance Card */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Virtual Demo Wallet</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              No Real Money
            </span>
          </div>

          <div className="my-6">
            <p className="text-xs text-slate-400 mb-1">Available Demo Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight">
                {balance.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-slate-400">Demo Credits</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Used exclusively to cover demo game entry fees during this test.
            </p>
          </div>

          <button
            onClick={onOpenAddCredits}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Demo Credits</span>
          </button>
        </div>
      </div>

      {/* Available Games Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-indigo-400" />
              <span>Available Games</span>
            </h2>
            <p className="text-xs text-slate-400">
              Select a game below. Entry fee is safely verified and deducted only after game arena loads.
            </p>
          </div>
        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAME_REGISTRY.map((game) => {
            const hasFunds = balance >= game.entryFee;
            const isAvailable = game.status === 'active';
            const isLaunchingThis = launchingId === game.id;

            return (
              <div
                key={game.id}
                className={`group rounded-3xl bg-slate-900 border transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-xl ${
                  isAvailable
                    ? 'border-slate-800 hover:border-slate-700 hover:shadow-2xl'
                    : 'border-slate-800/40 opacity-80'
                }`}
              >
                {/* Visual Game Thumbnail at top */}
                <div className="p-4 pb-0">
                  {renderThumbnail(game.id)}
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Status & Badge Row */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          game.badgeColor === 'amber'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : game.badgeColor === 'cyan'
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                        }`}
                      >
                        {game.badge}
                      </span>

                      {/* Ready status vs Insufficient funds */}
                      {isAvailable ? (
                        hasFunds ? (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Available</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                            <AlertCircle className="w-3 h-3" />
                            <span>Insufficient Balance</span>
                          </span>
                        )
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span>Coming Soon</span>
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-extrabold text-white tracking-tight mb-1">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {game.description}
                    </p>

                    {/* Entry Fee Box */}
                    <div className="p-3 mb-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          Entry Fee
                        </p>
                        <p className="text-sm font-black text-amber-400">
                          {game.entryFee} Demo Credits
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          Win Reward
                        </p>
                        <p className="text-sm font-black text-emerald-400">
                          +{game.winReward} Credits
                        </p>
                      </div>
                    </div>

                    {/* Prominent PLAY NOW Button */}
                    <button
                      onClick={() => handlePlayClick(game)}
                      disabled={!isAvailable || isLaunchingThis}
                      className={`w-full py-3.5 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                        !isAvailable
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                          : isLaunchingThis
                          ? 'bg-amber-600 text-slate-950 cursor-wait opacity-80'
                          : hasFunds
                          ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/25 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0'
                          : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 cursor-pointer'
                      }`}
                    >
                      {isLaunchingThis ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                          <span>LAUNCHING...</span>
                        </>
                      ) : !isAvailable ? (
                        <span>COMING SOON</span>
                      ) : hasFunds ? (
                        <>
                          <Play className="w-4 h-4 fill-current stroke-none" />
                          <span>PLAY NOW</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4" />
                          <span>INSUFFICIENT BALANCE</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Features List */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">
                      Features:
                    </p>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {game.features?.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" />
              <span>Recent Transactions</span>
            </h2>
            <p className="text-xs text-slate-400">
              Latest activity in your virtual demo wallet
            </p>
          </div>

          <button
            onClick={onViewAllTransactions}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No transactions yet. Click &quot;Add Demo Credits&quot; to test your wallet!
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60 text-xs">
            {recentTransactions.map((txn) => {
              const isPositive = txn.amount > 0;
              return (
                <div
                  key={txn.id}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-800/20 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        txn.type === TransactionType.CREDIT_ADDED
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : txn.type === TransactionType.GAME_REWARD
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      <Coins className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-slate-200 truncate">
                        {txn.description}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {txn.id} • {formatDate(txn.date)}
                        {txn.sessionId && (
                          <span className="ml-2 text-slate-400">[{txn.sessionId}]</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`font-bold text-sm ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPositive ? `+${txn.amount}` : txn.amount}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Balance: {txn.newBalance?.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
