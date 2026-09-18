import React from 'react';
import { Calendar, CheckCircle2, ChevronRight, Zap, Target } from 'lucide-react';

const DAYS_META = [
  {
    day: 1,
    title: "Day 1: Academic & Finance",
    desc: "Days, Months, Money Matters, College Life & Subjects",
    categories: ["Days of the week", "Months of the year", "Money matters", "Subjects", "Studying at college/university"]
  },
  {
    day: 2,
    title: "Day 2: Science & Nature",
    desc: "Environment, Animal Kingdom, Plants, Continents & Countries",
    categories: ["Nature", "The environment", "The animal kingdom", "Plants", "Continents", "Countries", "Architecture and buildings"]
  },
  {
    day: 3,
    title: "Day 3: Descriptors & Leisure",
    desc: "Rating, Verbs, Adjectives, Hobbies, Sports & Touring",
    categories: ["Rating and qualities", "Touring", "Verbs", "Adjectives", "Hobbies", "Sports"]
  },
  {
    day: 4,
    title: "Day 4: City, Work & Tech",
    desc: "City Places, Workplaces, Equipment, Arts & Materials",
    categories: ["In the city", "Workplaces", "Shapes", "Measurement", "Transportations", "Vehicles", "Weather", "Equipment and tools"]
  },
  {
    day: 5,
    title: "Day 5: Jobs & High-Trap Review",
    desc: "Occupations, Expressions, Time & Double-Letter Traps",
    categories: ["Works and jobs", "Color/Colour", "Expressions and time", "Other", "Double-Letter Traps"]
  }
];

export default function DaySelector({ selectedDay, setSelectedDay, wordsByDay, masteredWordsSet }) {
  return (
    <div className="mb-8 max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" /> 5-Day Accelerated IELTS Study Plan
          </h2>
          <p className="text-xs text-slate-400">Select your current day to focus on 240 high-yield target words</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {DAYS_META.map((meta) => {
          const dayWords = wordsByDay[meta.day] || [];
          const masteredInDay = dayWords.filter(w => masteredWordsSet.has(w.id)).length;
          const dayTotal = dayWords.length || 240;
          const pct = Math.round((masteredInDay / dayTotal) * 100);
          const isSelected = selectedDay === meta.day;
          const isCompleted = masteredInDay === dayTotal && dayTotal > 0;

          return (
            <button
              key={meta.day}
              onClick={() => setSelectedDay(meta.day)}
              className={`relative text-left p-4 rounded-2xl transition-all duration-200 border ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500 shadow-lg glow-cyan scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'
                }`}>
                  DAY {meta.day}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-xs font-mono font-semibold text-slate-400">{masteredInDay}/{dayTotal}</span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{meta.title.split(': ')[1]}</h3>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mb-3">{meta.desc}</p>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isCompleted ? 'bg-emerald-400' : isSelected ? 'bg-cyan-400' : 'bg-purple-500/80'
                  }`}
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
