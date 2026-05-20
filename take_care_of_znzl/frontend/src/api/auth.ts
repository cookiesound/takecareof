import { apiClient } from './client';
import type { AuthResponse, PublicUser } from '@/types/user';

export async function register(
  nickname: string,
  password: string
): Promise<string> {
  const { data } = await apiClient.post<{ message: string }>('/auth/register', {
    nickname,
    password,
  });
  return data.message;
}

export async function login(
  nickname: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', {
    nickname,
    password,
  });
  return data;
}

export async function fetchMe(): Promise<PublicUser> {
  const { data } = await apiClient.get<{ user: PublicUser }>('/auth/me');
  return data.user;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}
