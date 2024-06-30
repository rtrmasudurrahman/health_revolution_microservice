import prisma from "@/prisma";
import axios from "axios";
import { INVENTORY_URL } from "@/config";

export const getProductDetailsService = async (productId: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.inventoryId === null) {
      const { data: inventory } = await axios.post(
        `${INVENTORY_URL}/inventories`,
        {
          productId: product.id,
          sku: product.sku,
        }
      );
      console.log("Inventory created successfully", inventory.id);

      await prisma.product.update({
        where: { id: product.id },
        data: {
          inventoryId: inventory.id,
        },
      });
      console.log(
        "Product updated successfully with inventory id",
        inventory.id
      );

      return {
        ...product,
        inventoryId: inventory.id,
        stock: inventory.quantity || 0,
        stockStatus: inventory.quantity > 0 ? "In stock" : "Out of stock",
      };
    }

    // fetch inventory
    const { data: inventory } = await axios.get(
      `${INVENTORY_URL}/inventories/${product.inventoryId}`
    );

    return {
      ...product,
      stock: inventory.quantity || 0,
      stockStatus: inventory.quantity > 0 ? "In stock" : "Out of stock",
    };
  } catch (error) {
    console.log(error);
  }
};
