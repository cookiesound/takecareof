import type { PublicUser } from '@/types/user';

/** 개발용 목 데이터 (API 없이 UI 테스트 시 사용) */
export const MOCK_USER: PublicUser = {
  id: 'mock-id',
  nickname: '테스트유저',
  role: 'user',
  level: 5,
  exp: 45,
  energy: 2,
  stickerRequestCount: 0,
  isStickerRequesting: false,
};
