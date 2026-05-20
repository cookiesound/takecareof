import { supabase } from '../config/supabase';
import type { UserRow } from '../types/database';
import { normalizeEnergy } from '../utils/game';
import { AppError } from '../middleware/errorHandler';

export async function findUserByNickname(nickname: string): Promise<UserRow | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('nickname', nickname)
    .maybeSingle();

  if (error) {
    throw new AppError(500, '사용자 조회에 실패했습니다.');
  }

  return data as UserRow | null;
}

export async function findUserById(id: string): Promise<UserRow | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new AppError(500, '사용자 조회에 실패했습니다.');
  }

  return data as UserRow | null;
}

export async function refreshUserEnergy(user: UserRow): Promise<UserRow> {
  const normalized = normalizeEnergy(user.energy, user.last_energy_reset_date);

  if (
    normalized.energy === user.energy &&
    normalized.lastEnergyResetDate === user.last_energy_reset_date
  ) {
    return user;
  }

  const { data, error } = await supabase
    .from('users')
    .update({
      energy: normalized.energy,
      last_energy_reset_date: normalized.lastEnergyResetDate,
    })
    .eq('id', user.id)
    .select('*')
    .single();

  if (error || !data) {
    throw new AppError(500, '활동력 갱신에 실패했습니다.');
  }

  return data as UserRow;
}

export async function updateUserToken(
  userId: string,
  token: string | null
): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ token })
    .eq('id', userId);

  if (error) {
    throw new AppError(500, '토큰 업데이트에 실패했습니다.');
  }
}
