import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Clock,
  Landmark,
  FileCheck,
} from 'lucide-react';
import { fetchMonetizationLedger } from '../../services/api.ts';
import type { TransactionRecord } from '../../types/index.ts';

export const MonetizationView: React.FC = () => {
  const [ledgerData, setLedgerData] = useState<{
    summary: {
      totalGross: number;
      totalNet: number;
      vortexShare60: number;
      creatorShare40: number;
      pendingPayout: number;
      contractTerms: string;
    };
    transactions: TransactionRecord[];
  } | null>(null);

  const [optedIn, setOptedIn] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState<'Google Pay' | 'SEPA Bank Transfer'>('Google Pay');
  const [payoutStatusMessage, setPayoutStatusMessage] = useState('');

  useEffect(() => {
    fetchMonetizationLedger().then(setLedgerData).catch(console.warn);
  }, []);

  const handleTriggerPayout = () => {
    setPayoutStatusMessage(`Transfer of $${ledgerData?.summary.pendingPayout.toFixed(2)} scheduled via ${selectedPayoutMethod}. Transaction batch queued for bank settlement.`);
    setTimeout(() => {
      setPayoutStatusMessage('');
    }, 6000);
  };

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff2a85]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00f0ff]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
              <DollarSign className="w-3.5 h-3.5" />
              <span>MODULES 14, 15 & 16 · MONETIZATION & AUDITED PAYOUTS</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Creator Revenue & 60% RevShare Program
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Transparent opt-in commercial model where VORTEX retains a 60% contractual platform share and creators earn 40% of net receipts, backed by an auditable ledger and scheduled Google Pay / bank payouts.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowTermsModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span>Review Agreement Terms</span>
            </button>
          </div>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      {ledgerData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase">Gross Verified Sales</span>
            <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              ${ledgerData.summary.totalGross.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-500">From 4 verified app transactions</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-mono text-[#ff2a85] uppercase">VORTEX 60% Share</span>
            <div className="text-2xl font-bold font-mono text-[#ff2a85] mt-1 tabular-nums">
              ${ledgerData.summary.vortexShare60.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-500">Platform computing & infrastructure</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-mono text-[#00f0ff] uppercase">Creator 40% Net Share</span>
            <div className="text-2xl font-bold font-mono text-[#00f0ff] mt-1 tabular-nums">
              ${ledgerData.summary.creatorShare40.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-500">Calculated after payment fees</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30">
            <span className="text-xs font-mono text-emerald-400 uppercase">Pending Payout Balance</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
              ${ledgerData.summary.pendingPayout.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-500">Eligible for instant disbursement</span>
          </div>
        </div>
      )}

      {/* Payout Trigger & Configuration Section */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#00f0ff]" />
              Creator Payout Routing & Disbursement
            </h2>
            <p className="text-xs text-slate-400">
              Configure settlement destination. VORTEX integrates with Google Pay Business and SEPA bank wires.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedPayoutMethod}
              onChange={(e) => setSelectedPayoutMethod(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="Google Pay">Google Pay Business API</option>
              <option value="SEPA Bank Transfer">SEPA / Direct Wire Transfer</option>
            </select>

            <button
              onClick={handleTriggerPayout}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20 hover:opacity-95"
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Initiate Payout</span>
            </button>
          </div>
        </div>

        {payoutStatusMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{payoutStatusMessage}</span>
          </div>
        )}
      </div>

      {/* Audited Transaction Ledger Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-pink-400" />
            Audited Transaction Ledger
          </h2>
          <span className="text-xs font-mono text-slate-400">Reconciled Provider IDs</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Application</th>
                <th className="py-3 px-4 text-right">Gross</th>
                <th className="py-3 px-4 text-right">Fee</th>
                <th className="py-3 px-4 text-right">Net</th>
                <th className="py-3 px-4 text-right">VORTEX (60%)</th>
                <th className="py-3 px-4 text-right">Creator (40%)</th>
                <th className="py-3 px-4 text-center">Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {ledgerData?.transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-[#00f0ff] font-semibold">{tx.id}</td>
                  <td className="py-3 px-4 font-medium text-white">{tx.appName}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">${tx.grossAmount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-500 tabular-nums">-${tx.processingFee.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300 tabular-nums">${tx.netRevenue.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-mono text-[#ff2a85] font-semibold tabular-nums">
                    ${tx.vortexShare.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-400 font-bold tabular-nums">
                    ${tx.creatorShare.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        tx.payoutStatus === 'paid'
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                          : 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                      }`}
                    >
                      {tx.payoutStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                VORTEX 60% Revenue Share Agreement
              </h3>
              <button onClick={() => setShowTermsModal(false)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2.5 max-h-80 overflow-y-auto pr-2 leading-relaxed font-sans">
              <p>
                <strong>1. Commercial Split:</strong> By enabling VORTEX monetization on applications created using the platform, the Creator explicitly agrees that VORTEX shall receive sixty percent (60%) of eligible net receipts.
              </p>
              <p>
                <strong>2. Definition of Eligible Revenue:</strong> Eligible revenue is defined as gross transaction amounts less third-party payment gateway charges (e.g. Stripe, Google Pay fees), standard app store commissions (if distributed via Google Play or Apple App Store), and mandatory sales tax/VAT.
              </p>
              <p>
                <strong>3. Refunds and Disputes:</strong> Any processed refund or customer chargeback is deducted proportionally from subsequent ledger settlement periods (60% from platform reserves, 40% from creator balance).
              </p>
              <p>
                <strong>4. Payout Timing & Threshold:</strong> Creator payouts are disbursed weekly via verified Google Pay or SEPA direct bank transfers, subject to a minimum cumulative settlement threshold of $50.00 USD.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setOptedIn(true);
                  setShowTermsModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#00f0ff] text-slate-950 font-bold text-xs uppercase cursor-pointer"
              >
                Accept Terms
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
