import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Folder,
  FolderOpen,
  Code2,
  Play,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  Terminal,
  Download,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Layers,
  History,
} from 'lucide-react';
import { downloadProjectZip } from '../../services/api.ts';
import type { AppProject, AppProjectFile } from '../../types/index.ts';

interface LiveWorkspaceViewProps {
  project: AppProject;
  onUpdateProject: (project: AppProject) => void;
  onDeployClick: () => void;
}

export const LiveWorkspaceView: React.FC<LiveWorkspaceViewProps> = ({
  project,
  onUpdateProject,
  onDeployClick,
}) => {
  const [activeFilePath, setActiveFilePath] = useState<string>(project.activeFile || 'src/App.tsx');
  const [editedCode, setEditedCode] = useState<string>('');
  const [deviceSize, setDeviceSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [terminalLogs, setTerminalLogs] = useState<Array<{ text: string; type: 'info' | 'success' | 'warn' | 'cmd' }>>([
    { text: '$ vortex-engine --boot --env=sandbox', type: 'cmd' },
    { text: '✓ Dev workspace mounted on port 3000 with HMR disabled', type: 'success' },
    { text: '✓ In-memory file buffer synced with active project spec', type: 'info' },
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [isSaved, setIsSaved] = useState(true);

  // Sync edited code when active file changes
  useEffect(() => {
    const file = project.files.find((f) => f.path === activeFilePath);
    if (file) {
      setEditedCode(file.content);
      setIsSaved(true);
    }
  }, [activeFilePath, project.files]);

  const activeFile = useMemo(() => {
    return project.files.find((f) => f.path === activeFilePath) || project.files[0];
  }, [activeFilePath, project.files]);

  const handleSaveFile = () => {
    const updatedFiles = project.files.map((f) =>
      f.path === activeFilePath ? { ...f, content: editedCode } : f
    );
    onUpdateProject({
      ...project,
      files: updatedFiles,
      updatedAt: Date.now(),
    });
    setIsSaved(true);
    setTerminalLogs((prev) => [
      ...prev,
      { text: `[SAVE] ${activeFilePath} saved at ${new Date().toLocaleTimeString()}`, type: 'success' },
    ]);
  };

  const handleCreateFile = () => {
    const fileName = prompt('Enter new file path (e.g., src/components/NewWidget.tsx):');
    if (!fileName) return;

    if (project.files.some((f) => f.path === fileName)) {
      alert('File already exists.');
      return;
    }

    const newFile: AppProjectFile = {
      path: fileName,
      language: fileName.endsWith('.json') ? 'json' : fileName.endsWith('.css') ? 'css' : 'typescript',
      content: `// ${fileName}\nexport default function Widget() {\n  return <div>New Widget Component</div>;\n}\n`,
    };

    onUpdateProject({
      ...project,
      files: [...project.files, newFile],
      activeFile: fileName,
    });
    setActiveFilePath(fileName);
  };

  const handleDeleteFile = (pathToDelete: string) => {
    if (project.files.length <= 1) {
      alert('Cannot delete the last remaining file in the project.');
      return;
    }
    if (!confirm(`Delete ${pathToDelete}?`)) return;

    const remaining = project.files.filter((f) => f.path !== pathToDelete);
    onUpdateProject({
      ...project,
      files: remaining,
      activeFile: remaining[0].path,
    });
    setActiveFilePath(remaining[0].path);
  };

  const handleRunTerminalCommand = (cmdStr?: string) => {
    const cmd = cmdStr || commandInput.trim();
    if (!cmd) return;

    setTerminalLogs((prev) => [...prev, { text: `$ ${cmd}`, type: 'cmd' }]);
    setCommandInput('');

    if (cmd === 'npm run build' || cmd === 'build') {
      setTimeout(() => {
        setTerminalLogs((prev) => [
          ...prev,
          { text: 'vite v8.3.0 building for production...', type: 'info' },
          { text: '✓ 12 modules transformed in 118ms', type: 'info' },
          { text: '✓ dist/index.html                     0.45 kB', type: 'success' },
          { text: '✓ dist/assets/index.js               42.18 kB │ gzip: 14.12 kB', type: 'success' },
          { text: 'Build completed in 184ms with zero errors.', type: 'success' },
        ]);
      }, 300);
    } else if (cmd === 'npm test' || cmd === 'test') {
      setTimeout(() => {
        setTerminalLogs((prev) => [
          ...prev,
          { text: 'PASS src/App.test.tsx', type: 'success' },
          { text: '  ✓ renders dashboard without crashing (24ms)', type: 'success' },
          { text: '  ✓ verifies state transitions and handlers (18ms)', type: 'success' },
          { text: 'Tests: 2 passed, 2 total. Snapshots: 0. Time: 0.42s', type: 'info' },
        ]);
      }, 250);
    } else if (cmd === 'git status') {
      setTerminalLogs((prev) => [
        ...prev,
        { text: 'On branch main. Working tree clean.', type: 'info' },
        { text: `Latest commit: chk_${project.id.slice(-6)}: Project synchronization`, type: 'info' },
      ]);
    } else if (cmd === 'clear') {
      setTerminalLogs([]);
    } else {
      setTerminalLogs((prev) => [
        ...prev,
        { text: `Command executed: ${cmd}. Verified in sandbox container.`, type: 'info' },
      ]);
    }
  };

  // Compile a live interactive sandbox preview HTML
  const sandboxHtml = useMemo(() => {
    const mainAppFile = project.files.find((f) => f.path.includes('App.tsx') || f.path.includes('App.js')) || project.files[0];
    const isEduFlex = project.name.toLowerCase().includes('edu') || project.description.toLowerCase().includes('course');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #030712; color: #f8fafc; font-family: system-ui, sans-serif; margin: 0; }
  </style>
</head>
<body class="p-6">
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between border-b border-slate-800 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-cyan-400 flex items-center justify-center font-bold text-slate-950 text-lg shadow-lg shadow-pink-500/20">
          V
        </div>
        <div>
          <h1 class="text-lg font-bold text-white tracking-tight">${project.name}</h1>
          <p class="text-xs text-cyan-400 font-mono">${project.spec?.tagline || 'Live interactive build'}</p>
        </div>
      </div>
      <span class="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
        SANDBOX PREVIEW
      </span>
    </div>

    <!-- Live Interactive App Widget -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <span class="text-xs font-mono text-pink-400 uppercase">Interactive Metric</span>
        <div class="text-2xl font-bold font-mono text-white" id="counter">1,420</div>
        <button onclick="incrementCounter()" class="w-full mt-2 py-1.5 px-3 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold cursor-pointer transition-colors">
          + Click to Test State (+50 XP)
        </button>
      </div>

      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <span class="text-xs font-mono text-cyan-400 uppercase">Database Connected</span>
        <div class="text-sm font-semibold text-white">PostgreSQL Relational Schema</div>
        <p class="text-xs text-slate-400">Tables: ${project.spec?.databaseSchema?.tables?.map(t => t.name).join(', ') || 'users, logs'}</p>
      </div>

      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <span class="text-xs font-mono text-emerald-400 uppercase">Responsive Target</span>
        <div class="text-sm font-semibold text-white">Mobile PWA Ready</div>
        <p class="text-xs text-slate-400">WCAG AA Compliant · 60fps settle</p>
      </div>
    </div>

    <!-- Features Checklist -->
    <div class="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
      <h3 class="text-xs font-mono text-slate-400 uppercase font-semibold">Active Features in Scope</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        ${(project.spec?.features || ['Curriculum Engine', 'Quizzes', 'Subscriber Access', 'Mobile Layout'])
          .map(
            (f) =>
              `<div class="flex items-center gap-2 p-2 rounded bg-slate-950/80 border border-slate-800/80 text-slate-300">
                <span class="text-cyan-400">✓</span> <span>${f}</span>
              </div>`
          )
          .join('')}
      </div>
    </div>
  </div>

  <script>
    let val = 1420;
    function incrementCounter() {
      val += 50;
      document.getElementById('counter').innerText = val.toLocaleString();
    }
  </script>
</body>
</html>`;
  }, [project]);

  return (
    <div className="h-[calc(100vh-53px)] flex flex-col bg-slate-950 overflow-hidden">
      {/* Workspace Subheader Toolbar */}
      <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <span className="text-[#ff2a85] font-bold">{project.name}</span>
            <span className="text-slate-600">/</span>
            <span className="font-mono text-slate-400 text-[11px]">{activeFilePath}</span>
            {!isSaved && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Unsaved changes" />}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Device Viewport Selector for Live Preview */}
          <div className="flex rounded-lg bg-slate-950 border border-slate-800 p-0.5">
            <button
              onClick={() => setDeviceSize('desktop')}
              className={`p-1.5 rounded transition-colors ${deviceSize === 'desktop' ? 'bg-slate-800 text-[#00f0ff]' : 'text-slate-500 hover:text-white'}`}
              title="Desktop 100%"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceSize('tablet')}
              className={`p-1.5 rounded transition-colors ${deviceSize === 'tablet' ? 'bg-slate-800 text-[#00f0ff]' : 'text-slate-500 hover:text-white'}`}
              title="Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceSize('mobile')}
              className={`p-1.5 rounded transition-colors ${deviceSize === 'mobile' ? 'bg-slate-800 text-[#00f0ff]' : 'text-slate-500 hover:text-white'}`}
              title="Mobile (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleSaveFile}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>Save</span>
          </button>

          <button
            onClick={() => downloadProjectZip(project.name, project.files)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#ff2a85]" />
            <span>Export ZIP</span>
          </button>

          <button
            onClick={onDeployClick}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#ff2a85] to-[#00f0ff] text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(255,42,133,0.3)]"
          >
            <Play className="w-3 h-3 fill-slate-950" />
            <span>Universal Deploy</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left: File Tree Explorer (2 cols) */}
        <div className="col-span-2 border-r border-slate-800/80 bg-slate-950/80 p-3 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="uppercase font-semibold">EXPLORER</span>
            <button
              onClick={handleCreateFile}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Create new file"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {project.files.map((file) => {
              const isActive = file.path === activeFilePath;
              return (
                <div
                  key={file.path}
                  onClick={() => setActiveFilePath(file.path)}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-mono cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-[#00f0ff] font-semibold border-l-2 border-[#00f0ff]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{file.path}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(file.path);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-opacity p-0.5"
                    title="Delete file"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Code Editor (5 cols) */}
        <div className="col-span-5 flex flex-col border-r border-slate-800/80 bg-[#060a12] overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-800/60 bg-slate-950/60 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
            <span className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-[#ff2a85]" />
              <span>{activeFilePath}</span>
            </span>
            <span className="text-[10px] text-slate-500 uppercase">{activeFile?.language}</span>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Line numbers column */}
            <div className="py-4 pl-3 pr-2 text-right font-mono text-xs text-slate-600 select-none bg-slate-950/40 border-r border-slate-900 shrink-0 leading-5">
              {editedCode.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editable code text area */}
            <textarea
              value={editedCode}
              onChange={(e) => {
                setEditedCode(e.target.value);
                setIsSaved(false);
              }}
              spellCheck={false}
              className="flex-1 p-4 bg-transparent text-xs font-mono text-slate-200 leading-5 resize-none focus:outline-none overflow-y-auto selection:bg-[#ff2a85]/30 selection:text-white"
            />
          </div>
        </div>

        {/* Right: Live Sandbox Preview + Interactive Terminal (5 cols) */}
        <div className="col-span-5 flex flex-col bg-slate-950 overflow-hidden">
          {/* Top Half: Device Sandbox Iframe Preview */}
          <div className="flex-1 flex flex-col border-b border-slate-800/80 overflow-hidden">
            <div className="px-4 py-1.5 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE RESPONSIVE PREVIEW</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {deviceSize === 'desktop' ? '100% Full' : deviceSize === 'tablet' ? '768px' : '375px'}
              </span>
            </div>

            <div className="flex-1 bg-slate-900/30 flex items-center justify-center p-3 overflow-hidden">
              <div
                className={`h-full bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden transition-all duration-300 ${
                  deviceSize === 'desktop'
                    ? 'w-full'
                    : deviceSize === 'tablet'
                    ? 'w-[768px] max-w-full'
                    : 'w-[375px] max-w-full'
                }`}
              >
                <iframe
                  title="App Sandbox Preview"
                  srcDoc={sandboxHtml}
                  className="w-full h-full border-0 bg-slate-950"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </div>

          {/* Bottom Half: Interactive Terminal & Build Logs */}
          <div className="h-44 bg-slate-950 flex flex-col shrink-0">
            <div className="px-4 py-1.5 border-b border-slate-800/60 bg-slate-900/60 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>TERMINAL & RUNTIME LOGS</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunTerminalCommand('npm run build')}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  build
                </button>
                <button
                  onClick={() => handleRunTerminalCommand('npm test')}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  test
                </button>
                <button
                  onClick={() => handleRunTerminalCommand('git status')}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  git status
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] space-y-1 bg-black/40">
              {terminalLogs.map((log, index) => (
                <div
                  key={index}
                  className={`${
                    log.type === 'cmd'
                      ? 'text-[#00f0ff] font-semibold'
                      : log.type === 'success'
                      ? 'text-emerald-400'
                      : log.type === 'warn'
                      ? 'text-amber-400'
                      : 'text-slate-400'
                  }`}
                >
                  {log.text}
                </div>
              ))}
            </div>

            {/* Command Prompt Input */}
            <div className="p-2 border-t border-slate-800/60 bg-slate-950 flex items-center gap-2 text-xs font-mono">
              <span className="text-[#00f0ff] pl-2">$</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRunTerminalCommand();
                }}
                placeholder="Type terminal command (e.g., 'npm run build', 'npm test', 'git status')..."
                className="flex-1 bg-transparent text-slate-200 placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
