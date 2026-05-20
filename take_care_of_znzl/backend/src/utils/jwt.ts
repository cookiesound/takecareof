import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { AuthPayload } from '../types/express';

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: `${env.tokenExpireDays}d`,
  });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, env.jwtSecret) as AuthPayload;
}
