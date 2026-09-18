import React, { useState } from 'react';
import { X, Search, Volume2, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import { speakWord } from '../utils/speech';

export default function WordListModal({ isOpen, onClose, words, masteredSet, accent }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!isOpen) return null;

  // Filter words
  const filteredWords = words.filter(item => {
    const matchesSearch = item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDay = selectedDayFilter === 'all' || item.day === parseInt(selectedDayFilter, 10);
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesDay && matchesCat;
  });

  const categories = Array.from(new Set(words.map(w => w.category)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-extrabold text-white">Complete 1200 IELTS Word Index</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters & Search */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 1200 words or categories..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          <select
            value={selectedDayFilter}
            onChange={(e) => setSelectedDayFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Days (1-5)</option>
            <option value="1">Day 1 (Academic & Finance)</option>
            <option value="2">Day 2 (Science & Nature)</option>
            <option value="3">Day 3 (Descriptors & Leisure)</option>
            <option value="4">Day 4 (City, Work & Tech)</option>
            <option value="5">Day 5 (Jobs & High-Trap)</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none max-w-[200px]"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Word List Container */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {filteredWords.map((item) => {
            const isMastered = masteredSet.has(item.id);
            return (
              <div
                key={item.id}
                className="p-3 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/80 rounded-2xl flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => speakWord(item.word, { accent })}
                    className="w-9 h-9 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 flex items-center justify-center border border-cyan-500/30 transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm font-mono">{item.word}</span>
                      {isMastered && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 block">{item.category} • Day {item.day}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.hasDoubleLetters && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                      Double Ltr
                    </span>
                  )}
                  {item.spellingVariant && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-pink-500/20 text-pink-300 rounded border border-pink-500/30">
                      UK/US
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 text-xs text-slate-400 flex justify-between items-center font-mono">
          <span>Showing {filteredWords.length} of {words.length} words</span>
          <span>Click speaker icon to hear pronunciation</span>
        </div>

      </div>
    </div>
  );
}
