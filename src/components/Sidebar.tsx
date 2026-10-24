import React from 'react';
import {
  Zap,
  Cpu,
  Sparkles,
  Code2,
  Smartphone,
  Globe,
  Palette,
  Bot,
  Search,
  Workflow,
  DollarSign,
  CreditCard,
  Megaphone,
  ShieldCheck,
  Activity,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const navSections = [
    {
      group: 'ENGINE & ARCHITECTURE',
      items: [
        { id: 'hyperspeed', label: 'Hyper-Speed Dashboard', icon: Zap, badge: 'Sub-150ms' },
        { id: 'omni', label: 'Omni Intelligence Engine', icon: Cpu, badge: 'Multi-Model' },
      ],
    },
    {
      group: 'CREATION & CODE',
      items: [
        { id: 'builder', label: 'Next-Gen App Builder', icon: Sparkles, badge: 'Flagship' },
        { id: 'workspace', label: 'Live Dev Workspace', icon: Code2, badge: 'IDE' },
        { id: 'mobile', label: 'Web & Mobile Studio', icon: Smartphone, badge: 'PWA/APK' },
        { id: 'publishing', label: '1-Click Publishing', icon: Globe, badge: 'Universal' },
      ],
    },
    {
      group: 'MULTIMEDIA & AGENTS',
      items: [
        { id: 'multimedia', label: 'Multimedia Studios', icon: Palette, badge: 'Image/TTS/3D' },
        { id: 'agents', label: 'AI Agent Workspace', icon: Bot, badge: 'Multi-Agent' },
        { id: 'research', label: 'Research & Knowledge', icon: Search, badge: 'Grounded' },
        { id: 'automation', label: 'Automation & Services', icon: Workflow, badge: 'Cron/Hooks' },
      ],
    },
    {
      group: 'BUSINESS & PLATFORM',
      items: [
        { id: 'monetization', label: '60% RevShare & Payouts', icon: DollarSign, badge: '60/40' },
        { id: 'subscriptions', label: 'VORTEX Subscriptions', icon: CreditCard, badge: 'Tiers' },
        { id: 'ads', label: 'Google Ads & AdMob', icon: Megaphone },
        { id: 'security', label: 'Usage, Cost & Security', icon: ShieldCheck, badge: 'RBAC' },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-950/70 border-r border-slate-800/80 flex flex-col shrink-0 h-[calc(100vh-53px)] overflow-y-auto">
      {/* Quick Status Header */}
      <div className="p-4 border-b border-slate-800/60 bg-slate-900/30">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 font-medium">Provider Status</span>
          <span className="text-[10px] font-mono text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-1.5 py-0.5 rounded">
            Gemini + OpenAI
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
          <span className="text-xs text-slate-300 font-mono">Hyper-Speed Active</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.group}>
            <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase px-3 mb-2 font-semibold">
              {section.group}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#ff2a85]/20 to-[#00f0ff]/10 text-white border border-[#ff2a85]/50 shadow-[0_0_15px_rgba(255,42,133,0.15)] font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-[#ff2a85]' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40'
                            : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Pinned Bottom Telemetry Summary */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>Median TTFT</span>
        </span>
        <span className="text-[#00f0ff] font-semibold tabular-nums">140ms</span>
      </div>
    </aside>
  );
};
