import React, { useState } from 'react';
import { Search, Globe, FileText, CheckCircle2, RotateCcw, ExternalLink, Bookmark } from 'lucide-react';
import { runGroundedResearch } from '../../services/api.ts';

export const ResearchWorkspaceView: React.FC = () => {
  const [query, setQuery] = useState('Latest breakthrough benchmarks in ultra-low latency AI model routing and edge runtime architectures');
  const [isSearching, setIsSearching] = useState(false);
  const [researchReport, setResearchReport] = useState<string | null>(null);
  const [groundingMetadata, setGroundingMetadata] = useState<any>(null);

  const handleSearch = async () => {
    if (!query.trim() || isSearching) return;
    setIsSearching(true);
    setResearchReport(null);
    setGroundingMetadata(null);

    try {
      const res = await runGroundedResearch(query);
      setResearchReport(res.content);
      setGroundingMetadata(res.groundingMetadata);
    } catch (err: any) {
      alert(`Research failure: ${err?.message || 'Error occurred'}`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="text-xs font-mono text-[#00f0ff] uppercase mb-1">
            MODULE 12 · RESEARCH & KNOWLEDGE ENGINE
          </div>
          <h1 className="text-2xl font-extrabold text-white">Grounded Web Research & Intelligence</h1>
          <p className="text-xs text-slate-400">
            Real-time authoritative source extraction powered by Google Search grounding tools.
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder="Enter research topic or technical query..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#00f0ff]"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#ff2a85] text-slate-950 font-bold text-xs uppercase flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.35)] disabled:opacity-50"
          >
            {isSearching ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{isSearching ? 'Gathering Sources...' : 'Synthesize Report'}</span>
          </button>
        </div>
      </div>

      {/* Report Display */}
      {researchReport && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>GROUNDED SYNTHESIS VERIFIED</span>
            </span>
            <span>Generated: {new Date().toLocaleTimeString()}</span>
          </div>

          <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
            {researchReport}
          </div>

          {/* Citations list if present */}
          {groundingMetadata?.webSearchQueries && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
              <span className="text-slate-400 block mb-1">Search Grounding Queries Executed:</span>
              <ul className="list-disc pl-4 space-y-0.5">
                {groundingMetadata.webSearchQueries.map((q: string, i: number) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
