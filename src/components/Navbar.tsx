import React from 'react';
import { Zap, Rocket, Terminal, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onDeployClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, onDeployClick }) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Zone 1: Brand wordmark (single line, single element with brand mark) */}
      <div 
        onClick={() => onSelectTab('hyperspeed')}
        className="flex items-center gap-3 cursor-pointer group shrink-0"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#ff2a85] to-[#00f0ff] p-0.5 shadow-[0_0_15px_rgba(255,42,133,0.4)]">
          <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#00f0ff] group-hover:scale-110 transition-transform" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-extrabold tracking-wider text-white whitespace-nowrap">
            VORTEX<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] to-[#00f0ff] ml-1">OMNI</span>
          </span>
          <span className="text-[10px] font-mono text-[#00f0ff]/80 uppercase tracking-widest hidden sm:inline-block">
            Ascension 2.5
          </span>
        </div>
      </div>

      {/* Zone 2: 4-5 single-line clean navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => onSelectTab('hyperspeed')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'hyperspeed'
              ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] font-semibold'
              : 'hover:text-slate-200'
          }`}
        >
          Hyper-Speed Engine
        </button>
        <button
          onClick={() => onSelectTab('builder')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'builder'
              ? 'text-[#ff2a85] border-b-2 border-[#ff2a85] font-semibold'
              : 'hover:text-slate-200'
          }`}
        >
          Next-Gen App Builder
        </button>
        <button
          onClick={() => onSelectTab('workspace')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'workspace'
              ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] font-semibold'
              : 'hover:text-slate-200'
          }`}
        >
          Live Dev Workspace
        </button>
        <button
          onClick={() => onSelectTab('publishing')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'publishing'
              ? 'text-[#ff2a85] border-b-2 border-[#ff2a85] font-semibold'
              : 'hover:text-slate-200'
          }`}
        >
          1-Click Universal Deploy
        </button>
        <button
          onClick={() => onSelectTab('monetization')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'monetization'
              ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] font-semibold'
              : 'hover:text-slate-200'
          }`}
        >
          60% RevShare & Payouts
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onDeployClick}
          className="relative group px-4 py-2 text-xs font-bold text-slate-950 rounded-lg bg-gradient-to-r from-[#ff2a85] via-pink-400 to-[#00f0ff] shadow-[0_0_20px_rgba(255,42,133,0.35)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2"
        >
          <Rocket className="w-3.5 h-3.5 text-slate-950" />
          <span>Universal 1-Click Deploy</span>
        </button>
      </div>
    </header>
  );
};
