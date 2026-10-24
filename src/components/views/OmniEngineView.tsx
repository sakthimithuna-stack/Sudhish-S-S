import React, { useState, useRef, useEffect } from 'react';
import {
  Cpu,
  Send,
  Zap,
  Square,
  Sparkles,
  GitCompare,
  ArrowRight,
  ShieldAlert,
  Clock,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { streamChat, getRoutingDecision } from '../../services/api.ts';
import type { RoutingDecision, ProviderType } from '../../types/index.ts';

export const OmniEngineView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [preferredProvider, setPreferredProvider] = useState<'auto' | 'gemini' | 'openai'>('auto');
  const [preferredModel, setPreferredModel] = useState<string>('auto');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [streamMeta, setStreamMeta] = useState<any>(null);
  const [ttftMs, setTtftMs] = useState<number | null>(null);
  const [totalMs, setTotalMs] = useState<number | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<any>(null);
  const [routingInfo, setRoutingInfo] = useState<RoutingDecision | null>(null);

  // Comparison Mode
  const [comparisonMode, setComparisonMode] = useState(false);
  const [compareOutput1, setCompareOutput1] = useState('');
  const [compareOutput2, setCompareOutput2] = useState('');
  const [compareMeta1, setCompareMeta1] = useState<any>(null);
  const [compareMeta2, setCompareMeta2] = useState<any>(null);

  const stopStreamRef = useRef<(() => void) | null>(null);

  const handleSend = async () => {
    if (!prompt.trim() || isStreaming) return;

    setIsStreaming(true);
    setStreamedText('');
    setStreamMeta(null);
    setTtftMs(null);
    setTotalMs(null);
    setFallbackNotice(null);

    // Predict route first for instant UI feedback
    getRoutingDecision(
      prompt,
      undefined,
      preferredProvider === 'auto' ? undefined : (preferredProvider as ProviderType)
    )
      .then(setRoutingInfo)
      .catch(console.warn);

    if (comparisonMode) {
      // Comparison: Gemini 3.8 Flash vs Gemini 4 Argon (or OpenAI)
      let done1 = false;
      let done2 = false;
      setCompareOutput1('');
      setCompareOutput2('');

      const stop1 = streamChat(
        prompt,
        { preferredModel: 'gemini-3.8-flash', preferredProvider: 'gemini' },
        {
          onToken: (t) => setCompareOutput1((prev) => prev + t),
          onMeta: setCompareMeta1,
          onDone: () => {
            done1 = true;
            if (done2) setIsStreaming(false);
          },
          onError: (err) => {
            setCompareOutput1((prev) => prev + `\n[Error: ${err}]`);
            done1 = true;
            if (done2) setIsStreaming(false);
          },
        }
      );

      const stop2 = streamChat(
        prompt,
        { preferredModel: 'gemini-3.1-flash-lite', preferredProvider: 'gemini' },
        {
          onToken: (t) => setCompareOutput2((prev) => prev + t),
          onMeta: setCompareMeta2,
          onDone: () => {
            done2 = true;
            if (done1) setIsStreaming(false);
          },
          onError: (err) => {
            setCompareOutput2((prev) => prev + `\n[Error: ${err}]`);
            done2 = true;
            if (done1) setIsStreaming(false);
          },
        }
      );

      stopStreamRef.current = () => {
        stop1();
        stop2();
        setIsStreaming(false);
      };
      return;
    }

    const cancel = streamChat(
      prompt,
      {
        preferredModel: preferredModel === 'auto' ? undefined : preferredModel,
        preferredProvider: preferredProvider === 'auto' ? undefined : (preferredProvider as ProviderType),
      },
      {
        onToken: (token) => {
          setStreamedText((prev) => prev + token);
        },
        onMeta: (meta) => {
          setStreamMeta(meta);
        },
        onTtft: (ttft) => {
          setTtftMs(ttft);
        },
        onFallback: (info) => {
          setFallbackNotice(info);
        },
        onDone: (summary) => {
          setIsStreaming(false);
          setTotalMs(summary.totalLatencyMs);
        },
        onError: (err) => {
          setIsStreaming(false);
          setStreamedText((prev) => prev + `\n\n[System Alert: ${err}]`);
        },
      }
    );

    stopStreamRef.current = cancel;
  };

  const handleStop = () => {
    if (stopStreamRef.current) {
      stopStreamRef.current();
      stopStreamRef.current = null;
    }
    setIsStreaming(false);
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Title & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] mb-1">
            <Cpu className="w-4 h-4 text-[#00f0ff]" />
            <span>MODULE 1 · OMNI INTELLIGENCE ENGINE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Unified Multi-Provider Orchestration</h1>
          <p className="text-xs text-slate-400">
            Intelligent task routing, low-latency streaming SSE, and automated fallback matrix.
          </p>
        </div>

        {/* Comparison Mode Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 border transition-all cursor-pointer ${
              comparisonMode
                ? 'bg-[#ff2a85]/20 text-[#ff2a85] border-[#ff2a85]/60 shadow-[0_0_15px_rgba(255,42,133,0.2)]'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Dual-Model Compare: {comparisonMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Control Configuration Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Provider Selection */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">Provider:</span>
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              {(['auto', 'gemini', 'openai'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPreferredProvider(p)}
                  className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors ${
                    preferredProvider === p
                      ? 'bg-[#00f0ff] text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">Model:</span>
            <select
              value={preferredModel}
              onChange={(e) => setPreferredModel(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 font-mono focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="auto">Auto Intelligent Route</option>
              <option value="gemini-3.8-flash">Gemini 3.8 Flash (High Speed / General)</option>
              <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Ultra-Low TTFT)</option>
              <option value="gemini-4-argon">Gemini 4 Argon (Deep Reasoning / Math)</option>
              <option value="gpt-4o">GPT-4o (OpenAI Flagship)</option>
              <option value="gpt-4o-mini">GPT-4o Mini (OpenAI Fast)</option>
            </select>
          </div>
        </div>

        {/* Live Invariants Badge */}
        {routingInfo && (
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span>Task:</span>
            <span className="text-[#00f0ff] font-semibold uppercase">{routingInfo.taskComplexity}</span>
            <span>·</span>
            <span>Target:</span>
            <span className="text-white font-semibold">{routingInfo.selectedModel}</span>
          </div>
        )}
      </div>

      {/* Fallback Warning Notice if triggered */}
      {fallbackNotice && (
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{fallbackNotice.message}</span>
        </div>
      )}

      {/* Main Streaming Output Area */}
      {!comparisonMode ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 min-h-[320px] flex flex-col justify-between relative shadow-xl">
          {streamedText ? (
            <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {streamedText}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2 py-16">
              <Sparkles className="w-6 h-6 text-slate-600 animate-pulse" />
              <span>Enter a prompt below to trigger multi-provider hyper-speed streaming.</span>
            </div>
          )}

          {/* Telemetry Bar at bottom of message box */}
          {(ttftMs !== null || streamMeta) && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#00f0ff]" />
                  <span>TTFT:</span>
                  <span className="text-[#00f0ff] font-bold tabular-nums">{ttftMs ?? 0} ms</span>
                </span>
                {totalMs !== null && (
                  <span>
                    Total: <span className="text-white font-bold tabular-nums">{totalMs} ms</span>
                  </span>
                )}
                {streamMeta?.model && (
                  <span className="text-slate-400">
                    Model: <span className="text-pink-400">{streamMeta.model}</span>
                  </span>
                )}
              </div>
              {isStreaming && (
                <span className="text-[#00f0ff] animate-pulse flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
                  STREAMING TOKENS
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Dual Comparison Mode Display */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-xs font-mono">
                <span className="text-[#00f0ff] font-bold">Gemini 3.8 Flash</span>
                <span className="text-slate-400">Stream 1</span>
              </div>
              <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[220px]">
                {compareOutput1 || (isStreaming ? 'Streaming...' : 'Awaiting prompt...')}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-xs font-mono">
                <span className="text-[#ff2a85] font-bold">Gemini 3.1 Flash Lite</span>
                <span className="text-slate-400">Stream 2</span>
              </div>
              <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[220px]">
                {compareOutput2 || (isStreaming ? 'Streaming...' : 'Awaiting prompt...')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Prompt & Send Controls */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask a question, request code generation, or compare models (e.g., 'Write an asynchronous retry loop in TypeScript with jitter')..."
          rows={3}
          className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 pr-32 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/50 transition-all resize-none shadow-inner"
        />

        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          {isStreaming ? (
            <button
              onClick={handleStop}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!prompt.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#00f0ff] hover:opacity-95 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] cursor-pointer disabled:opacity-40"
            >
              <span>Execute</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
