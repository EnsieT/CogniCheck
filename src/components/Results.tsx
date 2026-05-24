import { motion } from 'motion/react';
import { ScoreEntry } from '../types';
import { getBaseline } from '../store';
import { ArrowLeft, RefreshCw, Activity, Brain } from 'lucide-react';

interface Props {
  score: Pick<ScoreEntry, 'score' | 'totalQuestions' | 'correctAnswers' | 'accuracy'>;
  onHome: () => void;
  onRetry: () => void;
}

export function Results({ score, onHome, onRetry }: Props) {
  const baseline = getBaseline();
  // Simple heuristic: Map typical max 1min score (e.g. 25-30) to an agility index, scaling around 120
  const agilityIndex = Math.round((score.correctAnswers / 25) * 120);
  const isOptimal = agilityIndex >= baseline * 0.9; 
  const isFatigued = agilityIndex < baseline * 0.7;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto flex flex-col p-8 bg-[#1E2336]/60 border border-white/5 rounded-[2rem] shadow-2xl backdrop-blur-xl text-center"
    >
      <div className="mb-6 flex justify-center">
        <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/30 text-indigo-400">
          <Activity className="w-10 h-10" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Test Complete</h2>
      
      {isFatigued ? (
        <p className="text-rose-400 mb-8 font-medium">Cognitive load detected. You might be fatigued.</p>
      ) : isOptimal ? (
        <p className="text-emerald-400 mb-8 font-medium">Optimal cognitive state. You're sharp!</p>
      ) : (
        <p className="text-amber-400 mb-8 font-medium">Slightly below baseline. Consider resting.</p>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-black/20 p-4 rounded-2xl flex flex-col items-center">
          <span className="text-4xl font-mono font-bold text-white mb-1">{score.correctAnswers}</span>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Correct</span>
        </div>
        <div className="bg-black/20 p-4 rounded-2xl flex flex-col items-center">
          <span className="text-4xl font-mono font-bold text-white mb-1">{score.accuracy}%</span>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Accuracy</span>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 mb-8 text-left flex items-start gap-4">
        <Brain className="w-8 h-8 text-indigo-400 flex-shrink-0" />
        <div>
          <h3 className="text-white font-semibold mb-1">Agility Index: {agilityIndex}</h3>
          <p className="text-sm text-slate-400">
            Based on your speed and accuracy. Your established baseline is {baseline}.
          </p>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button 
          onClick={onHome}
          className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Home
        </button>
        <button 
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/25"
        >
          <RefreshCw className="w-5 h-5" /> Retest
        </button>
      </div>
    </motion.div>
  );
}
