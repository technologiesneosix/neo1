import { z } from 'zod';

// Frontend environment validation
export const frontendEnvSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_APP_NAME: z.string().min(1),
  VITE_APP_URL: z.string().url(),
});

// Note: TypeScript type exports removed for JavaScript compatibility
// export type FrontendEnv = z.infer<typeof frontendEnvSchema>;

// Admin environment validation
export const adminEnvSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_APP_NAME: z.string().min(1),
  VITE_APP_URL: z.string().url(),
});

// Note: TypeScript type exports removed for JavaScript compatibility
// export type AdminEnv = z.infer<typeof adminEnvSchema>;

// Backend environment validation
export const backendEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default('5000'),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRE: z.string().default('15m'),
  JWT_REFRESH_EXPIRE: z.string().default('7d'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  FRONTEND_URL: z.string().url(),
  ADMIN_URL: z.string().url(),
});

// Note: TypeScript type exports removed for JavaScript compatibility
// export type BackendEnv = z.infer<typeof backendEnvSchema>;

// Validation function
export const validateEnv = (schema, env) => {
  const result = schema.safeParse(env);
  if (!result.success) {
    const errors = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }
  return result.data;
};
