/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { GameState, ScoreEntry } from './types';
import { getScores, saveScore } from './store';
import { Dashboard } from './components/Dashboard';
import { TestRunner } from './components/TestRunner';
import { Results } from './components/Results';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('dashboard');
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [lastScore, setLastScore] = useState<ScoreEntry | null>(null);

  useEffect(() => {
    setScores(getScores());
  }, []);

  const handleComplete = (correct: number, total: number) => {
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const newScore: ScoreEntry = {
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString(),
      score: correct,
      totalQuestions: total,
      correctAnswers: correct,
      accuracy
    };
    
    saveScore(newScore);
    setScores(getScores());
    setLastScore(newScore);
    setGameState('results');
  };

  return (
    <div className="min-h-screen bg-[#0B0D14] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] font-sans selection:bg-indigo-500/30 flex items-center justify-center p-4 py-12 lg:py-24">
      <div className="w-full max-w-5xl">
        {gameState === 'dashboard' && (
          <Dashboard 
            scores={scores} 
            onStart={() => setGameState('playing')} 
          />
        )}
        
        {gameState === 'playing' && (
          <TestRunner 
            onComplete={handleComplete} 
          />
        )}
        
        {gameState === 'results' && lastScore && (
          <Results 
            score={lastScore} 
            onHome={() => setGameState('dashboard')}
            onRetry={() => setGameState('playing')}
          />
        )}
      </div>
    </div>
  );
}
