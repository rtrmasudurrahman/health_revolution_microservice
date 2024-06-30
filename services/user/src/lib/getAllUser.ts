import prisma from "@/prisma";
import { Pagination } from "@/schemas";

// get tickets
export const getAllUserService = async (pagination: Pagination) => {
  return prisma.user.findMany({
    skip: (pagination.page - 1) * pagination.limit,
    take: pagination.limit,
    orderBy: {
      [pagination.orderBy]: pagination.order,
    },
    where: {
      OR: [
        {
          name: {
            contains: pagination.search || "",
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: pagination.search || "",
            mode: "insensitive",
          },
        },
      ],
    },
    select: pagination?.fields?.split(",")?.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {}),
  });
};
