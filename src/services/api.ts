import JSZip from 'jszip';
import type {
  RoutingDecision,
  ModelMetadata,
  ParallelTaskRequest,
  ParallelTaskResult,
  AutomatedTestResult,
  AppSpecification,
  AppProjectFile,
  ImageGenJob,
  AudioGeneration,
} from '../types/index.ts';

// Model Registry Cache
let cachedModels: ModelMetadata[] = [];

export async function fetchModelRegistry(): Promise<ModelMetadata[]> {
  try {
    const res = await fetch('/api/models/registry');
    if (!res.ok) throw new Error('Failed to fetch model registry');
    const data = await res.json();
    cachedModels = data.models;
    return cachedModels;
  } catch (err) {
    console.warn('Error fetching model registry:', err);
    return [];
  }
}

export async function fetchHealthStatus() {
  const res = await fetch('/api/health');
  return res.json();
}

export async function getRoutingDecision(
  prompt: string,
  capability?: string,
  preferredProvider?: 'gemini' | 'openai'
): Promise<RoutingDecision> {
  const res = await fetch('/api/orchestration/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, capability, preferredProvider }),
  });
  if (!res.ok) throw new Error('Routing failure');
  return res.json();
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onMeta?: (meta: any) => void;
  onTtft?: (ttftMs: number) => void;
  onFallback?: (fallbackInfo: any) => void;
  onDone?: (summary: any) => void;
  onError?: (err: string) => void;
}

export function streamChat(
  prompt: string,
  options: {
    systemInstruction?: string;
    preferredModel?: string;
    preferredProvider?: 'gemini' | 'openai';
    cacheBypass?: boolean;
    signal?: AbortSignal;
  },
  callbacks: StreamCallbacks
): () => void {
  const controller = new AbortController();
  const externalSignal = options.signal;
  const abortFromExternalSignal = () => controller.abort(externalSignal?.reason);

  if (externalSignal?.aborted) {
    abortFromExternalSignal();
  } else {
    externalSignal?.addEventListener('abort', abortFromExternalSignal, { once: true });
  }

  (async () => {
    try {
      const response = await fetch('/api/orchestration/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction: options.systemInstruction,
          preferredModel: options.preferredModel,
          preferredProvider: options.preferredProvider,
          cacheBypass: options.cacheBypass,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to establish stream`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream available');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let currentEvent = 'message';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith('event: ')) {
            currentEvent = trimmed.slice(7).trim();
          } else if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            try {
              const parsed = JSON.parse(dataStr);
              if (currentEvent === 'token') {
                callbacks.onToken(parsed.delta);
              } else if (currentEvent === 'meta') {
                callbacks.onMeta?.(parsed);
              } else if (currentEvent === 'ttft') {
                callbacks.onTtft?.(parsed.ttftMs);
              } else if (currentEvent === 'fallback') {
                callbacks.onFallback?.(parsed);
              } else if (currentEvent === 'done') {
                callbacks.onDone?.(parsed);
              } else if (currentEvent === 'error') {
                callbacks.onError?.(parsed.message);
              }
            } catch (e) {
              // Ignore non-json lines
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        callbacks.onMeta?.({ status: 'aborted_by_user' });
      } else {
        callbacks.onError?.(err?.message || 'Streaming failed');
      }
    } finally {
      externalSignal?.removeEventListener('abort', abortFromExternalSignal);
    }
  })();

  // Return cancel function; aborts the same signal used by fetch.
  return () => {
    controller.abort();
  };
}

export async function runParallelTasks(
  tasks: ParallelTaskRequest[],
  concurrencyLimit = 4
): Promise<{ totalExecutionTimeMs: number; results: ParallelTaskResult[] }> {
  const res = await fetch('/api/orchestration/parallel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tasks, concurrencyLimit }),
  });
  if (!res.ok) throw new Error('Parallel task execution failed');
  return res.json();
}

export async function runAutomatedTests(): Promise<{
  totalTests: number;
  passedCount: number;
  results: AutomatedTestResult[];
}> {
  const res = await fetch('/api/tests/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Automated tests failed to run');
  return res.json();
}

export async function generateAppSpec(prompt: string, appType = 'saas'): Promise<AppSpecification> {
  const res = await fetch('/api/builder/spec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, appType }),
  });
  if (!res.ok) throw new Error('Failed to generate project specification');
  return res.json();
}

export async function generateAppFiles(
  spec: AppSpecification,
  prompt?: string
): Promise<{ files: AppProjectFile[] }> {
  const res = await fetch('/api/builder/generate-files', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ spec, prompt }),
  });
  if (!res.ok) throw new Error('Failed to generate app files');
  return res.json();
}

export async function repairCode(
  filePath: string,
  fileContent: string,
  errorMessage: string
): Promise<{ explanation: string; repairedContent: string; confidenceScore: number }> {
  const res = await fetch('/api/builder/repair', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filePath, fileContent, errorMessage }),
  });
  if (!res.ok) throw new Error('Code repair failed');
  return res.json();
}

export async function generateImage(prompt: string, aspectRatio = '1:1') {
  const res = await fetch('/api/multimedia/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, aspectRatio }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate image');
  }
  return res.json();
}

export async function generateTTS(text: string, voice = 'Kore', style?: string) {
  const res = await fetch('/api/multimedia/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice, style }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to synthesize speech');
  }
  return res.json();
}

export async function runGroundedResearch(query: string) {
  const res = await fetch('/api/research/grounded', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error('Research failed');
  return res.json();
}

export async function fetchMonetizationLedger() {
  const res = await fetch('/api/monetization/ledger');
  if (!res.ok) throw new Error('Failed to fetch monetization ledger');
  return res.json();
}

// Download Project as ZIP archive
export async function downloadProjectZip(projectName: string, files: AppProjectFile[]) {
  const zip = new JSZip();

  files.forEach((f) => {
    zip.file(f.path, f.content);
  });

  // Include README
  zip.file(
    'README.md',
    `# ${projectName}\n\nGenerated with VORTEX OMNI: Hyper-Speed Creation Platform.\n\n## Quick Start\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n`
  );

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-vortex-project.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
