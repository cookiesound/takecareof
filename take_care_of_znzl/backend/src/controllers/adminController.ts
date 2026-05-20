import type { Request, Response, NextFunction } from 'express';
import * as adminService from '../services/adminService';

export async function listUsers(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await adminService.listUsers();
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

export async function completeSticker(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId } = req.body as { userId?: string };
    if (!userId) {
      res.status(400).json({ message: 'userId가 필요합니다.' });
      return;
    }
    const user = await adminService.completeStickerRequest(
      userId,
      req.user!.userId
    );
    res.json({ user, message: '스티커 신청 처리가 완료되었습니다.' });
  } catch (err) {
    next(err);
  }
}
