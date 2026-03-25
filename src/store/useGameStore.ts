import { create } from 'zustand';
import { GameState, Word } from '../types';

const GAME_DURATION = 60; // seconds

const calculateRank = (score: number) => {
  let rank = 'kid';
  let vAge = 10;

  if (score > 30) {
    rank = 'king';
    vAge = 100;
  } else if (score > 20) {
    rank = 'doctor';
    vAge = 45;
  } else if (score > 10) {
    rank = 'student';
    vAge = 22;
  }

  return { rank, vAge };
};

export const useGameStore = create<GameState>((set) => ({
  language: 'ko',
  setLanguage: (lang) => set({ language: lang }),
  difficulty: 'all',
  setDifficulty: (diff) => set({ difficulty: diff }),
  words: [],
  activeIndex: 0,
  score: 0,
  timeLeft: GAME_DURATION,
  status: 'IDLE',
  correctWords: [],
  skippedWords: [],
  rank: '',
  vAge: 0,

  startGame: (words: Word[]) => set({
    words,
    activeIndex: 0,
    score: 0,
    timeLeft: GAME_DURATION,
    status: 'PLAYING',
    correctWords: [],
    skippedWords: [],
    rank: '',
    vAge: 0,
  }),

  endGame: () => set((state) => {
    const { rank, vAge } = calculateRank(state.score);
    return { status: 'FINISHED', rank, vAge };
  }),

  tick: (delta: number) => set((state) => {
    if (state.status !== 'PLAYING') return state;
    const newTime = Math.max(0, state.timeLeft - delta);
    if (newTime === 0) {
      const { rank, vAge } = calculateRank(state.score);
      return { timeLeft: 0, status: 'FINISHED', rank, vAge };
    }
    return { timeLeft: newTime };
  }),

  swipeUp: () => set((state) => {
    if (state.status !== 'PLAYING' || state.activeIndex >= state.words.length) return state;
    
    const newIndex = state.activeIndex + 1;
    const newScore = state.score + 1;
    const currentWord = state.words[state.activeIndex];
    
    if (newIndex >= state.words.length) {
      const { rank, vAge } = calculateRank(newScore);
      return {
        score: newScore,
        activeIndex: newIndex,
        correctWords: [...state.correctWords, currentWord],
        status: 'FINISHED',
        rank,
        vAge
      };
    }
    
    return {
      score: newScore,
      activeIndex: newIndex,
      correctWords: [...state.correctWords, currentWord],
    };
  }),

  swipeDown: () => set((state) => {
    if (state.status !== 'PLAYING' || state.activeIndex >= state.words.length) return state;
    
    const newIndex = state.activeIndex + 1;
    const currentWord = state.words[state.activeIndex];
    
    if (newIndex >= state.words.length) {
      const { rank, vAge } = calculateRank(state.score);
      return {
        activeIndex: newIndex,
        skippedWords: [...state.skippedWords, currentWord],
        status: 'FINISHED',
        rank,
        vAge
      };
    }
    
    return {
      activeIndex: newIndex,
      skippedWords: [...state.skippedWords, currentWord],
    };
  }),

  resetGame: () => set({
    words: [],
    activeIndex: 0,
    score: 0,
    timeLeft: GAME_DURATION,
    status: 'IDLE',
    correctWords: [],
    skippedWords: [],
    rank: '',
    vAge: 0,
  }),
}));
