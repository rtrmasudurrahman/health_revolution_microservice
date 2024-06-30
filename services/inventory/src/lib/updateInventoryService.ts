import prisma from "@/prisma";
import { InventoryUpdateDTO } from "@/schemas";

export const updateInventoryService = async (
  id: string,
  data: InventoryUpdateDTO
) => {
  // check if the inventory exists
  const inventory = await prisma.inventory.findUnique({
    where: { id },
  });

  if (!inventory) {
    return { message: "inventory not found" };
  }

  // find the last history
  const lastHistory = await prisma.history.findFirst({
    where: { inventoryId: id },
    orderBy: { createdAt: "desc" },
  });

  // calculate the new quantity
  let newQuantity = inventory.quantity;
  if (data.actionType === "IN") {
    newQuantity += data.quantity;
  } else if (data.actionType === "OUT") {
    newQuantity -= data.quantity;
  } else {
    throw new Error("Invalid action type");
  }

  // update the inventory
  const updatedInventory = await prisma.inventory.update({
    where: { id },
    data: {
      quantity: newQuantity,
      histories: {
        create: {
          actionType: data.actionType,
          quantityChanged: data.quantity,
          lastQuantity: lastHistory?.newQuantity || 0,
          newQuantity,
        },
      },
    },
    select: {
      id: true,
      quantity: true,
    },
  });

  return updatedInventory;
};
