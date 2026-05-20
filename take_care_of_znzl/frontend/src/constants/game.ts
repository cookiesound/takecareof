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
  '심심해',
  '피곤해...',
  '그거 알아?',
  '스티커 30개면 소원이..!',
  '안녕?',
  '뭐해?',
  '노래 불러줄까?',
  '노래 불러줘',
  '오늘 날씨 어때?',
  '고기 먹고 싶다',
  '내일은 뭐해?',
  '오늘 뭐했어?',
  '기다렸어',

] as const;

export const CHZZK_URL =
  'https://chzzk.naver.com/f8f9c0d0029b58c79eb6070ff501cac1';
