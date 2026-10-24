import type { AppProject } from '../types/index.ts';

export const INITIAL_PROJECT: AppProject = {
  id: 'proj_vortex_eduflex',
  name: 'EduFlex AI Academy',
  description: 'Next-gen adaptive learning platform with course modules, quizzes, subscriber dashboard, and mobile interface.',
  type: 'education',
  spec: {
    name: 'EduFlex AI Academy',
    tagline: 'Hyper-personalized learning accelerated by adaptive intelligence',
    type: 'education',
    techStack: {
      frontend: 'React 19 + TypeScript',
      styling: 'Tailwind CSS v4 Cyber Slate',
      state: 'React Hooks & Context',
      backend: 'Express / Node.js API',
      database: 'PostgreSQL relational schema',
    },
    features: [
      'Interactive Course Curriculum',
      'Real-time Quiz Engine & Scorecards',
      'Student Progress Analytics',
      'Tiered Subscription Access',
      'Mobile-Optimized Touch Layout',
    ],
    databaseSchema: {
      tables: [
        {
          name: 'users',
          columns: [
            { name: 'id', type: 'UUID', isPrimary: true },
            { name: 'email', type: 'VARCHAR(255)' },
            { name: 'plan', type: 'VARCHAR(50)' },
            { name: 'xp_points', type: 'INTEGER' },
          ],
        },
        {
          name: 'courses',
          columns: [
            { name: 'id', type: 'UUID', isPrimary: true },
            { name: 'title', type: 'VARCHAR(255)' },
            { name: 'modules_count', type: 'INTEGER' },
            { name: 'difficulty', type: 'VARCHAR(50)' },
          ],
        },
      ],
    },
    architectureOverview: 'Clean modular SPA architecture with real-time responsive dashboard and client-side reactive state.',
    filesSummary: [
      { path: 'src/App.tsx', purpose: 'Main interactive course dashboard & state coordinator' },
      { path: 'src/components/CourseList.tsx', purpose: 'Curriculum catalog with progress track' },
      { path: 'src/components/QuizModal.tsx', purpose: 'Adaptive quiz runner with instant feedback' },
      { path: 'src/types.ts', purpose: 'Domain types for courses, students, and badges' },
    ],
  },
  activeFile: 'src/App.tsx',
  files: [
    {
      path: 'src/App.tsx',
      language: 'typescript',
      content: `import React, { useState } from 'react';
import { BookOpen, Award, Sparkles, CheckCircle2, Play, Users } from 'lucide-react';

export default function EduFlexApp() {
  const [activeCourse, setActiveCourse] = useState('fullstack');
  const [xp, setXp] = useState(1420);
  const [completedLessons, setCompletedLessons] = useState<number[]>([1, 2]);

  const courses = [
    { id: 'fullstack', title: 'Full-Stack Neural Architectures', modules: 12, xp: 500, level: 'Advanced' },
    { id: 'quantum', title: 'Quantum Algorithms & Linear Algebra', modules: 8, xp: 350, level: 'Intermediate' },
    { id: 'mobile', title: 'Reactive Cross-Platform Systems', modules: 10, xp: 400, level: 'Beginner' }
  ];

  const lessons = [
    { id: 1, title: 'Introduction to Multi-Model Orchestration', duration: '14 min', status: 'completed' },
    { id: 2, title: 'Optimizing First Token Latency (TTFT)', duration: '22 min', status: 'completed' },
    { id: 3, title: 'Building Resilient Fallback Pipelines', duration: '18 min', status: 'available' },
    { id: 4, title: 'Real-time WebSocket & Audio Streaming', duration: '25 min', status: 'locked' }
  ];

  const handleComplete = (id: number) => {
    if (!completedLessons.includes(id)) {
      setCompletedLessons([...completedLessons, id]);
      setXp(prev => prev + 50);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-cyan-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-pink-500/20">
            E
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              EduFlex Academy <span className="text-xs text-cyan-400 font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">PRO TIER</span>
            </h1>
            <p className="text-xs text-slate-400">Adaptive curriculum powered by VORTEX engine</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-xs text-slate-400">Student XP:</span>
            <span className="text-sm font-bold font-mono text-pink-400">{xp}</span>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-slate-950 font-bold text-xs rounded-lg hover:opacity-90 transition-opacity">
            Resume Study
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Courses */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Enrolled Programs</h2>
          {courses.map(course => (
            <div 
              key={course.id}
              onClick={() => setActiveCourse(course.id)}
              className={\`p-4 rounded-xl border cursor-pointer transition-all \${
                activeCourse === course.id 
                  ? 'bg-slate-900 border-pink-500/60 shadow-lg shadow-pink-500/10' 
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }\`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-cyan-400">{course.level}</span>
                <span className="text-xs text-pink-400 font-mono">+{course.xp} XP</span>
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{course.title}</h3>
              <p className="text-xs text-slate-400">{course.modules} Interactive Modules</p>
            </div>
          ))}
        </div>

        {/* Center: Active Syllabus */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Course Syllabus & Labs</h2>
            <span className="text-xs text-slate-400">Progress: {Math.round((completedLessons.length / lessons.length) * 100)}%</span>
          </div>

          <div className="space-y-3">
            {lessons.map(lesson => {
              const isCompleted = completedLessons.includes(lesson.id);
              return (
                <div 
                  key={lesson.id} 
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={\`w-8 h-8 rounded-lg flex items-center justify-center \${
                      isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }\`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{lesson.title}</h4>
                      <span className="text-xs text-slate-500 font-mono">{lesson.duration}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleComplete(lesson.id)}
                    className={\`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all \${
                      isCompleted 
                        ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20 cursor-default' 
                        : 'border-pink-500/40 text-pink-400 bg-pink-950/20 hover:bg-pink-900/40'
                    }\`}
                  >
                    {isCompleted ? 'Completed' : 'Mark Complete (+50 XP)'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}`,
    },
    {
      path: 'src/types.ts',
      language: 'typescript',
      content: `export interface Course {
  id: string;
  title: string;
  modules: number;
  xp: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  status: 'completed' | 'available' | 'locked';
}`,
    },
    {
      path: 'package.json',
      language: 'json',
      content: `{
  "name": "eduflex-academy",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.546.0"
  }
}`,
    },
  ],
  checkpoints: [
    {
      id: 'chk_1',
      timestamp: Date.now() - 120000,
      message: 'Initial project specification and course dashboard generation',
      files: [],
    },
  ],
  createdAt: Date.now() - 3600000,
  updatedAt: Date.now(),
};
