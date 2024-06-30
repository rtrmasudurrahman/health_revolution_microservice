import { z } from "zod";

export const TodoSchema = z.object({
  id: z.number().optional(),
  title: z.string().nonempty(),
  completed: z.boolean().optional(),
  color: z.string().optional(),
});
export type TodoDTO = z.infer<typeof TodoSchema>;

export const UpdateTodoSchema = z.object({
  title: z.string().optional(),
  completed: z.boolean().optional(),
  color: z.string().optional(),
});

export type UpdateTodoDTO = z.infer<typeof UpdateTodoSchema>;

export const GetTodosQuerySchema = z.object({
  status: z.enum(["Incomplete", "Complete"]).optional(),
  colors: z.array(z.string()).optional(),
});

export type GetTodosQueryDTO = z.infer<typeof GetTodosQuerySchema>;

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
