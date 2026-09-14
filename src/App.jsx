import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useWallet } from './context/WalletContext';
import { DemoDisclaimerBanner } from './components/DemoDisclaimerBanner';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { TransactionHistory } from './components/TransactionHistory';
import { AddCreditsModal } from './components/AddCreditsModal';
import { ResetDemoModal } from './components/ResetDemoModal';
import { GameWrapper } from './games/GameWrapper';
import { GAME_REGISTRY } from './games/registry.js';
import { CheckCircle2, Info, X } from 'lucide-react';

export const App = () => {
  const { isAuthenticated, logout, quickDemoLogin } = useAuth();
  const { lastNotification, clearNotification, refreshWallet } = useWallet();

  const [currentView, setCurrentView] = useState(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    return params && params.get('game') ? 'game' : 'dashboard';
  });
  const [activeGame, setActiveGame] = useState(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const gameId = params?.get('game');
    return gameId ? (GAME_REGISTRY.find((item) => item.id === gameId) || null) : null;
  });
  const [showAddCreditsModal, setShowAddCreditsModal] = useState(false);
  const [showResetDemoModal, setShowResetDemoModal] = useState(false);

  // Auto-launch game via URL query parameter (e.g. ?game=ludo)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('game');
    if (gameId) {
      const target = GAME_REGISTRY.find((item) => item.id === gameId);
      if (target) {
        if (!isAuthenticated) {
          quickDemoLogin().then(() => {
            setActiveGame(target);
            setCurrentView('game');
          });
        } else {
          setActiveGame(target);
          setCurrentView('game');
        }
      }
    }
  }, [isAuthenticated, quickDemoLogin]);

  // Switch to game launch
  const handleSelectGame = (game) => {
    setActiveGame(game);
    setCurrentView('game');
  };

  // Exit from game back to dashboard
  const handleExitGame = () => {
    setActiveGame(null);
    setCurrentView('dashboard');
  };

  // Callback when demo is reset
  const handleResetComplete = () => {
    logout();
    setCurrentView('dashboard');
    setActiveGame(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070a13] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Top Demo Disclaimer Notice */}
      <DemoDisclaimerBanner />

      {/* Main Navigation Bar */}
      <Navbar
        currentView={currentView}
        onChangeView={(view) => {
          if (currentView === 'game') {
            handleExitGame();
          }
          setCurrentView(view);
        }}
        onOpenAddCredits={() => setShowAddCreditsModal(true)}
        onOpenResetDemo={() => setShowResetDemoModal(true)}
      />

      {/* Floating System Toast Notification */}
      {lastNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-xs font-semibold text-white">
            {lastNotification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{lastNotification.message}</span>
            <button
              onClick={clearNotification}
              className="ml-2 text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1">
        {!isAuthenticated ? (
          <Login />
        ) : currentView === 'game' && activeGame ? (
          <GameWrapper
            game={activeGame}
            onExit={handleExitGame}
            onOpenAddCredits={() => setShowAddCreditsModal(true)}
          />
        ) : currentView === 'transactions' ? (
          <TransactionHistory
            onBackToDashboard={() => setCurrentView('dashboard')}
            onOpenAddCredits={() => setShowAddCreditsModal(true)}
          />
        ) : (
          <Dashboard
            onSelectGame={handleSelectGame}
            onOpenAddCredits={() => setShowAddCreditsModal(true)}
            onViewAllTransactions={() => setCurrentView('transactions')}
          />
        )}
      </main>

      {/* Modals */}
      <AddCreditsModal
        isOpen={showAddCreditsModal}
        onClose={() => setShowAddCreditsModal(false)}
      />

      <ResetDemoModal
        isOpen={showResetDemoModal}
        onClose={() => setShowResetDemoModal(false)}
        onResetConfirmed={handleResetComplete}
      />

      {/* Prototype Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-semibold text-slate-400">Game08 Platform Demo Prototype</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Simulated virtual credits only. No real gambling, wagering, deposits, or payouts.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
