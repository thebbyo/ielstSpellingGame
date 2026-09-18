import React, { useState } from 'react';
import { AlertTriangle, Volume2, CheckCircle, RefreshCw, ShieldAlert, Trash2 } from 'lucide-react';
import { speakWord } from '../utils/speech';

export default function MistakeVault({ mistakeWords, onRemoveMistake, accent, onMasterWord }) {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState('idle');

  const currentWord = mistakeWords[activeWordIndex];

  if (!mistakeWords || mistakeWords.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 text-center py-12">
        <div className="glass-card rounded-3xl p-8 border border-slate-800">
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-xl font-extrabold text-white mb-1">Mistake Vault Clean!</h3>
          <p className="text-xs text-slate-400">
            You currently have 0 flagged weak words. Great job! Misspelled words in other game modes will automatically appear here for spaced repetition drill.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim() || !currentWord) return;

    if (userInput.trim().toLowerCase() === currentWord.word.toLowerCase()) {
      setStatus('correct');
      onMasterWord(currentWord.id);
      onRemoveMistake(currentWord.id);
      
      setTimeout(() => {
        setUserInput('');
        setStatus('idle');
        if (activeWordIndex >= mistakeWords.length - 1) {
          setActiveWordIndex(0);
        }
      }, 1000);
    } else {
      setStatus('incorrect');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-rose-500/30">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-extrabold text-white">
              Mistake Vault Spaced Repetition ({activeWordIndex + 1} / {mistakeWords.length})
            </h3>
          </div>
          <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 text-xs font-bold rounded-lg border border-rose-500/30 font-mono">
            {mistakeWords.length} Red-Alert Words
          </span>
        </div>

        {/* Word Audio Drill */}
        <div className="text-center py-4">
          <button
            onClick={() => speakWord(currentWord.word, { accent })}
            className="w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center mx-auto mb-3 shadow-lg glow-gold transition-all"
          >
            <Volume2 className="w-8 h-8" />
          </button>
          
          <p className="text-xs text-slate-400 mb-2">Category: {currentWord.category}</p>

          <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Correct spelling..."
              className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-center text-lg font-bold font-mono focus:outline-none transition-all ${
                status === 'correct' ? 'border-emerald-500 text-emerald-300 bg-emerald-950/30' :
                status === 'incorrect' ? 'border-rose-500 text-rose-300 bg-rose-950/30' : 'border-rose-500/50 text-white'
              }`}
              autoFocus
            />
          </form>

          {status === 'correct' && (
            <p className="text-xs text-emerald-400 font-bold mt-3">✅ Mastered & Removed from Vault!</p>
          )}
          {status === 'incorrect' && (
            <p className="text-xs text-rose-400 font-bold mt-3">
              ❌ Correct Answer: <span className="font-mono text-white">{currentWord.word}</span>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
