import { STORAGE_KEYS } from '@/constants/storage';

export function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function setToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
}

export function clearToken(): void {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
}
