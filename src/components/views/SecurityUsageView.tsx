import React, { useState } from 'react';
import { ShieldCheck, Activity, Key, Lock, AlertTriangle, Users } from 'lucide-react';

export const SecurityUsageView: React.FC = () => {
  const [spendingLimit, setSpendingLimit] = useState(150);

  const securityInvariants = [
    { title: 'Server-Side Secret Key Isolation', status: 'enforced', desc: 'All Gemini & OpenAI API credentials live strictly in process.env; never leaked to client bundles.' },
    { title: 'Least-Privilege Tool Execution', status: 'enforced', desc: 'Code runner sandboxed in isolated iframe memory with restrictive permissions.' },
    { title: 'Human Approval for Destructive Operations', status: 'active', desc: 'Publishing releases, payouts, and irreversible file changes require explicit confirmation.' },
    { title: 'Anti-Abuse Loop Termination', status: 'active', desc: 'Bounded execution limits prevent runaway recursions and excessive token exhaustion.' },
  ];

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="border-b border-slate-800 pb-5">
        <div className="text-xs font-mono text-[#00f0ff] uppercase mb-1">
          MODULES 19 & 20 · RESOURCE TELEMETRY & SECURITY
        </div>
        <h1 className="text-2xl font-extrabold text-white">Usage Quotas, Cost & Account Security</h1>
        <p className="text-xs text-slate-400">
          Real-time API budget governance, security invariants, and server-side secret isolation.
        </p>
      </div>

      {/* Quota & Spending Limit */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase">Monthly API Spending</span>
          <div className="text-2xl font-bold font-mono text-[#00f0ff] mt-1 tabular-nums">$14.28</div>
          <span className="text-[11px] text-slate-500">Of ${spendingLimit} configured quota</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase">Token Velocity</span>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">418.5k</div>
          <span className="text-[11px] text-slate-500">Processed this billing cycle</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-mono text-emerald-400 uppercase">Security Score</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">100%</div>
          <span className="text-[11px] text-slate-500">All 4 security invariants verified</span>
        </div>
      </div>

      {/* Security Invariants Checklist */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Active Security Invariants
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityInvariants.map((inv) => (
            <div key={inv.title} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white">{inv.title}</span>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded uppercase">
                  {inv.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{inv.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
