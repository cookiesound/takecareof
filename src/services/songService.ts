import api from "../utils/axios";
import {
  Song,
  CreateSongRequest,
  UpdateSongRequest,
  SongFilterParams,
  PaginatedResponse,
  Genre,
  RecommendedSongResponse,
} from "../types";

export const songService = {
  // 노래 목록 조회 (필터링 포함)
  getSongs: async (
    params: SongFilterParams = {}
  ): Promise<PaginatedResponse<Song>> => {
    try {
      const response = await api.get("/songs", { params });
      return response.data;
    } catch (error) {
      console.error("노래 목록 조회 실패:", error);
      // 백엔드 API가 준비되지 않은 경우를 위한 fallback
      return {
        data: [],
        pagination: {
          page: 1,
          totalPages: 0,
          totalItems: 0,
          limit: 10,
        },
      };
    }
  },

  // 노래 상세 조회
  getSong: async (id: string): Promise<Song> => {
    try {
      const response = await api.get(`/songs/${id}`);
      return response.data;
    } catch (error) {
      console.error("노래 상세 조회 실패:", error);
      throw new Error("노래를 찾을 수 없습니다.");
    }
  },

  // 노래 생성
  createSong: async (data: CreateSongRequest): Promise<Song> => {
    try {
      const response = await api.post("/songs", data);
      return response.data;
    } catch (error) {
      console.error("노래 생성 실패:", error);
      throw new Error("노래 생성에 실패했습니다.");
    }
  },

  // 노래 수정
  updateSong: async (id: string, data: UpdateSongRequest): Promise<Song> => {
    try {
      const response = await api.put(`/songs/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("노래 수정 실패:", error);
      throw new Error("노래 수정에 실패했습니다.");
    }
  },

  // 노래 삭제
  deleteSong: async (id: string): Promise<void> => {
    try {
      await api.delete(`/songs/${id}`);
    } catch (error) {
      console.error("노래 삭제 실패:", error);
      throw new Error("노래 삭제에 실패했습니다.");
    }
  },

  // 장르 목록 조회
  getGenres: async (): Promise<Genre[]> => {
    try {
      const response = await api.get("/songs/genres");
      return response.data;
    } catch (error) {
      console.error("장르 목록 조회 실패:", error);
      // 백엔드 API가 준비되지 않은 경우를 위한 fallback
      return [
        "K-POP",
        "J-POP",
        "POP",
        "사극풍",
        "신청곡",
        "발라드/OST",
        "트로트",
        "뮤지컬",
        "인디/락",
        "기타",
      ];
    }
  },

  // 자동 추천 노래 조회
  getRecommendedSong: async (): Promise<RecommendedSongResponse> => {
    try {
      // 3초 지연을 위한 Promise
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const response = await api.get("/songs/random");
      return response.data;
    } catch (error) {
      console.error("추천 노래 조회 실패:", error);
      throw new Error("추천 노래를 가져오는데 실패했습니다.");
    }
  },
};
