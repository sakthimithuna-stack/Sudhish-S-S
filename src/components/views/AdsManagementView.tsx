import React, { useState } from 'react';
import { Megaphone, ShieldAlert, CheckCircle2, Layout, Smartphone, Globe } from 'lucide-react';

export const AdsManagementView: React.FC = () => {
  const [adSensePublisherId, setAdSensePublisherId] = useState('ca-pub-9482019482019482');
  const [adMobAppId, setAdMobAppId] = useState('ca-app-pub-9482019482019482~8392019482');
  const [bannerAdEnabled, setBannerAdEnabled] = useState(true);
  const [interstitialEnabled, setInterstitialEnabled] = useState(false);
  const [invalidTrafficShield, setInvalidTrafficShield] = useState(true);

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="border-b border-slate-800 pb-5">
        <div className="text-xs font-mono text-[#00f0ff] uppercase mb-1">
          MODULE 18 · GOOGLE ADVERTISING INTEGRATION
        </div>
        <h1 className="text-2xl font-extrabold text-white">Google AdSense & AdMob Management</h1>
        <p className="text-xs text-slate-400">
          Configure compliant ad slots for web applications and Android mobile builds with invalid traffic safeguards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Web: Google AdSense */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Globe className="w-4 h-4 text-[#00f0ff]" />
            <span>Google AdSense (Web Projects)</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">Publisher ID:</label>
            <input
              type="text"
              value={adSensePublisherId}
              onChange={(e) => setAdSensePublisherId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={bannerAdEnabled}
                onChange={(e) => setBannerAdEnabled(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-[#00f0ff]"
              />
              <span>Responsive Top/Bottom Display Banner (728x90)</span>
            </label>
          </div>

          {/* Ad Slot Mock Preview */}
          <div className="p-4 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-center text-xs text-slate-500 font-mono">
            [AdSense Responsive Unit · Ad Placement Container]
          </div>
        </div>

        {/* Mobile: Google AdMob */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Smartphone className="w-4 h-4 text-[#ff2a85]" />
            <span>Google AdMob (Android In-App)</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">AdMob App ID:</label>
            <input
              type="text"
              value={adMobAppId}
              onChange={(e) => setAdMobAppId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={interstitialEnabled}
                onChange={(e) => setInterstitialEnabled(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-[#ff2a85]"
              />
              <span>Rewarded / Interstitial Ad on Level Completion</span>
            </label>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-center text-xs text-slate-500 font-mono">
            [AdMob Adaptive Banner Container · 320x50]
          </div>
        </div>
      </div>

      {/* Compliance & Invalid Traffic Safeguard */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <ShieldAlert className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">Strict Compliance Policy:</strong> VORTEX enforces zero artificial impressions or click triggers. All advertising slots remain clearly distinguished from interactive user controls with clear "Sponsored" disclaimers.
        </p>
      </div>
    </div>
  );
};
