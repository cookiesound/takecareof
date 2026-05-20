import { apiClient } from './client';
import type { ActivityResult, PublicUser } from '@/types/user';

export async function fetchGameState(): Promise<PublicUser> {
  const { data } = await apiClient.get<{ user: PublicUser }>('/game/me');
  return data.user;
}

export async function performActivity(): Promise<ActivityResult> {
  const { data } = await apiClient.post<ActivityResult>('/game/activity');
  return data;
}

export async function requestSticker(): Promise<PublicUser> {
  const { data } = await apiClient.post<{ user: PublicUser }>(
    '/game/sticker-request'
  );
  return data.user;
}
