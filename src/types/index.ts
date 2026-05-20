export interface User {
  id: string;
  nickname: string;
  sticker_count: number;
  rank: number;
  has_wish?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  nickname: string;
  sticker_count?: number;
}

export interface UpdateUserRequest {
  nickname?: string;
  sticker_count?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}

export interface AuthRequest {
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export interface JWTPayload {
  admin: boolean;
  iat: number;
  exp: number;
}

export interface Wish {
  id: string;
  userId: string;
  user_id: string;
  nickname: string;
  content: string;
  created_at: string;
  isFulfilled: boolean;
}

export interface CreateWishRequest {
  userId: string;
  nickname: string;
  content: string;
}

export interface FulfillWishRequest {
  userId: string;
}

// 노래 관련 타입들
export interface Song {
  id: string;
  genre: Genre;
  title: string;
  artist: string;
  proficiency: number; // 1-5
  created_at: string;
  updated_at: string;
}

export interface CreateSongRequest {
  genre: Genre;
  title: string;
  artist: string;
  proficiency: number;
}

export interface UpdateSongRequest {
  genre?: Genre;
  title?: string;
  artist?: string;
  proficiency?: number;
}

export interface SongFilterParams {
  genre?: string;
  title?: string;
  artist?: string;
  proficiency?: number;
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface RecommendedSongResponse {
  success: boolean;
  data: {
    id: string;
    genre: Genre;
    title: string;
    artist: string;
    proficiency: number;
    created_at: string;
    updated_at: string;
  };
}

// 장르 타입 정의
export type Genre =
  | "K-POP"
  | "J-POP"
  | "POP"
  | "사극풍"
  | "신청곡"
  | "발라드/OST"
  | "트로트"
  | "뮤지컬"
  | "인디/락"
  | "기타";

// 장르별 색상 매핑
export const GENRE_COLORS: Record<Genre, string> = {
  "K-POP": "#ff6b6b",
  "J-POP": "#4ecdc4",
  POP: "#45b7d1",
  사극풍: "#96ceb4",
  신청곡: "#feca57",
  "발라드/OST": "#ff9ff3",
  트로트: "#54a0ff",
  뮤지컬: "#5f27cd",
  "인디/락": "#ff9f43",
  기타: "#8395a7",
};
