import { apiClient } from './client';
import type { AdminUserRow } from '@/types/user';

export async function fetchAdminUsers(): Promise<AdminUserRow[]> {
  const { data } = await apiClient.get<{ users: AdminUserRow[] }>('/admin/users');
  return data.users;
}

export async function completeSticker(userId: string): Promise<AdminUserRow> {
  const { data } = await apiClient.post<{ user: AdminUserRow }>(
    '/admin/sticker-complete',
    { userId }
  );
  return data.user;
}

export async function deleteUsers(userIds: string[]): Promise<{ deletedCount: number }> {
  const { data } = await apiClient.post<{ deletedCount: number }>(
    '/admin/users/delete',
    { userIds }
  );
  return data;
}
