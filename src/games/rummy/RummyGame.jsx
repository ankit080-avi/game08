import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  HelpCircle,
  Trophy,
  RefreshCw,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Plus,
  ArrowLeftRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { RummyCard } from './RummyCard.jsx';
import { rummyAudio } from './RummyAudio.js';
import {
  createRummyDeck,
  isCardJoker,
  autoGroupCards,
  evaluateGroup,
  validateDeclaration,
  calculateDeadwood,
  botPlayTurn,
  isPureSequence,
  isSequence
} from './rummyLogic.js';

export const RummyGame = ({
  onWin,
  onExit,
  session,
  entryFee = 50
}) => {
  // Game states
  const [gameState, setGameState] = useState('DEALING'); // 'DEALING' | 'PLAYING' | 'GAME_OVER'
  const [turn, setTurn] = useState('PLAYER'); // 'PLAYER' | 'BOT'
  const [turnPhase, setTurnPhase] = useState('DRAW'); // 'DRAW' | 'DISCARD'
  const [closedDeck, setClosedDeck] = useState([]);
  const [openDeck, setOpenDeck] = useState([]);
  const [cutJoker, setCutJoker] = useState(null);
  const [playerGroups, setPlayerGroups] = useState([]);
  const [botHand, setBotHand] = useState([]);
  const [selectedCardIds, setSelectedCardIds] = useState(new Set());
  const [soundOn, setSoundOn] = useState(true);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [declarationModal, setDeclarationModal] = useState(null);
  const [confirmInvalidModal, setConfirmInvalidModal] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Dealing cards...');
  const [historyLogs, setHistoryLogs] = useState([]);
  const [botActionText, setBotActionText] = useState('Waiting...');

  const botTimerRef = useRef(null);

  const addLog = useCallback((msg) => {
    setHistoryLogs((prev) => [msg, ...prev.slice(0, 8)]);
  }, []);

  const toggleSound = () => {
    const isMuted = rummyAudio.toggleMute();
    setSoundOn(!isMuted);
  };

  // Initialize a new round
  const startNewMatch = useCallback(() => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    setGameState('DEALING');
    setTurn('PLAYER');
    setTurnPhase('DRAW');
    setSelectedCardIds(new Set());
    setDeclarationModal(null);
    setConfirmInvalidModal(null);

    const deck = createRummyDeck();

    // Deal 13 cards to player and 13 cards to bot
    const pCards = deck.splice(0, 13);
    const bCards = deck.splice(0, 13);

    // Pick 1 cut wild joker
    const cut = deck.pop();

    // Pick 1 card for open deck
    const firstOpen = deck.pop();

    // Group player cards
    const initialGroups = autoGroupCards(pCards, cut);

    setCutJoker(cut);
    setClosedDeck(deck);
    setOpenDeck([firstOpen]);
    setPlayerGroups(initialGroups);
    setBotHand(bCards);

    setStatusMessage(`Step 1: Tap the Closed Deck or Open Deck to draw a card.`);
    addLog(`Round initialized. Cut Wild Joker: ${cut.rank}${cut.suit}. Entry Fee: ${entryFee} Credits.`);

    rummyAudio.playCardSlide();

    setTimeout(() => {
      setGameState('PLAYING');
    }, 500);
  }, [entryFee, addLog]);

  useEffect(() => {
    startNewMatch();
    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [startNewMatch]);

  // Card Selection inside player hand
  const handleCardClick = (card, e) => {
    if (e) e.stopPropagation();
    rummyAudio.playCardClick();

    setSelectedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(card.id)) {
        next.delete(card.id);
      } else {
        next.add(card.id);
      }
      return next;
    });
  };

  // Helper to get all selected card objects
  const getSelectedCards = () => {
    const selected = [];
    playerGroups.forEach((g) => {
      g.forEach((c) => {
        if (selectedCardIds.has(c.id)) {
          selected.push(c);
        }
      });
    });
    return selected;
  };

  // Deselect all
  const handleDeselectAll = () => {
    setSelectedCardIds(new Set());
  };

  // Player Draw from Closed Deck
  const handleDrawClosed = () => {
    if (gameState !== 'PLAYING' || turn !== 'PLAYER' || turnPhase !== 'DRAW') return;
    if (closedDeck.length === 0) {
      if (openDeck.length > 1) {
        const top = openDeck[openDeck.length - 1];
        const rest = openDeck.slice(0, openDeck.length - 1);
        setClosedDeck(rest);
        setOpenDeck([top]);
      }
      return;
    }

    rummyAudio.playCardDraw();
    const newClosed = [...closedDeck];
    const drawn = newClosed.pop();

    // Place drawn card into the last group
    const nextGroups = [...playerGroups];
    if (nextGroups.length > 0) {
      nextGroups[nextGroups.length - 1] = [...nextGroups[nextGroups.length - 1], drawn];
    } else {
      nextGroups.push([drawn]);
    }

    // Automatically select the drawn card so the player can immediately see it or discard it
    setSelectedCardIds(new Set([drawn.id]));

    setClosedDeck(newClosed);
    setPlayerGroups(nextGroups);
    setTurnPhase('DISCARD');
    setStatusMessage(`You drew ${drawn.rank}${drawn.suit}. Select 1 card and tap Discard (or Declare).`);
    addLog(`You drew a card from Closed Deck.`);
  };

  // Player Draw from Open Deck
  const handleDrawOpen = () => {
    if (gameState !== 'PLAYING' || turn !== 'PLAYER' || turnPhase !== 'DRAW') return;
    if (openDeck.length === 0) return;

    rummyAudio.playCardDraw();
    const newOpen = [...openDeck];
    const drawn = newOpen.pop();

    const nextGroups = [...playerGroups];
    if (nextGroups.length > 0) {
      nextGroups[nextGroups.length - 1] = [...nextGroups[nextGroups.length - 1], drawn];
    } else {
      nextGroups.push([drawn]);
    }

    // Select the drawn card
    setSelectedCardIds(new Set([drawn.id]));

    setOpenDeck(newOpen);
    setPlayerGroups(nextGroups);
    setTurnPhase('DISCARD');
    setStatusMessage(`Picked ${drawn.rank}${drawn.suit} from Open Deck. Select 1 card and tap Discard.`);
    addLog(`You picked ${drawn.rank}${drawn.suit} from Open Deck.`);
  };

  // Player Discard 1 selected card
  const handleDiscard = (targetCard = null) => {
    if (gameState !== 'PLAYING' || turn !== 'PLAYER' || turnPhase !== 'DISCARD') return;

    let cardToDiscard = targetCard;
    if (!cardToDiscard) {
      const selected = getSelectedCards();
      if (selected.length !== 1) {
        setStatusMessage('Please select exactly 1 card to discard.');
        rummyAudio.playError();
        return;
      }
      cardToDiscard = selected[0];
    }

    if (!cardToDiscard) return;

    rummyAudio.playCardDiscard();

    // Remove card from player groups
    const nextGroups = playerGroups
      .map((g) => g.filter((c) => c.id !== cardToDiscard.id))
      .filter((g) => g.length > 0);

    setPlayerGroups(nextGroups);
    setOpenDeck((prev) => [...prev, cardToDiscard]);
    setSelectedCardIds(new Set());
    setTurnPhase('DRAW');
    setTurn('BOT');
    setStatusMessage(`You discarded ${cardToDiscard.rank}${cardToDiscard.suit}. Opponent's turn...`);
    addLog(`You discarded ${cardToDiscard.rank}${cardToDiscard.suit}.`);
    setBotActionText('Calculating move...');

    // Trigger bot turn
    triggerBotTurn(nextGroups, [...openDeck, cardToDiscard], closedDeck);
  };

  // Bot Turn Automation
  const triggerBotTurn = (currentPGroups, currentOpen, currentClosed) => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    botTimerRef.current = setTimeout(() => {
      setBotActionText('Drawing card...');
      rummyAudio.playCardDraw();

      setTimeout(() => {
        const result = botPlayTurn({
          botHand,
          openDeck: currentOpen,
          closedDeck: currentClosed,
          cutJoker
        });

        setBotHand(result.botHand);
        setOpenDeck(result.openDeck);
        setClosedDeck(result.closedDeck);

        const drawnFrom = result.pickedFrom === 'open' ? 'Open Deck' : 'Closed Deck';
        const discarded = result.discardedCard;

        rummyAudio.playCardDiscard();
        setBotActionText(`Discarded ${discarded ? discarded.rank + discarded.suit : 'Card'}`);
        addLog(`Bot drew from ${drawnFrom} and discarded ${discarded?.rank || ''}${discarded?.suit || ''}.`);

        setTurn('PLAYER');
        setTurnPhase('DRAW');
        setStatusMessage(`Your Turn: Draw a card from Closed Deck or Open Deck.`);
      }, 900);
    }, 1100);
  };

  // Auto-sort player cards by suit
  const handleAutoSort = () => {
    rummyAudio.playCardSlide();
    const allCards = playerGroups.flat();
    const sorted = autoGroupCards(allCards, cutJoker);
    setPlayerGroups(sorted);
    setSelectedCardIds(new Set());
    setStatusMessage('Hand organized into suit groups.');
  };

  // Group selected cards into a new meld
  const handleGroupSelected = () => {
    if (selectedCardIds.size < 2) {
      setStatusMessage('Select 2 or more cards to create a new group.');
      rummyAudio.playError();
      return;
    }

    const selectedCards = [];
    const remainingGroups = [];

    playerGroups.forEach((g) => {
      const remainingInGroup = [];
      g.forEach((c) => {
        if (selectedCardIds.has(c.id)) {
          selectedCards.push(c);
        } else {
          remainingInGroup.push(c);
        }
      });
      if (remainingInGroup.length > 0) {
        remainingGroups.push(remainingInGroup);
      }
    });

    remainingGroups.push(selectedCards);
    setPlayerGroups(remainingGroups);
    setSelectedCardIds(new Set());
    rummyAudio.playMeldSuccess();
    setStatusMessage(`Created new meld with ${selectedCards.length} cards.`);
  };

  // Move selected card(s) into a target group
  const handleMoveToGroup = (targetGroupIndex) => {
    if (selectedCardIds.size === 0) return;

    const movingCards = [];
    const cleanedGroups = playerGroups
      .map((g, idx) => {
        if (idx === targetGroupIndex) return g;
        return g.filter((c) => {
          if (selectedCardIds.has(c.id)) {
            movingCards.push(c);
            return false;
          }
          return true;
        });
      })
      .filter((g, idx) => g.length > 0 || idx === targetGroupIndex);

    if (movingCards.length > 0) {
      cleanedGroups[targetGroupIndex] = [...cleanedGroups[targetGroupIndex], ...movingCards];
      setPlayerGroups(cleanedGroups);
      setSelectedCardIds(new Set());
      rummyAudio.playCardClick();
      setStatusMessage(`Moved ${movingCards.length} card(s) to group #${targetGroupIndex + 1}.`);
    }
  };

  // Split selected cards into a brand-new group
  const handleCreateNewGroupWithSelected = () => {
    if (selectedCardIds.size === 0) {
      setStatusMessage('Select 1 or more cards first to move them into a new group.');
      rummyAudio.playError();
      return;
    }

    const movingCards = [];
    const remainingGroups = [];

    playerGroups.forEach((g) => {
      const rem = [];
      g.forEach((c) => {
        if (selectedCardIds.has(c.id)) {
          movingCards.push(c);
        } else {
          rem.push(c);
        }
      });
      if (rem.length > 0) {
        remainingGroups.push(rem);
      }
    });

    remainingGroups.push(movingCards);
    setPlayerGroups(remainingGroups);
    setSelectedCardIds(new Set());
    rummyAudio.playMeldSuccess();
    setStatusMessage(`Formed a new group with ${movingCards.length} card(s).`);
  };

  // Declare / Show Hand
  const handleDeclare = () => {
    if (gameState !== 'PLAYING' || turn !== 'PLAYER') return;

    let groupsToEvaluate = [...playerGroups];
    let discardedFinishCard = null;

    const totalCards = groupsToEvaluate.reduce((acc, g) => acc + g.length, 0);

    // In 13-card rummy, declaration is done with 14 cards (1 finish card discarded to finish slot)
    if (totalCards === 14) {
      const selected = getSelectedCards();
      if (selected.length !== 1) {
        setStatusMessage('Select 1 card to place in the Finish Slot to declare.');
        rummyAudio.playError();
        return;
      }
      discardedFinishCard = selected[0];
      groupsToEvaluate = groupsToEvaluate
        .map((g) => g.filter((c) => c.id !== discardedFinishCard.id))
        .filter((g) => g.length > 0);
    }

    const valResult = validateDeclaration(groupsToEvaluate, cutJoker);
    const botScore = calculateDeadwood(autoGroupCards(botHand, cutJoker), cutJoker);

    if (valResult.isValid) {
      // Valid Show!
      rummyAudio.playVictory();
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.6 }
      });

      setGameState('GAME_OVER');
      setDeclarationModal({
        winner: 'PLAYER',
        isValid: true,
        reason: valResult.reason,
        playerDeadwood: 0,
        botDeadwood: botScore,
        reward: 90,
        finishCard: discardedFinishCard
      });

      if (onWin) {
        onWin(90);
      }
      addLog('🏆 Valid Show! You won 90 Demo Credits!');
    } else {
      // User-friendly safety: show confirmation modal before applying 80-point penalty!
      setConfirmInvalidModal({
        reason: valResult.reason,
        finishCard: discardedFinishCard,
        botScore
      });
    }
  };

  // Confirm wrong show penalty if player deliberately confirms
  const handleConfirmWrongShow = () => {
    if (!confirmInvalidModal) return;

    rummyAudio.playError();
    setDeclarationModal({
      winner: 'BOT',
      isValid: false,
      reason: confirmInvalidModal.reason,
      playerDeadwood: 80,
      botDeadwood: 0,
      reward: 0,
      finishCard: confirmInvalidModal.finishCard
    });
    setConfirmInvalidModal(null);
    setGameState('GAME_OVER');
    addLog(`❌ Invalid Show penalty (80 pts): ${confirmInvalidModal.reason}`);
  };

  // Real-time evaluation of player hand
  const pureSeqCount = playerGroups.filter((g) => isPureSequence(g)).length;
  const totalSeqCount = playerGroups.filter((g) => isSequence(g, cutJoker)).length;
  const liveDeadwood = calculateDeadwood(playerGroups, cutJoker);
  const selectedCards = getSelectedCards();
  const isShowReady = pureSeqCount >= 1 && totalSeqCount >= 2 && liveDeadwood === 0;

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-950 via-[#041d11] to-black text-white flex flex-col items-center select-none font-sans overflow-x-hidden">
      {/* 1. Header Navigation & Game Stakes */}
      <header className="w-full max-w-5xl px-3 py-2 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onExit}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white transition flex items-center gap-1 text-xs font-bold shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🎴</span>
            <div>
              <h1 className="text-xs sm:text-sm font-black tracking-wide text-amber-400 leading-none">
                INDIAN RUMMY
              </h1>
              <span className="text-[10px] text-slate-400 font-medium">Points Rummy • 2 Decks • 13 Cards</span>
            </div>
          </div>
        </div>

        {/* Center Stake Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-950/90 border border-emerald-500/50 px-2.5 sm:px-3 py-1 rounded-full shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-bold text-emerald-300">
            Stake: <strong>{entryFee}</strong> | Win: <strong className="text-amber-300">90</strong>
          </span>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setShowRulesModal(true)}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white transition text-xs flex items-center gap-1 shadow"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Guide</span>
          </button>
          <button
            onClick={toggleSound}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white transition shadow"
            title="Sound"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </header>

      {/* 2. Step-by-Step Prompt Banner (Clear User Guidance) */}
      <div className="w-full max-w-4xl px-3 pt-2">
        <div
          className={`w-full py-1.5 px-3 rounded-xl border flex items-center justify-between text-xs transition-all shadow-md ${
            turn === 'PLAYER' && turnPhase === 'DRAW'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
              : turn === 'PLAYER' && turnPhase === 'DISCARD'
              ? 'bg-amber-950/80 border-amber-500/50 text-amber-200'
              : 'bg-slate-900/80 border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {turn === 'PLAYER' ? (turnPhase === 'DRAW' ? '👉' : '🎯') : '⏳'}
            </span>
            <span className="font-bold">
              {turn === 'PLAYER' ? (
                turnPhase === 'DRAW' ? (
                  <>Step 1: Draw a card by tapping the <strong>Closed Deck</strong> or <strong>Open Deck</strong>.</>
                ) : selectedCards.length === 1 ? (
                  <>Step 2: Ready to discard <strong>{selectedCards[0].rank}{selectedCards[0].suit}</strong>. Tap "Discard" or tap Open Deck.</>
                ) : (
                  <>Step 2: Tap any card in your hand to select it for discard or declaration.</>
                )
              ) : (
                <>Opponent's Turn: <strong>Vikram (Bot Pro)</strong> is making a move...</>
              )}
            </span>
          </div>

          {isShowReady && (
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce shrink-0 shadow">
              SHOW READY!
            </span>
          )}
        </div>
      </div>

      {/* 3. Main Casino Table Container */}
      <main className="w-full max-w-4xl flex-1 flex flex-col items-center justify-between p-2 sm:p-3 relative">
        {/* Opponent Bot HUD */}
        <div className="w-full flex items-center justify-between px-3 py-1.5 max-w-2xl bg-slate-900/70 border border-slate-800 rounded-2xl backdrop-blur-sm shadow-md mb-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-black text-xs shadow-md border border-amber-300">
                🤖
              </div>
              {turn === 'BOT' && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-900 animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-200">Vikram Pro</span>
                {turn === 'BOT' && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                    Thinking
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400">{botActionText}</span>
            </div>
          </div>

          {/* Bot Card Stack */}
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-4">
              {Array.from({ length: Math.min(7, botHand.length) }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-5 h-8 rounded bg-gradient-to-b from-red-900 to-rose-950 border border-amber-400/40 shadow-sm"
                />
              ))}
            </div>
            <span className="text-xs font-black text-amber-400 ml-1">
              {botHand.length} cards
            </span>
          </div>
        </div>

        {/* Felt Table Surface */}
        <div className="relative w-full max-w-3xl min-h-[220px] sm:min-h-[270px] rounded-[36px] bg-gradient-to-b from-[#0a522c] via-[#064022] to-[#042d17] border-4 sm:border-6 border-amber-900/90 ring-2 sm:ring-4 ring-amber-500/50 shadow-[inset_0_0_60px_rgba(0,0,0,0.6),0_15px_30px_rgba(0,0,0,0.7)] flex flex-col items-center justify-between p-3 sm:p-4 overflow-hidden">
          {/* Subtle Felt Texture & Filigree Ring */}
          <div className="absolute inset-2 border border-amber-400/20 rounded-[28px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0,transparent_70%)] pointer-events-none" />

          {/* Center Table Watermark */}
          <div className="text-center pointer-events-none opacity-40">
            <span className="text-[10px] font-black tracking-widest text-amber-200 uppercase">
              RummyCircle Table • 13 Cards • 2 Decks
            </span>
          </div>

          {/* Center Interactive Decks: Closed Deck, Cut Wild Joker, Open Deck, Finish Slot */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 my-auto z-10">
            {/* 1. Closed Deck (Draw Pile) */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] sm:text-[10px] font-black text-amber-200 uppercase tracking-wider mb-1">
                Closed Deck
              </span>

              <div className="relative flex items-center justify-center">
                {/* Cut Joker visible tucked horizontally underneath */}
                {cutJoker && (
                  <div className="absolute -left-6 sm:-left-8 rotate-90 scale-85 z-0 pointer-events-none">
                    <RummyCard card={cutJoker} cutJoker={cutJoker} size="compact" />
                  </div>
                )}

                {/* Draw Pile with Stacked 3D Cards Appearance */}
                <div
                  onClick={turn === 'PLAYER' && turnPhase === 'DRAW' ? handleDrawClosed : undefined}
                  className={`relative z-10 transition-transform ${
                    turn === 'PLAYER' && turnPhase === 'DRAW'
                      ? 'cursor-pointer hover:scale-105 active:scale-95 ring-4 ring-emerald-400 rounded-lg animate-pulse'
                      : ''
                  }`}
                  title="Draw from Closed Deck"
                >
                  <RummyCard isFaceDown size="small" />
                  <div className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-slate-950 text-amber-400 font-black text-[9px] px-1.5 py-0.2 rounded-full border border-amber-400/60 shadow">
                    {closedDeck.length}
                  </div>
                </div>
              </div>

              <div className="mt-2">
                {turn === 'PLAYER' && turnPhase === 'DRAW' ? (
                  <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow animate-bounce">
                    TAP TO DRAW
                  </span>
                ) : (
                  <span className="text-[9px] text-amber-300/70 font-medium">Draw Pile</span>
                )}
              </div>
            </div>

            {/* Cut Joker Callout Pill */}
            {cutJoker && (
              <div className="flex flex-col items-center bg-slate-950/80 border border-amber-400/50 rounded-xl px-2 sm:px-3 py-1.5 shadow-md">
                <span className="text-[8px] sm:text-[9px] font-black text-amber-400 uppercase tracking-widest">
                  Wild Joker
                </span>
                <span className="text-sm sm:text-base font-black text-white">
                  {cutJoker.rank} {cutJoker.suit}
                </span>
                <span className="text-[8px] text-amber-200/80 font-medium">
                  All {cutJoker.rank}s are Wild
                </span>
              </div>
            )}

            {/* 2. Open Deck (Discard Pile) */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] sm:text-[10px] font-black text-amber-200 uppercase tracking-wider mb-1">
                Open Deck
              </span>

              <div
                onClick={() => {
                  if (turn === 'PLAYER') {
                    if (turnPhase === 'DRAW') {
                      handleDrawOpen();
                    } else if (turnPhase === 'DISCARD' && selectedCards.length === 1) {
                      handleDiscard();
                    }
                  }
                }}
                className={`relative transition-transform ${
                  turn === 'PLAYER' && turnPhase === 'DRAW' && openDeck.length > 0
                    ? 'cursor-pointer hover:scale-105 active:scale-95 ring-4 ring-cyan-400 rounded-lg animate-pulse'
                    : turn === 'PLAYER' && turnPhase === 'DISCARD' && selectedCards.length === 1
                    ? 'cursor-pointer hover:scale-105 active:scale-95 ring-4 ring-rose-400 rounded-lg'
                    : ''
                }`}
                title={
                  turnPhase === 'DRAW'
                    ? 'Draw top card from Open Deck'
                    : selectedCards.length === 1
                    ? 'Discard selected card into Open Deck'
                    : 'Open Deck'
                }
              >
                {openDeck.length > 0 ? (
                  <RummyCard
                    card={openDeck[openDeck.length - 1]}
                    cutJoker={cutJoker}
                    size="small"
                  />
                ) : (
                  <div className="w-12 h-17 sm:w-14 sm:h-20 rounded-lg border-2 border-dashed border-emerald-500/40 flex items-center justify-center text-xs text-emerald-400/60 font-bold">
                    Empty
                  </div>
                )}
              </div>

              <div className="mt-2">
                {turn === 'PLAYER' && turnPhase === 'DRAW' ? (
                  <span className="bg-cyan-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow animate-bounce">
                    PICK UP
                  </span>
                ) : turn === 'PLAYER' && turnPhase === 'DISCARD' && selectedCards.length === 1 ? (
                  <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                    DISCARD HERE
                  </span>
                ) : (
                  <span className="text-[9px] text-cyan-300/70 font-medium">Discard Pile</span>
                )}
              </div>
            </div>

            {/* 3. Finish Slot / Declare Zone */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] sm:text-[10px] font-black text-amber-200 uppercase tracking-wider mb-1">
                Finish Slot
              </span>

              <div
                onClick={turn === 'PLAYER' && turnPhase === 'DISCARD' ? handleDeclare : undefined}
                className={`w-12 h-17 sm:w-14 sm:h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-1 text-center transition-all ${
                  turn === 'PLAYER' && turnPhase === 'DISCARD'
                    ? 'border-amber-400 bg-amber-950/40 cursor-pointer hover:bg-amber-500/30 ring-2 ring-amber-400/80 animate-pulse'
                    : 'border-slate-700 bg-slate-900/30 opacity-60'
                }`}
                title="Place finish card here to declare show"
              >
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mb-0.5" />
                <span className="text-[8px] sm:text-[9px] font-black text-amber-300 uppercase leading-tight">
                  DECLARE
                </span>
              </div>

              <div className="mt-2">
                <span className="text-[9px] text-amber-400/80 font-semibold">
                  {turn === 'PLAYER' && turnPhase === 'DISCARD' && selectedCards.length === 1
                    ? 'Tap to Declare'
                    : 'Finish Card'}
                </span>
              </div>
            </div>
          </div>

          {/* Table Footer: Life & Points Live Status Bar */}
          <div className="w-full flex items-center justify-center gap-2 flex-wrap text-center pt-1 z-10">
            {/* First Life: Pure Sequence */}
            <div
              className={`flex items-center gap-1 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full border shadow-sm ${
                pureSeqCount >= 1
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-500 text-rose-300'
              }`}
            >
              {pureSeqCount >= 1 ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3 text-rose-400" />}
              <span>1st Life (Pure): {pureSeqCount >= 1 ? 'Valid ✓' : 'Needed'}</span>
            </div>

            {/* Second Life: 2nd Sequence */}
            <div
              className={`flex items-center gap-1 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full border shadow-sm ${
                totalSeqCount >= 2
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-500 text-rose-300'
              }`}
            >
              {totalSeqCount >= 2 ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3 text-rose-400" />}
              <span>2nd Life: {totalSeqCount >= 2 ? 'Valid ✓' : `Needed (${totalSeqCount}/2)`}</span>
            </div>

            {/* Deadwood Points */}
            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 shadow">
              <span>Score:</span>
              <strong className={liveDeadwood === 0 ? 'text-emerald-400' : 'text-amber-400'}>
                {liveDeadwood} pts
              </strong>
            </div>
          </div>
        </div>

        {/* 4. Player Action Toolbar (Sort, Group, Discard, Declare) */}
        <section className="w-full mt-2 flex flex-col gap-2">
          <div className="w-full flex items-center justify-between gap-2 flex-wrap px-1">
            {/* Left Tools: Auto-Sort, Group, New Group */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={handleAutoSort}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 transition shadow cursor-pointer active:scale-95"
              >
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>Sort Suit</span>
              </button>

              <button
                onClick={handleGroupSelected}
                disabled={selectedCards.length < 2}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition shadow ${
                  selectedCards.length >= 2
                    ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-400 text-white cursor-pointer active:scale-95 shadow-indigo-500/20'
                    : 'bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>Group ({selectedCards.length})</span>
              </button>

              <button
                onClick={handleCreateNewGroupWithSelected}
                disabled={selectedCards.length === 0}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition shadow ${
                  selectedCards.length > 0
                    ? 'bg-slate-800 hover:bg-slate-700 border-amber-400/50 text-amber-300 cursor-pointer active:scale-95'
                    : 'bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                title="Create a new separate group with selected cards"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Group</span>
              </button>

              {selectedCards.length > 0 && (
                <button
                  onClick={handleDeselectAll}
                  className="text-xs text-slate-400 hover:text-white px-1.5 py-1 underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Right Tools: Discard and Declare */}
            <div className="flex items-center gap-2">
              {turn === 'PLAYER' && turnPhase === 'DISCARD' && (
                <button
                  onClick={() => handleDiscard()}
                  disabled={selectedCards.length !== 1}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition shadow-lg ${
                    selectedCards.length === 1
                      ? 'bg-rose-600 hover:bg-rose-500 border-rose-400 text-white cursor-pointer active:scale-95 animate-pulse shadow-rose-500/30'
                      : 'bg-slate-800/50 border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>
                    {selectedCards.length === 1
                      ? `Discard ${selectedCards[0].rank}${selectedCards[0].suit}`
                      : 'Select 1 to Discard'}
                  </span>
                </button>
              )}

              <button
                onClick={handleDeclare}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl border text-xs font-black tracking-wide flex items-center gap-1.5 transition shadow-lg ${
                  isShowReady
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 border-amber-200 cursor-pointer active:scale-95 animate-bounce shadow-amber-500/40'
                    : turn === 'PLAYER' && turnPhase === 'DISCARD'
                    ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 border-amber-400 cursor-pointer active:scale-95'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}
              >
                <Trophy className="w-4 h-4 text-slate-950" />
                <span>Declare Show</span>
              </button>
            </div>
          </div>

          {/* 5. Player's Meld Groups (Touch-friendly Hand Container) */}
          <div className="w-full flex items-stretch gap-2 sm:gap-3 overflow-x-auto pb-3 pt-1 px-1 scrollbar-thin scrollbar-thumb-slate-700">
            {playerGroups.map((group, groupIdx) => {
              const evalInfo = evaluateGroup(group, cutJoker);
              return (
                <div
                  key={groupIdx}
                  onClick={() => {
                    // Clicking the group card area when cards are selected moves them into this group
                    if (selectedCards.length > 0) {
                      handleMoveToGroup(groupIdx);
                    }
                  }}
                  className={`flex flex-col items-center border rounded-2xl p-1.5 sm:p-2 min-w-[110px] sm:min-w-[130px] transition-all shadow-md ${
                    selectedCards.length > 0 ? 'cursor-pointer hover:border-amber-400 hover:bg-amber-500/10' : ''
                  } ${
                    evalInfo.type === 'pure_seq'
                      ? 'border-emerald-500/80 bg-emerald-950/30'
                      : evalInfo.type === 'impure_seq'
                      ? 'border-teal-500/80 bg-teal-950/30'
                      : evalInfo.type === 'set'
                      ? 'border-cyan-500/80 bg-cyan-950/30'
                      : 'border-slate-800 bg-slate-900/70'
                  }`}
                >
                  {/* Group Header Badge & Quick Action */}
                  <div className="w-full flex items-center justify-between mb-1 px-0.5">
                    <span
                      className={`text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm ${
                        evalInfo.type === 'pure_seq'
                          ? 'bg-emerald-500 text-slate-950'
                          : evalInfo.type === 'impure_seq'
                          ? 'bg-teal-500 text-slate-950'
                          : evalInfo.type === 'set'
                          ? 'bg-cyan-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {evalInfo.label}
                    </span>

                    {/* Move Here Shortcut button if cards are selected */}
                    {selectedCards.length > 0 && (
                      <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full shadow animate-pulse">
                        Move Here
                      </span>
                    )}
                  </div>

                  {/* Overlapping Cards Container */}
                  <div className="flex -space-x-7 sm:-space-x-8 pt-2.5 pb-1 px-1">
                    {group.map((card) => (
                      <RummyCard
                        key={card.id}
                        card={card}
                        cutJoker={cutJoker}
                        isSelected={selectedCardIds.has(card.id)}
                        onClick={(e) => handleCardClick(card, e)}
                        size="normal"
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 6. Invalid Declaration Safety Confirmation Modal */}
      {confirmInvalidModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-7 h-7 text-rose-400" />
            </div>

            <h3 className="text-xl font-black text-rose-400 mb-1">
              Incomplete Declaration!
            </h3>
            <p className="text-xs text-rose-200 font-semibold mb-4 leading-relaxed">
              {confirmInvalidModal.reason}
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 mb-5 text-left text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Misclick Protection</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                In Indian Rummy, declaring without meeting the Pure Sequence requirement results in an <strong>80-point Wrong Show penalty</strong>. We stopped you so you can continue your match safely!
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setConfirmInvalidModal(null)}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-black text-xs sm:text-sm text-white shadow-lg cursor-pointer transition active:scale-95"
              >
                Return to Hand (Safe)
              </button>
              <button
                onClick={handleConfirmWrongShow}
                className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-rose-950/80 text-rose-400 font-bold text-xs border border-rose-900/50 cursor-pointer transition"
              >
                Declare Penalty
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Final Declaration Result Modal */}
      {declarationModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
            {declarationModal.isValid ? (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Trophy className="w-8 h-8 text-amber-400" />
                </div>
                <h2 className="text-2xl font-black text-amber-400 mb-1">
                  VICTORY! VALID SHOW!
                </h2>
                <p className="text-xs text-emerald-300 font-bold mb-4">
                  {declarationModal.reason}
                </p>

                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 mb-5 text-left text-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Your Deadwood:</span>
                    <strong className="text-emerald-400 font-bold text-sm">0 pts</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Bot Deadwood:</span>
                    <strong className="text-rose-400 font-bold text-sm">
                      {declarationModal.botDeadwood} pts
                    </strong>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-amber-300">
                    <span className="font-bold">Net Win Reward:</span>
                    <strong className="text-base font-black text-amber-400">
                      +{declarationModal.reward} Credits
                    </strong>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={startNewMatch}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-black text-sm text-white shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Play Again</span>
                  </button>
                  <button
                    onClick={onExit}
                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm cursor-pointer"
                  >
                    Exit Lobby
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <AlertCircle className="w-8 h-8 text-rose-400" />
                </div>
                <h2 className="text-xl font-black text-rose-400 mb-1">
                  WRONG SHOW!
                </h2>
                <p className="text-xs text-rose-200 font-semibold mb-4">
                  {declarationModal.reason}
                </p>

                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 mb-5 text-left text-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Wrong Show Penalty:</span>
                    <strong className="text-rose-400 font-bold text-sm">80 Points (Full Count)</strong>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Under Indian Rummy rules, declaring without a Pure Sequence results in full count penalty.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={startNewMatch}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 font-black text-sm text-white shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>
                  <button
                    onClick={onExit}
                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm cursor-pointer"
                  >
                    Exit Lobby
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 8. Interactive Rules & Visual Guide Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 text-left shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowRulesModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎴</span>
              <h3 className="text-lg font-black text-amber-400">
                13-Card Indian Rummy Rules (RummyCircle Standard)
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/40">
                <strong className="text-emerald-400 text-sm block mb-1">
                  1. First Life (Pure Sequence) — MANDATORY
                </strong>
                At least 3 consecutive cards of the <strong>exact same suit without any Jokers</strong>.
                <div className="mt-1 flex items-center gap-1 font-mono text-xs text-slate-200 bg-slate-900 px-2 py-1 rounded">
                  Example: 4♥ - 5♥ - 6♥ or 10♠ - J♠ - Q♠ - K♠
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-teal-500/40">
                <strong className="text-teal-400 text-sm block mb-1">
                  2. Second Life (Second Sequence) — MANDATORY
                </strong>
                A second sequence of 3 or more consecutive cards. Can use <strong>Wild Cut Jokers</strong> or <strong>Printed Jokers</strong>.
                <div className="mt-1 flex items-center gap-1 font-mono text-xs text-slate-200 bg-slate-900 px-2 py-1 rounded">
                  Example: 7♦ - 8♦ - [Joker ★]
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/40">
                <strong className="text-cyan-400 text-sm block mb-1">
                  3. Sets & Groups
                </strong>
                3 or 4 cards of the <strong>same rank in different suits</strong>. Jokers are permitted.
                <div className="mt-1 flex items-center gap-1 font-mono text-xs text-slate-200 bg-slate-900 px-2 py-1 rounded">
                  Example: 9♠ - 9♥ - 9♦ (all distinct suits)
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/40">
                <strong className="text-amber-400 text-sm block mb-1">
                  4. Cut Wild Joker
                </strong>
                One card is cut face-up at the start. All cards matching its rank across all 4 suits act as Wild Jokers!
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-rose-500/40">
                <strong className="text-rose-400 text-sm block mb-1">
                  5. Scoring & Declare
                </strong>
                Face cards (A, K, Q, J) = 10 pts. Number cards = face value. Jokers = 0 pts.
                Declaring with a valid show scores <strong>0 points (Win)</strong>. Declaring without meeting requirements causes an 80-point penalty.
              </div>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full mt-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm cursor-pointer shadow-lg transition active:scale-95"
            >
              Ready to Play!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
