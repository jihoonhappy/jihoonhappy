export type Choice = 'rock' | 'paper' | 'scissors';
export type GameType = 'pvp' | 'pvc' | 'cvc';
export type GameStatus = 'waiting' | 'in_progress' | 'completed';
export type Winner = 'player1' | 'player2' | 'draw' | null;

export interface Player {
  userId: string;
  displayName?: string;
  choice: Choice | null;
  isBot: boolean;
  score?: number;
}

export interface GameResult {
  winner: Winner;
  player1Choice: Choice;
  player2Choice: Choice;
  round: number;
}

export interface Game {
  id: string;
  gameType: GameType;
  status: GameStatus;
  players: {
    player1: Player;
    player2: Player;
  };
  result: GameResult | null;
  round: number;
  maxRounds: number;
  scores?: {
    player1: number;
    player2: number;
  };
  createdAt: Date;
  completedAt: Date | null;
}

export interface PvCGame extends Game {
  gameType: 'pvc';
}

export interface PvPGame extends Game {
  gameType: 'pvp';
}

export interface CvCGame extends Game {
  gameType: 'cvc';
  bettingEndsAt: Date;
  totalBets: number;
  odds: {
    player1: number;
    player2: number;
    draw: number;
  };
}
