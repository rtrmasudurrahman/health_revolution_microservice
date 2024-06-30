import prisma from "@/prisma";
import { InventoryCreateDTO } from "@/schemas";

export const createInventoryService = async (data: InventoryCreateDTO) => {
  // Validate input data
  try {
    const existingInventory = await prisma.inventory.findFirst({
      where: {
        sku: data.sku,
      },
    });
    if (existingInventory) {
      return { message: "Invnetory with the same sku already exists" };
    }
    // Create inventory
    const inventory = await prisma.inventory.create({
      data: {
        ...data,
        histories: {
          create: {
            actionType: "IN",
            quantityChanged: data.quantity,
            lastQuantity: 0,
            newQuantity: data.quantity,
          },
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    });

    return inventory;
  } catch (error) {}
};
