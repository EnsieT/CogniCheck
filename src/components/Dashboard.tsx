import React, { useState } from 'react';
import { ScoreEntry } from '../types';
import { getBaseline, setBaseline } from '../store';
import { Play, Activity, TrendingUp, Settings2, BrainCircuit } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

interface Props {
  onStart: () => void;
  scores: ScoreEntry[];
}

export function Dashboard({ onStart, scores }: Props) {
  const [baseline, setLocalBaseline] = useState(getBaseline());
  const [showSettings, setShowSettings] = useState(false);

  const handleSaveBaseline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 120;
    setLocalBaseline(val);
    setBaseline(val);
  };

  const chartData = scores.slice(-10).map((s, i) => ({
    name: new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: s.score,
    index: Math.round((s.correctAnswers / 25) * 120)
  }));

  const lastTest = scores.length > 0 ? chartData[chartData.length - 1] : null;
  const isOptimal = lastTest ? lastTest.index >= baseline * 0.9 : true;

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* Main Hero Card */}
      <div className="md:col-span-8 bg-[#1E2336]/60 border border-white/5 rounded-[2rem] p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BrainCircuit className="w-48 h-48" />
        </div>
        
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">CogniCheck</h1>
          <p className="text-slate-400 text-lg max-w-md">
            Measure your mental agility. Detect cognitive fatigue before you make crucial decisions.
          </p>
        </div>
        
        <div className="mt-12 flex gap-4">
          <button 
            onClick={onStart}
            className="flex items-center gap-3 bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-indigo-500/25 active:scale-95"
          >
            <Play fill="currentColor" className="w-5 h-5" />
            Start 60s Test
          </button>
        </div>
      </div>

      {/* Status & Settings Cube */}
      <div className="md:col-span-4 flex flex-col gap-6">
        <div className="bg-[#1E2336]/60 border border-white/5 rounded-[2rem] p-6 shadow-2xl backdrop-blur-xl relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" /> Current State
            </h3>
          </div>
          
          {lastTest ? (
            <div>
              <div className="text-5xl font-bold font-mono text-white mb-2">{lastTest.index}</div>
              <p className="text-sm font-medium text-slate-400 mb-1">Agility Index</p>
              {isOptimal ? (
                 <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-semibold border border-emerald-500/20">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Sharp
                 </span>
              ) : (
                 <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-amber-500/10 text-amber-500 text-sm font-semibold border border-amber-500/20">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Fatigued
                 </span>
              )}
            </div>
          ) : (
            <div className="text-slate-400 text-sm">Take a test to see your baseline state.</div>
          )}
        </div>

        <div className="bg-[#1E2336]/60 border border-white/5 rounded-[2rem] p-6 shadow-2xl backdrop-blur-xl flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex flex-row items-center gap-2">
              <Settings2 className="w-4 h-4 text-slate-400" /> Settings
            </h3>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Baseline Target (Index)</label>
            <input 
              type="number"
              value={baseline}
              onChange={handleSaveBaseline}
              className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* History Chart */}
      {scores.length > 0 && (
        <div className="md:col-span-12 bg-[#1E2336]/60 border border-white/5 rounded-[2rem] p-8 shadow-2xl backdrop-blur-xl">
          <h3 className="text-white font-semibold flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-indigo-400" /> History
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <YAxis domain={['auto', 'auto']} stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E2336', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#818CF8' }}
                  labelStyle={{ color: '#94A3B8' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="index" 
                  stroke="#818CF8" 
                  strokeWidth={3}
                  dot={{ fill: '#1E2336', stroke: '#818CF8', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#818CF8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
