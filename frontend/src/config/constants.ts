export const INITIAL_POINTS = 1000;

export const POINTS_REWARD = {
  PVC_WIN: 10,
  PVP_WIN: 100,
  CVC_BET_MULTIPLIER: 2,
  CVC_DRAW_MULTIPLIER: 3,
} as const;

export const GAME_CONFIG = {
  PVC_DEFAULT_ROUNDS: 1,
  PVP_DEFAULT_ROUNDS: 3,
  CVC_BETTING_DURATION: 20000, // 20 seconds
  CVC_GAME_INTERVAL: 30000, // 30 seconds
  MIN_BET_AMOUNT: 10,
  MAX_BET_AMOUNT: 10000,
} as const;

export const CHOICE_EMOJI = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️',
} as const;

export const CHOICE_NAME = {
  rock: '바위',
  paper: '보',
  scissors: '가위',
} as const;

export const WIN_CONDITION = {
  rock: 'scissors',
  scissors: 'paper',
  paper: 'rock',
} as const;
