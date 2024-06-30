import { Status } from "@prisma/client";
import { z } from "zod";

export const DoctorCreateDTOSchema = z.object({
  sku: z.string().min(3).max(100),
  name: z.string().min(3).max(255),
  description: z.string().max(1000).optional(),
  price: z.number().optional().default(0),
  status: z.nativeEnum(Status).optional().default(Status.DRAFT),
});

export type DoctorCreateDTO = z.infer<typeof DoctorCreateDTOSchema>;

export const DoctorUpdateDTOSchema = DoctorCreateDTOSchema.omit({
  sku: true,
}).partial();

export type DoctorUpdateDTO = z.infer<typeof DoctorUpdateDTOSchema>;

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
