import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(3000),

  DATABASE_URL: z
    .string()
    .url()
    .refine(
      (value) =>
        value.startsWith("postgresql://") ||
        value.startsWith("postgres://"),
      "Must be a PostgreSQL URL"
    ),

  JWT_ACCESS_SECRET: z
    .string()
    .min(32, "JWT secret must be at least 32 characters"),

  JWT_ISSUER: z.string().min(1),

  JWT_AUDIENCE: z.string().min(1),

  FRONTEND_ORIGIN: z
    .string()
    .url()
    .refine((value) => {
      const url = new URL(value);
      return (
        !url.username &&
        !url.password &&
        url.pathname === "/" &&
        !url.search &&
        !url.hash
      );
    }, "Must be an origin, without a path or credentials"),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(
  config: Record<string, unknown>
): EnvConfig {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    // Don't print raw input values: they may contain secrets.
    const fields = result.error.issues.map(
      (issue) =>
        `${issue.path.join(".")}: ${issue.message}`
    );

    throw new Error(
      `Invalid environment configuration:\n${fields.join("\n")}`
    );
  }

  return result.data;
}