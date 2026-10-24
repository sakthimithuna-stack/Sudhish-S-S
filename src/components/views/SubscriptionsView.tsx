import React, { useState } from 'react';
import { CreditCard, Check, Zap, Sparkles, Shield, Rocket } from 'lucide-react';

export const SubscriptionsView: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const tiers = [
    {
      name: 'Free Starter',
      price: '$0',
      period: '/mo',
      desc: 'Ideal for independent developers prototyping projects with standard AI routing.',
      features: [
        'Gemini 3.1 Flash Lite access',
        'Standard App Builder (3 projects)',
        'Live Code Workspace & Preview',
        'Downloadable ZIP Export',
        'Community Forum Support',
      ],
      cta: 'Current Plan',
      isCurrent: true,
      popular: false,
    },
    {
      name: 'Pro Creator',
      price: billingCycle === 'monthly' ? '$39' : '$31',
      period: '/mo',
      desc: 'For high-velocity builders deploying production apps and mobile PWAs.',
      features: [
        'Gemini 3.8 Flash + OpenAI Routing',
        'Unlimited App Builder Generations',
        '1-Click Universal Deploy (Vercel, Netlify, Cloud Run)',
        'Real Gemini TTS & Image Synthesis',
        'Sub-150ms Hyper-Speed Engine Access',
        'Audited Payouts & 60% RevShare Enrollment',
      ],
      cta: 'Upgrade to Pro',
      isCurrent: false,
      popular: true,
    },
    {
      name: 'Premium Studio',
      price: billingCycle === 'monthly' ? '$99' : '$79',
      period: '/mo',
      desc: 'Full studio capabilities with Gemini 4 Argon reasoning and store compilation.',
      features: [
        'Gemini 4 Argon Deep Reasoning',
        'Android AAB & iOS Xcode Archive Export',
        'Autonomous Multi-Agent DAG Workflows',
        'Grounded Research & Authoritative Citations',
        'Priority Server-Side Processing',
        'Dedicated Enterprise Support',
      ],
      cta: 'Upgrade to Premium',
      isCurrent: false,
      popular: false,
    },
    {
      name: 'Administrator',
      price: billingCycle === 'monthly' ? '$299' : '$239',
      period: '/mo',
      desc: 'Internal platform management, team RBAC, and centralized billing controls.',
      features: [
        'Team Member Seat Management',
        'Custom Rate Limits & Spending Quotas',
        'Audit Logging & API Secret Key Vault',
        'Custom Provider Adapters & Webhooks',
        'SLA 99.9% Uptime Guarantee',
      ],
      cta: 'Contact Sales',
      isCurrent: false,
      popular: false,
    },
  ];

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-[#ff2a85]/40 text-[#ff2a85] text-xs font-mono">
          <CreditCard className="w-3.5 h-3.5" />
          <span>MODULE 17 · VORTEX SUBSCRIPTIONS</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Configurable Subscription Tiers</h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Scale your software creation velocity with predictable pricing and high-octane computing resources.
        </p>

        {/* Billing cycle toggle */}
        <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono mt-2">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              billingCycle === 'monthly' ? 'bg-[#ff2a85] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              billingCycle === 'annual' ? 'bg-[#ff2a85] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Annual (Save 20%)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-2xl p-6 flex flex-col justify-between transition-all ${
              tier.popular
                ? 'bg-slate-900/90 border-2 border-[#ff2a85] shadow-[0_0_30px_rgba(255,42,133,0.25)] relative'
                : 'bg-slate-950 border border-slate-800'
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#ff2a85] text-slate-950 font-extrabold text-[10px] uppercase font-mono tracking-wider">
                MOST POPULAR
              </span>
            )}

            <div>
              <h3 className="text-base font-bold text-white mb-1">{tier.name}</h3>
              <p className="text-xs text-slate-400 mb-4 min-h-[32px]">{tier.desc}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-white font-mono">{tier.price}</span>
                <span className="text-xs text-slate-500 font-mono">{tier.period}</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4 mb-6">
                {tier.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f0ff] shrink-0 mt-0.5" />
                    <span className="leading-snug">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => alert(`Selected ${tier.name}. Entitlement active in VORTEX session.`)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                tier.isCurrent
                  ? 'bg-slate-800 text-slate-400 cursor-default'
                  : tier.popular
                  ? 'bg-gradient-to-r from-[#ff2a85] to-[#00f0ff] text-slate-950 shadow-[0_0_20px_rgba(255,42,133,0.35)] hover:opacity-95'
                  : 'bg-slate-900 border border-slate-700 text-white hover:bg-slate-800'
              }`}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
