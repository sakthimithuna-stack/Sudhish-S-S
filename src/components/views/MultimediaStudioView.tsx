import React, { useState, useRef, useEffect } from 'react';
import {
  Palette,
  Video,
  Music,
  Box,
  Sparkles,
  Download,
  RotateCcw,
  Play,
  Pause,
  Clock,
  Volume2,
} from 'lucide-react';
import { generateImage, generateTTS } from '../../services/api.ts';

export const MultimediaStudioView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'audio' | '3d'>('image');

  // Image Studio State
  const [imagePrompt, setImagePrompt] = useState('Cyberpunk neon holographic city with hot pink and electric blue glow, reflective rainy asphalt, 8k cinematic lighting');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3' | '9:16'>('1:1');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageLatency, setImageLatency] = useState<number | null>(null);

  // Audio / TTS State
  const [ttsText, setTtsText] = useState('Welcome to VORTEX OMNI, the next-generation AI creation and execution engine.');
  const [ttsVoice, setTtsVoice] = useState<'Kore' | 'Puck' | 'Fenrir' | 'Zephyr'>('Kore');
  const [isGeneratingTts, setIsGeneratingTts] = useState(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);
  const [ttsLatency, setTtsLatency] = useState<number | null>(null);

  // Video Studio State
  const [videoTitle, setVideoTitle] = useState('VORTEX OMNI Ascension Launch');
  const [videoScenes, setVideoScenes] = useState([
    {
      num: 1,
      duration: '0:00 - 0:04',
      shot: 'Ultra-wide cinematic orbit of a glowing neon datacenter in obsidian dark slate.',
      camera: 'Slow counter-clockwise dolly push-in',
      voiceover: 'In an era of generic chatbots, creation demands raw velocity.',
    },
    {
      num: 2,
      duration: '0:04 - 0:08',
      shot: 'Macro perspective on a glowing glass microprocessor flashing with pink and cyan laser traces.',
      camera: 'Rack focus from silicon die to particle sparks',
      voiceover: 'Introducing VORTEX OMNI: Multi-provider orchestration under 150 milliseconds.',
    },
    {
      num: 3,
      duration: '0:08 - 0:15',
      shot: 'Split-screen display showing responsive desktop, tablet, and mobile views compiling in real-time.',
      camera: 'Dynamic whip-pan into full-screen publishing button',
      voiceover: 'From natural language to universal one-click deployment.',
    },
  ]);

  // 3D Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isWireframe, setIsWireframe] = useState(true);
  const [shape, setShape] = useState<'torus' | 'cube' | 'sphere'>('torus');

  // Interactive Procedural 3D Canvas animation loop
  useEffect(() => {
    if (activeTab !== '3d') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const scale = 140;

      angleX += 0.015;
      angleY += 0.02;

      ctx.strokeStyle = isWireframe ? '#00f0ff' : '#ff2a85';
      ctx.lineWidth = 1.5;

      if (shape === 'torus' || shape === 'sphere') {
        const rings = 18;
        const segments = 24;
        const R = 1.0;
        const r = 0.45;

        for (let i = 0; i < rings; i++) {
          const u = (i / rings) * Math.PI * 2;
          ctx.beginPath();
          for (let j = 0; j <= segments; j++) {
            const v = (j / segments) * Math.PI * 2;
            let x = (R + r * Math.cos(v)) * Math.cos(u);
            let y = (R + r * Math.cos(v)) * Math.sin(u);
            let z = r * Math.sin(v);

            // Rotate around X and Y
            const y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
            const z1 = y * Math.sin(angleX) + z * Math.cos(angleX);
            const x2 = x * Math.cos(angleY) + z1 * Math.sin(angleY);
            const z2 = -x * Math.sin(angleY) + z1 * Math.cos(angleY);

            const fov = 350 / (350 + z2 * scale * 0.5);
            const px = cx + x2 * scale * fov;
            const py = cy + y1 * scale * fov;

            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      } else {
        // Wireframe Cube
        const vertices = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
        ];

        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ];

        const projected = vertices.map(([x, y, z]) => {
          const y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
          const z1 = y * Math.sin(angleX) + z * Math.cos(angleX);
          const x2 = x * Math.cos(angleY) + z1 * Math.sin(angleY);
          const z2 = -x * Math.sin(angleY) + z1 * Math.cos(angleY);
          const fov = 350 / (350 + z2 * scale * 0.5);
          return [cx + x2 * scale * fov, cy + y1 * scale * fov];
        });

        edges.forEach(([start, end]) => {
          ctx.beginPath();
          ctx.moveTo(projected[start][0], projected[start][1]);
          ctx.lineTo(projected[end][0], projected[end][1]);
          ctx.stroke();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab, isWireframe, shape]);

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || isGeneratingImage) return;
    setIsGeneratingImage(true);
    setGeneratedImageUrl(null);

    try {
      const res = await generateImage(imagePrompt, aspectRatio);
      setGeneratedImageUrl(res.imageUrl);
      setImageLatency(res.latencyMs);
    } catch (err: any) {
      alert(`Image generation notice: ${err?.message || 'Error occurred'}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!ttsText.trim() || isGeneratingTts) return;
    setIsGeneratingTts(true);
    setTtsAudioUrl(null);

    try {
      const res = await generateTTS(ttsText, ttsVoice);
      setTtsAudioUrl(res.audioUrl);
      setTtsLatency(res.latencyMs);
    } catch (err: any) {
      alert(`Audio synthesis notice: ${err?.message || 'Error occurred'}`);
    } finally {
      setIsGeneratingTts(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Tab Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="text-xs font-mono text-[#ff2a85] uppercase mb-1">
            MODULES 6-9 · INTEGRATED MULTIMEDIA SUITE
          </div>
          <h1 className="text-2xl font-extrabold text-white">Generative Multimedia Studios</h1>
        </div>

        <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab('image')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'image' ? 'bg-[#ff2a85] text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>AI Images</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'video' ? 'bg-[#ff2a85] text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>AI Video</span>
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'audio' ? 'bg-[#ff2a85] text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Audio & TTS</span>
          </button>
          <button
            onClick={() => setActiveTab('3d')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === '3d' ? 'bg-[#ff2a85] text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Studio</span>
          </button>
        </div>
      </div>

      {/* 1. IMAGE STUDIO */}
      {activeTab === 'image' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#ff2a85]" />
                Gemini Image Synthesis
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Prompt:</label>
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-[#ff2a85] resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Aspect Ratio:</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['1:1', '16:9', '4:3', '9:16'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setAspectRatio(r)}
                      className={`py-1.5 rounded-lg text-xs font-mono border transition-all ${
                        aspectRatio === r
                          ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/50 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImage}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#00f0ff] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,42,133,0.35)] disabled:opacity-50"
              >
                {isGeneratingImage ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isGeneratingImage ? 'Synthesizing Image...' : 'Generate Image'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800 min-h-[360px]">
            {generatedImageUrl ? (
              <div className="space-y-3 w-full flex flex-col items-center">
                <img
                  src={generatedImageUrl}
                  alt="Generated asset"
                  className="max-h-[380px] rounded-xl object-contain border border-slate-800 shadow-2xl"
                />
                <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
                  <span>Latency: <strong className="text-[#00f0ff] tabular-nums">{imageLatency} ms</strong></span>
                  <a
                    href={generatedImageUrl}
                    download="vortex-generated-asset.png"
                    className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white hover:border-[#ff2a85] flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 text-xs space-y-2">
                <Palette className="w-8 h-8 text-slate-700 mx-auto" />
                <span>Generated images rendered by Gemini 3.1 Flash Lite Image will appear here.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. AUDIO & TTS STUDIO */}
      {activeTab === 'audio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#00f0ff]" />
                Gemini 3.8 Flash Lite TTS Speech Synthesis
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Speech Script:</label>
                <textarea
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-[#00f0ff] resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Prebuilt Voice Persona:</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Kore', 'Puck', 'Fenrir', 'Zephyr'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setTtsVoice(v)}
                      className={`py-1.5 rounded-lg text-xs font-mono border transition-all ${
                        ttsVoice === v
                          ? 'bg-[#ff2a85]/20 text-[#ff2a85] border-[#ff2a85]/50 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateAudio}
                disabled={isGeneratingTts}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#ff2a85] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.35)] disabled:opacity-50"
              >
                {isGeneratingTts ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                <span>{isGeneratingTts ? 'Synthesizing Speech...' : 'Generate Voice Clip'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <h3 className="text-xs font-mono text-slate-400 uppercase font-semibold">Audio Output & Player</h3>
            {ttsAudioUrl ? (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <audio controls src={ttsAudioUrl} className="w-full" autoPlay />
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>Voice: <strong className="text-white">{ttsVoice}</strong></span>
                  <span>Latency: <strong className="text-emerald-400 tabular-nums">{ttsLatency} ms</strong></span>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 text-xs py-12">
                Click "Generate Voice Clip" to test real speech synthesis with WAV header decoding.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. VIDEO STUDIO */}
      {activeTab === 'video' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-[#ff2a85]" />
                Video Script, Scene Planning & Storyboard
              </h2>
              <span className="text-xs font-mono text-[#00f0ff]">3 Planned Scenes · 15s Teaser</span>
            </div>

            <div className="space-y-3">
              {videoScenes.map((scene) => (
                <div
                  key={scene.num}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-[#ff2a85]/40 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#ff2a85] font-bold">SCENE 0{scene.num}</span>
                    <span className="text-slate-400">{scene.duration}</span>
                  </div>
                  <div className="text-xs text-white font-medium">{scene.shot}</div>
                  <div className="text-[11px] font-mono text-cyan-400">Camera: {scene.camera}</div>
                  <div className="text-xs text-slate-300 italic bg-slate-900/70 p-2 rounded">
                    "{scene.voiceover}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. 3D STUDIO */}
      {activeTab === '3d' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-[#00f0ff]" />
                Procedural 3D Spatial Canvas
              </h2>
              <p className="text-xs text-slate-400">Interactive WebGL simulation with dynamic geometry transformation.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex rounded-lg bg-slate-950 border border-slate-800 p-0.5 text-xs font-mono">
                {(['torus', 'cube'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    className={`px-3 py-1 rounded uppercase transition-colors ${
                      shape === s ? 'bg-[#00f0ff] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsWireframe(!isWireframe)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white"
              >
                Wireframe: {isWireframe ? 'CYAN' : 'PINK SOLID'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center bg-slate-950 rounded-xl border border-slate-800 overflow-hidden p-4">
            <canvas ref={canvasRef} width={640} height={360} className="w-full max-w-2xl h-auto rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};
