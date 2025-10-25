import { create } from 'zustand';
import { UserStats } from '../types';

interface UserState {
  points: number;
  stats: UserStats;
  updatePoints: (points: number) => void;
  updateStats: (stats: UserStats) => void;
  addPoints: (amount: number) => void;
  subtractPoints: (amount: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  points: 0,
  stats: {
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
  },

  updatePoints: (points) =>
    set({ points }),

  updateStats: (stats) =>
    set({ stats }),

  addPoints: (amount) =>
    set((state) => ({ points: state.points + amount })),

  subtractPoints: (amount) =>
    set((state) => ({ points: state.points - amount })),
}));
