import React, { useState, useEffect } from 'react';
import { Puzzle, Volume2, RotateCcw, Check, ArrowRight, Trash2 } from 'lucide-react';
import { speakWord } from '../utils/speech';

export default function AnagramGame({ words, accent, onMasterWord }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambled, setScrambled] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [status, setStatus] = useState('idle');

  const currentWord = words[currentIndex] || words[0];

  useEffect(() => {
    if (currentWord) {
      const letters = currentWord.word.split('');
      // Shuffle letters
      const shuffled = [...letters].sort(() => Math.random() - 0.5);
      setScrambled(shuffled.map((char, idx) => ({ id: idx, char, used: false })));
      setSelectedLetters([]);
      setStatus('idle');
      speakWord(currentWord.word, { accent });
    }
  }, [currentIndex, currentWord]);

  const handleSelectTile = (item) => {
    if (item.used || status !== 'idle') return;
    
    // Mark as used
    setScrambled(prev => prev.map(l => l.id === item.id ? { ...l, used: true } : l));
    setSelectedLetters(prev => [...prev, item]);
  };

  const handleDeselectTile = (item) => {
    if (status !== 'idle') return;
    setSelectedLetters(prev => prev.filter(l => l.id !== item.id));
    setScrambled(prev => prev.map(l => l.id === item.id ? { ...l, used: false } : l));
  };

  const handleClear = () => {
    setSelectedLetters([]);
    setScrambled(prev => prev.map(l => ({ ...l, used: false })));
  };

  const handleCheck = () => {
    const builtWord = selectedLetters.map(l => l.char).join('');
    if (builtWord.toLowerCase() === currentWord.word.toLowerCase()) {
      setStatus('correct');
      onMasterWord(currentWord.id);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % words.length);
      }, 1200);
    } else {
      setStatus('incorrect');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-purple-500/30 text-center">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
            <Puzzle className="w-4 h-4" /> Word Unscramble #{currentIndex + 1}
          </span>
          <button
            onClick={() => speakWord(currentWord.word, { accent })}
            className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-lg border border-purple-500/30"
          >
            <Volume2 className="w-4 h-4" /> Listen
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-6">
          Category: <span className="font-bold text-slate-200">{currentWord.category}</span>
        </p>

        {/* Built Word Box */}
        <div className="min-h-[60px] p-3 mb-6 bg-slate-900 border border-slate-700 rounded-2xl flex flex-wrap items-center justify-center gap-2">
          {selectedLetters.length === 0 ? (
            <span className="text-xs text-slate-500 italic">Click letters below to build spelling...</span>
          ) : (
            selectedLetters.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleDeselectTile(item)}
                className="w-10 h-10 rounded-xl bg-purple-600 text-white font-extrabold text-lg shadow-md border border-purple-400 hover:bg-purple-500 transition-all font-mono"
              >
                {item.char}
              </button>
            ))
          )}
        </div>

        {/* Available Scrambled Letter Tiles */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {scrambled.map((item) => (
            <button
              key={item.id}
              disabled={item.used || status !== 'idle'}
              onClick={() => handleSelectTile(item)}
              className={`w-11 h-11 rounded-xl font-bold text-lg font-mono transition-all ${
                item.used
                  ? 'bg-slate-900 text-slate-700 border border-slate-800 cursor-not-allowed opacity-30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 shadow-sm hover:scale-105'
              }`}
            >
              {item.char}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleClear}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Reset
          </button>
          <button
            onClick={handleCheck}
            disabled={selectedLetters.length === 0}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Check className="w-4 h-4" /> Validate
          </button>
        </div>

        {status === 'correct' && (
          <p className="text-emerald-400 font-bold text-sm mt-4 animate-bounce">
            🎉 Correct! Moving to next word...
          </p>
        )}
        {status === 'incorrect' && (
          <p className="text-rose-400 font-bold text-xs mt-4">
            ❌ Not quite right! Clear and try again or listen to audio.
          </p>
        )}

      </div>
    </div>
  );
}
