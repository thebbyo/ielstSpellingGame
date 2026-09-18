import React from 'react';
import { Volume2, Zap, Puzzle, AlertTriangle, FileCheck, Layers } from 'lucide-react';

const MODES = [
  {
    id: 'listening',
    name: 'Audio Spelling Bee',
    icon: Volume2,
    badge: 'Recommended',
    desc: 'Listen to UK audio & type exact IELTS spelling',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'speed',
    name: '60s Speed Rush',
    icon: Zap,
    badge: 'High Energy',
    desc: 'Rapid-fire spelling against 60s clock',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'anagram',
    name: 'Letter Anagram',
    icon: Puzzle,
    badge: 'Warm Up',
    desc: 'Unscramble letters while listening to pronunciation',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'vault',
    name: 'Mistake Vault',
    icon: AlertTriangle,
    badge: 'Spaced Repetition',
    desc: 'Target & eliminate your specific red-alert words',
    color: 'from-rose-500 to-red-600'
  },
  {
    id: 'mock',
    name: '40-Q Mock Test',
    icon: FileCheck,
    badge: 'IELTS Exam',
    desc: 'Real IELTS 40-question listening test & Band score',
    color: 'from-emerald-500 to-teal-600'
  }
];

export default function ModeSelector({ activeMode, setActiveMode, mistakeCount }) {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Layers className="w-4 h-4 text-purple-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Game Modes</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-slate-800 border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${mode.color} flex items-center justify-center text-white shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
                {mode.id === 'vault' && mistakeCount > 0 ? (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full font-mono">
                    {mistakeCount}
                  </span>
                ) : (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {mode.badge}
                  </span>
                )}
              </div>

              <h4 className="text-xs font-bold text-white mb-0.5">{mode.name}</h4>
              <p className="text-[10px] text-slate-400 line-clamp-1">{mode.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
