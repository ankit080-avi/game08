# Game08 | Web Gaming Platform Prototype

> **IMPORTANT DISCLAIMER:**
> This repository is strictly a **DEMO / PROTOTYPE**. It does not contain any real-money gambling, real payment processing, real withdrawals, or external payment gateways. All wallet amounts are virtual demo credits stored locally in the browser.

---

## 🎯 Project Overview

**Game08** is a clean, modern web gaming platform prototype designed to demonstrate:
1. **Modular Authentication:** Dummy user profile and session persistence with `localStorage`.
2. **Virtual Demo Wallet:** Strict client-side balance management with zero negative-balance tolerance, validation, and immutable transaction records.
3. **Pluggable Game Architecture:** Decoupled game registry (`src/games/registry.js`) allowing new games to be added without touching the auth or wallet services.
4. **Interactive Playable Ludo Game:** Playable demonstration Ludo game with 15x15 board, animated dice roller, turn indicator, bot opponent, sound effects, and victory demo rewards.
5. **Secondary Plug-and-Play Game:** Tic-Tac-Toe Blitz demonstration showcasing instant game loading via the modular game launcher.
6. **Transaction Audit Trail:** Dedicated transaction history with search, filtering, and CSV export.
7. **Demo Reset:** Complete one-click data wipe returning the sandbox to a clean state.

---

## 🛠️ Architecture & Directory Structure

```text
C:/gaming_project/
├── index.html                     # HTML5 entry with fonts and Tailwind CSS configuration
├── package.json                   # React 19, Lucide icons, Canvas-confetti, Vite
├── vite.config.js                 # Vite development and production configuration
├── test-runner.js                 # Automated headless test suite (34/34 tests passing)
├── src/
│   ├── main.jsx                   # React root mount
│   ├── App.jsx                    # Core layout, modals, toasts, and view routing
│   ├── context/
│   │   ├── AuthContext.jsx        # User state provider
│   │   └── WalletContext.jsx      # Balance and transaction provider
│   ├── services/
│   │   ├── storageService.js      # Centralized localStorage manager with 'game08_' prefix
│   │   ├── authService.js         # Modular authentication logic (swappable with REST/JWT)
│   │   └── walletService.js       # Centralized virtual wallet service & transaction logging
│   ├── components/
│   │   ├── DemoDisclaimerBanner.jsx # Top disclaimer banner
│   │   ├── Navbar.jsx             # Top bar with balance pill, actions, and profile
│   │   ├── Login.jsx              # 1-click demo login & custom profile registration
│   │   ├── Dashboard.jsx          # Metrics, wallet card, available game cards, recent txns
│   │   ├── AddCreditsModal.jsx    # Presets (+100, +500, +1000) & custom credit input
│   │   ├── InsufficientBalanceModal.jsx # Friendly balance alert with top-up action
│   │   ├── ResetDemoModal.jsx     # Confirmation dialog to clear demo storage
│   │   └── TransactionHistory.jsx # Dedicated transaction table, filters, stats, CSV export
│   ├── games/
│   │   ├── registry.js            # Central catalog for all platform games
│   │   ├── GameWrapper.jsx        # Common game host, balance deduction, and win rewards
│   │   ├── ludo/
│   │   │   ├── LudoGame.jsx       # Interactive Ludo game board, bot, dice, and HUD
│   │   │   └── ludoLogic.js       # Coordinates, track mapping, rules, and audio synthesizer
│   │   └── ticTacToe/
│   │       └── TicTacToeGame.jsx  # Modular 2nd game proving plug-and-play architecture
│   └── styles/
│       └── index.css              # Custom styling, 15x15 Ludo board grid, animations
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Automated Verification Tests
Run the automated test suite verifying auth, wallet constraints, insufficient-balance handling, Ludo rules, and game registry:
```bash
node test-runner.js
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or the port displayed in your terminal).

### 4. Build for Production
```bash
npm run build
```

---

## 🕹️ Complete Demonstration Flow

1. **Login / Register**:
   - Click **"1-Click Instant Demo Login"** to jump straight in with an initial grant of **500 Demo Credits**.
   - Or register a custom username and display name.
2. **Dashboard Overview**:
   - View your user profile, available demo balance, total games available, and recent transaction log.
3. **Add Demo Credits**:
   - Click **"Add Demo Credits"** in the navigation bar or balance card.
   - Choose a quick preset (`+100`, `+500`, `+1000`, `+2500`) or enter a custom amount.
   - Balance updates immediately and logs a `CREDIT_ADDED` transaction.
4. **Game Selection & Insufficient Balance Check**:
   - Locate the **Ludo Classic** card (Entry Fee: 100 Demo Credits).
   - If balance is below 100, the card and modal warn of insufficient balance with a direct top-up link.
   - If balance is sufficient, clicking **"Play Demo"** deducts 100 Demo Credits, creates an `ENTRY_FEE` transaction, and opens the Ludo arena.
5. **Play Ludo**:
   - Roll the animated dice.
   - Roll a **6** to deploy tokens from the yard and earn a bonus turn.
   - Move tokens along the standard 15x15 track.
   - The AI Bot takes its turn automatically.
   - Reach home to win a victory reward of **+180 Demo Credits**.
6. **Exit to Dashboard**:
   - Click **"Exit to Dashboard"** at any time to preserve session state and return to the main dashboard.
7. **View Transaction History**:
   - Navigate to **"Transactions"** to inspect all transactions, filter by type (Credits Added, Entry Fees, Rewards), and export a CSV audit log.
8. **Reset Demo Data**:
   - Click the reset button in the navbar, review the confirmation modal, and confirm to clear all demo data and restart fresh.
