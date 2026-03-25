import { Language } from '../data/translations';

export interface Word {
  id: string;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'all';

export interface GameState {
  language: Language;
  setLanguage: (lang: Language) => void;
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  words: Word[];
  activeIndex: number;
  score: number;
  timeLeft: number;
  status: 'IDLE' | 'PLAYING' | 'FINISHED';
  correctWords: Word[];
  skippedWords: Word[];
  rank: string;
  vAge: number;
  startGame: (words: Word[]) => void;
  endGame: () => void;
  tick: (delta: number) => void;
  swipeUp: () => void;
  swipeDown: () => void;
  resetGame: () => void;
}
