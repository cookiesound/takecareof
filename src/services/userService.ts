import api from "../utils/axios";
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  PaginatedResponse,
  PaginationParams,
  Wish,
  CreateWishRequest,
  FulfillWishRequest,
} from "../types";

export const userService = {
  // 사용자 목록 조회
  getUsers: async (
    params: PaginationParams
  ): Promise<PaginatedResponse<User>> => {
    const response = await api.get("/users", { params });
    return response.data;
  },

  // 사용자 상세 조회
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // 사용자 생성
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const requestData = {
      nickname: userData.nickname,
      sticker_count: userData.sticker_count || 0,
    };
    const response = await api.post("/users", requestData);
    return response.data;
  },

  // 사용자 수정
  updateUser: async (
    id: string,
    userData: UpdateUserRequest
  ): Promise<User> => {
    const requestData: any = {};
    if (userData.nickname !== undefined)
      requestData.nickname = userData.nickname;
    if (userData.sticker_count !== undefined)
      requestData.sticker_count = userData.sticker_count;

    const response = await api.put(`/users/${id}`, requestData);
    return response.data;
  },

  // 사용자 삭제
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // 스티커 개수 증가
  incrementStickerCount: async (id: string): Promise<User> => {
    const response = await api.post(`/users/${id}/increment-sticker`);
    return response.data;
  },

  // 소원 목록 조회
  getWishes: async (): Promise<Wish[]> => {
    const response = await api.get("/wishes");
    return response.data;
  },

  // 소원 생성
  createWish: async (wishData: CreateWishRequest): Promise<Wish> => {
    const response = await api.post("/wishes", wishData);
    return response.data;
  },

  // 소원 성취
  fulfillWish: async (userId: string): Promise<void> => {
    await api.post(`/wishes/${userId}/fulfill`);
  },
};
