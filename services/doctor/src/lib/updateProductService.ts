import prisma from "@/prisma";
import { DoctorUpdateDTO } from "@/schemas";

export const updateProductService = async (
  productId: string,
  data: DoctorUpdateDTO
) => {
  try {
    // find the product exists
    const product = await prisma.doctor.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return { message: "Product not found!" };
    }

    // Update the product
    const updatedProduct = await prisma.doctor.update({
      where: {
        id: productId,
      },
      data,
    });

    return updatedProduct;
  } catch (error) {
    console.error(error);
  }
};
