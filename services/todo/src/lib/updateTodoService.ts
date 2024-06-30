import prisma from "@/prisma";
import { UpdateTodoDTO } from "@/schemas";

export const updateTodoService = async (
  toddoId: string,
  data: UpdateTodoDTO
) => {
  try {
    // find the product exists
    const todo = await prisma.todo.findUnique({
      where: {
        id: toddoId,
      },
    });

    if (!todo) {
      return { message: "Product not found!" };
    }

    // Update the product
    const updateTodo = await prisma.todo.update({
      where: {
        id: toddoId,
      },
      data,
    });
    const response = {
      code: 201,
      status: "success",
      message: "Todo updated successfully",
      data: updateTodo,
    };
    return response;
  } catch (error) {
    console.error(error);
  }
};
