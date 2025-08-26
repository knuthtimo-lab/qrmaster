import { z } from 'zod';

// Define a more flexible schema for build time
const buildTimeSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  NEXTAUTH_URL: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  REDIS_URL: z.string().optional(),
  IP_SALT: z.string().optional(),
  ENABLE_DEMO: z.string().default('false'),
  NEXT_PUBLIC_APP_URL: z.string().optional(),
});

// Define a strict schema for runtime
const runtimeSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string().optional(),
  NEXTAUTH_URL: z.string(),
  NEXTAUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  REDIS_URL: z.string().optional(),
  IP_SALT: z.string(),
  ENABLE_DEMO: z.string().default('false'),
  NEXT_PUBLIC_APP_URL: z.string(),
});

// Check if we're in build time
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                   process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL;

export const env = isBuildTime 
  ? buildTimeSchema.parse({
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: process.env.PORT || '3000',
      DATABASE_URL: process.env.DATABASE_URL,
      DIRECT_URL: process.env.DIRECT_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'development-secret-change-in-production',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      REDIS_URL: process.env.REDIS_URL,
      IP_SALT: process.env.IP_SALT || 'development-salt-change-in-production',
      ENABLE_DEMO: process.env.ENABLE_DEMO || 'false',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    })
  : runtimeSchema.parse(process.env);