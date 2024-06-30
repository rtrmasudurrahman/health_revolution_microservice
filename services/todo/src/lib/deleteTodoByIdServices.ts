import prisma from "@/prisma";

export const deleteTodotById = async (todoId: string) => {
  // Check if the product exists
  const existingProduct = await prisma.todo.findUnique({
    where: { id: todoId },
  });

  if (!existingProduct) {
    throw new Error("Todo not found");
  }

  // If the product exists, delete it
  await prisma.todo.delete({
    where: { id: todoId },
  });

  return { message: "Todo deleted successfully" };
};
