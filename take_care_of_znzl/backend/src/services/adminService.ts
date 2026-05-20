import { supabase } from '../config/supabase';
import type { UserRow } from '../types/database';
import { toAdminUser } from '../utils/userMapper';
import { AppError } from '../middleware/errorHandler';
import type { AdminUserRow } from '../types/api';

export async function listUsers(): Promise<AdminUserRow[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new AppError(500, '사용자 목록 조회에 실패했습니다.');
  }

  return (data as UserRow[]).map(toAdminUser);
}

export async function completeStickerRequest(
  userId: string,
  adminId: string
): Promise<AdminUserRow> {
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (fetchError || !user) {
    throw new AppError(404, '사용자를 찾을 수 없습니다.');
  }

  const row = user as UserRow;
  if (!row.is_sticker_requesting) {
    throw new AppError(400, '스티커 신청 중인 사용자가 아닙니다.');
  }

  const completedAt = new Date().toISOString();

  const { data: updated, error: updateError } = await supabase
    .from('users')
    .update({ is_sticker_requesting: false })
    .eq('id', userId)
    .select('*')
    .single();

  if (updateError || !updated) {
    throw new AppError(500, '스티커 처리에 실패했습니다.');
  }

  await supabase
    .from('sticker_request_logs')
    .update({
      status: 'completed',
      completed_at: completedAt,
      completed_by: adminId,
    })
    .eq('user_id', userId)
    .eq('status', 'pending');

  return toAdminUser(updated as UserRow);
}
