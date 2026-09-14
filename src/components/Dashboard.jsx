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
  Loader2,
  ChevronRight
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

const MOBILE_CATEGORIES = [
  { id: 'All Games', label: 'All' },
  { id: 'Popular', label: 'Popular' },
  { id: 'Board', label: 'Board' },
  { id: 'Card', label: 'Card' },
  { id: 'Arcade', label: 'Arcade' },
  { id: 'Sports', label: 'Sports' },
  { id: 'Classic', label: 'Classic' },
  { id: 'Multiplayer', label: 'Multiplayer' }
];

const POPULAR_GAME_IDS = [
  'ludo',
  'rummy',
  'carrom',
  'chess',
  'knife-target',
  'tic-tac-toe',
  'pool',
  'snakes-ladders'
];

const GAME_TILE_STYLES = {
  'ludo': 'border-[#06b6d4] shadow-[0_0_12px_rgba(6,182,212,0.4)]',
  'rummy': 'border-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.4)]',
  'carrom': 'border-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.4)]',
  'chess': 'border-[#60a5fa] shadow-[0_0_12px_rgba(96,165,250,0.4)]',
  'knife-target': 'border-[#f97316] shadow-[0_0_12px_rgba(249,115,22,0.4)]',
  'tic-tac-toe': 'border-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.4)]',
  'pool': 'border-[#3b82f6] shadow-[0_0_12px_rgba(59,130,246,0.4)]',
  'snakes-ladders': 'border-[#0284c7] shadow-[0_0_12px_rgba(2,132,199,0.4)]',
  'fruit-slice': 'border-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.4)]',
  'bubble-shooter': 'border-[#06b6d4] shadow-[0_0_12px_rgba(6,182,212,0.4)]',
  'mines': 'border-[#8b5cf6] shadow-[0_0_12px_rgba(139,92,246,0.4)]',
  'memory': 'border-[#a855f7] shadow-[0_0_12px_rgba(168,85,247,0.4)]',
  'connect-four': 'border-[#2563eb] shadow-[0_0_12px_rgba(37,99,235,0.4)]',
  'rps': 'border-[#eab308] shadow-[0_0_12px_rgba(234,179,8,0.4)]',
  'archery': 'border-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.4)]',
  'checkers': 'border-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.4)]',
  'sudoku': 'border-[#0ea5e9] shadow-[0_0_12px_rgba(14,165,233,0.4)]'
};

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

  const popularGames = useMemo(() => {
    return POPULAR_GAME_IDS.map((id) => GAME_REGISTRY.find((g) => g.id === id)).filter(Boolean);
  }, []);

  const recentTransactions = transactions.slice(0, 5);

  // Filtered games based on category and search query
  const filteredGames = useMemo(() => {
    return GAME_REGISTRY.filter((game) => {
      // Category filter
      let matchesCategory = false;
      if (selectedCategory === 'All Games' || selectedCategory === 'All') {
        matchesCategory = true;
      } else if (selectedCategory === 'Popular') {
        matchesCategory =
          game.badge === 'Popular' ||
          game.badge === 'Hot' ||
          game.badge === 'Featured' ||
          game.id === 'ludo' ||
          game.id === 'rummy' ||
          game.id === 'knife-target' ||
          game.id === 'tic-tac-toe';
      } else if (selectedCategory === 'Card') {
        matchesCategory =
          game.id === 'rummy' ||
          game.category === 'Card' ||
          (game.secondaryCategories && game.secondaryCategories.includes('Card'));
      } else {
        matchesCategory =
          game.category === selectedCategory ||
          (game.secondaryCategories && game.secondaryCategories.includes(selectedCategory));
      }

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

  const renderThumbnail = (gameId, compact = false) => {
    switch (gameId) {
      case 'ludo': return <LudoThumbnail compact={compact} />;
      case 'tic-tac-toe': return <TicTacToeThumbnail compact={compact} />;
      case 'snakes-ladders': return <SnakesLaddersThumbnail compact={compact} />;
      case 'carrom': return <CarromThumbnail compact={compact} />;
      case 'chess': return <ChessThumbnail compact={compact} />;
      case 'checkers': return <CheckersThumbnail compact={compact} />;
      case 'pool': return <PoolThumbnail compact={compact} />;
      case 'archery': return <ArcheryThumbnail compact={compact} />;
      case 'knife-target': return <KnifeTargetThumbnail compact={compact} />;
      case 'memory': return <MemoryMatchThumbnail compact={compact} />;
      case 'sudoku': return <SudokuThumbnail compact={compact} />;
      case 'mines': return <MinesThumbnail compact={compact} />;
      case 'bubble-shooter': return <BubbleShooterThumbnail compact={compact} />;
      case 'fruit-slice': return <FruitSliceThumbnail compact={compact} />;
      case 'connect-four': return <ConnectFourThumbnail compact={compact} />;
      case 'rps': return <RPSThumbnail compact={compact} />;
      case 'rummy': return <RummyThumbnail compact={compact} />;
      default: return <LudoThumbnail compact={compact} />;
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
    <div className="w-full">
      {/* ========================================================================= */}
      {/* 1. MOBILE GAME LAUNCHER PRESENTATION (< 768px / md:hidden)               */}
      {/* ========================================================================= */}
      <div className="md:hidden w-full px-3 pt-2.5 pb-24 pb-[calc(env(safe-area-inset-bottom,0px)+76px)] space-y-3.5 select-none font-sans overflow-x-hidden">
        
        {/* Horizontal Category Tabs */}
        <div className="w-full overflow-x-auto scrollbar-none flex items-center gap-2 -mx-3 px-3 py-0.5 touch-pan-x">
          {MOBILE_CATEGORIES.map((cat) => {
            const isSelected =
              (cat.id === 'All Games' && (selectedCategory === 'All Games' || selectedCategory === 'All')) ||
              selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[32px] px-3.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-md shadow-amber-400/25'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Promotional Hero Banner */}
        <div
          onClick={onOpenAddCredits}
          className="w-full rounded-2xl bg-gradient-to-r from-[#170433] via-[#2a0c50] to-[#190436] border border-purple-500/50 p-3 shadow-[0_0_16px_rgba(168,85,247,0.3)] flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden"
        >
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Left Trophy Illustration & Text */}
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-xl">
                🏆
              </div>
            </div>
            <div>
              <h3 className="text-sm font-black text-white leading-tight">Play Games</h3>
              <p className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 leading-tight mt-0.5">
                Win Virtual Rewards
              </p>
              <p className="text-[10px] text-purple-200/80 font-medium tracking-wide mt-0.5">
                Fast • Secure • Exciting
              </p>
            </div>
          </div>

          {/* Right Gift & Arrow */}
          <div className="flex items-center gap-2 relative z-10 shrink-0">
            <span className="text-2xl animate-bounce">🎁</span>
            <div className="w-7 h-7 rounded-full bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-white/90">
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* 1. POPULAR GAMES SECTION */}
        {(selectedCategory === 'All Games' || selectedCategory === 'All' || selectedCategory === 'Popular') && (
          <div className="space-y-2 pt-0.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="text-base leading-none">🔥</span>
                <h2 className="text-sm font-black text-white tracking-wide">Popular Games</h2>
              </div>
              <button
                onClick={() => setSelectedCategory('Popular')}
                className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center gap-0.5 cursor-pointer"
              >
                <span>See All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4-COLUMN COMPACT GAME ART CARD GRID */}
            <div className="grid grid-cols-4 gap-2.5 min-[410px]:gap-3">
              {popularGames.map((game) => {
                const borderGlow = GAME_TILE_STYLES[game.id] || 'border-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.35)]';
                const isLaunchingThis = launchingId === game.id;

                return (
                  <button
                    key={`popular-${game.id}`}
                    onClick={() => handlePlayClick(game)}
                    disabled={isLaunchingThis}
                    className="group flex flex-col items-center cursor-pointer active:scale-95 transition-transform select-none w-full"
                    title={game.title}
                  >
                    {/* Square Game Tile with colorful border & glow */}
                    <div
                      className={`w-full aspect-square rounded-2xl overflow-hidden border-[2px] relative shadow-lg ${borderGlow} flex items-center justify-center p-0 bg-slate-950`}
                    >
                      {isLaunchingThis ? (
                        <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center z-20">
                          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                        </div>
                      ) : (
                        renderThumbnail(game.id, true)
                      )}
                    </div>

                    {/* Clean Centered Game Name */}
                    <span className="mt-1 text-[11px] font-bold text-slate-200 text-center truncate max-w-full leading-tight group-hover:text-white">
                      {game.shortName || game.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. ALL GAMES SECTION (or Selected Category Games) */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">🎮</span>
              <h2 className="text-sm font-black text-white tracking-wide">
                {selectedCategory === 'All Games' || selectedCategory === 'All' ? 'All Games' : `${selectedCategory} Games`}
              </h2>
            </div>
            <button
              onClick={() => setSelectedCategory('All Games')}
              className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center gap-0.5 cursor-pointer"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4-COLUMN COMPACT GAME ART CARD GRID */}
          <div className="grid grid-cols-4 gap-2.5 min-[410px]:gap-3">
            {filteredGames.map((game) => {
              const borderGlow = GAME_TILE_STYLES[game.id] || 'border-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.35)]';
              const isLaunchingThis = launchingId === game.id;

              return (
                <button
                  key={`all-${game.id}`}
                  onClick={() => handlePlayClick(game)}
                  disabled={isLaunchingThis}
                  className="group flex flex-col items-center cursor-pointer active:scale-95 transition-transform select-none w-full"
                  title={game.title}
                >
                  {/* Square Game Tile with colorful border & glow */}
                  <div
                    className={`w-full aspect-square rounded-2xl overflow-hidden border-[2px] relative shadow-lg ${borderGlow} flex items-center justify-center p-0 bg-slate-950`}
                  >
                    {isLaunchingThis ? (
                      <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center z-20">
                        <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                      </div>
                    ) : (
                      renderThumbnail(game.id, true)
                    )}
                  </div>

                  {/* Clean Centered Game Name */}
                  <span className="mt-1 text-[11px] font-bold text-slate-200 text-center truncate max-w-full leading-tight group-hover:text-white">
                    {game.shortName || game.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. DAILY REWARDS BANNER (Bottom Banner matching reference) */}
        <div
          onClick={onOpenAddCredits}
          className="w-full rounded-2xl bg-gradient-to-r from-[#1a0a22] via-[#2d1130] to-[#1a0a22] border border-amber-500/40 p-3 shadow-[0_0_12px_rgba(245,158,11,0.2)] flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-xl">
                👑
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">
                Daily Rewards
              </h4>
              <p className="text-[10px] text-purple-200/70 font-medium">Play more games and win more!</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xl">🪙</span>
            <div className="w-7 h-7 rounded-full bg-[#4a1222] border border-amber-500/30 flex items-center justify-center text-amber-300">
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP PRESENTATION (>= 768px / hidden md:block)                      */}
      {/* ========================================================================= */}
      <div className="hidden md:block w-full max-w-7xl mx-auto px-6 py-8 space-y-8 pb-10 overflow-hidden">
        {/* Welcome & Wallet Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* User Welcome Card */}
          <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-900/30 p-7 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Multi-Game Sandbox Ready</span>
              </div>

              <h1 className="text-3xl font-black text-white tracking-tight">
                Welcome back,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                  {user?.fullName || user?.username || 'Player'}
                </span>
                ! 👋
              </h1>

              <p className="text-sm text-slate-300 mt-1.5 max-w-lg leading-relaxed">
                Explore 16 interactive games with virtual demo credits. Tap any title below to test our touch-friendly game screens!
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Games</p>
                <p className="text-lg font-black text-white mt-0.5">{GAME_REGISTRY.length} Titles</p>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Transactions</p>
                <p className="text-lg font-black text-white mt-0.5">{transactions.length} Logs</p>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Environment</p>
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Virtual Demo Sandbox</span>
                </p>
              </div>
            </div>
          </div>

          {/* Large Desktop Wallet Card */}
          <div className="lg:col-span-5 rounded-3xl bg-slate-900 border border-slate-800 p-7 flex flex-col justify-between shadow-2xl relative">
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
                <span className="text-4xl font-black text-amber-400 tracking-tight">
                  {balance.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-slate-400">Demo Credits</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                100% free virtual tokens for entering demo games.
              </p>
            </div>

            <button
              onClick={onOpenAddCredits}
              className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ ADD DEMO CREDITS</span>
            </button>
          </div>
        </div>

        {/* Available Games Section */}
        <div id="games-section" className="space-y-4">
          {/* Section Header & Instant Search Field */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
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
            <div className="relative w-72">
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

          {/* Horizontal Category Selector */}
          <div className="w-full overflow-x-auto py-1 scrollbar-none flex items-center gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 active:scale-95 ${
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

          {/* Responsive Desktop Game Grid (3 cols) */}
          {filteredGames.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-slate-900 border border-slate-800 p-8">
              <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No games found</h3>
              <p className="text-xs text-slate-400">
                No games matched "{searchQuery}" in {selectedCategory}. Try another search.
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
            <div className="grid grid-cols-3 gap-6">
              {filteredGames.map((game) => {
                const hasFunds = balance >= game.entryFee;
                const isLaunchingThis = launchingId === game.id;

                return (
                  <div
                    key={game.id}
                    className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-xl hover:shadow-2xl"
                  >
                    {/* Visual Game Thumbnail at top */}
                    <div className="p-4 pb-0">
                      {renderThumbnail(game.id, false)}
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
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
                        <h3 className="text-xl font-black text-white tracking-tight mb-1">
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

                        {/* PLAY NOW Button */}
                        <button
                          onClick={() => handlePlayClick(game)}
                          disabled={isLaunchingThis}
                          className={`w-full min-h-[48px] py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
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
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-7 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
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
              No transactions yet. Click "+ Add Demo Credits" to test your wallet!
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
                        className={`font-black text-sm ${
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
    </div>
  );
};
