// Import the 'zod' library for schema validation
import { z } from "zod";

// Define a schema for user creation using zod
export const UserCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
  name: z.string().min(3).max(255),
});

// Infer the TypeScript type for user creation from the schema
export type UserCreateDTO = z.infer<typeof UserCreateSchema>;

// Define a schema for user login using zod
export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Infer the TypeScript type for user login from the schema
export type UserLoginDTO = z.infer<typeof UserLoginSchema>;

// Define a schema for access token using zod
export const AccessTokenSchema = z.object({
  accessToken: z.string(),
});

// Define a schema for email verification using zod
export const EmailVerificationSchema = z.object({
  email: z.string().email(),
  code: z.string(),
});

// Infer the TypeScript type for email verification from the schema
export type EmailVerificationDTO = z.infer<typeof EmailVerificationSchema>;
