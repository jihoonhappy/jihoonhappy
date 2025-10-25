import { create } from 'zustand';
import { Game, Choice } from '../types';

interface GameState {
  currentGame: Game | null;
  isMatchmaking: boolean;
  selectedChoice: Choice | null;
  error: string | null;

  setCurrentGame: (game: Game | null) => void;
  setMatchmaking: (isMatchmaking: boolean) => void;
  setSelectedChoice: (choice: Choice | null) => void;
  setError: (error: string | null) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentGame: null,
  isMatchmaking: false,
  selectedChoice: null,
  error: null,

  setCurrentGame: (game) =>
    set({ currentGame: game, error: null }),

  setMatchmaking: (isMatchmaking) =>
    set({ isMatchmaking }),

  setSelectedChoice: (choice) =>
    set({ selectedChoice: choice }),

  setError: (error) =>
    set({ error }),

  resetGame: () =>
    set({
      currentGame: null,
      isMatchmaking: false,
      selectedChoice: null,
      error: null,
    }),
}));
