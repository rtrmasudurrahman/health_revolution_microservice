import { z } from "zod";

export const UserCreateSchema = z.object({
  authUserId: z.string(),
  name: z.string(),
  email: z.string().email(),
  address: z.string().optional(),
  phone: z.string().optional(),
});
export type UserCreateDTO = z.infer<typeof UserCreateSchema>;

export const UserUpdatechema = UserCreateSchema.omit({
  authUserId: true,
}).partial();

export const PaginationSchema = z.object({
  page: z
    .string()
    .transform(val => Number(val))
    .default("1"),
  limit: z
    .string()
    .transform(val => Number(val))
    .default("10"),
  order: z.enum(["asc", "desc"]).default("asc"),
  orderBy: z.string().default("createdAt"),
  search: z.string().default(" ").optional(),
  fields: z.string().optional(),
});

export type Pagination = z.infer<typeof PaginationSchema>;
