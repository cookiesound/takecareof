import axios, { AxiosError, AxiosResponse } from "axios";
import { message } from "antd";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: "https://ggaebul-sticker-be.onrender.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 인증 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          message.error("인증이 필요합니다.");
          break;
        case 403:
          message.error("접근 권한이 없습니다.");
          break;
        case 404:
          message.error("요청한 리소스를 찾을 수 없습니다.");
          break;
        case 500:
          message.error("서버 오류가 발생했습니다.");
          break;
        default:
          message.error("오류가 발생했습니다.");
      }
    } else if (error.request) {
      message.error("네트워크 오류가 발생했습니다.");
    } else {
      message.error("요청 설정 중 오류가 발생했습니다.");
    }

    return Promise.reject(error);
  }
);

export default api;
