import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@db:5432/qrmaster?schema=public'),
  DIRECT_URL: z.string().optional(),
  NEXTAUTH_URL: z.string().default('http://localhost:3000'),
  NEXTAUTH_SECRET: z.string().default('development-secret-change-in-production'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  REDIS_URL: z.string().optional(),
  IP_SALT: z.string().default('development-salt-change-in-production'),
  ENABLE_DEMO: z.string().default('false'),
  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:3000'),
});

// During build, we might not have all env vars, so we'll use defaults
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || !process.env.DATABASE_URL;

export const env = isBuildTime 
  ? envSchema.parse({
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@db:5432/qrmaster?schema=public',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'development-secret-change-in-production',
      IP_SALT: process.env.IP_SALT || 'development-salt-change-in-production',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    })
  : envSchema.parse(process.env);