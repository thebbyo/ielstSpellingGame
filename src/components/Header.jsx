import React from 'react';
import { Volume2, Flame, Award, BookOpen, Clock, RefreshCw, VolumeX } from 'lucide-react';

export default function Header({ 
  masteredCount, 
  totalWords = 1200, 
  streak, 
  accent, 
  setAccent,
  onOpenWordList,
  onResetProgress 
}) {
  const percentage = Math.round((masteredCount / totalWords) * 100);

  return (
    <header className="sticky top-0 z-40 glass-card border-b border-slate-800/80 px-4 lg:px-8 py-3.5 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg glow-cyan">
            <Volume2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-sans">
                IELTS <span className="gradient-text">Spelling Bee 1200</span>
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" /> 5-Day Sprint
              </span>
            </div>
            <p className="text-xs text-slate-400">Target: 240 Words / Day for IELTS Listening Band 9.0</p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="flex-1 max-w-md w-full mx-4">
          <div className="flex justify-between items-center text-xs font-semibold mb-1">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-cyan-400" /> Mastery Progress
            </span>
            <span className="text-cyan-400 font-mono">{masteredCount} / {totalWords} ({percentage}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(percentage, 2)}%` }}
            />
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl">
            <Flame className={`w-4 h-4 ${streak > 0 ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
            <span className="text-sm font-bold text-amber-300 font-mono">{streak}</span>
            <span className="text-xs text-amber-400/80 font-medium">Streak</span>
          </div>

          {/* Voice Accent Switcher */}
          <button
            onClick={() => setAccent(accent === 'en-GB' ? 'en-US' : 'en-GB')}
            title="Toggle Audio Accent"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition-all"
          >
            {accent === 'en-GB' ? '🇬🇧 UK Voice' : '🇺🇸 US Voice'}
          </button>

          {/* Word Database Browser */}
          <button
            onClick={onOpenWordList}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 rounded-xl text-xs font-semibold text-purple-300 transition-all"
          >
            <BookOpen className="w-4 h-4" /> Word Index
          </button>
        </div>

      </div>
    </header>
  );
}
