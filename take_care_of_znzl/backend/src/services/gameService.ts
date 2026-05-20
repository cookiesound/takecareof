import { supabase } from '../config/supabase';
import type { UserRow } from '../types/database';
import {
  applyExp,
  randomActivity,
  randomActivityExp,
  STICKER_UNLOCK_LEVEL,
} from '../utils/game';
import { toPublicUser } from '../utils/userMapper';
import { findUserById, refreshUserEnergy } from './userService';
import { AppError } from '../middleware/errorHandler';
import type { ActivityResult, PublicUser } from '../types/api';

export async function getGameState(userId: string): Promise<PublicUser> {
  const user = await findUserById(userId);
  if (!user) {
    throw new AppError(404, '사용자를 찾을 수 없습니다.');
  }
  const refreshed = await refreshUserEnergy(user);
  return toPublicUser(refreshed);
}

export async function performActivity(userId: string): Promise<ActivityResult> {
  let user = await findUserById(userId);
  if (!user) {
    throw new AppError(404, '사용자를 찾을 수 없습니다.');
  }

  user = await refreshUserEnergy(user);

  if (user.energy <= 0) {
    throw new AppError(400, '활동력이 부족합니다. 내일 다시 시도해주세요.');
  }

  const activityName = randomActivity();
  const gainedExp = randomActivityExp();
  const previousLevel = user.level;
  const { level, exp } = applyExp(user.level, user.exp, gainedExp);

  const { data: updated, error } = await supabase
    .from('users')
    .update({
      energy: user.energy - 1,
      level,
      exp,
    })
    .eq('id', userId)
    .select('*')
    .single();

  if (error || !updated) {
    throw new AppError(500, '활동 처리에 실패했습니다.');
  }

  await supabase.from('activity_logs').insert({
    user_id: userId,
    activity_name: activityName,
    gained_exp: gainedExp,
  });

  return {
    activityName,
    gainedExp,
    user: toPublicUser(updated as UserRow),
    leveledUp: level > previousLevel,
    previousLevel,
  };
}

export async function requestSticker(userId: string): Promise<PublicUser> {
  let user = await findUserById(userId);
  if (!user) {
    throw new AppError(404, '사용자를 찾을 수 없습니다.');
  }

  user = await refreshUserEnergy(user);

  if (user.level < STICKER_UNLOCK_LEVEL) {
    throw new AppError(400, `스티커 신청은 레벨 ${STICKER_UNLOCK_LEVEL} 이상부터 가능합니다.`);
  }

  if (user.is_sticker_requesting) {
    throw new AppError(400, '이미 스티커 신청 중입니다.');
  }

  const { data: updated, error } = await supabase
    .from('users')
    .update({
      is_sticker_requesting: true,
      sticker_request_count: user.sticker_request_count + 1,
      level: 0,
      exp: 0,
    })
    .eq('id', userId)
    .select('*')
    .single();

  if (error || !updated) {
    throw new AppError(500, '스티커 신청에 실패했습니다.');
  }

  await supabase.from('sticker_request_logs').insert({
    user_id: userId,
    status: 'pending',
  });

  return toPublicUser(updated as UserRow);
}
