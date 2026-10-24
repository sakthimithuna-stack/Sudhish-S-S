import React, { useState, useEffect } from 'react';
import {
  Zap,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
  ArrowRight,
  Database,
  Shield,
  Activity,
  Cpu,
} from 'lucide-react';
import { runAutomatedTests, fetchModelRegistry, runParallelTasks } from '../../services/api.ts';
import type { AutomatedTestResult, ModelMetadata, ParallelTaskResult } from '../../types/index.ts';

export const HyperSpeedView: React.FC = () => {
  const [tests, setTests] = useState<AutomatedTestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testSummary, setTestSummary] = useState<{ total: number; passed: number } | null>(null);
  const [models, setModels] = useState<ModelMetadata[]>([]);
  const [parallelResults, setParallelResults] = useState<ParallelTaskResult[]>([]);
  const [isExecutingParallel, setIsExecutingParallel] = useState(false);
  const [parallelExecutionTime, setParallelExecutionTime] = useState<number | null>(null);

  useEffect(() => {
    fetchModelRegistry().then(setModels);
  }, []);

  const handleRunTests = async () => {
    setIsRunningTests(true);
    try {
      const res = await runAutomatedTests();
      setTests(res.results);
      setTestSummary({ total: res.totalTests, passed: res.passedCount });
      // Refresh models to show updated latency
      fetchModelRegistry().then(setModels);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleRunParallelBenchmark = async () => {
    setIsExecutingParallel(true);
    try {
      const res = await runParallelTasks(
        [
          { id: 'task-1', taskType: 'code', prompt: 'Generate an Express auth router middleware with JWT verification' },
          { id: 'task-2', taskType: 'fast_lookup', prompt: 'List 5 key security rules for PostgreSQL relational schemas' },
          { id: 'task-3', taskType: 'code', prompt: 'Write a responsive Tailwind CSS navigation bar with brand logo' },
        ],
        3
      );
      setParallelResults(res.results);
      setParallelExecutionTime(res.totalExecutionTimeMs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExecutingParallel(false);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Hero Header with Neon Hot Pink & Cyber Blue */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff2a85]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-mono">
              <Zap className="w-3.5 h-3.5 animate-pulse text-[#00f0ff]" />
              <span>MODULE 25 · ULTRA-LOW-LATENCY ARCHITECTURE</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Hyper-Speed Engine & Multi-Provider Registry
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Engineered for sub-150ms local UI feedback, multi-provider model routing, parallel task execution, and automatic resilient fallback between Gemini and OpenAI.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRunTests}
              disabled={isRunningTests}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#00f0ff] text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity shadow-[0_0_25px_rgba(255,42,133,0.35)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isRunningTests ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-slate-950" />}
              <span>{isRunningTests ? 'Executing Test Suite...' : 'Run Automated Tests'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Latency Budgets & Target Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-[#00f0ff]/40 transition-colors">
          <div className="text-xs font-mono text-slate-400 mb-1">LOCAL UI INTERACTION</div>
          <div className="text-2xl font-bold font-mono text-[#00f0ff] tabular-nums">&lt; 15 ms</div>
          <div className="text-xs text-slate-500 mt-1">Instant optimistic updates</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-[#ff2a85]/40 transition-colors">
          <div className="text-xs font-mono text-slate-400 mb-1">IN-MEMORY CACHE LOOKUP</div>
          <div className="text-2xl font-bold font-mono text-[#ff2a85] tabular-nums">&lt; 8 ms</div>
          <div className="text-xs text-slate-500 mt-1">TTL-managed deduplication</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-[#00f0ff]/40 transition-colors">
          <div className="text-xs font-mono text-slate-400 mb-1">INTELLIGENT TASK ROUTING</div>
          <div className="text-2xl font-bold font-mono text-[#00f0ff] tabular-nums">12 ms</div>
          <div className="text-xs text-slate-500 mt-1">Complexity & capability matching</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-colors">
          <div className="text-xs font-mono text-slate-400 mb-1">FIRST TOKEN TARGET (TTFT)</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">~140 ms</div>
          <div className="text-xs text-slate-500 mt-1">Gemini 3.1 / 3.8 streaming</div>
        </div>
      </div>

      {/* Automated Test Suite Execution Results */}
      {tests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00f0ff]" />
              Automated Architecture Verification Suite
            </h2>
            {testSummary && (
              <span className="text-xs font-mono text-slate-400">
                Score:{' '}
                <span className="text-emerald-400 font-bold tabular-nums">{testSummary.passed}</span> /{' '}
                <span className="text-white font-bold tabular-nums">{testSummary.total} Passed</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {tests.map((test) => (
              <div
                key={test.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {test.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold">
                      {test.status === 'passed' ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-mono">
                          <CheckCircle className="w-3.5 h-3.5" /> PASSED
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1 font-mono">
                          <XCircle className="w-3.5 h-3.5" /> FAILED
                        </span>
                      )}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-white mb-1">{test.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{test.details}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>Execution Duration:</span>
                  <span className="text-[#00f0ff] font-semibold tabular-nums">{test.latencyMs} ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Centralized Model Registry Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#ff2a85]" />
            Multi-Provider Centralized Model Registry
          </h2>
          <span className="text-xs text-slate-400 font-mono">Live In-Flight Telemetry</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
              <tr>
                <th className="py-3 px-4">Model & Provider</th>
                <th className="py-3 px-4">Capabilities</th>
                <th className="py-3 px-4 text-right">Median Latency</th>
                <th className="py-3 px-4 text-right">P95 Latency</th>
                <th className="py-3 px-4 text-right">Cost (In / Out 1M)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {models.map((m) => (
                <tr key={m.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>{m.name}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                          m.provider === 'gemini'
                            ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30'
                            : 'bg-[#ff2a85]/10 text-[#ff2a85] border border-[#ff2a85]/30'
                        }`}
                      >
                        {m.provider}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">{m.description}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {m.capabilities.map((c) => (
                        <span key={c} className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-[#00f0ff] tabular-nums">
                    {m.medianLatencyMs} ms
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400 tabular-nums">
                    {m.p95LatencyMs} ms
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400 tabular-nums">
                    ${m.inputCostPer1M} / ${m.outputCostPer1M}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono ${
                        m.available
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                          : 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                      }`}
                    >
                      {m.available ? 'AVAILABLE' : 'STANDBY'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parallel Execution Engine Bench */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00f0ff]" />
              Parallel Multi-Task Execution Bench
            </h2>
            <p className="text-xs text-slate-400">
              Dispatches 3 independent subtasks simultaneously (Auth router, Security rules, UI layout) using bounded concurrency.
            </p>
          </div>
          <button
            onClick={handleRunParallelBenchmark}
            disabled={isExecutingParallel}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs border border-slate-700 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isExecutingParallel ? <RotateCcw className="w-3.5 h-3.5 animate-spin text-[#00f0ff]" /> : <Play className="w-3.5 h-3.5" />}
            <span>Run Parallel Batch</span>
          </button>
        </div>

        {parallelExecutionTime !== null && (
          <div className="p-3 rounded-lg bg-slate-950 border border-[#00f0ff]/30 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Total Concurrent Batch Execution Time:</span>
            <span className="text-[#00f0ff] font-bold tabular-nums">{parallelExecutionTime} ms (vs ~1,800ms sequential)</span>
          </div>
        )}

        {parallelResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {parallelResults.map((r) => (
              <div key={r.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-[#ff2a85] font-semibold">{r.taskType.toUpperCase()}</span>
                  <span className="text-slate-400 tabular-nums">{r.latencyMs} ms</span>
                </div>
                <div className="text-slate-300 font-mono text-[11px] line-clamp-3 bg-slate-900/60 p-2 rounded">
                  {r.output}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
