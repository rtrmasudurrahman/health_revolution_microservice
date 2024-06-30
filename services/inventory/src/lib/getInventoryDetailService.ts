import prisma from "@/prisma";

export const getInventoryById = async (id: string) => {
  const inventory = await prisma.inventory.findUnique({
    where: { id },
    include: {
      histories: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return inventory;
};
