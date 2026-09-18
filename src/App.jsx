import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DaySelector from './components/DaySelector';
import ModeSelector from './components/ModeSelector';
import ListeningBeeGame from './components/ListeningBeeGame';
import SpeedRushGame from './components/SpeedRushGame';
import AnagramGame from './components/AnagramGame';
import MistakeVault from './components/MistakeVault';
import MockExam from './components/MockExam';
import WordListModal from './components/WordListModal';
import { initSpeech } from './utils/speech';
import ieltsWords from './data/ielts_words.json';

export default function App() {
  const [accent, setAccent] = useState('en-GB');
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeMode, setActiveMode] = useState('listening');
  const [isWordListOpen, setIsWordListOpen] = useState(false);
  const [streak, setStreak] = useState(0);

  // Persistent mastered words set
  const [masteredWordsSet, setMasteredWordsSet] = useState(() => {
    const saved = localStorage.getItem('ielts_mastered_words');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Persistent mistake vault
  const [mistakeWords, setMistakeWords] = useState(() => {
    const saved = localStorage.getItem('ielts_mistake_words');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    initSpeech();
  }, []);

  // Sync mastered words to localStorage
  useEffect(() => {
    localStorage.setItem('ielts_mastered_words', JSON.stringify(Array.from(masteredWordsSet)));
  }, [masteredWordsSet]);

  // Sync mistake words to localStorage
  useEffect(() => {
    localStorage.setItem('ielts_mistake_words', JSON.stringify(mistakeWords));
  }, [mistakeWords]);

  const handleMasterWord = (wordId) => {
    setMasteredWordsSet(prev => {
      const next = new Set(prev);
      next.add(wordId);
      return next;
    });
  };

  const handleMissWord = (wordObj) => {
    setMistakeWords(prev => {
      if (prev.some(w => w.id === wordObj.id)) return prev;
      return [wordObj, ...prev];
    });
  };

  const handleRemoveMistake = (wordId) => {
    setMistakeWords(prev => prev.filter(w => w.id !== wordId));
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset your 5-day progress and mastered words?")) {
      setMasteredWordsSet(new Set());
      setMistakeWords([]);
      setStreak(0);
      localStorage.removeItem('ielts_mastered_words');
      localStorage.removeItem('ielts_mistake_words');
    }
  };

  // Filter words by day
  const wordsByDay = {};
  for (let d = 1; d <= 5; d++) {
    wordsByDay[d] = ieltsWords.filter(w => w.day === d);
  }

  const currentDayWords = wordsByDay[selectedDay] || wordsByDay[1];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans pb-16">
      
      {/* Navbar Header */}
      <Header
        masteredCount={masteredWordsSet.size}
        totalWords={ieltsWords.length}
        streak={streak}
        accent={accent}
        setAccent={setAccent}
        onOpenWordList={() => setIsWordListOpen(true)}
        onResetProgress={handleResetProgress}
      />

      <main className="max-w-7xl mx-auto">
        
        {/* 5-Day Study Plan Tabs */}
        <DaySelector
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          wordsByDay={wordsByDay}
          masteredWordsSet={masteredWordsSet}
        />

        {/* Game Mode Tabs */}
        <ModeSelector
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          mistakeCount={mistakeWords.length}
        />

        {/* Game Active Area */}
        <div className="mt-4">
          {activeMode === 'listening' && (
            <ListeningBeeGame
              words={currentDayWords}
              masteredSet={masteredWordsSet}
              onMasterWord={handleMasterWord}
              onMissWord={handleMissWord}
              accent={accent}
              streak={streak}
              setStreak={setStreak}
            />
          )}

          {activeMode === 'speed' && (
            <SpeedRushGame
              words={currentDayWords}
              accent={accent}
              onMasterWord={handleMasterWord}
            />
          )}

          {activeMode === 'anagram' && (
            <AnagramGame
              words={currentDayWords}
              accent={accent}
              onMasterWord={handleMasterWord}
            />
          )}

          {activeMode === 'vault' && (
            <MistakeVault
              mistakeWords={mistakeWords}
              onRemoveMistake={handleRemoveMistake}
              accent={accent}
              onMasterWord={handleMasterWord}
            />
          )}

          {activeMode === 'mock' && (
            <MockExam
              words={ieltsWords}
              accent={accent}
            />
          )}
        </div>

      </main>

      {/* Word Index Search Modal */}
      <WordListModal
        isOpen={isWordListOpen}
        onClose={() => setIsWordListOpen(false)}
        words={ieltsWords}
        masteredSet={masteredWordsSet}
        accent={accent}
      />

    </div>
  );
}
