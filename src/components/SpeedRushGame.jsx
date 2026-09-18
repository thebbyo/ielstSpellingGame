import React, { useState, useEffect, useRef } from 'react';
import { Zap, Volume2, Timer, Trophy, RotateCcw, ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakWord } from '../utils/speech';

export default function SpeedRushGame({ words, accent, onMasterWord }) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('ielts_speed_highscore') || '0', 10);
  });

  const currentWord = words[currentIndex] || words[0];
  const inputRef = useRef(null);

  // Timer countdown
  useEffect(() => {
    let timer = null;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('ielts_speed_highscore', score.toString());
      }
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft, score, highScore]);

  const startGame = () => {
    setTimeLeft(60);
    setScore(0);
    setCorrectCount(0);
    setCurrentIndex(0);
    setUserInput('');
    setGameActive(true);
    setTimeout(() => {
      speakWord(words[0].word, { accent, rate: 1.1 });
      if (inputRef.current) inputRef.current.focus();
    }, 200);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!gameActive || !userInput.trim()) return;

    if (userInput.trim().toLowerCase() === currentWord.word.toLowerCase()) {
      setScore(prev => prev + 100);
      setCorrectCount(prev => prev + 1);
      onMasterWord(currentWord.id);
      
      const nextIdx = (currentIndex + 1) % words.length;
      setCurrentIndex(nextIdx);
      setUserInput('');

      // Play next word audio instantly
      speakWord(words[nextIdx].word, { accent, rate: 1.1 });
    } else {
      // Small penalty or skip
      setUserInput('');
      const nextIdx = (currentIndex + 1) % words.length;
      setCurrentIndex(nextIdx);
      speakWord(words[nextIdx].word, { accent, rate: 1.1 });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-amber-500/30 text-center relative overflow-hidden">
        
        {/* Header Stats */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="text-2xl font-black font-mono text-amber-400">{timeLeft}s</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold">High Score</span>
              <span className="text-sm font-bold text-amber-300 font-mono">{highScore} XP</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold">Score</span>
              <span className="text-lg font-extrabold text-cyan-400 font-mono">{score} XP</span>
            </div>
          </div>
        </div>

        {!gameActive && timeLeft === 60 && (
          <div className="py-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center mx-auto mb-4 shadow-lg glow-gold">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">60s IELTS Speed Rush</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              Test how many IELTS words you can spell correctly under 60 seconds of high pressure!
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-base rounded-2xl shadow-xl transition-all glow-gold"
            >
              Start 60s Speed Rush
            </button>
          </div>
        )}

        {!gameActive && timeLeft === 0 && (
          <div className="py-6">
            <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-3 animate-bounce" />
            <h3 className="text-2xl font-black text-white mb-1">Time's Up!</h3>
            <p className="text-sm text-slate-300 mb-4">
              You correctly spelled <span className="font-extrabold text-cyan-400">{correctCount} words</span> in 60 seconds!
            </p>
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 max-w-xs mx-auto mb-6">
              <span className="text-xs text-slate-400 block">Total XP Earned</span>
              <span className="text-3xl font-black text-amber-400 font-mono">+{score} XP</span>
            </div>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}

        {gameActive && (
          <div className="py-4">
            <button
              type="button"
              onClick={() => speakWord(currentWord.word, { accent, rate: 1.1 })}
              className="w-16 h-16 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-cyan-400"
            >
              <Volume2 className="w-8 h-8" />
            </button>

            <span className="text-xs text-slate-400 block mb-4">Category: {currentWord.category}</span>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type & press Enter..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-amber-500/50 text-center text-lg font-bold text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
                autoFocus
              />
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
