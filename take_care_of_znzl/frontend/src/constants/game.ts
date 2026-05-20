export const MAX_EXP_PER_LEVEL = 100;
export const MAX_DAILY_ENERGY = 3;
export const STICKER_UNLOCK_LEVEL = 10;
export const ACTIVITY_GIF_DURATION_MS = 3000;
export const CHARACTER_REACTION_INTERVAL_MS = 5000;
export const SPEECH_BUBBLE_DURATION_MS = 2500;

/** 추후 행동별 GIF 연동 예정 — 현재는 기본.gif만 사용 */
export const CHARACTER_REACTIONS = [
  'idle',
  'walk',
  'cute',
  'angry',
  'yawn',
] as const;

export type CharacterReaction = (typeof CHARACTER_REACTIONS)[number];

export const CLICK_QUOTES = [
  '오늘도 놀아줄 거야?',
  '스티커 받고 싶어!',
  '졸려...',
  '배고파~',
  '좋아해!',
  '심심해...',
] as const;

export const CHZZK_URL = 'https://chzzk.naver.com';
