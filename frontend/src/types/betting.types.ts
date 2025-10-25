export type BetPrediction = 'player1' | 'player2' | 'draw';
export type BetStatus = 'pending' | 'won' | 'lost';

export interface Bet {
  id: string;
  gameId: string;
  userId: string;
  prediction: BetPrediction;
  amount: number;
  potentialPayout: number;
  payout: number | null;
  status: BetStatus;
  createdAt: Date;
}

export interface BetWithGame extends Bet {
  game?: {
    result: any;
    status: string;
  };
}
