import { Choice, Winner } from '../types';
import { WIN_CONDITION } from '../config/constants';

export function determineWinner(
  player1Choice: Choice,
  player2Choice: Choice
): Winner {
  if (player1Choice === player2Choice) {
    return 'draw';
  }

  return WIN_CONDITION[player1Choice] === player2Choice ? 'player1' : 'player2';
}

export function getRandomChoice(): Choice {
  const choices: Choice[] = ['rock', 'paper', 'scissors'];
  return choices[Math.floor(Math.random() * choices.length)];
}

export function calculateWinRate(wins: number, totalGames: number): number {
  if (totalGames === 0) return 0;
  return Math.round((wins / totalGames) * 100);
}

export function calculatePayout(
  betAmount: number,
  prediction: string,
  odds: { player1: number; player2: number; draw: number }
): number {
  const multiplier = odds[prediction as keyof typeof odds] || 2;
  return Math.floor(betAmount * multiplier);
}
