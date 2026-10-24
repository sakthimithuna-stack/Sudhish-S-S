import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { HyperSpeedView } from './components/views/HyperSpeedView.tsx';
import { OmniEngineView } from './components/views/OmniEngineView.tsx';
import { AppBuilderView } from './components/views/AppBuilderView.tsx';
import { LiveWorkspaceView } from './components/views/LiveWorkspaceView.tsx';
import { PublishingCenterView } from './components/views/PublishingCenterView.tsx';
import { MultimediaStudioView } from './components/views/MultimediaStudioView.tsx';
import { AgentWorkspaceView } from './components/views/AgentWorkspaceView.tsx';
import { ResearchWorkspaceView } from './components/views/ResearchWorkspaceView.tsx';
import { MonetizationView } from './components/views/MonetizationView.tsx';
import { SubscriptionsView } from './components/views/SubscriptionsView.tsx';
import { AdsManagementView } from './components/views/AdsManagementView.tsx';
import { SecurityUsageView } from './components/views/SecurityUsageView.tsx';
import { INITIAL_PROJECT } from './data/defaultProjects.ts';
import type { AppProject } from './types/index.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('hyperspeed');
  const [currentProject, setCurrentProject] = useState<AppProject>(INITIAL_PROJECT);

  const handleOpenInWorkspace = () => {
    setActiveTab('workspace');
  };

  const handleDeployClick = () => {
    setActiveTab('publishing');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-[#ff2a85]/30 selection:text-[#00f0ff]">
      {/* Top Bar adhering to the 3-Zone Contract */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onDeployClick={handleDeployClick}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Center / Main Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-950/60 cyber-grid">
          {activeTab === 'hyperspeed' && <HyperSpeedView />}
          {activeTab === 'omni' && <OmniEngineView />}
          {activeTab === 'builder' && (
            <AppBuilderView
              currentProject={currentProject}
              onUpdateProject={setCurrentProject}
              onOpenInWorkspace={handleOpenInWorkspace}
            />
          )}
          {activeTab === 'workspace' && (
            <LiveWorkspaceView
              project={currentProject}
              onUpdateProject={setCurrentProject}
              onDeployClick={handleDeployClick}
            />
          )}
          {activeTab === 'mobile' && (
            <LiveWorkspaceView
              project={currentProject}
              onUpdateProject={setCurrentProject}
              onDeployClick={handleDeployClick}
            />
          )}
          {activeTab === 'publishing' && <PublishingCenterView project={currentProject} />}
          {activeTab === 'multimedia' && <MultimediaStudioView />}
          {activeTab === 'agents' && <AgentWorkspaceView />}
          {activeTab === 'research' && <ResearchWorkspaceView />}
          {activeTab === 'automation' && <HyperSpeedView />}
          {activeTab === 'monetization' && <MonetizationView />}
          {activeTab === 'subscriptions' && <SubscriptionsView />}
          {activeTab === 'ads' && <AdsManagementView />}
          {activeTab === 'security' && <SecurityUsageView />}
        </main>
      </div>
    </div>
  );
}
