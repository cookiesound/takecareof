import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { supabase } from '../config/supabase';
import type { UserRow } from '../types/database';

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const token = header.slice(7);
    const payload = verifyToken(token);

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', payload.userId)
      .single();

    if (error || !data) {
      res.status(401).json({ message: '유효하지 않은 사용자입니다.' });
      return;
    }

    const user = data as UserRow;
    if (user.token !== token) {
      res.status(401).json({ message: '세션이 만료되었습니다. 다시 로그인해주세요.' });
      return;
    }

    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
  }
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: '관리자 권한이 필요합니다.' });
    return;
  }
  next();
}
