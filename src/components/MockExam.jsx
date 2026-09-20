import React, { useState, useEffect } from 'react';
import { FileCheck, Volume2, ArrowRight, Award, CheckCircle2, XCircle, RotateCcw, Flame, Trophy, FastForward, Bookmark, Search } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakWord } from '../utils/speech';

// Normalize text helper to prevent false failures from spacing or quotes
const normalizeWord = (text) => {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ');
};

export default function MockExam({ words, accent }) {
  const [examLength, setExamLength] = useState(1200);
  const [examWords, setExamWords] = useState([]);
  const [answers, setAnswers] = useState({}); // ID-locked mapping: { [word.id]: string }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [examStarted, setExamStarted] = useState(false);
  const [filterIncorrectOnly, setFilterIncorrectOnly] = useState(false);

  useEffect(() => {
    if (words && words.length > 0) {
      initExam(examLength);
    }
  }, [words]);

  const initExam = (lengthTarget = examLength) => {
    let selected = [];
    if (lengthTarget >= words.length) {
      selected = [...words]; // All 1200 words in exact order
    } else {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      selected = shuffled.slice(0, lengthTarget);
    }
    setExamWords(selected);
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
    setUserInput('');
    setExamStarted(false);
  };

  const startExam = () => {
    setExamStarted(true);
    setCurrentIndex(0);
    setUserInput('');
    if (examWords[0]) {
      speakWord(examWords[0].word, { accent });
    }
  };

  const currentWord = examWords[currentIndex];

  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (!currentWord) return;

    // ID-Locked answer save
    const newAnswers = { ...answers, [currentWord.id]: userInput.trim() };
    setAnswers(newAnswers);

    if (currentIndex < examWords.length - 1) {
      const nextIdx = currentIndex + 1;
      const nextWord = examWords[nextIdx];
      setCurrentIndex(nextIdx);
      setUserInput(newAnswers[nextWord.id] || '');
      speakWord(nextWord.word, { accent });
    } else {
      // Completed exam
      setSubmitted(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      // Save current input before navigating back
      if (currentWord) {
        setAnswers(prev => ({ ...prev, [currentWord.id]: userInput.trim() }));
      }
      const prevIdx = currentIndex - 1;
      const prevWord = examWords[prevIdx];
      setCurrentIndex(prevIdx);
      setUserInput(answers[prevWord.id] || '');
      speakWord(prevWord.word, { accent });
    }
  };

  const calculateGrandBand = (score, total) => {
    const ratio = total > 0 ? score / total : 0;
    if (ratio >= 0.95) return { band: '9.0', title: 'Grand Master Expert', color: 'text-amber-400' };
    if (ratio >= 0.88) return { band: '8.5', title: 'Very Good User', color: 'text-emerald-400' };
    if (ratio >= 0.80) return { band: '8.0', title: 'Very Good User', color: 'text-cyan-400' };
    if (ratio >= 0.72) return { band: '7.5', title: 'Good User', color: 'text-blue-400' };
    if (ratio >= 0.65) return { band: '7.0', title: 'Good User', color: 'text-purple-400' };
    if (ratio >= 0.55) return { band: '6.5', title: 'Competent User', color: 'text-pink-400' };
    return { band: '6.0', title: 'Modest User', color: 'text-slate-400' };
  };

  // 1. Exam Setup Screen
  if (!examStarted && !submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="glass-card rounded-3xl p-6 md:p-10 border border-cyan-500/30 text-center">
          
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-xl glow-cyan">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-black text-white mb-2">IELTS Grand Mock Exam Setup</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-8">
            Select your desired exam length to evaluate your listening spelling mastery under real IELTS conditions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { count: 40, label: 'Standard IELTS', desc: '40 Questions (1 Test)' },
              { count: 100, label: 'Express Drill', desc: '100 High-Yield Words' },
              { count: 500, label: 'Half Marathon', desc: '500 Core Words' },
              { count: 1200, label: 'All 1200 Words', desc: 'Complete 1200 Grand Test' },
            ].map((option) => (
              <button
                key={option.count}
                onClick={() => {
                  setExamLength(option.count);
                  initExam(option.count);
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  examLength === option.count
                    ? 'bg-slate-800 border-cyan-400 shadow-lg glow-cyan scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  examLength === option.count ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {option.count} WORDS
                </span>
                <h3 className="text-sm font-bold text-white mt-2 mb-0.5">{option.label}</h3>
                <p className="text-[10px] text-slate-400">{option.desc}</p>
              </button>
            ))}
          </div>

          <button
            onClick={startExam}
            className="px-10 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-black text-base rounded-2xl shadow-xl transition-all glow-cyan"
          >
            Start {examWords.length}-Word Exam Now
          </button>

        </div>
      </div>
    );
  }

  // 2. Exam Summary Results Screen
  if (submitted) {
    let score = 0;
    examWords.forEach((w) => {
      const userAns = answers[w.id] || '';
      if (normalizeWord(userAns) === normalizeWord(w.word)) {
        score++;
      }
    });

    const result = calculateGrandBand(score, examWords.length);
    const percentage = examWords.length > 0 ? Math.round((score / examWords.length) * 100) : 0;

    const displayedBreakdown = filterIncorrectOnly 
      ? examWords.filter((w) => normalizeWord(answers[w.id] || '') !== normalizeWord(w.word))
      : examWords;

    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="glass-card rounded-3xl p-6 md:p-10 border border-emerald-500/40 text-center">
          
          <Award className="w-16 h-16 text-emerald-400 mx-auto mb-2 animate-pulse" />
          <h2 className="text-2xl font-black text-white mb-1">
            {examWords.length === 1200 ? '1200-Word Grand Marathon Results' : `${examWords.length}-Question Mock Exam Results`}
          </h2>
          <p className="text-xs text-slate-400 mb-6">Comprehensive IELTS Listening Evaluation</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 block font-semibold">Total Score</span>
              <span className="text-3xl font-black text-cyan-400 font-mono">{score} / {examWords.length}</span>
              <span className="text-[10px] text-slate-500 block">Accuracy: {percentage}%</span>
            </div>

            <div className="p-4 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-500/40">
              <span className="text-xs text-emerald-300 block font-semibold">Estimated IELTS Band</span>
              <span className={`text-3xl font-black font-mono ${result.color}`}>Band {result.band}</span>
              <span className="text-[10px] text-emerald-300 block font-medium">{result.title}</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 block font-semibold">Misspelled Words</span>
              <span className="text-3xl font-black text-rose-400 font-mono">{examWords.length - score}</span>
              <span className="text-[10px] text-rose-300 block">Review in Breakdown below</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3 text-left">
            <h3 className="text-sm font-bold text-slate-200">
              Detailed Answer Breakdown ({displayedBreakdown.length} words)
            </h3>
            <button
              onClick={() => setFilterIncorrectOnly(!filterIncorrectOnly)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                filterIncorrectOnly ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {filterIncorrectOnly ? 'Showing Misspelled Only' : 'Show Only Misspelled'}
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto border border-slate-800 rounded-2xl p-2 bg-slate-950/70 text-left text-xs space-y-1.5 mb-8">
            {displayedBreakdown.map((w, idx) => {
              const userAns = answers[w.id] || '';
              const isCorrect = normalizeWord(userAns) === normalizeWord(w.word);
              const qNumber = examWords.findIndex(item => item.id === w.id) + 1;

              return (
                <div key={w.id} className={`p-3 rounded-xl border flex items-center justify-between ${
                  isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/30 border-rose-500/40'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-500 font-bold min-w-[45px]">Q{qNumber}.</span>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    <div>
                      <span className="font-extrabold text-white text-sm font-mono">{w.word}</span>
                      <span className="text-[10px] text-slate-400 block">{w.category}</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className={`text-xs ${isCorrect ? 'text-emerald-300 font-bold' : 'text-rose-300 line-through'}`}>
                      {userAns || '(blank)'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setExamStarted(false)}
            className="px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm rounded-xl transition-all flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> Choose New Exam Mode
          </button>

        </div>
      </div>
    );
  }

  // 3. Active Exam Question Screen
  const answeredCount = Object.keys(answers).length;
  const progressPct = examWords.length > 0 ? Math.round(((currentIndex + 1) / examWords.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-cyan-500/30 relative">
        
        {/* Exam Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-cyan-500 text-slate-950 font-black text-xs rounded-lg font-mono">
              Q {currentIndex + 1} / {examWords.length}
            </span>
            <span className="text-xs text-slate-300 font-semibold">{currentWord?.category}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">Answered: {answeredCount} / {examWords.length}</span>
            <button
              onClick={() => setSubmitted(true)}
              className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold rounded-lg border border-rose-500/40"
            >
              Finish Exam Early
            </button>
          </div>
        </div>

        {/* Global Exam Progress Bar */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-6 border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Audio Player */}
        <div className="text-center py-6">
          <button
            type="button"
            onClick={() => speakWord(currentWord?.word, { accent })}
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 hover:scale-105 active:scale-95 text-white flex items-center justify-center mx-auto mb-4 shadow-xl glow-cyan transition-all group"
          >
            <Volume2 className="w-10 h-10 group-hover:animate-pulse" />
          </button>
          
          <p className="text-xs text-slate-400 mb-6">
            Question {currentIndex + 1} of {examWords.length} — Press <kbd className="kbd-key">Space</kbd> or click to re-listen
          </p>

          <form onSubmit={handleNext} className="max-w-md mx-auto">
            {/* Input with strict prediction & autocorrect disabled */}
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter exact IELTS spelling..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              className="w-full px-5 py-4 rounded-2xl bg-slate-900 border border-slate-700 text-center text-xl font-bold text-white font-mono focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 mb-4"
              autoFocus
            />

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl disabled:opacity-30 border border-slate-700"
              >
                Previous
              </button>

              <button
                type="submit"
                className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                {currentIndex === examWords.length - 1 ? 'Submit Complete Exam' : 'Next Question'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
