import type { Request, Response, NextFunction } from 'express';
import * as gameService from '../services/gameService';

export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await gameService.getGameState(req.user!.userId);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function activity(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await gameService.performActivity(req.user!.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function stickerRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await gameService.requestSticker(req.user!.userId);
    res.json({ user, message: '스티커 신청이 완료되었습니다.' });
  } catch (err) {
    next(err);
  }
}
