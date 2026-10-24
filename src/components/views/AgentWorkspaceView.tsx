import React, { useState } from 'react';
import {
  Bot,
  Play,
  Pause,
  Square,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  UserCheck,
} from 'lucide-react';

export const AgentWorkspaceView: React.FC = () => {
  const [pipelineStatus, setPipelineStatus] = useState<'idle' | 'running' | 'paused' | 'waiting_approval' | 'completed'>('idle');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const agents = [
    {
      id: 'agent_architect',
      name: 'Architect Agent',
      model: 'gemini-4-argon',
      role: 'System Requirements, Tech Stack & Database Schema Design',
      status: 'ready',
    },
    {
      id: 'agent_developer',
      name: 'Full-Stack Developer Agent',
      model: 'gemini-3.8-flash',
      role: 'AST Code Synthesis, Event Handlers & API Routing',
      status: 'ready',
    },
    {
      id: 'agent_tester',
      name: 'QA & Security Inspector',
      model: 'gemini-3.8-flash',
      role: 'Unit Tests, Invariant Verification & Vulnerability Scanning',
      status: 'ready',
    },
    {
      id: 'agent_publisher',
      name: 'DevOps & Publishing Agent',
      model: 'gemini-3.1-flash-lite',
      role: 'Container Packaging & Multi-Platform Deployment Dispatch',
      status: 'ready',
    },
  ];

  const handleStartWorkflow = () => {
    setPipelineStatus('running');
    setCurrentStepIndex(1);

    setTimeout(() => {
      setCurrentStepIndex(2);
      setTimeout(() => {
        setCurrentStepIndex(3);
        setPipelineStatus('waiting_approval');
      }, 1500);
    }, 1500);
  };

  const handleApprove = () => {
    setPipelineStatus('running');
    setCurrentStepIndex(4);
    setTimeout(() => {
      setPipelineStatus('completed');
    }, 1500);
  };

  const handleStop = () => {
    setPipelineStatus('idle');
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-mono">
              <Bot className="w-3.5 h-3.5" />
              <span>MODULE 11 · MULTI-AGENT DAG WORKSPACE</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Autonomous Task-Oriented Agents</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Orchestrate coordinated agents across design, development, QA verification, and publication with strict human-in-the-loop approval gates.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {pipelineStatus === 'idle' || pipelineStatus === 'completed' ? (
              <button
                onClick={handleStartWorkflow}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#00f0ff] text-slate-950 font-bold text-xs uppercase flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.3)]"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Launch Workflow</span>
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs flex items-center gap-2 cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>Stop Workflow</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Human Approval Required Gate */}
      {pipelineStatus === 'waiting_approval' && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
          <div className="flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-white">Human Approval Required Before Release</h3>
              <p className="text-xs text-amber-300">
                QA Inspector finished 100% test passes. Confirm deployment dispatch to live networks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApprove}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase cursor-pointer"
            >
              Authorize Release
            </button>
            <button
              onClick={handleStop}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {/* DAG Workflow Pipeline Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {agents.map((agent, i) => {
          const stepNum = i + 1;
          const isDone = currentStepIndex > stepNum;
          const isCurrent = currentStepIndex === stepNum;

          return (
            <div
              key={agent.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'bg-slate-900 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                  : isDone
                  ? 'bg-slate-950 border-emerald-500/50'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono mb-2">
                  <span className="text-slate-500">STAGE 0{stepNum}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded uppercase ${
                      isDone
                        ? 'bg-emerald-950 text-emerald-400'
                        : isCurrent
                        ? 'bg-[#00f0ff]/20 text-[#00f0ff] animate-pulse'
                        : 'bg-slate-900 text-slate-500'
                    }`}
                  >
                    {isDone ? 'Completed' : isCurrent ? 'Active' : 'Standby'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{agent.name}</h3>
                <div className="text-[10px] font-mono text-[#ff2a85] mb-2">{agent.model}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{agent.role}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500">Task Invariant:</span>
                <span className="text-white">{isDone ? '✓ Verified' : isCurrent ? 'Executing' : 'Queued'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
