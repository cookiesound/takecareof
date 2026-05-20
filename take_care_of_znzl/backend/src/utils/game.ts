export const MAX_EXP_PER_LEVEL = 100;
export const MAX_DAILY_ENERGY = 3;
export const STICKER_UNLOCK_LEVEL = 10;
export const MIN_ACTIVITY_EXP = 20;
export const MAX_ACTIVITY_EXP = 50;

export const ACTIVITY_NAMES = [
  '산책',
  '수면',
  '게임',
  '독서',
  '영화',
  '노래',
] as const;

export type ActivityName = (typeof ACTIVITY_NAMES)[number];

export function randomActivity(): ActivityName {
  const index = Math.floor(Math.random() * ACTIVITY_NAMES.length);
  return ACTIVITY_NAMES[index];
}

export function randomActivityExp(): number {
  return (
    Math.floor(Math.random() * (MAX_ACTIVITY_EXP - MIN_ACTIVITY_EXP + 1)) +
    MIN_ACTIVITY_EXP
  );
}

export interface LevelState {
  level: number;
  exp: number;
}

export function applyExp(level: number, exp: number, gained: number): LevelState {
  let newLevel = level;
  let newExp = exp + gained;

  while (newExp >= MAX_EXP_PER_LEVEL) {
    newExp -= MAX_EXP_PER_LEVEL;
    newLevel += 1;
  }

  return { level: newLevel, exp: newExp };
}

export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function normalizeEnergy(
  energy: number,
  lastResetDate: string
): { energy: number; lastEnergyResetDate: string } {
  const today = getTodayDateString();
  if (lastResetDate !== today) {
    return { energy: MAX_DAILY_ENERGY, lastEnergyResetDate: today };
  }
  return { energy, lastEnergyResetDate: lastResetDate };
}
