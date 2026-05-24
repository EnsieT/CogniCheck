export type GameState = 'dashboard' | 'playing' | 'results';

export interface ScoreEntry {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}
