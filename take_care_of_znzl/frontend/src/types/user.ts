export type UserRole = 'user' | 'admin';

export interface PublicUser {
  id: string;
  nickname: string;
  role: UserRole;
  level: number;
  exp: number;
  energy: number;
  stickerRequestCount: number;
  isStickerRequesting: boolean;
}

export interface AuthResponse {
  token: string;
  user: PublicUser;
}

export interface ActivityResult {
  activityName: string;
  gainedExp: number;
  user: PublicUser;
  leveledUp: boolean;
  previousLevel: number;
}

export interface AdminUserRow {
  id: string;
  nickname: string;
  token: string | null;
  level: number;
  exp: number;
  stickerRequestCount: number;
  isStickerRequesting: boolean;
}
