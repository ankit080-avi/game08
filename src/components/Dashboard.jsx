import React, { useState, useMemo } from 'react';
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
  Search,
  X,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { GAME_REGISTRY, CATEGORIES } from '../games/registry.js';
import { TransactionType } from '../services/walletService.js';
import {
  LudoThumbnail,
  TicTacToeThumbnail,
  SnakesLaddersThumbnail,
  CarromThumbnail,
  ChessThumbnail,
  CheckersThumbnail,
  PoolThumbnail,
  ArcheryThumbnail,
  KnifeTargetThumbnail,
  MemoryMatchThumbnail,
  SudokuThumbnail,
  MinesThumbnail,
  BubbleShooterThumbnail,
  FruitSliceThumbnail,
  ConnectFourThumbnail,
  RPSThumbnail,
  RummyThumbnail
} from './GameThumbnails.jsx';

export const Dashboard = ({
  onSelectGame,
  onOpenAddCredits,
  onViewAllTransactions
}) => {
  const { user } = useAuth();
  const { balance, transactions } = useWallet();

  const [selectedCategory, setSelectedCategory] = useState('All Games');
  const [searchQuery, setSearchQuery] = useState('');
  const [launchingId, setLaunchingId] = useState(null);

  const recentTransactions = transactions.slice(0, 5);

  // Filtered games based on category and search query
  const filteredGames = useMemo(() => {
    return GAME_REGISTRY.filter((game) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'All Games' ||
        game.category === selectedCategory ||
        (game.secondaryCategories && game.secondaryCategories.includes(selectedCategory));

      // Search filter
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        game.title.toLowerCase().includes(query) ||
        game.shortName.toLowerCase().includes(query) ||
        game.category.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handlePlayClick = (game) => {
    if (launchingId) return; // Prevent double click
    setLaunchingId(game.id);

    onSelectGame(game);

    setTimeout(() => {
      setLaunchingId(null);
    }, 1000);
  };

  const renderThumbnail = (gameId) => {
    switch (gameId) {
      case 'ludo': return <LudoThumbnail />;
      case 'tic-tac-toe': return <TicTacToeThumbnail />;
      case 'snakes-ladders': return <SnakesLaddersThumbnail />;
      case 'carrom': return <CarromThumbnail />;
      case 'chess': return <ChessThumbnail />;
      case 'checkers': return <CheckersThumbnail />;
      case 'pool': return <PoolThumbnail />;
      case 'archery': return <ArcheryThumbnail />;
      case 'knife-target': return <KnifeTargetThumbnail />;
      case 'memory': return <MemoryMatchThumbnail />;
      case 'sudoku': return <SudokuThumbnail />;
      case 'mines': return <MinesThumbnail />;
      case 'bubble-shooter': return <BubbleShooterThumbnail />;
      case 'fruit-slice': return <FruitSliceThumbnail />;
      case 'connect-four': return <ConnectFourThumbnail />;
      case 'rps': return <RPSThumbnail />;
      case 'rummy': return <RummyThumbnail />;
      default: return <LudoThumbnail />;
    }
  };

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

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8 pb-24 md:pb-10 overflow-hidden">
      {/* Welcome & Wallet Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        {/* User Welcome Card */}
        <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-900/30 p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Multi-Game Sandbox Ready</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                {user?.fullName || user?.username || 'Player'}
              </span>
              ! 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-lg leading-relaxed">
              Explore 16 interactive games with virtual demo credits. Tap any title below to test our touch-friendly game screens!
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Games</p>
              <p className="text-lg font-black text-white mt-0.5">{GAME_REGISTRY.length} Titles</p>
            </div>
            <div className="h-6 w-px bg-slate-800 hidden sm:block" />
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Transactions</p>
              <p className="text-lg font-black text-white mt-0.5">{transactions.length} Logs</p>
            </div>
            <div className="h-6 w-px bg-slate-800 hidden sm:block" />
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Environment</p>
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Virtual Demo Sandbox</span>
              </p>
            </div>
          </div>
        </div>

        {/* Full-Width Mobile & Large Desktop Wallet Card */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-7 flex flex-col justify-between shadow-2xl relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>VIRTUAL DEMO WALLET</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-300 border border-amber-500/20">
              No Real Currency
            </span>
          </div>

          <div className="my-5">
            <p className="text-xs text-slate-400 mb-1">Available Demo Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                {balance.toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-400">Demo Credits</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              100% free virtual tokens for entering demo games.
            </p>
          </div>

          <button
            onClick={onOpenAddCredits}
            className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ ADD DEMO CREDITS</span>
          </button>
        </div>
      </div>

      {/* Available Games Section */}
      <div id="games-section" className="space-y-4">
        {/* Section Header & Instant Search Field */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-indigo-400" />
              <span>Available Games</span>
              <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                {filteredGames.length}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Pick a game below. Entry fee is verified and deducted only after the arena loads.
            </p>
          </div>

          {/* Instant Search Field */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search games (e.g. Ludo, Carrom, Chess)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[44px] pl-10 pr-9 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Selector (Horizontally scrollable on mobile) */}
        <div className="w-full overflow-x-auto py-1 scrollbar-none flex items-center gap-2 -mx-1 px-1 touch-pan-x">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Responsive Game Grid: Mobile (1 col) | Tablet (2 cols) | Desktop (3 cols) */}
        {filteredGames.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-slate-900 border border-slate-800 p-8">
            <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No games found</h3>
            <p className="text-xs text-slate-400">
              No games matched &quot;{searchQuery}&quot; in {selectedCategory}. Try another search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Games');
              }}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredGames.map((game) => {
              const hasFunds = balance >= game.entryFee;
              const isLaunchingThis = launchingId === game.id;

              return (
                <div
                  key={game.id}
                  className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-xl hover:shadow-2xl"
                >
                  {/* Visual Game Thumbnail at top */}
                  <div className="p-3 sm:p-4 pb-0">
                    {renderThumbnail(game.id)}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Status & Category Badge */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {game.category}
                        </span>

                        {hasFunds ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Available</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                            <AlertCircle className="w-3 h-3" />
                            <span>Low Balance</span>
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mb-1">
                        {game.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
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
                            Reward
                          </p>
                          <p className="text-sm font-black text-emerald-400">
                            +{game.winReward} Credits
                          </p>
                        </div>
                      </div>

                      {/* PLAY NOW Button (Min Touch Target >= 48px) */}
                      <button
                        onClick={() => handlePlayClick(game)}
                        disabled={isLaunchingThis}
                        className={`w-full min-h-[48px] py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                          isLaunchingThis
                            ? 'bg-amber-600 text-slate-950 cursor-wait opacity-80'
                            : hasFunds
                            ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/25 cursor-pointer'
                            : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 cursor-pointer'
                        }`}
                      >
                        {isLaunchingThis ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                            <span>LAUNCHING ARENA...</span>
                          </>
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

                    {/* Features Tag Bullets */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                        Features:
                      </p>
                      <ul className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                        {game.features?.map((f, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Transactions Section */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" />
              <span>Recent Transactions</span>
            </h2>
            <p className="text-xs text-slate-400">
              Latest activity in your virtual demo wallet
            </p>
          </div>

          <button
            onClick={onViewAllTransactions}
            className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 min-h-[44px] cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No transactions yet. Click &quot;+ Add Demo Credits&quot; to test your wallet!
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60 text-xs">
            {recentTransactions.map((txn) => {
              const isPositive = txn.amount > 0;
              return (
                <div
                  key={txn.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-800/20 px-2 rounded-xl transition-colors"
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
                      <p className="font-bold text-slate-200 truncate">
                        {txn.description}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {txn.id} • {formatDate(txn.date)}
                        {txn.sessionId && (
                          <span className="ml-1 text-amber-400/80">[{txn.sessionId}]</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`font-black text-xs sm:text-sm ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPositive ? `+${txn.amount}` : txn.amount}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Bal: {txn.newBalance?.toLocaleString()}
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
