// src/services/todoService.ts
import { PrismaClient } from "@prisma/client";
import { GetTodosQueryDTO } from "@/schemas";

const prisma = new PrismaClient();

export const getAllTodosService = async (query: GetTodosQueryDTO) => {
  const whereClause: any = {};

  if (query.status) {
    whereClause.completed = query.status === "Complete";
  }

  if (query.colors && query.colors.length > 0) {
    whereClause.color = {
      in: query.colors,
    };
  }

  const todos = await prisma.todo.findMany({
    where: whereClause,
    orderBy: {
      id: "desc",
    },
  });

  return todos;
};
