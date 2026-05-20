import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  supabaseUrl: requireEnv('SUPABASE_URL'),
  supabaseServiceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  jwtSecret: requireEnv('JWT_SECRET'),
  tokenExpireDays: Number(process.env.TOKEN_EXPIRE_DAYS ?? 7),
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  isDev: process.env.NODE_ENV !== 'production',
};
