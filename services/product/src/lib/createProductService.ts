// src/services/productService.ts
import prisma from "@/prisma";
import axios from "axios";
import { INVENTORY_URL } from "@/config";
import { ProductCreateDTO } from "@/schemas";

export const createProductService = async (productData: ProductCreateDTO) => {
  try {
    // Check if product with the same sku already exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        sku: productData.sku,
      },
    });

    if (existingProduct) {
      return { message: "Product with the same sku already exists" };
    }

    // Create product
    const product = await prisma.product.create({
      data: productData,
    });
    console.log("Product created successfully", product.id);

    // Create inventory record for the product
    const { data: inventory } = await axios.post(
      `${INVENTORY_URL}/inventories`,
      {
        productId: product.id,
        sku: product.sku,
      }
    );
    console.log("Inventory created successfully", inventory.id);

    // Update product and store inventory id
    await prisma.product.update({
      where: { id: product.id },
      data: {
        inventoryId: inventory.id,
      },
    });
    console.log("Product updated successfully with inventory id", inventory.id);
    const response = {
      code: 201,
      status: "success",
      message: "Product created successfully",
      data: product,
      inventoryId: inventory.id,
    };
    return response;
  } catch (error) {
    throw error;
  }
};
