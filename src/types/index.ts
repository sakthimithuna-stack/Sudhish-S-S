export type ProviderType = 'gemini' | 'openai';

export type TaskCapability = 
  | 'text'
  | 'code'
  | 'reasoning'
  | 'streaming'
  | 'multimodal'
  | 'image'
  | 'tts'
  | 'audio_transcribe'
  | 'fast_lookup';

export type TaskComplexity = 'trivial' | 'moderate' | 'complex' | 'expert';

export interface ModelMetadata {
  id: string;
  name: string;
  provider: ProviderType;
  description: string;
  capabilities: TaskCapability[];
  maxTokens: number;
  inputCostPer1M: number; // in USD
  outputCostPer1M: number;
  measuredLatencyMs: number;
  medianLatencyMs: number;
  p95LatencyMs: number;
  sampleCount: number;
  available: boolean;
  requiresPaidKey?: boolean;
  errorRate: number; // 0 to 1
}

export interface RoutingDecision {
  selectedModel: string;
  provider: ProviderType;
  fallbackModel: string;
  fallbackProvider: ProviderType;
  reason: string;
  taskComplexity: TaskComplexity;
  estimatedCostUsd: number;
  estimatedTtftMs: number;
}

export interface StreamChunkMeta {
  model: string;
  provider: ProviderType;
  ttftMs: number;
  totalTokens?: number;
  isFallback?: boolean;
}

export interface ParallelTaskRequest {
  id: string;
  taskType: string;
  prompt: string;
  systemInstruction?: string;
  preferredModel?: string;
}

export interface ParallelTaskResult {
  id: string;
  taskType: string;
  model: string;
  provider: ProviderType;
  latencyMs: number;
  status: 'completed' | 'failed' | 'cached';
  output: string;
  error?: string;
}

export interface BackgroundJob {
  id: string;
  type: string;
  title: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  result?: any;
  error?: string;
  createdAt: number;
  completedAt?: number;
}

export interface AutomatedTestResult {
  id: string;
  name: string;
  category: 'routing' | 'streaming' | 'fallback' | 'cancellation' | 'concurrency' | 'caching';
  status: 'passed' | 'failed' | 'running' | 'pending';
  latencyMs: number;
  details: string;
  verifiedData?: any;
}

// App Builder Types
export interface AppProjectFile {
  path: string;
  content: string;
  language: 'typescript' | 'javascript' | 'html' | 'css' | 'json' | 'markdown' | 'sql';
}

export interface AppSpecification {
  name: string;
  tagline: string;
  type: 'saas' | 'website' | 'dashboard' | 'ecommerce' | 'education' | 'tool' | 'mobile_pwa';
  techStack: {
    frontend: string;
    styling: string;
    state: string;
    backend: string;
    database: string;
  };
  features: string[];
  databaseSchema: {
    tables: Array<{
      name: string;
      columns: Array<{ name: string; type: string; isPrimary?: boolean; nullable?: boolean }>;
    }>;
  };
  architectureOverview: string;
  filesSummary: Array<{ path: string; purpose: string }>;
}

export interface AppProject {
  id: string;
  name: string;
  description: string;
  type: string;
  spec: AppSpecification;
  files: AppProjectFile[];
  checkpoints: Array<{ id: string; timestamp: number; message: string; files: AppProjectFile[] }>;
  activeFile: string;
  createdAt: number;
  updatedAt: number;
}

// Multimedia Types
export interface ImageGenJob {
  id: string;
  prompt: string;
  aspectRatio: '1:1' | '16:9' | '4:3' | '9:16';
  style: string;
  imageUrl?: string;
  status: 'generating' | 'completed' | 'failed';
  latencyMs?: number;
  error?: string;
  createdAt: number;
}

export interface VideoScene {
  sceneNumber: number;
  durationSec: number;
  shotDescription: string;
  cameraMovement: string;
  dialogueOrVoiceover: string;
  musicMood: string;
}

export interface VideoProject {
  id: string;
  title: string;
  topic: string;
  targetDurationSec: number;
  scenes: VideoScene[];
  script: string;
  status: 'draft' | 'rendered';
}

export interface AudioGeneration {
  id: string;
  text: string;
  voice: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  styleDescription: string;
  audioBase64?: string;
  durationEstimateSec?: number;
  latencyMs?: number;
  status: 'generating' | 'completed' | 'failed';
  error?: string;
}

// Monetization & Payouts Types
export interface TransactionRecord {
  id: string;
  appId: string;
  appName: string;
  timestamp: number;
  customerRef: string;
  grossAmount: number;
  processingFee: number;
  netRevenue: number;
  vortexShare: number; // 60%
  creatorShare: number; // 40%
  status: 'settled' | 'refunded' | 'pending';
  payoutStatus: 'unpaid' | 'queued' | 'paid';
}

export interface PayoutStatement {
  id: string;
  periodStart: number;
  periodEnd: number;
  creatorShareTotal: number;
  transactionCount: number;
  status: 'processing' | 'settled' | 'scheduled';
  payoutMethod: 'Google Pay' | 'SEPA Bank Transfer' | 'Stripe Connect';
  transferReference: string;
  settledAt?: number;
}

export interface RevShareTerms {
  optedIn: boolean;
  vortexPercentage: number; // 60
  creatorPercentage: number; // 40
  applicableOn: 'Net receipts after payment gateway and platform deductions';
  payoutSchedule: 'Weekly on Mondays, min threshold $50.00';
  refundPolicy: 'Refunds deducted proportionally from subsequent ledger settlement';
  acceptedAt?: number;
}
