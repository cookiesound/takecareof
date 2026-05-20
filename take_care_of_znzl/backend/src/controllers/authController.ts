import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { nickname, password } = req.body as {
      nickname?: string;
      password?: string;
    };
    if (!nickname || !password) {
      res.status(400).json({ message: '닉네임과 비밀번호를 입력해주세요.' });
      return;
    }
    await authService.registerUser(nickname, password);
    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { nickname, password } = req.body as {
      nickname?: string;
      password?: string;
    };
    if (!nickname || !password) {
      res.status(400).json({ message: '닉네임과 비밀번호를 입력해주세요.' });
      return;
    }
    const result = await authService.loginUser(nickname, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function me(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await authService.getMe(req.user!.userId);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await authService.logoutUser(req.user!.userId);
    res.json({ message: '로그아웃되었습니다.' });
  } catch (err) {
    next(err);
  }
}
