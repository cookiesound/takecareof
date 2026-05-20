import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase';
import type { UserRow } from '../types/database';
import { signToken } from '../utils/jwt';
import { toPublicUser } from '../utils/userMapper';
import {
  findUserByNickname,
  findUserById,
  updateUserToken,
  refreshUserEnergy,
} from './userService';
import { AppError } from '../middleware/errorHandler';
import type { AuthResponse } from '../types/api';

const SALT_ROUNDS = 10;

export async function registerUser(
  nickname: string,
  password: string
): Promise<void> {
  const trimmed = nickname.trim();
  if (!trimmed || trimmed.length < 2) {
    throw new AppError(400, '닉네임은 2자 이상이어야 합니다.');
  }
  if (password.length < 4) {
    throw new AppError(400, '비밀번호는 4자 이상이어야 합니다.');
  }

  const existing = await findUserByNickname(trimmed);
  if (existing) {
    throw new AppError(409, '이미 사용 중인 닉네임입니다.');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const { error } = await supabase.from('users').insert({
    nickname: trimmed,
    password_hash: passwordHash,
    role: 'user',
    token: null,
    level: 0,
    exp: 0,
    energy: 3,
    last_energy_reset_date: new Date().toISOString().slice(0, 10),
    sticker_request_count: 0,
    is_sticker_requesting: false,
  });

  if (error) {
    throw new AppError(500, '회원가입에 실패했습니다.');
  }
}

export async function loginUser(
  nickname: string,
  password: string
): Promise<AuthResponse> {
  const user = await findUserByNickname(nickname.trim());
  if (!user) {
    throw new AppError(401, '닉네임 또는 비밀번호가 올바르지 않습니다.');
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new AppError(401, '닉네임 또는 비밀번호가 올바르지 않습니다.');
  }

  const refreshed = await refreshUserEnergy(user);
  const token = signToken({
    userId: refreshed.id,
    nickname: refreshed.nickname,
    role: refreshed.role,
  });

  await updateUserToken(refreshed.id, token);

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', refreshed.id)
    .single();

  return {
    token,
    user: toPublicUser((data ?? refreshed) as UserRow),
  };
}

export async function getMe(userId: string): Promise<AuthResponse['user']> {
  const user = await findUserById(userId);
  if (!user) {
    throw new AppError(404, '사용자를 찾을 수 없습니다.');
  }
  const refreshed = await refreshUserEnergy(user);
  return toPublicUser(refreshed);
}

export async function logoutUser(userId: string): Promise<void> {
  await updateUserToken(userId, null);
}
