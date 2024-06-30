import prisma from "@/prisma";
import { TodoDTO } from "@/schemas";

export const createTodoService = async (id: string, todoData: TodoDTO) => {
  try {
    // Create todo
    const newTodo = await prisma.todo.create({
      data: {
        id,
        title: todoData.title,
        completed: todoData.completed,
        color: todoData.color,
      },
    });

    // Return the newly created todo
    return newTodo;
  } catch (error) {
    throw error;
  }
};
