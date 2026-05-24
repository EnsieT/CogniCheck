import { ScoreEntry } from './types';

const STORAGE_KEY = 'cognicheck_scores';
const BASELINE_KEY = 'cognicheck_baseline';

export const getScores = (): ScoreEntry[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveScore = (score: ScoreEntry) => {
  const scores = getScores();
  scores.push(score);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
};

export const getBaseline = (): number => {
  const data = localStorage.getItem(BASELINE_KEY);
  return data ? parseFloat(data) : 120; // Default baseline 120 IQ concept
};

export const setBaseline = (value: number) => {
  localStorage.setItem(BASELINE_KEY, value.toString());
};
