import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/** 쉼표로 구분된 CLIENT_URL → CORS 허용 origin 목록 (앞뒤 공백 제거) */
function parseClientUrls(raw: string | undefined): string[] {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return ['http://localhost:5173'];
  }
  return trimmed
    .split(',')
    .map((o) => o.trim())
    .filter((o) => o.length > 0);
}

const clientUrls = parseClientUrls(process.env.CLIENT_URL);

export const env = {
  port: Number(process.env.PORT ?? 5000),
  supabaseUrl: requireEnv('SUPABASE_URL'),
  supabaseServiceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  jwtSecret: requireEnv('JWT_SECRET'),
  tokenExpireDays: Number(process.env.TOKEN_EXPIRE_DAYS ?? 7),
  /** 허용된 프론트 origin 목록 (CORS) */
  clientUrls,
  /** 첫 번째 origin (배포·문서용 레거시 단일 값) */
  clientUrl: clientUrls[0] ?? 'http://localhost:5173',
  isDev: process.env.NODE_ENV !== 'production',
};
