# Health Ping (Render Cold Start 방지)

Render 무료 플랜은 일정 시간 미사용 시 슬립됩니다. 외부 cron으로 주기적 ping을내면 cold start를 줄일 수 있습니다.

## cron-job.org 예시

- URL: `https://your-render-backend.onrender.com/health`
- Schedule: `*/10 * * * *` (10분마다)
- Method: GET

## GitHub Actions 예시 (선택)

`.github/workflows/health-ping.yml`을 추가하고 `BACKEND_URL` secret을 설정하세요.
