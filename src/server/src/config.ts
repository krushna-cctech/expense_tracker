/** Server configuration loaded from environment variables. */
import 'dotenv/config';

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  mongoUri: required(
    'MONGODB_URI',
    process.env.NODE_ENV === 'production'
      ? undefined
      : 'mongodb://localhost:27017/expense_tracker',
  ),
  jwtSecret: required(
    'JWT_SECRET',
    process.env.NODE_ENV === 'production' ? undefined : 'dev-insecure-secret',
  ),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  /** Comma-separated list of allowed client origins for CORS. */
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
} as const;
