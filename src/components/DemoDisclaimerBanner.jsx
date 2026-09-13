import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const DemoDisclaimerBanner = () => {
  return (
    <aside aria-label="Demo notice" className="w-full bg-amber-500/10 border-b border-amber-500/20 text-amber-300 px-4 py-2 text-xs font-medium backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>DEMO / PROTOTYPE NOTICE:</strong> All wallet balances are simulated virtual demo credits stored locally in your browser. No real money, payment gateways, gambling, or withdrawals are supported.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Safe Demo Sandbox</span>
        </div>
      </div>
    </aside>
  );
};
