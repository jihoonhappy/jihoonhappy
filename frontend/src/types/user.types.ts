export interface UserStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate?: number;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  points: number;
  stats: UserStats;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
