import prisma from "@/prisma";
import { ProductUpdateDTO } from "@/schemas";

export const updateProductService = async (
  productId: string,
  data: ProductUpdateDTO
) => {
  try {
    // find the product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return { message: "Product not found!" };
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data,
    });
    const response = {
      code: 201,
      status: "success",
      message: "Product updated successfully",
      data: updatedProduct,
    };
    return response;
  } catch (error) {
    console.error(error);
  }
};
