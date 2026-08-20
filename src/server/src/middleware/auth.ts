/** JWT authentication middleware. Attaches the authenticated userId to req. */
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '@expense-tracker/shared';
import { config } from '../config.js';
import { HttpError } from './error.js';

// Augment Express Request with the authenticated user id.
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

export function signToken(userId: string): string {
  const options: jwt.SignOptions = {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ userId } satisfies JwtPayload, config.jwtSecret, options);
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new HttpError(401, 'Authentication required');
  }
  const token = header.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.userId = payload.userId;
    next();
  } catch {
    throw new HttpError(401, 'Invalid or expired token');
  }
};
