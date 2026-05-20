import { atom } from "jotai";
import { User } from "../types";

// 사용자 목록 상태
export const usersAtom = atom<User[]>([]);

// 선택된 사용자 상태
export const selectedUserAtom = atom<User | null>(null);

// 페이지네이션 상태
export const paginationAtom = atom({
  current: 1,
  pageSize: 10,
  total: 0,
});

// 로딩 상태
export const loadingAtom = atom(false);

// 모달 상태
export const modalAtom = atom({
  userDetail: false,
  userForm: false,
  passwordCheck: false,
});
