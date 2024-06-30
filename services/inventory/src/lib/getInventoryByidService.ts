import prisma from "@/prisma";

export const getInventoryByIdService = async (id: string) => {
  return await prisma.inventory.findUnique({
    where: { id },
    select: {
      quantity: true,
    },
  });
};
