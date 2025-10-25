export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function isValidBetAmount(
  amount: number,
  userPoints: number,
  minBet: number,
  maxBet: number
): { valid: boolean; error?: string } {
  if (amount < minBet) {
    return { valid: false, error: `최소 베팅 금액은 ${minBet} 포인트입니다.` };
  }

  if (amount > maxBet) {
    return { valid: false, error: `최대 베팅 금액은 ${maxBet} 포인트입니다.` };
  }

  if (amount > userPoints) {
    return { valid: false, error: '포인트가 부족합니다.' };
  }

  return { valid: true };
}

export function isValidDisplayName(name: string): boolean {
  return name.length >= 2 && name.length <= 20;
}
