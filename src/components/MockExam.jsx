import React, { useState, useEffect } from 'react';
import { FileCheck, Volume2, ArrowRight, Award, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakWord } from '../utils/speech';

export default function MockExam({ words, accent }) {
  const [examWords, setExamWords] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [userInput, setUserInput] = useState('');

  // Select 40 random words on start
  useEffect(() => {
    initExam();
  }, [words]);

  const initExam = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 40);
    setExamWords(selected);
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
    setUserInput('');
  };

  const currentWord = examWords[currentIndex];

  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (!currentWord) return;

    // Save answer
    setAnswers(prev => ({ ...prev, [currentIndex]: userInput.trim() }));

    if (currentIndex < examWords.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setUserInput(answers[nextIdx] || '');
      speakWord(examWords[nextIdx].word, { accent });
    } else {
      // Last question - complete exam
      setSubmitted(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  // Calculate Band Score based on IELTS official listening raw score standard
  const calculateBandScore = (score) => {
    if (score >= 39) return { band: '9.0', desc: 'Expert User' };
    if (score >= 37) return { band: '8.5', desc: 'Very Good User' };
    if (score >= 35) return { band: '8.0', desc: 'Very Good User' };
    if (score >= 32) return { band: '7.5', desc: 'Good User' };
    if (score >= 30) return { band: '7.0', desc: 'Good User' };
    if (score >= 26) return { band: '6.5', desc: 'Competent User' };
    if (score >= 23) return { band: '6.0', desc: 'Competent User' };
    if (score >= 18) return { band: '5.5', desc: 'Modest User' };
    return { band: '5.0', desc: 'Modest User' };
  };

  if (submitted) {
    let score = 0;
    examWords.forEach((w, idx) => {
      const userAns = (answers[idx] || '').trim().toLowerCase();
      if (userAns === w.word.toLowerCase()) score++;
    });

    const result = calculateBandScore(score);

    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="glass-card rounded-3xl p-6 md:p-10 border border-emerald-500/40 text-center">
          
          <Award className="w-16 h-16 text-emerald-400 mx-auto mb-2 animate-pulse" />
          <h2 className="text-2xl font-black text-white mb-1">IELTS Listening Mock Test Result</h2>
          <p className="text-xs text-slate-400 mb-6">40-Question Official IELTS Spelling Rules Evaluation</p>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 block font-semibold">Raw Score</span>
              <span className="text-3xl font-black text-cyan-400 font-mono">{score} / 40</span>
            </div>
            <div className="p-4 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-500/40">
              <span className="text-xs text-emerald-300 block font-semibold">Estimated IELTS Band</span>
              <span className="text-3xl font-black text-emerald-400 font-mono">Band {result.band}</span>
              <span className="text-[10px] text-emerald-300 block font-medium">{result.desc}</span>
            </div>
          </div>

          {/* Breakdown Table */}
          <h3 className="text-sm font-bold text-slate-300 mb-3 text-left">Answer Key & Breakdown</h3>
          <div className="max-h-80 overflow-y-auto border border-slate-800 rounded-2xl p-2 bg-slate-950/60 text-left text-xs space-y-1.5 mb-6">
            {examWords.map((w, idx) => {
              const userAns = answers[idx] || '';
              const isCorrect = userAns.toLowerCase() === w.word.toLowerCase();
              return (
                <div key={idx} className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 font-bold">Q{idx + 1}.</span>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    <span className="font-semibold text-white">{w.word}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className={`text-[11px] ${isCorrect ? 'text-emerald-300 font-bold' : 'text-rose-300 line-through'}`}>
                      {userAns || '(no answer)'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={initExam}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> Start New 40-Q Exam
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-cyan-500/30">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              IELTS Listening Mock Test - Question {currentIndex + 1} / 40
            </h3>
          </div>
          <button
            onClick={() => speakWord(currentWord?.word, { accent })}
            className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-semibold rounded-lg border border-cyan-500/30"
          >
            🔊 Play Audio
          </button>
        </div>

        {/* Audio Button */}
        <div className="text-center py-4">
          <button
            onClick={() => speakWord(currentWord?.word, { accent })}
            className="w-20 h-20 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-lg glow-cyan"
          >
            <Volume2 className="w-8 h-8" />
          </button>
          <p className="text-xs text-slate-400 mb-6">Click audio to listen to question {currentIndex + 1}</p>

          <form onSubmit={handleNext} className="max-w-sm mx-auto">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter exact IELTS spelling..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-center text-lg font-bold text-white font-mono focus:outline-none focus:border-cyan-400"
              autoFocus
            />

            <button
              type="submit"
              className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              {currentIndex === 39 ? 'Submit Final Exam' : 'Next Question'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
