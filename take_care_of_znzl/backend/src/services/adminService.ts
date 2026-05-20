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

export async function deleteUsers(
  userIds: string[],
  adminId: string
): Promise<{ deletedCount: number }> {
  let deletedCount = 0;

  for (const userId of userIds) {
    if (userId === adminId) {
      throw new AppError(400, '본인 계정은 삭제할 수 없습니다.');
    }

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', userId)
      .maybeSingle();

    if (fetchError) {
      throw new AppError(500, '사용자 조회에 실패했습니다.');
    }

    if (!user) {
      continue;
    }

    const row = user as Pick<UserRow, 'id' | 'role'>;
    if (row.role === 'admin') {
      throw new AppError(400, '관리자 계정은 삭제할 수 없습니다.');
    }

    await supabase
      .from('sticker_request_logs')
      .update({ completed_by: null })
      .eq('completed_by', userId);

    const { error: deleteError } = await supabase.from('users').delete().eq('id', userId);

    if (deleteError) {
      throw new AppError(500, '사용자 삭제에 실패했습니다.');
    }

    deletedCount += 1;
  }

  return { deletedCount };
}
