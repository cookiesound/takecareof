import type { UserRow } from './database';

export interface AuthPayload {
  userId: string;
  nickname: string;
  role: UserRow['role'];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
