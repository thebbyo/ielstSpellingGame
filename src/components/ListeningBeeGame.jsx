import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, RefreshCw, HelpCircle, Check, X, ArrowRight, Sparkles, AlertCircle, Info, ShieldAlert, FastForward } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakWord } from '../utils/speech';

export default function ListeningBeeGame({ 
  words, 
  masteredSet, 
  onMasterWord, 
  onMissWord, 
  accent, 
  streak, 
  setStreak 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'correct', 'incorrect'
  const [showHint, setShowHint] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(0.9);
  const inputRef = useRef(null);

  const currentWord = words[currentIndex] || words[0];

  // Play audio on word change or manual trigger
  const handlePlayAudio = (rateOverride = audioSpeed) => {
    if (currentWord) {
      speakWord(currentWord.word, { accent, rate: rateOverride });
    }
  };

  useEffect(() => {
    setUserInput('');
    setStatus('idle');
    setShowHint(false);
    if (currentWord) {
      // Auto-play audio when word loads
      const timer = setTimeout(() => {
        handlePlayAudio();
        if (inputRef.current) inputRef.current.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentWord]);

  // Handle Answer Submission
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || status !== 'idle') return;

    const trimmedInput = userInput.trim();
    const targetWord = currentWord.word;
    
    // Check answer (case-insensitive for basic compare, but alert if capital was missing for proper nouns!)
    const isExact = trimmedInput === targetWord;
    const isCaseInsensitiveMatch = trimmedInput.toLowerCase() === targetWord.toLowerCase();

    if (isCaseInsensitiveMatch) {
      setStatus('correct');
      onMasterWord(currentWord.id);
      setStreak(prev => prev + 1);

      // Trigger Confetti on 5-streak milestone
      if ((streak + 1) % 5 === 0) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }

      // Auto advance after short delay
      setTimeout(() => {
        handleNextWord();
      }, 1200);

    } else {
      setStatus('incorrect');
      setStreak(0);
      onMissWord(currentWord);
    }
  };

  const handleNextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Loop back to start
      setCurrentIndex(0);
    }
  };

  const isMastered = masteredSet.has(currentWord?.id);

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Game Card */}
      <div className="glass-card rounded-3xl p-6 md:p-10 border border-slate-700/60 shadow-2xl relative overflow-hidden">
        
        {/* Top Word Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-800 text-cyan-400 font-mono text-xs font-bold rounded-lg border border-slate-700">
              Word {currentIndex + 1} / {words.length}
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-lg border border-purple-500/30">
              {currentWord?.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isMastered && (
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1 border border-emerald-500/30">
                <Check className="w-3.5 h-3.5" /> Mastered
              </span>
            )}

            {/* Audio Speed Controls */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setAudioSpeed(0.75)}
                className={`px-2 py-0.5 rounded font-mono font-bold transition-all ${
                  audioSpeed === 0.75 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                0.75x
              </button>
              <button
                onClick={() => setAudioSpeed(0.9)}
                className={`px-2 py-0.5 rounded font-mono font-bold transition-all ${
                  audioSpeed === 0.9 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                1.0x
              </button>
              <button
                onClick={() => setAudioSpeed(1.15)}
                className={`px-2 py-0.5 rounded font-mono font-bold transition-all ${
                  audioSpeed === 1.15 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                1.25x
              </button>
            </div>
          </div>
        </div>

        {/* Audio Player Core Area */}
        <div className="flex flex-col items-center justify-center my-6 text-center">
          
          <button
            onClick={() => handlePlayAudio()}
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-xl glow-cyan hover:scale-105 active:scale-95 transition-all group mb-4 relative"
          >
            <Volume2 className="w-10 h-10 text-white group-hover:animate-pulse" />
            <span className="absolute -bottom-2 text-[10px] font-bold bg-slate-950/90 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40">
              Space / Click to Listen
            </span>
          </button>

          <p className="text-xs text-slate-400 mb-6">
            Listen carefully to the audio clip, then type the exact spelling below.
          </p>

          {/* Badges / Traps Indicators */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700">
              {currentWord?.length} Letters
            </span>
            {currentWord?.hasDoubleLetters && (
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-md border border-amber-500/30 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Double Letter Trap
              </span>
            )}
            {currentWord?.isCapitalized && (
              <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-md border border-purple-500/30">
                Capitalized (Proper Noun)
              </span>
            )}
            {currentWord?.hasHyphen && (
              <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-semibold rounded-md border border-cyan-500/30">
                Hyphenated Word
              </span>
            )}
            {currentWord?.spellingVariant && (
              <span className="px-2.5 py-1 bg-pink-500/20 text-pink-300 text-xs font-semibold rounded-md border border-pink-500/30">
                {currentWord.spellingVariant}
              </span>
            )}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={status !== 'idle'}
              placeholder="Type your spelling here..."
              className={`w-full px-5 py-4 rounded-2xl bg-slate-900 border text-center text-xl font-bold tracking-wide font-mono focus:outline-none transition-all ${
                status === 'correct'
                  ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300 ring-2 ring-emerald-500/40'
                  : status === 'incorrect'
                  ? 'border-rose-500 bg-rose-950/30 text-rose-300 ring-2 ring-rose-500/40 animate-shake'
                  : 'border-slate-700 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30'
              }`}
              autoFocus
            />

            {status === 'idle' && (
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center gap-1"
              >
                Submit <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Feedback Message */}
        {status === 'correct' && (
          <div className="p-4 mb-6 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-center animate-bounce">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-lg mb-1">
              <Check className="w-6 h-6" /> Excellent! Correct Spelling!
            </div>
            <p className="text-xs text-emerald-300/80 font-mono">
              Word: <span className="font-extrabold underline">{currentWord.word}</span>
            </p>
          </div>
        )}

        {status === 'incorrect' && (
          <div className="p-5 mb-6 bg-rose-500/20 border border-rose-500/40 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-rose-400 font-bold text-base">
                <X className="w-5 h-5" /> Misspelled!
              </span>
              <button
                onClick={handleNextWord}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1"
              >
                Next Word <FastForward className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm mt-3 pt-3 border-t border-rose-500/30">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-rose-500/20">
                <span className="text-[10px] text-slate-400 block font-sans">You typed:</span>
                <span className="font-mono text-rose-300 line-through font-semibold">{userInput || '(blank)'}</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-emerald-500/30">
                <span className="text-[10px] text-slate-400 block font-sans">Correct IELTS spelling:</span>
                <span className="font-mono text-emerald-400 font-extrabold text-base tracking-wider">{currentWord.word}</span>
              </div>
            </div>

            {currentWord.hint && (
              <p className="text-xs text-slate-300 mt-3 pt-2 border-t border-slate-800">
                💡 <span className="font-semibold text-amber-300">IELTS Note:</span> {currentWord.hint}
              </p>
            )}
          </div>
        )}

        {/* Hint Toggle & Keyboard Shortcuts */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/60">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-all font-semibold"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            {showHint ? 'Hide Hint' : 'Need a Hint?'}
          </button>

          <div className="flex items-center gap-2">
            <span>Press <kbd className="kbd-key">Space</kbd> for Audio</span>
            <span><kbd className="kbd-key">Enter</kbd> to Submit</span>
          </div>
        </div>

        {/* Revealed Hint Box */}
        {showHint && (
          <div className="mt-4 p-4 bg-slate-900/90 border border-cyan-500/30 rounded-2xl text-xs space-y-1.5 text-slate-300">
            <p><span className="text-cyan-400 font-semibold">Category:</span> {currentWord.category}</p>
            <p><span className="text-cyan-400 font-semibold">Starts with:</span> <span className="font-mono font-bold text-white uppercase">{currentWord.word[0]}</span></p>
            <p><span className="text-cyan-400 font-semibold">Length:</span> {currentWord.length} letters</p>
            {currentWord.hint && <p><span className="text-cyan-400 font-semibold">Clue:</span> {currentWord.hint}</p>}
          </div>
        )}

      </div>
    </div>
  );
}
