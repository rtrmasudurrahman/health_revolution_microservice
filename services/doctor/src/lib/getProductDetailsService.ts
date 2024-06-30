import prisma from "@/prisma";
import axios from "axios";
import { INVENTORY_URL } from "@/config";

export const getProductDetailsService = async (productId: string) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: productId },
    });

    if (!doctor) {
      throw new Error("Product not found");
    }

    if (doctor.inventoryId === null) {
      const { data: inventory } = await axios.post(
        `${INVENTORY_URL}/inventories`,
        {
          productId: doctor.id,
          sku: doctor.sku,
        }
      );
      console.log("Inventory created successfully", inventory.id);

      await prisma.doctor.update({
        where: { id: doctor.id },
        data: {
          inventoryId: inventory.id,
        },
      });
      console.log(
        "Product updated successfully with inventory id",
        inventory.id
      );

      return {
        ...doctor,
        inventoryId: inventory.id,
        stock: inventory.quantity || 0,
        stockStatus: inventory.quantity > 0 ? "In stock" : "Out of stock",
      };
    }

    // fetch inventory
    const { data: inventory } = await axios.get(
      `${INVENTORY_URL}/inventories/${doctor.inventoryId}`
    );

    return {
      ...doctor,
      stock: inventory.quantity || 0,
      stockStatus: inventory.quantity > 0 ? "In stock" : "Out of stock",
    };
  } catch (error) {
    console.log(error);
  }
};
