import api from "../utils/axios";
import { AuthRequest, AuthResponse, JWTPayload } from "../types";

export const authService = {
  // 관리자 로그인
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // JWT 토큰 검증
  verifyToken: (token: string): JWTPayload | null => {
    try {
      // 클라이언트 사이드에서는 토큰을 디코드만 하고 실제 검증은 서버에서 수행
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  },

  // 토큰 저장
  saveToken: (token: string): void => {
    localStorage.setItem("admin_token", token);
  },

  // 토큰 가져오기
  getToken: (): string | null => {
    return localStorage.getItem("admin_token");
  },

  // 토큰 삭제
  removeToken: (): void => {
    localStorage.removeItem("admin_token");
  },

  // 로그인 상태 확인
  isAuthenticated: (): boolean => {
    const token = authService.getToken();
    if (!token) return false;

    const payload = authService.verifyToken(token);
    if (!payload) return false;

    // 토큰 만료 확인
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime && payload.admin;
  },
};
