import z from 'zod'

const envSchema = z.object({
  PORT: z.string().default("5000"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  GROQUERY_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);

