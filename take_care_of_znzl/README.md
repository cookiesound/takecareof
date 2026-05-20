# 즈니를 돌봐줘 (Take Care of Znzl)

React + Node.js 모노레포 육성 웹게임 프로젝트입니다.

## 구조

```txt
project-root/
  frontend/   # React + Vite (Vercel)
  backend/    # Express + TypeScript (Render)
  supabase/   # DB 스키마
```

## 기술 스택

| 영역 | 스택 |
|------|------|
| Frontend | React, TypeScript, Vite, Ant Design, SCSS, Zustand, React Router, Axios |
| Backend | Node.js, Express, TypeScript, JWT, bcryptjs, Supabase |
| DB | Supabase PostgreSQL |

## 시작하기

### 1. Supabase 설정

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 실행
3. Project Settings → API에서 URL과 `service_role` 키 복사

### 2. Backend

```bash
cd backend
cp .env.example .env
# .env 파일에 Supabase, JWT_SECRET 등 입력
npm install
npm run seed:admin   # 관리자 계정 생성 (admin / 1234)
npm run dev
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:5000
npm install
npm run dev
```

## 환경변수

### frontend/.env

```env
VITE_API_BASE_URL=https://your-render-backend.onrender.com
```

### backend/.env

```env
PORT=5000
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
TOKEN_EXPIRE_DAYS=7
CLIENT_URL=https://your-vercel-domain.vercel.app
```

> `service_role_key`는 **backend에서만** 사용합니다. frontend에 넣지 마세요.

## 배포

### Frontend (Vercel)

- Root Directory: `frontend`
- Environment: `VITE_API_BASE_URL`

### Backend (Render)

- Root Directory: `backend`
- Build: `npm install && npm run build`
- Start: `npm start`
- Health Check Path: `/health`

### Render 무료 플랜 Cold Start

앱 진입 시 `/health`를 호출해 서버를 깨웁니다.  
추가로 [cron-job.org](https://cron-job.org) 등에서 5~10분마다 `GET /health`를 호출하면 cold start를 줄일 수 있습니다.

## API

| Method | Path | 설명 |
|--------|------|------|
| GET | /health | 헬스체크 |
| POST | /auth/register | 회원가입 |
| POST | /auth/login | 로그인 |
| GET | /auth/me | 내 정보 |
| POST | /auth/logout | 로그아웃 |
| GET | /game/me | 게임 상태 |
| POST | /game/activity | 활동 |
| POST | /game/sticker-request | 스티커 신청 |
| GET | /admin/users | 유저 목록 (admin) |
| POST | /admin/sticker-complete | 스티커 처리 (admin) |

## 관리자 계정

```txt
닉네임: admin
비밀번호: 1234
```

`npm run seed:admin`으로 생성/갱신합니다.

## 게임 규칙 요약

- 레벨 0 시작, EXP 100마다 레벨업 (초과 이월)
- 하루 활동력 3 (서버 날짜 기준 충전)
- 활동 시 랜덤 EXP 20~50
- 레벨 10 달성 시 스티커 신청 가능 (신청 후 레벨/EXP 초기화)

## 스크립트

```bash
# Backend
npm run dev          # 개발 서버
npm run build        # 빌드
npm run seed:admin   # 관리자 시드

# Frontend
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run lint         # ESLint
```
